// Precios finales en pesos argentinos. Esta es la única fuente: la usan las tarjetas
// de precios y el JSON-LD (SoftwareApplication → offers).

export type Plan = {
  id: 'basico' | 'profesional' | 'empresa';
  name: string;
  /** Precio mensual en ARS (número entero). null = "A medida". */
  monthly: number | null;
  /** Precio anual en ARS. null = no hay precio anual publicado para este plan. */
  annual: number | null;
  /** Nota que acompaña al precio anual. */
  annualNote?: string;
  users: string;
  products: string;
  intro: string;
  features: string[];
  highlight?: string;
  cta: { label: string; kind: 'signup' | 'contact' };
};

export const PLANS: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    monthly: 14999,
    // [PRECIO ANUAL BÁSICO] — opcional. Si se define, aparece al elegir "Anual".
    // Mientras sea null, en "Anual" se muestra el precio mensual con la etiqueta "Pago mensual".
    annual: null,
    users: '2 usuarios',
    products: 'Hasta 500 productos',
    intro: 'Para arrancar a ordenar el stock y las ventas.',
    features: [
      'Inventario y ventas',
      'Escáner de códigos de barras',
      'Compras a proveedores',
      'Cuenta corriente con proveedores',
      'Reportes',
      'Imágenes de productos',
    ],
    cta: { label: 'Probalo gratis', kind: 'signup' },
  },
  {
    id: 'profesional',
    name: 'Profesional',
    monthly: 29999,
    annual: 299990,
    annualNote: '2 meses gratis',
    users: '10 usuarios',
    products: 'Hasta 5.000 productos',
    intro: 'Para facturar y tener todo bajo control.',
    features: [
      'Todo lo de Básico',
      'Facturación electrónica ARCA',
      'Exportación a Excel, CSV y PDF',
      'Roles personalizados',
      'Auditoría',
    ],
    highlight: 'Más elegido',
    cta: { label: 'Probalo gratis', kind: 'signup' },
  },
  {
    id: 'empresa',
    name: 'Empresa',
    monthly: null,
    annual: null,
    users: 'Usuarios sin límite',
    products: 'Productos sin límite',
    intro: 'Para distribuidoras con alto volumen.',
    features: ['Todo lo de Profesional', 'Pensado para alto volumen de compras y ventas'],
    cta: { label: 'Hablemos', kind: 'contact' },
  },
];

/** "$14.999" — formato argentino, sin decimales. */
export const formatARS = (value: number) =>
  '$' + new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(value);

/** Texto que va debajo de las tarjetas. */
export const PRICING_FOOTNOTE = 'Precios en pesos argentinos. [IVA incluido / + IVA].';
