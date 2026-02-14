'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import PromptDialog from '@/app/components/ui/PromptDialog';
import Modal from '@/app/components/ui/Modal';
import LazySharedGalleryImage from '@/app/components/LazySharedGalleryImage';
import { SharedGalleryImageProvider } from '@/app/components/SharedGalleryImageContext';
import { ArrowLeft, Check, X, Warning, Trash, ArrowsCounterClockwise } from '@phosphor-icons/react';
import { useHasPermission } from '@/lib/usePermissions';

interface GalleryReport {
    id: string;
    submissionId: string;
    reason: string;
    reporterInfo?: string;
    status: 'pending' | 'reviewed' | 'dismissed';
    reviewedAt?: string;
    reviewedBy?: string;
    createdAt: string;
    imageUrl?: string;
    title?: string;
    submitterName?: string;
}

export default function AdminSharedGalleryReports() {
    const router = useRouter();
    const [reports, setReports] = useState<GalleryReport[]>([]);
    const [allReports, setAllReports] = useState<GalleryReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'pending' | 'all'>('pending');
    const [processing, setProcessing] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [viewingImage, setViewingImage] = useState<GalleryReport | null>(
        null
    );
    const [disapproving, setDisapproving] = useState(false);
    const [imageToDisapprove, setImageToDisapprove] = useState<string | null>(null);
    const [imageToDelete, setImageToDelete] = useState<{ submissionId: string, reportId: string } | null>(null);
    const [reportToDelete, setReportToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const canEdit = useHasPermission('shared_gallery.edit');
    const canDelete = useHasPermission('shared_gallery.delete');

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);

            // Always fetch all reports for accurate counts
            const allResponse = await fetch(
                '/api/admin/shared-gallery/reports'
            );
            if (allResponse.ok) {
                const allData = await allResponse.json();
                setAllReports(allData.reports || []);
            }

            // Fetch filtered reports
            const url =
                filter === 'all'
                    ? '/api/admin/shared-gallery/reports'
                    : `/api/admin/shared-gallery/reports?status=pending`;

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setReports(data.reports || []);
            } else {
                setError('Fehler beim Laden der Meldungen');
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            setError('Fehler beim Laden der Meldungen');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleUpdateStatus = async (
        reportId: string,
        status: 'reviewed' | 'dismissed' | 'pending'
    ) => {
        setProcessing(reportId);
        setError(null);

        try {
            const response = await fetch('/api/admin/shared-gallery/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId, status }),
            });

            if (response.ok) {
                await fetchReports();
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Aktualisieren');
            }
        } catch (error) {
            console.error('Error updating report:', error);
            setError('Fehler beim Aktualisieren');
        } finally {
            setProcessing(null);
        }
    };

    const handleDisapprove = async (submissionId: string) => {
        setDisapproving(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reject',
                    id: submissionId,
                    reason: 'Aufgrund einer Meldung entfernt',
                }),
            });

            if (response.ok) {
                setViewingImage(null);
                await fetchReports();
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Ablehnen');
            }
        } catch (error) {
            console.error('Error disapproving image:', error);
            setError('Fehler beim Ablehnen');
        } finally {
            setDisapproving(false);
        }
    };

    const handleDelete = async (submissionId: string, reportId: string) => {
        setDeleting(true);
        setError(null);

        try {
            // 1. Delete the submission
            const subResponse = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete',
                    id: submissionId,
                }),
            });

            if (subResponse.ok) {
                // 2. Also delete the report since we handled it by deleting the photo
                await fetch(`/api/admin/shared-gallery/reports?reportId=${reportId}`, {
                    method: 'DELETE',
                });

                setViewingImage(null);
                await fetchReports();
            } else {
                const data = await subResponse.json();
                setError(data.error || 'Fehler beim Löschen des Fotos');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            setError('Fehler beim Löschen des Fotos');
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteReport = async (reportId: string) => {
        setProcessing(reportId);
        setError(null);

        try {
            const response = await fetch(`/api/admin/shared-gallery/reports?reportId=${reportId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchReports();
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Löschen der Meldung');
            }
        } catch (error) {
            console.error('Error deleting report:', error);
            setError('Fehler beim Löschen der Meldung');
        } finally {
            setProcessing(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Ausstehend
                    </span>
                );
            case 'reviewed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Geprüft
                    </span>
                );
            case 'dismissed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Abgewiesen
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <SharedGalleryImageProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <button
                                    onClick={() =>
                                        router.push('/admin/shared-gallery')
                                    }
                                    className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Foto-Meldungen
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Gemeldete Fotos prüfen und bearbeiten
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <div className="bg-white shadow rounded-lg p-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Ausstehend (
                                {
                                    allReports.filter((r) => r.status === 'pending')
                                        .length
                                }
                                )
                            </button>
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Alle ({allReports.length})
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                                <Warning size={16} className="mr-2" />
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
                </div>

                {/* Reports List */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    {loading ? (
                        <div className="bg-white shadow rounded-lg p-12 text-center">
                            <LoadingSpinner
                                size="lg"
                                text="Lade Meldungen..."
                                centered
                            />
                        </div>
                    ) : reports.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex gap-6">
                                            {/* Image Thumbnail */}
                                            <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                <LazySharedGalleryImage
                                                    imageId={report.submissionId}
                                                    alt="Gemeldetes Foto"
                                                    fill
                                                    className="object-cover"
                                                    sizes="128px"
                                                    onLoad={(imageUrl) => {
                                                        report.imageUrl = imageUrl;
                                                    }}
                                                />
                                            </div>

                                            {/* Report Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-bold text-gray-900">
                                                                {report.title ||
                                                                    'Unbekannter Titel'}
                                                            </h3>
                                                            {getStatusBadge(
                                                                report.status
                                                            )}
                                                        </div>
                                                        {report.submitterName && (
                                                            <p className="text-sm text-gray-600 mb-1">
                                                                Foto von:{' '}
                                                                <strong>
                                                                    {
                                                                        report.submitterName
                                                                    }
                                                                </strong>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-3">
                                                    <p className="text-sm font-medium text-red-900 mb-1">
                                                        Grund der Meldung:
                                                    </p>
                                                    <p className="text-sm text-red-800">
                                                        {report.reason}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                                    <span>
                                                        Gemeldet am{' '}
                                                        {new Date(
                                                            report.createdAt
                                                        ).toLocaleDateString(
                                                            'de-DE'
                                                        )}
                                                    </span>
                                                    {report.reviewedAt && (
                                                        <>
                                                            <span>•</span>
                                                            <span>
                                                                Bearbeitet am{' '}
                                                                {new Date(
                                                                    report.reviewedAt
                                                                ).toLocaleDateString(
                                                                    'de-DE'
                                                                )}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-3">
                                                    {report.status === 'pending' && canEdit && (
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    report.id,
                                                                    'reviewed'
                                                                )
                                                            }
                                                            disabled={
                                                                processing ===
                                                                report.id
                                                            }
                                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400"
                                                        >
                                                            {processing ===
                                                                report.id ? (
                                                                <LoadingSpinner
                                                                    size="sm"
                                                                    color="white"
                                                                />
                                                            ) : (
                                                                <>
                                                                    <Check
                                                                        size={18}
                                                                    />
                                                                    Als geprüft
                                                                    markieren
                                                                </>
                                                            )}
                                                        </button>
                                                    )}

                                                    {report.status === 'pending' && canEdit && (
                                                        <button
                                                            onClick={() =>
                                                                setImageToDisapprove(
                                                                    report.submissionId
                                                                )
                                                            }
                                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            <X size={18} />
                                                            Foto ablehnen
                                                        </button>
                                                    )}

                                                    {report.status === 'pending' && canDelete && (
                                                        <button
                                                            onClick={() =>
                                                                setImageToDelete({
                                                                    submissionId: report.submissionId,
                                                                    reportId: report.id
                                                                })
                                                            }
                                                            disabled={deleting}
                                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400"
                                                        >
                                                            {deleting ? (
                                                                <LoadingSpinner
                                                                    size="sm"
                                                                    color="white"
                                                                />
                                                            ) : (
                                                                <>
                                                                    <Trash
                                                                        size={18}
                                                                    />
                                                                    Foto & Meldung löschen
                                                                </>
                                                            )}
                                                        </button>
                                                    )}

                                                    {canDelete && (
                                                        <button
                                                            onClick={() =>
                                                                setReportToDelete(report.id)
                                                            }
                                                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            <Trash size={18} />
                                                            Nur Meldung löschen
                                                        </button>
                                                    )}

                                                    {report.status !== 'pending' && canEdit && (
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    report.id,
                                                                    'pending'
                                                                )
                                                            }
                                                            disabled={
                                                                processing ===
                                                                report.id
                                                            }
                                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400"
                                                        >
                                                            {processing ===
                                                                report.id ? (
                                                                <LoadingSpinner
                                                                    size="sm"
                                                                    color="white"
                                                                />
                                                            ) : (
                                                                <>
                                                                    <ArrowsCounterClockwise
                                                                        size={18}
                                                                    />
                                                                    Meldung zurücksetzen
                                                                </>
                                                            )}
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() =>
                                                            setViewingImage(
                                                                report
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Foto ansehen
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg p-12 text-center">
                            <Warning className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Keine Meldungen
                            </h3>
                            <p className="text-gray-600">
                                {filter === 'pending'
                                    ? 'Es gibt keine ausstehenden Meldungen.'
                                    : 'Es wurden noch keine Fotos gemeldet.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Image View Modal */}
                <Modal
                    isOpen={Boolean(viewingImage)}
                    onClose={() => setViewingImage(null)}
                    maxWidth="4xl"
                    backdropBlur
                >
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Gemeldetes Foto
                                </h3>
                                {viewingImage && (
                                    <div className="mt-1">
                                        {getStatusBadge(viewingImage.status)}
                                    </div>
                                )}
                            </div>

                            {canDelete && viewingImage && (
                                <button
                                    onClick={() =>
                                        setImageToDelete({
                                            submissionId: viewingImage.submissionId,
                                            reportId: viewingImage.id
                                        })
                                    }
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-red-100"
                                    title="Foto & Meldung löschen"
                                >
                                    <Trash size={18} />
                                    Beides löschen
                                </button>
                            )}
                        </div>

                        {/* Image Preview */}
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-8 shadow-inner border border-gray-100">
                            {viewingImage?.imageUrl ? (
                                <Image
                                    src={viewingImage.imageUrl}
                                    alt="Gemeldetes Foto"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            ) : viewingImage ? (
                                <LazySharedGalleryImage
                                    imageId={viewingImage.submissionId}
                                    alt="Gemeldetes Foto"
                                    fill
                                    className="object-contain"
                                    onLoad={(imageUrl) => {
                                        viewingImage.imageUrl = imageUrl;
                                    }}
                                />
                            ) : null}
                        </div>

                        {/* Report Details & Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                <div className="bg-red-50 border border-red-100 p-5 rounded-2xl">
                                    <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Warning size={16} />
                                        Grund der Meldung
                                    </h4>
                                    <p className="text-gray-900 font-medium bg-white/50 p-3 rounded-lg border border-red-50 italic">
                                        &quot;{viewingImage?.reason}&quot;
                                    </p>
                                    {viewingImage?.reporterInfo && (
                                        <div className="mt-4 pt-4 border-t border-red-100">
                                            <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-1">
                                                Zusatzinfo vom Melder:
                                            </h4>
                                            <p className="text-sm text-red-800 italic">
                                                &quot;{viewingImage.reporterInfo}&quot;
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">
                                    Foto-Metadaten
                                </h4>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-0.5">
                                            Titel
                                        </span>
                                        <span className="text-gray-900 font-medium">
                                            {viewingImage?.title ||
                                                'Unbekannter Titel'}
                                        </span>
                                    </div>

                                    {viewingImage?.submitterName && (
                                        <div>
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-0.5">
                                                Eingereicht von
                                            </span>
                                            <span className="text-gray-900 font-medium">
                                                {viewingImage.submitterName}
                                            </span>
                                        </div>
                                    )}

                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-0.5">
                                            Gemeldet am
                                        </span>
                                        <span className="text-gray-900 font-medium">
                                            {viewingImage &&
                                                new Date(
                                                    viewingImage.createdAt
                                                ).toLocaleDateString('de-DE', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setViewingImage(null)}
                                className="flex-1 min-w-[140px] px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <X size={20} weight="bold" />
                                Schließen
                            </button>

                            {canEdit && viewingImage && viewingImage.status === 'pending' && (
                                <button
                                    onClick={() =>
                                        handleUpdateStatus(
                                            viewingImage.id,
                                            'reviewed'
                                        )
                                    }
                                    disabled={
                                        processing === viewingImage.id
                                    }
                                    className="flex-1 min-w-[200px] px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md disabled:bg-gray-400 flex items-center justify-center gap-2"
                                >
                                    {processing === viewingImage.id ? (
                                        <LoadingSpinner
                                            size="sm"
                                            color="white"
                                        />
                                    ) : (
                                        <>
                                            <Check
                                                size={20}
                                                weight="bold"
                                            />
                                            Als geprüft markieren
                                        </>
                                    )}
                                </button>
                            )}

                            {canEdit && viewingImage && (
                                <button
                                    onClick={() =>
                                        setImageToDisapprove(
                                            viewingImage.submissionId
                                        )
                                    }
                                    disabled={disapproving}
                                    className="flex-1 min-w-[200px] px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md disabled:bg-gray-400 flex items-center justify-center gap-2"
                                >
                                    {disapproving ? (
                                        <>
                                            <LoadingSpinner
                                                size="sm"
                                                color="white"
                                            />
                                            Wird abgelehnt...
                                        </>
                                    ) : (
                                        <>
                                            <Trash
                                                size={20}
                                                weight="bold"
                                            />
                                            Foto ablehnen
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </Modal>

                <PromptDialog
                    isOpen={imageToDisapprove !== null}
                    onCancel={() => setImageToDisapprove(null)}
                    onConfirm={async () => {
                        if (imageToDisapprove) {
                            await handleDisapprove(imageToDisapprove);
                            setImageToDisapprove(null);
                        }
                    }}
                    title="Foto ablehnen"
                    description="Möchten Sie dieses Foto wirklich ablehnen und entfernen?"
                    confirmText="Ablehnen"
                    cancelText="Abbrechen"
                    icon={<Trash className="h-12 w-12" />}
                    accentColor="red"
                />

                <PromptDialog
                    isOpen={imageToDelete !== null}
                    onCancel={() => setImageToDelete(null)}
                    onConfirm={async () => {
                        if (imageToDelete) {
                            await handleDelete(imageToDelete.submissionId, imageToDelete.reportId);
                            setImageToDelete(null);
                        }
                    }}
                    title="Foto & Meldung unwiderruflich löschen"
                    description="Möchten Sie dieses Foto und die zugehörige Meldung wirklich unwiderruflich löschen? Dies kann nicht rückgängig gemacht werden."
                    confirmText="Beides löschen"
                    cancelText="Abbrechen"
                    icon={<Trash className="h-12 w-12" />}
                    accentColor="red"
                />

                <PromptDialog
                    isOpen={reportToDelete !== null}
                    onCancel={() => setReportToDelete(null)}
                    onConfirm={async () => {
                        if (reportToDelete) {
                            await handleDeleteReport(reportToDelete);
                            setReportToDelete(null);
                        }
                    }}
                    title="Meldung löschen"
                    description="Möchten Sie diese Meldung wirklich löschen? Das Foto bleibt dabei erhalten."
                    confirmText="Meldung löschen"
                    cancelText="Abbrechen"
                    icon={<Trash className="h-12 w-12" />}
                    accentColor="gray"
                />
            </div>
        </SharedGalleryImageProvider>
    );
}
