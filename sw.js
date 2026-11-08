/* 台股六大策略戰情板 — service worker
   策略：index.html 用 network-first（永遠優先拿當日最新報告，離線才回快取）；
         icons/manifest 用 cache-first（幾乎不變，省流量）；
         詳情檔 d/*.json 走快取優先＋背景更新（檔名不帶日期，內容每天換）。 */
var CACHE = 'tw6-v2';   /* v2：加入 d/ 詳情檔與背景更新策略 */
var SHELL = ['./', 'index.html', 'manifest.json',
             'icons/icon-192.png', 'icons/icon-512.png',
             'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.addAll(SHELL).catch(function () {});
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) {
      return k === CACHE ? null : caches.delete(k);
    }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var u = new URL(r.url);
  if (u.origin !== self.location.origin) return;

  var isDoc = r.mode === 'navigate' || /(\/|index\.html)$/.test(u.pathname);
  if (isDoc) {
    e.respondWith(fetch(r).then(function (res) {
      if (res && res.ok) {
        var cp = res.clone();
        caches.open(CACHE).then(function (c) { c.put('index.html', cp); });
      }
      return res;
    }).catch(function () {
      return caches.match('index.html').then(function (m) {
        return m || caches.match('./');
      });
    }));
    return;
  }
  /* 快取優先、背景更新（stale-while-revalidate）。
     詳情檔 d/<代號>.json 檔名不帶日期、內容每天會換，純 cache-first 會永遠拿到舊的；
     先回快取讓點擊沒有延遲，同時發網路請求把下一次要用的更新進去。 */
  e.respondWith(caches.match(r).then(function (m) {
    var net = fetch(r).then(function (res) {
      if (res && res.ok) {
        var cp = res.clone();
        caches.open(CACHE).then(function (c) { c.put(r, cp); });
      }
      return res;
    }).catch(function () { return m; });
    return m || net;
  }));
});
