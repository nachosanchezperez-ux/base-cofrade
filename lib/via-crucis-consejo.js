// Archivo editorial de los Vía Crucis del Consejo de Sevilla.
// Histórico contrastado con el Consejo (1976–2026). La edición excepcional
// de 2013 y la designación futura de 2027 se registran por separado.
// Los slugs son los de las fichas EXISTENTES en Supabase; no crean entidades.
export const SOURCE_HISTORY = 'https://www.hermandades-de-sevilla.org/13957-2/hermandades-viacrucis-consejo/'
export const SOURCE_CENSUS = 'https://www.hermandades-de-sevilla.org/hermandades/penitencia/'
export const SOURCE_2013 = 'https://www.hermandades-de-sevilla.org/viacrucis-2013/'
export const SOURCE_2027 = 'https://www.hermandades-de-sevilla.org/consejo/el-santisimo-cristo-de-la-exaltacion-presidira-el-via-crucis-de-sevilla-2027/'
export const CUTOFF_YEAR = 2026

export const DAYS = [
  'Viernes de Dolores', 'Sábado de Pasión', 'Domingo de Ramos',
  'Lunes Santo', 'Martes Santo', 'Miércoles Santo', 'Jueves Santo',
  'Madrugada', 'Viernes Santo', 'Sábado Santo', 'Domingo de Resurrección',
]

// Censo de las 71 hermandades pertenecientes a la sección de Penitencia
// del Consejo de Sevilla; no se incluyen agrupaciones parroquiales externas.
// Cada registro enlaza a una ficha canónica existente en Hilo Cofrade.
const censusRows = [
  ['Viernes de Dolores', [
    ['Pino Montano', 'hermandad-de-pino-montano'],
    ['La Misión', 'hermandad-de-la-mision-sevilla'],
    ['Dulce Nombre de Bellavista', 'dulce-nombre-bellavista'],
    ['Pasión y Muerte', 'pasion-y-muerte'],
    ['Bendición y Esperanza', 'bendicion-y-esperanza'],
    ['Cristo de la Corona', 'cristo-de-la-corona'],
  ]],
  ['Sábado de Pasión', [
    ['Padre Pío', 'padre-pio-sevilla'],
    ['Divino Perdón', 'hermandad-del-divino-perdon'],
    ['Torreblanca', 'torreblanca-jesus-cautivo'],
    ['San José Obrero', 'san-jose-obrero-sevilla'],
    ['La Milagrosa', 'hermandad-de-la-milagrosa-sevilla'],
  ]],
  ['Domingo de Ramos', [
    ['Jesús Despojado', 'hermandad-jesus-despojado-sevilla'],
    ['La Paz', 'hermandad-de-la-paz'],
    ['La Cena', 'la-cena'],
    ['La Hiniesta', 'hermandad-hiniesta-sevilla'],
    ['San Roque', 'hermandad-san-roque-sevilla'],
    ['La Estrella', 'hermandad-de-la-estrella'],
    ['La Amargura', 'hermandad-de-la-amargura'],
    ['El Amor', 'hermandad-del-amor'],
  ]],
  ['Lunes Santo', [
    ['Cautivo y Rescatado (San Pablo)', 'hermandad-de-san-pablo'],
    ['La Redención', 'hermandad-de-la-redencion'],
    ['Santa Genoveva', 'santa-genoveva'],
    ['San Gonzalo', 'hermandad-de-san-gonzalo'],
    ['Santa Marta', 'santa-marta-sevilla'],
    ['La Vera-Cruz', 'vera-cruz-sevilla'],
    ['Las Penas de San Vicente', 'las-penas-de-san-vicente'],
    ['Las Aguas', 'las-aguas-sevilla'],
    ['El Museo', 'el-museo'],
  ]],
  ['Martes Santo', [
    ['San Esteban', 'san-esteban'],
    ['El Cerro del Águila', 'hermandad-cerro-del-aguila-sevilla'],
    ['La Candelaria', 'hermandad-candelaria-sevilla'],
    ['San Benito', 'san-benito'],
    ['El Dulce Nombre', 'hermandad-del-dulce-nombre-sevilla'],
    ['Los Javieres', 'hermandad-los-javieres-sevilla'],
    ['Los Estudiantes', 'hermandad-de-los-estudiantes-sevilla'],
    ['Santa Cruz', 'santa-cruz'],
  ]],
  ['Miércoles Santo', [
    ['El Carmen Doloroso', 'carmen-doloroso'],
    ['La Sed', 'hermandad-de-la-sed'],
    ['San Bernardo', 'hermandad-de-san-bernardo'],
    ['El Buen Fin', 'hermandad-buen-fin-sevilla'],
    ['La Sagrada Lanzada', 'hermandad-sagrada-lanzada'],
    ['El Baratillo', 'el-baratillo'],
    ['Cristo de Burgos', 'cristo-de-burgos'],
    ['Las Siete Palabras', 'siete-palabras-sevilla'],
    ['Los Panaderos', 'hermandad-de-los-panaderos'],
  ]],
  ['Jueves Santo', [
    ['Los Negritos', 'hermandad-de-los-negritos'],
    ['La Exaltación', 'hermandad-de-la-exaltacion-sevilla'],
    ['Las Cigarreras', 'hermandad-de-las-cigarreras'],
    ['Monte-Sión', 'hermandad-monte-sion-sevilla'],
    ['La Quinta Angustia', 'quinta-angustia-sevilla'],
    ['El Valle', 'el-valle'],
    ['Pasión', 'hermandad-de-pasion-sevilla'],
  ]],
  ['Madrugada', [
    ['El Silencio', 'el-silencio-sevilla'],
    ['Gran Poder', 'hermandad-del-gran-poder-sevilla'],
    ['La Macarena', 'hermandad-de-la-macarena'],
    ['El Calvario', 'el-calvario-sevilla'],
    ['Esperanza de Triana', 'hermandad-esperanza-de-triana-sevilla'],
    ['Los Gitanos', 'hermandad-gitanos-sevilla'],
  ]],
  ['Viernes Santo', [
    ['La Carretería', 'hermandad-de-la-carreteria'],
    ['Soledad de San Buenaventura', 'soledad-san-buenaventura-sevilla'],
    ['El Cachorro', 'hermandad-del-cachorro'],
    ['La O', 'hermandad-de-la-o'],
    ['San Isidoro', 'hermandad-san-isidoro-sevilla'],
    ['Montserrat', 'montserrat'],
    ['La Sagrada Mortaja', 'sagrada-mortaja'],
  ]],
  ['Sábado Santo', [
    ['El Sol', 'hermandad-del-sol'],
    ['Los Servitas', 'servitas-sevilla'],
    ['La Trinidad', 'hermandad-de-la-trinidad-sevilla'],
    ['El Santo Entierro', 'santo-entierro-sevilla'],
    ['Soledad de San Lorenzo', 'la-soledad-de-san-lorenzo'],
  ]],
  ['Domingo de Resurrección', [
    ['La Resurrección', 'la-resurreccion'],
  ]],
]

