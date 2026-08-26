export const PANEL_NAV_GROUPS = [
  {
    label: 'Inicio',
    items: [
      {
        href: '/panel',
        label: 'Resumen',
        mobileLabel: 'Inicio',
        mark: '⌂',
        description: 'Estado general del trabajo editorial',
      },
      {
        href: '/panel/hoy',
        label: 'Hoy',
        mark: '24',
        description: 'Agenda y contenido del día',
      },
    ],
  },
  {
    label: 'Contenido',
    items: [
      {
        href: '/panel/hermandades',
        label: 'Hermandades',
        mark: 'H',
        description: 'Fichas, cultos, patrimonio y portada',
      },
      {
        href: '/panel/glorias',
        label: 'Glorias',
        mark: 'G',
        description: 'Hermandades y próximas Procesiones de Gloria',
      },
      {
        href: '/panel/imagenes',
        label: 'Imágenes',
        mark: 'I',
        description: 'Titulares, advocaciones y relaciones',
      },
      {
        href: '/panel/pasos',
        label: 'Pasos',
        mark: 'P',
        description: 'Pasos procesionales y patrimonio',
      },
      {
        href: '/panel/bandas',
        label: 'Bandas',
        mark: 'B',
        description: 'Formaciones y acompañamientos',
      },
      {
        href: '/panel/marchas',
        label: 'Marchas',
        mark: '♫',
        description: 'Patrimonio musical y dedicatorias',
      },
      {
        href: '/panel/extraordinarias',
        label: 'Extraordinarias',
        mark: '✦',
        description: 'Salidas y agenda extraordinaria',
      },
      {
        href: '/panel/acontecimientos',
        label: 'Acontecimientos',
        mark: 'A',
        description: 'Coronaciones, aniversarios y otros hitos',
      },
    ],
  },
  {
    label: 'Documentación',
    items: [
      {
        href: '/panel/agentes',
        label: 'Personas',
        mark: 'Pe',
        description: 'Autores, capataces y otros agentes',
      },
      {
        href: '/panel/fuentes',
        label: 'Fuentes',
        mark: 'F',
        description: 'Documentación y trazabilidad',
      },
      {
        href: '/panel/importar',
        label: 'Importar fuentes',
        mark: '↓',
        description: 'Ingesta asistida y revisión documental',
      },
      {
        href: '/panel/multimedia',
        label: 'Multimedia',
        mark: 'Mu',
        description: 'Biblioteca avanzada de recursos',
      },
      {
        href: '/panel/relaciones',
        label: 'Relaciones',
        mark: '↔',
        description: 'Conexiones entre entidades',
      },
    ],
  },
  {
    label: 'Sistema',
    items: [
      {
        href: '/panel/datos',
        label: 'Datos',
        mark: 'D',
        description: 'Control e integridad del archivo',
      },
    ],
  },
]

const DASHBOARD_GROUP_ORDER = [
  {
    label: 'Principal',
    hrefs: ['/panel/hermandades', '/panel/imagenes', '/panel/pasos', '/panel/bandas'],
  },
  {
    label: 'Contenido',
    hrefs: ['/panel/glorias', '/panel/marchas', '/panel/extraordinarias', '/panel/acontecimientos', '/panel/hoy'],
  },
  {
    label: 'Documentación',
    hrefs: ['/panel/agentes', '/panel/fuentes', '/panel/importar', '/panel/multimedia', '/panel/relaciones'],
  },
  {
    label: 'Sistema',
    hrefs: ['/panel/datos', '/panel/equipo'],
  },
]

export function getPanelNavigationGroups(role) {
  return PANEL_NAV_GROUPS.map((group) => {
    if (group.label !== 'Sistema' || role !== 'admin') return group
    return {
      ...group,
      items: [
        ...group.items,
        {
          href: '/panel/equipo',
          label: 'Equipo',
          mark: 'E',
          description: 'Usuarios y permisos editoriales',
        },
      ],
    }
  })
}

export function getPanelDashboardGroups(role) {
  const itemsByHref = new Map(
    getPanelNavigationGroups(role)
      .flatMap((group) => group.items)
      .filter((item) => item.href !== '/panel')
      .map((item) => [item.href, item]),
  )

  return DASHBOARD_GROUP_ORDER
    .map((group) => ({
      label: group.label,
      items: group.hrefs.map((href) => itemsByHref.get(href)).filter(Boolean),
    }))
    .filter((group) => group.items.length)
}
