import { Suspense } from 'react'
import JsonLd from '@/components/JsonLd'
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  socialMetadata,
} from '@/lib/seo'
import { getBandsDirectory } from '@/lib/supabase/bands'
import BandsDirectoryFilter from './BandsDirectoryFilter'
import BandsDirectoryView from './BandsDirectoryView'
import styles from './bandas.module.css'

export const revalidate = 3600

const title = 'Bandas de Sevilla y provincia'
const description = 'Directorio de bandas cofrades de Sevilla y su provincia: historia, acompañamientos, dirección, salidas y estrenos.'

export const metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: '/bandas' }),
}

export default async function BandasPage() {
  const bands = await getBandsDirectory()

  return (
    <main className={styles.module}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Bandas', path: '/bandas' },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: '/bandas',
        name: title,
        description,
        items: bands.map((band) => ({ name: band.popularName, path: `/bandas/${band.slug}` })),
      })} />
      <section className={styles.directoryHero}>
        <div className="shell">
          <span className={styles.eyebrow}>Enciclopedia musical</span>
          <h1>Directorio de bandas</h1>
          <p>Formaciones identificadas por sus propios colores y conectadas con hermandades, pasos, salidas, responsables y patrimonio musical.</p>
        </div>
      </section>

      <section className={styles.directorySection}>
        <Suspense fallback={<BandsDirectoryView visibleBands={bands} />}>
          <BandsDirectoryFilter bands={bands} />
        </Suspense>
      </section>
    </main>
  )
}
