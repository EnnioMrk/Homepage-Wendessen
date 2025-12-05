'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { usePermissions } from '@/lib/usePermissions';
import {
    UploadSimple,
    MagnifyingGlass,
    ArrowsDownUp,
    PencilSimple,
    Trash,
    Eye,
    DownloadSimple,
    ArrowLeft,
    X,
    Check,
    WarningCircle,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import PromptDialog from '@/app/components/PromptDialog';

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

export default function AdminGallery() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { hasPermission } = usePermissions();

    // Check permissions
    const canUpload = hasPermission('gallery.upload');
    const canEdit = hasPermission('gallery.edit');
    const canDelete = hasPermission('gallery.delete');

    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('date');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(
        null
    );
    const [isRenaming, setIsRenaming] = useState(false);
    const [isRenamingLoading, setIsRenamingLoading] = useState(false);
    const [newName, setNewName] = useState('');
    const [uploadName, setUploadName] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(
        null
    );
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            // Validate all files
            for (const file of files) {
                if (!file.type.startsWith('image/')) {
                    setError('Bitte wählen Sie nur Bilddateien aus');
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    setError(
                        `Die Datei "${file.name}" ist zu groß. Maximum: 5MB`
                    );
                    return;
                }
            }

            setSelectedFiles(files);
            if (files.length === 1) {
                setUploadName(files[0].name.replace(/\.[^/.]+$/, '')); // Remove extension
            } else {
                setUploadName(''); // Clear name for multiple files
            }
            setShowUploadModal(true);
        }
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError('Bitte wählen Sie mindestens eine Datei aus');
            return;
        }

        if (selectedFiles.length === 1 && !uploadName.trim()) {
            setError('Bitte geben Sie einen Namen für das Bild ein');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const uploadedImages: GalleryImage[] = [];

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const formData = new FormData();
                formData.append('file', file);

                // For single file, use custom name; for multiple files, use original names
                const displayName =
                    selectedFiles.length === 1
                        ? uploadName.trim()
                        : file.name.replace(/\.[^/.]+$/, '');

                formData.append('displayName', displayName);

                const response = await fetch('/api/admin/gallery', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    uploadedImages.push(data.image);
                } else {
                    const errorData = await response.json();
                    setError(
                        errorData.error ||
                            `Fehler beim Hochladen von ${file.name}`
                    );
                    return;
                }
            }

            // Add all uploaded images to the list
            setImages((prev) => [...uploadedImages, ...prev]);
            setShowUploadModal(false);
            setSelectedFiles([]);
            setUploadName('');
        } catch (error) {
            console.error('Upload error:', error);
            setError('Fehler beim Hochladen der Bilder');
        } finally {
            setUploading(false);
        }
    };

    const handleRename = async (imageId: string, newDisplayName: string) => {
        if (!newDisplayName.trim()) {
            setError('Der Name darf nicht leer sein');
            return;
        }

        setIsRenamingLoading(true);
        try {
            const response = await fetch(`/api/admin/gallery/${imageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ displayName: newDisplayName.trim() }),
            });

            if (response.ok) {
                const data = await response.json();
                setImages((prev) =>
                    prev.map((img) => (img.id === imageId ? data.image : img))
                );
                setIsRenaming(false);
                setSelectedImage(null);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Fehler beim Umbenennen');
            }
        } catch (error) {
            console.error('Rename error:', error);
            setError('Fehler beim Umbenennen des Bildes');
        } finally {
            setIsRenamingLoading(false);
        }
    };

    const handleDelete = async (imageId: string) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/gallery/${imageId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setImages((prev) => prev.filter((img) => img.id !== imageId));
                setSelectedImage(null);
                setImageToDelete(null);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Fehler beim Löschen');
            }
        } catch (error) {
            console.error('Delete error:', error);
            setError('Fehler beim Löschen des Bildes');
        } finally {
            setIsDeleting(false);
        }
    };

    const sortedAndFilteredImages = images
        .filter((image) => {
            const matchesSearch =
                image.displayName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                image.originalName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            return matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.displayName
                        .toLowerCase()
                        .localeCompare(b.displayName.toLowerCase());
                case 'date':
                    return (
                        new Date(b.uploadedAt).getTime() -
                        new Date(a.uploadedAt).getTime()
                    );
                case 'updated':
                    // For now, use uploadedAt as updated date (can be enhanced later)
                    return (
                        new Date(b.uploadedAt).getTime() -
                        new Date(a.uploadedAt).getTime()
                    );
                default:
                    return 0;
            }
        });

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Galerie Verwaltung
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Bilder hochladen, verwalten und organisieren
                                </p>
                            </div>
                        </div>
                        {canUpload && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                            >
                                <UploadSimple size={16} className="mr-2" />
                                Bild hochladen
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Search and Sort Bar */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <MagnifyingGlass
                                    size={20}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Bilder durchsuchen..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                            </div>
                            <div className="relative">
                                <ArrowsDownUp
                                    size={20}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                    <option value="date">Nach Datum</option>
                                    <option value="name">Nach Name</option>
                                    <option value="updated">
                                        Nach Aktualisierung
                                    </option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                                <WarningCircle size={16} className="mr-2" />
                                {error}
                                <button
                                    onClick={() => setError(null)}
                                    className="ml-auto"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Gallery Grid */}
                    {loading ? (
                        <div className="bg-white shadow rounded-lg p-12 text-center">
                            <LoadingSpinner
                                size="lg"
                                text="Lade Bilder..."
                                centered
                            />
                        </div>
                    ) : sortedAndFilteredImages.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {sortedAndFilteredImages.map((image) => (
                                <div
                                    key={image.id}
                                    className="bg-white rounded-lg shadow-md group"
                                >
                                    <div className="p-3 pb-0">
                                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                                            <Image
                                                src={image.url}
                                                alt={image.displayName}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedImage(
                                                                image
                                                            )
                                                        }
                                                        className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {canEdit && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedImage(
                                                                    image
                                                                );
                                                                setNewName(
                                                                    image.displayName
                                                                );
                                                                setIsRenaming(
                                                                    true
                                                                );
                                                            }}
                                                            className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                                                        >
                                                            <PencilSimple
                                                                size={16}
                                                            />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() =>
                                                                setImageToDelete(
                                                                    image
                                                                )
                                                            }
                                                            className="p-2 bg-white rounded-full hover:bg-red-100 text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-3 pb-3">
                                        <h3 className="font-medium text-gray-900 truncate">
                                            {image.displayName}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatFileSize(image.size)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <UploadSimple size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Keine Bilder gefunden
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm
                                    ? 'Keine Bilder entsprechen Ihren Suchkriterien.'
                                    : 'Laden Sie Ihr erstes Bild hoch, um zu beginnen.'}
                            </p>
                            {!searchTerm && canUpload && (
                                <button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Erstes Bild hochladen
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {selectedFiles.length === 1
                                    ? 'Bild hochladen'
                                    : `${selectedFiles.length} Bilder hochladen`}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFiles([]);
                                    setUploadName('');
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {selectedFiles.length > 0 && (
                            <div className="mb-4">
                                {selectedFiles.length === 1 ? (
                                    <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={URL.createObjectURL(
                                                selectedFiles[0]
                                            )}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {selectedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden"
                                            >
                                                <Image
                                                    src={URL.createObjectURL(
                                                        file
                                                    )}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                                    {file.name.length > 15
                                                        ? file.name.substring(
                                                              0,
                                                              12
                                                          ) + '...'
                                                        : file.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedFiles.length === 1 && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bildname *
                                </label>
                                <input
                                    type="text"
                                    value={uploadName}
                                    onChange={(e) =>
                                        setUploadName(e.target.value)
                                    }
                                    placeholder="Name für das Bild eingeben..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    autoFocus
                                />
                            </div>
                        )}

                        {selectedFiles.length > 1 && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-sm text-blue-800">
                                    <strong>Hinweis:</strong> Bei mehreren
                                    Bildern werden die ursprünglichen Dateinamen
                                    verwendet.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFiles([]);
                                    setUploadName('');
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={
                                    uploading ||
                                    (selectedFiles.length === 1 &&
                                        !uploadName.trim()) ||
                                    selectedFiles.length === 0
                                }
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-400 flex items-center"
                            >
                                {uploading ? (
                                    <>
                                        <LoadingSpinner
                                            size="sm"
                                            color="white"
                                            className="mr-2"
                                        />
                                        Hochladen...
                                    </>
                                ) : (
                                    <>
                                        <UploadSimple
                                            size={16}
                                            className="mr-2"
                                        />
                                        {selectedFiles.length === 1
                                            ? 'Hochladen'
                                            : `${selectedFiles.length} Bilder hochladen`}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Detail Modal */}
            {selectedImage && !isRenaming && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 pb-4 pt-[66px] md:pt-[68px] lg:pt-[70px] z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-3xl mx-4 my-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {selectedImage.displayName}
                            </h3>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="relative w-full h-[50vh] bg-gray-100 rounded-2xl overflow-hidden">
                                <Image
                                    src={selectedImage.url}
                                    alt={selectedImage.displayName}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 60vw"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">
                                    Originalname:
                                </span>
                                <p className="text-gray-900">
                                    {selectedImage.originalName}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    Dateigröße:
                                </span>
                                <p className="text-gray-900">
                                    {formatFileSize(selectedImage.size)}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    Typ:
                                </span>
                                <p className="text-gray-900">
                                    {selectedImage.mimeType}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">
                                    Hochgeladen:
                                </span>
                                <p className="text-gray-900">
                                    {new Date(
                                        selectedImage.uploadedAt
                                    ).toLocaleDateString('de-DE')}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            {canEdit && (
                                <button
                                    onClick={() => {
                                        setNewName(selectedImage.displayName);
                                        setIsRenaming(true);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
                                >
                                    <PencilSimple size={16} className="mr-2" />
                                    Umbenennen
                                </button>
                            )}
                            <a
                                href={selectedImage.url}
                                download={selectedImage.displayName}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center"
                            >
                                <DownloadSimple size={16} className="mr-2" />
                                Herunterladen
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Rename Modal */}
            {selectedImage && isRenaming && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Bild umbenennen
                            </h3>
                            <button
                                onClick={() => {
                                    setIsRenaming(false);
                                    setSelectedImage(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Neuer Name
                            </label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setIsRenaming(false);
                                    setSelectedImage(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={() =>
                                    handleRename(selectedImage.id, newName)
                                }
                                disabled={isRenamingLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isRenamingLoading ? (
                                    <>
                                        <LoadingSpinner
                                            size="sm"
                                            color="white"
                                            className="mr-2"
                                        />
                                        Speichern...
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} className="mr-2" />
                                        Speichern
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <PromptDialog
                isOpen={Boolean(imageToDelete)}
                title="Bild löschen?"
                description={`Möchten Sie das Bild "${imageToDelete?.displayName}" wirklich löschen?`}
                detail="Diese Aktion kann nicht rückgängig gemacht werden."
                confirmText={isDeleting ? 'Löschen...' : 'Löschen'}
                cancelText="Abbrechen"
                onConfirm={() =>
                    imageToDelete && handleDelete(imageToDelete.id)
                }
                onCancel={() => setImageToDelete(null)}
                icon={<Trash className="h-7 w-7" weight="duotone" />}
                accentColor="red"
            />
        </div>
    );
}
