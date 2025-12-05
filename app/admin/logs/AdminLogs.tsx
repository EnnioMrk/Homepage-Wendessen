'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    ClockCounterClockwise,
    User,
    Calendar,
    Funnel,
    CaretLeft,
    CaretRight,
    MagnifyingGlass,
} from '@phosphor-icons/react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import {
    getActionDescription,
    getActionColor,
    getLogSentence,
} from '@/lib/admin-log-utils';

interface LogEntry {
    id: number;
    userId: number | null;
    username: string | null;
    action: string;
    resourceType: string | null;
    resourceId: string | null;
    resourceTitle: string | null;
    details: Record<string, unknown> | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
}

const actionFilters = [
    { value: '', label: 'Alle Aktionen' },
    { value: 'event', label: 'Termine' },
    { value: 'news', label: 'Neuigkeiten' },
    { value: 'gallery', label: 'Galerie' },
    { value: 'shared_gallery', label: 'Impressionen' },
    { value: 'portrait', label: 'Portraits' },
    { value: 'user', label: 'Benutzer' },
    { value: 'settings', label: 'Einstellungen' },
    { value: 'auth', label: 'Anmeldung' },
    { value: 'archive', label: 'Archiv' },
];

export default function AdminLogs() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [actionFilter, setActionFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '30',
            });
            if (actionFilter) {
                params.set('action', actionFilter);
            }

            const response = await fetch(`/api/admin/logs?${params}`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs);
                setTotalPages(data.totalPages);
                setTotal(data.total);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    }, [page, actionFilter]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const filteredLogs = searchQuery
        ? logs.filter(
              (log) =>
                  log.username
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                  log.resourceTitle
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                  getActionDescription(log.action)
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                  getLogSentence(log)
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
          )
        : logs;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Gerade eben';
        if (diffMins < 60) return `vor ${diffMins} Min.`;
        if (diffHours < 24) return `vor ${diffHours} Std.`;
        if (diffDays < 7) return `vor ${diffDays} Tagen`;

        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                href="/admin/dashboard"
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    <ClockCounterClockwise className="w-8 h-8 mr-3 text-gray-600" />
                                    Aktivitätslog
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {total} Einträge insgesamt
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Suchen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
                            />
                        </div>

                        {/* Action Filter */}
                        <div className="flex items-center gap-2">
                            <Funnel className="w-5 h-5 text-gray-500" />
                            <select
                                value={actionFilter}
                                onChange={(e) => {
                                    setActionFilter(e.target.value);
                                    setPage(1);
                                }}
                                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-gray-900"
                            >
                                {actionFilters.map((filter) => (
                                    <option
                                        key={filter.value}
                                        value={filter.value}
                                    >
                                        {filter.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Logs List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner
                            size="lg"
                            text="Lade Aktivitätslog..."
                        />
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <ClockCounterClockwise className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Keine Einträge gefunden</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {filteredLogs.map((log) => (
                                <div
                                    key={log.id}
                                    className="p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar/Icon */}
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-gray-500" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getActionColor(
                                                        log.action
                                                    )}`}
                                                >
                                                    {getActionDescription(
                                                        log.action
                                                    )}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-900">
                                                {getLogSentence(log)}
                                            </p>

                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {formatDate(log.createdAt)}
                                                </span>
                                                {log.ipAddress && (
                                                    <span>
                                                        IP: {log.ipAddress}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Seite {page} von {totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            setPage((p) => Math.max(1, p - 1))
                                        }
                                        disabled={page === 1}
                                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CaretLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setPage((p) =>
                                                Math.min(totalPages, p + 1)
                                            )
                                        }
                                        disabled={page === totalPages}
                                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CaretRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
