import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityLastUpdated from '@/components/EntityLastUpdated'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import SourcesBlock from '@/components/SourcesBlock'
import {
  agentRelationBreakdown,
  authorCategoryFor,
  authorSeoTitle,
  authorKindLabel,
  authorProfileLabel,
  authorWorkOrder,
} from '@/lib/authors-presentation'
import { getPublicAgentBySlug } from '@/lib/supabase/public-agents'
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageTitle,
  seoDescription,
  socialMetadata,
} from '@/lib/seo'
import styles from '../autores.module.css'

export const revalidate = 900

function schemaType(agent) {
  return agent.kind === 'person' ? 'Person' : 'Organization'
}

function schemaId(agent, canonicalPath) {
  return `${absoluteUrl(canonicalPath)}#${agent.kind === 'person' ? 'person' : 'organization'}`
}

function profileMetrics(agent, categoryKey) {
  const relations = agentRelationBreakdown(agent)
  const sources = agent.sources.length

  if (categoryKey === 'music') {
    return [
      { label: 'Marchas documentadas', value: relations.marches },
      { label: 'Relaciones totales', value: agent.relationCount },
      { label: 'Fuentes directas', value: sources },
    ]
  }

  if (categoryKey === 'imagery') {
    return [
      { label: 'Imágenes documentadas', value: relations.images },
      { label: 'Intervenciones', value: relations.heritage },
      { label: 'Fuentes directas', value: sources },
    ]
  }

  if (categoryKey === 'restoration') {
    return [
      { label: 'Intervenciones', value: relations.heritage },
      { label: 'Obras relacionadas', value: relations.images + relations.steps },
      { label: 'Fuentes directas', value: sources },
    ]
  }

  if (categoryKey === 'dressing') {
    return [
      { label: 'Imágenes vestidas', value: relations.dressings },
      { label: 'Relaciones totales', value: agent.relationCount },
      { label: 'Fuentes directas', value: sources },
    ]
  }

  if (['textile', 'goldsmith', 'carving'].includes(categoryKey)) {
    return [
      { label: 'Trabajos documentados', value: relations.heritage + relations.steps },
      { label: 'Relaciones totales', value: agent.relationCount },
      { label: 'Fuentes directas', value: sources },
    ]
  }

  if (categoryKey === 'visual') {
    return [
      { label: 'Obras documentadas', value: relations.images + relations.heritage },
      { label: 'Relaciones totales', value: agent.relationCount },
      { label: 'Fuentes directas', value: sources },
    ]
  }

  if (categoryKey === 'patrimony') {
    return [
      { label: 'Intervenciones', value: relations.heritage },
      { label: 'Fases de paso', value: relations.steps },
      { label: 'Fuentes directas', value: sources },
    ]
  }

  return [
    { label: 'Relaciones documentadas', value: agent.relationCount },
    { label: 'Disciplinas', value: agent.disciplines.length },
    { label: 'Fuentes directas', value: sources },
  ]
}

