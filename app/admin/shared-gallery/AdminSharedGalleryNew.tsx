'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import PromptDialog from '@/app/components/ui/PromptDialog';
import LazySharedGalleryImage from '@/app/components/LazySharedGalleryImage';
import { SharedGalleryImageProvider } from '@/app/components/SharedGalleryImageContext';
import {
    ArrowLeft,
    Check,
    X,
    Trash,
    CheckCircle,
    XCircle,
    Clock,
    ArrowCounterClockwise,
    Images,
    Warning as WarningIcon,
} from '@phosphor-icons/react';

interface SharedGalleryImage {
    id: string;
    imageUrl?: string; // Loaded on demand to keep payloads small
    description?: string;
    submitterName?: string;
    submitterEmail?: string;
    imageFilename?: string;
    dateTaken?: string;
    location?: string;
    submittedAt?: string;
    rejectionReason?: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface SubmissionGroup {
    submissionGroupId: string;
    title: string;
    description?: string;
    submitterNames: string[];
    submitterEmail?: string;
    images: SharedGalleryImage[];
    submittedAt: string;
    totalCount: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
}

const PAGE_SIZE = 25;

interface AdminSharedGalleryProps {
    canEdit?: boolean;
    canDelete?: boolean;
}

export default function AdminSharedGallery({
    canEdit = false,
    canDelete = false,
}: AdminSharedGalleryProps) {
    const router = useRouter();
    const [allGroups, setAllGroups] = useState<SubmissionGroup[]>([]);
    const [totalGroups, setTotalGroups] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [filterStatus, setFilterStatus] = useState<
        'all' | 'pending' | 'approved' | 'rejected'
    >('all');
    const [selectedGroup, setSelectedGroup] = useState<SubmissionGroup | null>(
        null
    );
    const [selectedImages, setSelectedImages] = useState<Set<string>>(
        new Set()
    );
    const [viewingImage, setViewingImage] = useState<SharedGalleryImage | null>(
        null
    );
    const [imageToDelete, setImageToDelete] =
        useState<SharedGalleryImage | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectAction, setRejectAction] = useState<'all' | 'selected'>('all');
    const [groupToApprove, setGroupToApprove] = useState<string | null>(null);
    const [groupToReset, setGroupToReset] = useState<string | null>(null);
    const [confirmApproveSelected, setConfirmApproveSelected] = useState(false);
    const [confirmResetSelected, setConfirmResetSelected] = useState(false);

    // Statistics
    const totalPending = allGroups.reduce((sum, g) => sum + g.pendingCount, 0);
    const totalApproved = allGroups.reduce(
        (sum, g) => sum + g.approvedCount,
        0
    );
    const totalRejected = allGroups.reduce(
        (sum, g) => sum + g.rejectedCount,
        0
    );

    // Derive filtered groups from allGroups based on current filter
    const submissionGroups =
        filterStatus === 'all'
            ? allGroups
            : filterStatus === 'pending'
            ? allGroups.filter((g) => g.pendingCount > 0)
            : filterStatus === 'approved'
            ? allGroups.filter((g) => g.approvedCount > 0)
            : allGroups.filter((g) => g.rejectedCount > 0);

    const fetchSubmissionGroups = useCallback(
        async (reset = true) => {
            try {
                if (reset) {
                    setLoading(true);
                } else {
                    setLoadingMore(true);
                }

                const offset = reset ? 0 : allGroups.length;
                const response = await fetch(
                    `/api/admin/shared-gallery?limit=${PAGE_SIZE}&offset=${offset}`
                );
                if (response.ok) {
                    const data = await response.json();
                    const newGroups: SubmissionGroup[] =
                        data.submissionGroups || [];
                    setTotalGroups(data.total || 0);
                    if (reset) {
                        setAllGroups(newGroups);
                    } else {
                        setAllGroups((prev) => {
                            // Avoid duplicates in case of overlapping fetches
                            const existingIds = new Set(
                                prev.map((g) => g.submissionGroupId)
                            );
                            const uniqueNew = newGroups.filter(
                                (g) => !existingIds.has(g.submissionGroupId)
                            );
                            return [...prev, ...uniqueNew];
                        });
                    }
                } else {
                    setError('Fehler beim Laden der Einreichungen');
                }
            } catch (err) {
                console.error('Error fetching submission groups:', err);
                setError('Fehler beim Laden der Einreichungen');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [allGroups.length]
    );

    useEffect(() => {
        fetchSubmissionGroups(true);
        // Only fetch once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMore = () => {
        fetchSubmissionGroups(false);
    };

    const hasMore = allGroups.length < totalGroups;

    const handleApproveAll = async (groupId: string) => {
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'approve-all',
                    submissionGroupId: groupId,
                }),
            });

