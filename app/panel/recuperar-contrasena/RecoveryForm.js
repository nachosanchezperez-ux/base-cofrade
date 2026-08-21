'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { requestPasswordRecoveryAction } from './actions'
import styles from '@/app/panel/panel.module.css'
import authStyles from '@/app/panel/login/auth.module.css'

const initialState = { sent: false, error: '' }

export default function RecoveryForm() {
  const [state, formAction, pending] = useActionState(requestPasswordRecoveryAction, initialState)

  if (state?.sent) {
    return (
      <div className={styles.loginForm}>
        <p className={authStyles.statusSuccess} role="status">
          Si existe una cuenta autorizada con ese correo, recibirás un enlace para elegir una nueva contraseña. Revisa también la carpeta de spam.
        </p>
        <p className={authStyles.formHint}>
          El enlace caduca y solo debe utilizarlo la persona que ha solicitado la recuperación.
        </p>
        <div className={authStyles.formFooter}>
          <Link href="/panel/login" className={authStyles.backLink}>Volver al acceso</Link>
        </div>
      </div>
    )
  }

  return (
    <form action={formAction} className={styles.loginForm}>
      <label className={styles.field}>
        <span>Correo electrónico</span>
        <input name="email" type="email" autoComplete="email" required autoFocus />
      </label>
      <p className={authStyles.formHint}>
        Te enviaremos un enlace seguro para establecer una contraseña nueva.
      </p>
      {state?.error ? <p className={styles.formError} role="alert">{state.error}</p> : null}
      <button className={styles.primaryButton} type="submit" disabled={pending}>
        {pending ? 'Enviando…' : 'Enviar enlace de recuperación'}
      </button>
      <div className={authStyles.formFooter}>
        <Link href="/panel/login" className={authStyles.backLink}>Volver al acceso</Link>
      </div>
    </form>
  )
}
