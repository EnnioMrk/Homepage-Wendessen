'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
interface PendingTask {
    type: 'portrait' | 'shared_gallery';
    count: number;
    label: string;
    href: string;
}

interface PendingTasksResponse {
    tasks: PendingTask[];
    totalCount: number;
}

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [tasks, setTasks] = useState<PendingTask[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await fetch('/api/admin/pending-tasks');
                if (response.ok) {
                    const data: PendingTasksResponse = await response.json();
                    setTasks(data.tasks);
                    setTotalCount(data.totalCount);
                }
            } catch (error) {
                console.error('Error fetching pending tasks:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTasks();

        // Refresh every 60 seconds
        const interval = setInterval(fetchTasks, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn--sm"
                style={{
                    background: 'transparent',
                    color: 'var(--pine-ink)',
                    borderColor: '#3a5446',
                }}
                aria-expanded={isOpen}
                aria-label={
                    totalCount > 0
                        ? `Aufgaben: ${totalCount} offen`
                        : 'Aufgaben'
                }
            >
                Aufgaben
                {totalCount > 0 ? ` · ${totalCount > 99 ? '99+' : totalCount}` : ''}
            </button>

            {isOpen && (
                <div
                    className="panel"
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 'calc(100% + 8px)',
                        width: 300,
                        zIndex: 120,
                    }}
                >
                    <div className="panel-head">
                        <h2>Ausstehende Aufgaben</h2>
                    </div>
                    {isLoading ? (
                        <p className="admin-empty">Wird geladen …</p>
                    ) : tasks.length === 0 ? (
                        <p className="admin-empty">Nichts offen.</p>
                    ) : (
                        <ul>
                            {tasks.map((task) => (
                                <li key={task.type}>
                                    <Link
                                        href={task.href}
                                        onClick={() => setIsOpen(false)}
                                        className="tally"
                                        style={{ padding: '10px var(--s3)' }}
                                    >
                                        <span>{task.label}</span>
                                        <strong>{task.count}</strong>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
