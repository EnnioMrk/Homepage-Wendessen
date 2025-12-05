import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getSessionData } from '@/lib/auth';
import {
    sendPushNotification,
    getSubscriptionsForPermission,
    getUserPushSubscription,
    sendAllPendingReminders,
} from '@/lib/push-notifications';

export async function POST(request: NextRequest) {
    // Only allow in development environment
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
            { error: 'Not available in production' },
            { status: 403 }
        );
    }

    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await getSessionData();
    if (!session) {
        return NextResponse.json({ error: 'No session' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { type, permission } = body;

        if (type === 'self') {
            // Send test notification to the current user only
            const subscription = await getUserPushSubscription(session.userId);
            if (!subscription) {
                return NextResponse.json({
                    success: false,
                    message: 'Du hast keine Push-Benachrichtigungen aktiviert.',
                });
            }

            const success = await sendPushNotification(subscription, {
                title: 'Test-Benachrichtigung',
                body: 'Dies ist eine Test-Benachrichtigung. Wenn du das siehst, funktionieren Push-Benachrichtigungen!',
                icon: '/images/logo.png',
                url: '/admin/dashboard',
                tag: 'test-notification',
            });

            return NextResponse.json({
                success,
                message: success
                    ? 'Test-Benachrichtigung wurde gesendet!'
                    : 'Fehler beim Senden der Benachrichtigung.',
            });
        }

        if (type === 'permission' && permission) {
            // Send test notification to all users with a specific permission
            const subscriptions = await getSubscriptionsForPermission(
                permission
            );

            if (subscriptions.length === 0) {
                return NextResponse.json({
                    success: false,
                    message: `Keine Benutzer mit der Berechtigung "${permission}" haben Push-Benachrichtigungen aktiviert.`,
                });
            }

            let successCount = 0;
            for (const subscription of subscriptions) {
                const success = await sendPushNotification(subscription, {
                    title: 'Test-Benachrichtigung',
                    body: `Test für Berechtigung: ${permission}`,
                    icon: '/images/logo.png',
                    url: '/admin/dashboard',
                    tag: 'test-notification-permission',
                });
                if (success) successCount++;
            }

            return NextResponse.json({
                success: successCount > 0,
                message: `Benachrichtigung an ${successCount}/${subscriptions.length} Benutzer gesendet.`,
                details: {
                    total: subscriptions.length,
                    successful: successCount,
                },
            });
        }

        if (type === 'portrait') {
            // Simulate a new portrait submission notification
            const subscriptions = await getSubscriptionsForPermission(
                'portraits.view'
            );

            if (subscriptions.length === 0) {
                return NextResponse.json({
                    success: false,
                    message:
                        'Keine Benutzer mit Portrait-Berechtigung haben Push-Benachrichtigungen aktiviert.',
                });
            }

            let successCount = 0;
            for (const subscription of subscriptions) {
                const success = await sendPushNotification(subscription, {
                    title: 'Neues Portrait eingereicht (TEST)',
                    body: 'Max Mustermann hat ein Portrait eingereicht und wartet auf Freigabe.',
                    icon: '/images/logo.png',
                    url: '/admin/portraits',
                    tag: 'test-new-portrait',
                });
                if (success) successCount++;
            }

            return NextResponse.json({
                success: successCount > 0,
                message: `Portrait-Benachrichtigung an ${successCount}/${subscriptions.length} Benutzer gesendet.`,
            });
        }

        if (type === 'shared_gallery') {
            // Simulate a new shared gallery submission notification
            const subscriptions = await getSubscriptionsForPermission(
                'shared_gallery.view'
            );

            if (subscriptions.length === 0) {
                return NextResponse.json({
                    success: false,
                    message:
                        'Keine Benutzer mit Impressionen-Berechtigung haben Push-Benachrichtigungen aktiviert.',
                });
            }

            let successCount = 0;
            for (const subscription of subscriptions) {
                const success = await sendPushNotification(subscription, {
                    title: 'Neue Impressionen eingereicht (TEST)',
                    body: 'Max Mustermann hat 3 Bilder eingereicht.',
                    icon: '/images/logo.png',
                    url: '/admin/shared-gallery',
                    tag: 'test-new-shared-gallery',
                });
                if (success) successCount++;
            }

            return NextResponse.json({
                success: successCount > 0,
                message: `Impressionen-Benachrichtigung an ${successCount}/${subscriptions.length} Benutzer gesendet.`,
            });
        }

        if (type === 'reminders') {
            // Trigger reminder check for all pending submissions
            const results = await sendAllPendingReminders();

            const totalChecked =
                results.portraits.checked + results.sharedGallery.checked;
            const totalSent =
                results.portraits.sent + results.sharedGallery.sent;

            if (totalChecked === 0) {
                return NextResponse.json({
                    success: true,
                    message: 'Keine ausstehenden Einreichungen gefunden.',
                    details: results,
                });
            }

            return NextResponse.json({
                success: true,
                message: `Erinnerungen geprüft: ${totalSent} neue Erinnerungen gesendet (${results.portraits.sent} Portraits, ${results.sharedGallery.sent} Impressionen)`,
                details: {
                    portraits: results.portraits,
                    sharedGallery: results.sharedGallery,
                    total: { checked: totalChecked, sent: totalSent },
                },
            });
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (error) {
        console.error('Error sending test notification:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
