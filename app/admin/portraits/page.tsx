'use client';

import AdminPortraits from './AdminPortraits';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePermissions } from '@/lib/usePermissions';
import { AdminHead } from '@/app/components/admin/AdminPage';

interface PortraitSubmission {
    id: number;
    name: string;
    description: string;
    email: string;
    imageUrl: string;
    imageStoragePath?: string;
    imageMimeType: string;
    imageFilename: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

export default function AdminPortraitsPage() {
    const { hasPermission, loading: permissionsLoading } = usePermissions();
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
                },
            );

            if (!response.ok) {
                throw new Error('Failed to load portrait submissions');
            }

            const data = await response.json();
            setSubmissions(data);
            setError(null);
        } catch (loadError) {
            console.error('Error loading submissions:', loadError);
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
            } catch (initError) {
                console.error('Error during initialization:', initError);
                setError('Fehler beim Laden der Portrait-Einreichungen');
                setLoading(false);
            }
        };

        checkAuthAndLoadSubmissions();
    }, []);

    const pendingCount = submissions.filter(
        (submission) => submission.status === 'pending',
    ).length;

    if (loading || permissionsLoading) {
        return (
            <div>
                <AdminHead
                    title="Portrait-Einreichungen"
                    sub="Gästebuch der Gesichter"
                />
                <div className="panel">
                    <div className="panel-body">
                        <p className="muted">
                            Lade Portrait-Einreichungen …
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasPermission('portraits.view')) {
        return (
            <div>
                <AdminHead
                    title="Portrait-Einreichungen"
                    sub="Gästebuch der Gesichter"
                />
                <div className="empty">
                    <h3>Keine Berechtigung</h3>
                    <p>
                        Sie haben keine Berechtigung, Portraits zu verwalten.
                        Wenden Sie sich an die Redaktionsleitung.
                    </p>
                    <Link className="btn btn--quiet" href="/admin/dashboard">
                        Zurück zum Schreibtisch
                    </Link>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <AdminHead
                    title="Portrait-Einreichungen"
                    sub="Gästebuch der Gesichter"
                />
                <div className="notice notice--error" role="alert">
                    <strong>Einreichungen nicht geladen</strong>
                    <span>
                        Die Portrait-Einreichungen konnten nicht geladen
                        werden. Prüfen Sie die Verbindung und versuchen Sie es
                        erneut.
                    </span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--s2)',
                        marginTop: 'var(--s4)',
                    }}
                >
                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => loadSubmissions(true)}
                    >
                        Erneut laden
                    </button>
                    <Link className="btn btn--quiet" href="/admin/dashboard">
                        Zurück zum Schreibtisch
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminHead
                title="Portrait-Einreichungen"
                sub={`${submissions.length} ${
                    submissions.length === 1 ? 'Einreichung' : 'Einreichungen'
                } · ${pendingCount} wartend`}
            />
            <AdminPortraits
                submissions={submissions}
                onSubmissionsUpdate={refreshSubmissions}
            />
        </div>
    );
}
