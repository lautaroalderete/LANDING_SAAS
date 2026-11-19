// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIOS — se completan SOLO con beta testers reales y con su permiso.
// No inventes nombres, frases, fotos ni métricas.
//
// Para mostrarlos:
//   1. Completá los 3 objetos de abajo (y poné la foto en src/assets/testimonios/).
//   2. En src/data/site.ts cambiá SOCIAL_PROOF_MODE a 'testimonios'.
// Mientras tanto la página muestra el bloque del programa beta.
// ─────────────────────────────────────────────────────────────────────────────

export type Testimonial = {
  /** Frase textual del cliente, en sus palabras. */
  quote: string;
  name: string;
  /** Rubro del comercio: "Kiosco", "Ferretería", etc. */
  business: string;
  city: string;
  /** Ruta a la foto en src/assets/testimonios/ (cuadrada, mínimo 160×160). null = avatar genérico. */
  photo: string | null;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: '[TESTIMONIO 1 — frase textual del cliente]',
    name: '[NOMBRE Y APELLIDO 1]',
    business: '[TESTIMONIO 1 — rubro]',
    city: '[CIUDAD 1]',
    photo: null, // [FOTO 1]
  },
  {
    quote: '[TESTIMONIO 2 — frase textual del cliente]',
    name: '[NOMBRE Y APELLIDO 2]',
    business: '[TESTIMONIO 2 — rubro]',
    city: '[CIUDAD 2]',
    photo: null, // [FOTO 2]
  },
  {
    quote: '[TESTIMONIO 3 — frase textual del cliente]',
    name: '[NOMBRE Y APELLIDO 3]',
    business: '[TESTIMONIO 3 — rubro]',
    city: '[CIUDAD 3]',
    photo: null, // [FOTO 3]
  },
];
