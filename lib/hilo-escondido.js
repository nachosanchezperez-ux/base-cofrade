// Banco editorial cerrado del piloto. No se generan respuestas con IA ni se leen tablas privadas.
export const GAME_PATH = '/juegos/el-hilo-escondido'
export const MAX_ATTEMPTS = 4
export const DAILY_START = '2026-10-12'

export const DAILY_PUZZLES = [
  {
    id: 'llamador', answer: 'LLAMADOR', category: 'El paso',
    riddle: 'No tiene voz, pero basta un golpe para que toda una cuadrilla escuche.',
    hints: [
      { label: 'Dónde', text: 'Se encuentra en la delantera de muchos pasos procesionales.' },
      { label: 'Quién', text: 'Lo utiliza el capataz para transmitir órdenes.' },
      { label: 'En la calle', text: 'También se conoce como martillo.' },
    ],
    definition: 'Pieza metálica situada habitualmente en la delantera del paso, sobre la que se golpea para transmitir órdenes a la cuadrilla.',
    related: { href: '/pasos', label: 'Descubrir los pasos de Hilo Cofrade' },
  },
  {
    id: 'peana', answer: 'PEANA', category: 'Patrimonio',
    riddle: 'Sostengo a quien recibe las miradas, aunque casi nadie se fija en mí.',
    hints: [
      { label: 'Dónde', text: 'Se sitúa bajo los pies de una imagen.' },
      { label: 'Función', text: 'Eleva una escultura sobre su soporte.' },
      { label: 'Detalle', text: 'En los pasos de palio suele ser una pieza destacada de orfebrería.' },
    ],
    definition: 'Base o soporte sobre el que se dispone una imagen; puede ser de talla, metal u otros materiales.',
    related: { href: '/imagenes', label: 'Explorar imágenes titulares' },
  },
  {
    id: 'cirial', answer: 'CIRIAL', category: 'El cortejo',
    riddle: 'Camino erguido entre acólitos y llevo una llama que no es mía.',
    hints: [
      { label: 'Dónde', text: 'Aparece en el cortejo litúrgico y procesional.' },
      { label: 'Quién', text: 'Lo porta un acólito.' },
      { label: 'Detalle', text: 'Es un candelero alto, generalmente de metal, con una vela.' },
    ],
    definition: 'Candelero alto, generalmente portado por un acólito, que sostiene una vela en el cortejo litúrgico o procesional.',
    related: { href: '/hermandades', label: 'Explorar hermandades' },
  },
  {
    id: 'bambalina', answer: 'BAMBALINA', category: 'El palio',
    riddle: 'Me muevo sin andar y bordo el contorno de un cielo de tela.',
    hints: [
      { label: 'Dónde', text: 'Cuelga del techo del palio.' },
      { label: 'Aspecto', text: 'Puede ser bordada, lisa o de malla.' },
      { label: 'Detalle', text: 'Es cada una de las caídas laterales o frontal y trasera del palio.' },
    ],
    definition: 'Cada una de las caídas de tejido que penden del techo de un paso de palio y forman su contorno.',
    related: { href: '/pasos', label: 'Descubrir pasos de palio' },
  },
  {
    id: 'costal', answer: 'COSTAL', category: 'Bajo las trabajaderas',
    riddle: 'La calle apenas me ve, pero protejo la cabeza de quien sostiene el paso.',
    hints: [
      { label: 'Dónde', text: 'Se coloca sobre la cabeza y la zona cervical.' },
      { label: 'Quién', text: 'Lo lleva el costalero, habitualmente con su morcilla.' },
      { label: 'Detalle', text: 'Se confecciona con tela para amortiguar el peso de la trabajadera.' },
    ],
    definition: 'Pieza de tela que el costalero coloca sobre la cabeza y la zona cervical, junto a la morcilla, para trabajar bajo la parihuela.',
    related: { href: '/igualas-y-ensayos', label: 'Consultar igualás y ensayos' },
  },
  {
    id: 'respiradero', answer: 'RESPIRADERO', category: 'El paso',
    riddle: 'Rodeo la parte baja del paso; a través de mis huecos entra el aire.',
    hints: [
      { label: 'Dónde', text: 'Se coloca alrededor de la zona inferior de las andas.' },
      { label: 'Aspecto', text: 'Puede ser de orfebrería, madera tallada o bordado.' },
      { label: 'Detalle', text: 'Suele ser una pieza calada que oculta parte de la estructura inferior.' },
    ],
    definition: 'Elemento calado que recorre la parte baja de un paso procesional, ornamentándolo y permitiendo ventilación.',
    related: { href: '/pasos', label: 'Conocer la estructura de los pasos' },
  },
  {
    id: 'simpecado', answer: 'SIMPECADO', category: 'Glorias y romerías',
    riddle: 'No soy una imagen de talla, pero concentro devociones de caminos y romerías.',
    hints: [
      { label: 'Qué es', text: 'Es una insignia o estandarte de carácter mariano.' },
      { label: 'Dónde', text: 'Tiene especial protagonismo en las hermandades del Rocío.' },
      { label: 'Detalle', text: 'Su nombre alude a la concepción de María sin pecado original.' },
    ],
    definition: 'Insignia mariana, habitualmente bordada y con representación de la Virgen, vinculada de forma especial a las hermandades rocieras.',
    related: { href: '/procesiones-de-gloria', label: 'Descubrir hermandades de gloria' },
  },
  {
    id: 'naveta', answer: 'NAVETA', category: 'Los acólitos',
    riddle: 'Soy pequeña como un barco, y de mí procede el aroma del cortejo.',
    hints: [
      { label: 'Dónde', text: 'Acompaña al incensario durante los cultos.' },
      { label: 'Función', text: 'Guarda granos de incienso antes de quemarlos.' },
      { label: 'Detalle', text: 'Su forma recuerda, en ocasiones, a una nave.' },
    ],
    definition: 'Recipiente litúrgico destinado a guardar el incienso que se utiliza con el incensario.',
    related: { href: '/hermandades', label: 'Explorar cultos de hermandades' },
  },
  {
    id: 'candeleria', answer: 'CANDELERÍA', category: 'El palio',
    riddle: 'Soy un bosque de cera que crece delante de la Virgen.',
    hints: [
      { label: 'Dónde', text: 'Ocupo la parte delantera de muchos pasos de palio.' },
      { label: 'Aspecto', text: 'Reúno candeleros de distinta altura.' },
      { label: 'Detalle', text: 'Mis velas suelen disponerse de forma escalonada.' },
    ],
    definition: 'Conjunto y disposición de candeleros y velas que se sitúan principalmente ante una imagen mariana en un paso de palio.',
    related: { href: '/pasos', label: 'Explorar los pasos de palio' },
  },
  {
    id: 'canasto', answer: 'CANASTO', category: 'El paso',
    riddle: 'Soy arquitectura sobre ruedas y a veces relato una pasión con madera tallada.',
    hints: [
      { label: 'Dónde', text: 'Formo parte de la estructura ornamental superior de muchos pasos de Cristo.' },
      { label: 'Aspecto', text: 'Suele tener talla y motivos decorativos.' },
      { label: 'Detalle', text: 'No soy la parihuela: me sitúo sobre ella.' },
    ],
    definition: 'Cuerpo o estructura ornamental que se alza sobre la parihuela en numerosos pasos procesionales, frecuentemente trabajado en madera tallada.',
    related: { href: '/pasos', label: 'Descubrir pasos procesionales' },
  },
  {
    id: 'estandarte', answer: 'ESTANDARTE', category: 'Las insignias',
    riddle: 'Represento a toda una hermandad, aunque no soy su escudo por separado.',
    hints: [
      { label: 'Dónde', text: 'Se lleva en el cortejo procesional como insignia.' },
      { label: 'Aspecto', text: 'Es una pieza de tela con asta y elementos identificativos.' },
      { label: 'Detalle', text: 'El de la corporación también se conoce popularmente como bacalao.' },
    ],
    definition: 'Insignia de tela montada sobre un asta que representa a una corporación; en numerosas cofradías el estandarte corporativo se conoce como bacalao.',
    related: { href: '/hermandades', label: 'Conocer nuestras hermandades' },
  },
  {
    id: 'faldon', answer: 'FALDÓN', category: 'El paso',
    riddle: 'Cubro lo que sostiene al paso y sigo su movimiento a ras de calle.',
    hints: [
      { label: 'Dónde', text: 'Cuelgo de la parte baja de la parihuela.' },
      { label: 'Aspecto', text: 'Soy una pieza de tela, a menudo de terciopelo.' },
      { label: 'Detalle', text: 'Oculto parte de la estructura y de la cuadrilla al exterior.' },
    ],
    definition: 'Paño o revestimiento textil que cubre los laterales inferiores de un paso procesional, ocultando su estructura.',
    related: { href: '/pasos', label: 'Explorar pasos y patrimonio' },
  },
  {
    id: 'pertiguero', answer: 'PERTIGUERO', category: 'Los acólitos',
    riddle: 'Entre luces e incienso, coordino el cortejo con una vara de autoridad.',
    hints: [
      { label: 'Quién', text: 'Es uno de los participantes en el cuerpo de acólitos.' },
      { label: 'Función', text: 'Dirige los movimientos de quienes portan ciriales e incensarios.' },
      { label: 'Detalle', text: 'Porta una pértiga que le da nombre.' },
    ],
    definition: 'Acólito encargado de coordinar y ordenar el movimiento del cuerpo de acólitos, identificado por la pértiga que porta.',
    related: { href: '/hermandades', label: 'Descubrir el cortejo procesional' },
  },
  {
    id: 'varal', answer: 'VARAL', category: 'El palio',
    riddle: 'Soy uno entre varios, y entre todos elevamos el techo que acompaña a la Virgen.',
    hints: [
      { label: 'Dónde', text: 'Me sitúo a los lados de un paso de palio.' },
      { label: 'Aspecto', text: 'Suelo ser una pieza metálica alargada.' },
      { label: 'Detalle', text: 'Sostengo la estructura del techo del palio.' },
    ],
    definition: 'Cada uno de los soportes verticales, normalmente metálicos, que sostienen el techo de un paso de palio.',
    related: { href: '/pasos', label: 'Descubrir pasos de palio' },
  },
]

