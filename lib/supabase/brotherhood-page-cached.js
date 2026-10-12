import 'server-only'

import { unstable_cache } from 'next/cache'
import { getBrotherhoodMusicalHeritage } from '@/lib/supabase/brotherhood-musical-heritage'
import { getCrewEventDirectory } from '@/lib/supabase/crew-events'
import { getMusicalRepertoires } from '@/lib/supabase/musical-repertoires'
import { getPublishedBrotherhoodCrestPath } from '@/lib/supabase/brotherhood-public-authority'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'
import { getHistoricalMusicByBrotherhoodSlug } from '@/lib/supabase/historical-music'

// Cargas secundarias de la ficha de Hermandad guardadas en la caché de datos, con la misma
// frescura y etiqueta que los datos principales (getHermandadPageBySlug). La caché de datos
// sobrevive a los despliegues; así, cuando un despliegue vacía la caché de páginas, la ficha
// se vuelve a generar sin repetir unas veinte consultas encadenadas a Supabase.
//
// Dentro de la caché las cargas se ejecutan con throwOnError: un fallo puntual de Supabase no
// se guarda durante 15 minutos como «sin datos». Fuera, se recurre a la carga original sin
// caché, que conserva su comportamiento tolerante.

const CACHE_OPTIONS = { revalidate: 900, tags: ['public-brotherhood-detail'] }
const KEY = 'hilo-cofrade-brotherhood-page-extra-v1'

const cachedCoverMediaEntries = unstable_cache(
  async (entityIds, entityTypesById) => [
    ...(await getPublishedEntityCoverMediaMap(entityIds, { entityTypesById, throwOnError: true })).entries(),
  ],
  [KEY, 'cover-media'],
  CACHE_OPTIONS
)

const cachedMusicalHeritage = unstable_cache(
  (brotherhoodId, imageIds, currentAccompaniments) => (
    getBrotherhoodMusicalHeritage(brotherhoodId, { imageIds, currentAccompaniments })
  ),
  [KEY, 'musical-heritage'],
  CACHE_OPTIONS
)

const cachedCrestPath = unstable_cache(
  (brotherhoodId) => getPublishedBrotherhoodCrestPath(brotherhoodId, { throwOnError: true }),
  [KEY, 'crest'],
  CACHE_OPTIONS
)

const cachedRepertoires = unstable_cache(
  (brotherhoodId) => getMusicalRepertoires({ brotherhoodEntityId: brotherhoodId, throwOnError: true }),
  [KEY, 'repertoires'],
  CACHE_OPTIONS
)

const cachedCrewEvents = unstable_cache(
  (brotherhoodId) => (brotherhoodId ? getCrewEventDirectory({ brotherhoodId, throwOnError: true }) : []),
  [KEY, 'crew-events'],
  CACHE_OPTIONS
)

const cachedHistoricalMusic = unstable_cache(
  (slug) => getHistoricalMusicByBrotherhoodSlug(slug),
  [KEY, 'historical-music'],
  CACHE_OPTIONS
)

function warn(label, error) {
  console.error(`[Hilo Cofrade] ${label}; se usa la carga sin caché`, {
    error: error instanceof Error ? error.message : String(error),
  })
}

export async function getCachedBrotherhoodCoverMedia(entityIds = [], entityTypesById = {}) {
  try {
    return new Map(await cachedCoverMediaEntries(entityIds, entityTypesById))
  } catch (error) {
    warn('Caché de fotografías de portada no disponible', error)
    return getPublishedEntityCoverMediaMap(entityIds, { entityTypesById })
  }
}

export async function getCachedBrotherhoodMusicalHeritage(brotherhoodId, { imageIds = [], currentAccompaniments = [] } = {}) {
  try {
    return await cachedMusicalHeritage(brotherhoodId, imageIds, currentAccompaniments)
  } catch (error) {
    warn('Caché del patrimonio musical no disponible', error)
    return getBrotherhoodMusicalHeritage(brotherhoodId, { imageIds, currentAccompaniments })
  }
}

export async function getCachedBrotherhoodCrestPath(brotherhoodId) {
  try {
    return await cachedCrestPath(brotherhoodId)
  } catch (error) {
    warn('Caché del escudo no disponible', error)
    return getPublishedBrotherhoodCrestPath(brotherhoodId)
  }
}

export async function getCachedBrotherhoodRepertoires(brotherhoodId) {
  try {
    return await cachedRepertoires(brotherhoodId)
  } catch (error) {
    warn('Caché de crucetas no disponible', error)
    return getMusicalRepertoires({ brotherhoodEntityId: brotherhoodId })
  }
}

export async function getCachedBrotherhoodCrewEvents(brotherhoodId) {
  try {
    return await cachedCrewEvents(brotherhoodId)
  } catch (error) {
    warn('Caché de igualás y ensayos no disponible', error)
    return brotherhoodId ? getCrewEventDirectory({ brotherhoodId }) : []
  }
}

// El histórico del layout ya trataba sus errores devolviendo []; se mantiene ese contrato.
export async function getCachedHistoricalMusicByBrotherhoodSlug(slug) {
  try {
    return await cachedHistoricalMusic(slug)
  } catch (error) {
    warn('Caché del histórico musical no disponible', error)
    return getHistoricalMusicByBrotherhoodSlug(slug)
  }
}
