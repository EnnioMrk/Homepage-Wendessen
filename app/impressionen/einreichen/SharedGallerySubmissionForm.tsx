'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { Camera, X, Check, WarningCircle } from '@phosphor-icons/react';
import exifr from 'exifr';

interface PhotoData {
    file: File;
    preview: string;
    description: string;
    location?: string;
}

function parseDateInputToDate(dateValue: string): Date | undefined {
    if (!dateValue) return undefined;

    const [year, month, day] = dateValue.split('-').map(Number);

    if (!year || !month || !day) return undefined;

    return new Date(year, month - 1, day, 12, 0, 0);
}

export default function SharedGallerySubmissionForm() {
    const router = useRouter();
    const [commonData, setCommonData] = useState({
        generalTitle: '',
        submitterName: '',
        submitterEmail: '',
    });
    const [photos, setPhotos] = useState<PhotoData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [hasConsent, setHasConsent] = useState(false);
    const [socialConsent, setSocialConsent] = useState(false);
    const [collectionDateStart, setCollectionDateStart] = useState('');
    const [collectionDateEnd, setCollectionDateEnd] = useState('');
    const [hasDateRange, setHasDateRange] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validate all files
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Bitte wählen Sie nur Bilddateien aus');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError(`Die Datei "${file.name}" ist zu groß. Maximum: 10MB`);
                return;
            }
        }

        setError(null);

        // Create previews and add to photos array
        const newPhotos: PhotoData[] = [];
        let loaded = 0;

        for (const file of files) {
            try {
                // Extract EXIF data
                const exifData = await exifr.parse(file, {
                    pick: ['GPSLatitude', 'GPSLongitude'],
                });

                // Get location from GPS data
                let location: string | undefined;
                if (exifData?.GPSLatitude && exifData?.GPSLongitude) {
                    location = `${exifData.GPSLatitude.toFixed(
                        6
                    )}, ${exifData.GPSLongitude.toFixed(6)}`;
                }

                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPhotos.push({
                        file,
                        preview: reader.result as string,
                        description: '',
                        location,
                    });
                    loaded++;
                    if (loaded === files.length) {
                        setPhotos((prev) => [...prev, ...newPhotos]);
                    }
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error reading EXIF data:', error);
                // Still add photo without EXIF data
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPhotos.push({
                        file,
                        preview: reader.result as string,
                        description: '',
                    });
                    loaded++;
                    if (loaded === files.length) {
                        setPhotos((prev) => [...prev, ...newPhotos]);
                    }
                };
                reader.readAsDataURL(file);
            }
        }

        // Reset file input
        e.target.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!commonData.generalTitle.trim()) {
            setError('Bitte geben Sie einen Titel ein');
            return;
        }

        if (photos.length === 0) {
            setError('Bitte wählen Sie mindestens ein Foto aus');
            return;
        }

        if (!hasConsent) {
            setError('Bitte stimmen Sie den Bedingungen zu, um fortzufahren.');
            return;
        }

        if (!commonData.submitterName.trim()) {
            setError('Bitte geben Sie Ihren Namen an');
            return;
        }

        if (hasDateRange) {
            if (!collectionDateStart || !collectionDateEnd) {
                setError(
                    'Bitte geben Sie für den Zeitraum ein Start- und Enddatum an'
                );
                return;
            }

            if (collectionDateEnd < collectionDateStart) {
                setError('Das Enddatum darf nicht vor dem Startdatum liegen');
                return;
            }
        }

        const collectionDateTaken = parseDateInputToDate(collectionDateStart);
        const collectionDateRangeEnd = parseDateInputToDate(collectionDateEnd);

        setLoading(true);
        setError(null);

        try {
            // Generate a unique group ID for this submission
            const groupId = `sub_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`;

            // Submit each photo with the same group ID
            for (let i = 0; i < photos.length; i++) {
                const photo = photos[i];

                const response = await fetch('/api/shared-gallery/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        submissionGroupId: groupId,
                        title: commonData.generalTitle.trim(),
                        description: photo.description.trim() || undefined,
                        submitterName:
                            commonData.submitterName.trim() || undefined,
                        submitterEmail:
                            commonData.submitterEmail.trim() || undefined,
                        imageData: photo.preview,
                        imageMimeType: photo.file.type,
                        imageFilename: photo.file.name,
                        dateTaken: collectionDateTaken?.toISOString(),
                        dateTakenRangeEnd:
                            hasDateRange && collectionDateRangeEnd
                                ? collectionDateRangeEnd.toISOString()
                                : undefined,
                        location: photo.location,
                        socialConsent: socialConsent,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(
                        errorData.error ||
                            `Fehler beim Hochladen von Foto ${i + 1}`
                    );
                    setLoading(false);
                    return;
                }
            }

            // All successful
            setSuccess(true);
            setPhotos([]);
            setCommonData({
                generalTitle: '',
                submitterName: '',
                submitterEmail: '',
            });
            setHasConsent(false);
            setSocialConsent(false);
            setCollectionDateStart('');
            setCollectionDateEnd('');
            setHasDateRange(false);
        } catch (err) {
            console.error('Submission error:', err);
            setError('Fehler beim Einreichen der Fotos');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Vielen Dank!
                    </h3>
                    <p className="text-gray-700 mb-6">
                        Ihre Fotos wurden erfolgreich eingereicht und werden in
                        Kürze von unserem Team geprüft. Nach der Freigabe
                        erscheinen sie in unserer Impressionen-Galerie.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => setSuccess(false)}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Weitere Fotos einreichen
                        </button>
                        <button
                            onClick={() => router.push('/impressionen')}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                        >
                            Zur Galerie
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                    Neue Foto-Sammlung erstellen
                </h3>
                <button
                    type="button"
                    onClick={() =>
                        router.push('/impressionen/einreichen/erweitern')
                    }
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
                >
                    Zu bestehender Sammlung hinzufügen
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <WarningCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-red-800">{error}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setError(null)}
                        className="text-red-600 hover:text-red-800 ml-2"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* General Title */}
            <div className="mb-6">
                <label
                    htmlFor="generalTitle"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Titel *
                </label>
                <input
                    type="text"
                    id="generalTitle"
                    value={commonData.generalTitle}
                    onChange={(e) =>
                        setCommonData({
                            ...commonData,
                            generalTitle: e.target.value,
                        })
                    }
                    placeholder="z.B. Dorffest 2025, Winterlandschaft, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    maxLength={255}
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Dieser Titel gilt für{' '}
                    {photos.length === 0
                        ? 'Ihre'
                        : photos.length === 1
                        ? 'Ihr'
                        : `alle ${photos.length}`}{' '}
                    Foto{photos.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Collection Date */}
            <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-4">
                <div>
                    <label
                        htmlFor="collectionDateStart"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Aufnahmedatum der Sammlung (optional)
                    </label>
                    <input
                        type="date"
                        id="collectionDateStart"
                        value={collectionDateStart}
                        onChange={(e) => setCollectionDateStart(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Gilt für alle Fotos dieser Einreichung
                    </p>
                </div>

                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="hasDateRange"
                            type="checkbox"
                            checked={hasDateRange}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setHasDateRange(checked);
                                if (!checked) {
                                    setCollectionDateEnd('');
                                }
                            }}
                            className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label
                            htmlFor="hasDateRange"
                            className="font-medium text-gray-800"
                        >
                            Zeitraum statt einzelner Tag
                        </label>
                        <p className="text-gray-600 text-xs mt-1">
                            Aktivieren Sie dies, wenn die Fotos an mehreren
                            Tagen aufgenommen wurden.
                        </p>
                    </div>
                </div>

                {hasDateRange && (
                    <div>
                        <label
                            htmlFor="collectionDateEnd"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Enddatum *
                        </label>
                        <input
                            type="date"
                            id="collectionDateEnd"
                            value={collectionDateEnd}
                            onChange={(e) => setCollectionDateEnd(e.target.value)}
                            min={collectionDateStart || undefined}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        />
                    </div>
                )}
            </div>

            {/* Image Upload */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotos auswählen *
                </label>
                {photos.length === 0 ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Camera className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="mb-2 text-sm text-gray-600">
                                <span className="font-semibold">
                                    Klicken Sie hier
                                </span>{' '}
                                oder ziehen Sie Fotos hierher
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, WEBP (max. 10MB pro Foto)
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Mehrere Fotos auswählbar
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                ) : (
                    <div className="space-y-4">
                        {photos.map((photo, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                            >
                                <div className="flex gap-4">
                                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={photo.preview}
                                            alt={`Foto ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Beschreibung (optional)
                                            </label>
                                            <textarea
                                                value={photo.description}
                                                onChange={(e) => {
                                                    const newPhotos = [
                                                        ...photos,
                                                    ];
                                                    newPhotos[
                                                        index
                                                    ].description =
                                                        e.target.value;
                                                    setPhotos(newPhotos);
                                                }}
                                                placeholder="Beschreibung..."
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">
                                                📁 {photo.file.name} (
                                                {(
                                                    photo.file.size /
                                                    (1024 * 1024)
                                                ).toFixed(2)}{' '}
                                                MB)
                                            </p>
                                            {photo.location && (
                                                <p className="text-xs text-gray-500">
                                                    📍 GPS: {photo.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPhotos(
                                                photos.filter(
                                                    (_, i) => i !== index
                                                )
                                            );
                                        }}
                                        className="p-2 h-fit bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .querySelector<HTMLInputElement>(
                                        'input[type="file"]'
                                    )
                                    ?.click()
                            }
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Camera className="w-5 h-5" />
                            Weitere Fotos hinzufügen
                        </button>
                    </div>
                )}
            </div>

            {/* Submitter Name */}
            <div className="mb-6">
                <label
                    htmlFor="submitterName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Ihr Name *
                </label>
                <input
                    type="text"
                    id="submitterName"
                    value={commonData.submitterName}
                    onChange={(e) =>
                        setCommonData({
                            ...commonData,
                            submitterName: e.target.value,
                        })
                    }
                    placeholder="Max Mustermann"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    maxLength={255}
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Wird in der Galerie bei Ihren Fotos angezeigt, falls
                    freigegeben
                </p>
            </div>

            {/* Submitter Email */}
            <div className="mb-6">
                <label
                    htmlFor="submitterEmail"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    E-Mail (optional)
                </label>
                <input
                    type="email"
                    id="submitterEmail"
                    value={commonData.submitterEmail}
                    onChange={(e) =>
                        setCommonData({
                            ...commonData,
                            submitterEmail: e.target.value,
                        })
                    }
                    placeholder="max@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    maxLength={255}
                />
                <p className="text-xs text-gray-500 mt-1">
                    Wird nicht öffentlich angezeigt. Nur für Rückfragen.
                </p>
            </div>

            {/* Consent Checkboxes */}
            <div className="mb-6 space-y-4 rounded-lg bg-gray-50 p-4 border border-gray-200">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="consent"
                            name="consent"
                            type="checkbox"
                            checked={hasConsent}
                            onChange={(e) => setHasConsent(e.target.checked)}
                            className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label
                            htmlFor="consent"
                            className="font-medium text-gray-800"
                        >
                            Pflicht-Einwilligung zur Nutzung auf der Webseite *
                        </label>
                        <p className="text-gray-600 text-xs mt-1">
                            Ich habe die{' '}
                            <Link
                                href="/datenschutz"
                                className="text-purple-600 hover:text-purple-800 underline"
                                target="_blank"
                            >
                                rechtlichen Hinweise
                            </Link>{' '}
                            gelesen und bestätige, dass ich alle Rechte an den
                            Bildern besitze und die Zustimmung aller
                            abgebildeten Personen für die Veröffentlichung auf
                            dieser Webseite habe.
                        </p>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="socialConsent"
                            name="socialConsent"
                            type="checkbox"
                            checked={socialConsent}
                            onChange={(e) => setSocialConsent(e.target.checked)}
                            className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label
                            htmlFor="socialConsent"
                            className="font-medium text-gray-800"
                        >
                            Freiwillige Einwilligung für Social Media
                        </label>
                        <p className="text-gray-600 text-xs mt-1">
                            Ich bin damit einverstanden, dass die Bilder
                            zusätzlich auf den offiziellen Social-Media-Kanälen
                            des Dorfes geteilt werden dürfen. Mir sind die{' '}
                            <Link
                                href="/datenschutz#social-risks"
                                className="text-purple-600 hover:text-purple-800 underline"
                                target="_blank"
                            >
                                besonderen Risiken
                            </Link>{' '}
                            bewusst.
                        </p>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={
                        loading ||
                        photos.length === 0 ||
                        !commonData.generalTitle.trim() ||
                        !hasConsent ||
                        !commonData.submitterName.trim()
                    }
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <LoadingSpinner
                                size="sm"
                                color="white"
                                className="mr-2"
                            />
                            Wird eingereicht...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5 mr-2" />
                            {photos.length === 1
                                ? 'Foto einreichen'
                                : `${photos.length} Fotos einreichen`}
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/impressionen')}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                >
                    Abbrechen
                </button>
            </div>
        </form>
    );
}
