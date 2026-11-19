// Datos estructurados (JSON-LD) para buscadores: SoftwareApplication, Organization,
// WebSite y FAQPage. Todo sale de los mismos datos que se ven en la página.
import { BRAND_NAME, CONTACT, SEO } from './site';
import { PLANS } from './pricing';
import { FAQ } from './faq';

export function buildSchema(site: URL) {
  const url = site.href;
  const orgId = `${url}#organizacion`;

  const offers = PLANS.flatMap((plan) => {
    const list: Record<string, unknown>[] = [];
    const base = {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      url: `${url}#precios`,
      category: 'subscription',
      availability: 'https://schema.org/InStock',
    };
    if (plan.monthly !== null) {
      list.push({
        ...base,
        name: `Plan ${plan.name} (mensual)`,
        price: plan.monthly,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: plan.monthly,
          priceCurrency: 'ARS',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
        },
      });
    }
    if (plan.annual !== null) {
      list.push({
        ...base,
        name: `Plan ${plan.name} (anual)`,
        price: plan.annual,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: plan.annual,
          priceCurrency: 'ARS',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'ANN' },
        },
      });
    }
    return list;
  });

  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${url}#software`,
    name: BRAND_NAME,
    description: SEO.description,
    url,
    inLanguage: 'es-AR',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Sistema de control de stock, ventas y facturación electrónica',
    operatingSystem: 'Web (navegador de computadora, tablet y celular)',
    featureList: [
      'Productos y categorías con SKU y código de barras',
      'Precio de venta calculado a partir del costo más recargo',
      'Escáner de códigos de barras con la cámara del celular o lector USB',
      'Punto de venta con descuento de stock al instante y sin sobreventas',
      'Alertas de stock mínimo',
      'Compras a proveedores con actualización de costo promedio',
      'Cuenta corriente con proveedores',
      'Clientes con CUIT/DNI y condición frente al IVA',
      'Facturación electrónica ARCA: facturas A, B y C, notas de crédito, CAE y QR',
      'Libro IVA Ventas',
      'Historial de movimientos de stock inalterable',
      'Dashboard y 12 reportes exportables a Excel, CSV y PDF',
      'Usuarios, roles y permisos',
      'Auditoría de acciones',
    ],
    offers,
    publisher: { '@id': orgId },
  };

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name: BRAND_NAME,
    url,
    logo: new URL('/apple-touch-icon.png', site).href,
    email: CONTACT.email,
    telephone: CONTACT.phoneE164,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: CONTACT.email,
      telephone: CONTACT.phoneE164,
      areaServed: 'AR',
      availableLanguage: 'es',
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}#sitio`,
    name: BRAND_NAME,
    url,
    inLanguage: 'es-AR',
    publisher: { '@id': orgId },
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#preguntas`,
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return [software, organization, website, faqPage];
}
