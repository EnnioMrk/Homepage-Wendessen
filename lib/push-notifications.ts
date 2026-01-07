// web-push is imported dynamically where needed
// import webpush from 'web-push';

// VAPID keys for web push - these should be in environment variables
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@wendessen.de';

let _webpush: any = null;
import { sql } from './sql';

async function getWebpush() {
    if (_webpush) return _webpush;
    const wp = (await import('web-push')).default;
    if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
        wp.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    }
    _webpush = wp;
    return _webpush;
}

export interface PushSubscription {
    id: number;
    userId: number;
    endpoint: string;
    p256dh: string;
    auth: string;
    createdAt: Date;
}

export interface NotificationPayload {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    url?: string;
    tag?: string;
}

/**
 * Save a push subscription for a user
 */
export async function savePushSubscription(
    userId: number,
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } }
): Promise<void> {
    try {
        await sql`
            INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
            VALUES (${userId}, ${subscription.endpoint}, ${subscription.keys.p256dh}, ${subscription.keys.auth})
            ON CONFLICT (endpoint) 
            DO UPDATE SET 
                user_id = ${userId},
                p256dh = ${subscription.keys.p256dh},
                auth = ${subscription.keys.auth},
                updated_at = CURRENT_TIMESTAMP
        `;
    } catch (error) {
        console.error('Error saving push subscription:', error);
        throw new Error('Failed to save push subscription');
    }
}

/**
 * Remove a push subscription
 */
