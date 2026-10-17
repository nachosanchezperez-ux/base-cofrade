import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import ShareActions from '@/components/ShareActions'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import HiloMovementCards, { hiloKindLabel, hiloMovementPhoto } from '@/components/HiloMovementCards'
import {
  HILO_MOVEMENTS_PATH,
  HILO_TOPIC_LABELS,
  hiloDayLabel,
  hiloParagraphs,
  relatedHiloMovements,
} from '@/lib/hilo-movements'
import { getPublicHiloMovements } from '@/lib/supabase/hilo-movements'
import { absoluteUrl, breadcrumbJsonLd, sentenceSeoDescription, SITE_NAME, socialMetadata } from '@/lib/seo'
import { newsShare } from '@/lib/share'
import styles from './hilo-article.module.css'

// Página de cada noticia de El Hilo se mueve. Las noticias son contenido
// editorial con valor histórico (cambios de banda, estrenos, restauraciones),
// por eso tienen URL propia; el índice /el-hilo-se-mueve las enlaza a todas.
export const revalidate = 900

const ROLE_BY_TYPE = { brotherhood: 'Hermandad', band: 'Banda', image: 'Imagen', step: 'Paso', author: 'Autor', march: 'Marcha' }
const ROLE_BY_FAMILY = { hermandades: 'Hermandad', bandas: 'Banda', imagenes: 'Imagen', pasos: 'Paso', autores: 'Autor', marchas: 'Marcha' }

async function getMovement(slug) {
  const items = await getPublicHiloMovements()
  const item = items.find((entry) => entry.id === slug) || null
  return { item, items }
}

function articleDate(item) {
  return item.announcedOn || item.documentedOn
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { item } = await getMovement(slug)
  if (!item) return { title: 'Noticia no encontrada', robots: { index: false, follow: false } }
  const description = sentenceSeoDescription(item.summary)
  const photo = hiloMovementPhoto(item)
  return {
    title: item.title,
    description,
    ...socialMetadata({
      title: item.title,
      description,
      path: item.href,
      type: 'article',
      ...(photo ? { images: [{ url: photo.src, alt: photo.alt }] } : {}),
    }),
  }
}

