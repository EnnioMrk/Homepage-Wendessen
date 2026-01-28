// Service Worker for Push Notifications
// This file must be in the public folder to be accessible

self.addEventListener('install', () => {
    console.log('Service Worker installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
    event.waitUntil(self.clients.claim());
});

// A fetch handler is required for PWA installation criteria.
self.addEventListener('fetch', (event) => {
    // Network-only strategy: we just let the request pass through.
    // This is enough to satisfy the PWA requirements.
});

self.addEventListener('push', (event) => {
    console.log('Push notification received');

    let data = {
        title: 'Wendessen Admin',
        body: 'Sie haben eine neue Benachrichtigung',
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        url: '/admin/dashboard',
    };

    try {
        if (event.data) {
            const payload = event.data.json();
            data = { ...data, ...payload };
        }
    } catch (e) {
        console.error('Error parsing push data:', e);
    }

    const options = {
        body: data.body,
        icon: data.icon || '/images/logo.png',
        badge: data.badge || '/images/logo.png',
        tag: data.tag || 'wendessen-notification',
        renotify: true,
        requireInteraction: true,
        data: {
            url: data.url || '/admin/dashboard',
        },
        actions: [
            {
                action: 'open',
                title: 'Öffnen',
            },
            {
                action: 'dismiss',
                title: 'Schließen',
            },
        ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked');

    event.notification.close();

    if (event.action === 'dismiss') {
        return;
    }

    const url = event.notification.data?.url || '/admin/dashboard';

    event.waitUntil(
        self.clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // If a window is already open, focus it
                for (const client of clientList) {
                    if (client.url.includes('/admin') && 'focus' in client) {
                        client.navigate(url);
                        return client.focus();
                    }
                }
                // Otherwise open a new window
                if (self.clients.openWindow) {
                    return self.clients.openWindow(url);
                }
            })
    );
});

self.addEventListener('notificationclose', () => {
    console.log('Notification closed');
});
