import Image from 'next/image'
import Link from 'next/link'
import styles from './bandas.module.css'

export default function BandsDirectoryView({ visibleBands, activeFilter = '' }) {
  return (
    <div className="shell">
      <div className={styles.resultHeading}>
        <div>
          <strong>{visibleBands.length} {visibleBands.length === 1 ? 'banda publicada' : 'bandas publicadas'}</strong>
          <span>{activeFilter ? `Filtro: ${activeFilter}` : 'Sevilla capital y provincia'}</span>
        </div>
        {activeFilter ? <Link className={styles.clearFilter} href="/bandas">Ver todas</Link> : null}
      </div>
      <div className={styles.bandGrid}>
        {visibleBands.map((band) => (
          <Link
            href={`/bandas/${band.slug}`}
            className={styles.bandCard}
            key={band.id}
            style={{ '--band-primary': band.primaryColor, '--band-secondary': band.secondaryColor }}
          >
            <span className={styles.cardStripe} />
            <span className={styles.cardLogo}>
              {band.logoPath
                ? <Image src={band.logoPath} alt={`Logotipo de ${band.popularName}`} width={100} height={126} sizes="100px" />
                : band.popularName.slice(0, 2).toUpperCase()}
            </span>
            <span className={styles.cardCopy}>
              <small>{band.type}</small>
              <strong style={{ color: 'var(--band-ink)' }}>{band.popularName}</strong>
              <span>{band.officialName}</span>
              <em>{band.municipality}{band.foundation ? ` · Desde ${band.foundation}` : ''}</em>
            </span>
            <span className={styles.cardArrow}>→</span>
          </Link>
        ))}
        {!visibleBands.length ? <div className={styles.emptyBlock}>No hay bandas publicadas con este filtro.</div> : null}
      </div>
    </div>
  )
}