export const EXPERT_PUZZLES = [
  {
    id: 'capataz', answer: 'CAPATAZ', category: 'La cuadrilla',
    riddle: 'No voy debajo, pero todos escuchan mi voz cuando el paso se levanta.',
    hints: [
      { label: 'Mi puesto', text: 'Dirijo la cuadrilla habitualmente desde delante del paso.' },
      { label: 'Mi cometido', text: 'Transmito las órdenes de trabajo a los costaleros.' },
      { label: 'Mi señal', text: 'Puedo servirme del llamador para dar avisos.' },
    ],
    definition: 'Responsable de dirigir la cuadrilla que porta el paso y coordinar sus movimientos durante la salida procesional.',
    related: { href: '/pasos', label: 'Descubrir los pasos y sus cuadrillas' },
  },
  {
    id: 'trabajadera', answer: 'TRABAJADERA', category: 'Bajo el paso',
    riddle: 'Soy madera atravesada y muchos cuellos sienten sobre mí el peso de una devoción.',
    hints: [
      { label: 'Dónde', text: 'Estoy dentro de la parihuela, oculta bajo el paso.' },
      { label: 'Para qué', text: 'Sobre mí cargan los costaleros.' },
      { label: 'Cómo', text: 'Soy una viga transversal de madera.' },
    ],
    definition: 'Viga transversal de la parihuela sobre la que apoyan y cargan los costaleros.',
    related: { href: '/igualas-y-ensayos', label: 'Consultar igualás y ensayos' },
  },
  {
    id: 'chicota', answer: 'CHICOTÁ', category: 'La cuadrilla',
    riddle: 'Empiezo con la orden de avanzar y termino cuando el paso se para.',
    hints: [
      { label: 'Cuándo', text: 'Sucedo durante el recorrido procesional.' },
      { label: 'Quién', text: 'La realiza la cuadrilla a las órdenes del capataz.' },
      { label: 'Detalle', text: 'Es el tramo de avance del paso entre dos paradas.' },
    ],
    definition: 'Tramo que recorre un paso procesional de forma continuada entre dos paradas.',
    related: { href: '/pasos', label: 'Seguir el hilo de nuestros pasos' },
  },
]

