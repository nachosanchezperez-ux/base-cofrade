import Image from 'next/image'
import Link from 'next/link'
import EntityVisualFallback from '@/components/EntityVisualFallback'
import styles from './CoronadasExplorer.module.css'

const ACT_STATUS_SUFFIX = { upcoming: ' · prevista', unconfirmed: ' · sin confirmar', postponed: ' · aplazada', suspended: ' · suspendida', cancelled: ' · cancelada' }

function isSvg(path = '') {
  return /\.svg(?:$|\?)/i.test(path)
}

// Sin foto: escudo de la hermandad sobre sus colores; sin escudo, el hilo de
// Hilo Cofrade sobre esos mismos colores. Nunca un hueco vacío.
function Visual({ item, priority }) {
  if (item.photo?.src) {
    return (
      <Image
        className={styles.photo}
        src={item.photo.src}
        alt={item.photo.alt || item.name}
        fill
        sizes="(max-width: 719px) 100vw, (max-width: 1099px) 50vw, 360px"
        priority={priority}
        style={{ objectPosition: item.photo.focus || '50% 30%' }}
      />
    )
  }
  if (item.crest) {
    return (
      <Image
        className={styles.crest}
        src={item.crest}
        alt={item.brotherhood ? `Escudo de ${item.brotherhood.name}` : ''}
        width={120}
        height={146}
        unoptimized={isSvg(item.crest)}
      />
    )
  }
  return <EntityVisualFallback className={styles.fallback} />
}

function Officiants({ officiants = [] }) {
  if (!officiants.length) return null
  return (
    <span className={styles.officiant}>
      {officiants.map((officiant, index) => (
        <span key={officiant.id}>
          {index ? ' y ' : ''}
          {officiant.href ? <Link href={officiant.href}>{officiant.name}</Link> : officiant.name}
        </span>
      ))}
    </span>
  )
}

export default function CoronadaCard({ item, priority = false, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  const palette = item.palette || {}
  const style = {
    '--coronada-primary': palette.primario || undefined,
    '--coronada-dark': palette.oscuro || undefined,
  }

  return (
    <article className={styles.card} style={style} id={`coronada-${item.id}`}>
      <div className={`${styles.media} ${item.photo?.src ? styles.mediaPhoto : styles.mediaIdentity}`}>
        <Visual item={item} priority={priority} />
        {item.year ? (
          <span className={styles.year}>
            <small>{item.isUpcoming ? 'Prevista' : item.kindLabel === 'Coronada' ? 'Coronada' : item.kindLabel}</small>
            {item.year}
          </span>
        ) : null}
      </div>
      <div className={styles.body}>
        <Heading className={styles.name}>
          {item.href ? <Link href={item.href}>{item.name}</Link> : item.name}
        </Heading>
        {item.brotherhood || item.municipality ? (
          <p className={styles.place}>
            {item.brotherhood
              ? (item.brotherhood.href ? <Link href={item.brotherhood.href}>{item.brotherhood.name}</Link> : item.brotherhood.name)
              : null}
            {item.brotherhood && item.municipality ? ' · ' : null}
            {item.municipality}
          </p>
        ) : null}
        <ol className={styles.acts}>
          {item.acts.map((act) => (
            <li key={act.id}>
              <span className={styles.actLabel}>{act.label}{ACT_STATUS_SUFFIX[act.status] || ''}</span>
              {act.dateLabel ? <time dateTime={act.date || undefined}>{act.dateLabel}</time> : null}
              <Officiants officiants={act.officiants} />
            </li>
          ))}
        </ol>
        {item.photo?.credit ? <p className={styles.credit}>{item.photo.credit}</p> : null}
      </div>
    </article>
  )
}
