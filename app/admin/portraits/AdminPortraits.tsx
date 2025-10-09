'use client';

import { useState } from 'react';
import {
    Check,
    X,
    Eye,
    Trash,
    Clock,
    CheckCircle,
    XCircle,
    EnvelopeSimple,
    Calendar,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';

interface PortraitSubmission {
    id: number;
    name: string;
    description: string;
    email: string;
    imageData: string;
    imageMimeType: string;
    imageFilename: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface AdminPortraitsProps {
    submissions: PortraitSubmission[];
    onSubmissionsUpdate: () => void;
}

export default function AdminPortraits({
    submissions,
    onSubmissionsUpdate,
}: AdminPortraitsProps) {
    const [selectedSubmission, setSelectedSubmission] =
        useState<PortraitSubmission | null>(null);
    const [filterStatus, setFilterStatus] = useState<
        'all' | 'pending' | 'approved' | 'rejected'
    >('all');
    const [isActionLoading, setIsActionLoading] = useState<number | null>(null);

    const getImageUrl = (submission: PortraitSubmission): string => {
        return `data:${submission.imageMimeType};base64,${submission.imageData}`;
    };

    const filteredSubmissions = submissions.filter((submission) => {
        if (filterStatus === 'all') return true;
        return submission.status === filterStatus;
    });

    const handleApprove = async (id: number) => {
        setIsActionLoading(id);
        try {
            const response = await fetch('/api/admin/portraits', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'approve' }),
            });

            if (response.ok) {
                onSubmissionsUpdate();
                setSelectedSubmission(null);
            } else {
                const error = await response.json();
                alert(`Fehler: ${error.message}`);
            }
        } catch (error) {
            console.error('Error approving submission:', error);
            alert('Fehler beim Freigeben der Einreichung');
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleReject = async (id: number) => {
        setIsActionLoading(id);
        try {
            const response = await fetch('/api/admin/portraits', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'reject' }),
            });

            if (response.ok) {
                onSubmissionsUpdate();
                setSelectedSubmission(null);
            } else {
                const error = await response.json();
                alert(`Fehler: ${error.message}`);
            }
        } catch (error) {
            console.error('Error rejecting submission:', error);
            alert('Fehler beim Ablehnen der Einreichung');
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (
            !confirm(
                'Sind Sie sicher, dass Sie diese Einreichung löschen möchten?'
            )
        ) {
            return;
        }

        setIsActionLoading(id);
        try {
            const response = await fetch('/api/admin/portraits', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                onSubmissionsUpdate();
                setSelectedSubmission(null);
            } else {
                const error = await response.json();
                alert(`Fehler: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
            alert('Fehler beim Löschen der Einreichung');
        } finally {
            setIsActionLoading(null);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
        switch (status) {
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Wartend';
            case 'approved':
                return 'Freigegeben';
            case 'rejected':
                return 'Abgelehnt';
            default:
                return status;
        }
    };

    return (
        <div className="py-6">
            {/* Filter Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            {
                                key: 'all',
                                label: 'Alle',
                                count: submissions.length,
                            },
                            {
                                key: 'pending',
                                label: 'Wartend',
                                count: submissions.filter(
                                    (s) => s.status === 'pending'
                                ).length,
                            },
                            {
                                key: 'approved',
                                label: 'Freigegeben',
                                count: submissions.filter(
                                    (s) => s.status === 'approved'
                                ).length,
                            },
                            {
                                key: 'rejected',
                                label: 'Abgelehnt',
                                count: submissions.filter(
                                    (s) => s.status === 'rejected'
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
                                        ? 'border-green-500 text-green-600'
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

            {/* Submissions List */}
            {filteredSubmissions.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Eye className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Keine Einreichungen gefunden
                    </h3>
                    <p className="text-gray-500">
                        {filterStatus === 'all'
                            ? 'Es wurden noch keine Portrait-Einreichungen eingereicht.'
                            : `Keine Einreichungen mit Status "${getStatusText(
                                  filterStatus
                              )}".`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubmissions.map((submission) => (
                        <div
                            key={submission.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gray-100">
                                <Image
                                    src={getImageUrl(submission)}
                                    alt={`Portrait von ${submission.name}`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    {getStatusIcon(submission.status)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {submission.name}
                                    </h3>
                                    <span
                                        className={getStatusBadge(
                                            submission.status
                                        )}
                                    >
                                        {getStatusText(submission.status)}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                    {submission.description}
                                </p>

                                <div className="flex items-center text-xs text-gray-500 mb-4">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(
                                        submission.submittedAt
                                    ).toLocaleDateString('de-DE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    {submission.email && (
                                        <>
                                            <EnvelopeSimple className="w-3 h-3 ml-3 mr-1" />
                                            <span className="truncate">
                                                {submission.email}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() =>
                                            setSelectedSubmission(submission)
                                        }
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center"
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Details
                                    </button>

                                    {submission.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleApprove(submission.id)
                                                }
                                                disabled={
                                                    isActionLoading ===
                                                    submission.id
                                                }
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors disabled:bg-gray-400 flex items-center justify-center"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleReject(submission.id)
                                                }
                                                disabled={
                                                    isActionLoading ===
                                                    submission.id
                                                }
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors disabled:bg-gray-400 flex items-center justify-center"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}

                                    <button
                                        onClick={() =>
                                            handleDelete(submission.id)
                                        }
                                        disabled={
                                            isActionLoading === submission.id
                                        }
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors disabled:bg-gray-400 flex items-center justify-center"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setSelectedSubmission(null)}
                        ></div>

                        <div className="relative inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-2xl w-full mx-4">
                            <div className="bg-white px-6 pt-6 pb-4">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {selectedSubmission.name}
                                        </h3>
                                        <div className="flex items-center space-x-3">
                                            <span
                                                className={getStatusBadge(
                                                    selectedSubmission.status
                                                )}
                                            >
                                                {getStatusText(
                                                    selectedSubmission.status
                                                )}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(
                                                    selectedSubmission.submittedAt
                                                ).toLocaleDateString('de-DE', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setSelectedSubmission(null)
                                        }
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Image */}
                                <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                                    <Image
                                        src={getImageUrl(selectedSubmission)}
                                        alt={`Portrait von ${selectedSubmission.name}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                                        Beschreibung:
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {selectedSubmission.description}
                                    </p>
                                </div>

                                {/* Email */}
                                {selectedSubmission.email && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                                            E-Mail:
                                        </h4>
                                        <a
                                            href={`mailto:${selectedSubmission.email}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {selectedSubmission.email}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                                {selectedSubmission.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleApprove(
                                                    selectedSubmission.id
                                                )
                                            }
                                            disabled={
                                                isActionLoading ===
                                                selectedSubmission.id
                                            }
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:bg-gray-400 flex items-center"
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Freigeben
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleReject(
                                                    selectedSubmission.id
                                                )
                                            }
                                            disabled={
                                                isActionLoading ===
                                                selectedSubmission.id
                                            }
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:bg-gray-400 flex items-center"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Ablehnen
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() =>
                                        handleDelete(selectedSubmission.id)
                                    }
                                    disabled={
                                        isActionLoading ===
                                        selectedSubmission.id
                                    }
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:bg-gray-400 flex items-center"
                                >
                                        <Trash className="w-4 h-4 mr-2" />
                                    Löschen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
