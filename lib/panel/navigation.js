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
  return getPanelNavigationGroups(role)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.href !== '/panel'),
    }))
    .filter((group) => group.items.length)
}
