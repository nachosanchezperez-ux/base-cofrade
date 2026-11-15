// Piloto editorial selectivo: contenido documentado, no generado desde los recuentos.
// No añade nuevas URL ni sustituye las relaciones o la agenda ya existentes.
const municipalEditorial = {
  'dos-hermanas': {
    title: 'Santa Ana y Valme: dos devociones de Dos Hermanas',
    paragraphs: [
      'La historia de Dos Hermanas está ligada a Santa Ana, patrona de la ciudad, cuya festividad se celebra el 26 de julio. Su hermandad y las corporaciones de penitencia y de gloria permiten recorrer la vida cofrade del casco urbano y de barrios como Montequinto.',
      'La Romería de Valme se celebra tradicionalmente el tercer domingo de octubre y conduce a los devotos hasta la ermita de Cuarto, en el término de Sevilla. La Junta de Andalucía la declaró Bien de Interés Cultural como actividad de interés etnológico en 2022. La guía conecta estas devociones con sus hermandades, imágenes, pasos y bandas.',
    ],
    related: [
      { label: 'Hermandad de Santa Ana', href: '/hermandades/hermandad-santa-ana-dos-hermanas' },
      { label: 'Hermandad de Valme', href: '/hermandades/hermandad-valme-dos-hermanas' },
      { label: 'Hermandades de Dos Hermanas', href: '/hermandades/localidad/dos-hermanas' },
    ],
    sources: [
      { label: 'Ayuntamiento de Dos Hermanas · Santa Ana', href: 'https://www.doshermanas.es/noticias/notas-de-prensa/EL-JUEVES-DE-FERIA-Y-EL-DIA-DE-SANTA-ANA-PATRONA-DE-DOS-HERMANAS-SERAN-FESTIVOS-LOCALES-EN-2025/' },
      { label: 'BOJA · Romería de Valme, BIC', href: 'https://www.juntadeandalucia.es/boja/2022/190/49' },
    ],
  },
  utrera: {
    title: 'Consolación y las hermandades de Utrera',
    paragraphs: [
      'Nuestra Señora de Consolación, patrona de Utrera, reúne cada 8 de septiembre a fieles y peregrinos en torno a su santuario. La celebración de su festividad y los cultos previos forman parte de las grandes tradiciones religiosas de la localidad.',
      'La Semana Santa utrerana reúne corporaciones con devociones muy reconocibles, como Jesús Nazareno, la Vera-Cruz, los Muchachos de Consolación, los Aceituneros y los Gitanos. Sus fichas permiten seguir los vínculos entre los titulares, el patrimonio procesional y la música de Utrera.',
    ],
    related: [
      { label: 'Hermandad de Consolación', href: '/hermandades/consolacion-utrera' },
      { label: 'Hermandad de Jesús Nazareno', href: '/hermandades/hermandad-jesus-nazareno-utrera' },
      { label: 'Hermandad de los Gitanos', href: '/hermandades/gitanos-de-utrera-utrera' },
      { label: 'Hermandades de Utrera', href: '/hermandades/localidad/utrera' },
    ],
    highlight: {
      title: 'Vía Crucis oficial de 2027',
      text: 'El Consejo Local de Hermandades anunció en octubre de 2026 que el Cristo de la Buena Muerte, de los Gitanos, presidiría el Vía Crucis oficial de 2027, con motivo del 70.º aniversario de su primera salida procesional en 1957.',
      href: '/el-hilo-se-mueve/buena-muerte-gitanos-via-crucis-utrera-2027',
      label: 'Conocer la designación documentada',
    },
    sources: [
      { label: 'Ayuntamiento de Utrera · Consolación', href: 'https://www.utrera.org/procesion-y-actos-conmemorativos-en-honor-a-la-virgen-de-consolacion/' },
      { label: 'Consejo de Hermandades de Utrera · Vía Crucis 2027', href: 'https://consejodehermandadesdeutrera.org/' },
    ],
  },
}

export function getMunicipalityEditorial(slug = '') {
  return municipalEditorial[slug] || null
}
