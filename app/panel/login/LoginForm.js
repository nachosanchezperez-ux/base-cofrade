'use client'

import { useActionState } from 'react'
import { signInAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const initialState = { error: '' }

export default function LoginForm({ next = '/panel' }) {
  const [state, formAction, pending] = useActionState(signInAction, initialState)

  return (
    <form action={formAction} className={styles.loginForm}>
      <input type="hidden" name="next" value={next} />
      <label className={styles.field}>
        <span>Correo electrónico</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className={styles.field}>
        <span>Contraseña</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state?.error ? <p className={styles.formError} role="alert">{state.error}</p> : null}
      <button className={styles.primaryButton} type="submit" disabled={pending}>
        {pending ? 'Comprobando…' : 'Entrar al panel'}
      </button>
    </form>
  )
}
