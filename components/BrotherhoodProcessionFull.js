import Image from 'next/image'
import { ITEM_KINDS, markRepeatedHeritage, processionCounts, processionSections } from '@/lib/procession-order'
import { insigniaType, recognitionHint } from '@/lib/insignia-glossary'
import { plural } from '@/lib/plural'
import styles from './BrotherhoodProcessionFull.module.css'

// «Ver cortejo completo» (Tarea 15 · prototipo): una guía para quien ve pasar la
// cofradía. De arriba abajo, en el orden real: cada insignia con su número en
// su cortejo, cómo reconocerla y qué es (la primera vez que aparece ese tipo),
// y cada paso cerrando su cortejo. Solo aparece con un orden documentado; si
// no, no se pinta nada y el cortejo resumido queda igual.
// Todo va en el HTML del servidor dentro de <details>: indexable y sin JS.
// La historia de cada pieza vive en Patrimonio: aquí solo un enlace a ella.

function folded(value = '') {
  return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// La pieza se cuenta en Patrimonio; aquí solo se enlaza (sin repetir sus datos).
function HeritageLink({ heritage }) {
  if (!heritage?.href) return null
  return <p className={styles.pieceLink}><a href={heritage.href}>Ver la pieza en el patrimonio <span aria-hidden="true">›</span></a></p>
}

function Item({ item, number, explained }) {
  const photo = item.heritage?.photo
  const type = insigniaType(item.label)
  // Qué es: solo la primera vez que pasa ese tipo de insignia (no se repite en cada bandera).
  const whatIs = type && !explained.has(type.key) ? type : null
  if (whatIs) explained.add(type.key)
  const hint = item.look || recognitionHint(item.materials)
  const showKind = item.kind !== 'insignia' && item.kind !== 'cross_guide' && !folded(item.label).includes(folded(ITEM_KINDS[item.kind]))
  return <li className={`${styles.item} ${photo ? styles.withPhoto : ''}`} data-kind={item.kind}>
    {number ? <span className={styles.number} aria-hidden="true">{number}</span> : null}
    {photo ? <figure className={styles.thumb}>
      <Image src={photo.src} alt={photo.alt || item.label} fill sizes="48px" />
    </figure> : null}
    <div className={styles.copy}>
      <p className={styles.name}>{number ? <span className={styles.visuallyHidden}>{number}. </span> : null}{item.label}</p>
      {showKind ? <p className={styles.kind}>{ITEM_KINDS[item.kind]}</p> : null}
      {hint && !item.repeatOf ? <p className={styles.look}><span>Cómo reconocerla:</span> {hint.charAt(0).toLowerCase()}{hint.slice(1)}</p> : null}
      {whatIs ? <p className={styles.whatIs}><span>Qué es:</span> {whatIs.text}</p> : null}
      {item.note ? <p className={styles.note}>{item.note}</p> : null}
      <HeritageLink heritage={item.heritage} />
    </div>
  </li>
}

export default function BrotherhoodProcessionFull({ order, profile = 'penitencia', defaultOpen = false }) {
  const sections = markRepeatedHeritage(processionSections(order))
  if (!sections.length) return null
  const counts = processionCounts(order)
  const isGloria = profile === 'gloria'
  const explained = new Set()
  const summary = [
    counts.insignias ? plural(counts.insignias, 'insignia', 'insignias') : '',
    counts.tramos ? plural(counts.tramos, 'tramo', 'tramos') : '',
    counts.steps ? plural(counts.steps, 'paso', 'pasos') : '',
  ].filter(Boolean).join(' · ')
  const isProcession = order.scope !== 'listing' || order.procession
  const steps = sections.filter((section) => section.kind === 'step').length
  const byCortejo = order.scope === 'listing' && order.procession && steps === 2 && sections.length === 4
    && sections[1].kind === 'step' && sections[3].kind === 'step'

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
        {isProcession ? <p className={styles.howTo}>Las insignias pasan en este orden, de arriba abajo. Cada cortejo termina en su paso.</p> : null}
        {order.source?.name ? <p className={styles.sourceLine}>
          {order.scope === 'listing'
            ? <>{order.procession ? 'Orden procesional publicado por la Hermandad' : 'Insignias en el orden en que las publica la Hermandad'} · </>
            : <>Orden oficial {order.year ? `de ${order.year}` : ''} · </>}
          {order.source.url ? <a href={order.source.url} target="_blank" rel="noopener noreferrer">{order.source.name}</a> : order.source.name}
          {order.source.accessedAt ? <> · consultado el {order.source.accessedAt.split('-').reverse().join('/')}</> : null}
        </p> : null}
        {/* Si cada cortejo termina en su paso, en escritorio cada cortejo ocupa su columna. */}
        <ol className={`${styles.line} ${byCortejo ? styles.byCortejo : ''}`}>
          {sections.map((section) => section.kind === 'step'
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
                {section.items.length ? <small>{plural(section.items.length, 'insignia', 'insignias')}</small> : null}
              </p> : null}
              {section.items.length ? <ol className={styles.items}>{section.items.map((item, index) => <Item key={item.key || `${item.sequence}-${item.label}`} item={item} number={index + 1} explained={explained} />)}</ol> : null}
            </li>)}
        </ol>
      </div>
    </details>
  </div>
}
