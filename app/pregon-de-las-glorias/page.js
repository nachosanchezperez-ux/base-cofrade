import Link from 'next/link'
import { connection } from 'next/server'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import { getPregonGlorias } from '@/lib/supabase/pregon-glorias'
import { PREGON_GLORIAS_PATH } from '@/lib/pregon-glorias'
import { breadcrumbJsonLd, collectionPageJsonLd, socialMetadata } from '@/lib/seo'
import { pluralWord } from '@/lib/plural'
import styles from './pregon-glorias.module.css'

export const revalidate = 900

const title = 'Pregón de las Glorias de Sevilla: pregoneros e imágenes'
const description = 'Todos los Pregones de las Glorias de Sevilla desde 1968: quién lo pronunció, qué imagen o Simpecado lo presidió y qué hermandades lo han presidido más veces.'
const CONSEJO_ARCHIVE_URL = 'https://www.hermandades-de-sevilla.org/el-pregon/pregones-de-gloria-2/'

export const metadata = {
  title,
  description,
  alternates: { canonical: PREGON_GLORIAS_PATH },
  ...socialMetadata({ title, description, path: PREGON_GLORIAS_PATH }),
}

// La imagen o Simpecado tal como lo consigna el Consejo; si la hermandad tiene
// ficha publicada, ese mismo nombre enlaza a ella (sin repetir la hermandad).
function Presidency({ item }) {
  const label = item.presidencia || item.brotherhood?.name || 'El archivo oficial no consigna imagen'
  if (item.brotherhood) {
    return <Link href={item.brotherhood.href} title={item.brotherhood.name}>{label}</Link>
  }
  return label
}

export default async function PregonGloriasPage() {
  await connection()
  const { next, presidencies, decades, stats } = await getPregonGlorias()

  return (
    <section className={`section page-top ${styles.page}`}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
        { name: 'Glorias', path: '/hermandades/gloria' },
        { name: 'Pregón de las Glorias', path: PREGON_GLORIAS_PATH },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: PREGON_GLORIAS_PATH,
        name: 'Pregón de las Glorias de Sevilla',
        description,
        items: presidencies
          .filter((group) => group.href)
          .map((group) => ({ name: group.name, path: group.href })),
      })} />

      <div className="shell">
        <SiteBreadcrumb
          items={[
            { label: 'Hermandades', href: '/hermandades' },
            { label: 'Glorias', href: '/hermandades/gloria' },
            { label: 'Pregón de las Glorias' },
          ]}
          tone="light"
        />

        <header className={styles.intro}>
          <span className="eyebrow">Consejo de Hermandades · Sevilla</span>
          <h1>Pregón de las Glorias de Sevilla</h1>
          <p>
            Desde 1968, el Consejo de Hermandades celebra el Pregón de las Glorias, presidido por una imagen o un Simpecado de Gloria de la ciudad. Aquí están todos sus pregoneros y las hermandades que lo han presidido.
          </p>
          {stats.heldCount ? (
            <p className={styles.stats}>
              <strong>{stats.heldCount}</strong> {pluralWord(stats.heldCount, 'pregón', 'pregones')} · {stats.firstYear}–{stats.lastYear} · <strong>{stats.corporationCount}</strong> {pluralWord(stats.corporationCount, 'presidencia', 'presidencias distintas')}
            </p>
          ) : null}
        </header>

        {next ? (
          <section className={styles.next} aria-labelledby="proximo-pregon-glorias">
            <span className={styles.kicker}>Próximo pregón</span>
            <h2 id="proximo-pregon-glorias">{next.year}</h2>
            <dl>
              {next.pregonero ? (
                <div><dt>Pregonero</dt><dd>{next.pregonero}</dd></div>
              ) : null}
              {next.presidencia || next.brotherhood ? (
                <div>
                  <dt>Presidirá</dt>
                  <dd>
                    {next.brotherhood
                      ? <Link href={next.brotherhood.href}>{next.presidencia || next.brotherhood.name}</Link>
                      : next.presidencia}
                  </dd>
                </div>
              ) : null}
              {next.dateLabel || next.place ? (
                <div><dt>Cuándo y dónde</dt><dd>{[next.dateLabel, next.place].filter(Boolean).join(' · ')}</dd></div>
              ) : null}
            </dl>
          </section>
        ) : null}

        <section className={styles.block} aria-labelledby="hermandades-pregon-glorias">
          <div className={styles.blockHead}>
            <h2 id="hermandades-pregon-glorias">Hermandades que lo han presidido</h2>
            <p>Ordenadas por número de veces. Enlazamos la ficha de cada hermandad cuando está publicada en Hilo Cofrade.</p>
          </div>
          <ol className={styles.presidencies}>
            {presidencies.map((group) => (
              <li key={group.key}>
                <div>
                  {group.href ? <Link href={group.href}>{group.name}</Link> : <span>{group.name}</span>}
                  <small>
                    {group.years.map((entry) => (entry.isAnnounced ? `${entry.year} (próximo)` : entry.year)).join(', ')}
                  </small>
                </div>
                <strong aria-label={`${group.count} ${pluralWord(group.count, 'vez', 'veces')}`}>{group.count}</strong>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.block} aria-labelledby="cronologia-pregon-glorias">
          <div className={styles.blockHead}>
            <h2 id="cronologia-pregon-glorias">Todos los pregones, año a año</h2>
          </div>
          {decades.map((bucket, index) => (
            <details className={styles.decade} key={bucket.decade} open={index === 0}>
              <summary>
                <h3>{bucket.label}</h3>
                <span>{bucket.items.length} {pluralWord(bucket.items.length, 'pregón', 'pregones')}</span>
              </summary>
              <ol className={styles.years}>
                {bucket.items.map((item) => (
                  <li key={item.id} id={`pregon-${item.year}`}>
                    <span className={styles.year}>{item.year}</span>
                    <div>
                      <p className={styles.pregonero}>{item.pregonero || 'Pregonero sin consignar'}</p>
                      <p className={styles.presidency}><Presidency item={item} /></p>
                      {item.dateLabel || item.place ? (
                        <p className={styles.meta}>{[item.dateLabel, item.place].filter(Boolean).join(' · ')}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </section>

        <p className={styles.source}>
          Fuente: <a href={CONSEJO_ARCHIVE_URL} target="_blank" rel="noopener noreferrer">archivo de Pregones de Gloria del Consejo General de Hermandades y Cofradías de Sevilla</a>. El archivo no recoge pregón en 2020.
        </p>
      </div>
    </section>
  )
}