            if (response.ok) {
                await fetchSubmissionGroups();
                // Update selectedGroup with fresh data if modal is open
                if (selectedGroup) {
                    const allResponse = await fetch(
                        '/api/admin/shared-gallery'
                    );
                    if (allResponse.ok) {
                        const allData = await allResponse.json();
                        const updatedGroup = allData.submissionGroups?.find(
                            (g: SubmissionGroup) =>
                                g.submissionGroupId ===
                                selectedGroup.submissionGroupId
                        );
                        if (updatedGroup) {
                            setSelectedGroup(updatedGroup);
                        }
                    }
                }
                setSelectedImages(new Set());
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Freigeben');
            }
        } catch (error) {
            console.error('Error approving all:', error);
            setError('Fehler beim Freigeben');
        } finally {
            setProcessing(false);
        }
    };

    const handleResetAll = async (groupId: string) => {
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reset-all',
                    submissionGroupId: groupId,
                }),
            });

            if (response.ok) {
                await fetchSubmissionGroups();
                // Update selectedGroup with fresh data if modal is open
                if (selectedGroup) {
                    const allResponse = await fetch(
                        '/api/admin/shared-gallery'
                    );
                    if (allResponse.ok) {
                        const allData = await allResponse.json();
                        const updatedGroup = allData.submissionGroups?.find(
                            (g: SubmissionGroup) =>
                                g.submissionGroupId ===
                                selectedGroup.submissionGroupId
                        );
                        if (updatedGroup) {
                            setSelectedGroup(updatedGroup);
                        }
                    }
                }
                setSelectedImages(new Set());
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Zur\u00fccksetzen');
            }
        } catch (error) {
            console.error('Error resetting all:', error);
            setError('Fehler beim Zur\u00fccksetzen');
        } finally {
            setProcessing(false);
        }
    };

    const handleApproveSelected = async () => {
        if (selectedImages.size === 0) return;
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'approve-selected',
                    imageIds: Array.from(selectedImages),
                }),
            });

            if (response.ok) {
                await fetchSubmissionGroups();
                // Update selectedGroup with fresh data if modal is open
                if (selectedGroup) {
                    const allResponse = await fetch(
                        '/api/admin/shared-gallery'
                    );
                    if (allResponse.ok) {
                        const allData = await allResponse.json();
                        const updatedGroup = allData.submissionGroups?.find(
                            (g: SubmissionGroup) =>
                                g.submissionGroupId ===
                                selectedGroup.submissionGroupId
                        );
                        if (updatedGroup) {
                            setSelectedGroup(updatedGroup);
                        }
                    }
                }
                setSelectedImages(new Set());
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Freigeben');
            }
        } catch (error) {
            console.error('Error approving selected:', error);
            setError('Fehler beim Freigeben');
        } finally {
            setProcessing(false);
        }
    };

    const handleResetSelected = async () => {
        if (selectedImages.size === 0) return;
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reset-selected',
                    imageIds: Array.from(selectedImages),
                }),
            });

            if (response.ok) {
                await fetchSubmissionGroups();
                // Update selectedGroup with fresh data if modal is open
                if (selectedGroup) {
                    const allResponse = await fetch(
                        '/api/admin/shared-gallery'
                    );
                    if (allResponse.ok) {
                        const allData = await allResponse.json();
                        const updatedGroup = allData.submissionGroups?.find(
                            (g: SubmissionGroup) =>
                                g.submissionGroupId ===
                                selectedGroup.submissionGroupId
                        );
                        if (updatedGroup) {
                            setSelectedGroup(updatedGroup);
                        }
                    }
                }
                setSelectedImages(new Set());
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Zur\u00fccksetzen');
            }
        } catch (error) {
            console.error('Error resetting selected:', error);
            setError('Fehler beim Zur\u00fccksetzen');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        setProcessing(true);
        setError(null);

        try {
            const action =
                rejectAction === 'all' ? 'reject-all' : 'reject-selected';
            const body: {
                action: string;
                reason?: string;
                submissionGroupId?: string;
                imageIds?: string[];
            } = { action, reason: rejectionReason || undefined };

            if (rejectAction === 'all' && selectedGroup) {
                body.submissionGroupId = selectedGroup.submissionGroupId;
            } else if (rejectAction === 'selected') {
                body.imageIds = Array.from(selectedImages);
            }

            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchSubmissionGroups();
                // Update selectedGroup with fresh data if it exists
                if (selectedGroup && rejectAction === 'selected') {
                    const allResponse = await fetch(
                        '/api/admin/shared-gallery'
                    );
                    if (allResponse.ok) {
                        const allData = await allResponse.json();
                        const updatedGroup = allData.submissionGroups?.find(
                            (g: SubmissionGroup) =>
                                g.submissionGroupId ===
                                selectedGroup.submissionGroupId
                        );
                        if (updatedGroup) {
                            setSelectedGroup(updatedGroup);
                        }
                    }
                } else {
                    setSelectedGroup(null);
                }
                setSelectedImages(new Set());
                setShowRejectModal(false);
                setRejectionReason('');
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Ablehnen');
            }
        } catch (error) {
            console.error('Error rejecting:', error);
            setError('Fehler beim Ablehnen');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        setProcessing(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id: imageId }),
            });

            if (response.ok) {
                await fetchSubmissionGroups();
                // Update selectedGroup with fresh data if modal is open
                if (selectedGroup) {
                    const allResponse = await fetch(
                        '/api/admin/shared-gallery'
                    );
                    if (allResponse.ok) {
                        const allData = await allResponse.json();
                        const updatedGroup = allData.submissionGroups?.find(
                            (g: SubmissionGroup) =>
                                g.submissionGroupId ===
                                selectedGroup.submissionGroupId
                        );
                        if (updatedGroup) {
                            setSelectedGroup(updatedGroup);
                        } else {
                            setSelectedGroup(null);
                        }
                    }
                }
                setSelectedImages(new Set());
                setViewingImage(null);
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Löschen');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            setError('Fehler beim Löschen');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (group: SubmissionGroup) => {
        if (
            group.pendingCount > 0 &&
            group.approvedCount === 0 &&
            group.rejectedCount === 0
        ) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock size={12} className="mr-1" />
                    Ausstehend
                </span>
            );
        } else if (
            group.approvedCount > 0 &&
            group.rejectedCount === 0 &&
            group.pendingCount === 0
        ) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    Freigegeben
                </span>
            );
        } else if (
            group.rejectedCount > 0 &&
            group.approvedCount === 0 &&
            group.pendingCount === 0
        ) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle size={12} className="mr-1" />
                    Abgelehnt
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Gemischt
                </span>
            );
        }
    };

    return (
        <SharedGalleryImageProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <button
                                    onClick={() =>
                                        router.push('/admin/dashboard')
                                    }
                                    className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                        <Images className="w-8 h-8 mr-3 text-blue-600" />
                                        Impressionen verwalten
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Eingereichte Foto-Sammlungen prüfen und
                                        freigeben
                                    </p>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="hidden md:flex space-x-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {totalPending}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Wartend
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {totalApproved}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Freigegeben
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                        {totalRejected}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Abgelehnt
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        router.push(
                                            '/admin/shared-gallery/meldungen'
                                        )
                                    }
                                    className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <WarningIcon size={20} />
                                    Meldungen
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Filter Tabs */}
                        <div className="py-6">
                            <div className="mb-6">
                                <div className="border-b border-gray-200">
                                    <nav className="-mb-px flex space-x-8">
                                        {[
                                            {
                                                key: 'all',
                                                label: 'Alle',
                                                count: allGroups.length,
                                            },
                                            {
                                                key: 'pending',
                                                label: 'Wartend',
                                                count: allGroups.filter(
                                                    (g) => g.pendingCount > 0
                                                ).length,
                                            },
                                            {
                                                key: 'approved',
                                                label: 'Freigegeben',
                                                count: allGroups.filter(
                                                    (g) => g.approvedCount > 0
                                                ).length,
                                            },
                                            {
                                                key: 'rejected',
                                                label: 'Abgelehnt',
                                                count: allGroups.filter(
                                                    (g) => g.rejectedCount > 0
                                                ).length,
                                            },
                                        ].map((tab) => (
                                            <button
                                                key={tab.key}
                                                onClick={() =>
                                                    setFilterStatus(
                                                        tab.key as
                                                            | 'all'
                                                            | 'pending'
                                                            | 'approved'
                                                            | 'rejected'
                                                    )
                                                }
                                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                                    filterStatus === tab.key
                                                        ? 'border-blue-500 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                {tab.label}
                                                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                                                    {tab.count}
                                                </span>
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
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

                            {/* Mobile Meldungen Button */}
                            <div className="md:hidden mb-4">
                                <button
                                    onClick={() =>
                                        router.push(
                                            '/admin/shared-gallery/meldungen'
                                        )
                                    }
                                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <WarningIcon size={20} />
                                    Meldungen anzeigen
                                </button>
                            </div>

                            {/* Submissions Grid */}
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">
                                        Lade Einreichungen...
                                    </p>
                                </div>
                            ) : submissionGroups.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Images className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Keine Einreichungen gefunden
                                    </h3>
                                    <p className="text-gray-500">
                                        {filterStatus === 'all'
                                            ? 'Es wurden noch keine Foto-Sammlungen eingereicht.'
                                            : filterStatus === 'pending'
                                            ? 'Keine Einreichungen mit Status "Wartend".'
                                            : filterStatus === 'approved'
                                            ? 'Keine Einreichungen mit Status "Freigegeben".'
                                            : 'Keine Einreichungen mit Status "Abgelehnt".'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {submissionGroups.map((group) => (
                                        <div
                                            key={group.submissionGroupId}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-xl font-bold text-gray-900">
                                                                {group.title}
                                                            </h3>
                                                            {getStatusBadge(
                                                                group
                                                            )}
                                                        </div>
                                                        {group.submitterNames
                                                            .length > 0 && (
                                                            <p className="text-gray-600 text-sm mb-1">
                                                                Von:{' '}
                                                                <strong>
                                                                    {group
                                                                        .submitterNames
                                                                        .length ===
                                                                    1
                                                                        ? group
                                                                              .submitterNames[0]
                                                                        : `${
                                                                              group
                                                                                  .submitterNames[0]
                                                                          } und ${
                                                                              group
                                                                                  .submitterNames
                                                                                  .length -
                                                                              1
                                                                          } weitere`}
                                                                </strong>
                                                            </p>
                                                        )}
                                                        {group.description && (
                                                            <p className="text-gray-600 text-sm mb-2">
                                                                {
                                                                    group.description
                                                                }
                                                            </p>
                                                        )}
                                                        <p className="text-gray-500 text-xs">
                                                            Eingereicht am{' '}
                                                            {new Date(
                                                                group.submittedAt
                                                            ).toLocaleDateString(
                                                                'de-DE'
                                                            )}{' '}
                                                            • {group.totalCount}{' '}
                                                            Foto
                                                            {group.totalCount !==
                                                            1
                                                                ? 's'
                                                                : ''}
                                                            {group.pendingCount >
                                                                0 &&
                                                                ` (${group.pendingCount} ausstehend)`}
                                                            {group.approvedCount >
                                                                0 &&
                                                                ` (${group.approvedCount} freigegeben)`}
                                                            {group.rejectedCount >
                                                                0 &&
                                                                ` (${group.rejectedCount} abgelehnt)`}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Image Grid */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                                                    {group.images
                                                        .slice(0, 6)
                                                        .map((image) => (
                                                            <div
                                                                key={image.id}
                                                                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                                                            >
                                                                <LazySharedGalleryImage
                                                                    imageId={
                                                                        image.id
                                                                    }
                                                                    alt="Foto"
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 16vw"
                                                                />
                                                                {image.status !==
                                                                    'pending' && (
                                                                    <div
                                                                        className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                                                                            image.status ===
                                                                            'approved'
                                                                                ? 'bg-green-500'
                                                                                : 'bg-red-500'
                                                                        }`}
                                                                    >
                                                                        {image.status ===
                                                                        'approved' ? (
                                                                            <Check
                                                                                size={
                                                                                    14
                                                                                }
                                                                                className="text-white"
                                                                            />
                                                                        ) : (
                                                                            <X
                                                                                size={
                                                                                    14
                                                                                }
                                                                                className="text-white"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    {group.images.length >
                                                        6 && (
                                                        <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                                                            +
                                                            {group.images
                                                                .length - 6}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedGroup(
                                                                group
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Details ansehen
                                                    </button>
                                                    {group.pendingCount > 0 && (
                                                        <>
                                                            {canEdit && (
                                                                <button
                                                                    onClick={() =>
                                                                        setGroupToApprove(
                                                                            group.submissionGroupId
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400"
                                                                >
                                                                    Alle
                                                                    freigeben
                                                                </button>
                                                            )}
                                                            {canEdit && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedGroup(
                                                                            group
                                                                        );
                                                                        setRejectAction(
                                                                            'all'
                                                                        );
                                                                        setShowRejectModal(
                                                                            true
                                                                        );
                                                                    }}
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400"
                                                                >
                                                                    Alle
                                                                    ablehnen
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                    {canEdit &&
                                                        (group.approvedCount >
                                                            0 ||
                                                            group.rejectedCount >
                                                                0) && (
                                                            <button
                                                                onClick={() =>
                                                                    setGroupToReset(
                                                                        group.submissionGroupId
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-300"
                                                            >
                                                                Zurücksetzen
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div className="mt-6 text-center">
                                            <button
                                                onClick={handleLoadMore}
                                                disabled={loadingMore}
                                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400"
                                            >
                                                {loadingMore ? (
                                                    <span className="flex items-center gap-2">
                                                        <LoadingSpinner
                                                            size="sm"
                                                            color="white"
                                                        />
                                                        Laden...
                                                    </span>
                                                ) : (
                                                    `Mehr laden (${allGroups.length} von ${totalGroups})`
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Detail Modal */}
                {selectedGroup && !showRejectModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {selectedGroup.title}
                                        </h3>
                                        {getStatusBadge(selectedGroup)}
                                    </div>
                                    {selectedGroup.submitterNames.length >
                                        0 && (
                                        <p className="text-gray-600">
                                            Eingereicht von{' '}
                                            <strong>
                                                {selectedGroup.submitterNames.join(
                                                    ', '
                                                )}
                                            </strong>
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedGroup(null);
                                        setSelectedImages(new Set());
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6">
                                {selectedGroup.description && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            Beschreibung
                                        </h4>
                                        <p className="text-gray-700">
                                            {selectedGroup.description}
                                        </p>
                                    </div>
                                )}

                                {/* Image Selection Grid */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-semibold text-gray-900">
                                            Fotos ({selectedGroup.totalCount})
                                        </h4>
                                        {selectedImages.size > 0 && (
                                            <span className="text-sm text-gray-600">
                                                {selectedImages.size} ausgewählt
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {selectedGroup.images.map((image) => (
                                            <div
                                                key={image.id}
                                                className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer border-4 transition-colors ${
                                                    selectedImages.has(image.id)
                                                        ? 'border-blue-500'
                                                        : 'border-transparent hover:border-blue-200'
                                                }`}
                                                onClick={() => {
                                                    const newSelected = new Set(
                                                        selectedImages
                                                    );
                                                    if (
                                                        newSelected.has(
                                                            image.id
                                                        )
                                                    ) {
                                                        newSelected.delete(
                                                            image.id
                                                        );
                                                    } else {
                                                        newSelected.add(
                                                            image.id
                                                        );
                                                    }
                                                    setSelectedImages(
                                                        newSelected
                                                    );
                                                }}
                                                onContextMenu={(e) => {
                                                    e.preventDefault();
                                                    setViewingImage(image);
                                                }}
                                            >
                                                <LazySharedGalleryImage
                                                    imageId={image.id}
                                                    alt="Foto"
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                                    onLoad={(imageUrl) => {
                                                        // Store loaded image URL for viewing
                                                        image.imageUrl =
                                                            imageUrl;
                                                    }}
                                                />
                                                {image.status !== 'pending' && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div
                                                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                                image.status ===
                                                                'approved'
                                                                    ? 'bg-green-500'
                                                                    : 'bg-red-500'
                                                            }`}
                                                        >
                                                            {image.status ===
                                                            'approved' ? (
                                                                <Check
                                                                    size={24}
                                                                    className="text-white"
                                                                />
                                                            ) : (
                                                                <X
                                                                    size={24}
                                                                    className="text-white"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                {selectedImages.has(
                                                    image.id
                                                ) && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <Check
                                                            size={16}
                                                            className="text-white"
                                                        />
                                                    </div>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setViewingImage(image);
                                                    }}
                                                    className="absolute top-2 left-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
                                                    title="Details anzeigen"
                                                >
                                                    <svg
                                                        className="w-5 h-5 text-gray-700"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                </button>
                                                {image.description && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2">
                                                        {image.description}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                    {canEdit &&
                                        selectedGroup.pendingCount > 0 && (
                                            <button
                                                onClick={() =>
                                                    setGroupToApprove(
                                                        selectedGroup.submissionGroupId
                                                    )
                                                }
                                                disabled={processing}
                                                className="flex-1 min-w-[150px] px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:bg-gray-400"
                                            >
                                                {processing ? (
                                                    <LoadingSpinner
                                                        size="sm"
                                                        color="white"
                                                    />
                                                ) : (
                                                    'Alle freigeben'
                                                )}
                                            </button>
                                        )}
                                    {canEdit &&
                                        (selectedGroup.approvedCount > 0 ||
                                            selectedGroup.rejectedCount >
                                                0) && (
                                            <button
                                                onClick={() =>
                                                    handleResetAll(
                                                        selectedGroup.submissionGroupId
                                                    )
                                                }
                                                disabled={processing}
                                                className="flex-1 min-w-[150px] px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium disabled:bg-gray-300"
                                            >
                                                Alle zurücksetzen
                                            </button>
                                        )}
                                    {selectedImages.size > 0 &&
                                        (() => {
                                            const selectedImagesData =
                                                selectedGroup.images.filter(
                                                    (img) =>
                                                        selectedImages.has(
                                                            img.id
                                                        )
                                                );
                                            const hasApproved =
                                                selectedImagesData.some(
                                                    (img) =>
                                                        img.status ===
                                                        'approved'
                                                );
                                            const hasRejected =
                                                selectedImagesData.some(
                                                    (img) =>
                                                        img.status ===
                                                        'rejected'
                                                );
                                            const allApproved =
                                                selectedImagesData.every(
                                                    (img) =>
                                                        img.status ===
                                                        'approved'
                                                );
                                            const allRejected =
                                                selectedImagesData.every(
                                                    (img) =>
                                                        img.status ===
                                                        'rejected'
                                                );

                                            return (
                                                <>
                                                    {canEdit &&
                                                        !allApproved && (
                                                            <button
                                                                onClick={() =>
                                                                    setConfirmApproveSelected(
                                                                        true
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="flex-1 min-w-[150px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:bg-gray-400"
                                                            >
                                                                Ausgewählte
                                                                freigeben (
                                                                {
                                                                    selectedImages.size
                                                                }
                                                                )
                                                            </button>
                                                        )}
                                                    {canEdit &&
                                                        (hasApproved ||
                                                            hasRejected) && (
                                                            <button
                                                                onClick={() =>
                                                                    setConfirmResetSelected(
                                                                        true
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="flex-1 min-w-[150px] px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:bg-gray-400"
                                                            >
                                                                Ausgewählte
                                                                zurücksetzen (
                                                                {
                                                                    selectedImages.size
                                                                }
                                                                )
                                                            </button>
                                                        )}
                                                    {canEdit &&
                                                        !allRejected && (
                                                            <button
                                                                onClick={() => {
                                                                    setRejectAction(
                                                                        'selected'
                                                                    );
                                                                    setShowRejectModal(
                                                                        true
                                                                    );
                                                                }}
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="flex-1 min-w-[150px] px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium disabled:bg-gray-400"
                                                            >
                                                                Ausgewählte
                                                                ablehnen (
                                                                {
                                                                    selectedImages.size
                                                                }
                                                                )
                                                            </button>
                                                        )}
                                                </>
                                            );
                                        })()}
                                    {canEdit &&
                                        selectedGroup.pendingCount > 0 && (
                                            <button
                                                onClick={() => {
                                                    setRejectAction('all');
                                                    setShowRejectModal(true);
                                                }}
                                                disabled={processing}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:bg-gray-400"
                                            >
                                                Alle ablehnen
                                            </button>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reject Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {rejectAction === 'all'
                                    ? 'Alle Fotos ablehnen'
                                    : `${selectedImages.size} Foto(s) ablehnen`}
                            </h3>
                            <p className="text-gray-700 mb-4">
                                Möchten Sie wirklich{' '}
                                {rejectAction === 'all'
                                    ? 'alle Fotos'
                                    : 'die ausgewählten Fotos'}{' '}
                                ablehnen?
                            </p>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Grund (optional)
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) =>
                                        setRejectionReason(e.target.value)
                                    }
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
                    </div>
                )}

                {/* Image Detail Modal */}
                {viewingImage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                        onClick={() => setViewingImage(null)}
                    >
                        <div
                            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Foto-Details
                                </h3>
                                <div className="flex items-center gap-2">
                                    {canDelete && (
                                        <button
                                            onClick={() =>
                                                setImageToDelete(viewingImage)
                                            }
                                            className="text-red-600 hover:text-red-800"
                                            title="Foto löschen"
                                        >
                                            <Trash size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setViewingImage(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Image Preview */}
                                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                        {viewingImage.imageUrl ? (
                                            <Image
                                                src={viewingImage.imageUrl}
                                                alt="Foto"
                                                fill
                                                className="object-contain"
                                                unoptimized
                                            />
                                        ) : (
                                            <LazySharedGalleryImage
                                                imageId={viewingImage.id}
                                                alt="Foto"
                                                fill
                                                className="object-contain"
                                                onLoad={(imageUrl) => {
                                                    viewingImage.imageUrl =
                                                        imageUrl;
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Metadata */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                                Status
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                {viewingImage.status ===
                                                    'pending' && (
                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-1">
                                                        <Clock size={16} />
                                                        Ausstehend
                                                    </span>
                                                )}
                                                {viewingImage.status ===
                                                    'approved' && (
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                                                        <CheckCircle
                                                            size={16}
                                                        />
                                                        Freigegeben
                                                    </span>
                                                )}
                                                {viewingImage.status ===
                                                    'rejected' && (
                                                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-1">
                                                        <XCircle size={16} />
                                                        Abgelehnt
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {viewingImage.submitterName && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                                    Eingereicht von
                                                </h4>
                                                <p className="text-gray-900">
                                                    {viewingImage.submitterName}
                                                </p>
                                            </div>
                                        )}

                                        {viewingImage.submitterEmail && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                                    E-Mail
                                                </h4>
                                                <a
                                                    href={`mailto:${viewingImage.submitterEmail}`}
                                                    className="text-blue-600 hover:text-blue-700 underline"
                                                >
                                                    {
                                                        viewingImage.submitterEmail
                                                    }
                                                </a>
                                            </div>
                                        )}

                                        {viewingImage.description && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                                    Beschreibung
                                                </h4>
                                                <p className="text-gray-900">
                                                    {viewingImage.description}
                                                </p>
                                            </div>
                                        )}

                                        {viewingImage.imageFilename && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                                    Dateiname
                                                </h4>
                                                <p
                                                    className="text-gray-900 text-sm font-mono truncate"
                                                    title={
                                                        viewingImage.imageFilename
                                                    }
                                                >
                                                    {viewingImage.imageFilename}
                                                </p>
                                            </div>
                                        )}

                                        {viewingImage.dateTaken && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                                    Aufgenommen am
                                                </h4>
                                                <p className="text-gray-900">
                                                    {new Date(
                                                        viewingImage.dateTaken
                                                    ).toLocaleDateString(
                                                        'de-DE',
                                                        {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                        {viewingImage.location && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                                    GPS-Koordinaten
                                                </h4>
                                                <p className="text-gray-900 text-sm font-mono">
                                                    {viewingImage.location}
                                                </p>
                                                <a
                                                    href={`https://www.google.com/maps?q=${viewingImage.location}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 text-sm underline mt-1 inline-block"
                                                >
                                                    Auf Karte anzeigen
                                                </a>
                                            </div>
                                        )}

                                        {viewingImage.submittedAt && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                                    Eingereicht am
                                                </h4>
                                                <p className="text-gray-900">
                                                    {new Date(
                                                        viewingImage.submittedAt
                                                    ).toLocaleDateString(
                                                        'de-DE',
                                                        {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                        {viewingImage.status === 'rejected' &&
                                            viewingImage.rejectionReason && (
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                    <h4 className="text-sm font-semibold text-red-800 mb-1">
                                                        Ablehnungsgrund
                                                    </h4>
                                                    <p className="text-red-900 text-sm">
                                                        {
                                                            viewingImage.rejectionReason
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                        <div className="pt-4 border-t border-gray-200">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-1">
                                                Foto-ID
                                            </h4>
                                            <p className="text-gray-600 text-xs font-mono">
                                                {viewingImage.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Approve All Dialog */}
                <PromptDialog
                    isOpen={groupToApprove !== null}
                    onCancel={() => setGroupToApprove(null)}
                    onConfirm={async () => {
                        if (groupToApprove) {
                            await handleApproveAll(groupToApprove);
                            setGroupToApprove(null);
                        }
                    }}
                    title="Alle freigeben"
                    description="Möchten Sie alle Fotos dieser Einreichung freigeben?"
                    confirmText="Freigeben"
                    cancelText="Abbrechen"
                    icon={<CheckCircle className="h-12 w-12" />}
                    accentColor="green"
                />

                {/* Reset All Dialog */}
                <PromptDialog
                    isOpen={groupToReset !== null}
                    onCancel={() => setGroupToReset(null)}
                    onConfirm={async () => {
                        if (groupToReset) {
                            await handleResetAll(groupToReset);
                            setGroupToReset(null);
                        }
                    }}
                    title="Alle zurücksetzen"
                    description='Möchten Sie alle Fotos dieser Einreichung auf "Ausstehend" zurücksetzen?'
                    confirmText="Zurücksetzen"
                    cancelText="Abbrechen"
                    icon={<ArrowCounterClockwise className="h-12 w-12" />}
                    accentColor="#374151"
                />

                {/* Approve Selected Dialog */}
                <PromptDialog
                    isOpen={confirmApproveSelected}
                    onCancel={() => setConfirmApproveSelected(false)}
                    onConfirm={async () => {
                        await handleApproveSelected();
                        setConfirmApproveSelected(false);
                    }}
                    title="Ausgewählte freigeben"
                    description={`Möchten Sie ${selectedImages.size} ausgewählte(s) Foto(s) freigeben?`}
                    confirmText="Freigeben"
                    cancelText="Abbrechen"
                    icon={<Check className="h-12 w-12" />}
                    accentColor="blue"
                />

                {/* Reset Selected Dialog */}
                <PromptDialog
                    isOpen={confirmResetSelected}
                    onCancel={() => setConfirmResetSelected(false)}
                    onConfirm={async () => {
                        await handleResetSelected();
                        setConfirmResetSelected(false);
                    }}
                    title="Ausgewählte zurücksetzen"
                    description={`Möchten Sie ${selectedImages.size} ausgewählte(s) Foto(s) auf "Ausstehend" zurücksetzen?`}
                    confirmText="Zurücksetzen"
                    cancelText="Abbrechen"
                    icon={<ArrowCounterClockwise className="h-12 w-12" />}
                    accentColor="#374151"
                />

                {/* Delete Image Dialog */}
                <PromptDialog
                    isOpen={Boolean(imageToDelete)}
                    onCancel={() => setImageToDelete(null)}
                    onConfirm={async () => {
                        if (imageToDelete) {
                            await handleDeleteImage(imageToDelete.id);
                            setImageToDelete(null);
                        }
                    }}
                    title="Foto löschen?"
                    description={`Möchten Sie das Foto wirklich löschen?`}
                    confirmText={processing ? 'Löschen...' : 'Löschen'}
                    cancelText="Abbrechen"
                    icon={<Trash className="h-12 w-12" weight="duotone" />}
                    accentColor="red"
                />
            </div>
        </SharedGalleryImageProvider>
    );
}
