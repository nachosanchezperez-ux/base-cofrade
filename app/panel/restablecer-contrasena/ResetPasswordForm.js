'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { updateRecoveredPasswordAction } from './actions'
import styles from '@/app/panel/panel.module.css'
import authStyles from '@/app/panel/login/auth.module.css'

const initialState = { error: '' }

export default function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updateRecoveredPasswordAction, initialState)

  return (
    <form action={formAction} className={styles.loginForm}>
      <label className={styles.field}>
        <span>Nueva contraseña</span>
        <input name="password" type="password" autoComplete="new-password" minLength="10" required autoFocus />
      </label>
      <label className={styles.field}>
        <span>Repite la nueva contraseña</span>
        <input name="password_confirmation" type="password" autoComplete="new-password" minLength="10" required />
      </label>
      <p className={authStyles.passwordRules}>Utiliza al menos 10 caracteres y evita reutilizar una contraseña anterior.</p>
      {state?.error ? <p className={styles.formError} role="alert">{state.error}</p> : null}
      <button className={styles.primaryButton} type="submit" disabled={pending}>
        {pending ? 'Guardando…' : 'Guardar nueva contraseña'}
      </button>
      <div className={authStyles.formFooter}>
        <Link href="/panel/login" className={authStyles.backLink}>Cancelar y volver al acceso</Link>
      </div>
    </form>
  )
}
