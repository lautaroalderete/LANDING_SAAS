// Genera los recursos gráficos derivados de la marca:
//   public/favicon.svg, public/favicon.ico, public/apple-touch-icon.png, public/og.png (1200×630)
// y, SOLO si no existen, las imágenes placeholder de la demo:
//   src/assets/captura-dashboard.png   → [CAPTURA_DASHBOARD.webp]
//   src/assets/poster-demo.png         → poster de [VIDEO_DEMO.mp4]
//
// Uso:  npm run assets            (regenera íconos y OG; respeta tus capturas reales)
//       npm run assets -- --force (pisa también los placeholders)
//
// Requiere Node ≥ 22.18 (importa el .ts de configuración directamente).

import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { BRAND_NAME } from '../src/data/site.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');

const C = {
  brand: '#08843f',
  brandDark: '#066a33',
  brandLight: '#d8f5e2',
  brandBg: '#effbf3',
  ink: '#0f172a',
  muted: '#475569',
  line: '#e5e7eb',
  paper: '#f7f8f6',
  skel: '#e2e8e4',
  skel2: '#cfd8d2',
};
const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

const out = async (rel, data) => {
  const p = resolve(root, rel);
  await mkdir(dirname(p), { recursive: true });
  await writeFile(p, data);
  console.log('  ✓', rel);
};

// ── Logo (isotipo): barras que suben, en un cuadrado redondeado verde ─────────
const logoMark = (size = 32) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="${C.brand}"/>
  <g fill="#fff">
    <rect x="7" y="17" width="3.5" height="8" rx="1.25"/>
    <rect x="12.25" y="13" width="3.5" height="12" rx="1.25"/>
    <rect x="17.5" y="9.5" width="3.5" height="15.5" rx="1.25"/>
    <rect x="22.75" y="6.5" width="2.5" height="18.5" rx="1.25" opacity=".55"/>
  </g>
</svg>`;

// ── ICO con PNG embebido (formato soportado por todos los navegadores actuales) ──
const pngToIco = (pngs) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + 16 * pngs.length;
  pngs.forEach(({ size, buf }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, dir, ...pngs.map((p) => p.buf)]);
};

// ── Open Graph 1200×630 ───────────────────────────────────────────────────────
const ogSvg = () => {
  const lines = ['Dejá de perder plata', 'por stock que no', 'sabés que tenés.'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="0" y="0" width="1200" height="630" fill="${C.paper}"/>
  <circle cx="1130" cy="40" r="260" fill="${C.brandBg}"/>
  <circle cx="1160" cy="610" r="180" fill="${C.brandLight}" opacity=".6"/>
  <g transform="translate(80 72)">
    <g transform="scale(1.75)">${logoMark(32).replace(/<\/?svg[^>]*>/g, '')}</g>
    <text x="74" y="40" font-family="${FONT}" font-size="34" font-weight="700" fill="${C.ink}">${esc(BRAND_NAME)}</text>
  </g>
  <text font-family="${FONT}" font-size="76" font-weight="800" fill="${C.ink}" letter-spacing="-1.5">
    ${lines.map((l, i) => `<tspan x="80" y="${238 + i * 88}">${esc(l)}</tspan>`).join('')}
  </text>
  <text x="80" y="512" font-family="${FONT}" font-size="30" font-weight="500" fill="${C.muted}">Sistema de stock y ventas para comercios</text>
  <rect x="80" y="540" width="474" height="54" rx="27" fill="${C.brand}"/>
  <text x="317" y="575" text-anchor="middle" font-family="${FONT}" font-size="25" font-weight="700" fill="#ffffff">14 días gratis · Sin tarjeta</text>
</svg>`;
};

