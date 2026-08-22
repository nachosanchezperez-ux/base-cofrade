const DEFAULT_COLORS = {
  primario: '#153B69',
  secundario: '#A71930',
  claro: '#FFFFFF',
}

const COLOR_NAME_FALLBACKS = {
  blanco: '#FFFFFF',
  celeste: '#66B8D4',
}

function normalized(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function initials(name = '') {
  return String(name || '')
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function colorValue(color) {
  return color?.hex_value || COLOR_NAME_FALLBACKS[normalized(color?.color_name)] || null
}

function darkenHex(hex, amount = 0.52) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex || '')) return '#174F67'
  const channels = [1, 3, 5].map((position) => (
    Math.round(Number.parseInt(hex.slice(position, position + 2), 16) * amount)
      .toString(16)
      .padStart(2, '0')
  ))
  return `#${channels.join('')}`
}

function contrastText(hex) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex || '')) return '#FFFFFF'
  const [red, green, blue] = [1, 3, 5].map((position) => Number.parseInt(hex.slice(position, position + 2), 16))
  const brightness = ((red * 299) + (green * 587) + (blue * 114)) / 1000
  return brightness > 155 ? '#153B50' : '#FFFFFF'
}

function colorTheme(colors = [], fallback = DEFAULT_COLORS) {
  if (!colors.length) return fallback
  const primaryRow = colors.find((color) => color.color_role === 'primary') || colors[0]
  const whiteRow = colors.find((color) => (
    normalized(color.color_name) === 'blanco' || color.hex_value?.toUpperCase() === '#FFFFFF'
  ))
  const accentRow = colors.find((color) => (
    color.color_role !== 'primary' && normalized(color.color_name) !== 'blanco'
  ))
  const primary = colorValue(primaryRow) || fallback.primario || DEFAULT_COLORS.primario
  const accent = colorValue(accentRow) || primary
  return {
    primario: primary,
    secundario: accent,
    claro: colorValue(whiteRow) || fallback.claro || DEFAULT_COLORS.claro,
    oscuro: darkenHex(primary),
    sobreSecundario: contrastText(accent),
  }
}

function authoritativeBySlug(localItems = [], remoteItems = []) {
  const localBySlug = new Map(localItems.map((item) => [item.slug, item]))
  return remoteItems.map((remoteItem) => ({
    ...(localBySlug.get(remoteItem.slug) || {}),
    ...remoteItem,
  }))
}

function yearFrom(value = '') {
  return Number.parseInt(String(value).match(/\d{4}/)?.[0] || '0', 10)
}

function mappedSources(sources = []) {
  return sources.map((source) => ({
    id: source.id,
    nombre: source.name,
    url: source.url,
    descripcion: source.source_type,
  }))
}

export function applyManagedBrotherhoodSections({
  merged,
  local = null,
  remote,
  managedSections = [],
  historyText = '',
}) {
  if (!merged || !remote) return merged

  const base = local || {}
  const managed = new Set(managedSections)
  const isManaged = (section) => managed.has(section)
  const next = { ...merged }

  if (isManaged('identidad')) {
    next.nombrePopular = remote.brotherhood?.popular_name || remote.entity?.name || ''
    next.nombreOficial = remote.brotherhood?.official_name || remote.entity?.name || ''
    next.localidad = remote.municipality?.name || ''
    next.provincia = remote.municipality?.province || ''
    next.sede = remote.place?.name || ''
    next.barrio = remote.brotherhood?.neighborhood || ''
    next.fundacion = remote.brotherhood?.foundation_text || ''
    next.diaSalida = remote.brotherhood?.current_procession_day || ''
    next.tipos = remote.brotherhood?.brotherhood_types || []
    next.resumen = remote.entity?.summary || ''
    next.escudoPath = remote.brotherhood?.crest_path || null
  }

  if (isManaged('colores')) {
    next.colores = colorTheme(remote.colors || [], DEFAULT_COLORS)
  }

  if (isManaged('historia')) {
    next.historia = historyText || ''
  }

  if (isManaged('enlaces')) {
    next.enlacesOficiales = remote.socialLinks || []
  }

  if (isManaged('titulares')) {
    const remoteSlugs = new Set((remote.imagenes || []).map((item) => item.slug))
    next.imagenes = authoritativeBySlug(base.imagenes || [], remote.imagenes || []).map((imagen) => ({
      ...imagen,
      autor: imagen.autor || 'Autoría pendiente de documentar',
      fecha: imagen.fecha || 'Fecha pendiente de documentar',
      iniciales: imagen.iniciales || initials(imagen.nombre),
      fichaDisponible: remoteSlugs.has(imagen.slug),
    }))
  }

  if (isManaged('pasos')) {
    const remoteSlugs = new Set((remote.pasos || []).map((item) => item.slug))
    next.pasos = authoritativeBySlug(base.pasos || [], remote.pasos || []).map((paso) => {
      const currentBands = (remote.acompanamientoActual || [])
        .filter((item) => item.pasoId === paso.id)
        .map((item) => item.banda)
        .join(' · ')
      return {
        ...paso,
        acompanamientoActual: isManaged('acompanamiento')
          ? currentBands
          : currentBands || paso.acompanamientoActual || '',
        fichaDisponible: remoteSlugs.has(paso.slug),
        imagenes: paso.imagenes || [],
      }
    })
  } else if (isManaged('acompanamiento')) {
    next.pasos = (next.pasos || []).map((paso) => ({
      ...paso,
      acompanamientoActual: (remote.acompanamientoActual || [])
        .filter((item) => item.pasoId === paso.id)
        .map((item) => item.banda)
        .join(' · '),
    }))
  }

  if (isManaged('acontecimientos')) {
    const remoteEvents = remote.acontecimientos || []
    const localCouncilEvents = base.participacionesConsejo || []
    const remoteCouncilEvents = remoteEvents.filter((event) => normalized(event.categoria).includes('via crucis'))
    next.cronologia = remoteEvents.map((event) => ({
      id: event.id,
      fecha: yearFrom(event.ano) || event.ano,
      titulo: event.titulo,
      texto: event.resumen,
      estado: event.categoria,
    }))
    next.participacionesConsejo = remoteCouncilEvents.map((event) => ({
      ...(localCouncilEvents.find((localEvent) => localEvent.ano === event.ano) || {}),
      ...event,
    }))
  }

  if (isManaged('salidas')) next.salidas = remote.salidas || []
  if (isManaged('cultos')) next.cultos = remote.cultos || []

  if (isManaged('patrimonio')) {
    next.cartelesFiestas = remote.cartelesFiestas || []
    next.patrimonio = remote.patrimonio || []
  }

  if (isManaged('estrenos')) next.estrenos = remote.estrenos || []
  if (isManaged('acompanamiento')) next.acompanamientoActual = remote.acompanamientoActual || []
  if (isManaged('jornada')) next.datosJornada = remote.datosJornada || null
  if (isManaged('fuentes')) next.fuentesFicha = mappedSources(remote.sources || [])

  next.datosDesdeSupabase = true
  next.seccionesGestionadasDesdePanel = [...managed]
  return next
}
