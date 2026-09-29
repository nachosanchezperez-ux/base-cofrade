export const AUTHOR_CATEGORIES = [
  {
    key: 'music',
    slug: 'musica',
    code: 'MU',
    label: 'Música',
    personLabel: 'Compositor',
    workshopLabel: 'Entidad musical',
    kicker: 'Composición y repertorio',
    description: 'Compositores, adaptadores y autores vinculados al repertorio procesional.',
    detailTitle: 'Su obra musical, en contexto',
    detailCopy: 'Marchas, autorías y relaciones musicales documentadas dentro del grafo de Hilo Cofrade.',
    terms: ['composicion', 'adaptacion musical', 'armonizacion', 'instrumentacion', 'musica'],
    hints: ['compositor', 'autor musical', 'musica procesional', 'adaptador musical'],
  },
  {
    key: 'imagery',
    slug: 'imagineria',
    code: 'IM',
    label: 'Imaginería y escultura',
    personLabel: 'Imaginero / escultor',
    workshopLabel: 'Taller de imaginería',
    kicker: 'Creación escultórica',
    description: 'Imagineros, escultores y autores de imágenes vinculadas a hermandades y patrimonio devocional.',
    detailTitle: 'Imágenes y obra escultórica',
    detailCopy: 'Autorías, imágenes, intervenciones y piezas relacionadas con su producción documentada.',
    terms: ['imagineria', 'escultura', 'modelado'],
    hints: ['imaginero', 'escultor', 'escultora'],
  },
  {
    key: 'restoration',
    slug: 'restauracion',
    code: 'RE',
    label: 'Restauración y conservación',
    personLabel: 'Restaurador / conservador',
    workshopLabel: 'Taller de restauración',
    kicker: 'Conservación patrimonial',
    description: 'Profesionales y talleres responsables de restauraciones, conservación e intervenciones.',
    detailTitle: 'Intervenciones y conservación',
    detailCopy: 'Restauraciones, tratamientos y actuaciones patrimoniales ordenadas desde la obra intervenida.',
    terms: ['restauracion', 'conservacion'],
    hints: ['restaurador', 'restauradora', 'conservador', 'conservadora'],
  },
  {
    key: 'dressing',
    slug: 'vestidores',
    code: 'VE',
    label: 'Vestidores',
    personLabel: 'Vestidor',
    workshopLabel: 'Taller de vestimenta',
    kicker: 'Vestimenta de imágenes',
    description: 'Vestidores y responsables de la presentación textil y estética de imágenes devocionales.',
    detailTitle: 'Vestimentas e intervenciones',
    detailCopy: 'Trabajos de vestimenta y relaciones patrimoniales documentadas en cada imagen o conjunto.',
    terms: ['vestidor', 'vestimenta', 'vestuario'],
    hints: ['vestidor', 'vestidora'],
  },
  {
    key: 'textile',
    slug: 'bordado-textil',
    code: 'BO',
    label: 'Bordado y arte textil',
    personLabel: 'Bordador / artista textil',
    workshopLabel: 'Taller de bordado',
    kicker: 'Bordado y confección',
    description: 'Bordadores, talleres y especialistas en confección, conservación y creación textil.',
    detailTitle: 'Obra textil y bordados',
    detailCopy: 'Piezas, fases e intervenciones textiles vinculadas a hermandades, imágenes y pasos.',
    terms: ['bordado', 'confeccion', 'textil'],
    hints: ['bordador', 'bordadora', 'taller de bordado', 'arte textil'],
  },
  {
    key: 'goldsmith',
    slug: 'orfebreria',
    code: 'OR',
    label: 'Orfebrería',
    personLabel: 'Orfebre',
    workshopLabel: 'Taller de orfebrería',
    kicker: 'Metal y artes suntuarias',
    description: 'Orfebres y talleres relacionados con piezas, enseres y fases de ejecución patrimonial.',
    detailTitle: 'Piezas y trabajos de orfebrería',
    detailCopy: 'Obras, fases e intervenciones en metal documentadas a través de sus relaciones.',
    terms: ['orfebreria'],
    hints: ['orfebre', 'orfebreria', 'platero', 'plateria'],
  },
  {
    key: 'carving',
    slug: 'talla-dorado',
    code: 'TA',
    label: 'Talla, carpintería y dorado',
    personLabel: 'Tallista / dorador',
    workshopLabel: 'Taller de talla y dorado',
    kicker: 'Arquitectura del paso',
    description: 'Tallistas, carpinteros y doradores vinculados a pasos, canastos, respiraderos y estructuras.',
    detailTitle: 'Pasos, fases y ejecución material',
    detailCopy: 'Trabajos de talla, carpintería y dorado situados en la fase concreta de cada paso.',
    terms: ['talla', 'carpinteria', 'dorado'],
    hints: ['tallista', 'dorador', 'doradora', 'ebanista', 'carpintero', 'carpinteria'],
  },
  {
    key: 'visual',
    slug: 'diseno-pintura',
    code: 'DI',
    label: 'Diseño, pintura y cartelería',
    personLabel: 'Diseñador / artista',
    workshopLabel: 'Estudio artístico',
    kicker: 'Creación gráfica y pictórica',
    description: 'Diseñadores, pintores, cartelistas y autores de propuestas gráficas o artísticas.',
    detailTitle: 'Diseño y producción artística',
    detailCopy: 'Obras y colaboraciones gráficas o pictóricas vinculadas al patrimonio cofrade.',
    terms: ['diseno', 'pintura', 'carteleria', 'dibujo', 'direccion artistica'],
    hints: ['disenador', 'disenadora', 'cartelista', 'pintor', 'pintora', 'artista grafico', 'artista grafica'],
  },
  {
    key: 'patrimony',
    slug: 'patrimonio',
    code: 'PA',
    label: 'Patrimonio y otros oficios',
    personLabel: 'Autor patrimonial',
    workshopLabel: 'Taller patrimonial',
    kicker: 'Oficios aplicados al patrimonio',
    description: 'Perfiles con obra patrimonial documentada cuyo oficio concreto todavía no está normalizado.',
    detailTitle: 'Trabajos y relaciones patrimoniales',
    detailCopy: 'Obras, fases e intervenciones relacionadas mientras se completa la clasificación de oficio.',
    terms: [],
    hints: [],
  },
  {
    key: 'other',
    slug: 'otros',
    code: 'OT',
    label: 'Otros autores',
    personLabel: 'Autor',
    workshopLabel: 'Taller',
    kicker: 'Perfiles documentados',
    description: 'Autores y entidades con relaciones públicas suficientes pendientes de una clasificación más precisa.',
    detailTitle: 'Obra y relaciones documentadas',
    detailCopy: 'Relaciones públicas que conectan este perfil con el patrimonio y la música procesional.',
    terms: [],
    hints: [],
  },
]