// ── Placeholder: captura del dashboard (16:10). Esqueleto, sin datos inventados ─
const dashboardSvg = () => {
  const W = 1600;
  const H = 1000;
  const kpis = [0, 1, 2, 3]
    .map(
      (i) => `<g transform="translate(${300 + i * 320} 120)">
      <rect width="296" height="150" rx="16" fill="#fff" stroke="${C.line}" stroke-width="2"/>
      <rect x="28" y="32" width="120" height="16" rx="8" fill="${C.skel}"/>
      <rect x="28" y="70" width="170" height="36" rx="10" fill="${i === 3 ? C.brandLight : C.skel2}"/>
    </g>`,
    )
    .join('');
  const bars = [0.45, 0.62, 0.38, 0.7, 0.55, 0.82, 0.66, 0.9, 0.58, 0.74, 0.5, 0.86]
    .map((h, i) => {
      const bh = Math.round(h * 300);
      return `<rect x="${340 + i * 62}" y="${660 - bh}" width="36" height="${bh}" rx="8" fill="${i === 11 ? C.brand : C.skel2}"/>`;
    })
    .join('');
  const rows = [0, 1, 2, 3, 4]
    .map(
      (i) => `<g transform="translate(1124 ${370 + i * 62})">
      <rect width="40" height="40" rx="10" fill="${C.skel}"/>
      <rect x="56" y="6" width="${150 - i * 12}" height="12" rx="6" fill="${C.skel2}"/>
      <rect x="56" y="26" width="90" height="10" rx="5" fill="${C.skel}"/>
      <rect x="348" y="10" width="56" height="22" rx="11" fill="#fde2e1"/>
    </g>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  <rect width="260" height="${H}" fill="#fff"/>
  <rect x="260" width="2" height="${H}" fill="${C.line}"/>
  <rect x="32" y="36" width="44" height="44" rx="12" fill="${C.brand}"/>
  <rect x="90" y="48" width="120" height="20" rx="10" fill="${C.skel2}"/>
  ${[0, 1, 2, 3, 4, 5, 6]
    .map(
      (i) =>
        `<rect x="32" y="${140 + i * 62}" width="196" height="40" rx="10" fill="${i === 0 ? C.brandBg : 'transparent'}"/>
         <rect x="48" y="${152 + i * 62}" width="16" height="16" rx="4" fill="${i === 0 ? C.brand : C.skel2}"/>
         <rect x="76" y="${154 + i * 62}" width="${110 - (i % 3) * 18}" height="12" rx="6" fill="${i === 0 ? C.brand : C.skel}"/>`,
    )
    .join('')}
  <rect x="300" y="48" width="320" height="28" rx="14" fill="${C.skel2}"/>
  ${kpis}
  <g transform="translate(300 310)">
    <rect width="784" height="400" rx="16" fill="#fff" stroke="${C.line}" stroke-width="2"/>
    <rect x="28" y="28" width="180" height="16" rx="8" fill="${C.skel2}"/>
  </g>
  <g transform="translate(0 0)">${bars}</g>
  <g transform="translate(1104 310)">
    <rect width="452" height="400" rx="16" fill="#fff" stroke="${C.line}" stroke-width="2"/>
    <rect x="20" y="28" width="160" height="16" rx="8" fill="${C.skel2}"/>
  </g>
  ${rows}
  <g transform="translate(300 740)">
    <rect width="1256" height="220" rx="16" fill="#fff" stroke="${C.line}" stroke-width="2"/>
    ${[0, 1, 2]
      .map(
        (i) => `<rect x="28" y="${40 + i * 56}" width="1200" height="2" fill="${C.line}"/>
        <rect x="28" y="${58 + i * 56}" width="260" height="14" rx="7" fill="${C.skel}"/>
        <rect x="560" y="${58 + i * 56}" width="120" height="14" rx="7" fill="${C.skel}"/>
        <rect x="1096" y="${58 + i * 56}" width="110" height="14" rx="7" fill="${C.skel2}"/>`,
      )
      .join('')}
  </g>
  <g transform="translate(${W / 2} ${H / 2})">
    <rect x="-430" y="-82" width="860" height="164" rx="24" fill="#fff" stroke="${C.brand}" stroke-width="4" stroke-dasharray="14 10"/>
    <text y="-14" text-anchor="middle" font-family="${FONT}" font-size="46" font-weight="800" fill="${C.ink}">[CAPTURA_DASHBOARD.webp]</text>
    <text y="40" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="500" fill="${C.muted}">Reemplazar por una captura real del dashboard</text>
  </g>
</svg>`;
};

// ── Placeholder: poster del video (pantalla de celular 9:19.5) ────────────────
const posterSvg = () => {
  const W = 720;
  const H = 1560;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  <rect width="${W}" height="150" fill="#fff"/>
  <rect y="150" width="${W}" height="2" fill="${C.line}"/>
  <rect x="40" y="70" width="52" height="52" rx="14" fill="${C.brand}"/>
  <rect x="112" y="84" width="220" height="24" rx="12" fill="${C.skel2}"/>
  <g transform="translate(60 210)">
    <rect width="600" height="420" rx="28" fill="${C.ink}" opacity=".92"/>
    <g fill="#fff" opacity=".9">
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        .map((i) => `<rect x="${130 + i * 25}" y="130" width="${i % 3 === 0 ? 12 : 6}" height="160" rx="2"/>`)
        .join('')}
    </g>
    <rect x="60" y="208" width="480" height="4" rx="2" fill="#4ade80"/>
  </g>
  ${[0, 1, 2]
    .map(
      (i) => `<g transform="translate(60 ${690 + i * 120})">
      <rect width="600" height="100" rx="20" fill="#fff" stroke="${C.line}" stroke-width="2"/>
      <rect x="24" y="24" width="52" height="52" rx="12" fill="${C.skel}"/>
      <rect x="96" y="30" width="${260 - i * 30}" height="16" rx="8" fill="${C.skel2}"/>
      <rect x="96" y="58" width="120" height="12" rx="6" fill="${C.skel}"/>
      <rect x="470" y="36" width="100" height="24" rx="12" fill="${C.skel2}"/>
    </g>`,
    )
    .join('')}
  <rect x="60" y="1340" width="600" height="110" rx="24" fill="${C.brand}"/>
  <rect x="250" y="1385" width="220" height="20" rx="10" fill="#fff" opacity=".85"/>
  <g transform="translate(${W / 2} 1110)">
    <rect x="-300" y="-36" width="600" height="190" rx="24" fill="#fff" stroke="${C.brand}" stroke-width="4" stroke-dasharray="14 10"/>
    <text y="30" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="800" fill="${C.ink}">[VIDEO_DEMO.mp4]</text>
    <text y="82" text-anchor="middle" font-family="${FONT}" font-size="26" font-weight="500" fill="${C.muted}">Escanear → vender → stock baja</text>
    <text y="122" text-anchor="middle" font-family="${FONT}" font-size="22" font-weight="500" fill="${C.muted}">(este es el poster del video)</text>
  </g>
</svg>`;
};

console.log(`Generando recursos para "${BRAND_NAME}"…`);

const mark = Buffer.from(logoMark(32));
await out('public/favicon.svg', logoMark(32));
const ico32 = await sharp(mark, { density: 72 * 8 }).resize(32, 32).png().toBuffer();
const ico16 = await sharp(mark, { density: 72 * 4 }).resize(16, 16).png().toBuffer();
await out(
  'public/favicon.ico',
  pngToIco([
    { size: 16, buf: ico16 },
    { size: 32, buf: ico32 },
  ]),
);
// apple-touch-icon: fondo lleno (iOS no respeta transparencias), 180×180.
const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${C.brand}"/>
  <g transform="translate(26 26) scale(4)">${logoMark(32)
    .replace(/<\/?svg[^>]*>/g, '')
    .replace(/<rect width="32" height="32" rx="8" fill="[^"]+"\/>/, '')}</g>
</svg>`;
await out('public/apple-touch-icon.png', await sharp(Buffer.from(appleSvg)).png().toBuffer());
await out(
  'public/og.png',
  await sharp(Buffer.from(ogSvg())).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer(),
);

for (const [rel, svg] of [
  ['src/assets/captura-dashboard.png', dashboardSvg()],
  ['src/assets/poster-demo.png', posterSvg()],
]) {
  if (!force && (await exists(resolve(root, rel)))) {
    console.log('  · ', rel, '(ya existe, no se pisa; usá --force)');
    continue;
  }
  await out(rel, await sharp(Buffer.from(svg)).png().toBuffer());
}

console.log('Listo.');
