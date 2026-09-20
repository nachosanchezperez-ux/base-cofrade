import Link from 'next/link'
import { displayName } from '@/lib/brotherhood-directory'
import { groupBrotherhoodsByLocality } from '@/lib/brotherhood-public-index'
import styles from './BrotherhoodPublicIndex.module.css'

function contextLine(item) {
  return [item.diaSalida, item.sede].filter(Boolean).join(' · ')
}

export default function BrotherhoodPublicIndex({ brotherhoods = [] }) {
  const groups = groupBrotherhoodsByLocality(brotherhoods)

  if (!groups.length) return null

  return (
    <section className={styles.index} aria-labelledby="indice-hermandades">
      <header className={styles.heading}>
        <div>
          <span>Índice completo</span>
          <h2 id="indice-hermandades">Hermandades por localidad</h2>
        </div>
        <p>Accede directamente a cada ficha de Sevilla capital y su provincia.</p>
      </header>

      <nav className={styles.localities} aria-label="Ir a una localidad">
        {groups.map((group) => (
          <a href={`#hermandades-${group.key}`} key={group.key}>
            <span>{group.locality === 'Sevilla' ? 'Sevilla capital' : group.locality}</span>
            <strong>{group.items.length}</strong>
          </a>
        ))}
      </nav>

      <div className={styles.groups}>
        {groups.map((group) => (
          <section className={styles.group} id={`hermandades-${group.key}`} key={group.key} aria-labelledby={`hermandades-${group.key}-titulo`}>
            <header>
              <h3 id={`hermandades-${group.key}-titulo`}>{group.locality === 'Sevilla' ? 'Sevilla capital' : group.locality}</h3>
              <span>{group.items.length} {group.items.length === 1 ? 'corporación' : 'corporaciones'}</span>
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
        ))}
      </div>
    </section>
  )
}
