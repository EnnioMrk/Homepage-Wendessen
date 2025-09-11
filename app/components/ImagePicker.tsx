'use client';

import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Check } from 'lucide-react';
import Image from 'next/image';

interface GalleryImage {
    id: string;
    filename: string;
    originalName: string;
    displayName: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
}

interface ImagePickerProps {
    selectedImageUrl?: string;
    onImageSelect: (imageUrl: string | null) => void;
    onClose: () => void;
}

export default function ImagePicker({
    selectedImageUrl,
    onImageSelect,
    onClose,
}: ImagePickerProps) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/gallery');
            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }

            const data = await response.json();
            setImages(data.images || []);
        } catch (err) {
            console.error('Error fetching images:', err);
            setError('Fehler beim Laden der Bilder');
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (imageUrl: string) => {
        if (selectedImageUrl === imageUrl) {
            // Deselect if already selected
            onImageSelect(null);
        } else {
            onImageSelect(imageUrl);
        }
    };

    const handleClearSelection = () => {
        onImageSelect(null);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                            Bild aus Galerie wählen
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <span className="ml-3 text-gray-600">Lade Bilder...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                            Bild aus Galerie wählen
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchImages}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Erneut versuchen
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        Bild aus Galerie wählen
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Current Selection */}
                {selectedImageUrl && (
                    <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                                    <Image
                                        src={selectedImageUrl}
                                        alt="Ausgewähltes Bild"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Ausgewähltes Bild
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Klicken Sie &ldquo;Auswahl aufheben&rdquo; um kein Bild zu verwenden
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClearSelection}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                            >
                                Auswahl aufheben
                            </button>
                        </div>
                    </div>
                )}

                {/* No Images */}
                {images.length === 0 ? (
                    <div className="text-center py-12">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                            Keine Bilder in der Galerie gefunden
                        </p>
                        <p className="text-sm text-gray-500">
                            Laden Sie zuerst Bilder in die Galerie hoch, um sie für Termine verwenden zu können.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Instructions */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                Klicken Sie auf ein Bild um es auszuwählen. Das ausgewählte Bild wird in der Terminübersicht angezeigt.
                            </p>
                        </div>

                        {/* Image Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                        selectedImageUrl === image.url
                                            ? 'border-indigo-500 ring-2 ring-indigo-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleImageSelect(image.url)}
                                >
                                    <div className="aspect-square relative">
                                        <Image
                                            src={image.url}
                                            alt={image.displayName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    
                                    {/* Selection Indicator */}
                                    {selectedImageUrl === image.url && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>

                                    {/* Image Info */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <p className="text-white text-xs font-medium truncate">
                                            {image.displayName}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Schließen
                    </button>
                    {selectedImageUrl && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Auswahl bestätigen
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}