import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'
import { getPanelUser } from '@/lib/panel/auth'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Acceso al panel' }
export const dynamic = 'force-dynamic'

export default async function PanelLoginPage({ searchParams }) {
  const user = await getPanelUser()
  if (user) redirect('/panel')

  const query = await searchParams

  return (
    <div className={styles.loginPage}>
      <section className={styles.loginCard}>
        <div className={styles.loginBrand} aria-label="Hilo Cofrade">
          <span className={styles.brandRail} aria-hidden="true"><i /><b /></span>
          <span><strong>Hilo</strong> Cofrade</span>
        </div>
        <div className={styles.loginCopy}>
          <span className={styles.eyebrow}>Panel editorial</span>
          <h1>Todo está relacionado. También al editar.</h1>
          <p>Acceso privado para documentar, revisar y publicar el patrimonio cofrade.</p>
        </div>
        <LoginForm next={query?.next || '/panel'} />
        <small className={styles.loginNote}>Solo pueden entrar las cuentas autorizadas.</small>
      </section>
    </div>
  )
}
