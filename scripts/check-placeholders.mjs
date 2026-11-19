// Lista todos los placeholders [ENTRE CORCHETES] que quedan en el código fuente.
// Sale con código 1 si queda alguno: usalo como chequeo antes de publicar.
//   npm run check:placeholders
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const exts = new Set(['.astro', '.ts', '.mjs', '.css']);

// Un placeholder es texto entre corchetes que empieza con letra y no parece código
// (índices, arrays, clases arbitrarias de Tailwind como size-[30rem] o md:[grid-area:x]).
const candidate = /(?<![\w\-:.$`(])\[([A-Za-zÁÉÍÓÚÑáéíóúñ$][^[\]\n]{0,100})\]/g;
const looksLikeCode =
  /[=(){}#'"`;]|^[a-z]\w*(?:,\s*[a-z]\w*)+$|^[a-z]+(?:-[a-z]+)+$|\d(?:px|rem|fr|%)|^[\w-]+:\S|^\.\.\./;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (exts.has(p.slice(p.lastIndexOf('.')))) yield p;
  }
}

const found = [];
for await (const file of walk(join(root, 'src'))) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(candidate)) {
      if (looksLikeCode.test(m[1])) continue;
      found.push(`${relative(root, file).replace(/\\/g, '/')}:${i + 1}  ${m[0]}`);
    }
  });
}

if (!found.length) {
  console.log('✓ No quedan placeholders.');
} else {
  console.log(`Quedan ${found.length} placeholders:\n`);
  found.forEach((f) => console.log('  ' + f));
  process.exitCode = 1;
}