export function normalizeAnswer(value) {
  return String(value ?? '')
    .trim()
    .toLocaleUpperCase('es-ES')
    .normalize('NFD')
    .replace(/[\u0300-\u0302\u0304-\u036f]/g, '')
    .normalize('NFC')
    .replace(/[^A-ZÑ]/g, '')
}

export function getMadridDayKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const part = (type) => parts.find((item) => item.type === type)?.value
  return [part('year'), part('month'), part('day')].join('-')
}

export function puzzleForDay(dayKey) {
  const serial = Date.parse(String(dayKey) + 'T00:00:00Z')
  const launch = Date.parse(DAILY_START + 'T00:00:00Z')
  const days = Number.isFinite(serial) ? Math.max(0, Math.floor((serial - launch) / 86400000)) : 0
  return DAILY_PUZZLES[days % DAILY_PUZZLES.length]
}

export function roundScore(guesses = [], revealed = [], solved = false) {
  if (!solved) return 0
  return Math.max(20, 100 - (revealed.length * 18) - (Math.max(0, guesses.length - 1) * 12))
}

export function shareResult({ mode, dayKey, guesses = [], revealed = [], solved = false, step = 0 }) {
  const score = roundScore(guesses, revealed, solved)
  const headline = mode === 'expert' ? 'La última chicotá · cabo ' + (step + 1) + '/3' : 'El cabo del día · ' + dayKey
  return '🧵 El hilo escondido · Hilo Cofrade\n'
    + headline + '\n'
    + (solved ? '¡Desenredado! ' + score + '/100 puntos' : 'Esta vez se me ha enredado el hilo') + '\n'
    + 'Pistas: ' + revealed.length + ' · Intentos: ' + guesses.length + '/' + MAX_ATTEMPTS + '\n'
    + 'https://hilocofrade.es' + GAME_PATH
}
