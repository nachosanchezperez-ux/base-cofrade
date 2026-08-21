import Image from 'next/image'
import Link from 'next/link'
import CofradeTypeBadges from '@/components/CofradeTypeBadges'
import { displayName, localityLabel } from '@/lib/brotherhood-directory'
import styles from './HermandadesDirectory.module.css'
import enhancementStyles from './HermandadesDirectoryEnhancements.module.css'

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
    <Link href={`/hermandades/${hermandad.slug}`} className={styles.item}>
      <span className={styles.crestWrap}>
        {crest ? (
          <Image
            className={styles.crestImage}
            src={crest}
            alt={`Escudo de ${name}`}
            width={76}
            height={96}
            sizes="76px"
          />
        ) : (
          <span className={styles.monogram}>{name.slice(0, 2).toUpperCase()}</span>
        )}
      </span>

      <span className={styles.itemMain}>
        <strong className={styles.name}>{name}</strong>
        {contextLabel || hermandad.diaSalida ? (
          <span className={`${styles.context} ${enhancementStyles.contextAfterName}`}>{contextLabel || hermandad.diaSalida}</span>
        ) : null}
        <span className={styles.see}>{hermandad.sede || 'Sede canónica por documentar'}</span>
        <span className={styles.place}>{placeLabel}</span>
        <span className={styles.types}>
          <CofradeTypeBadges tipos={hermandad.tipos || []} compact />
        </span>
      </span>

      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>
  )
}
