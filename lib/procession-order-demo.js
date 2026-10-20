// Demostración estructural del cortejo completo (Tarea 15). NO es información
// de ninguna Hermandad: solo sirve para ver la estructura en el laboratorio.
// Nunca se usa en una ficha pública.
const example = (label, kind, extra = {}) => ({ label, kind, ...extra })

export const PROCESSION_ORDER_DEMO = Object.freeze({
  demo: true,
  year: null,
  source: null,
  items: [
    example('Cruz de Guía (ejemplo)', 'cross_guide', { note: 'Con faroles de acompañamiento (ejemplo)' }),
    example('Tramo 1', 'tramo'),
    example('Insignia de ejemplo A', 'insignia', {
      heritage: { id: 'demo-a', author: 'Dato de ejemplo', date: 'Dato de ejemplo', materials: 'Dato de ejemplo', history: 'Texto de ejemplo: aquí iría la historia documentada de la pieza y sus restauraciones.', source: 'Fuente de ejemplo', href: '#patrimonio' },
    }),
    example('Tramo 2', 'tramo'),
    example('Insignia de ejemplo B', 'insignia'),
    example('Insignia de ejemplo C', 'insignia'),
    example('Antepresidencia (ejemplo)', 'antepresidency'),
    example('Cuerpo de acólitos (ejemplo)', 'acolytes'),
    example('Primer paso (ejemplo)', 'step', { note: 'Imágenes, capataz y música: los mismos del cortejo resumido.' }),
    example('Tramo 3', 'tramo'),
    example('Insignia de ejemplo D', 'insignia'),
    example('Representación invitada (ejemplo)', 'representation'),
    example('Tramo 4', 'tramo'),
    example('Insignia de ejemplo A', 'insignia', { heritage: { id: 'demo-a' }, note: 'La misma pieza no se describe dos veces.' }),
    example('Presidencia (ejemplo)', 'presidency'),
    example('Segundo paso (ejemplo)', 'step'),
  ].map((item, index) => ({ ...item, sequence: (index + 1) * 10, key: `demo-${index}` })),
})
