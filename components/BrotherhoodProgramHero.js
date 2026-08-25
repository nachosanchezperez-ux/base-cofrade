import Image from 'next/image'
import Link from 'next/link'
import styles from './BrotherhoodProgramHero.module.css'

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

export default function BrotherhoodProgramHero({
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

  return (
    <section className={`${styles.hero} ${hasPhoto ? styles.hasPhoto : styles.noPhoto}`} aria-labelledby="brotherhood-program-title">
      {hasPhoto ? (
        <Image
          className={styles.photo}
          src={media.photoSrc}
          alt={media.photoAlt || `Fotografía de ${title}`}
          fill
          priority
          sizes="100vw"
        />
      ) : null}
      <span className={styles.photoVeil} aria-hidden="true" />
      <span className={styles.texture} aria-hidden="true" />

      <div className={`shell ${styles.shell}`}>
        <Breadcrumb items={breadcrumbItems} />

        <div className={styles.content}>
          <div className={styles.identityRow}>
            {media.crestSrc ? (
              <span className={styles.crest}>
                <Image
                  src={media.crestSrc}
                  alt={media.crestAlt || `Escudo de ${title}`}
                  width={94}
                  height={112}
                  sizes="(max-width: 620px) 64px, 94px"
                  priority
                />
              </span>
            ) : null}
            <div className={styles.identityCopy}>
              <span>Hermandad de Penitencia</span>
              {locality ? <small>{locality}</small> : null}
            </div>
          </div>

          <h1 id="brotherhood-program-title">{title}</h1>
          {context ? <p className={styles.context}>{context}</p> : null}
          {officialName ? <p className={styles.officialName}>{officialName}</p> : null}

          {visibleFacts.length ? (
            <dl className={styles.facts} data-count={visibleFacts.length}>
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

      {hasPhoto && media.credit ? <span className={styles.credit}>{media.credit}</span> : null}
    </section>
  )
}
