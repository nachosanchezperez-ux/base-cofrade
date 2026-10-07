import Link from 'next/link'
import { displayName } from '@/lib/brotherhood-directory'
import {
  brotherhoodDirectoryLocalities,
  groupBrotherhoodsByLocality,
} from '@/lib/brotherhood-public-index'
import styles from './BrotherhoodPublicIndex.module.css'

function contextLine(item) {
  return [item.diaSalida, item.sede].filter(Boolean).join(' · ')
}

export default function BrotherhoodPublicIndex({ brotherhoods = [] }) {
  const groups = groupBrotherhoodsByLocality(brotherhoods)
  const localityPages = new Map(
    brotherhoodDirectoryLocalities(brotherhoods).map((item) => [item.slug, item])
  )

  if (!groups.length) return null

  return (
    <section className={styles.index} aria-labelledby="indice-hermandades">
      <details className={styles.disclosure}>
        <summary className={styles.summary}>
          <h2 id="indice-hermandades">Hermandades por localidad</h2>
        </summary>

        <div className={styles.groups}>
          {groups.map((group) => {
            const localityPage = localityPages.get(group.slug)
            const localityName = group.locality === 'Sevilla' ? 'Sevilla capital' : group.locality

            return (
              <section className={`${styles.group} ${group.key === 'sevilla' ? styles.capitalGroup : ''}`} id={`hermandades-${group.key}`} key={group.key} aria-labelledby={`hermandades-${group.key}-titulo`}>
                <header>
                  <h3 id={`hermandades-${group.key}-titulo`}>
                    {localityPage ? (
                      <Link href={localityPage.href}>{localityName} <span aria-hidden="true">→</span></Link>
                    ) : localityName}
                  </h3>
                  <span className={styles.count}>{group.items.length} {group.items.length === 1 ? 'corporación' : 'corporaciones'}</span>
                </header>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.id || item.slug}>
                      <Link href={`/hermandades/${item.slug}`} prefetch={false}>
                        <strong>{displayName(item)}</strong>
                        {contextLine(item) ? <span>{contextLine(item)}</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </details>
    </section>
  )
}