export const councilBrotherhoods = censusRows.flatMap(([day, brotherhoods]) =>
  brotherhoods.map(([name, slug]) => ({ name, slug, day, href: '/hermandades/' + slug }))
)
const brotherhoodBySlug = new Map(councilBrotherhoods.map((brotherhood) => [brotherhood.slug, brotherhood]))

// Clasificación ICONOGRÁFICA editorial, distinta de los tratamientos de las imágenes.
// En particular, el Cristo de la Corona (2021) es un Nazareno con la cruz.
// "cautivo" incluye Prendimiento, juicio y Sentencia, no solo imágenes tituladas Cautivo.
export const ICONOGRAPHIES = [
  { key: 'crucificado', label: 'Crucificado', shortLabel: 'Crucificado' },
  { key: 'nazareno', label: 'Nazareno', shortLabel: 'Nazareno' },
  { key: 'cautivo', label: 'Prendimiento o juicio', shortLabel: 'Cautivo / juicio' },
  { key: 'otros', label: 'Otras escenas de la Pasión', shortLabel: 'Otras escenas' },
  { key: 'yacente', label: 'Cristo Yacente', shortLabel: 'Yacente' },
  { key: 'mariana', label: 'Imagen mariana', shortLabel: 'Virgen' },
]
export const ICONOGRAPHY_BY_KEY = Object.fromEntries(ICONOGRAPHIES.map((kind) => [kind.key, kind]))

