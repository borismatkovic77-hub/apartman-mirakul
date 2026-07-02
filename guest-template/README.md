# Guest vodič — šablon za višekratnu upotrebu

Sistem koji omogućava da se digitalni vodič za goste (kao `guest.html`)
napravi za **bilo koji apartman** — bez pisanja koda i bez ručnog prevoda.

## Ideja: razdvojeni podaci i dizajn

```
  data.json            template (dizajn)          [generator]
 (podaci jednog   +   guest.html kalup     →   auto-prevod 16 jezika
  apartmana)           (isti za sve)               ↓
                                              gotov guest.html
```

- **`data.json`** — svi podaci jednog apartmana, na jednom (osnovnom) jeziku.
  Ovde je popunjen primer: *Apartman Mirakul* (61 kartica).
- **Template** — HTML/CSS kalup (dizajn, raspored, logika biranja jezika).
  Isti je za sve apartmane, menjaju se samo podaci.
- **Generator** — skripta koja spoji podatke + kalup, prevede opisne
  tekstove na svih 16 jezika i ispljune gotov `guest.html`.

## Radni tok za novi apartman

1. Klijent popuni **`FORMULAR.md`** i pošalje slike.
2. Podaci se prebace u kopiju **`data.json`**.
3. Pokrene se generator → dobije se gotova stranica na 16 jezika.
4. Objavi se (GitHub Pages ili bilo koji hosting) + QR kod za goste.

Rezultat: novi apartman = **1–2 sata popunjavanja**, bez diranja koda.

## Šta se prevodi, a šta ne

| Podatak | Prevod? |
|---|---|
| Telefoni, adrese, Maps linkovi, slike, udaljenosti, cene | ❌ Ne |
| Nazivi firmi (Lidl, Boss Caffe…) | ❌ Ne |
| Opisi, kućni red, uputstva za aparate | ✅ Da (auto) |

Klijent piše opise samo na **jednom** jeziku — ostalih 15 ide automatski.

## Jezici (trenutno 16)
sr, en, de, hr, hu, ru, zh, bg, pl, it, es, mk, sl, ro, el, fr

## Pokretanje

```bash
cd guest-template
node generate.js
```

Pročita `data.json` + `labels.json` (+ `template.html`) i napiše gotov
`guest.html` u ovom folderu, na svim jezicima za koje postoje natpisi.

## Fajlovi

| Fajl | Uloga |
|---|---|
| `data.json` | Sadržaj apartmana (osnovni jezik) — **menja se po apartmanu** |
| `data.<lang>.json` | Prevod sadržaja za dodatni jezik (opciono) |
| `labels.json` | Generički natpisi po jeziku — **isti za sve apartmane** |
| `template.html` | HTML kalup (dizajn) sa tokenima — ne dira se |
| `generate.js` | Generator: podaci + kalup → `guest.html` |
| `FORMULAR.md` | Obrazac za klijenta |

## Status
- [x] `data.json` — struktura podataka + popunjen primer (Mirakul, 61 kartica)
- [x] `FORMULAR.md` — obrazac za klijenta
- [x] `template.html` — kalup izvučen iz postojećeg guest.html
- [x] `labels.json` — generički natpisi (osnovni jezik popunjen)
- [x] `generate.js` — generator radi (data.json → guest.html, verifikovano)
- [ ] Natpisi (`labels.json`) za ostalih 15 jezika — dodaju se blok po blok
- [ ] Prevod sadržaja (`data.<lang>.json`) za nove apartmane — po projektu

## Dodavanje jezika
Za svaki novi jezik: (1) dodaj njegov blok u `labels.json` (natpisi kategorija —
prevede se **jednom**, važi za sve apartmane), i (2) opciono `data.<lang>.json`
sa prevedenim opisima. Ako prevod sadržaja ne postoji, taj jezik koristi
osnovni sadržaj (fallback). Pokreni `node generate.js` ponovo.

> Napomena: `guest.html` u root-u projekta je živa, ručno pravljena 16-jezična
> verzija Mirakula. Ovaj folder je samostalan i ne utiče na nju. `guest.html`
> unutar ovog foldera je **generisani izlaz** (nije u gitu).
