'use client';

import { useState } from 'react';
import {
    X,
    ImageSquare,
    UploadSimple,
    User,
    FileText,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';

interface PortraitSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function PortraitSubmissionModal({
    isOpen,
    onClose,
    onSuccess,
}: PortraitSubmissionModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        email: '',
    });

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Bitte wählen Sie eine Bilddatei aus.');
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Die Datei ist zu groß. Maximale Größe: 5MB');
                return;
            }

            setSelectedFile(file);

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedFile) {
            alert('Bitte wählen Sie ein Bild aus.');
            return;
        }

        if (!formData.name.trim() || !formData.description.trim()) {
            alert('Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }

        setIsLoading(true);

        try {
            const submitData = new FormData();
            submitData.append('image', selectedFile);
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('email', formData.email);

            const response = await fetch('/api/portraits', {
                method: 'POST',
                body: submitData,
            });

            if (response.ok) {
                // Reset form
                setFormData({ name: '', description: '', email: '' });
                setSelectedFile(null);
                setPreviewUrl(null);

                onClose();
                if (onSuccess) {
                    onSuccess();
                }

                alert(
                    'Vielen Dank für Ihre Einreichung! Wir werden uns bald bei Ihnen melden.'
                );
            } else {
                const errorData = await response.json();
                alert(
                    `Fehler beim Senden: ${
                        errorData.message || 'Unbekannter Fehler'
                    }`
                );
            }
        } catch (error) {
            console.error('Error submitting portrait:', error);
            alert('Fehler beim Senden. Bitte versuchen Sie es später erneut.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setFormData({ name: '', description: '', email: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="flex items-start justify-center min-h-screen pt-24 pb-8 px-4">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={handleClose}
                ></div>

                <div className="relative bg-white rounded-xl shadow-xl transform transition-all w-full max-w-2xl h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col h-full"
                    >
                        {/* Fixed Header */}
                        <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0 rounded-t-xl">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Portrait einreichen
                                    </h3>
                                    <p className="text-gray-600">
                                        Teilen Sie Ihre Geschichte mit der
                                        Dorfgemeinschaft
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed flex-shrink-0 ml-4"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="space-y-6">
                                {/* Image Upload Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                        <ImageSquare className="w-4 h-4 inline mr-1" />
                                        Ihr Foto *
                                    </label>

                                    {previewUrl ? (
                                        <div className="relative mx-auto w-2/3 sm:w-1/3">
                                            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 relative">
                                                <Image
                                                    src={previewUrl}
                                                    alt="Vorschau"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (previewUrl)
                                                        URL.revokeObjectURL(
                                                            previewUrl
                                                        );
                                                    setSelectedFile(null);
                                                    setPreviewUrl(null);
                                                }}
                                                disabled={isLoading}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:cursor-not-allowed"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative mx-auto w-2/3 sm:w-1/3">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                disabled={isLoading}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                            />
                                            <div className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-green-400 transition-colors">
                                                <UploadSimple className="w-12 h-12 text-gray-400 mb-2" />
                                                <p className="text-gray-600 text-center">
                                                    <span className="font-medium text-green-600">
                                                        Klicken Sie hier
                                                    </span>{' '}
                                                    um ein Bild auszuwählen
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    JPG, PNG oder GIF bis 5MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Ihr Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Wie sollen wir Sie nennen?"
                                        required
                                        disabled={isLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                                    />
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-1" />
                                        Ihre Geschichte *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="Erzählen Sie uns etwas über sich, was Sie bewegt, was Sie sich wünschen..."
                                        rows={4}
                                        required
                                        disabled={isLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 resize-none"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Minimum 50 Zeichen
                                    </p>
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        E-Mail (optional)
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="Für Rückfragen (wird nicht veröffentlicht)"
                                        disabled={isLoading}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                                    />
                                </div>

                                {/* Privacy Notice */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-sm text-green-800">
                                        <span className="font-medium">
                                            Datenschutz:
                                        </span>{' '}
                                        Ihre Daten werden nur für die
                                        Darstellung auf der Wendessen-Website
                                        verwendet. Das Foto und Ihr Name werden
                                        öffentlich sichtbar sein. Ihre
                                        E-Mail-Adresse wird nicht
                                        veröffentlicht.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0 rounded-b-xl">
                            <div className="flex flex-col sm:flex-row-reverse sm:space-x-reverse sm:space-x-3 space-y-3 sm:space-y-0">
                                <button
                                    type="submit"
                                    disabled={
                                        isLoading ||
                                        !selectedFile ||
                                        !formData.name.trim() ||
                                        !formData.description.trim() ||
                                        formData.description.length < 50
                                    }
                                    className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                            Wird gesendet...
                                        </>
                                    ) : (
                                        <>
                                            <UploadSimple className="w-5 h-5 mr-2" />
                                            Portrait einreichen
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto inline-flex justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    Abbrechen
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
