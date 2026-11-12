// Szórólap generátor: node build.js
//   -> szorolap.html, szorolap-vagojelekkel.html (+ ha a Playwright elérhető:
//      szorolap.pdf, szorolap-vagojelekkel.pdf, szorolap-hu.png, szorolap-en.png)
// A szövegeket itt kell szerkeszteni, majd újra lefuttatni.
// A QR-kódok (qr-*.svg) segno-val készültek: segno.make(url, error="q").
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const read = f => fs.readFileSync(path.join(dir, f), 'utf8');

const T = {
  hu: {
    tagline: 'Remek kávé,<br><em>jó hangulat.</em>',
    off: 'kedvezmény',
    show: 'a szórólap<br>felmutatásával!',
    pass: '<b>Add tovább!</b> Írj ide valami kedveset, és ajándékozd a kupont valakinek – a WriteOnCup szellemében.',
    note: 'Üzenet:',
    address: '1063 Budapest, Szinyei Merse utca 5.',
    hours: 'H–P 7:00–17:00 · Szo–V 9:00–17:00',
    follow: 'Kövess minket!',
    scan: 'Olvasd be a kódot<br>a telefonoddal',
  },
  en: {
    tagline: 'Great coffee,<br><em>good vibes.</em>',
    off: 'off',
    show: 'by showing<br>this voucher!',
    pass: '<b>Pass it on!</b> Write something kind here and give this voucher to someone – the WriteOnCup way.',
    note: 'Note:',
    address: '1063 Budapest, Szinyei Merse utca 5.',
    hours: 'Mon–Fri 7:00–17:00 · Sat–Sun 9:00–17:00',
    follow: 'Follow us!',
    scan: 'Scan the code<br>with your phone',
  },
};

const logo = read('../logo/cafe-harmony-09.svg').replace(/<\?xml[^>]*>\s*/, '').replace('<svg ', '<svg class="logo" ');
const qrFb = read('qr-facebook.svg');
const qrIg = read('qr-instagram.svg');
const icon = {
  pin: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.6" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  // ugyanazok az ikonok, mint a weboldal láblécében
  fb: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="1.4"/><path d="M13.5 8.5h1.5V6h-1.7c-1.7 0-2.8 1.1-2.8 2.9V10H9v2.4h1.5V18h2.4v-5.6H14.6L15 10h-2.1V9c0-.4.2-.5.6-.5Z" fill="currentColor"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="3.4" stroke="currentColor" stroke-width="1.4"/><circle cx="16.2" cy="7.8" r="1" fill="currentColor"/></svg>',
};

const side = (lang) => {
  const t = T[lang];
  return `<section class="page" lang="${lang}">
  <div class="photo"></div>
  <div class="frame"></div>
  <div class="content">
    <div class="hero">
      ${logo}
      <div class="eyebrow">Specialty Coffee · Budapest</div>
      <div class="tagline">${t.tagline}</div>
    </div>
    <div class="voucher">
      <i class="notch l"></i><i class="notch r"></i>
      <div class="stub"><div class="pct">15<small>%</small></div><div class="off">${t.off}</div></div>
      <div class="body">
        <div class="show">${t.show}</div>
        <div class="pass">${t.pass}</div>
        <div class="note-line">${t.note}<i></i></div>
      </div>
    </div>
    <div class="info">
      <span>${icon.pin}${t.address}</span>
      <span>${icon.clock}${t.hours}</span>
    </div>
    <div class="social">
      <div class="qr"><div class="tile">${qrFb}</div><div class="label">${icon.fb}Facebook</div><div class="handle">Café Harmonic Budapest</div></div>
      <div class="web">
        <div class="follow">${t.follow}</div>
        <div class="orn"><i></i><b></b><i></i></div>
        <div class="url">cafeharmonic.hu</div>
        <div class="scan">${t.scan}</div>
      </div>
      <div class="qr"><div class="tile">${qrIg}</div><div class="label">${icon.ig}Instagram</div><div class="handle">@cafeharmonicbudapest</div></div>
    </div>
  </div>
</section>`;
};

const doc = (title, bodyClass, inner, head = '') => `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="stylesheet" href="szorolap.css">${head}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${inner}
</body>
</html>
`;

// vágójelek: a vágási vonal 10 mm margó + 3 mm kifutó = 13 mm-re van a lap szélétől
const marks = (label) => {
  const m = 13, W = 174, H = 236, len = 8.5; // mm
  const h = (x, y) => `<i class="cm h" style="left:${x}mm;top:${y - 0.125}mm"></i>`;
  const v = (x, y) => `<i class="cm v" style="left:${x - 0.125}mm;top:${y}mm"></i>`;
  return [h(0, m), h(W - len, m), h(0, H - m), h(W - len, H - m),
          v(m, 0), v(W - m, 0), v(m, H - len), v(W - m, H - len)].join('') +
    `<span class="lbl">${label}</span>`;
};

fs.writeFileSync(path.join(dir, 'szorolap.html'),
  doc('Café Harmonic – szórólap A5 (HU / EN)', '', side('hu') + '\n' + side('en')));
fs.writeFileSync(path.join(dir, 'szorolap-vagojelekkel.html'),
  doc('Café Harmonic – szórólap A5, vágójelekkel', 'marks',
    ['hu', 'en'].map((l, i) => `<div class="sheet">${side(l)}${marks(`Café Harmonic szórólap · A5 (148 × 210 mm) + 3 mm kifutó · ${i + 1}. oldal (${l.toUpperCase()})`)}</div>`).join('\n'),
    '\n<style>@page{ size:174mm 236mm; margin:0; }</style>'));
console.log('HTML kész.');

// PDF + PNG előnézet (Playwright kell hozzá)
let chromium;
try { ({ chromium } = require('playwright')); } catch { console.log('Playwright nincs telepítve – PDF/PNG kimarad.'); process.exit(0); }
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 3 });
  for (const [html, pdf] of [['szorolap.html', 'szorolap.pdf'], ['szorolap-vagojelekkel.html', 'szorolap-vagojelekkel.pdf']]) {
    await page.goto('file://' + path.join(dir, html));
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: path.join(dir, pdf), preferCSSPageSize: true, printBackground: true });
  }
  // előnézet: a vágott (148 × 210 mm) lap, kifutó nélkül
  await page.goto('file://' + path.join(dir, 'szorolap.html'));
  await page.evaluate(() => document.fonts.ready);
  const mm = 96 / 25.4;
  const boxes = await page.$$eval('.page', els => els.map(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y }; }));
  for (const [i, lang] of ['hu', 'en'].entries()) {
    await page.screenshot({
      path: path.join(dir, `szorolap-${lang}.png`), fullPage: true,
      clip: { x: boxes[i].x + 3 * mm, y: boxes[i].y + 3 * mm, width: 148 * mm, height: 210 * mm },
    });
  }
  await browser.close();
  console.log('PDF + PNG kész.');
})();