// Año | slug de la hermandad | imagen titular | clasificación.
// La imagen titular se conserva como fuente histórica, sin inventar enlace a una
// ficha de imagen hasta verificar la relación precisa en Supabase.
const editionRows = [
  [2026, 'hermandad-hiniesta-sevilla', 'Santísimo Cristo de la Buena Muerte', 'crucificado'],
  [2025, 'santo-entierro-sevilla', 'Santísimo Cristo Yacente', 'yacente'],
  [2024, 'hermandad-de-la-redencion', 'Nuestro Padre Jesús de la Redención', 'cautivo'],
  [2023, 'hermandad-los-javieres-sevilla', 'Santísimo Cristo de las Almas', 'crucificado'],
  [2022, 'hermandad-de-los-panaderos', 'Nuestro Padre Jesús del Soberano Poder en su Prendimiento', 'cautivo'],
  [2021, 'cristo-de-la-corona', 'Santísimo Cristo de la Corona', 'nazareno'],
  [2020, 'hermandad-gitanos-sevilla', 'Nuestro Padre Jesús de la Salud', 'nazareno'],
  [2019, 'montserrat', 'Santísimo Cristo de la Conversión del Buen Ladrón', 'crucificado'],
  [2018, 'torreblanca-jesus-cautivo', 'Nuestro Padre Jesús Cautivo ante Pilato', 'cautivo'],
  [2017, 'hermandad-monte-sion-sevilla', 'Sagrada Oración de Nuestro Señor Jesucristo en el Huerto', 'otros'],
  [2016, 'hermandad-de-la-trinidad-sevilla', 'Santísimo Cristo de las Cinco Llagas', 'crucificado'],
  [2015, 'la-cena', 'Santísimo Cristo de la Humildad y Paciencia', 'otros'],
  [2014, 'el-museo', 'Santísimo Cristo de la Expiración', 'crucificado'],
  [2012, 'hermandad-candelaria-sevilla', 'Nuestro Padre Jesús de la Salud', 'nazareno'],
  [2011, 'hermandad-de-san-gonzalo', 'Nuestro Padre Jesús en su Soberano Poder ante Caifás', 'cautivo'],
  [2010, 'hermandad-de-la-carreteria', 'Santísimo Cristo de la Salud', 'crucificado'],
  [2009, 'hermandad-gitanos-sevilla', 'Nuestro Padre Jesús de la Salud', 'nazareno'],
  [2008, 'hermandad-buen-fin-sevilla', 'Santísimo Cristo del Buen Fin', 'crucificado'],
  [2007, 'el-valle', 'Nuestro Padre Jesús con la Cruz al Hombro', 'nazareno'],
  [2006, 'hermandad-esperanza-de-triana-sevilla', 'Santísimo Cristo de las Tres Caídas', 'nazareno'],
  [2005, 'hermandad-de-la-estrella', 'Nuestro Padre Jesús de las Penas', 'otros'],
  [2004, 'las-penas-de-san-vicente', 'Nuestro Padre Jesús de las Penas', 'nazareno'],
  [2003, 'hermandad-de-los-estudiantes-sevilla', 'Santísimo Cristo de la Buena Muerte', 'crucificado'],
  [2002, 'sagrada-mortaja', 'Nuestro Padre Jesús Descendido de la Cruz', 'otros'],
  [2001, 'el-calvario-sevilla', 'Santísimo Cristo del Calvario', 'crucificado'],
  [2000, 'san-esteban', 'Nuestro Padre Jesús de la Salud y Buen Viaje', 'otros'],
  [1999, 'cristo-de-burgos', 'Santísimo Cristo de Burgos', 'crucificado'],
  [1998, 'servitas-sevilla', 'Santísimo Cristo de la Providencia', 'otros'],
  [1997, 'hermandad-de-la-macarena', 'Nuestro Padre Jesús de la Sentencia', 'cautivo'],
  [1996, 'quinta-angustia-sevilla', 'Santísimo Cristo del Descendimiento', 'otros'],
  [1995, 'hermandad-san-roque-sevilla', 'Nuestro Padre Jesús de las Penas', 'nazareno'],
  [1994, 'hermandad-de-la-o', 'Nuestro Padre Jesús Nazareno', 'nazareno'],
  [1993, 'santa-genoveva', 'Nuestro Padre Jesús Cautivo en el Abandono de sus Discípulos', 'cautivo'],
  [1992, 'hermandad-san-isidoro-sevilla', 'Nuestro Padre Jesús de las Tres Caídas', 'nazareno'],
  [1991, 'san-benito', 'Santísimo Cristo de la Sangre', 'crucificado'],
  [1990, 'hermandad-de-la-amargura', 'Nuestro Padre Jesús del Silencio ante el Desprecio de Herodes', 'cautivo'],
  [1989, 'hermandad-de-san-bernardo', 'Santísimo Cristo de la Salud', 'crucificado'],
  [1988, 'la-soledad-de-san-lorenzo', 'María Santísima en su Soledad', 'mariana'],
  [1987, 'hermandad-del-gran-poder-sevilla', 'Nuestro Padre Jesús del Gran Poder', 'nazareno'],
  [1986, 'santo-entierro-sevilla', 'Santísimo Cristo Yacente', 'yacente'],
  [1985, 'el-baratillo', 'Santísimo Cristo de la Misericordia', 'crucificado'],
  [1984, 'santa-marta-sevilla', 'Santísimo Cristo de la Caridad', 'otros'],
  [1983, 'el-silencio-sevilla', 'Nuestro Padre Jesús Nazareno', 'nazareno'],
  [1982, 'vera-cruz-sevilla', 'Santísimo Cristo de la Vera-Cruz', 'crucificado'],
  [1981, 'hermandad-de-pasion-sevilla', 'Nuestro Padre Jesús de la Pasión', 'nazareno'],
  [1980, 'hermandad-del-amor', 'Santísimo Cristo del Amor', 'crucificado'],
  [1979, 'hermandad-del-gran-poder-sevilla', 'Nuestro Padre Jesús del Gran Poder', 'nazareno'],
  [1978, 'hermandad-del-cachorro', 'Santísimo Cristo de la Expiración', 'crucificado'],
  [1977, 'hermandad-de-los-negritos', 'Santísimo Cristo de la Fundación', 'crucificado'],
  [1976, 'santa-cruz', 'Santísimo Cristo de las Misericordias', 'crucificado'],
]

