import Link from 'next/link'
import { createContributionFormTicket, contributionReadiness } from '@/lib/contributions/security'
import { socialMetadata } from '@/lib/seo'
import ContributionForm from './ContributionForm'
import styles from './page.module.css';

const title = 'Colabora con Hilo Cofrade'
const description = 'Envía correcciones, información documentada, imágenes, PDF o sugerencias para revisión editorial.'

export const dynamic = 'force-dynamic'

export const metadata = {
  title,
  description,
  robots: {
    index: contributionReadiness().enabled,
    follow: true,
  },
  ...socialMetadata({ title, description, path: '/colabora' }),
}

const steps = [
  ['1', 'Cuéntanos', 'Elige el tipo de aportación y explica con claridad qué dato debemos corregir, ampliar o documentar.'],
  ['2', 'Documenta', 'Añade enlaces, fotografías o PDF que nos permitan comprobar la información y conocer su procedencia.'],
  ['3', 'Contrastamos', 'El equipo revisa las fuentes, la autoría y los derechos antes de aceptar cualquier cambio.'],
  ['4', 'Completamos el hilo', 'Si la aportación queda verificada, un editor la incorpora manualmente a la ficha correspondiente.'],
]

function ClosedContributionsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="shell">
          <span className={styles.eyebrow}>Archivo abierto · Próxima fase</span>
          <h1>Las aportaciones públicas aún no están abiertas</h1>
          <p>
            La infraestructura permanece cerrada mientras se completan el corte
            específico de privacidad, seguridad, Turnstile y QA.
          </p>
        </div>
      </header>

      <div className={`shell ${styles.content}`}>
        <section className={styles.pendingNotice} role="status">
          <strong>No estamos recogiendo información ni datos personales</strong>
          <span>El formulario y su endpoint siguen desactivados. No envíes documentación por esta ruta.</span>
        </section>
      </div>
    </div>
  )
}

export default function ColaboraPage() {
  const readiness = contributionReadiness()
  const isDeploymentPreview = process.env.VERCEL_ENV === 'preview'
  if (!readiness.enabled && !isDeploymentPreview) return <ClosedContributionsPage />

  const formTicket = readiness.enabled ? createContributionFormTicket() : ''

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="shell">
          <span className={styles.eyebrow}>Archivo abierto · Revisión humana</span>
          <h1>Ayúdanos a seguir tirando del hilo</h1>
          <p>
            Cada dato, fotografía o documento puede completar una historia cofrade.
            Cuéntanos qué debemos revisar y aporta las fuentes que nos ayuden a contrastarlo.
          </p>
        </div>
      </header>

      <div className={`shell ${styles.content}`}>
        <section className={styles.process} aria-labelledby="proceso-aportacion">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Cómo funciona</span>
            <h2 id="proceso-aportacion">Tu aportación, paso a paso</h2>
          </div>
          <ol>
            {steps.map(([number, label, copy]) => (
              <li key={number}>
                <span>{number}</span>
                <div><strong>{label}</strong><p>{copy}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <div className={styles.formLayout}>
          <ContributionForm
            enabled={readiness.enabled}
            formTicket={formTicket}
            turnstileSiteKey={readiness.siteKey}
          />

          <aside className={styles.aside} aria-label="Condiciones de la aportación">
            <div className={styles.asideCard}>
              <span className={styles.eyebrow}>Antes de enviar</span>
              <h2>Información comprobable</h2>
              <ul>
                <li>Describe con precisión qué dato debemos revisar.</li>
                <li>Añade enlaces oficiales, archivos públicos o bibliografía.</li>
                <li>No incluyas datos privados, sensibles ni de menores.</li>
                <li>Solo aporta fotografías propias o con permiso suficiente.</li>
              </ul>
            </div>
            <div className={styles.securityCard}>
              <strong>Protección del envío</strong>
              <p>
                Aplicamos CAPTCHA, límites antiabuso, validación estricta y una cuarentena
                privada para los archivos. No guardamos la dirección IP en claro.
              </p>
            </div>
            <p className={styles.help}>
              ¿Necesitas ejercer un derecho sobre tus datos? Consulta la{' '}
              <Link href="/privacidad">Política de privacidad</Link>.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}
