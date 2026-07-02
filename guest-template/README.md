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

## Status
- [x] `data.json` — struktura podataka + popunjen primer (Mirakul)
- [x] `FORMULAR.md` — obrazac za klijenta
- [ ] Generator skripta (data.json + kalup → guest.html) — sledeći korak
- [ ] Auto-prevod korak (osnovni jezik → 16 jezika)

> Napomena: `guest.html` u root-u je i dalje živa, ručno pravljena verzija
> Mirakula. Ovaj folder je samostalan i ne utiče na nju.
