// Personas duplicadas unificadas el 25/10/2026 (22 parejas).
// Cada par es [ficha que pasa a borrador, ficha conservada]: la URL antigua
// redirige de forma permanente a la conservada para no perder enlaces ni
// posicionamiento. Plan: docs/operations/UNIFICAR-PERSONAS-2026-10-25.sql.
export const UNIFIED_AUTHOR_REDIRECTS = [
  ['alberto-barea', 'alberto-barea-tejada'],
  ['alberto-escamez', 'alberto-escamez-lopez'],
  ['agente-alejandro-blanco', 'agente-alejandro-blanco-hernandez'],
  ['agente-antonio-david-rodriguez', 'antonio-david-rodriguez-gomez'],
  ['claudio-gomez-compositor', 'claudio-gomez-calado'],
  ['francisco-javier-cebrero', 'agente-francisco-javier-cebrero-arias'],
  ['agente-ignacio-garcia-perez', 'agente-ignacio-jose-garcia-perez'],
  ['agente-jesus-joaquin-espinosa-de-los-monteros', 'jesus-joaquin-espinosa-de-los-monteros-perez'],
  ['agente-joaquin-eligio', 'joaquin-eligio-brun'],
  ['jose-julio-vera', 'jose-julio-vera-cuder'],
  ['jose-manuel-toscano', 'jose-manuel-toscano-perez'],
  ['juan-de-dios-espinosa', 'juan-de-dios-espinosa-ordonez'],
  ['luis-manuel-catalan', 'luis-manuel-catalan-nunez'],
  ['rafael-bermudez', 'rafael-bermudez-medina'],
  ['enrique-castellanos-dorador', 'enrique-castellanos-luque'],
  ['fernandez-del-toro', 'rafael-fernandez-del-toro'],
  ['fernando-marmolejo-camargo', 'fernando-marmolejo'],
  ['francisco-javier-sanchez-de-los-reyes', 'javier-sanchez-de-los-reyes'],
  ['miguel-angel-valverde', 'miguel-angel-valverde-jimenez'],
  ['rafael-barbero-medina', 'rafael-barbero'],
  ['juan-antonio-blanco', 'juan-antonio-blanco-ramos'],
  ['juan-antonio-gonzalez-garcia-ventura', 'juan-ventura'],
]

export function unifiedAuthorRedirects() {
  return UNIFIED_AUTHOR_REDIRECTS.map(([from, to]) => ({
    source: `/autores/${from}`,
    destination: `/autores/${to}`,
    permanent: true,
  }))
}
