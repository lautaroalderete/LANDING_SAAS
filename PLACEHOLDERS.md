# Placeholders para completar

Todo lo que está `[ENTRE CORCHETES]` en el código. Para ver lo que queda en cualquier momento:

```bash
npm run check:placeholders
```

(Sale con error mientras quede alguno, así que sirve como chequeo antes de publicar.)

## 1. Antes de publicar (se ven en la página o en Google)

| Placeholder | Dónde | Qué poner |
|---|---|---|
| `[MARCA]` | `src/data/site.ts` → `BRAND_NAME` | Nombre del producto (≤ 15 caracteres para que el `<title>` no pase de 60). Después corré `npm run assets` para regenerar la imagen OG. |
| `[DOMINIO]` | `src/data/site.ts` → `SITE_URL` (hoy `https://www.tudominio.com.ar`) | Dominio final, sin barra al final. También se puede definir con la variable de entorno `SITE_URL` en Netlify, Vercel o Cloudflare. Afecta canonical, sitemap, robots y Open Graph. |
| `[CAPTURA_DASHBOARD.webp]` | `src/assets/captura-dashboard.png` | Captura real del dashboard, 1600×1000 (16:10). Reemplazá el archivo con el mismo nombre (PNG, JPG o WebP; si cambiás la extensión, actualizá el `import` en `src/components/sections/Hero.astro`). Astro genera el AVIF/WebP solo. |
| `[VIDEO_DEMO.mp4]` | `public/demo/demo.mp4` (+ opcional `public/demo/demo.webm`) | Grabación vertical del celular, 15–30 s, sin audio: escanear → venta confirmada → baja el stock. El build lo detecta solo; mientras no esté, se muestra el poster. Comandos de `ffmpeg` en `src/components/sections/Demo.astro`. |
| Poster del video | `src/assets/poster-demo.png` | Primer cuadro del video, 720×1560. |
| `[IVA incluido / + IVA]` | `src/data/pricing.ts` → `PRICING_FOOTNOTE` | Elegí una de las dos. |
| `[proveedor/ubicación]` | `src/data/faq.ts` (y `privacidad.astro`) | Dónde están los servidores (ej.: "Hetzner, Alemania"). |
| `[frecuencia]` | `src/data/faq.ts` (y `privacidad.astro`) | Frecuencia de los backups (ej.: "todos los días"). |
| `[SI]` + `[COMPLETAR: cómo se importan los productos desde Excel.]` | `src/data/faq.ts` | Confirmar y explicar en una línea cómo se importa. |
| `[Medio de pago: transferencia / Mercado Pago]` | `src/data/faq.ts` | Medios de pago reales. |

## 2. Páginas legales (hoy están con `noindex`)

| Placeholder | Dónde |
|---|---|
| `[RAZÓN SOCIAL]`, `[CUIT]`, `[DOMICILIO]`, `[FECHA]` | `src/pages/terminos.astro`, `src/pages/privacidad.astro` |
| `[IVA incluido / + IVA]`, `[medio de pago: …]`, `[COMPLETAR: periodicidad de facturación…]` | `src/pages/terminos.astro` |
| `[proveedor/ubicación]`, `[frecuencia]`, `[COMPLETAR: datos técnicos y cookies…]`, `[COMPLETAR: comunicaciones comerciales…]`, `[COMPLETAR: cómo pedir la eliminación definitiva.]` | `src/pages/privacidad.astro` |

Son borradores con la información real del producto. **Hacelos revisar por un abogado** (Ley 25.326 de datos personales, Ley 24.240 de Defensa del Consumidor y Res. 424/2020 "botón de arrepentimiento"). Cuando estén listos: sacá `noindex` en `src/layouts/LegalLayout.astro` y sumá las rutas a `src/pages/sitemap.xml.ts`.

## 3. Testimonios (cuando haya beta testers reales)

| Placeholder | Dónde |
|---|---|
| `[TESTIMONIO 1/2/3 — frase textual del cliente]`, `[NOMBRE Y APELLIDO 1/2/3]`, `[TESTIMONIO 1/2/3 — rubro]`, `[CIUDAD 1/2/3]`, `[FOTO 1/2/3]` | `src/data/testimonials.ts` (fotos en `src/assets/testimonios/`) |
| `[TÍTULO TESTIMONIOS]` | `src/components/sections/SocialProof.astro` |

Mientras tanto la página muestra el bloque **"Buscamos 5 comercios para el programa beta"**. Para mostrar los testimonios, cambiá `SOCIAL_PROOF_MODE` a `'testimonios'` en `src/data/site.ts`. Nunca publiques testimonios inventados.

## 4. Opcionales

| Placeholder | Dónde | Nota |
|---|---|---|
| `[PRECIO ANUAL BÁSICO]` | `src/data/pricing.ts` | Hoy el Básico no tiene precio anual: con "Anual" seleccionado muestra el mensual con la etiqueta "Pago mensual". Si definís `annual`, aparece solo. |

## 5. Para revisar (no son placeholders, pero conviene confirmar)

- **Botones "Probalo gratis"** → `https://instagram.com/lautyalde` (`SIGNUP_URL` en `src/data/site.ts`). Cuando tengas la URL real de registro, cambiala ahí y se actualizan los 5 botones.
- **WhatsApp**: "Hablemos" (plan Empresa) y "Quiero sumarme a la beta" abren `wa.me/5491127120309` con un mensaje precargado. Si ese número no tiene WhatsApp, cambiá `CONTACT.whatsapp` en `src/data/site.ts`.
- **"Más elegido"** en el plan Profesional: es una afirmación sobre clientes. Si todavía no hay datos que la respalden, cambiala por "Recomendado" en `src/data/pricing.ts` → `highlight`.
