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

1. Klijent otvori **`form.html`** u browseru. Lokali i znamenitosti grada su
   **već popunjeni** iz baze — samo koriguje udaljenosti, izbaci nepotrebno i
   doda podatke svog apartmana (WiFi, kućni red, aparati, parking). Klikne
   „Preuzmi data.json" (+ pošalje slike).
2. `data.json` se ubaci u folder (bez ručnog prepisivanja).
3. Pokrene se generator → dobije se gotova stranica na 16 jezika.
4. Objavi se (GitHub Pages ili bilo koji hosting) + QR kod za goste.

Rezultat: novi apartman = **1–2 sata popunjavanja**, bez diranja koda.

> `form.html` može i da **učita postojeći `data.json`** („Učitaj postojeći") —
> zgodno za kasnije izmene apartmana. `FORMULAR.md` ostaje interna čeklista.

## Šta se prevodi, a šta ne

| Podatak | Prevod? |
|---|---|
| Telefoni, adrese, Maps linkovi, slike, udaljenosti, cene | ❌ Ne |
| Nazivi firmi (Lidl, Boss Caffe…) | ❌ Ne |
| Opisi, kućni red, uputstva za aparate | ✅ Da (auto) |

Klijent piše opise samo na **jednom** jeziku — ostalih 15 ide automatski.

## Jezici (trenutno 16)
sr, en, de, hr, hu, ru, zh, bg, pl, it, es, mk, sl, ro, el, fr

## „Prvi dolazak" kartica + Google recenzija (opciono)

Ako popuniš polje **7. Prvi dolazak** u formi (bar jedan od: dolazak autom/
vozom/autobusom), generator doda interaktivnu prvu karticu u vodič — gost
bira kako stiže i dobija uputstvo + dugme za navigaciju + kontakt (WhatsApp/
Viber/Poziv, iz telefona domaćina). Ako ostavi prazno, kartica se **ne
prikazuje** — ništa se ne lomi.

Isto tako, ako upišeš **Google link za ocenu** (`g.page/.../review` — dobija
se iz Google Business Profile → „Zatraži recenzije"), na dnu vodiča se pojavi
dugme „Ocenite nas na Google-u". Prazno polje = dugme se ne prikazuje.

Oba su verifikovana da rade i sa i bez podataka (vidi `arrival` u `data.json`).

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
| `form.html` | **Forma za klijenta** — popuni u browseru → preuzme `data.json` |
| `library.json` | Baza lokala grada (Subotica) — deljiva među apartmanima |
| `FORMULAR.md` | Interna čeklista polja (za referencu) |

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
