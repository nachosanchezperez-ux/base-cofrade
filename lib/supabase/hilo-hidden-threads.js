import 'server-only'

import { unstable_cache } from 'next/cache'
import { getHiddenChallenge } from '@/lib/hilo-hidden-game'
import { hiddenThreadSectionsFor, pickHiddenThread } from '@/lib/hilo-hidden-threads'
import { getPublicBandsDirectory } from '@/lib/supabase/bands-directory-public'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'
import { getImagesDirectory, getStepsDirectory } from '@/lib/supabase/directories'

function joinContext(values = []) {
  return values.map((value) => String(value || '').trim()).filter(Boolean).join(' · ')
}

// Cada sección se reduce a lo que necesita la tarjeta: enlace, nombre, contexto y si la
// ficha tiene imagen o escudo. Solo se cargan las secciones de las palabras del día.
const SECTION_LOADERS = {
  pasos: async () => (await getStepsDirectory()).map((item) => ({
    href: item.href,
    name: item.name,
    type: item.type,
    context: joinContext([item.brotherhoodName, item.municipality]),
    hasMedia: Boolean(item.coverPath),
  })),
  imagenes: async () => (await getImagesDirectory()).map((item) => ({
    href: item.href,
    name: item.name,
    type: item.type,
    context: joinContext([item.brotherhoodName, item.municipality]),
    hasMedia: Boolean(item.coverPath),
  })),
  hermandades: async () => (await getHermandadesDirectory()).map((item) => ({
    href: item.slug ? '/hermandades/' + item.slug : '',
    name: item.nombrePopular,
    tipos: item.tipos || [],
    context: joinContext([item.localidad, item.diaSalida]),
    hasMedia: Boolean(item.escudoPath),
  })),
  bandas: async () => (await getPublicBandsDirectory()).map((item) => ({
    href: item.slug ? '/bandas/' + item.slug : '',
    name: item.popularName || item.name,
    type: item.type,
    context: joinContext([item.type, item.municipality]),
    hasMedia: Boolean(item.logoPath),
  })),
}

async function loadHiddenThreads(dayKey) {
  const answers = [
    ...getHiddenChallenge(dayKey, 'daily').words,
    ...getHiddenChallenge(dayKey, 'expert').words,
  ].map((word) => word.answer)

  const sections = hiddenThreadSectionsFor(answers)
  const loaded = await Promise.all(sections.map(async (section) => {
    try {
      return [section, await SECTION_LOADERS[section]()]
    } catch {
      // Sin ficha, el juego conserva el enlace al listado general: nunca bloquea la partida.
      return [section, []]
    }
  }))
  const itemsBySection = new Map(loaded)

  const threads = {}
  for (const answer of answers) {
    const items = itemsBySection.get(hiddenThreadSectionsFor([answer])[0]) || []
    const thread = pickHiddenThread({ answer, dayKey, items })
    if (thread) threads[answer] = thread
  }
  return threads
}

// Una consulta por día y hora como máximo: la página del juego se calcula en cada visita,
// pero las fichas elegidas para ese día se reutilizan.
const getCachedHiddenThreads = unstable_cache(
  loadHiddenThreads,
  ['hilo-escondido-hilos-v1'],
  { revalidate: 3600, tags: ['hilo-escondido-hilos'] }
)

export async function getHiddenThreads(dayKey) {
  try {
    return await getCachedHiddenThreads(dayKey)
  } catch {
    return {}
  }
}