export async function removePushSubscription(endpoint: string): Promise<void> {
    try {
        await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`;
    } catch (error) {
        console.error('Error removing push subscription:', error);
        throw new Error('Failed to remove push subscription');
    }
}

/**
 * Get all push subscriptions for a user
 */
export async function getUserPushSubscriptions(
    userId: number
): Promise<PushSubscription[]> {
    try {
        const result = await sql`
            SELECT id, user_id, endpoint, p256dh, auth, created_at
            FROM push_subscriptions
            WHERE user_id = ${userId}
        `;
        return result.map((row: Record<string, unknown>) => ({
            id: Number(row.id),
            userId: Number(row.user_id),
            endpoint: String(row.endpoint),
            p256dh: String(row.p256dh),
            auth: String(row.auth),
            createdAt: new Date(row.created_at as string),
        }));
    } catch (error) {
        console.error('Error getting user push subscriptions:', error);
        return [];
    }
}

/**
 * Check if a user has any push subscriptions
 */
export async function hasUserPushSubscription(
    userId: number
): Promise<boolean> {
    try {
        const result = await sql`
            SELECT COUNT(*) as count FROM push_subscriptions WHERE user_id = ${userId}
        `;
        return Number(result[0]?.count) > 0;
    } catch (error) {
        console.error('Error checking user push subscription:', error);
        return false;
    }
}

/**
 * Get the first push subscription for a user (for sending single notifications)
 */
export async function getUserPushSubscription(
    userId: number
): Promise<PushSubscription | null> {
    const subscriptions = await getUserPushSubscriptions(userId);
    return subscriptions.length > 0 ? subscriptions[0] : null;
}

/**
 * Get all subscriptions for users with a specific permission
 */
export async function getSubscriptionsForPermission(
    permission: string
): Promise<PushSubscription[]> {
    try {
        // Get subscriptions for users who have the permission in their custom_permissions JSONB column
        // Permissions are stored as a JSON array in admin_users.custom_permissions
        const result = await sql`
            SELECT DISTINCT ps.id, ps.user_id, ps.endpoint, ps.p256dh, ps.auth, ps.created_at
            FROM push_subscriptions ps
            JOIN admin_users au ON ps.user_id = au.id
            WHERE 
                -- Check if user's custom_permissions JSON array contains the permission or wildcard
                au.custom_permissions IS NOT NULL AND (
                    au.custom_permissions::jsonb ? ${permission}
                    OR au.custom_permissions::jsonb ? '*'
                )
        `;
        return result.map((row: Record<string, unknown>) => ({
            id: Number(row.id),
            userId: Number(row.user_id),
            endpoint: String(row.endpoint),
            p256dh: String(row.p256dh),
            auth: String(row.auth),
            createdAt: new Date(row.created_at as string),
        }));
    } catch (error) {
        console.error('Error getting subscriptions for permission:', error);
        return [];
    }
}

/**
 * Check if a notification event has already been sent
 */
export async function hasNotificationBeenSent(
    eventType: string,
    resourceId: string
): Promise<boolean> {
    try {
        const result = await sql`
            SELECT COUNT(*) as count FROM notification_events 
            WHERE event_type = ${eventType} AND resource_id = ${resourceId}
        `;
        return Number(result[0]?.count) > 0;
    } catch (error) {
        console.error('Error checking notification event:', error);
        return false;
    }
}

/**
 * Mark a notification event as sent
 */
export async function markNotificationSent(
    eventType: string,
    resourceId: string
): Promise<void> {
    try {
        await sql`
            INSERT INTO notification_events (event_type, resource_id)
            VALUES (${eventType}, ${resourceId})
            ON CONFLICT (event_type, resource_id) DO NOTHING
        `;
    } catch (error) {
        console.error('Error marking notification sent:', error);
    }
}

/**
 * Send a push notification to a specific subscription
 */
export async function sendPushNotification(
    subscription: PushSubscription,
    payload: NotificationPayload
): Promise<boolean> {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        console.warn('VAPID keys not configured, skipping push notification');
        return false;
    }

    const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
        },
    };

    try {
        const wp = await getWebpush();
        await wp.sendNotification(
            pushSubscription,
            JSON.stringify(payload)
        );
        return true;
    } catch (error: unknown) {
        const err = error as { statusCode?: number };
        console.error('Error sending push notification:', error);

        // If subscription is invalid/expired, remove it
        if (err.statusCode === 410 || err.statusCode === 404) {
            console.log(
                'Subscription expired, removing:',
                subscription.endpoint
            );
            await removePushSubscription(subscription.endpoint);
        }
        return false;
    }
}

/**
 * Send notification to all users with a specific permission
 */
export async function notifyUsersWithPermission(
    permission: string,
    eventType: string,
    resourceId: string,
    payload: NotificationPayload
): Promise<number> {
    // Check if this notification was already sent
    const alreadySent = await hasNotificationBeenSent(eventType, resourceId);
    if (alreadySent) {
        console.log(`Notification already sent for ${eventType}:${resourceId}`);
        return 0;
    }

    // Get all subscriptions for users with the permission
    const subscriptions = await getSubscriptionsForPermission(permission);

    if (subscriptions.length === 0) {
        console.log(`No subscriptions found for permission ${permission}`);
        return 0;
    }

    // Mark notification as sent before sending to prevent duplicates
    await markNotificationSent(eventType, resourceId);

    // Send to all subscriptions
    let successCount = 0;
    for (const subscription of subscriptions) {
        const success = await sendPushNotification(subscription, payload);
        if (success) successCount++;
    }

    console.log(
        `Sent ${successCount}/${subscriptions.length} notifications for ${eventType}:${resourceId}`
    );
    return successCount;
}

/**
 * Notify about a new portrait submission
 */
export async function notifyNewPortrait(
    portraitId: string,
    submitterName: string
): Promise<void> {
    await notifyUsersWithPermission(
        'portraits.view',
        'new_portrait',
        portraitId,
        {
            title: 'Neues Portrait eingereicht',
            body: `${submitterName} hat ein Portrait eingereicht und wartet auf Freigabe.`,
            icon: '/images/logo.png',
            url: '/admin/portraits',
            tag: 'new-portrait',
        }
    );
}

/**
 * Notify about a new shared gallery submission
 */
export async function notifyNewSharedGallery(
    submissionGroupId: string,
    submitterName: string,
    imageCount: number
): Promise<void> {
    await notifyUsersWithPermission(
        'shared_gallery.view',
        'new_shared_gallery',
        submissionGroupId,
        {
            title: 'Neue Impressionen eingereicht',
            body: `${submitterName} hat ${imageCount} ${imageCount === 1 ? 'Bild' : 'Bilder'
                } eingereicht.`,
            icon: '/images/logo.png',
            url: '/admin/shared-gallery',
            tag: 'new-shared-gallery',
        }
    );
}

/**
 * Notify that images were appended to an existing shared gallery group
 */
export async function notifySharedGalleryAppended(
    submissionGroupId: string,
    submitterName: string,
    imageCount: number
): Promise<void> {
    await notifyUsersWithPermission(
        'shared_gallery.view',
        'shared_gallery_appended',
        submissionGroupId,
        {
            title: 'Impressionen ergänzt',
            body: `${submitterName} hat ${imageCount} ${imageCount === 1 ? 'Bild' : 'Bilder'
                } zu einer bestehenden Einreichung hinzugefügt.`,
            icon: '/images/logo.png',
            url: '/admin/shared-gallery',
            tag: 'shared-gallery-appended',
        }
    );
}

/**
 * Get reminder days (3, 5, 7, 9, 11, ...)
 * Returns the reminder day if the submission age matches, otherwise null
 */
function getReminderDay(daysWaiting: number): number | null {
    // Reminder days: 3, 5, 7, 9, 11, ... (odd numbers starting from 3)
    if (daysWaiting >= 3 && daysWaiting % 2 === 1) {
        return daysWaiting;
    }
    return null;
}

interface PendingPortrait {
    id: number;
    name: string;
    daysWaiting: number;
}

interface PendingSharedGallery {
    submissionGroupId: string;
    submitterName: string;
    imageCount: number;
    daysWaiting: number;
}

/**
 * Get all pending portraits with their waiting time in days
 */
async function getPendingPortraits(): Promise<PendingPortrait[]> {
    try {
        const result = await sql`
            SELECT 
                id,
                name,
                EXTRACT(DAY FROM (CURRENT_TIMESTAMP - submitted_at))::integer as days_waiting
            FROM portraits
            WHERE status = 'pending'
        `;
        return result.map((row: Record<string, unknown>) => ({
            id: Number(row.id),
            name: String(row.name),
            daysWaiting: Number(row.days_waiting),
        }));
    } catch (error) {
        console.error('Error getting pending portraits:', error);
        return [];
    }
}

/**
 * Get all pending shared gallery submissions grouped by submission_group_id
 */
async function getPendingSharedGalleryGroups(): Promise<
    PendingSharedGallery[]
> {
    try {
        const result = await sql`
            SELECT 
                submission_group_id,
                submitter_name,
                COUNT(*) as image_count,
                EXTRACT(DAY FROM (CURRENT_TIMESTAMP - MIN(submitted_at)))::integer as days_waiting
            FROM shared_gallery_submissions
            WHERE status = 'pending'
            GROUP BY submission_group_id, submitter_name
        `;
        return result.map((row: Record<string, unknown>) => ({
            submissionGroupId: String(row.submission_group_id),
            submitterName: String(row.submitter_name || 'Unbekannt'),
            imageCount: Number(row.image_count),
            daysWaiting: Number(row.days_waiting),
        }));
    } catch (error) {
        console.error('Error getting pending shared gallery groups:', error);
        return [];
    }
}

/**
 * Send reminder notifications for pending portrait submissions
 * Sends reminders at 3, 5, 7, 9, ... days
 */
export async function sendPortraitReminders(): Promise<{
    checked: number;
    sent: number;
}> {
    const pendingPortraits = await getPendingPortraits();
    let sentCount = 0;

    for (const portrait of pendingPortraits) {
        const reminderDay = getReminderDay(portrait.daysWaiting);
        if (reminderDay !== null) {
            const eventType = `portrait_reminder_${reminderDay}`;
            const resourceId = String(portrait.id);

            const sent = await notifyUsersWithPermission(
                'portraits.view',
                eventType,
                resourceId,
                {
                    title: `⏰ Portrait wartet seit ${reminderDay} Tagen`,
                    body: `Das Portrait von "${portrait.name}" wartet seit ${reminderDay} Tagen auf Freigabe.`,
                    icon: '/images/logo.png',
                    url: '/admin/portraits',
                    tag: `portrait-reminder-${portrait.id}`,
                }
            );
            if (sent > 0) sentCount++;
        }
    }

    return { checked: pendingPortraits.length, sent: sentCount };
}

/**
 * Send reminder notifications for pending shared gallery submissions
 * Sends reminders at 3, 5, 7, 9, ... days
 */
export async function sendSharedGalleryReminders(): Promise<{
    checked: number;
    sent: number;
}> {
    const pendingGroups = await getPendingSharedGalleryGroups();
    let sentCount = 0;

    for (const group of pendingGroups) {
        const reminderDay = getReminderDay(group.daysWaiting);
        if (reminderDay !== null) {
            const eventType = `shared_gallery_reminder_${reminderDay}`;
            const resourceId = group.submissionGroupId;

            const imageText =
                group.imageCount === 1
                    ? '1 Bild'
                    : `${group.imageCount} Bilder`;

            const sent = await notifyUsersWithPermission(
                'shared_gallery.view',
                eventType,
                resourceId,
                {
                    title: `⏰ Impressionen warten seit ${reminderDay} Tagen`,
                    body: `${imageText} von "${group.submitterName}" ${group.imageCount === 1 ? 'wartet' : 'warten'
                        } seit ${reminderDay} Tagen auf Freigabe.`,
                    icon: '/images/logo.png',
                    url: '/admin/shared-gallery',
                    tag: `shared-gallery-reminder-${group.submissionGroupId}`,
                }
            );
            if (sent > 0) sentCount++;
        }
    }

    return { checked: pendingGroups.length, sent: sentCount };
}

/**
 * Send all pending submission reminders (portraits and shared gallery)
 * This should be called once per day (e.g., via cron job or scheduled task)
 */
export async function sendAllPendingReminders(): Promise<{
    portraits: { checked: number; sent: number };
    sharedGallery: { checked: number; sent: number };
}> {
    const [portraits, sharedGallery] = await Promise.all([
        sendPortraitReminders(),
        sendSharedGalleryReminders(),
    ]);

    console.log(
        `Reminder check complete: Portraits ${portraits.sent}/${portraits.checked}, Shared Gallery ${sharedGallery.sent}/${sharedGallery.checked}`
    );

    return { portraits, sharedGallery };
}
