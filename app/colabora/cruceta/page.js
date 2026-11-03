import Link from 'next/link'
import { createContributionFormTicket, contributionReadiness } from '@/lib/contributions/security'
import { socialMetadata } from '@/lib/seo'
import RepertoireContributionForm from './RepertoireContributionForm'
import styles from '../page.module.css'

const title = 'Envía una cruceta musical'
const description = 'El repertorio que una banda interpretó en una procesión: envía la lámina o el enlace y lo sumamos a las Crucetas musicales de Hilo Cofrade.'

export const dynamic = 'force-dynamic'

export const metadata = {
  title,
  description,
  // Como Colabora: solo indexable cuando los envíos estén abiertos.
  robots: { index: contributionReadiness().enabled, follow: true },
  ...socialMetadata({ title, description, path: '/colabora/cruceta' }),
}

export default function SendRepertoirePage() {
  const readiness = contributionReadiness()
  const isDeploymentPreview = process.env.VERCEL_ENV === 'preview'
  const open = readiness.enabled || isDeploymentPreview

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="shell">
          <span className={styles.eyebrow}>Crucetas musicales</span>
          <h1>Envía la cruceta</h1>
          <p>Si tu banda o tu Hermandad ha publicado las marchas que sonaron en una salida, mándanosla. La revisamos y la publicamos enlazada con la Hermandad, la banda y cada marcha.</p>
        </div>
      </header>
      <div className={`shell ${styles.content}`}>
        {open ? (
          <div className={styles.formLayout}>
            <RepertoireContributionForm enabled={readiness.enabled} formTicket={readiness.enabled ? createContributionFormTicket() : ''} turnstileSiteKey={readiness.siteKey} />
          </div>
        ) : (
          <section className={styles.pendingNotice} role="status">
            <strong>Los envíos aún no están abiertos</strong>
            <span>Mientras tanto, puedes ver las <Link href="/crucetas-musicales">Crucetas musicales</Link>.</span>
          </section>
        )}
      </div>
    </div>
  )
}
