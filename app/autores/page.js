import Link from 'next/link'
import { connection } from 'next/server'
import JsonLd from '@/components/JsonLd'
import { getPublicAgentDirectory } from '@/lib/supabase/public-agents'
import { collectionPageJsonLd, socialMetadata } from '@/lib/seo'
import styles from '../marchas/marchas.module.css'

export const revalidate = 900

const PAGE_SIZE = 100
const title = 'Autores y talleres cofrades'
const description = 'Autores, compositores, imagineros, restauradores y talleres documentados en Hilo Cofrade, relacionados con sus obras y patrimonio.'

function pageNumber(value) {
  const parsed = Number.parseInt(String(value || '1'), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function pageHref(page) {
  return page <= 1 ? '/autores' : `/autores?pagina=${page}`
}

export async function generateMetadata({ searchParams } = {}) {
  const params = await searchParams
  const page = pageNumber(params?.pagina)
  return {
    title,
    description,
    ...socialMetadata({ title, description, path: '/autores' }),
    ...(page > 1 ? { robots: { index: false, follow: true } } : {}),
  }
}

function groupLabel(agent) {
  if (agent.kind === 'workshop') return 'Talleres'
  if (agent.kind === 'company') return 'Empresas'
  if (agent.kind === 'institution') return 'Instituciones'
  return 'Personas'
}

export default async function AuthorsDirectoryPage({ searchParams } = {}) {
  // El build no debe depender de la disponibilidad de Supabase.
  await connection()
  const params = await searchParams
  const agents = await getPublicAgentDirectory()
  const totalPages = Math.max(1, Math.ceil(agents.length / PAGE_SIZE))
  const page = Math.min(pageNumber(params?.pagina), totalPages)
  const pageItems = agents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const groups = new Map()

  for (const agent of pageItems) {
    const label = groupLabel(agent)
    const current = groups.get(label) || []
    current.push(agent)
    groups.set(label, current)
  }

  return (
    <div className={styles.page}>
      <JsonLd data={collectionPageJsonLd({
        path: '/autores',
        name: 'Autores y talleres cofrades',
        description: 'Autores, compositores, imagineros, restauradores y talleres documentados en Hilo Cofrade.',
        items: pageItems.map((agent) => ({ name: agent.name, path: `/autores/${agent.slug}` })),
      })} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label="Migas de pan">
            <Link href="/">Inicio</Link><span>/</span><strong>Autores</strong>
          </nav>
          <div className={styles.heroCopy}>
            <span>Grafo de conocimiento</span>
            <h1>Autores y talleres</h1>
            <p>Personas, talleres e instituciones relacionados con imágenes, pasos, marchas e intervenciones patrimoniales documentadas en Hilo Cofrade.</p>
          </div>
          <dl className={styles.metrics}>
            <div><dt>Perfiles indexables</dt><dd>{agents.length}</dd></div>
            <div><dt>Personas</dt><dd>{agents.filter((agent) => agent.kind === 'person').length}</dd></div>
            <div><dt>Talleres y entidades</dt><dd>{agents.filter((agent) => agent.kind !== 'person').length}</dd></div>
          </dl>
        </div>
      </header>

      <section className={`shell ${styles.directory}`} aria-labelledby="directorio-autores">
        <header className={styles.directoryHeading}>
          <div><span>Directorio relacional</span><h2 id="directorio-autores">Perfiles documentados</h2></div>
          <p>Solo se muestran perfiles que ya cuentan con obra relacionada, Fuentes o suficiente masa documental para sostener una ficha pública útil. Página {page} de {totalPages}.</p>
        </header>

        <div className={styles.groups}>
          {[...groups.entries()].map(([label, items]) => (
            <section className={styles.group} key={label}>
              <header><h3>{label}</h3><span>{items.length}</span></header>
              <div className={styles.list}>
                {items.map((agent) => (
                  <Link className={styles.card} href={`/autores/${agent.slug}`} key={agent.id}>
                    <span className={styles.cardCopy}>
                      <strong>{agent.name}</strong>
                      <small>{agent.description || agent.summary || 'Perfil relacional documentado en Hilo Cofrade'}</small>
                    </span>
                    <span className={styles.cardMeta}>
                      <time>{agent.relationCount}</time>
                      <em>{agent.relationCount === 1 ? 'relación' : 'relaciones'}</em>
                    </span>
                    <b aria-hidden="true">→</b>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
        {totalPages > 1 ? (
          <nav className={styles.pagination} aria-label="Páginas del directorio de Autores">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <Link
                href={pageHref(number)}
                key={number}
                aria-current={number === page ? 'page' : undefined}
              >
                {number}
              </Link>
            ))}
          </nav>
        ) : null}
      </section>
    </div>
  )
}
