import Image from 'next/image'
import { ITEM_KINDS, isFullProcessionOrder, markRepeatedHeritage, orderStatusLabel, processionSections } from '@/lib/procession-order'
import { insigniaType } from '@/lib/insignia-glossary'
import styles from './BrotherhoodProcessionFull.module.css'

// «Ver insignias del cortejo» / «Ver cortejo completo» (Tarea 15.1 · prototipo):
// un programa de mano para quien ve pasar la
// cofradía. De arriba abajo, en el orden real: cada insignia con su número en
// su cortejo, cómo reconocerla y qué es (la primera vez que aparece ese tipo),
// y cada paso cerrando su cortejo. Solo aparece con un orden documentado; si
// no, no se pinta nada y el cortejo resumido queda igual.
// Todo va en el HTML del servidor dentro de <details>: indexable y sin JS.
// Sin redundancias: la autoría y la historia viven en Patrimonio (el nombre
// enlaza a la pieza) y el año no se repite aquí.

function folded(value = '') {
  return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function Item({ item, number, explained }) {
  const photo = item.heritage?.photo
  const type = insigniaType(item.label)
  // Qué es: solo la primera vez que pasa ese tipo de insignia.
  const whatIs = type && !explained.has(type.key) ? type : null
  if (whatIs) explained.add(type.key)
  // Cómo reconocerla: solo la descripción visual verificada, una vez por pieza.
  const hint = item.repeatOf ? '' : item.look
  const showKind = item.kind !== 'insignia' && item.kind !== 'cross_guide' && !folded(item.label).includes(folded(ITEM_KINDS[item.kind]))
  // El nombre lleva a la pieza en Patrimonio, donde están su autoría y su historia.
  const href = item.heritage?.href
  return <li className={`${styles.item} ${photo ? styles.withPhoto : ''}`} data-kind={item.kind}>
    {number ? <span className={styles.number} aria-hidden="true">{number}</span> : null}
    {photo ? <figure className={styles.thumb}>
      <Image src={photo.src} alt={photo.alt || item.label} fill sizes="48px" />
    </figure> : null}
    <div className={styles.copy}>
      <p className={styles.name}>
        {number ? <span className={styles.visuallyHidden}>{number}. </span> : null}
        {href ? <a href={href}>{item.label}<span className={styles.chevron} aria-hidden="true">›</span></a> : item.label}
      </p>
      {showKind ? <p className={styles.kind}>{ITEM_KINDS[item.kind]}</p> : null}
      {hint ? <p className={styles.look}>{hint}</p> : null}
      {item.accompaniment ? <p className={styles.note}>Con {item.accompaniment}.</p> : null}
      {item.note ? <p className={styles.note}>{item.note}</p> : null}
      {whatIs ? <p className={styles.whatIs}><span>Qué es</span>{whatIs.text}</p> : null}
    </div>
  </li>
}

export default function BrotherhoodProcessionFull({ order, profile = 'penitencia', defaultOpen = false }) {
  const sections = markRepeatedHeritage(processionSections(order))
  if (!sections.length) return null
  const isGloria = profile === 'gloria'
  const explained = new Set()
  // «Cortejo completo» solo con tramos y presidencia documentados; si no, se
  // dice lo que hay: las insignias.
  const full = isFullProcessionOrder(order)
  const title = full
    ? (isGloria ? 'Ver procesión completa' : 'Ver cortejo completo')
    : (isGloria ? 'Ver insignias de la procesión' : 'Ver insignias del cortejo')
  const positions = sections.reduce((total, section) => total + section.items.length, 0)
  const groups = sections.filter((section) => section.kind === 'group').length
  const summary = positions ? (groups > 1 ? `${positions} en ${groups} cortejos` : String(positions)) : ''
  const steps = sections.filter((section) => section.kind === 'step').length
  const byCortejo = order.scope === 'listing' && order.procession && steps === 2 && sections.length === 4
    && sections[1].kind === 'step' && sections[3].kind === 'step'

  const renderSection = (section) => section.kind === 'step'
    ? <li key={section.key} className={styles.step}>
      <span className={styles.stepMark} aria-hidden="true" />
      <div>
        <p className={styles.stepKind}>{section.step.note || ITEM_KINDS.step}</p>
        <p className={styles.stepName}>{section.step.label}</p>
      </div>
    </li>
    : <li key={section.key} className={styles.section}>
      {section.title ? <p className={styles.sectionTitle}>
        <span className={styles.sectionMark} aria-hidden="true" />
        {section.title}
      </p> : null}
      {section.items.length ? <ol className={styles.items}>{section.items.map((item, index) => <Item key={item.key || `${item.sequence}-${item.label}`} item={item} number={index + 1} explained={explained} />)}</ol> : null}
    </li>

  return <div className={`shell ${styles.wrap}`}>
    <details className={styles.full} id="cortejo-completo" open={defaultOpen || undefined}>
      <summary>
        <span className={styles.summaryTitle}>{title}</span>
        {summary ? <small>{summary}</small> : null}
        <b aria-hidden="true">+</b>
      </summary>
      <div className={styles.body}>
        {order.demo ? <p className={styles.demo} role="note">
          <strong>Demostración estructural.</strong> Elementos de ejemplo para ver cómo se leería un cortejo completo. No corresponde a ninguna Hermandad.
        </p> : null}
        {order.draft ? <p className={styles.demo} role="note">
          <strong>Borrador sin publicar.</strong> Datos de la web oficial, aún sin cargar ni revisar.
        </p> : null}
        {/* Una sola referencia a la fuente, con su estado y la fecha de consulta. */}
        {order.source?.name ? <p className={styles.sourceLine}>
          {orderStatusLabel(order)} · {order.source.url ? <a href={order.source.url} target="_blank" rel="noopener noreferrer">{order.source.name}</a> : order.source.name}
          {order.source.accessedAt ? ` · consultado el ${order.source.accessedAt.split('-').reverse().join('/')}` : null}
        </p> : null}
        {/* Si cada cortejo termina en su paso, en escritorio cada cortejo (con su
            paso al pie) es una columna independiente: sin huecos entre insignias y paso. */}
        {byCortejo
          ? <ol className={`${styles.line} ${styles.byCortejo}`}>
            {[sections.slice(0, 2), sections.slice(2, 4)].map((column) => <li key={column[0].key} className={styles.column}>
              <ol className={styles.columnLine}>{column.map(renderSection)}</ol>
            </li>)}
          </ol>
          : <ol className={styles.line}>{sections.map(renderSection)}</ol>}
      </div>
    </details>
  </div>
}
