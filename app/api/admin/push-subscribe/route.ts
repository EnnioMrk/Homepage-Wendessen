import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import {
    savePushSubscription,
    removePushSubscription,
    hasUserPushSubscription,
} from '@/lib/push-notifications';

// GET - Check if user has subscription
export async function GET() {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const currentUser = await getCurrentAdminUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const hasSubscription = await hasUserPushSubscription(currentUser.id);

        return NextResponse.json({
            subscribed: hasSubscription,
            vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
        });
    } catch (error) {
        console.error('Error checking subscription:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Subscribe to push notifications
export async function POST(request: NextRequest) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const currentUser = await getCurrentAdminUser();
        if (!currentUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const { subscription } = await request.json();

        if (!subscription || !subscription.endpoint || !subscription.keys) {
            return NextResponse.json(
                { error: 'Invalid subscription data' },
                { status: 400 }
            );
        }

        await savePushSubscription(currentUser.id, subscription);

        return NextResponse.json({
            success: true,
            message: 'Subscribed to notifications',
        });
    } catch (error) {
        console.error('Error subscribing to notifications:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe' },
            { status: 500 }
        );
    }
}

// DELETE - Unsubscribe from push notifications
export async function DELETE(request: NextRequest) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { endpoint } = await request.json();

        if (!endpoint) {
            return NextResponse.json(
                { error: 'Endpoint required' },
                { status: 400 }
            );
        }

        await removePushSubscription(endpoint);

        return NextResponse.json({
            success: true,
            message: 'Unsubscribed from notifications',
        });
    } catch (error) {
        console.error('Error unsubscribing from notifications:', error);
        return NextResponse.json(
            { error: 'Failed to unsubscribe' },
            { status: 500 }
        );
    }
}
