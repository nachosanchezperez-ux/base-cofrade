import Link from 'next/link'
import { createContributionFormTicket, contributionReadiness } from '@/lib/contributions/security'
import { socialMetadata } from '@/lib/seo'
import ActContributionForm from './ActContributionForm'
import styles from '../page.module.css'

const title = 'Envía tu acto a la Agenda Cofrade'
const description = 'Rosarios, cultos, salidas, traslados o conciertos que falten en la Agenda de Hilo Cofrade: envíalos con su cartel para revisión.'

export const dynamic = 'force-dynamic'

export const metadata = {
  title,
  description,
  // Como Colabora: solo indexable cuando los envíos estén abiertos.
  robots: { index: contributionReadiness().enabled, follow: true },
  ...socialMetadata({ title, description, path: '/colabora/acto' }),
}

export default function SendActPage() {
  const readiness = contributionReadiness()
  const isDeploymentPreview = process.env.VERCEL_ENV === 'preview'
  const open = readiness.enabled || isDeploymentPreview

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="shell">
          <span className={styles.eyebrow}>Agenda Cofrade</span>
          <h1>Envía tu acto</h1>
          <p>Si tu Hermandad celebra un culto, un rosario o una salida que no está en la Agenda, mándanoslo con su cartel. Lo revisamos y lo publicamos con todo lo relacionado.</p>
        </div>
      </header>
      <div className={`shell ${styles.content}`}>
        {open ? (
          <div className={styles.formLayout}>
            <ActContributionForm enabled={readiness.enabled} formTicket={readiness.enabled ? createContributionFormTicket() : ''} turnstileSiteKey={readiness.siteKey} />
          </div>
        ) : (
          <section className={styles.pendingNotice} role="status">
            <strong>Los envíos aún no están abiertos</strong>
            <span>Mientras tanto, puedes ver la <Link href="/agenda-cofrade">Agenda Cofrade</Link>.</span>
          </section>
        )}
      </div>
    </div>
  )
}