export const councilViaCrucisEditions = editionRows.map(([year, brotherhoodSlug, imageName, iconography]) => ({
  year, brotherhoodSlug, imageName, iconography,
  brotherhood: brotherhoodBySlug.get(brotherhoodSlug),
  status: year === 2021 ? 'celebrado_sin_traslado' : 'celebrado',
  sourceUrl: SOURCE_HISTORY,
}))

export const councilNextEdition = {
  year: 2027,
  date: '2027-02-15',
  brotherhoodSlug: 'hermandad-de-la-exaltacion-sevilla',
  imageName: 'Santísimo Cristo de la Exaltación',
  iconography: 'crucificado',
  brotherhood: brotherhoodBySlug.get('hermandad-de-la-exaltacion-sevilla'),
  status: 'designada',
  sourceUrl: SOURCE_2027,
}

export const councilExtraordinary2013 = {
  year: 2013,
  date: '2013-02-17',
  name: 'Vía Crucis extraordinario del Año de la Fe',
  status: 'celebrado_sin_pasos',
  plannedStations: 14,
  summary: 'Las catorce imágenes previstas no salieron por la lluvia. El ejercicio se rezó en la Catedral, sin los pasos.',
  sourceUrl: SOURCE_2013,
}

const participated = new Set(councilViaCrucisEditions.map((edition) => edition.brotherhoodSlug))
export const pendingBrotherhoods = councilBrotherhoods.filter((brotherhood) => !participated.has(brotherhood.slug))
export const pendingWithoutNextDesignation = pendingBrotherhoods.filter((brotherhood) => brotherhood.slug !== councilNextEdition.brotherhoodSlug)

export const councilDayStats = DAYS.map((day) => ({
  day,
  count: councilViaCrucisEditions.filter((edition) => edition.brotherhood?.day === day).length,
})).sort((a, b) => b.count - a.count || DAYS.indexOf(a.day) - DAYS.indexOf(b.day))

export const councilIconographyStats = ICONOGRAPHIES.map((kind) => ({
  ...kind, count: councilViaCrucisEditions.filter((edition) => edition.iconography === kind.key).length,
})).sort((a, b) => b.count - a.count)

export const councilRepeatedBrotherhoods = Object.entries(
  councilViaCrucisEditions.reduce((bySlug, edition) => {
    if (!bySlug[edition.brotherhoodSlug]) bySlug[edition.brotherhoodSlug] = []
    bySlug[edition.brotherhoodSlug].push(edition.year)
    return bySlug
  }, {})
).filter(([, years]) => years.length > 1).map(([slug, years]) => ({
  ...brotherhoodBySlug.get(slug), years,
}))

export const councilSummary = {
  editions: councilViaCrucisEditions.length,
  representedBrotherhoods: participated.size,
  census: councilBrotherhoods.length,
  pending: pendingBrotherhoods.length,
  withoutNextDesignation: pendingWithoutNextDesignation.length,
}
