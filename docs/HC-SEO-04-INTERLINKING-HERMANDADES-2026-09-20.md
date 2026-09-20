# HC-SEO-04 · Interlinking rastreable de Hermandades

Fecha de corte: 20 de septiembre de 2026.

## Diagnóstico

El directorio `/hermandades` ya ofrecía filtros útiles y un `ItemList` completo en JSON-LD, pero su estado inicial estaba orientado a la exploración interactiva:

- Sevilla capital mostraba accesos a categorías y calendarios;
- los municipios de la provincia se presentaban como botones;
- las tarjetas con enlaces a fichas solo aparecían después de buscar o seleccionar una localidad en el componente cliente;
- por tanto, el HTML inicial no distribuía enlaces directos a todas las fichas de Hermandades.

La familia ya tiene demanda orgánica observada en Search Console. HC-SEO-04 refuerza su descubrimiento sin retirar la experiencia de filtros existente.

## Cambio

La página incorpora un índice público renderizado en servidor que:

- enlaza directamente cada ficha publicada mediante `/hermandades/[slug]`;
- agrupa las corporaciones por localidad;
- prioriza Sevilla capital y ordena alfabéticamente el resto de municipios y fichas;
- muestra jornada y sede cuando están documentadas;
- ofrece navegación rápida entre localidades;
- desactiva el prefetch masivo de las fichas sin convertir los enlaces en controles de cliente;
- reutiliza el mismo conjunto de datos que alimenta el directorio y su `ItemList` estructurado.

No se crean rutas, consultas ni fuentes de datos adicionales.

## Validación local

- Tests específicos HC-SEO-04: 3/3.
- Suite completa: 999/999.
- `next build`: correcto con Next.js 16.3.0.
- `/hermandades`: 200, `text/html`, un H1 y canonical `https://hilocofrade.es/hermandades`.
- La build sin variables de Supabase conserva el estado vacío seguro ya existente.

## Puertas de preview

1. Contar los enlaces únicos `/hermandades/[slug]` del índice y compararlos con `ItemList.numberOfItems`.
2. Confirmar que cada ficha publicada aparece una sola vez dentro de su localidad.
3. Revisar orden, navegación por anclas y ausencia de scroll horizontal en escritorio y móvil.
4. Confirmar CI, Vercel y runtime limpios.
5. No fusionar ni desplegar a producción sin autorización explícita.

## Siguiente corte

HC-SEO-05 debe reforzar la frescura editorial de Agenda y Extraordinarias: retirar dependencias temporales rígidas, revisar la cobertura de `Event` y conectar mejor los calendarios especializados con sus fichas canónicas.
