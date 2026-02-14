'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LazySharedGalleryImage from '@/app/components/LazySharedGalleryImage';
import { SharedGalleryImageProvider } from '@/app/components/SharedGalleryImageContext';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import PromptDialog from '@/app/components/ui/PromptDialog';
import Modal from '@/app/components/ui/Modal';
import {
    ArrowLeft,
    Check,
    X,
    Trash,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
} from '@phosphor-icons/react';

interface SharedGallerySubmission {
    id: string;
    title: string;
    description?: string;
    submitterName?: string;
    submitterEmail?: string;
    imageUrl?: string; // Loaded lazily via admin image endpoint
    imageMimeType: string;
    imageFilename?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    rejectionReason?: string;
}

export default function AdminSharedGallery({
    canDelete = false,
}: {
    canDelete?: boolean;
}) {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<SharedGallerySubmission[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<
        'all' | 'pending' | 'approved' | 'rejected'
    >('pending');
    const [selectedSubmission, setSelectedSubmission] =
        useState<SharedGallerySubmission | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [submissionToApprove, setSubmissionToApprove] =
        useState<SharedGallerySubmission | null>(null);
    const [submissionToDelete, setSubmissionToDelete] =
        useState<SharedGallerySubmission | null>(null);

    const fetchSubmissions = useCallback(async () => {
        try {
            setLoading(true);
            const url =
                filter === 'all'
                    ? '/api/admin/shared-gallery'
                    : `/api/admin/shared-gallery?status=${filter}`;

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setSubmissions(data.submissions || []);
            } else {
                setError('Fehler beim Laden der Einreichungen');
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setError('Fehler beim Laden der Einreichungen');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleApprove = async (id: string) => {
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approve', id }),
            });

            if (response.ok) {
                await fetchSubmissions();
                setSelectedSubmission(null);
                setSubmissionToApprove(null);
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Freigeben');
            }
        } catch (error) {
            console.error('Error approving submission:', error);
            setError('Fehler beim Freigeben');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedSubmission) return;

        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reject',
                    id: selectedSubmission.id,
                    reason: rejectionReason || undefined,
                }),
            });

            if (response.ok) {
                await fetchSubmissions();
                setSelectedSubmission(null);
                setShowRejectModal(false);
                setRejectionReason('');
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Ablehnen');
            }
        } catch (error) {
            console.error('Error rejecting submission:', error);
            setError('Fehler beim Ablehnen');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id: string) => {
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id }),
            });

            if (response.ok) {
                await fetchSubmissions();
                setSelectedSubmission(null);
                setSubmissionToDelete(null);
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Löschen');
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
            setError('Fehler beim Löschen');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock size={12} className="mr-1" />
                        Ausstehend
                    </span>
                );
            case 'approved':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        Freigegeben
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle size={12} className="mr-1" />
                        Abgelehnt
                    </span>
                );
            default:
                return null;
        }
    };

    const filteredSubmissions = submissions;

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
                                        router.push('/admin/dashboard')
                                    }
                                    className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Impressionen verwalten
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Eingereichte Fotos prüfen und freigeben
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
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Ausstehend (
                                {
                                    submissions.filter(
                                        (s) => s.status === 'pending'
                                    ).length
                                }
                                )
                            </button>
                            <button
                                onClick={() => setFilter('approved')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === 'approved'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Freigegeben (
                                {
                                    submissions.filter(
                                        (s) => s.status === 'approved'
                                    ).length
                                }
                                )
                            </button>
                            <button
                                onClick={() => setFilter('rejected')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === 'rejected'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Abgelehnt (
                                {
                                    submissions.filter(
                                        (s) => s.status === 'rejected'
                                    ).length
                                }
                                )
                            </button>
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === 'all'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Alle ({submissions.length})
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                                <X size={16} className="mr-2" />
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

                {/* Submissions Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    {loading ? (
                        <div className="bg-white shadow rounded-lg p-12 text-center">
                            <LoadingSpinner
                                size="lg"
                                text="Lade Einreichungen..."
                                centered
                            />
                        </div>
                    ) : filteredSubmissions.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredSubmissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div
                                        className="aspect-square relative cursor-pointer"
                                        onClick={() =>
                                            setSelectedSubmission(submission)
                                        }
                                    >
                                        <LazySharedGalleryImage
                                            imageId={submission.id}
                                            alt={submission.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                            onLoad={(imageUrl) => {
                                                submission.imageUrl = imageUrl;
                                            }}
                                        />
                                        <div className="absolute top-2 right-2">
                                            {getStatusBadge(submission.status)}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 truncate mb-1">
                                            {submission.title}
                                        </h3>
                                        {submission.submitterName && (
                                            <p className="text-sm text-gray-600 truncate mb-2">
                                                von {submission.submitterName}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            {new Date(
                                                submission.submittedAt
                                            ).toLocaleDateString('de-DE')}
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() =>
                                                    setSelectedSubmission(
                                                        submission
                                                    )
                                                }
                                                className="flex-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                            >
                                                <Eye
                                                    size={14}
                                                    className="inline mr-1"
                                                />
                                                Ansehen
                                            </button>
                                            {submission.status ===
                                                'pending' && (
                                                <button
                                                    onClick={() =>
                                                        setSubmissionToApprove(
                                                            submission
                                                        )
                                                    }
                                                    disabled={processing}
                                                    className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:bg-gray-400"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg p-12 text-center">
                            <p className="text-gray-600">
                                Keine{' '}
                                {filter !== 'all'
                                    ? filter === 'pending'
                                        ? 'ausstehenden'
                                        : filter === 'approved'
                                        ? 'freigegebenen'
                                        : 'abgelehnten'
                                    : ''}{' '}
                                Einreichungen gefunden.
                            </p>
                        </div>
                    )}
                </div>

                {/* Detail Modal */}
                <Modal
                    isOpen={Boolean(selectedSubmission && !showRejectModal)}
                    onClose={() => setSelectedSubmission(null)}
                    maxWidth="4xl"
                    backdropBlur
                >
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {selectedSubmission?.title}
                                    </h3>
                                    {selectedSubmission && getStatusBadge(selectedSubmission.status)}
                                </div>
                                {selectedSubmission?.submitterName && (
                                    <p className="text-gray-700">
                                        <span className="text-gray-600 font-medium">Eingereicht von:</span>{' '}
                                        <strong className="text-gray-900 font-semibold">
                                            {selectedSubmission.submitterName}
                                        </strong>
                                    </p>
                                )}
                            </div>

                            {canDelete && selectedSubmission && (
                                <button
                                    onClick={() => setSubmissionToDelete(selectedSubmission)}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-red-100"
                                    title="Einreichung löschen"
                                >
                                    <Trash size={18} />
                                    Einreichung löschen
                                </button>
                            )}
                        </div>

                        <div>
                            {/* Image Preview */}
                            <div className="mb-8 relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                                {selectedSubmission?.imageUrl ? (
                                    <Image
                                        src={selectedSubmission.imageUrl}
                                        alt={selectedSubmission.title}
                                        fill
                                        className="object-contain p-2"
                                        unoptimized
                                    />
                                ) : selectedSubmission ? (
                                    <LazySharedGalleryImage
                                        imageId={selectedSubmission.id}
                                        alt={selectedSubmission.title}
                                        fill
                                        className="object-contain p-2"
                                        onLoad={(imageUrl) => {
                                            selectedSubmission.imageUrl = imageUrl;
                                        }}
                                    />
                                ) : null}
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                                {selectedSubmission?.description && (
                                    <div className="md:col-span-2">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            Beschreibung
                                        </h4>
                                        <p className="text-gray-900 leading-relaxed italic border-l-4 border-gray-200 pl-4 py-1">
                                            &quot;{selectedSubmission.description}&quot;
                                        </p>
                                    </div>
                                )}
                                {selectedSubmission?.submitterEmail && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            E-Mail-Adresse
                                        </h4>
                                        <p className="text-gray-900 font-medium">
                                            {selectedSubmission.submitterEmail}
                                        </p>
                                    </div>
                                )}
                                {selectedSubmission && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            Eingereicht am
                                        </h4>
                                        <p className="text-gray-900 font-medium">
                                            {new Date(selectedSubmission.submittedAt).toLocaleString('de-DE', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short'
                                            })}
                                        </p>
                                    </div>
                                )}
                                {selectedSubmission?.reviewedAt && (
                                    <>
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                Geprüft am
                                            </h4>
                                            <p className="text-gray-900 font-medium">
                                                {new Date(selectedSubmission.reviewedAt).toLocaleString('de-DE', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </p>
                                        </div>
                                        {selectedSubmission.reviewedBy && (
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                    Geprüft von
                                                </h4>
                                                <p className="text-gray-900 font-medium">
                                                    {selectedSubmission.reviewedBy}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                                {selectedSubmission?.rejectionReason && (
                                    <div className="md:col-span-2 bg-red-50 p-4 rounded-xl border border-red-100">
                                        <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
                                            Ablehnungsgrund
                                        </h4>
                                        <p className="text-red-900 font-medium whitespace-pre-wrap">
                                            {selectedSubmission.rejectionReason}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Actions Footer */}
                            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                                {selectedSubmission?.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(selectedSubmission.id)}
                                            disabled={processing}
                                            className="flex-1 min-w-[150px] px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            {processing ? (
                                                <LoadingSpinner size="sm" color="white" />
                                            ) : (
                                                <>
                                                    <Check size={20} weight="bold" />
                                                    Freigeben
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            disabled={processing}
                                            className="flex-1 min-w-[150px] px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md disabled:bg-gray-400 flex items-center justify-center gap-2"
                                        >
                                            <X size={20} weight="bold" />
                                            Ablehnen
                                        </button>
                                    </>
                                )}
                                {selectedSubmission?.status !== 'pending' && (
                                    <button
                                        onClick={() => setSelectedSubmission(null)}
                                        className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        Schließen
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>

                {/* Reject Modal */}
                <Modal
                    isOpen={Boolean(showRejectModal && selectedSubmission)}
                    onClose={() => {
                        setShowRejectModal(false);
                        setRejectionReason('');
                    }}
                    maxWidth="md"
                    backdropBlur
                >
                    <div className="p-6 md:p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Einreichung ablehnen
                        </h3>
                        <p className="text-gray-700 mb-4">
                            Möchten Sie wirklich diese Einreichung ablehnen?
                        </p>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Grund (optional)
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                }
                                placeholder="Grund für die Ablehnung..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 transition-all font-medium"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                }}
                                disabled={processing}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold transition-all"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={processing}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md disabled:bg-gray-400"
                            >
                                {processing ? (
                                    <LoadingSpinner
                                        size="sm"
                                        color="white"
                                    />
                                ) : (
                                    'Ablehnen'
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Approve Confirmation Dialog */}
                <PromptDialog
                    isOpen={Boolean(submissionToApprove)}
                    title="Foto freigeben?"
                    description={`Möchten Sie das Foto "${submissionToApprove?.title}" freigeben?`}
                    detail="Das Foto wird auf der öffentlichen Galerie-Seite sichtbar."
                    confirmText={processing ? 'Freigeben...' : 'Freigeben'}
                    cancelText="Abbrechen"
                    onConfirm={() =>
                        submissionToApprove &&
                        handleApprove(submissionToApprove.id)
                    }
                    onCancel={() => setSubmissionToApprove(null)}
                    icon={<Check className="h-12 w-12" weight="duotone" />}
                />

                {/* Delete Confirmation Dialog */}
                {canDelete && (
                    <PromptDialog
                        isOpen={Boolean(submissionToDelete)}
                        title="Einreichung löschen?"
                        description={`Möchten Sie die Einreichung "${submissionToDelete?.title}" wirklich löschen?`}
                        detail="Diese Aktion kann nicht rückgängig gemacht werden."
                        confirmText={processing ? 'Löschen...' : 'Löschen'}
                        cancelText="Abbrechen"
                        onConfirm={() =>
                            submissionToDelete &&
                            handleDelete(submissionToDelete.id)
                        }
                        onCancel={() => setSubmissionToDelete(null)}
                        icon={<Trash className="h-12 w-12" weight="duotone" />}
                        accentColor="red"
                    />
                )}
            </div>
        </SharedGalleryImageProvider>
    );
}
