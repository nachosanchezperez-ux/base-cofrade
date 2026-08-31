import Link from 'next/link'
import { createContributionFormTicket, contributionReadiness } from '@/lib/contributions/security'
import { socialMetadata } from '@/lib/seo'
import ContributionForm from './ContributionForm'
import styles from './page.module.css';

const title = 'Colabora con Hilo Cofrade'
const description = 'Envía correcciones, información documentada, fotografías o sugerencias para revisión editorial.'

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
  ['1', 'Envías', 'Explicas la aportación y añades sus fuentes.'],
  ['2', 'Revisamos', 'El contenido y los archivos quedan en una cola privada.'],
  ['3', 'Contrastamos', 'El equipo comprueba datos, derechos y procedencia.'],
  ['4', 'Documentamos', 'Solo un editor puede incorporarlo manualmente a una ficha.'],
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
  if (!readiness.enabled) return <ClosedContributionsPage />

  const formTicket = readiness.enabled ? createContributionFormTicket() : ''

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="shell">
          <span className={styles.eyebrow}>Archivo abierto · Revisión humana</span>
          <h1>Ayúdanos a documentar mejor la historia cofrade</h1>
          <p>
            Puedes corregir una ficha, proponer información nueva, aportar fotografías o
            documentos enlazados y sugerir mejoras. Nada se publica automáticamente.
          </p>
        </div>
      </header>

      <div className={`shell ${styles.content}`}>
        <section className={styles.process} aria-labelledby="proceso-aportacion">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Cómo funciona</span>
            <h2 id="proceso-aportacion">Un canal público, una revisión editorial</h2>
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
                privada para las imágenes. No guardamos la dirección IP en claro.
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
