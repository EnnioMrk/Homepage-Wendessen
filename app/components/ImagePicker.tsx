'use client';

import { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch('/api/admin/gallery');
            if (response.ok) {
                const data = await response.json();
                setImages(data.images || []);
            } else {
                setError('Fehler beim Laden der Bilder');
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            setError('Fehler beim Laden der Bilder');
        } finally {
            setLoading(false);
        }
    };

    const filteredImages = images.filter(
        (image) =>
            image.displayName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            image.originalName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImageSelect = (imageUrl: string) => {
        onImageSelect(imageUrl);
    };

    const handleRemoveSelection = () => {
        onImageSelect(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 mt-20 mb-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Bild aus Galerie wählen
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Bilder durchsuchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-500">
                                Bilder werden geladen...
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-red-500">{error}</div>
                        </div>
                    ) : filteredImages.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-500">
                                {searchTerm
                                    ? 'Keine Bilder gefunden'
                                    : 'Keine Bilder in der Galerie'}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredImages.map((image) => (
                                <div
                                    key={image.id}
                                    className={`relative aspect-square border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                                        selectedImageUrl === image.url
                                            ? 'border-blue-500 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleImageSelect(image.url)}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.displayName}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    />
                                    {selectedImageUrl === image.url && (
                                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                            <div className="bg-blue-500 text-white rounded-full p-1">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 truncate">
                                        {image.displayName}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        {filteredImages.length}{' '}
                        {filteredImages.length === 1 ? 'Bild' : 'Bilder'}{' '}
                        gefunden
                    </div>
                    <div className="flex space-x-2">
                        {selectedImageUrl && (
                            <button
                                onClick={handleRemoveSelection}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Auswahl entfernen
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {selectedImageUrl
                                ? 'Auswahl bestätigen'
                                : 'Schließen'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
