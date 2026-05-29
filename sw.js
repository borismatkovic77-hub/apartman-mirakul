const CACHE = 'mirakul-v5';
const ASSETS = [
  './guest.html',
  './favicon.svg',
  './images/Guests/rajhlova-palata.webp',
  './images/Guests/ulica-starih-zanata.webp',
  './images/Guests/basch-house.webp',
  './images/Guests/fabrika.webp',
  './images/Guests/boss.webp',
  './images/Guests/stara-picerija.webp',
  './images/Guests/Renaissance.webp',
  './images/Guests/bates.webp',
  './images/Guests/kafe-prica.webp',
  './images/Guests/mali-trg.webp',
  './images/Guests/vinarija-zvonko-bogdan.webp',
  './images/Guests/salas-zvonko-bogdan.webp',
  './images/Guests/palic.webp',
  './images/Guests/gradski-muzej.webp',
  './images/Guests/gradska-kuca.webp',
  './images/Guests/muzej-porcelana.webp',
  './images/Guests/car-jovan-nenad.webp',
  './images/Guests/spomenik-kralj-petru.webp',
  './images/Guests/sinagoga.webp',
  './images/Guests/Zabava i sport/Subotica Narodno pozoriste.webp',
  './images/Guests/Zabava i sport/Decije-pozoriste-4-1170x781.webp',
  './images/Guests/Zabava i sport/Zoo vrt Palić.webp',
  './images/Guests/Zabava i sport/Aqua park Palić.webp',
  './images/Guests/Zabava i sport/Hala Sportova.webp',
  './images/Guests/Zabava i sport/EuroCinema.webp',
  './images/Guests/Zabava i sport/bioskop lifka.webp',
  './images/Guests/Zabava i sport/Bazen Prozivka.webp',
  './images/Guests/Zabava i sport/Bazen Dudovasuma.webp',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Network-first za HTML — uvek svježa verzija kad je online
  if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/guest')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first za slike i ostale statične resurse
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }))
  );
});
