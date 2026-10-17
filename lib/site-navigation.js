// Menú principal de Hilo Cofrade (fase 3 de la portada, 17/10/2026).
//
// Cinco grupos según lo que busca el visitante, no según el tipo de ficha.
// El orden de los grupos y de sus enlaces sigue las visitas reales de los
// últimos 30 días (Vercel Analytics, 17/09–17/10/2026): el calendario
// (Agenda, Igualás, Extraordinarias, Glorias) concentra la mayor parte.
//
// Lo usan el menú de escritorio y el menú móvil de components/HiloHeader.js.
// Cada ruta aparece una sola vez (comprobado en test/site-navigation.test.mjs).

export const MENU_GROUPS = Object.freeze([
  {
    id: 'agenda',
    label: 'Agenda',
    sections: [
      {
        links: [
          ['/agenda-cofrade', 'Toda la agenda'],
          ['/agenda-cofrade/hoy', 'Hoy'],
          ['/agenda-cofrade/manana', 'Mañana'],
          ['/agenda-cofrade/fin-de-semana', 'Fin de semana'],
          ['/igualas-y-ensayos', 'Igualás y ensayos'],
          ['/extraordinarias', 'Extraordinarias'],
          ['/procesiones-de-gloria', 'Procesiones de Gloria'],
        ],
      },
    ],
  },
  {
    id: 'hermandades',
    label: 'Hermandades',
    sections: [
      {
        links: [
          ['/hermandades', 'Todas las hermandades'],
          ['/hermandades/semana-santa', 'Semana Santa'],
          ['/hermandades/gloria', 'Hermandades de Gloria'],
          ['/hermandades/sacramentales', 'Sacramentales'],
          ['/hermandades/agrupaciones-parroquiales', 'Agrupaciones parroquiales'],
        ],
      },
    ],
  },
  {
    id: 'musica',
    label: 'Música',
    sections: [
      {
        links: [
          ['/bandas', 'Bandas'],
          ['/marchas', 'Marchas'],
          ['/semana-santa/2027/cambios-musicales', 'Cambios musicales 2027'],
          ['/crucetas-musicales', 'Crucetas musicales'],
          ['/acompanamientos-musicales', 'Estadísticas musicales'],
        ],
      },
    ],
  },
  {
    id: 'patrimonio',
    label: 'Patrimonio',
    sections: [
      {
        links: [
          ['/imagenes', 'Imágenes'],
          ['/pasos', 'Pasos'],
          ['/autores', 'Autores'],
          ['/directorio', 'Directorio completo'],
        ],
      },
      {
        // Contenido histórico, aparte de las fichas (decisión del propietario).
        title: 'Historia',
        links: [
          ['/via-crucis-sevilla', 'Vía Crucis del Consejo'],
        ],
      },
    ],
  },
  {
    id: 'actualidad',
    label: 'Actualidad',
    sections: [
      {
        links: [
          ['/el-hilo-se-mueve', 'El Hilo se mueve'],
          ['/juegos/el-hilo-escondido', 'El hilo escondido'],
        ],
      },
    ],
  },
])

export function menuLinks(groups = MENU_GROUPS) {
  return groups.flatMap((group) => group.sections.flatMap((section) => section.links))
}

function matchesPath(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

// Enlace del menú que corresponde a la página actual: el de ruta más larga
// que la contiene (/agenda-cofrade/hoy gana a /agenda-cofrade).
export function activeMenuHref(pathname = '', groups = MENU_GROUPS) {
  const path = String(pathname || '').split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  if (path === '/') return ''
  let best = ''
  for (const [href] of menuLinks(groups)) {
    if (matchesPath(path, href) && href.length > best.length) best = href
  }
  return best
}

// Grupo que se marca como actual en la cabecera.
export function activeMenuGroup(pathname = '', groups = MENU_GROUPS) {
  const href = activeMenuHref(pathname, groups)
  if (!href) return ''
  return groups.find((group) => group.sections.some((section) => section.links.some(([link]) => link === href)))?.id || ''
}
