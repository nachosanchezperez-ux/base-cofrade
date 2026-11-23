// Barra inferior de la aplicación en móvil (23/11/2026): cinco accesos siempre
// a mano. Módulo puro para poder probar qué pestaña se marca en cada ruta.

export const TAB_ITEMS = Object.freeze([
  { key: 'inicio', label: 'Inicio', href: '/' },
  {
    key: 'agenda',
    label: 'Agenda',
    href: '/agenda-cofrade',
    match: ['/agenda-cofrade', '/igualas-y-ensayos', '/extraordinarias', '/procesiones-de-gloria', '/salidas', '/calendario'],
  },
  { key: 'programa', label: '2027', href: '/semana-santa-sevilla-2027', match: ['/semana-santa-sevilla-2027', '/semana-santa/2027'] },
  { key: 'hermandades', label: 'Hermandades', href: '/hermandades', match: ['/hermandades'] },
  { key: 'buscar', label: 'Buscar', action: 'search' },
])

function startsWithPath(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export function activeTab(pathname = '') {
  const path = String(pathname || '').split(/[?#]/)[0] || '/'
  if (path === '/') return 'inicio'
  const tab = TAB_ITEMS.find((item) => item.match?.some((prefix) => startsWithPath(path, prefix)))
  return tab?.key || ''
}

// Sin barra en el Panel.
export function showTabBar(pathname = '') {
  return !String(pathname || '').startsWith('/panel')
}
