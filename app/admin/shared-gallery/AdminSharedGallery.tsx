'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner from '@/app/components/LoadingSpinner';
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
    imageData: string;
    imageMimeType: string;
    imageFilename?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    rejectionReason?: string;
}

export default function AdminSharedGallery() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<SharedGallerySubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [selectedSubmission, setSelectedSubmission] = useState<SharedGallerySubmission | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const fetchSubmissions = useCallback(async () => {
        try {
            setLoading(true);
            const url = filter === 'all' 
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
        if (!confirm('Möchten Sie dieses Foto freigeben?')) return;

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
        if (!confirm('Möchten Sie diese Einreichung wirklich löschen?')) return;

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
                            Ausstehend ({submissions.filter(s => s.status === 'pending').length})
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Freigegeben ({submissions.filter(s => s.status === 'approved').length})
                        </button>
                        <button
                            onClick={() => setFilter('rejected')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Abgelehnt ({submissions.filter(s => s.status === 'rejected').length})
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
                        <LoadingSpinner size="lg" text="Lade Einreichungen..." centered />
                    </div>
                ) : filteredSubmissions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredSubmissions.map((submission) => (
                            <div
                                key={submission.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="aspect-square relative cursor-pointer" onClick={() => setSelectedSubmission(submission)}>
                                    <Image
                                        src={submission.imageData}
                                        alt={submission.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
                                        {new Date(submission.submittedAt).toLocaleDateString('de-DE')}
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => setSelectedSubmission(submission)}
                                            className="flex-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                        >
                                            <Eye size={14} className="inline mr-1" />
                                            Ansehen
                                        </button>
                                        {submission.status === 'pending' && (
                                            <button
                                                onClick={() => handleApprove(submission.id)}
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
                            Keine {filter !== 'all' ? filter === 'pending' ? 'ausstehenden' : filter === 'approved' ? 'freigegebenen' : 'abgelehnten' : ''} Einreichungen gefunden.
                        </p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedSubmission && !showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {selectedSubmission.title}
                                    </h3>
                                    {getStatusBadge(selectedSubmission.status)}
                                </div>
                                {selectedSubmission.submitterName && (
                                    <p className="text-gray-600">
                                        Eingereicht von <strong>{selectedSubmission.submitterName}</strong>
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Image */}
                            <div className="mb-6 relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={selectedSubmission.imageData}
                                    alt={selectedSubmission.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {selectedSubmission.description && (
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-900 mb-1">Beschreibung</h4>
                                        <p className="text-gray-700">{selectedSubmission.description}</p>
                                    </div>
                                )}
                                {selectedSubmission.submitterEmail && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">E-Mail</h4>
                                        <p className="text-gray-700">{selectedSubmission.submitterEmail}</p>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Eingereicht am</h4>
                                    <p className="text-gray-700">
                                        {new Date(selectedSubmission.submittedAt).toLocaleString('de-DE')}
                                    </p>
                                </div>
                                {selectedSubmission.reviewedAt && (
                                    <>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">Geprüft am</h4>
                                            <p className="text-gray-700">
                                                {new Date(selectedSubmission.reviewedAt).toLocaleString('de-DE')}
                                            </p>
                                        </div>
                                        {selectedSubmission.reviewedBy && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Geprüft von</h4>
                                                <p className="text-gray-700">{selectedSubmission.reviewedBy}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                                {selectedSubmission.rejectionReason && (
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-900 mb-1">Ablehnungsgrund</h4>
                                        <p className="text-gray-700">{selectedSubmission.rejectionReason}</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                {selectedSubmission.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(selectedSubmission.id)}
                                            disabled={processing}
                                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:bg-gray-400 flex items-center justify-center"
                                        >
                                            {processing ? (
                                                <LoadingSpinner size="sm" color="white" />
                                            ) : (
                                                <>
                                                    <Check size={16} className="mr-2" />
                                                    Freigeben
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            disabled={processing}
                                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:bg-gray-400 flex items-center justify-center"
                                        >
                                            <X size={16} className="mr-2" />
                                            Ablehnen
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => handleDelete(selectedSubmission.id)}
                                    disabled={processing}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium disabled:bg-gray-400 flex items-center justify-center"
                                >
                                    <Trash size={16} className="mr-2" />
                                    Löschen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && selectedSubmission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Einreichung ablehnen
                        </h3>
                        <p className="text-gray-700 mb-4">
                            Möchten Sie wirklich diese Einreichung ablehnen?
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Grund (optional)
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Grund für die Ablehnung..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                }}
                                disabled={processing}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={processing}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:bg-gray-400"
                            >
                                {processing ? (
                                    <LoadingSpinner size="sm" color="white" />
                                ) : (
                                    'Ablehnen'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