function WorkGroup({ categoryKey, title, eyebrow, items }) {
  if (!items.length) return null

  return (
    <section className={styles.group} data-category={categoryKey}>
      <header className={styles.groupHeader}>
        <span className={styles.groupHeaderMark}>{String(items.length).padStart(2, '0')}</span>
        <span className={styles.groupHeaderCopy}>
          <h3>{title}</h3>
          <p>{eyebrow}</p>
        </span>
        <span className={styles.groupHeaderCount}>{items.length}</span>
      </header>

      <div className={styles.list}>
        {items.map((item) => {
          const body = (
            <>
              <span className={styles.cardCopy}>
                <span className={styles.cardKicker}>{eyebrow}</span>
                <strong>{item.name}</strong>
                <small>{[item.role || item.type, item.phase, item.certainty].filter(Boolean).join(' · ') || eyebrow}</small>
              </span>
              <span className={styles.cardMeta}>
                {item.date || item.year ? <time>{item.date || item.year}</time> : null}
                <em>{item.href ? 'Abrir ficha' : 'Relación documental'}</em>
              </span>
              <span className={styles.cardArrow} aria-hidden="true">→</span>
            </>
          )

          return item.href
            ? <Link className={styles.card} href={item.href} key={item.id}>{body}</Link>
            : <article className={styles.card} key={item.id}>{body}</article>
        })}
      </div>
    </section>
  )
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

  const title = authorSeoTitle(agent)
  const description = seoDescription(
    agent.description,
    `${agent.name} en Hilo Cofrade: obra, autorías, intervenciones y Fuentes documentales relacionadas.`
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

export default async function AuthorPage({ params }) {
  const { slug } = await params
  const agent = await getPublicAgentBySlug(slug)
  if (!agent) notFound()

  const category = authorCategoryFor(agent)
  const metrics = profileMetrics(agent, category.key)
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

  const groups = {
    marches: {
      title: category.key === 'music' ? 'Marchas y composiciones' : 'Marchas',
      eyebrow: 'Obra musical',
      items: agent.marches,
    },
    images: {
      title: category.key === 'imagery' ? 'Imágenes y esculturas' : 'Imágenes',
      eyebrow: category.key === 'imagery' ? 'Autoría escultórica' : 'Autoría',
      items: agent.images,
    },
    dressings: {
      title: 'Imágenes vestidas',
      eyebrow: 'Vestimenta documentada',
      items: agent.dressings,
    },
    heritage: {
      title: category.key === 'restoration' ? 'Restauraciones e intervenciones' : 'Intervenciones patrimoniales',
      eyebrow: category.key === 'restoration' ? 'Conservación patrimonial' : 'Patrimonio',
      items: agent.heritage,
    },
    steps: {
      title: ['carving', 'goldsmith', 'textile'].includes(category.key) ? 'Pasos y fases de ejecución' : 'Pasos',
      eyebrow: 'Paso procesional',
      items: agent.steps,
    },
  }

  return (
    <div className={styles.page} data-category={category.key}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Autores', path: '/autores' },
        { name: agent.name, path: canonicalPath },
      ])} />
      <JsonLd data={entityJsonLd} />
      <JsonLd data={profileJsonLd} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <SiteBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Autores', href: '/autores' },
              { label: agent.name },
            ]}
            tone="dark"
            showAccent={false}
          />

          <div className={styles.heroCopy}>
            <span>{authorProfileLabel(agent)}</span>
            <h1>{agent.name}</h1>
            <p>{agent.description || agent.summary || `Perfil de ${category.label.toLowerCase()} construido a partir de obras y relaciones documentadas en Hilo Cofrade.`}</p>
          </div>

          <dl className={styles.metrics}>
            {metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <EntityLastUpdated value={agent.updatedAt} variant="bar" />

      <section className={`shell ${styles.identityWrap}`} aria-label="Identidad del autor">
        <div className={styles.identityCard}>
          <div className={styles.identityLead}>
            <span>{category.code}</span>
            <div>
              <small>Ámbito editorial</small>
              <strong>{category.label}</strong>
            </div>
          </div>

          <dl className={styles.identityFacts}>
            <div>
              <dt>Disciplina principal</dt>
              <dd>{agent.primaryDiscipline || authorProfileLabel(agent)}</dd>
            </div>
            <div>
              <dt>Tipo de perfil</dt>
              <dd>{authorKindLabel(agent)}</dd>
            </div>
            <div>
              <dt>Origen / cronología</dt>
              <dd>
                {[agent.municipality, [agent.birthText, agent.deathText].filter(Boolean).join(' — ')]
                  .filter(Boolean)
                  .join(' · ') || 'Dato pendiente de documentación'}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={`shell ${styles.directory} ${styles.profileDirectory}`} aria-labelledby="perfil-autor">
        <header className={styles.directoryHeading}>
          <div>
            <span>{category.kicker}</span>
            <h2 id="perfil-autor">{category.detailTitle}</h2>
          </div>
          <p>{category.detailCopy}</p>
        </header>

        <div className={styles.groups}>
          {authorWorkOrder(category.key).map((key) => (
            <WorkGroup
              categoryKey={category.key}
              key={key}
              {...groups[key]}
            />
          ))}

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