function fold(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function authorCategoryBySlug(slug) {
  const normalized = fold(slug)
  return AUTHOR_CATEGORIES.find((category) => category.slug === normalized) || null
}

export function agentRelationBreakdown(agent = {}) {
  const explicit = agent.relationBreakdown || {}
  return {
    marches: Number(explicit.marches ?? agent.marches?.length ?? 0),
    images: Number(explicit.images ?? agent.images?.length ?? 0),
    heritage: Number(explicit.heritage ?? agent.heritage?.length ?? 0),
    steps: Number(explicit.steps ?? agent.steps?.length ?? 0),
  }
}

export function authorCategoryFor(agent = {}) {
  const disciplines = [
    agent.primaryDiscipline,
    ...(agent.disciplines || []),
  ].filter(Boolean).map(fold)

  for (const category of AUTHOR_CATEGORIES) {
    if (!category.terms.length) continue
    if (category.terms.some((term) => disciplines.some((discipline) => discipline.includes(term)))) {
      return category
    }
  }

  const editorialText = fold([agent.description, agent.summary].filter(Boolean).join(' '))
  if (editorialText) {
    for (const category of AUTHOR_CATEGORIES) {
      if (!category.hints?.length) continue
      if (category.hints.some((hint) => editorialText.includes(hint))) return category
    }
  }

  const relations = agentRelationBreakdown(agent)
  if (relations.marches > 0) return AUTHOR_CATEGORIES.find((category) => category.key === 'music')
  if (relations.images > 0) return AUTHOR_CATEGORIES.find((category) => category.key === 'imagery')
  if (relations.heritage > 0 || relations.steps > 0) {
    return AUTHOR_CATEGORIES.find((category) => category.key === 'patrimony')
  }
  return AUTHOR_CATEGORIES.find((category) => category.key === 'other')
}

export function authorKindLabel(agent = {}) {
  if (agent.kind === 'workshop') return 'Taller'
  if (agent.kind === 'company') return 'Empresa'
  if (agent.kind === 'institution') return 'Institución'
  return 'Persona'
}

export function authorProfileLabel(agent = {}) {
  const category = authorCategoryFor(agent)
  if (agent.kind === 'workshop') return category.workshopLabel
  if (agent.kind === 'company') return agent.primaryDiscipline ? `Empresa · ${agent.primaryDiscipline}` : 'Empresa'
  if (agent.kind === 'institution') return agent.primaryDiscipline ? `Institución · ${agent.primaryDiscipline}` : 'Institución'
  return category.personLabel
}

export function authorWorkOrder(categoryKey) {
  if (categoryKey === 'music') return ['marches', 'heritage', 'images', 'steps']
  if (categoryKey === 'imagery') return ['images', 'heritage', 'steps', 'marches']
  if (categoryKey === 'restoration') return ['heritage', 'images', 'steps', 'marches']
  if (categoryKey === 'dressing') return ['heritage', 'images', 'steps', 'marches']
  if (categoryKey === 'textile') return ['heritage', 'steps', 'images', 'marches']
  if (categoryKey === 'goldsmith') return ['steps', 'heritage', 'images', 'marches']
  if (categoryKey === 'carving') return ['steps', 'heritage', 'images', 'marches']
  if (categoryKey === 'visual') return ['heritage', 'images', 'steps', 'marches']
  return ['heritage', 'images', 'steps', 'marches']
}
