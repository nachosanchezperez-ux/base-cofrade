import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default function DataWorkspaceLayout({ children }) {
  const items = [
    { label: 'Resumen', href: '/panel/datos', match: 'exact', mark: '01' },
    { label: 'Salud', href: '/panel/datos/salud', mark: '02' },
    { label: 'Referencias', href: '/panel/datos/referencias', mark: '03' },
    { label: 'Importar', href: '/panel/datos/importar', mark: '04' },
    { label: 'Advocaciones', href: '/panel/datos/advocaciones', mark: '05' },
    { label: 'Municipios', href: '/panel/datos/municipios', mark: '06' },
    { label: 'Lugares', href: '/panel/datos/lugares', mark: '07' },
  ]

  return (
    <>
      <EntityWorkspaceNav
        eyebrow="Datos y calidad"
        description="Datos maestros, importaciones, referencias pendientes y diagnóstico editorial del grafo."
        items={items}
      />
      {children}
    </>
  )
}
