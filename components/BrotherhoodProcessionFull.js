import Image from 'next/image'
import { ITEM_KINDS, markRepeatedHeritage, processionCounts, processionSections } from '@/lib/procession-order'
import { plural } from '@/lib/plural'
import styles from './BrotherhoodProcessionFull.module.css'

// «Ver cortejo completo» (Tarea 15 · prototipo). Solo aparece cuando la
// Hermandad tiene un orden procesional documentado (hasDocumentedOrder); si no,
// no se pinta nada y el cortejo resumido queda exactamente igual.
// Todo va en el HTML del servidor dentro de un <details>: indexable y sin JS.
// La pieza patrimonial se describe una sola vez, plegada bajo su posición.

function folded(value = '') {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function HeritageDetails({ heritage, label = '' }) {
  if (!heritage) return null
  const facts = [
    heritage.author ? ['Autor o taller', heritage.author] : null,
    heritage.date && !String(label).includes(heritage.date) ? ['Año', heritage.date] : null,
    heritage.materials ? ['Materiales y técnica', heritage.materials] : null,
  ].filter(Boolean)
  const hasMore = facts.length || heritage.history || heritage.source
  if (!hasMore) return null
  // Cerrado si no hay más que el nombre; abierto en el HTML, plegado a la vista.
  return <details className={styles.more}>
    <summary>Sobre la pieza <b aria-hidden="true">+</b></summary>
    {facts.length ? <dl className={styles.facts}>
      {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl> : null}
    {heritage.history ? <p>{heritage.history}</p> : null}
    {heritage.review ? <p className={styles.review}>Dato pendiente de confirmar con la Hermandad.</p> : null}
    {heritage.href ? <p><a href={heritage.href}>Ver en el patrimonio de la Hermandad <span aria-hidden="true">›</span></a></p> : null}
    {heritage.source ? <p className={styles.source}>Fuente: {heritage.source}</p> : null}
  </details>
}

function Item({ item }) {
  const photo = item.heritage?.photo
  return <li className={`${styles.item} ${photo ? styles.withPhoto : ''}`} data-kind={item.kind}>
    {photo ? <figure className={styles.thumb}>
      <Image src={photo.src} alt={photo.alt || item.label} fill sizes="48px" />
    </figure> : null}
    <div className={styles.copy}>
      <p className={styles.name}>{item.label}</p>
      {/* El tipo solo si el nombre no lo dice ya («Antepresidencia» no se repite). */}
      {item.kind !== 'insignia' && !folded(item.label).includes(folded(ITEM_KINDS[item.kind])) ? <p className={styles.kind}>{ITEM_KINDS[item.kind]}</p> : null}
      {item.note ? <p className={styles.note}>{item.note}</p> : null}
      <HeritageDetails heritage={item.heritage} label={item.label} />
    </div>
  </li>
}

export default function BrotherhoodProcessionFull({ order, profile = 'penitencia', defaultOpen = false }) {
  const sections = markRepeatedHeritage(processionSections(order))
  if (!sections.length) return null
  const counts = processionCounts(order)
  const isGloria = profile === 'gloria'
  const summary = [
    counts.insignias ? plural(counts.insignias, 'insignia', 'insignias') : '',
    counts.tramos ? plural(counts.tramos, 'tramo', 'tramos') : '',
  ].filter(Boolean).join(' · ')

  return <div className={`shell ${styles.wrap}`}>
    <details className={styles.full} id="cortejo-completo" open={defaultOpen || undefined}>
      <summary>
        <span className={styles.summaryTitle}>{isGloria ? 'Ver procesión completa' : 'Ver cortejo completo'}</span>
        {summary ? <small>{summary}</small> : null}
        <b aria-hidden="true">+</b>
      </summary>
      <div className={styles.body}>
        {order.demo ? <p className={styles.demo} role="note">
          <strong>Demostración estructural.</strong> Elementos de ejemplo para ver cómo se leería un cortejo completo. No corresponde a ninguna Hermandad.
        </p> : null}
        {order.draft ? <p className={styles.demo} role="note">
          <strong>Borrador sin publicar.</strong> Datos tomados de la web oficial y aún no cargados en Hilo Cofrade; pendientes de revisión.
        </p> : null}
        {order.source?.name ? <p className={styles.sourceLine}>
          {order.scope === 'listing'
            ? <>Insignias en el orden en que las publica la Hermandad. No constan tramos ni la posición exacta de los pasos. · </>
            : <>Orden oficial {order.year ? `de ${order.year}` : ''} · </>}
          {order.source.url ? <a href={order.source.url} target="_blank" rel="noopener noreferrer">{order.source.name}</a> : order.source.name}
          {order.source.accessedAt ? <> · consultado el {order.source.accessedAt.split('-').reverse().join('/')}</> : null}
        </p> : null}
        <ol className={styles.line}>
          {sections.map((section) => section.kind === 'step'
            ? <li key={section.key} className={styles.step}>
              <span className={styles.stepMark} aria-hidden="true" />
              <div>
                <p className={styles.stepKind}>{ITEM_KINDS.step}</p>
                <p className={styles.stepName}>{section.step.label}</p>
                {section.step.note ? <p className={styles.note}>{section.step.note}</p> : null}
              </div>
            </li>
            : <li key={section.key} className={styles.section}>
              {section.title ? <p className={styles.sectionTitle}>
                <span className={styles.sectionMark} aria-hidden="true" />
                {section.title}
                {section.tramo?.note ? <small>{section.tramo.note}</small> : null}
              </p> : null}
              {section.items.length ? <ul className={styles.items}>{section.items.map((item) => <Item key={item.key || `${item.sequence}-${item.label}`} item={item} />)}</ul> : null}
            </li>)}
        </ol>
      </div>
    </details>
  </div>
}
