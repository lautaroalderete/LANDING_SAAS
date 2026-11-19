// Preguntas frecuentes. Esta lista alimenta la sección <details> Y el JSON-LD FAQPage,
// así que el texto visible y el de los datos estructurados son siempre el mismo
// (Google lo exige). Escribí las respuestas en texto plano, sin HTML.

export type FaqItem = { q: string; a: string };

export const FAQ: FaqItem[] = [
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Las contraseñas se guardan cifradas con Argon2, las sesiones son seguras y los datos de cada empresa están aislados de los de las demás: nadie más ve tu información. Los servidores están en [proveedor/ubicación] y hacemos backups [frecuencia].',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí, no hay permanencia. Y si cancelás, tus datos no se borran: quedan disponibles en modo solo lectura para que los consultes y los exportes cuando quieras.',
  },
  {
    q: '¿Funciona en el celular?',
    a: 'Sí. Entrás desde el navegador del celular, la tablet o la computadora. Y el celular te sirve de escáner: apuntás la cámara al código de barras y listo.',
  },
  {
    q: '¿Necesito instalar algo o tener un lector de códigos?',
    a: 'No. No hay nada que instalar. Para escanear podés usar la cámara del celular o un lector USB común, y si un producto no tiene código lo cargás a mano.',
  },
  {
    q: '¿Puedo facturar electrónicamente?',
    a: 'Sí, con ARCA (ex AFIP), en el plan Profesional. Hacés facturas A, B y C y notas de crédito con CAE y QR desde el mismo punto de venta, y tenés el Libro IVA Ventas. Si ARCA no responde, la venta se registra igual y la factura se reintenta sola.',
  },
  {
    q: '¿Qué pasa cuando termina la prueba gratis?',
    a: 'Elegís el plan que te sirva y seguís como venías. Si no elegís ninguno, la cuenta queda en modo solo lectura: no se pierde nada. Como no te pedimos tarjeta, no hay cobros automáticos.',
  },
  {
    q: '¿Puedo cargar mis productos desde Excel?',
    a: '[SI]. [COMPLETAR: cómo se importan los productos desde Excel.]',
  },
  {
    q: '¿Cómo pago?',
    a: '[Medio de pago: transferencia / Mercado Pago].',
  },
  {
    q: '¿Cuántos empleados pueden usarlo?',
    a: 'Depende del plan: 2 usuarios en Básico, 10 en Profesional y sin límite en Empresa. Cada uno entra con su usuario y sus permisos. Por ejemplo, el empleado vende pero no ve costos ni toca precios, si no querés.',
  },
];
