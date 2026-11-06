// Árlista generátor: node build.js  ->  arlista.html, asztali-hu.html, asztali-en.html
// Az árakat itt kell szerkeszteni, majd újra lefuttatni (és PNG/PDF-et rendelni belőle).
const fs = require('fs');
const items = [
  ['Espresso','750'],['Ristretto','750'],['Doppio','1 090'],['Lungo','890'],
  ['Americano','990'],['Espresso Macchiato','990'],['Cappuccino','1 190'],['Cortado','1 190'],
  ['Café Latte','1 390'],['Latte Macchiato','1 390'],['Flat White','1 490'],['Matcha','1 490'],
];
const rows = items.map(([n,p]) =>
  `    <div class="row"><span class="name">${n}</span><span class="dots"></span><span class="price">${p}<small>Ft</small></span></div>`).join('\n');
const NOTE_HU = 'Minden tejes kávénk kérhető növényi tejjel is, felár nélkül!';
const NOTE_EN = 'All milk coffees are available with plant-based milk at no extra charge!';

const page = ({lang, title, h1, sub, note, single}) => `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="arlista.css">
</head>
<body>
<div class="sheet${single ? ' single' : ''}">
  <div class="frame"></div>
  <img class="logo" src="../logo/cafe-harmony-09.png" alt="Café Harmonic">
  <div class="eyebrow">Specialty Coffee · Budapest</div>
  <h1>${h1}</h1>${sub ? `\n  <div class="sub">${sub}</div>` : ''}
  <div class="orn"><i></i><b>◆</b><i></i></div>

  <div class="list">
${rows}
  </div>

  <div class="note">
${note}
  </div>

  <div class="foot">
    <strong>Café Harmonic Budapest</strong>
    <span>1063 Budapest, Szinyei Merse utca 5.</span>
    <span>@cafeharmonicbudapest</span>
  </div>
</div>
</body>
</html>
`;

fs.writeFileSync('arlista.html', page({
  lang:'hu', title:'Café Harmonic – Árlista / Coffee Menu',
  h1:'Kávé<em>ink</em>', sub:'Coffee Menu', single:false,
  note:`    <div class="hu">${NOTE_HU}</div>\n    <div class="en">${NOTE_EN}</div>`,
}));
fs.writeFileSync('asztali-hu.html', page({
  lang:'hu', title:'Café Harmonic – Árlista (asztali, magyar)',
  h1:'Kávé<em>ink</em>', sub:'', single:true,
  note:`    <div class="only">${NOTE_HU}</div>`,
}));
fs.writeFileSync('asztali-en.html', page({
  lang:'en', title:'Café Harmonic – Coffee Menu (table, English)',
  h1:'Coffee <em>Menu</em>', sub:'', single:true,
  note:`    <div class="only">${NOTE_EN}</div>`,
}));
console.log('ok');

// Kétoldalas asztali kártya: 1. oldal magyar, 2. oldal angol (egy PDF-ben)
const body = f => fs.readFileSync(f, 'utf8').match(/<body>([\s\S]*)<\/body>/)[1];
const head = fs.readFileSync('asztali-hu.html', 'utf8').match(/<head>[\s\S]*<\/head>/)[0]
  .replace(/<title>.*<\/title>/, '<title>Café Harmonic – Árlista / Coffee Menu (asztali, kétoldalas)</title>')
  .replace('</head>', '<style>html,body{height:auto} .sheet{break-after:page; page-break-after:always} .sheet:last-child{break-after:auto; page-break-after:auto}</style>\n</head>');
fs.writeFileSync('asztali-ketoldalas.html', `<!doctype html>\n<html lang="hu">\n${head}\n<body>${body('asztali-hu.html')}${body('asztali-en.html')}</body>\n</html>\n`);
