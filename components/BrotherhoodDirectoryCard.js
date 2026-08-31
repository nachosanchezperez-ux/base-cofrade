import Link from 'next/link'
import CofradeTypeBadges from '@/components/CofradeTypeBadges'
import BrotherhoodDirectoryCrestImage from '@/components/BrotherhoodDirectoryCrestImage'
import { displayName, localityLabel } from '@/lib/brotherhood-directory'
import contractStyles from './DirectoryCardContract.module.css'
import styles from './HermandadesDirectory.module.css'
import enhancementStyles from './HermandadesDirectoryEnhancements.module.css'
import crestStyles from './BrotherhoodDirectoryCrest.module.css'

function crestFor(hermandad) {
  if (hermandad.escudoPath) return hermandad.escudoPath
  if (hermandad.slug === 'el-baratillo') return '/escudos/el-baratillo.svg'
  if (hermandad.slug === 'asuncion-de-cantillana') return '/escudos/asuncion-de-cantillana.png'
  return null
}

export default function BrotherhoodDirectoryCard({ hermandad, contextLabel }) {
  const crest = crestFor(hermandad)
  const name = displayName(hermandad)
  const placeLabel = [localityLabel(hermandad), hermandad.barrio].filter(Boolean).join(' · ')

  return (
    <Link
      href={`/hermandades/${hermandad.slug}`}
      className={`${styles.item} ${contractStyles.contract}`}
      aria-label={`Abrir ficha de ${name}`}
    >
      <span
        className={`${styles.crestWrap} ${contractStyles.media} ${crest ? crestStyles.crestMedia : crestStyles.fallbackMedia}`}
        data-media-overflow={crest ? 'visible' : undefined}
      >
        {crest ? (
          <BrotherhoodDirectoryCrestImage
            className={`${styles.crestImage} ${crestStyles.crestImage}`}
            src={crest}
            alt={`Escudo de ${name}`}
            fallback={name.slice(0, 2).toUpperCase()}
            fallbackClassName={`${styles.monogram} ${crestStyles.monogram}`}
          />
        ) : (
          <span className={`${styles.monogram} ${crestStyles.monogram}`}>{name.slice(0, 2).toUpperCase()}</span>
        )}
      </span>

      <span className={`${styles.itemMain} ${contractStyles.copy}`}>
        <strong className={styles.name}>{name}</strong>
        {contextLabel || hermandad.diaSalida ? (
          <span className={`${styles.context} ${enhancementStyles.contextAfterName}`}>{contextLabel || hermandad.diaSalida}</span>
        ) : null}
        {hermandad.sede ? <span className={styles.see}>{hermandad.sede}</span> : null}
        {placeLabel ? <span className={styles.place}>{placeLabel}</span> : null}
        <span className={styles.types}>
          <CofradeTypeBadges tipos={hermandad.tipos || []} compact />
        </span>
      </span>

      <span className={`${styles.arrow} ${contractStyles.action}`} aria-hidden="true">→</span>
    </Link>
  )
}