export default async function HiloArticlePage({ params }) {
  const { slug } = await params
  const { item, items } = await getMovement(slug)
  if (!item) notFound()

  const url = absoluteUrl(item.href)
  const photo = hiloMovementPhoto(item)
  const paragraphs = hiloParagraphs(item.context)
  const topic = HILO_TOPIC_LABELS[item.topic] || 'Actualidad'
  const related = relatedHiloMovements(items, item, 3)
  const connections = [
    ...(item.protagonist.href ? [{ id: item.protagonist.id || item.protagonist.href, href: item.protagonist.href, label: item.protagonist.label, role: item.protagonist.kind || 'Hermandad' }] : []),
    ...item.relations.map((relation) => ({ ...relation, role: relation.role || ROLE_BY_TYPE[relation.type] || 'Relacionado' })),
  ]
  // El enlace «Descubre» a una ficha también es una relación de la noticia.
  const discoverFicha = /^\/(hermandades|bandas|imagenes|pasos|autores|marchas)\/[a-z0-9-]+/.exec(item.discover?.href || '')
  const discoverPath = discoverFicha ? discoverFicha[0] : ''
  if (discoverPath && !connections.some((connection) => connection.href.split('#')[0] === discoverPath)) {
    // «Conoce al Santísimo Cristo de la Exaltación» → «Santísimo Cristo de la Exaltación».
    const label = item.discover.label.replace(/^(?:conoce|descubre|visita|lee|consulta|ver|escucha|recorre)\s+(?:a\s+la\s+|a\s+los\s+|a\s+las\s+|al\s+|a\s+|el\s+|la\s+|los\s+|las\s+)?/iu, '').trim()
    connections.push({ id: discoverPath, href: discoverPath, label: label ? `${label.charAt(0).toLocaleUpperCase('es')}${label.slice(1)}` : item.discover.label, role: ROLE_BY_FAMILY[discoverFicha[1]] })
  }
  const mentions = connections.filter((connection) => connection.href !== item.protagonist.href)

  // NewsArticle: titular, fechas, autoría editorial y, sobre todo, de quién habla
  // (about) y qué fichas menciona (mentions), enlazadas a sus páginas.
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline: item.title,
    description: item.summary,
    articleBody: [item.summary, ...paragraphs].join('\n\n'),
    articleSection: topic,
    inLanguage: 'es',
    isAccessibleForFree: true,
    datePublished: articleDate(item),
    dateModified: item.documentedOn,
    // Sin foto, la imagen social por defecto: los resultados de noticias la piden.
    image: [photo ? absoluteUrl(photo.src) : absoluteUrl('/opengraph-image')],
    author: { '@type': 'Organization', '@id': `${absoluteUrl('/')}#organization`, name: SITE_NAME, url: absoluteUrl('/') },
    publisher: { '@id': `${absoluteUrl('/')}#organization` },
    isPartOf: { '@type': 'CollectionPage', '@id': `${absoluteUrl(HILO_MOVEMENTS_PATH)}#collection`, name: 'El Hilo se mueve' },
    about: item.protagonist.href ? {
      '@type': item.protagonist.kind === 'Banda' ? 'MusicGroup' : 'Organization',
      '@id': `${absoluteUrl(item.protagonist.href)}#organization`,
      name: item.protagonist.label,
      url: absoluteUrl(item.protagonist.href),
    } : { '@type': 'Thing', name: item.protagonist.label },
    ...(mentions.length ? {
      mentions: mentions.map((connection) => ({ '@type': 'Thing', name: connection.label, url: absoluteUrl(connection.href) })),
    } : {}),
    ...(item.municipality ? { contentLocation: { '@type': 'Place', name: item.municipality, address: { '@type': 'PostalAddress', addressLocality: item.municipality, addressRegion: 'Sevilla', addressCountry: 'ES' } } } : {}),
    citation: item.sources.map((source) => source.href),
  }

  return <article className={styles.page}>
    <JsonLd data={breadcrumbJsonLd([
      { name: 'Inicio', path: '/' },
      { name: 'El Hilo se mueve', path: HILO_MOVEMENTS_PATH },
      { name: item.title, path: item.href },
    ])} />
    <JsonLd data={articleJsonLd} />

    <div className={`shell ${styles.shell}`}>
      <SiteBreadcrumb items={[{ label: 'El Hilo se mueve', href: HILO_MOVEMENTS_PATH }, { label: topic }]} />

      <header className={styles.header}>
        <p className={styles.kicker}><span>{topic}</span><span aria-hidden="true">·</span><span>{hiloKindLabel(item.kind)}</span></p>
        <h1>{item.title}</h1>
        <p className={styles.lead}>{item.summary}</p>
        <div className={styles.byline}>
          {item.crestPath ? <Image className={styles.crest} src={item.crestPath} alt="" width={44} height={52} unoptimized={/\.svg(?:$|\?)/i.test(item.crestPath)} /> : null}
          <div>
            {item.protagonist.href
              ? <Link href={item.protagonist.href} prefetch={false} className={styles.protagonist}>{item.protagonist.label}</Link>
              : <strong className={styles.protagonist}>{item.protagonist.label}</strong>}
            <span>{[item.protagonist.kind, item.municipality].filter(Boolean).join(' · ')}</span>
          </div>
          <p className={styles.dates}>
            {item.announcedOn ? <>Anunciado el <time dateTime={item.announcedOn}>{hiloDayLabel(item.announcedOn)}</time></> : <>Documentado el <time dateTime={item.documentedOn}>{hiloDayLabel(item.documentedOn)}</time></>}
          </p>
        </div>
      </header>

      {photo ? <figure className={styles.figure}>
        <div className={styles.photoFrame}>
          <Image src={photo.src} alt={photo.alt} fill priority sizes="(max-width: 860px) 100vw, 860px" style={{ objectPosition: photo.focusPosition }} />
        </div>
        <figcaption>{photo.caption}{photo.credit ? ` · ${photo.credit}` : ''}</figcaption>
      </figure> : null}

      <div className={styles.body}>
        {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        {item.effectiveLabel ? <p className={styles.effective}><span aria-hidden="true">↳</span> {item.effectiveLabel}</p> : null}
        {item.discover ? <p><Link className={styles.discover} href={item.discover.href} prefetch={false}>{item.discover.label} <span aria-hidden="true">→</span></Link></p> : null}
        <ShareActions share={newsShare(item)} contentType="noticia" analytics={{ topic: item.topic, municipality: item.municipality }} />
      </div>

      {connections.length ? <section className={styles.connections} aria-labelledby="tira-del-hilo">
        <h2 id="tira-del-hilo">Tira del hilo</h2>
        <p>Las fichas de la enciclopedia que forman parte de esta noticia.</p>
        <ul>
          {connections.map((connection) => <li key={connection.id || connection.href}>
            <Link href={connection.href} prefetch={false}><span>{connection.role}</span><strong>{connection.label}</strong><b aria-hidden="true">→</b></Link>
          </li>)}
        </ul>
      </section> : null}

      <section className={styles.sources} aria-labelledby="fuentes-noticia">
        <h2 id="fuentes-noticia">Fuentes</h2>
        <ul>
          {item.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label} <span className={styles.srOnly}>(se abre en otra pestaña)</span></a></li>)}
        </ul>
        <p>Incorporado a Hilo Cofrade el <time dateTime={item.documentedOn}>{hiloDayLabel(item.documentedOn)}</time>.</p>
      </section>
    </div>

    {related.length ? <section className={styles.related} aria-labelledby="mas-del-hilo">
      <div className="shell">
        <header><h2 id="mas-del-hilo">Más del hilo</h2><Link href={HILO_MOVEMENTS_PATH} prefetch={false}>Todas las novedades <span aria-hidden="true">→</span></Link></header>
        <HiloMovementCards items={related} compact />
      </div>
    </section> : null}
  </article>
}
