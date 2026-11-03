import Link from 'next/link'
import { getOutingRepertoireLinks } from '@/lib/supabase/outing-repertoires'
import styles from './OutingRepertoireLinks.module.css'

// «Escucha lo que sonó»: enlace del acto a su cruceta musical. Si la salida no
// tiene cruceta publicada, no se pinta nada.
export default async function OutingRepertoireLinks({ outingId }) {
  const links = await getOutingRepertoireLinks(outingId)
  if (!links.length) return null

  return (
    <div className={styles.links}>
      {links.map((link) => (
        <Link className={styles.link} href={link.href} key={link.href} data-hilo-event="outing_repertoire_click">
          <span aria-hidden="true">♪</span>
          <span>
            <strong>Lo que sonó</strong>
            <small>{link.bandName ? `Cruceta musical de ${link.bandName}` : 'Cruceta musical'}</small>
          </span>
          <b aria-hidden="true">→</b>
        </Link>
      ))}
    </div>
  )
}
