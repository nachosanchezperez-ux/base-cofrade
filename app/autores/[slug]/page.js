import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityLastUpdated from '@/components/EntityLastUpdated'
import JsonLd from '@/components/JsonLd'
import SourcesBlock from '@/components/SourcesBlock'
import { getPublicAgentBySlug } from '@/lib/supabase/public-agents'
import {
  absoluteUrl,
  breadcrumbJsonLd,
  compactSeoTitle,
  pageTitle,
  seoDescription,
  socialMetadata,
} from '@/lib/seo'
import styles from '../../marchas/marchas.module.css'

export const revalidate = 900

function schemaType(agent) {
  return agent.kind === 'person' ? 'Person' : 'Organization'
}

function schemaId(agent, canonicalPath) {
  return `${absoluteUrl(canonicalPath)}#${agent.kind === 'person' ? 'person' : 'organization'}`
}

function profileLabel(agent) {
  if (agent.kind === 'workshop') return 'Taller'
  if (agent.kind === 'company') return 'Empresa'
  if (agent.kind === 'institution') return 'Institución'
  return agent.primaryDiscipline || 'Autor'
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const agent = await getPublicAgentBySlug(slug)

  if (!agent) {
    return {
      title: 'Autor no encontrado',
      robots: { index: false, follow: false },
    }
  }

  const title = compactSeoTitle(
    [agent.name, agent.primaryDiscipline || profileLabel(agent)].filter(Boolean).join(' · ')
  )
  const description = seoDescription(
    agent.description,
    `${agent.name} en Hilo Cofrade: obras, marchas, imágenes, patrimonio, intervenciones y Fuentes documentales relacionadas.`
  )
  const canonicalPath = `/autores/${agent.slug}`

  return {
    title,
    description,
    robots: agent.indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    ...socialMetadata({
      title,
      description,
      path: canonicalPath,
    }),
  }
}

function WorkGroup({ title, eyebrow, items, emptyText }) {
  if (!items.length) return null

  return (
    <section className={styles.group}>
      <header><h3>{title}</h3><span>{items.length}</span></header>
      <div className={styles.list}>
        {items.map((item) => {
          const body = (
            <>
              <span className={styles.cardCopy}>
                <strong>{item.name}</strong>
                <small>{[item.role || item.type, item.phase, item.certainty].filter(Boolean).join(' · ') || eyebrow}</small>
              </span>
              <span className={styles.cardMeta}>
                {item.date || item.year ? <time>{item.date || item.year}</time> : null}
                <em>{eyebrow}</em>
              </span>
              <b aria-hidden="true">→</b>
            </>
          )

          return item.href
            ? <Link className={styles.card} href={item.href} key={item.id}>{body}</Link>
            : <article className={styles.card} key={item.id}>{body}</article>
        })}
      </div>
      {!items.length && emptyText ? <p>{emptyText}</p> : null}
    </section>
  )
}

export default async function AuthorPage({ params }) {
  const { slug } = await params
  const agent = await getPublicAgentBySlug(slug)
  if (!agent) notFound()

  const canonicalPath = `/autores/${agent.slug}`
  const entityId = schemaId(agent, canonicalPath)
  const sameAs = [agent.websiteUrl, agent.instagramUrl].filter(Boolean)
  const entityJsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType(agent),
    '@id': entityId,
    url: absoluteUrl(canonicalPath),
    name: agent.name,
    ...(agent.alternateNames.length ? { alternateName: agent.alternateNames } : {}),
    ...(agent.description ? { description: agent.description } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(agent.kind === 'person' && agent.birthDate ? { birthDate: agent.birthDate } : {}),
    ...(agent.kind === 'person' && agent.deathDate ? { deathDate: agent.deathDate } : {}),
    ...(agent.primaryDiscipline ? {
      ...(agent.kind === 'person'
        ? { jobTitle: agent.primaryDiscipline }
        : { knowsAbout: agent.primaryDiscipline }),
    } : {}),
    ...(agent.municipality ? {
      address: {
        '@type': 'PostalAddress',
        addressLocality: agent.municipality,
        ...(agent.province ? { addressRegion: agent.province } : {}),
        addressCountry: 'ES',
      },
    } : {}),
  }

  const profileJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${absoluteUrl(canonicalPath)}#profile`,
    url: absoluteUrl(canonicalPath),
    name: pageTitle(agent.name),
    inLanguage: 'es',
    isPartOf: { '@id': `${absoluteUrl('/')}#website` },
    mainEntity: { '@id': entityId },
    about: { '@id': entityId },
  }

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Autores', path: '/autores' },
        { name: agent.name, path: canonicalPath },
      ])} />
      <JsonLd data={entityJsonLd} />
      <JsonLd data={profileJsonLd} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <nav className={styles.breadcrumb} aria-label="Migas de pan">
            <Link href="/">Inicio</Link><span>/</span><Link href="/autores">Autores</Link><span>/</span><strong>{agent.name}</strong>
          </nav>

          <div className={styles.heroCopy}>
            <span>{profileLabel(agent)}</span>
            <h1>{agent.name}</h1>
            <p>{agent.description || agent.summary || 'Perfil relacional construido a partir de obras y relaciones documentadas en Hilo Cofrade.'}</p>
          </div>

          <dl className={styles.metrics}>
            <div><dt>Relaciones documentadas</dt><dd>{agent.relationCount}</dd></div>
            <div><dt>Disciplinas</dt><dd>{agent.disciplines.length}</dd></div>
            <div><dt>Fuentes directas</dt><dd>{agent.sources.length}</dd></div>
          </dl>
        </div>
      </header>

      <EntityLastUpdated value={agent.updatedAt} variant="bar" />

      <section className={`shell ${styles.directory}`} aria-labelledby="perfil-autor">
        <header className={styles.directoryHeading}>
          <div><span>Perfil documentado</span><h2 id="perfil-autor">Tira del hilo por su obra</h2></div>
          <p>
            {[agent.primaryDiscipline, agent.municipality, agent.birthText, agent.deathText]
              .filter(Boolean)
              .join(' · ') || 'Relaciones documentadas con el patrimonio y la música procesional.'}
          </p>
        </header>

        <div className={styles.groups}>
          <WorkGroup
            title="Marchas"
            eyebrow="Obra musical"
            items={agent.marches}
          />
          <WorkGroup
            title="Imágenes"
            eyebrow="Autoría"
            items={agent.images}
          />
          <WorkGroup
            title="Intervenciones patrimoniales"
            eyebrow="Patrimonio"
            items={agent.heritage}
          />
          <WorkGroup
            title="Pasos"
            eyebrow="Paso procesional"
            items={agent.steps}
          />

          {!agent.relationCount ? (
            <div className={styles.empty}>
              <strong>Perfil todavía sin relaciones públicas suficientes.</strong>
              <p>La ficha se mantiene fuera de indexación hasta ampliar su documentación.</p>
            </div>
          ) : null}
        </div>
      </section>

      <SourcesBlock sources={agent.sources} />
    </div>
  )
}
