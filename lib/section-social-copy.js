// Textos y estilo de las imágenes de vista previa (Open Graph) por sección.
//
// Decisión editorial (20/10/2026): las imágenes NO llevan fechas ni actos
// concretos. WhatsApp y X guardan la vista previa de cada URL durante días, así
// que un «Hoy · martes 20» seguiría mostrándose el jueves. El título fijo nunca
// caduca; los datos del día viven en la página.
//
// Tonos: «dark» es el azul marino corporativo; «light» es fondo blanco y se
// reserva para «Hoy», para que se distinga al instante. El rojo solo se usa en
// el hilo, nunca como color de texto (sobre azul no llega al contraste mínimo).

export const SECTION_SOCIAL_THEMES = {
  dark: {
    background: '#112339',
    ink: '#FFFFFF',
    soft: '#DBDEE2',
    accent: '#B01B32',
  },
  light: {
    background: '#FFFFFF',
    ink: '#112339',
    soft: '#4A5869',
    accent: '#B01B32',
  },
}

export const SECTION_SOCIAL_IMAGES = {
  home: {
    kicker: 'Enciclopedia cofrade',
    title: ['Todo conectado', 'por un mismo hilo'],
    subtitle: 'Hermandades, imágenes, pasos, bandas y patrimonio',
    theme: 'dark',
    alt: 'Hilo Cofrade · Enciclopedia cofrade de Sevilla y provincia',
  },
  agenda: {
    kicker: 'Sevilla y provincia',
    title: ['Toda la agenda', 'cofrade'],
    subtitle: 'Procesiones, cultos, igualás y conciertos',
    theme: 'dark',
    alt: 'Hilo Cofrade · Toda la agenda cofrade de Sevilla y provincia',
  },
  today: {
    kicker: 'Agenda cofrade',
    title: ['Hoy'],
    subtitle: 'Procesiones, cultos y actos del día',
    theme: 'light',
    alt: 'Hilo Cofrade · Agenda cofrade de hoy',
  },
  tomorrow: {
    kicker: 'Agenda cofrade',
    title: ['Mañana'],
    subtitle: 'Procesiones, cultos y actos de mañana',
    theme: 'dark',
    alt: 'Hilo Cofrade · Agenda cofrade de mañana',
  },
  weekend: {
    kicker: 'Agenda cofrade',
    title: ['Fin de', 'semana'],
    subtitle: 'Sábado y domingo en Sevilla y provincia',
    theme: 'dark',
    alt: 'Hilo Cofrade · Agenda cofrade del fin de semana',
  },
  crewEvents: {
    kicker: 'Calendario',
    title: ['Igualás', 'y ensayos'],
    subtitle: 'Cuadrillas de Sevilla y provincia',
    theme: 'dark',
    alt: 'Hilo Cofrade · Calendario de igualás y ensayos',
  },
}

export function sectionSocialImageConfig(key) {
  const config = SECTION_SOCIAL_IMAGES[key]
  if (!config) throw new Error(`Imagen de vista previa desconocida: ${key}`)
  return { ...config, colors: SECTION_SOCIAL_THEMES[config.theme] }
}

// Una sola línea se ve enorme; dos líneas largas necesitan bajar para caber
// en 1200 px sin cortarse.
export function sectionTitleFontSize(lines) {
  if (lines.length === 1) return 150
  const longest = Math.max(...lines.map((line) => line.length))
  return longest > 14 ? 104 : 118
}
