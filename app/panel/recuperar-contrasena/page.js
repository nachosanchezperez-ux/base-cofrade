import RecoveryForm from './RecoveryForm'
import styles from '@/app/panel/panel.module.css'

export const metadata = {
  title: 'Recuperar contraseña · Panel',
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

export default function RecoverPasswordPage() {
  return (
    <div className={styles.loginPage}>
      <section className={styles.loginCard}>
        <div className={styles.loginBrand} aria-label="Hilo Cofrade">
          <span className={styles.brandRail} aria-hidden="true"><i /><b /></span>
          <span><strong>Hilo</strong> Cofrade</span>
        </div>
        <div className={styles.loginCopy}>
          <span className={styles.eyebrow}>Recuperar acceso</span>
          <h1>Vuelve al hilo.</h1>
          <p>Indica el correo de tu cuenta del Panel y te enviaremos un enlace para establecer una contraseña nueva.</p>
        </div>
        <RecoveryForm />
        <small className={styles.loginNote}>La contraseña anterior nunca se muestra ni se recupera.</small>
      </section>
    </div>
  )
}
