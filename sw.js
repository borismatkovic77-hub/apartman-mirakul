const CACHE = 'mirakul-v10';
const ASSETS = [
  './guest.html',
  './favicon.svg',
  './images/Guests/Znamenitosti/rajhlova-palata.webp',
  './images/Guests/Znamenitosti/ulica-starih-zanata.webp',
  './images/Guests/Restorani/basch-house.webp',
  './images/Guests/Restorani/fabrika.webp',
  './images/Guests/Restorani/boss.webp',
  './images/Guests/Restorani/stara-picerija.webp',
  './images/Guests/Restorani/Renaissance.webp',
  './images/Guests/Restorani/bates.webp',
  './images/Guests/Restorani/kafe-prica.webp',
  './images/Guests/Restorani/mali-trg.webp',
  './images/Guests/Restorani/vinarija-zvonko-bogdan.webp',
  './images/Guests/Restorani/salas-zvonko-bogdan.webp',
  './images/Guests/Znamenitosti/palic.webp',
  './images/Guests/Znamenitosti/gradski-muzej.webp',
  './images/Guests/Znamenitosti/gradska-kuca.webp',
  './images/Guests/Znamenitosti/muzej-porcelana.webp',
  './images/Guests/Znamenitosti/car-jovan-nenad.webp',
  './images/Guests/Znamenitosti/spomenik-kralj-petru.webp',
  './images/Guests/Znamenitosti/sinagoga.webp',
  './images/Guests/Zabava/Subotica Narodno pozoriste.webp',
  './images/Guests/Zabava/Decije-pozoriste-4-1170x781.webp',
  './images/Guests/Zabava/Zoo vrt Palić.webp',
  './images/Guests/Sport/Aqua park Palić.webp',
  './images/Guests/Sport/Hala Sportova.webp',
  './images/Guests/Zabava/EuroCinema.webp',
  './images/Guests/Zabava/bioskop lifka.webp',
  './images/Guests/Sport/Bazen Prozivka.webp',
  './images/Guests/Sport/Bazen Dudovasuma.webp',
  './images/Guests/Dostava/Street pica.webp',
  './images/Guests/Dostava/Walter.webp',
  './images/Guests/Dostava/fabrika.webp',
  './images/Guests/Prodavnica/Idea.png',
  './images/Guests/Prodavnica/lidl.avif',
  './images/Guests/Prodavnica/Maxi.jpg',
  './images/Guests/Prodavnica/DM.webp',
  './images/Guests/Apoteka/benu.webp',
  './images/Guests/Menjacnica/Box.jpg',
  './images/Guests/Bankomat/Addiko.webp',
  './images/Guests/Bankomat/otpbanka.webp',
  './images/Guests/Bankomat/nlb.webp',
  './images/Guests/Benzinska/NIS_Petrol_station.webp',
  './images/Guests/Benzinska/MOL-BS.webp',
  './images/Guests/Benzinska/OMV-logo.webp',
  './images/Guests/Stanice/Autobuska-stanica.jpg',
  './images/Guests/Benzinska/Euro petrol.webp',
  './images/Guests/Stanice/Zeleznicka stanica.webp',
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

// Network-first za sve — uvek svježa verzija kad je online, keš kao fallback offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
