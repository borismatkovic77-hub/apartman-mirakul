# Online forma — postavljanje (pekun.online + email dostava)

Cilj: klijent otvori **link**, popuni formu, klikne **„📧 Pošalji"** — a tebi
podaci stignu **na email**. Bez servera, besplatno.

## Korak 1 — Uzmi ključ za email (Web3Forms)

1. Idi na **https://web3forms.com**
2. Unesi email na koji želiš da stižu prijave (npr. `boris.matkovic77@gmail.com`)
3. Dobiješ **Access Key** (niz slova/brojeva) na taj email — besplatno, bez naloga

## Korak 2 — Nalepi ključ u formu

U `form.html`, pri vrhu `<script>` bloka, nađi:

```js
const WEB3FORMS_KEY = '';
```

i ubaci ključ između navodnika:

```js
const WEB3FORMS_KEY = 'tvoj-kljuc-ovde';
```

Dok je prazno, dugme „Pošalji" samo preuzme fajl (lokalni režim za test).

## Korak 3 — Postavi `form.html` na pekun.online

Prekopiraj `form.html` na pekun.online (npr. `pekun.online/vodic-forma.html`
ili poddirektorijum). To je jedan samostalan fajl — nema zavisnosti.

Link koji šalješ klijentu = adresa te stranice.

## Kako to izgleda u praksi

```
Klijent → otvori link na pekun.online → popuni → „📧 Pošalji"
                                                      ↓
                          tebi stigne email sa svim podacima (data_json)
                                                      ↓
                 kopiraš data_json u data.json → node generate.js → vodič
```

## Napomene

- **Fotografije** se i dalje šalju odvojeno (email/WhatsApp) — forma nosi samo
  tekstualne podatke i nazive slika. Poruka posle slanja podseti klijenta na to.
- Email sadrži polje `data_json` — to je ceo `data.json`. Kopiraš ga u fajl.
- Baza lokala u formi je za **Suboticu**. Za drugi grad treba druga baza
  (`CITY_LIBRARY` u formi + `library.json`).
- „💾 Sačuvaj kao fajl" ostaje kao rezerva ako email zakaže.
