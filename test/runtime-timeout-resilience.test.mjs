import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { isMissingPublicSupabaseConfig } from '../lib/supabase/public-error.js'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('solo la ausencia de configuración pública activa el fallback de build', () => {
  assert.equal(isMissingPublicSupabaseConfig(new Error('Falta la configuración pública de Supabase')), true)
  assert.equal(isMissingPublicSupabaseConfig(new Error('Faltan las variables públicas de Supabase para el cliente de lectura.')), true)
  assert.equal(isMissingPublicSupabaseConfig(new Error('canceling statement due to statement timeout')), false)
})

test('Hoy 2.0 acota la vista relacional y conserva un fallback completo', async () => {
  const source = await read('lib/supabase/home-v2.js')

  assert.match(source, /DISCOVERY_FAST_PATH_PRIORITY = 92/)
  assert.match(source, /\.in\('activity_kind', \[\.\.\.DISCOVERY_KINDS\]\)/)
  assert.match(source, /\.gte\('priority', DISCOVERY_FAST_PATH_PRIORITY\)/)
  assert.match(source, /No se pudieron ampliar los hilos candidatos del día/)
})

test('el descubrimiento de portada evita entity_new sin bloquear relaciones recientes', async () => {
  const source = await read('lib/supabase/home.js')

  assert.match(source, /\.in\('activity_kind', DISCOVERY_KINDS\)/)
  assert.match(source, /\.order\('latest_at', \{ ascending: false \}\)/)
  assert.match(source, /\.order\('priority', \{ ascending: false \}\)/)
  assert.doesNotMatch(source, /\.gte\('priority', DISCOVERY_FAST_PATH_PRIORITY\)/)
  assert.doesNotMatch(source, /No se pudo ampliar la actividad de conocimiento de la Home/)
})

test('un fallo de fuentes no convierte una hermandad publicada en 404', async () => {
  const source = await read('lib/supabase/brotherhoods.js')

  assert.match(source, /Fuentes de la hermandad omitidas temporalmente/)
  assert.match(source, /buildSourceLinkOrFilters/)
  assert.match(source, /for \(const filter of sourceLinkFilters\)/)
  assert.match(source, /\.or\(filter\)/)
  assert.match(source, /if \(local \|\| isMissingPublicSupabaseConfig\(error\)\) return local\s+throw error/)
})

test('una Gloria omite fuentes fallidas y reserva null para ausencia real', async () => {
  const source = await read('lib/supabase/glory-directory.js')

  assert.match(source, /getGloryDirectory\(\{ throwOnError: true \}\)/)
  assert.match(source, /Fuentes de la procesión de Gloria omitidas temporalmente/)
  assert.match(source, /if \(throwOnError\) throw error/)
  assert.match(source, /No se pudo cargar la ficha[\s\S]*throw error/)
})

test('las lecturas públicas reintentan una vez sin superar el presupuesto de Vercel', async () => {
  const publicClient = await read('lib/supabase/public.js')
  const publicServer = await read('lib/supabase/public-server.js')
  const timedFetch = await read('lib/supabase/public-fetch.js')
  const timedFetchCore = await read('lib/supabase/public-fetch-core.js')

  assert.match(publicClient, /fetch:\s*fetchWithPublicQueryTimeout/)
  assert.match(publicServer, /fetch:\s*fetchWithPublicQueryTimeout/)
  assert.match(timedFetch, /createPublicQueryFetch/)
  assert.match(timedFetchCore, /DEFAULT_PUBLIC_QUERY_TIMEOUT_MS = 15_000/)
  assert.match(timedFetchCore, /SUPABASE_PUBLIC_QUERY_TOTAL_TIMEOUT_MS/)
  assert.match(timedFetchCore, /SUPABASE_PUBLIC_QUERY_MAX_CONCURRENCY/)
  assert.match(timedFetchCore, /RETRYABLE_METHODS = new Set\(\['GET', 'HEAD'\]\)/)
  assert.match(timedFetchCore, /attempts < \(canRetry \? 2 : 1\)/)
})

test('el prerender reduce la presión sobre Supabase en vez de multiplicar los retries', async () => {
  const config = await read('next.config.mjs')

  assert.match(config, /staticGenerationRetryCount:\s*1/)
  assert.match(config, /staticGenerationMaxConcurrency:\s*1/)
  assert.match(config, /staticGenerationMinPagesPerWorker:\s*50/)
})

test('Paso e Imagen resuelven solo la identidad ligera de su Hermandad', async () => {
  const source = await read('lib/supabase/public-entity-pages.js')

  assert.doesNotMatch(source, /getHermandadPageBySlug/)
  assert.match(source, /official_name, popular_name, municipality_id, crest_path/)
  assert.match(source, /No se pudo cargar el Paso público[\s\S]*throw error/)
  assert.match(source, /No se pudo cargar la Imagen pública[\s\S]*throw error/)
})

test('la ficha de Paso conserva en caché sus módulos relacionales secundarios', async () => {
  const crew = await read('components/StepCrewFacts.js')
  const presence = await read('lib/supabase/relational-presence.js')

  assert.match(crew, /unstable_cache/)
  assert.match(crew, /revalidate:\s*900/)
  assert.match(presence, /unstable_cache/)
  assert.match(presence, /revalidate:\s*900/)
})

test('Bandas y Marchas no convierten errores temporales en fichas inexistentes', async () => {
  const bands = await read('lib/supabase/bands-core.js')
  const marches = await read('lib/supabase/public-marches.js')
  const bandPage = await read('app/bandas/[slug]/page.js')

  assert.match(bands, /No se pudo cargar la ficha de banda[\s\S]*throw error/)
  assert.match(marches, /No se pudo cargar la ficha pública de la Marcha[\s\S]*throw error/)
  assert.match(bandPage, /cache\(getBandBySlugUncached\)/)
})

test('los directorios patrimoniales comparten caché y pueden propagar fallos a la ruta', async () => {
  const source = await read('lib/supabase/directories.js')
  const publicErrors = await read('lib/supabase/public-error.js')
  const imageRoute = await read('app/imagenes/localidad/[localidad]/page.js')
  const stepRoute = await read('app/pasos/localidad/[localidad]/page.js')

  assert.match(source, /unstable_cache/)
  assert.match(source, /public-images-directory-v2/)
  assert.match(source, /public-steps-directory-v2/)
  assert.match(source, /throwOnError/)
  assert.match(source, /if \(isMissingPublicSupabaseConfig\(error\)\) return \[\]/)
  assert.match(publicErrors, /export function isMissingPublicSupabaseConfig/)
  assert.match(imageRoute, /throwOnError:\s*true/)
  assert.match(stepRoute, /throwOnError:\s*true/)
})

test('la Marcha del día queda aislada del resto de Hoy 2.0', async () => {
  const source = await read('lib/supabase/home-v2.js')

  assert.match(source, /let publicMarch = null[\s\S]*No se pudo cargar la Marcha del día/)
  assert.match(source, /return \{[\s\S]*ephemeris:[\s\S]*march: publicMarch/)
})
