'use client';

import { useState } from 'react';
import * as exifr from 'exifr';

interface PhotoData {
    file: File;
    preview: string;
    description: string;
    dateTaken?: string;
    location?: string;
}

interface GalleryGroup {
    submissionGroupId: string;
    title: string;
    description?: string;
    submitterNames: string[];
    submittedAt: Date;
    totalCount: number;
}

interface AddPhotosModalProps {
    group: GalleryGroup;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddPhotosModal({ group, onClose, onSuccess }: AddPhotosModalProps) {
    const [photos, setPhotos] = useState<PhotoData[]>([]);
    const [submitterName, setSubmitterName] = useState('');
    const [submitterEmail, setSubmitterEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newPhotos: PhotoData[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const preview = URL.createObjectURL(file);

            // Extract EXIF metadata
            let dateTaken: string | undefined;
            let location: string | undefined;

            try {
                const exif = await exifr.parse(file, {
                    pick: ['DateTimeOriginal', 'CreateDate', 'DateTime', 'GPSLatitude', 'GPSLongitude']
                });

                if (exif) {
                    // Try to get date in order of preference
                    const exifDate = exif.DateTimeOriginal || exif.CreateDate || exif.DateTime;
                    if (exifDate) {
                        dateTaken = new Date(exifDate).toISOString();
                    }

                    // Get GPS coordinates if available
                    if (exif.GPSLatitude && exif.GPSLongitude) {
                        location = `${exif.GPSLatitude.toFixed(6)}, ${exif.GPSLongitude.toFixed(6)}`;
                    }
                }
            } catch (error) {
                console.error('Error extracting EXIF data:', error);
            }

            newPhotos.push({
                file,
                preview,
                description: '',
                dateTaken,
                location
            });
        }

        setPhotos([...photos, ...newPhotos]);
    };

    const removePhoto = (index: number) => {
        const newPhotos = [...photos];
        URL.revokeObjectURL(newPhotos[index].preview);
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

    const updatePhotoDescription = (index: number, description: string) => {
        const newPhotos = [...photos];
        newPhotos[index].description = description;
        setPhotos(newPhotos);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (photos.length === 0) {
            setError('Bitte fügen Sie mindestens ein Foto hinzu');
            return;
        }

        if (!submitterName) {
            setError('Bitte geben Sie Ihren Namen ein');
            return;
        }

        if (!submitterEmail) {
            setError('Bitte geben Sie Ihre E-Mail-Adresse ein');
            return;
        }

        setIsSubmitting(true);

        try {
            // Submit each photo to the existing group
            for (const photo of photos) {
                const reader = new FileReader();
                const imageData = await new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(photo.file);
                });

                const response = await fetch('/api/shared-gallery/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        submissionGroupId: group.submissionGroupId,
                        title: group.title,
                        description: photo.description || '',
                        submitterName,
                        submitterEmail,
                        imageData,
                        imageMimeType: photo.file.type,
                        imageFilename: photo.file.name,
                        dateTaken: photo.dateTaken,
                        location: photo.location
                    }),
                });

                if (!response.ok) {
                    throw new Error('Fehler beim Hochladen');
                }
            }

            onSuccess();
        } catch (error) {
            console.error('Error submitting photos:', error);
            setError('Fehler beim Hochladen der Fotos. Bitte versuchen Sie es erneut.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 pt-20">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[calc(100vh-8rem)] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Fotos hinzufügen
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Zu: <span className="font-semibold">{group.title}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ihr Name *
                        </label>
                        <input
                            type="text"
                            value={submitterName}
                            onChange={(e) => setSubmitterName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            placeholder="Max Mustermann"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ihre E-Mail-Adresse *
                        </label>
                        <input
                            type="email"
                            value={submitterEmail}
                            onChange={(e) => setSubmitterEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            placeholder="ihre.email@beispiel.de"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Zur Verifizierung und für Rückfragen
                        </p>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fotos auswählen *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                id="photo-upload"
                            />
                            <label htmlFor="photo-upload" className="cursor-pointer">
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-blue-600 font-medium">Fotos auswählen</span>
                                    <span className="text-sm text-gray-500">oder hierher ziehen</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Photo Previews */}
                    {photos.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Ausgewählte Fotos ({photos.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {photos.map((photo, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                        <div className="relative aspect-video bg-gray-200">
                                            <img
                                                src={photo.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="p-3 space-y-2">
                                            <div className="text-xs text-gray-600">
                                                <p className="font-medium truncate">
                                                    {photo.file.name} ({(photo.file.size / (1024 * 1024)).toFixed(2)} MB)
                                                </p>
                                                {photo.dateTaken && (
                                                    <p className="text-gray-500">
                                                        📅 {new Date(photo.dateTaken).toLocaleDateString('de-DE', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                )}
                                                {photo.location && (
                                                    <p className="text-gray-500">📍 {photo.location}</p>
                                                )}
                                            </div>
                                            <textarea
                                                value={photo.description}
                                                onChange={(e) => updatePhotoDescription(index, e.target.value)}
                                                placeholder="Beschreibung (optional)"
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={isSubmitting}
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || photos.length === 0}
                        >
                            {isSubmitting ? 'Wird hochgeladen...' : `${photos.length} Foto${photos.length !== 1 ? 's' : ''} hinzufügen`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
