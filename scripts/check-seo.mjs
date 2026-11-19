// Verificación post-build de dist/index.html. Corta el build si algo de SEO o de las
// reglas de la landing se rompe. Se ejecuta solo con `npm run build`.
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const robots = await readFile(resolve(root, 'dist/robots.txt'), 'utf8');
const sitemap = await readFile(resolve(root, 'dist/sitemap.xml'), 'utf8');

const errors = [];
const ok = [];
const check = (cond, okMsg, errMsg) => (cond ? ok.push(okMsg) : errors.push(errMsg));

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
const attr = (re) => decode(html.match(re)?.[1] ?? '');

const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
const description = attr(/<meta name="description" content="([^"]*)"/);
check(title && [...title].length <= 60, `<title> ${[...title].length} caracteres`, `<title> tiene ${[...title].length} caracteres (máx. 60): "${title}"`);
check(
  description && [...description].length <= 155,
  `meta description ${[...description].length} caracteres`,
  `meta description tiene ${[...description].length} caracteres (máx. 155)`,
);
check(/<html lang="es-AR"/.test(html), 'lang="es-AR"', 'Falta <html lang="es-AR">');
const h1s = html.match(/<h1[\s>]/g) ?? [];
check(h1s.length === 1, 'un único <h1>', `Hay ${h1s.length} <h1> (debe haber 1)`);
check(/<link rel="canonical" href="https?:\/\/[^"]+"/.test(html), 'canonical', 'Falta canonical');
for (const prop of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card', 'twitter:image']) {
  check(html.includes(`"${prop}"`), prop, `Falta ${prop}`);
}

// JSON-LD válido y con los tipos pedidos.
const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
  try {
    return JSON.parse(m[1]);
  } catch (e) {
    errors.push('JSON-LD inválido: ' + e.message);
    return {};
  }
});
const types = ld.map((x) => x['@type']);
for (const t of ['SoftwareApplication', 'Organization', 'FAQPage']) {
  check(types.includes(t), `JSON-LD ${t}`, `Falta JSON-LD ${t}`);
}
const software = ld.find((x) => x['@type'] === 'SoftwareApplication');
check(
  software?.offers?.length > 0 && software.offers.every((o) => o.priceCurrency === 'ARS'),
  'offers en ARS',
  'SoftwareApplication sin offers en ARS',
);
const faq = ld.find((x) => x['@type'] === 'FAQPage');
const detailsCount = (html.match(/<details/g) ?? []).length;
check(
  faq?.mainEntity?.length === detailsCount,
  `FAQPage con ${detailsCount} preguntas (igual que la página)`,
  `FAQPage (${faq?.mainEntity?.length}) no coincide con los <details> (${detailsCount})`,
);

// Imágenes: todas con alt, width y height.
const imgs = html.match(/<img\b[^>]*>/g) ?? [];
const badImgs = imgs.filter((tag) => !/\balt="[^"]+"/.test(tag) || !/\bwidth="/.test(tag) || !/\bheight="/.test(tag));
check(badImgs.length === 0, `${imgs.length} <img> con alt/width/height`, `<img> sin alt/width/height: ${badImgs.join(' ')}`);
const eager = imgs.filter((tag) => !/loading="lazy"/.test(tag));
check(
  eager.length === 1 && /fetchpriority="high"/.test(eager[0]),
  'solo la imagen del hero sin lazy (fetchpriority="high")',
  `Imágenes sin lazy: ${eager.length} (solo debe ser la del hero, con fetchpriority="high")`,
);

// Todos los "Probalo gratis" apuntan al registro.
const siteTs = await readFile(resolve(root, 'src/data/site.ts'), 'utf8');
const SIGNUP_URL = siteTs.match(/export const SIGNUP_URL = '([^']+)'/)?.[1];
const ctas = [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>(?:(?!<\/a>)[\s\S])*?Probalo gratis/g)];
check(
  ctas.length > 0 && ctas.every((m) => decode(m[1]) === SIGNUP_URL),
  `${ctas.length} botones "Probalo gratis" → ${SIGNUP_URL}`,
  `Hay botones "Probalo gratis" que no apuntan a ${SIGNUP_URL}`,
);

// Palabras prohibidas en el texto visible.
const text = decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' '));
const banned = text.match(/\b(soluci[oó]n(es)?|integral(es)?|potenci[aá]|revolucion[aá])\b/gi);
check(!banned, 'sin palabras prohibidas', `Palabras prohibidas en la página: ${banned?.join(', ')}`);

check(/Sitemap: https?:\/\//.test(robots), 'robots.txt con Sitemap', 'robots.txt sin Sitemap');
check(/<urlset[\s\S]*<loc>https?:\/\//.test(sitemap), 'sitemap.xml', 'sitemap.xml inválido');

// JavaScript: solo el script del video (si hay video). Nada de bundles.
check(!/<script\b[^>]*\bsrc=/.test(html), 'sin JS externo', 'Hay <script src> en la página');

console.log('\nChequeo SEO / reglas de la landing');
ok.forEach((m) => console.log('  ✓', m));
errors.forEach((m) => console.log('  ✗', m));

const placeholders = new Set(text.match(/\[[^\]\n]{1,80}\]/g) ?? []);
if (placeholders.size) {
  console.log(`\n  ⚠ ${placeholders.size} placeholders visibles en la página (npm run check:placeholders):`);
  placeholders.forEach((p) => console.log('    ', p));
}

if (errors.length) {
  console.error(`\n${errors.length} error(es).`);
  process.exit(1);
}
console.log('');
