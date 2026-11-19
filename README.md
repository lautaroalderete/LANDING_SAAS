# Landing: sistema de stock y ventas

Landing de venta 100 % estática, hecha con **Astro 7 + Tailwind CSS 4**. Cero JavaScript en la página (solo un script mínimo para el video de la demo, y únicamente si el video existe). Lighthouse mobile medido en local: **100 / 100 / 100 / 100** (Performance, Accesibilidad, Buenas prácticas, SEO).

> Antes de publicar, completá los placeholders: ver **[PLACEHOLDERS.md](PLACEHOLDERS.md)**.

## Comandos

Requiere **Node ≥ 22.23.4**.

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera `dist/` y corre los chequeos de SEO (título ≤ 60, description ≤ 155, un solo `<h1>`, JSON-LD, imágenes con `alt`/`width`/`height`, palabras prohibidas, destino de los CTA…). Si algo falla, el build falla. |
| `npm run preview` | Sirve `dist/` para revisarlo |
| `npm run check` | Chequeo de tipos (`astro check`) |
| `npm run check:placeholders` | Lista los `[PLACEHOLDERS]` pendientes |
| `npm run assets` | Regenera favicon, `apple-touch-icon` y la imagen OG 1200×630 con el nombre de la marca. No pisa tus capturas (`--force` para pisarlas). |

## Estructura

```
src/
  data/                 ← todo el contenido editable
    site.ts             marca, dominio, URL de registro, contacto, SEO
    pricing.ts          planes y precios (alimenta tarjetas + JSON-LD)
    faq.ts              preguntas (alimenta <details> + JSON-LD FAQPage)
    testimonials.ts     testimonios (vacío hasta tener beta testers reales)
    schema.ts           JSON-LD: SoftwareApplication, Organization, WebSite, FAQPage
  components/
    Header, Footer, Logo, CtaButton, BrowserFrame, PhoneFrame
    sections/           Hero → Demo → Problems → Features → Audience →
                        Pricing → SocialProof → Faq → FinalCta
  layouts/              BaseLayout (metas, OG, JSON-LD), LegalLayout
  pages/                index, terminos, privacidad, 404, sitemap.xml, robots.txt
  assets/               captura-dashboard.png, poster-demo.png (placeholders)
  styles/global.css     tema de Tailwind (colores, tipografía, botones)
public/                 favicon.svg/.ico, apple-touch-icon.png, og.png, _headers
scripts/                generate-assets, check-seo, check-placeholders
```

## Deploy

Salida estática en `dist/`. Definí la variable de entorno `SITE_URL` con el dominio final (o editá `src/data/site.ts`).

- **Netlify**: conectá el repo. `netlify.toml` ya define build, carpeta y Node 22. Cabeceras en `public/_headers`.
- **Vercel**: conectá el repo. `vercel.json` define build, carpeta y cabeceras.
- **Cloudflare Pages**: build command `npm run build`, output `dist`, variable `NODE_VERSION=22`. Usa `public/_headers`.

Los archivos de `/_astro/` llevan hash en el nombre y se cachean un año (`immutable`).

## Decisiones técnicas

- **CSS inline**: Tailwind ya purgado va dentro del `<head>` (`build.inlineStylesheets: 'always'`), sin requests que bloqueen el render.
- **Tipografía**: Figtree variable autoalojada (Fontsource), `font-display: swap`, con precarga del subset latino (20 kB). El navegador no baja nada más para español.
- **Imágenes**: `astro:assets` convierte las capturas a AVIF y WebP en 4 anchos con `width`/`height`. La del hero va con `fetchpriority="high"` y sin lazy; el resto, `loading="lazy"`.
- **Video**: `muted loop playsinline preload="none"` + `poster`. **No lleva el atributo `autoplay`** a propósito: con `autoplay` el navegador ignora `preload="none"` y baja el video apenas carga la página, aunque esté fuera de pantalla. En su lugar, un script inline chiquito lo reproduce cuando entra en pantalla, lo pausa al salir, respeta "reducir movimiento" y agrega un botón de pausa (WCAG 2.2.2). Sin JS, se ve el poster.
- **Toggle Mensual/Anual**: 100 % CSS (radios + `:has()`), sin JavaScript. Los dos precios están en el HTML.
- **Precios en mobile**: para que la sección entre en una pantalla, en el celular se ve una tarjeta por vez con un selector de plan (arranca en Profesional). También es CSS puro. En navegadores sin `:has()` se ven las tres apiladas.
- **FAQ**: `<details>/<summary>` nativo con `name="faq"` (se abre una por vez). El texto sale del mismo archivo que el JSON-LD `FAQPage`, así siempre coinciden.
- **Íconos**: Lucide (`@lucide/astro`), SVG inline renderizado en el build.
- **Datos estructurados**: sin `aggregateRating` ni reseñas, porque todavía no hay. Google puede no mostrar el resultado enriquecido de `SoftwareApplication` hasta que existan reseñas reales.
