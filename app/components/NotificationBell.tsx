'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, UsersThree, ImageSquare } from '@phosphor-icons/react/dist/ssr';

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

function getTaskIcon(type: string) {
    switch (type) {
        case 'portrait':
            return <UsersThree className="w-5 h-5 text-emerald-600" />;
        case 'shared_gallery':
            return <ImageSquare className="w-5 h-5 text-pink-600" />;
        default:
            return <Bell className="w-5 h-5 text-gray-600" />;
    }
}

function getTaskColor(type: string) {
    switch (type) {
        case 'portrait':
            return 'hover:bg-emerald-50';
        case 'shared_gallery':
            return 'hover:bg-pink-50';
        default:
            return 'hover:bg-gray-50';
    }
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
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Benachrichtigungen"
            >
                <Bell className="w-6 h-6" />
                {totalCount > 0 && (
                    <span className="absolute top-0 right-0 text-xs font-bold text-red-500">
                        {totalCount > 99 ? '99+' : totalCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Ausstehende Aufgaben
                        </h3>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {isLoading ? (
                            <div className="px-4 py-6 text-center text-sm text-gray-500">
                                Laden...
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="px-4 py-6 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-sm text-gray-600">
                                    Keine ausstehenden Aufgaben
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Alles erledigt! 🎉
                                </p>
                            </div>
                        ) : (
                            <ul className="py-2">
                                {tasks.map((task) => (
                                    <li key={task.type}>
                                        <Link
                                            href={task.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 ${getTaskColor(
                                                task.type
                                            )} transition-colors`}
                                        >
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                {getTaskIcon(task.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {task.label}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Klicken zum Bearbeiten
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-white bg-red-500 rounded-full">
                                                    {task.count}
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {tasks.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                            <p className="text-xs text-gray-500 text-center">
                                {totalCount}{' '}
                                {totalCount === 1 ? 'Aufgabe' : 'Aufgaben'}{' '}
                                insgesamt
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
