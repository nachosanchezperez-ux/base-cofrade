'use server'

import { createClient } from '@/lib/supabase/server'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getRecoveryRedirectUrl() {
  let origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://hilocofrade.es'
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
    // No se traslada el resultado del proveedor al usuario para evitar enumerar cuentas.
    console.error('[Hilo Cofrade] Falló la solicitud de recuperación de contraseña', {
      code: error.code || null,
      status: error.status || null,
      message: error.message,
    })
  }

  // Respuesta deliberadamente genérica para no revelar si una dirección tiene cuenta.
  return { sent: true, error: '' }
}
