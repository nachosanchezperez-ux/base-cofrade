import Link from 'next/link'
import { cookies } from 'next/headers'
import ResetPasswordForm from './ResetPasswordForm'
import { createClient } from '@/lib/supabase/server'
import styles from '@/app/panel/panel.module.css'
import authStyles from '@/app/panel/login/auth.module.css'

const RECOVERY_COOKIE = 'hc-password-recovery'

export const metadata = {
  title: 'Nueva contraseña · Panel',
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

export default async function ResetPasswordPage() {
  const cookieStore = await cookies()
  let canReset = cookieStore.get(RECOVERY_COOKIE)?.value === '1'

  if (canReset) {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      canReset = false
    } else {
      const { data: profile, error: profileError } = await supabase
        .from('panel_users')
        .select('active')
        .eq('user_id', user.id)
        .maybeSingle()
      canReset = !profileError && Boolean(profile?.active)
    }
  }

  return (
    <div className={styles.loginPage}>
      <section className={styles.loginCard}>
        <div className={styles.loginBrand} aria-label="Hilo Cofrade">
          <span className={styles.brandRail} aria-hidden="true"><i /><b /></span>
          <span><strong>Hilo</strong> Cofrade</span>
        </div>
        <div className={styles.loginCopy}>
          <span className={styles.eyebrow}>Nueva contraseña</span>
          <h1>Recupera tu acceso.</h1>
          <p>Elige una contraseña nueva para tu cuenta del Panel editorial.</p>
        </div>
        {canReset ? (
          <ResetPasswordForm />
        ) : (
          <div className={styles.loginForm}>
            <p className={authStyles.statusError} role="alert">
              El enlace de recuperación no es válido, ya se ha utilizado o ha caducado.
            </p>
            <Link href="/panel/recuperar-contrasena" className={styles.primaryButton}>
              Solicitar un enlace nuevo
            </Link>
            <div className={authStyles.formFooter}>
              <Link href="/panel/login" className={authStyles.backLink}>Volver al acceso</Link>
            </div>
          </div>
        )}
        <small className={styles.loginNote}>El enlace de recuperación tiene una validez limitada por seguridad.</small>
      </section>
    </div>
  )
}
