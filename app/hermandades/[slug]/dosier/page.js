import { cache } from 'react'
import { notFound } from 'next/navigation'
import BrotherhoodDossier from '@/components/BrotherhoodDossier'
import SourcesBlock from '@/components/SourcesBlock'
import {
  dossierChronology,
  dossierHeritageGroups,
  dossierKeyFacts,
  usesBrotherhoodDossier,
} from '@/lib/brotherhood-dossier'
import { featuredBrotherhoodOuting, outingCardTitle } from '@/lib/brotherhood-featured-outing'
import { historyParagraphs } from '@/lib/brotherhood-thread'
import { madridDateKey } from '@/lib/relative-day'
import { getHermandadPageBySlug } from '@/lib/supabase/brotherhood-page'
import {
  getCachedBrotherhoodCoverMedia,
  getCachedBrotherhoodCrestPath,
  getCachedBrotherhoodMusicalHeritage,
} from '@/lib/supabase/brotherhood-page-cached'
import { getGloryDetailByOutingId } from '@/lib/supabase/glory-directory'
import { publicText } from '@/lib/supabase/public-entity-page'
import { pageTitle } from '@/lib/seo'

// Dosier de la Hermandad (piloto: el Amparo y su Coronación Canónica). Reúne en
// una página lo que ya publica la ficha, ordenado para seguir la jornada en
// directo. No se indexa: el contenido es el de la ficha, que es la canónica.

export const revalidate = 900
const getHermandad = cache(getHermandadPageBySlug)

export function generateStaticParams() {
  return []
}

async function loadDossier(slug) {
  const h = await getHermandad(slug)
  if (!h || !usesBrotherhoodDossier(h.id)) return null
  const today = madridDateKey()
  const featured = featuredBrotherhoodOuting(h.salidas || [], today)
  const outing = featured
    ? await getGloryDetailByOutingId(featured.id).catch((error) => {
      console.error('[Hilo Cofrade] Salida omitida temporalmente en el dosier', { slug, error })
      return null
    })
    : null
  const occasion = outing?.occasion || null
  const names = [h.nombrePopular, h.nombreOficial, ...(h.imagenes || []).map((imagen) => imagen.nombre)]
  const occasionTitle = occasion ? outingCardTitle(occasion.name, { names, fallback: occasion.type || occasion.name }) : ''
  const mainImage = (h.imagenes || [])[0] || null
  return { h, today, outing, occasion, occasionTitle, mainImage }
}

const getDossier = cache(loadDossier)

function titles({ h, occasionTitle, mainImage }) {
  const short = occasionTitle || ''
  const full = short && mainImage ? `${short} de ${mainImage.nombre}` : short || h.nombrePopular
  return { short, full }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const data = await getDossier(slug)
  if (!data) return { title: 'Dosier no disponible', robots: { index: false, follow: false } }
  const { full } = titles(data)
  const description = `Dosier de ${data.h.nombrePopular}: historia, Titular, patrimonio, paso, música y horarios de la jornada en una sola página.`
  return {
    title: `Dosier · ${full}`,
    description,
    alternates: { canonical: `/hermandades/${data.h.slug}/dosier` },
    // Mismo contenido que la ficha: se consulta, no compite con ella en buscadores.
    robots: { index: false, follow: true },
    openGraph: { type: 'article', title: pageTitle(`Dosier · ${full}`), description, url: `/hermandades/${data.h.slug}/dosier` },
  }
}

export default async function BrotherhoodDossierPage({ params }) {
  const { slug } = await params
  const data = await getDossier(slug)
  if (!data) notFound()
  const { h, today, outing, occasion } = data
  const images = h.imagenes || []
  const coverTypes = new Map(images.map((imagen) => [imagen.id, 'image']))
  const [imageMedia, crestPath, musicalHeritage] = await Promise.all([
    images.length ? getCachedBrotherhoodCoverMedia([...coverTypes.keys()], Object.fromEntries(coverTypes)) : new Map(),
    getCachedBrotherhoodCrestPath(h.id),
    getCachedBrotherhoodMusicalHeritage(h.id, {
      imageIds: images.map((imagen) => imagen.id),
      currentAccompaniments: h.acompanamientoActual,
    }),
  ])

  const patrimonio = h.patrimonio || []
  const patrimonioById = new Map(patrimonio.map((pieza) => [pieza.id, pieza]))
  // Las piezas de la jornada, con todos sus datos de la ficha (si están en ella).
  const occasionPieces = (occasion?.pieces || []).map((piece) => patrimonioById.get(piece.id) || {
    id: piece.id,
    nombre: piece.name,
    tipo: piece.type,
    fecha: piece.date,
    descripcion: piece.description,
    materiales: piece.materials,
    imagen: piece.image ? { src: piece.image.src, alt: piece.image.alt, autor: piece.image.credit } : null,
    agentes: (piece.credits || []).flatMap((credit) => credit.names.map((nombre) => ({ nombre, disciplina: credit.discipline }))),
  })
  const heritageGroups = dossierHeritageGroups(patrimonio, {
    excludeIds: [...occasionPieces.map((piece) => piece.id), ...musicalHeritage.map((work) => work.id)],
  })
  const steps = h.pasos || []
  const history = historyParagraphs(publicText(h.historia), { leadLength: 600 })
  const keyFacts = dossierKeyFacts({ brotherhood: h, image: data.mainImage, step: steps[0] || null, outing, occasion })
  const currentMusic = (h.acompanamientoActual || []).filter((item) => publicText(item.banda))
  const historicalMusic = (h.acompanamientos || []).filter((item) => publicText(item.banda))

  return <div className="brotherhood-page" style={{ '--brotherhood-primary': h.colores?.primario || '#153B69' }}>
    <BrotherhoodDossier
      brotherhood={h}
      title={titles(data)}
      eyebrow={occasion ? `Dosier · ${h.nombrePopular}` : 'Dosier'}
      crestPath={crestPath || h.escudoPath || ''}
      keyFacts={keyFacts}
      outing={outing}
      occasion={occasion}
      occasionPieces={occasionPieces}
      images={images}
      imageMedia={imageMedia}
      heritageGroups={heritageGroups}
      steps={steps}
      history={history}
      chronology={dossierChronology(h.cronologia || [], today)}
      currentMusic={currentMusic}
      historicalMusic={historicalMusic}
      musicalHeritage={musicalHeritage}
      cults={h.cultos || []}
      fichaHref={`/hermandades/${h.slug}`}
    >
      <SourcesBlock sources={h.fuentesFicha} />
    </BrotherhoodDossier>
  </div>
}
