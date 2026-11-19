// ─────────────────────────────────────────────────────────────────────────────
// Configuración central de la landing.
// Todo lo que está entre corchetes es un placeholder que hay que completar.
// Corré `npm run check:placeholders` para ver la lista de los que quedan.
// ─────────────────────────────────────────────────────────────────────────────

/** Nombre comercial del producto. Aparece en el header, footer, <title>, OG y JSON-LD.
 *  Mantenelo corto (≤ 15 caracteres) para que el <title> no pase de 60. */
export const BRAND_NAME = '[MARCA]';

/** Dominio definitivo, sin barra final. Se usa en canonical, sitemap, robots y Open Graph.
 *  También se puede definir con la variable de entorno SITE_URL al hacer el build.
 *  [DOMINIO] — reemplazar por el dominio real. */
export const SITE_URL = 'https://www.tudominio.com.ar';

/** Destino de TODOS los botones "Probalo gratis" (pantalla de registro de la app). */
export const SIGNUP_URL = 'https://instagram.com/lautyalde';

export const CONTACT = {
  email: 'alderetelautaro54@gmail.com',
  /** Como se muestra en pantalla. */
  phoneDisplay: '11 2712-0309',
  /** Formato internacional para tel: y JSON-LD (celular de AMBA: +54 9 11 …). */
  phoneE164: '+5491127120309',
  /** WhatsApp del mismo número. Si el número no tiene WhatsApp, cambialo por `tel:`. */
  whatsapp: 'https://wa.me/5491127120309',
} as const;

/** Arma un link de WhatsApp con un mensaje precargado. */
export const whatsappLink = (text: string) =>
  `${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const SEO = {
  /** ≤ 60 caracteres. El build falla si se pasa (ver scripts/check-seo.mjs). */
  title: `Sistema de stock y facturación para comercios | ${BRAND_NAME}`,
  /** ≤ 155 caracteres. */
  description:
    'Controlá el stock de tu kiosco, almacén o ferretería desde el celular. Ventas con escáner, compras y factura electrónica ARCA. Probalo 14 días gratis.',
  ogImage: '/og.png',
  ogImageAlt:
    'Dejá de perder plata por stock que no sabés que tenés. Sistema de stock y ventas para comercios. 14 días gratis, sin tarjeta.',
  themeColor: '#08843f',
} as const;

/** Microcopy que acompaña a cada botón "Probalo gratis". */
export const CTA_MICROCOPY = ['14 días gratis', 'Sin tarjeta', 'Cancelás cuando quieras'] as const;

/**
 * Prueba social.
 * - 'beta': muestra el bloque "Buscamos 5 comercios para el programa beta" (recomendado
 *   mientras no haya testimonios reales).
 * - 'testimonios': muestra las 3 tarjetas de src/data/testimonials.ts. Usalo SOLO cuando
 *   tengas testimonios reales de beta testers, con su permiso.
 */
export const SOCIAL_PROOF_MODE: 'beta' | 'testimonios' = 'beta';
