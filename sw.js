const CACHE = 'mirakul-v2';
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
  './images/Guests/Zabava i sport/Subotica Narodno pozoriste.jpg',
  './images/Guests/Zabava i sport/Decije-pozoriste-4-1170x781.jpg',
  './images/Guests/Zabava i sport/Zoo vrt Palić.jpg',
  './images/Guests/Zabava i sport/Aqua park Palić.jpg',
  './images/Guests/Zabava i sport/Hala Sportova.jpg',
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
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
