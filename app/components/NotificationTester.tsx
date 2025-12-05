'use client';

import { useState } from 'react';
import {
    Bell,
    Send,
    Users,
    Image as ImageIcon,
    User,
    Clock,
} from 'lucide-react';

interface TestResult {
    success: boolean;
    message: string;
    details?: {
        total: number;
        successful: number;
    } | {
        portraits: { checked: number; sent: number };
        sharedGallery: { checked: number; sent: number };
        total: { checked: number; sent: number };
    };
}

export default function NotificationTester() {
    const [loading, setLoading] = useState<string | null>(null);
    const [result, setResult] = useState<TestResult | null>(null);

    const sendTestNotification = async (type: string, permission?: string) => {
        setLoading(type);
        setResult(null);

        try {
            const response = await fetch('/api/admin/test-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, permission }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({
                success: false,
                message:
                    'Fehler beim Senden der Anfrage: ' +
                    (error instanceof Error
                        ? error.message
                        : 'Unbekannter Fehler'),
            });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Push-Benachrichtigungen testen
                    </h2>
                    <p className="text-sm text-gray-600">
                        Teste verschiedene Benachrichtigungstypen
                    </p>
                </div>
            </div>

            <div className="grid gap-4">
                {/* Test to self */}
                <button
                    onClick={() => sendTestNotification('self')}
                    disabled={loading !== null}
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                    <div className="p-2 bg-green-100 rounded-lg">
                        <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900">
                            An mich selbst senden
                        </p>
                        <p className="text-sm text-gray-600">
                            Sendet eine Test-Benachrichtigung nur an dich
                        </p>
                    </div>
                    {loading === 'self' && (
                        <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading !== 'self' && (
                        <Send className="w-5 h-5 text-gray-400" />
                    )}
                </button>

                {/* Test portrait notification */}
                <button
                    onClick={() => sendTestNotification('portrait')}
                    disabled={loading !== null}
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900">
                            Portrait-Einreichung simulieren
                        </p>
                        <p className="text-sm text-gray-600">
                            Sendet an alle mit{' '}
                            <code className="bg-gray-200 px-1 rounded">
                                portraits.view
                            </code>
                        </p>
                    </div>
                    {loading === 'portrait' && (
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading !== 'portrait' && (
                        <Send className="w-5 h-5 text-gray-400" />
                    )}
                </button>

                {/* Test shared gallery notification */}
                <button
                    onClick={() => sendTestNotification('shared_gallery')}
                    disabled={loading !== null}
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <ImageIcon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900">
                            Impressionen-Einreichung simulieren
                        </p>
                        <p className="text-sm text-gray-600">
                            Sendet an alle mit{' '}
                            <code className="bg-gray-200 px-1 rounded">
                                shared_gallery.view
                            </code>
                        </p>
                    </div>
                    {loading === 'shared_gallery' && (
                        <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading !== 'shared_gallery' && (
                        <Send className="w-5 h-5 text-gray-400" />
                    )}
                </button>

                {/* Test to all users with permission */}
                <button
                    onClick={() => sendTestNotification('permission', '*')}
                    disabled={loading !== null}
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                    <div className="p-2 bg-red-100 rounded-lg">
                        <Users className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900">
                            An alle Admins senden
                        </p>
                        <p className="text-sm text-gray-600">
                            Sendet an alle mit aktivierten Benachrichtigungen
                        </p>
                    </div>
                    {loading === 'permission' && (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading !== 'permission' && (
                        <Send className="w-5 h-5 text-gray-400" />
                    )}
                </button>

                {/* Trigger pending reminders */}
                <button
                    onClick={() => sendTestNotification('reminders')}
                    disabled={loading !== null}
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900">
                            Erinnerungen prüfen & senden
                        </p>
                        <p className="text-sm text-gray-600">
                            Prüft auf Einreichungen, die 3, 5, 7, 9, ... Tage
                            warten
                        </p>
                    </div>
                    {loading === 'reminders' && (
                        <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading !== 'reminders' && (
                        <Send className="w-5 h-5 text-gray-400" />
                    )}
                </button>
            </div>

            {/* Result display */}
            {result && (
                <div
                    className={`mt-6 p-4 rounded-lg ${
                        result.success
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                    }`}
                >
                    <p
                        className={`font-medium ${
                            result.success ? 'text-green-800' : 'text-red-800'
                        }`}
                    >
                        {result.success ? '✓ Erfolgreich' : '✗ Fehler'}
                    </p>
                    <p
                        className={`text-sm mt-1 ${
                            result.success ? 'text-green-700' : 'text-red-700'
                        }`}
                    >
                        {result.message}
                    </p>
                    {result.details && 'successful' in result.details && (
                        <p className="text-sm mt-1 text-gray-600">
                            {result.details.successful} von{' '}
                            {result.details.total} Benachrichtigungen
                            erfolgreich gesendet
                        </p>
                    )}
                    {result.details && 'portraits' in result.details && (
                        <div className="text-sm mt-1 text-gray-600 space-y-1">
                            <p>
                                Portraits: {result.details.portraits.sent} von{' '}
                                {result.details.portraits.checked} Erinnerungen
                                gesendet
                            </p>
                            <p>
                                Impressionen:{' '}
                                {result.details.sharedGallery.sent} von{' '}
                                {result.details.sharedGallery.checked}{' '}
                                Erinnerungen gesendet
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Hinweis:</strong> Um Benachrichtigungen zu
                    empfangen, müssen Benutzer Push-Benachrichtigungen aktiviert
                    haben. Dies kann über den Toggle im Dashboard erfolgen.
                </p>
            </div>
        </div>
    );
}
