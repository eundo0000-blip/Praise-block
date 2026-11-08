// 앱 화면 파일을 기기에 저장해 두어 빨리 열리게 해요.
const CACHE = "praise-block-v1";
const FILES = ["./", "index.html", "config.js", "sync.js", "manifest.webmanifest", "rules.pdf",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png",
  "fonts/do-hyeon-korean-400-normal.woff2", "fonts/do-hyeon-latin-400-normal.woff2", "fonts/press-start-2p-latin-400-normal.woff2"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return; // Firebase 등 외부 요청은 그대로
  e.respondWith(fetch(e.request).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
});
