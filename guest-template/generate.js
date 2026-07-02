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
  const g = { icon: '💡', t: L.sections.guide };
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

  return {
    wn: L.ui.wn, wp: L.ui.wp, cp: L.ui.cp, cd: L.ui.cd, call: L.ui.call,
    ft: L.ftTemplate.replace('{apartmentName}', meta.apartmentName),
    s: [
      { i: '💡', t: L.sections.guide,           subs: guideSubs },
      { i: '🛎️', t: L.sections.services,        subs: serviceSubs },
      { i: '📍', t: L.sections.recommendations, subs: recoSubs },
      { i: '📞', t: L.sections.emergency,       h: renderEmergency(content.emergency, L) }
    ]
  };
}

// --- Glavni tok ---

const langs = Object.keys(labels).filter(k => k !== '_comment');
const T = {}, FLAGS = {}, CODES = {}, SUGGEST = {};

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
}

// --- Serijalizacija u JS izvor ---

const dataBlock =
  `const FLAGS = ${JSON.stringify(FLAGS, null, 0)};\n` +
  `const CODES = ${JSON.stringify(CODES)};\n` +
  `const SUGGEST = ${JSON.stringify(SUGGEST, null, 0)};\n` +
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
