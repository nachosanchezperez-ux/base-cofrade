import Image from 'next/image'
import Link from 'next/link'
import CofradeTypeBadges from '@/components/CofradeTypeBadges'
import { displayName, localityLabel } from '@/lib/brotherhood-directory'
import styles from './HermandadesDirectory.module.css'

const SAN_BENITO_OFFICIAL_CREST = 'https://hermandaddesanbenito.net/wp-content/uploads/2023/07/Escudo-actual-994x1024.png'

function crestFor(hermandad) {
  if (hermandad.slug === 'san-benito') return SAN_BENITO_OFFICIAL_CREST
  if (hermandad.escudoPath) return hermandad.escudoPath
  if (hermandad.slug === 'el-baratillo') return '/escudos/el-baratillo.svg'
  if (hermandad.slug === 'asuncion-de-cantillana') return '/escudos/asuncion-de-cantillana.png'
  return null
}

export default function BrotherhoodDirectoryCard({ hermandad, contextLabel }) {
  const crest = crestFor(hermandad)
  const name = displayName(hermandad)
  const placeLabel = [localityLabel(hermandad), hermandad.barrio].filter(Boolean).join(' · ')
  const isRemoteCrest = crest?.startsWith('http')

  return (
    <Link href={`/hermandades/${hermandad.slug}`} className={styles.item}>
      <span className={styles.crestWrap}>
        {crest ? (
          isRemoteCrest ? (
            <img
              className={styles.crestImage}
              src={crest}
              alt={`Escudo de ${name}`}
              width="76"
              height="96"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <Image
              className={styles.crestImage}
              src={crest}
              alt={`Escudo de ${name}`}
              width={76}
              height={96}
              sizes="76px"
            />
          )
        ) : (
          <span className={styles.monogram}>{name.slice(0, 2).toUpperCase()}</span>
        )}
      </span>

      <span className={styles.itemMain}>
        {contextLabel || hermandad.diaSalida ? (
          <span className={styles.context}>{contextLabel || hermandad.diaSalida}</span>
        ) : null}
        <strong className={styles.name}>{name}</strong>
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
