const CACHE_NAME = 'sales-tracker-shell-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) { data = { body: event.data?.text?.() || '' }; }
  const title = data.title || 'Sales Tracker';
  const options = {
    body: data.body || 'You have something to review in Sales Tracker.',
    icon: data.icon || '/logo.png',
    badge: data.badge || '/logo.png',
    tag: data.tag || 'sales-tracker',
    renotify: !!data.renotify,
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification?.data?.url || '/';
  event.waitUntil((async () => {
    const list = await clients.matchAll({type:'window', includeUncontrolled:true});
    for (const client of list) {
      if ('focus' in client) { await client.focus(); return; }
    }
    if (clients.openWindow) await clients.openWindow(url);
  })());
});
