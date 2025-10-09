'use client';

import AdminPortraits from './AdminPortraits';
import { useState, useEffect } from 'react';
import { ArrowLeft, UsersThree } from '@phosphor-icons/react/dist/ssr';

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

export default function AdminPortraitsPage() {
    const [submissions, setSubmissions] = useState<PortraitSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSubmissions = async (showLoadingScreen = false) => {
        try {
            if (showLoadingScreen) {
                setLoading(true);
            }

            const response = await fetch(
                `/api/admin/portraits?t=${Date.now()}`,
                {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to load portrait submissions');
            }

            const data = await response.json();
            setSubmissions(data);
            setError(null);
        } catch (err) {
            console.error('Error loading submissions:', err);
            setError('Fehler beim Laden der Portrait-Einreichungen');
        } finally {
            if (showLoadingScreen) {
                setLoading(false);
            }
        }
    };

    const refreshSubmissions = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        await loadSubmissions(false);
    };

    useEffect(() => {
        const checkAuthAndLoadSubmissions = async () => {
            try {
                const authResponse = await fetch('/api/admin/status');
                if (!authResponse.ok) {
                    window.location.href = '/admin/login';
                    return;
                }

                await loadSubmissions(true);
            } catch (err) {
                console.error('Error during initialization:', err);
                setError('Fehler beim Laden der Portrait-Einreichungen');
                setLoading(false);
            }
        };

        checkAuthAndLoadSubmissions();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Lade Portrait-Einreichungen...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Fehler beim Laden der Portrait-Einreichungen
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Die Portrait-Einreichungen konnten nicht geladen werden.
                    </p>
                    <a
                        href="/admin/dashboard"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        ← Zurück zum Dashboard
                    </a>
                </div>
            </div>
        );
    }

    const pendingCount = submissions.filter(
        (s) => s.status === 'pending'
    ).length;
    const approvedCount = submissions.filter(
        (s) => s.status === 'approved'
    ).length;
    const rejectedCount = submissions.filter(
        (s) => s.status === 'rejected'
    ).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <a
                                href="/admin/dashboard"
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </a>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    <UsersThree className="w-8 h-8 mr-3 text-green-600" />
                                    Portrait-Einreichungen
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Portrait-Einreichungen verwalten und
                                    freigeben
                                </p>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="hidden md:flex space-x-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {pendingCount}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Wartend
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {approvedCount}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Freigegeben
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {rejectedCount}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Abgelehnt
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <AdminPortraits
                        submissions={submissions}
                        onSubmissionsUpdate={refreshSubmissions}
                    />
                </div>
            </main>
        </div>
    );
}
