'use client';

import { useState } from 'react';
import Image from 'next/image';
import { isMinioUrl } from '@/lib/utils/blob-utils';
import {
    X,
    DownloadSimple,
    Warning,
    Calendar,
    User,
    MapPin,
} from '@phosphor-icons/react';

interface ImageLightboxProps {
    submissionId: string;
    imageUrl: string;
    title: string;
    description?: string;
    submitterName?: string;
    submittedAt: Date;
    dateTaken?: Date;
    location?: string;
    filename?: string;
    onClose: () => void;
}

export default function ImageLightbox({
    submissionId,
    imageUrl,
    title,
    description,
    submitterName,
    submittedAt,
    dateTaken,
    location,
    filename,
    onClose,
}: ImageLightboxProps) {
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportSubmitting, setReportSubmitting] = useState(false);
    const [reportSuccess, setReportSuccess] = useState(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename || `wendessen-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReport = async () => {
        if (!reportReason.trim()) {
            alert('Bitte geben Sie einen Grund für die Meldung an.');
            return;
        }

        setReportSubmitting(true);

        try {
            const response = await fetch('/api/shared-gallery/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId,
                    reason: reportReason.trim(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit report');
            }

            setReportSuccess(true);
            setTimeout(() => {
                setShowReportModal(false);
                setReportSuccess(false);
                setReportReason('');
            }, 2000);
        } catch (error) {
            console.error('Error submitting report:', error);
            alert(
                'Fehler beim Senden der Meldung. Bitte versuchen Sie es später erneut.'
            );
        } finally {
            setReportSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm pt-16"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl h-[calc(100vh-5rem)] p-4 md:p-6 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 text-white flex-shrink-0">
                    <div className="flex-1 pr-4">
                        <h3 className="text-lg md:text-xl font-bold mb-1 line-clamp-1">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-xs md:text-sm text-gray-300 line-clamp-1">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                        aria-label="Schließen"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Image Container */}
                <div className="flex-1 relative mb-3 rounded-lg overflow-hidden bg-black/50">
                    <Image
                        src={imageUrl}
                        alt={description || title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        priority
                        unoptimized={isMinioUrl(imageUrl)}
                    />
                </div>

                {/* Footer with Metadata and Actions */}
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4 text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                            {submitterName && (
                                <div className="flex items-center gap-2">
                                    <User
                                        size={18}
                                        weight="duotone"
                                        className="text-gray-300"
                                    />
                                    <span>{submitterName}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar
                                    size={18}
                                    weight="duotone"
                                    className="text-gray-300"
                                />
                                <span>
                                    {dateTaken ? (
                                        <>
                                            Aufgenommen:{' '}
                                            {new Date(
                                                dateTaken
                                            ).toLocaleDateString('de-DE', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </>
                                    ) : (
                                        <>
                                            Hochgeladen:{' '}
                                            {new Date(
                                                submittedAt
                                            ).toLocaleDateString('de-DE', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </>
                                    )}
                                </span>
                            </div>
                            {location && (
                                <div className="flex items-center gap-2">
                                    <MapPin
                                        size={18}
                                        weight="duotone"
                                        className="text-gray-300"
                                    />
                                    <span>{location}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                            >
                                <DownloadSimple size={18} />
                                <span className="hidden sm:inline">
                                    Herunterladen
                                </span>
                            </button>
                            <button
                                onClick={() => setShowReportModal(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                            >
                                <Warning size={18} />
                                <span className="hidden sm:inline">Melden</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div
                    className="fixed inset-0 z-60 flex items-center justify-center bg-black/80"
                    onClick={() => setShowReportModal(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {reportSuccess ? (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-8 h-8 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Vielen Dank!
                                </h3>
                                <p className="text-gray-600">
                                    Ihre Meldung wurde erfolgreich übermittelt.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Foto melden
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setShowReportModal(false)
                                        }
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <p className="text-gray-700 mb-4">
                                    Warum möchten Sie dieses Foto melden?
                                </p>
                                <textarea
                                    value={reportReason}
                                    onChange={(e) =>
                                        setReportReason(e.target.value)
                                    }
                                    placeholder="Bitte beschreiben Sie das Problem..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 mb-4"
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={() =>
                                            setShowReportModal(false)
                                        }
                                        disabled={reportSubmitting}
                                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        onClick={handleReport}
                                        disabled={
                                            reportSubmitting ||
                                            !reportReason.trim()
                                        }
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {reportSubmitting
                                            ? 'Wird gesendet...'
                                            : 'Melden'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
