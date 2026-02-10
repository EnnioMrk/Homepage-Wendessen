import { useState, useEffect, useRef } from 'react';
import {
    MagnifyingGlass,
    X,
    UploadSimple,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

interface GalleryImage {
    id: string;
    url: string;
    displayName: string;
}

interface GalleryImagePickerProps {
    onSelect: (image: { id: string; url: string; displayName: string }) => void;
    onClose: () => void;
    canUpload?: boolean;
}

export default function GalleryImagePicker({
    onSelect,
    onClose,
    canUpload = false,
}: GalleryImagePickerProps) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch('/api/admin/gallery');
            if (response.ok) {
                const data = await response.json();
                setImages(data.images || []);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        const file = files[0]; // Simple single file upload for picker
        if (!file.type.startsWith('image/')) {
            alert('Bitte wählen Sie eine Bilddatei aus.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('displayName', file.name.replace(/\.[^/.]+$/, ''));

        try {
            const response = await fetch('/api/admin/gallery', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                // Add new image to list
                setImages((prev) => [data.image, ...prev]);
                // Clear search to show new image
                setSearchTerm('');
            } else {
                const err = await response.json();
                alert(err.error || 'Fehler beim Hochladen');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Fehler beim Hochladen');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const filteredImages = images.filter((img) =>
        img.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                        Bild aus Galerie wählen
                    </h3>
                    <div className="flex items-center space-x-2">
                        {canUpload && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                                <button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={uploading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <LoadingSpinner
                                            size="sm"
                                            color="white"
                                            className="mr-2"
                                        />
                                    ) : (
                                        <UploadSimple
                                            size={16}
                                            className="mr-2"
                                        />
                                    )}
                                    Hochladen
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-4 border-b">
                    <div className="relative">
                        <MagnifyingGlass
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Suchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <LoadingSpinner centered />
                    ) : filteredImages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Keine Bilder gefunden
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredImages.map((img) => (
                                <button
                                    key={img.id}
                                    onClick={() =>
                                        onSelect({
                                            id: img.id,
                                            url: img.url,
                                            displayName: img.displayName,
                                        })
                                    }
                                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 focus:outline-none focus:border-blue-500 group"
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.displayName}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate group-hover:bg-opacity-70">
                                        {img.displayName}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
