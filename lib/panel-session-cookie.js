// El Panel es la única parte de Hilo Cofrade con inicio de sesión (Supabase).
// Si el navegador guarda esa sesión, quien mira la ficha es del equipo y se le
// ofrece «Editar ficha». Es solo una pista visual: el Panel vuelve a comprobar
// la sesión y el perfil al abrirse, así que no da acceso a nada por sí misma.
const PANEL_SESSION_COOKIE = /(?:^|;\s*)sb-[^=;]+-auth-token(?:\.\d+)?=[^;]/

export function hasPanelSessionCookie(cookie = '') {
  return PANEL_SESSION_COOKIE.test(String(cookie || ''))
}

export function panelEditHref(entityType, id) {
  const value = String(id || '')
  if (!/^[0-9a-f-]{36}$/i.test(value)) return ''
  if (entityType === 'brotherhood') return `/panel/hermandades/${value}`
  if (entityType === 'band') return `/panel/bandas/${value}`
  return ''
}
