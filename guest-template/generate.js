#!/usr/bin/env node
/*
 * generate.js — pravi gotov guest.html iz podataka.
 *
 * Ulaz:
 *   data.json          — sadržaj apartmana na osnovnom jeziku (obavezno)
 *   labels.json        — generički natpisi po jeziku (obavezno)
 *   data.<lang>.json   — prevod sadržaja za dodatni jezik (opciono)
 *   template.html      — HTML kalup sa tokenima __LANG_BUTTONS__ i __GENERATED_DATA__
 *
 * Izlaz:
 *   guest.html         — gotova stranica na svim jezicima za koje postoje natpisi
 *
 * Pokretanje:  node generate.js
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const read = f => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));

const data = read('data.json');
const labels = read('labels.json');
const template = fs.readFileSync(path.join(DIR, 'template.html'), 'utf8');
const baseLang = data.meta.baseLang || 'sr';

// HTML escaping samo za atribute; opisni sadržaj je već čist tekst.
const esc = s => String(s).replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

// --- Renderi guide-blokova (proizvode iste HTML stringove kao ručni guest.html) ---

function renderHouseRules(rules) {
  const lis = rules.map(r => `<li>${r}</li>`).join('');
  return `<ul class="bullet-list">${lis}</ul>`;
}

function renderCheckin(c, L) {
  return `<div class="checkin-row"><div><div class="checkin-label">${L.checkinLabels.checkIn}</div><div class="checkin-time">${c.checkIn}</div></div></div>`
    + `<div class="checkin-row"><div><div class="checkin-label">${L.checkinLabels.checkOut}</div><div class="checkin-time">${c.checkOut}</div></div></div>`
    + `<div class="guide-tip">${c.tip}</div>`;
}

function renderItems(items) {
  return items.map(it =>
    `<div class="guide-item"><span class="guide-item-icon">${it.icon}</span><div class="guide-item-text"><strong>${it.title}</strong><span>${it.text.replace(/ ⚠️/g, '<br>⚠️')}</span></div></div>`
  ).join('');
}

function renderParking(p, L) {
  const smsRows = p.sms.map(s =>
    `<div style="display:flex;align-items:center;justify-content:space-between;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:0.75rem 1rem;"><div><div style="font-size:0.72rem;color:var(--muted);font-weight:600;margin-bottom:0.1rem;">${s.label}</div><div style="font-size:1.1rem;font-weight:800;">${s.code}</div></div><div style="font-size:1.1rem;font-weight:800;color:var(--accent);">${s.price}</div></div>`
  ).join('');
  return `<div style="display:inline-flex;align-items:center;gap:0.5rem;background:#fff1f0;border:1.5px solid #e74c3c;border-radius:8px;padding:0.4rem 0.85rem;margin-bottom:1rem;"><span style="color:#e74c3c;font-size:0.9rem;">●</span><span style="font-weight:700;font-size:0.9rem;color:#c0392b;">${p.zoneLabel}</span></div>`
    + `<div class="checkin-row"><div><div class="checkin-label">${L.parkingLabels.weekdays}</div><div class="checkin-time">${p.weekdays}</div></div></div>`
    + `<div class="checkin-row"><div><div class="checkin-label">${L.parkingLabels.saturday}</div><div class="checkin-time">${p.saturday}</div></div></div>`
    + `<div class="checkin-row" style="border-bottom:none;"><div><div class="checkin-label">${L.parkingLabels.sundayHolidays}</div><div style="font-size:1.55rem;font-weight:800;color:var(--accent);letter-spacing:-0.02em;">${p.sundayHolidays}</div></div></div>`
    + `<div style="margin-top:1.1rem;"><div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.09em;color:var(--muted);margin-bottom:0.6rem;">${L.parkingLabels.payBySms}</div><div style="display:flex;flex-direction:column;gap:0.5rem;">${smsRows}</div></div>`
    + (p.tip ? `<div class="guide-tip" style="margin-top:0.85rem;">${p.tip}</div>` : '');
}

const ARR_WA_SVG = '<svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.172.198-.296.298-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';
const ARR_VI_SVG = '<svg viewBox="0 0 24 24"><path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.694 6.9.633 10.26c-.06 3.36-.129 9.657 5.938 11.365v2.61s-.04.94.58 1.132c.734.226 1.17-.492 1.882-1.312.42-.48.996-1.203 1.427-1.72 4.114.348 7.276-.443 7.634-.56.83-.27 5.535-.874 6.3-7.117.79-6.44-.38-10.51-2.487-12.35C21.176.75 18.7.02 13.06 0h-.001c-.35-.001-1.045-.001-1.66 0zm.061 1.7c.542 0 .877.017.877.017 4.494.006 6.643 1.354 7.15 1.815 1.723 1.516 2.68 5.152 2.028 10.505v.003c-.647 5.25-4.208 5.57-4.912 5.79-.298.093-3.121.789-6.669.55 0 0-2.643 3.19-3.469 4.019-.128.128-.28.18-.38.155-.14-.036-.18-.203-.178-.446l.024-4.318c-5.075-1.404-4.778-6.632-4.723-9.402.055-2.77.552-5.038 1.976-6.435 2.147-1.997 6.276-2.253 6.276-2.253z"/></svg>';
const ARR_PH_SVG = '<svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>';

// Vraća null ako apartman nema podešenu 'Prvi dolazak' karticu (polje 'arrival' izostavljeno/prazno).
function renderArrivalCard(a, L, meta) {
  if (!a || (!a.byCar && !a.byTrain && !a.byBus)) return null;
  const AL = L.arrival;
  const navLabel = a.meetingPointName ? `${AL.navBtn} ${a.meetingPointName}` : AL.navBtnGeneric;
  const navBtn = (cls) => a.navLink ? `<a class="arr-btn ${cls}" href="${a.navLink}">🧭 ${navLabel}</a>` : '';
  const mode = (key, icon, label, body, ghost) => body
    ? `<div class="arr-mode" id="arr-${key}"><button class="arr-choice" onclick="arrPick('${key}')"><span class="arr-ce">${icon}</span> ${label} <span class="arr-ar">▾</span></button><div class="arr-panel"><p>${body}</p>${navBtn(ghost ? 'ghost' : '')}</div></div>`
    : '';
  const modes = [
    mode('auto', '🚗', AL.modes.auto, a.byCar, false),
    mode('voz', '🚆', AL.modes.voz, a.byTrain, true),
    mode('bus', '🚌', AL.modes.bus, a.byBus, true)
  ].filter(Boolean).join('');
  const mpFigure = a.meetingPointImage
    ? `<figure class="arr-mp"><img src="${a.meetingPointImage}" alt="${a.meetingPointName || ''}" loading="lazy" onclick="arrLightbox(this.src)" onerror="this.closest('.arr-mp').style.display='none'"><figcaption>📍 ${AL.mpCaption} ${a.meetingPointName || ''}</figcaption></figure>`
    : '';
  const phone = (meta.host.phone || '').replace(/[^\d+]/g, '');
  const checkin = `<div class="arr-checkin" id="arr-checkin" style="display:none"><h4>${AL.checkinTitle}</h4>` +
    (a.checkinNote ? `<div class="arr-row"><span>⏰</span><span>${a.checkinNote}</span></div>` : '') +
    mpFigure +
    `<div class="arr-btns"><a class="arr-cbtn wa" href="https://wa.me/${phone.replace('+','')}">${ARR_WA_SVG} ${AL.contact.wa}</a><a class="arr-cbtn vi" href="viber://chat?number=${encodeURIComponent(phone)}">${ARR_VI_SVG} ${AL.contact.vi}</a><a class="arr-cbtn call" href="tel:${phone}">${ARR_PH_SVG} ${AL.contact.call}</a></div></div>`;
  return `<div class="arr"><div class="arr-q">${AL.q}</div>${modes}${checkin}</div>`;
}

function renderEmergency(e, L) {
  const icon = L.emergencyIcons;
  const row = (ic, label, num) => `<li><span class="item-label">${ic} ${label}</span><a href="tel:${num}">${num}</a></li>`;
  return `<ul class="item-list">`
    + row(icon.police, e.police.label, e.police.number)
    + row(icon.ambulance, e.ambulance.label, e.ambulance.number)
    + row(icon.fire, e.fire.label, e.fire.number)
    + row(icon.taxi, e.taxi.label, e.taxi.number)
    + row(icon.host, e.host.label, e.host.number)
    + `</ul>`;
}

// --- Sklapanje T[lang] iz sadržaja + natpisa ---

function buildLangEntry(lang, content, L, meta) {
  const guideSubs = [
    { t: L.guideSubs.houseRules, h: renderHouseRules(content.houseRules) },
    { t: L.guideSubs.checkin,    h: renderCheckin(content.checkin, L) },
    { t: L.guideSubs.goodToKnow, h: renderItems(content.goodToKnow) },
    { t: L.guideSubs.appliances, h: renderItems(content.appliances) },
    { t: L.guideSubs.parking,    h: renderParking(content.parking, L) }
  ];
  const svc = content.services, rec = content.recommendations;
  const serviceSubs = ['taxi','delivery','grocery','pharmacy','exchange','atm','gas','railway','bus']
    .map(k => ({ t: L.serviceSubs[k], cards: svc[k] }));
  const recoSubs = ['restaurants','attractions','entertainment','sport']
    .map(k => ({ t: L.recoSubs[k], cards: rec[k] }));

  const arrivalHTML = renderArrivalCard(content.arrival, L, meta);
  const s = [];
  if (arrivalHTML) s.push({ i: '🧳', t: L.arrival.title, h: arrivalHTML });
  s.push(
    { i: '💡', t: L.sections.guide,           subs: guideSubs },
    { i: '🛎️', t: L.sections.services,        subs: serviceSubs },
    { i: '📍', t: L.sections.recommendations, subs: recoSubs },
    { i: '📞', t: L.sections.emergency,       h: renderEmergency(content.emergency, L) }
  );

  return {
    wn: L.ui.wn, wp: L.ui.wp, cp: L.ui.cp, cd: L.ui.cd, call: L.ui.call,
    ft: L.ftTemplate.replace('{apartmentName}', meta.apartmentName),
    s
  };
}

// --- Glavni tok ---

const langs = Object.keys(labels).filter(k => k !== '_comment');
const T = {}, FLAGS = {}, CODES = {}, SUGGEST = {}, REVIEW = {};
const reviewLink = data.arrival && data.arrival.reviewLink;

for (const lang of langs) {
  const L = labels[lang];
  // sadržaj: osnovni jezik iz data.json; ostali iz data.<lang>.json ako postoji, inače fallback na osnovni
  let content = data;
  if (lang !== baseLang) {
    const f = `data.${lang}.json`;
    if (fs.existsSync(path.join(DIR, f))) content = read(f);
  }
  T[lang] = buildLangEntry(lang, content, L, data.meta);
  FLAGS[lang] = `<img class="lang-flag-sm" src="https://flagcdn.com/w20/${L.flag}.png" alt="">`;
  CODES[lang] = L.code;
  SUGGEST[lang] = L.suggest;
  if (reviewLink) REVIEW[lang] = { btn: L.reviewBtn };
}

// --- Serijalizacija u JS izvor ---

const dataBlock =
  `const FLAGS = ${JSON.stringify(FLAGS, null, 0)};\n` +
  `const CODES = ${JSON.stringify(CODES)};\n` +
  `const SUGGEST = ${JSON.stringify(SUGGEST, null, 0)};\n` +
  `const REVIEW_LINK = ${JSON.stringify(reviewLink || '')};\n` +
  `const REVIEW = ${JSON.stringify(REVIEW, null, 0)};\n` +
  `const T = ${JSON.stringify(T, null, 0)};`;

const buttons = langs.map(lang => {
  const L = labels[lang];
  return `    <button class="lang-btn" onclick="setLang('${lang}')"><img class="lang-flag" src="https://flagcdn.com/w40/${L.flag}.png" alt=""> ${L.langName}</button>`;
}).join('\n');

let out = template
  .replace('<!--__LANG_BUTTONS__-->', buttons)
  .replace('//__GENERATED_DATA__', dataBlock);

fs.writeFileSync(path.join(DIR, 'guest.html'), out);
console.log(`✓ guest.html izgenerisan — ${langs.length} jezik(a): ${langs.join(', ')}`);
