import Image from 'next/image'
import Link from 'next/link'
import BrotherhoodDirectoryCrestImage from './BrotherhoodDirectoryCrestImage'
import styles from './BrotherhoodProgramHero.module.css'
import corporateStyles from './BrotherhoodProgramHeroCorporate.module.css'

function Breadcrumb({ items = [] }) {
  if (!items.length) return null

  return (
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
      <span className={styles.breadcrumbAccent} aria-hidden="true" />
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !isCurrent ? <Link href={item.href}>{item.label}</Link> : <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>}
              {!isCurrent ? <i aria-hidden="true">→</i> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function isWikimediaUpload(photoSrc = '') {
  try {
    return new URL(photoSrc).hostname === 'upload.wikimedia.org'
  } catch {
    return false
  }
}

function resolveCreditHref(photoSrc = '') {
  try {
    const url = new URL(photoSrc)
    if (url.hostname !== 'upload.wikimedia.org') return ''
    const fileName = decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1) || '')
    return fileName ? `https://commons.wikimedia.org/wiki/File:${fileName}` : ''
  } catch {
    return ''
  }
}

export default function BrotherhoodProgramHero({
  entityType = 'Hermandad',
  title,
  officialName = '',
  locality = '',
  seat = '',
  breadcrumbItems = [],
  facts = [],
  media = {},
}) {
  const visibleFacts = facts.filter((fact) => fact?.label && fact?.value).slice(0, 4)
  const hasPhoto = Boolean(media.photoSrc)
  const context = [seat, locality].filter(Boolean).join(' · ')
  const width = Number(media.width)
  const height = Number(media.height)
  const hasDimensions = width > 0 && height > 0
  const aspect = hasDimensions ? width / height : null
  const fitMode = media.fitMode || 'auto'
  const resolvedFit = fitMode === 'auto'
    ? (aspect !== null && aspect < 1.35 ? 'contain' : 'cover')
    : fitMode
  const desktopFocus = media.focusPosition || `${media.focusX ?? 50}% ${media.focusY ?? 50}%`
  const mobileFocus = `${media.mobileFocusX ?? media.focusX ?? 50}% ${media.mobileFocusY ?? media.focusY ?? 50}%`
  const heroStyle = {
    '--hero-desktop-focus': desktopFocus,
    '--hero-mobile-focus': mobileFocus,
  }
  const creditHref = resolveCreditHref(media.photoSrc)
  const bypassImageOptimizer = String(media.photoSrc || '').startsWith('/') || isWikimediaUpload(media.photoSrc)

  return (
    <section
      className={`${styles.hero} ${corporateStyles.corporateHero} ${hasPhoto ? styles.hasPhoto : styles.noPhoto} ${resolvedFit === 'contain' ? styles.contained : styles.covered}`}
      aria-labelledby="brotherhood-program-title"
      style={heroStyle}
    >
      {hasPhoto ? (
        <>
          {resolvedFit === 'contain' ? (
            <Image
              className={styles.photoBackdrop}
              src={media.photoSrc}
              alt=""
              fill
              priority
              unoptimized={bypassImageOptimizer}
              sizes="100vw"
              aria-hidden="true"
            />
          ) : null}
          <Image
            className={styles.photo}
            src={media.photoSrc}
            alt={media.photoAlt || `Fotografía de ${title}`}
            fill
            priority
            unoptimized={bypassImageOptimizer}
            sizes="100vw"
            style={{ objectFit: resolvedFit }}
          />
        </>
      ) : null}
      <span className={`${styles.photoVeil} ${!hasPhoto ? corporateStyles.noPhotoVeil : ''}`} aria-hidden="true" />
      <span className={styles.texture} aria-hidden="true" />

      <div className={`shell ${styles.shell}`}>
        <Breadcrumb items={breadcrumbItems} />

        <div className={styles.content}>
          <div className={styles.identityLockup}>
            {media.crestSrc ? (
              <span className={styles.crest}>
                <BrotherhoodDirectoryCrestImage
                  src={media.crestSrc}
                  alt={media.crestAlt || `Escudo de ${title}`}
                  width={178}
                  height={202}
                  sizes="(max-width: 700px) 102px, (max-width: 980px) 144px, 178px"
                  priority
                />
              </span>
            ) : null}
            <div className={styles.identityBody}>
              <div className={styles.identityCopy}>
                <span>{entityType}</span>
                {locality ? <small>{locality}</small> : null}
              </div>
              <h1 id="brotherhood-program-title">{title}</h1>
            </div>
          </div>

          {context ? <p className={styles.context}>{context}</p> : null}
          {officialName ? <p className={styles.officialName}>{officialName}</p> : null}

          {visibleFacts.length ? (
            <dl className={`${styles.facts} ${corporateStyles.corporateFacts}`} data-count={visibleFacts.length}>
              {visibleFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      {hasPhoto && media.credit ? (
        creditHref ? (
          <a className={styles.credit} href={creditHref} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>{media.credit}</a>
        ) : (
          <span className={styles.credit}>{media.credit}</span>
        )
      ) : null}
    </section>
  )
}
