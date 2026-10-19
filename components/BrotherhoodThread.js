import Link from 'next/link'
import styles from './BrotherhoodThread.module.css'

// «Tira del hilo»: un recorrido real por el grafo de Hilo Cofrade, eslabón a
// eslabón. Cada eslabón es un enlace a una ficha publicada; la relación que los
// une se escribe entre ellos. Los datos llegan de lib/brotherhood-thread.js.

const KIND_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  march: 'Marcha',
  author: 'Autor',
}

export default function BrotherhoodThread({ nodes = [] }) {
  if (nodes.length < 3) return null
  return <section className={`section ${styles.section}`} id="tira-del-hilo" aria-labelledby="tira-del-hilo-titulo">
    <div className="shell">
      <h2 className={styles.title} id="tira-del-hilo-titulo">Tira del hilo</h2>
      <p className={styles.intro}>Un recorrido por fichas enlazadas de Hilo Cofrade, siguiendo relaciones documentadas.</p>
      <ol className={styles.chain}>
        {nodes.map((node, index) => <li key={`${node.kind}-${node.href || index}`} className={styles.node} data-kind={node.kind}>
          {node.relation ? <span className={styles.relation}>{node.relation}</span> : null}
          <div className={styles.entry}>
            <small className={styles.kind}>{KIND_LABELS[node.kind]}</small>
            {node.current
              ? <strong className={styles.name} aria-current="page">{node.label}</strong>
              : <Link href={node.href} className={styles.name} prefetch={false}>{node.label}</Link>}
            {node.detail ? <span className={styles.detail}>{node.detail}</span> : null}
          </div>
        </li>)}
      </ol>
    </div>
  </section>
}
