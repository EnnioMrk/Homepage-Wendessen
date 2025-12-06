'use client';

import { useState, useEffect } from 'react';
import { BellRinging, BellSlash, PaperPlaneTilt } from '@phosphor-icons/react/dist/ssr';

export default function PushNotificationToggle() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSupported, setIsSupported] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTestButton, setShowTestButton] = useState(false);
    const [testSending, setTestSending] = useState(false);

    useEffect(() => {
        checkSupport();
    }, []);

    async function checkSupport() {
        // Check if push notifications are supported
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setIsSupported(false);
            setIsLoading(false);
            return;
        }

        setIsSupported(true);

        // Register service worker
        try {
            await navigator.serviceWorker.register('/sw.js');
        } catch (err) {
            console.error('Service worker registration failed:', err);
        }

        // Check current subscription status
        try {
            const response = await fetch('/api/admin/push-subscribe');
            if (response.ok) {
                const data = await response.json();
                setIsSubscribed(data.subscribed);
            }
        } catch (err) {
            console.error('Error checking subscription:', err);
        }

        setIsLoading(false);
    }

    async function subscribe() {
        setIsLoading(true);
        setError(null);

        try {
            // Get VAPID public key
            const response = await fetch('/api/admin/push-subscribe');
            if (!response.ok) throw new Error('Failed to get VAPID key');
            const { vapidPublicKey } = await response.json();

            if (!vapidPublicKey) {
                throw new Error(
                    'Push-Benachrichtigungen sind nicht konfiguriert'
                );
            }

            // Request notification permission
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                throw new Error('Benachrichtigungsberechtigung verweigert');
            }

            // Get service worker registration
            const registration = await navigator.serviceWorker.ready;

            // Subscribe to push
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            // Send subscription to server
            const subscribeResponse = await fetch('/api/admin/push-subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription: subscription.toJSON() }),
            });

            if (!subscribeResponse.ok) {
                throw new Error('Failed to save subscription');
            }

            setIsSubscribed(true);
            setShowTestButton(true); // Show test button after enabling
        } catch (err) {
            console.error('Error subscribing:', err);
            setError(
                err instanceof Error ? err.message : 'Fehler beim Abonnieren'
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function unsubscribe() {
        setIsLoading(true);
        setError(null);
        setShowTestButton(false); // Hide test button when disabling

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription =
                await registration.pushManager.getSubscription();

            if (subscription) {
                // Unsubscribe from push manager
                await subscription.unsubscribe();

                // Remove from server
                await fetch('/api/admin/push-subscribe', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                });
            }

            setIsSubscribed(false);
        } catch (err) {
            console.error('Error unsubscribing:', err);
            setError(
                err instanceof Error ? err.message : 'Fehler beim Abbestellen'
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function sendTestNotification() {
        setTestSending(true);
        try {
            const response = await fetch('/api/admin/test-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'self' }),
            });
            if (!response.ok) {
                throw new Error('Test fehlgeschlagen');
            }
            setShowTestButton(false); // Hide after successful test
        } catch (err) {
            console.error('Error sending test notification:', err);
            setError(err instanceof Error ? err.message : 'Test fehlgeschlagen');
        } finally {
            setTestSending(false);
        }
    }

    // Convert VAPID key to Uint8Array
    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    if (!isSupported) {
        return null; // Don't show anything if not supported
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={isSubscribed ? unsubscribe : subscribe}
                disabled={isLoading}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isSubscribed
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={
                    isSubscribed
                        ? 'Benachrichtigungen deaktivieren'
                        : 'Benachrichtigungen aktivieren'
                }
            >
                {isLoading ? (
                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isSubscribed ? (
                    <BellRinging className="w-5 h-5" />
                ) : (
                    <BellSlash className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">
                    {isSubscribed
                        ? 'Benachrichtigungen an'
                        : 'Benachrichtigungen aus'}
                </span>
            </button>
            {showTestButton && isSubscribed && (
                <button
                    onClick={sendTestNotification}
                    disabled={testSending}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Test-Benachrichtigung senden"
                >
                    {testSending ? (
                        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <PaperPlaneTilt className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">Testen</span>
                </button>
            )}
            {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
    );
}
