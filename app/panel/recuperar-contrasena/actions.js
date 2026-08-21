'use server'

import { createClient } from '@/lib/supabase/server'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PRODUCTION_RECOVERY_URL = 'https://hilocofrade.es/panel/auth/recuperacion'

function getRecoveryRedirectUrl() {
  // La recuperación de producción siempre vuelve al dominio canónico. De este modo,
  // una variable local heredada no puede enviar enlaces reales a localhost.
  if (process.env.VERCEL_ENV === 'production') return PRODUCTION_RECOVERY_URL

  const vercelHost = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL
  let origin = vercelHost
    ? `https://${vercelHost}`
    : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

  if (!origin.startsWith('http://') && !origin.startsWith('https://')) origin = `https://${origin}`
  origin = origin.replace(/\/+$/, '')
  return `${origin}/panel/auth/recuperacion`
}

export async function requestPasswordRecoveryAction(_previousState, formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase()

  if (!EMAIL_PATTERN.test(email)) {
    return { sent: false, error: 'Introduce un correo electrónico válido.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getRecoveryRedirectUrl(),
  })

  if (error) {
    // No exponemos detalles del proveedor ni si la cuenta existe.
    console.error('[Hilo Cofrade] Falló la solicitud de recuperación de contraseña', {
      code: error.code || null,
      status: error.status || null,
      message: error.message,
    })

    return {
      sent: false,
      error: error.status === 429 || error.code === 'over_email_send_rate_limit'
        ? 'Se han solicitado varios enlaces seguidos. Espera unos minutos y vuelve a intentarlo.'
        : 'No hemos podido enviar otro enlace ahora. Espera unos minutos y vuelve a intentarlo.',
    }
  }

  // Respuesta deliberadamente genérica para no revelar si una dirección tiene cuenta.
  return { sent: true, error: '' }
}
