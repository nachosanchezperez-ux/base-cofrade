import Image from 'next/image'
import Link from 'next/link'
import BandCrestBadge from './BandCrestBadge'
import { ChurchIcon, CrownIcon, MusicIcon, UserRoundIcon } from './icons/LucideIcons'
import styles from './BrotherhoodThread.module.css'

// «Tira del hilo»: un recorrido real por el grafo de Hilo Cofrade, eslabón a
// eslabón. Cada eslabón es un enlace a una ficha publicada; la relación que los
// une se escribe entre ellos. Los datos llegan de lib/brotherhood-thread.js;
// la foto o el escudo de cada eslabón (`media`), de la ficha.

const KIND_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  march: 'Marcha',
  author: 'Autor',
}

const KIND_ICONS = {
  brotherhood: ChurchIcon,
  image: CrownIcon,
  step: ChurchIcon,
  band: MusicIcon,
  march: MusicIcon,
  author: UserRoundIcon,
}

function Avatar({ node }) {
  const media = node.media
  if (media?.type === 'band') return <BandCrestBadge logoPath={media.src} background={media.background} size={52} className={styles.avatarBand} />
  if (media?.src) {
    return <span className={`${styles.avatar} ${media.type === 'crest' ? styles.avatarCrest : styles.avatarPhoto}`} aria-hidden="true">
      <Image src={media.src} alt="" fill sizes="52px" />
    </span>
  }
  const Icon = KIND_ICONS[node.kind] || MusicIcon
  return <span className={`${styles.avatar} ${styles.avatarIcon}`} aria-hidden="true"><Icon size={22} /></span>
}

export default function BrotherhoodThread({ nodes = [] }) {
  if (nodes.length < 3) return null
  return <section className={`section ${styles.section}`} id="tira-del-hilo" aria-labelledby="tira-del-hilo-titulo">
    <div className="shell">
      <h2 className={styles.title} id="tira-del-hilo-titulo">Tira del hilo</h2>
      <p className={styles.intro}>De la Hermandad a quien compuso su música: {nodes.length} fichas unidas por relaciones documentadas.</p>
      <ol className={styles.chain}>
        {nodes.map((node, index) => <li key={`${node.kind}-${node.href || index}`} className={styles.node} data-kind={node.kind}>
          <Avatar node={node} />
          <div className={styles.entry}>
            {node.relation ? <span className={styles.relation}>{node.relation}</span> : <small className={styles.kind}>{KIND_LABELS[node.kind]}</small>}
            {node.relation ? <small className={styles.srOnly}>{KIND_LABELS[node.kind]}</small> : null}
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
