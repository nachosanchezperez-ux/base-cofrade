import { connection } from 'next/server'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import CoronadaCard from '@/components/CoronadaCard'
import CoronadasExplorer from '@/components/CoronadasExplorer'
import { getVirgenesCoronadas } from '@/lib/supabase/virgenes-coronadas'
import { VIRGENES_CORONADAS_PATH } from '@/lib/virgenes-coronadas'
import { breadcrumbJsonLd, collectionPageJsonLd, socialMetadata } from '@/lib/seo'
import { pluralWord } from '@/lib/plural'
import styles from './virgenes-coronadas.module.css'

export const revalidate = 900

const title = 'Vírgenes Coronadas de Sevilla y provincia'
const description = 'Todas las Vírgenes coronadas de la provincia de Sevilla: año y fecha de la coronación canónica, pontificia o litúrgica, prelado que la coronó, advocación y hermandad.'

export const metadata = {
  title,
  description,
  alternates: { canonical: VIRGENES_CORONADAS_PATH },
  ...socialMetadata({ title, description, path: VIRGENES_CORONADAS_PATH }),
}

// Solo viaja al navegador lo que pinta la tarjeta.
function compact(item) {
  return {
    id: item.id,
    name: item.name,
    href: item.href,
    photo: item.photo
      ? { src: item.photo.path, alt: item.photo.alt, focus: item.photo.focusPosition, credit: item.photo.credit }
      : null,
    crest: item.crest || '',
    palette: item.palette ? { primario: item.palette.primario, oscuro: item.palette.oscuro } : null,
    brotherhood: item.brotherhood ? { name: item.brotherhood.name, href: item.brotherhood.href } : null,
    municipality: item.municipality,
    kind: item.kind,
    kindLabel: item.kindLabel,
    year: item.year,
    isUpcoming: item.isUpcoming,
    acts: item.acts.map((act) => ({
      id: act.id,
      label: act.label,
      date: act.date,
      dateLabel: act.dateLabel,
      isAnnounced: act.isAnnounced,
      officiants: act.officiants,
    })),
  }
}

export default async function VirgenesCoronadasPage() {
  await connection()
  const { upcoming, crowned, filters, stats } = await getVirgenesCoronadas()

  return (
    <section className={`section page-top ${styles.page}`}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Imágenes', path: '/imagenes' },
        { name: 'Vírgenes Coronadas', path: VIRGENES_CORONADAS_PATH },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: VIRGENES_CORONADAS_PATH,
        name: 'Vírgenes Coronadas de la provincia de Sevilla',
        description,
        items: crowned.filter((item) => item.href).map((item) => ({ name: item.name, path: item.href })),
      })} />

      <div className="shell">
        <SiteBreadcrumb
          items={[
            { label: 'Imágenes', href: '/imagenes' },
            { label: 'Vírgenes Coronadas' },
          ]}
          tone="light"
        />

        <header className={styles.intro}>
          <span className="eyebrow">Patrimonio mariano · Sevilla y provincia</span>
          <h1>Vírgenes Coronadas</h1>
          <p>
            Las imágenes de la Virgen coronadas en la provincia de Sevilla: cuándo, con qué rango y qué prelado les impuso la corona. Cuando una coronación litúrgica se elevó después a canónica, aparecen las dos fechas.
          </p>
          {stats.count ? (
            <p className={styles.stats}>
              <strong>{stats.count}</strong> {pluralWord(stats.count, 'Virgen coronada', 'Vírgenes coronadas')}
              {stats.municipalityCount ? <> en <strong>{stats.municipalityCount}</strong> {pluralWord(stats.municipalityCount, 'localidad', 'localidades')}</> : null}
              {stats.firstYear ? <> · {stats.firstYear}–{stats.lastYear}</> : null}
            </p>
          ) : null}
        </header>

        {upcoming.length ? (
          <section className={styles.upcoming} aria-labelledby="proximas-coronaciones">
            <h2 id="proximas-coronaciones">{upcoming.length === 1 ? 'Próxima coronación' : 'Próximas coronaciones'}</h2>
            <div className={styles.upcomingList}>
              {upcoming.map((item) => <CoronadaCard key={item.id} item={compact(item)} priority />)}
            </div>
          </section>
        ) : null}

        <section className={styles.block} aria-labelledby="todas-las-coronadas">
          <h2 id="todas-las-coronadas" className={styles.blockTitle}>Todas las coronadas, de la más reciente a la primera</h2>
          <CoronadasExplorer items={crowned.map(compact)} filters={filters} />
        </section>

        <p className={styles.note}>
          Solo recogemos coronaciones documentadas con fuente. Si echas en falta alguna o ves un dato que corregir, <a href="/colabora">cuéntanoslo</a>.
        </p>
      </div>
    </section>
  )
}
