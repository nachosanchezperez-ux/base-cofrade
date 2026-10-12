// Lectura de la instantánea para el control de integridad. Solo SELECT.
//
// Recibe un cliente de supabase-js ya creado (el script decide la clave) y lee
// únicamente las columnas que usan las comprobaciones, en páginas de 1.000 filas
// (límite de PostgREST). Con el tamaño actual (≈4.000 entidades) son unas 35
// peticiones en total: 14 tablas, más una página vacía final por tabla.

export const INTEGRITY_TABLES = {
  entities: 'id, entity_type, name, slug, status',
  brotherhood_images: 'id, brotherhood_entity_id, image_entity_id, relation_type, status, date_to',
  brotherhood_steps: 'id, brotherhood_entity_id, step_entity_id, relation_type, status, date_to',
  image_steps: 'id, image_entity_id, step_entity_id, relation_type, status, date_to',
  march_authors: 'id, march_entity_id, agent_entity_id, status',
  entity_media: 'id, entity_id, media_asset_id, relation_type, is_cover',
  media_assets: 'id, media_type, rights_status, storage_path',
  music_accompaniment_periods: 'id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_from, year_to, date_from, date_to, date_to_text, is_current, status, public_band_name',
  outings: 'id, brotherhood_entity_id, outing_type, character, title, slug, outing_date, return_date, departure_time, return_time, year, status, event_status, organizer_name, municipality_id, origin_place_id, origin_text',
  municipalities: 'id, province',
  outing_entities: 'id, outing_id, entity_id, role',
  outing_music_positions: 'id, outing_id, step_entity_id, position_code, position_label, notes, status',
  outing_music_assignments: 'id, music_position_id, band_entity_id, band_name_text, segment_start_label, segment_end_label, participation_mode, status',
  cults: 'id, title, brotherhood_entity_id, image_entity_id, status',
}

const PAGE_SIZE = 1000
const MAX_PAGES = 200

export async function loadTableRows(client, table, columns, { pageSize = PAGE_SIZE } = {}) {
  const rows = []
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const from = rows.length
    const { data, error } = await client
      .from(table)
      .select(columns)
      .order('id', { ascending: true })
      .range(from, from + pageSize - 1)
    if (error) throw new Error(`No se pudo leer ${table}: ${error.message}`)
    // Se pagina hasta recibir una página vacía: si el servidor limita las filas por
    // debajo de pageSize, una página corta no significa que la tabla haya terminado.
    if (!data || data.length === 0) return rows
    rows.push(...data)
  }
  throw new Error(`${table}: se superó el máximo de ${MAX_PAGES} páginas; revisa la paginación.`)
}

export async function loadIntegritySnapshot(client, { mode = 'public', preservedPaths = [], tables = INTEGRITY_TABLES } = {}) {
  const entries = await Promise.all(
    Object.entries(tables).map(async ([table, columns]) => [table, await loadTableRows(client, table, columns)]),
  )
  return { mode, preservedPaths: [...preservedPaths], ...Object.fromEntries(entries) }
}
