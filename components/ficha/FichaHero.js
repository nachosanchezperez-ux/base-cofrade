import Image from 'next/image'
import Link from 'next/link'
import BrotherhoodDirectoryCrestImage from '../BrotherhoodDirectoryCrestImage'
import SiteBreadcrumb from '../SiteBreadcrumb'
import styles from './FichaHero.module.css'

// Cabecera común de las fichas (Tarea 09). La fotografía ocupa su propio
// espacio y nunca queda tapada por el título; la identidad (escudo, tipo,
// municipio, nombre y contexto) va en una placa con el color de la entidad.

function bypassOptimizer(src = '') {
  if (String(src).startsWith('/')) return true
  try {
    return new URL(src).hostname === 'upload.wikimedia.org'
  } catch {
    return false
  }
}

function FactValue({ fact }) {
  return fact.href
    ? <a href={fact.href} className={styles.factLink}>{fact.value}</a>
    : <>{fact.value}</>
}

function ContextItem({ item }) {
  if (!item?.label) return null
  return item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>
}

export default function FichaHero({
  kind,
  title,
  officialName = '',
  context = [],
  breadcrumbItems = [],
  facts = [],
  media = {},
  crest = null,
  titleId = 'ficha-title',
}) {
  const visibleFacts = facts.filter((fact) => fact?.label && fact?.value !== undefined && fact?.value !== null && fact?.value !== '').slice(0, 4)
  const visibleContext = context.filter((item) => item?.label)
  const hasPhoto = Boolean(media.photoSrc)
  const width = Number(media.width)
  const height = Number(media.height)
  const portrait = width > 0 && height > 0 ? height / width >= 1.05 : Boolean(media.portrait)
  const focus = media.focusPosition || `${media.focusX ?? 50}% ${media.focusY ?? 35}%`
  const mobileFocus = media.mobileFocusPosition || `${media.mobileFocusX ?? media.focusX ?? 50}% ${media.mobileFocusY ?? media.focusY ?? 35}%`

  return (
    <header
      className={`${styles.hero} ${hasPhoto ? styles.withPhoto : styles.noPhoto} ${portrait ? styles.portrait : styles.landscape}`}
      aria-labelledby={titleId}
      style={{ '--ficha-focus': focus, '--ficha-focus-mobile': mobileFocus }}
    >
      <div className={`shell ${styles.crumbs}`}>
        <SiteBreadcrumb items={breadcrumbItems} ariaLabel="Ruta de navegación" showAccent={false} />
      </div>

      <div className={styles.frame}>
        {hasPhoto ? (
          <figure className={styles.photo}>
            <Image
              src={media.photoSrc}
              alt={media.photoAlt || `Fotografía de ${title}`}
              fill
              priority
              unoptimized={bypassOptimizer(media.photoSrc)}
              sizes="(max-width: 979px) 100vw, 52vw"
            />
            {media.credit ? <figcaption>{media.credit}</figcaption> : null}
          </figure>
        ) : null}

        <div className={styles.plate}>
          <div className={styles.identity}>
            {crest?.src ? (
              <span className={styles.crest}>
                <BrotherhoodDirectoryCrestImage
                  src={crest.src}
                  alt={crest.alt || `Escudo de ${title}`}
                  width={120}
                  height={136}
                  sizes="(max-width: 979px) 64px, 96px"
                  priority
                  fallbackClassName={styles.crest}
                />
              </span>
            ) : null}
            <div className={styles.identityCopy}>
              <p className={styles.kind}>{kind}</p>
              <h1 id={titleId} data-long={String(title || '').length > 34 ? 'true' : undefined}>{title}</h1>
            </div>
          </div>

          {visibleContext.length ? (
            <p className={styles.context}>
              {visibleContext.map((item, index) => (
                <span key={`${item.label}-${index}`}>
                  {index > 0 ? <i aria-hidden="true">·</i> : null}
                  <ContextItem item={item} />
                </span>
              ))}
            </p>
          ) : null}

          {officialName ? (
            <details className={styles.official}>
              <summary>Nombre oficial <span aria-hidden="true">+</span></summary>
              <p>{officialName}</p>
            </details>
          ) : null}

          {visibleFacts.length ? (
            <dl className={styles.facts} data-count={visibleFacts.length}>
              {visibleFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd><FactValue fact={fact} /></dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </header>
  )
}
