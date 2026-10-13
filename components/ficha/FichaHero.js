import Image from 'next/image'
import Link from 'next/link'
import BrotherhoodDirectoryCrestImage from '../BrotherhoodDirectoryCrestImage'
import SiteBreadcrumb from '../SiteBreadcrumb'
import styles from './FichaHero.module.css'

// Portada de las fichas (Tarea 09 · dirección «enciclopedia × revista").
// Fotografía a sangre, nombre en grande y una entradilla. Sin datos sueltos:
// las cifras y los detalles tienen su propio bloque más abajo, para no
// repetir información.

function bypassOptimizer(src = '') {
  try {
    return new URL(src).hostname === 'upload.wikimedia.org'
  } catch {
    return false
  }
}

function ContextItem({ item }) {
  if (!item?.label) return null
  return item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>
}

export default function FichaHero({
  kind,
  title,
  dek = '',
  officialName = '',
  context = [],
  breadcrumbItems = [],
  media = {},
  crest = null,
  titleId = 'ficha-title',
}) {
  const visibleContext = context.filter((item) => item?.label)
  const hasPhoto = Boolean(media.photoSrc)
  const focus = media.focusPosition || `${media.focusX ?? 50}% ${media.focusY ?? 35}%`
  const mobileFocus = media.mobileFocusPosition || `${media.mobileFocusX ?? media.focusX ?? 50}% ${media.mobileFocusY ?? media.focusY ?? 35}%`
  const longTitle = String(title || '').length > 26

  return (
    <header
      className={`${styles.hero} ${hasPhoto ? styles.withPhoto : styles.noPhoto}`}
      aria-labelledby={titleId}
      style={{ '--ficha-focus': focus, '--ficha-focus-mobile': mobileFocus }}
    >
      <div className={styles.crumbs}>
        <div className="shell">
          <SiteBreadcrumb items={breadcrumbItems} ariaLabel="Ruta de navegación" showAccent={false} tone="dark" />
        </div>
      </div>

      {hasPhoto ? (
        <figure className={styles.photo}>
          <Image
            src={media.photoSrc}
            alt={media.photoAlt || `Fotografía de ${title}`}
            fill
            priority
            unoptimized={bypassOptimizer(media.photoSrc)}
            sizes="(max-width: 979px) 100vw, 60vw"
          />
          {media.credit ? <figcaption>{media.credit}</figcaption> : null}
        </figure>
      ) : null}

      <div className={styles.copy}>
        <div className={`shell ${styles.copyInner}`}>
          {crest?.src ? (
            <span className={styles.crest}>
              <BrotherhoodDirectoryCrestImage
                src={crest.src}
                alt={crest.alt || `Escudo de ${title}`}
                width={120}
                height={136}
                sizes="(max-width: 979px) 64px, 88px"
                priority
                fallbackClassName={styles.crest}
              />
            </span>
          ) : null}
          {kind ? <p className={styles.kind}>{kind}</p> : null}
          <h1 id={titleId} data-long={longTitle ? 'true' : undefined}>{title}</h1>
          {dek ? <p className={styles.dek}>{dek}</p> : null}
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
        </div>
      </div>
    </header>
  )
}
