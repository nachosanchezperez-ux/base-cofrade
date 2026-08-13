import Image from 'next/image'
import Link from 'next/link'
import { getBandsDirectory } from '@/lib/supabase/bands'
import styles from './bandas.module.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Bandas de Sevilla y provincia',
  description: 'Directorio de bandas cofrades de Sevilla y su provincia: historia, acompañamientos, dirección, salidas y estrenos.',
  alternates: { canonical: '/bandas' },
}

export default async function BandasPage() {
  const bands = await getBandsDirectory()

  return (
    <main className={styles.module}>
      <section className={styles.directoryHero}>
        <div className="shell">
          <span className={styles.eyebrow}>Enciclopedia musical</span>
          <h1>Directorio de bandas</h1>
          <p>Formaciones identificadas por sus propios colores y conectadas con hermandades, pasos, salidas, responsables y patrimonio musical.</p>
        </div>
      </section>

      <section className={styles.directorySection}>
        <div className="shell">
          <div className={styles.resultHeading}>
            <div><strong>{bands.length} {bands.length === 1 ? 'banda publicada' : 'bandas publicadas'}</strong><span>Sevilla capital y provincia</span></div>
          </div>
          <div className={styles.bandGrid}>
            {bands.map((band) => (
              <Link
                href={`/bandas/${band.slug}`}
                className={styles.bandCard}
                key={band.id}
                style={{ '--band-primary': band.primaryColor, '--band-secondary': band.secondaryColor }}
              >
                <span className={styles.cardStripe} />
                <span className={styles.cardLogo}>
                  {band.logoPath ? <Image src={band.logoPath} alt="" width={100} height={126} sizes="100px" /> : band.popularName.slice(0, 2).toUpperCase()}
                </span>
                <span className={styles.cardCopy}>
                  <small>{band.type}</small>
                  <strong>{band.popularName}</strong>
                  <span>{band.officialName}</span>
                  <em>{band.municipality}{band.foundation ? ` · Desde ${band.foundation}` : ''}</em>
                </span>
                <span className={styles.cardArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
