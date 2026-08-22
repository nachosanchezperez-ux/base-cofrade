import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default function DataWorkspaceLayout({ children }) {
  const items = [
    { label: 'Resumen', href: '/panel/datos', match: 'exact', mark: '01' },
    { label: 'Salud', href: '/panel/datos/salud', mark: '02' },
    { label: 'Referencias', href: '/panel/datos/referencias', mark: '03' },
    { label: 'Advocaciones', href: '/panel/datos/advocaciones', mark: '04' },
    { label: 'Municipios', href: '/panel/datos/municipios', mark: '05' },
    { label: 'Lugares', href: '/panel/datos/lugares', mark: '06' },
  ]

  return (
    <>
      <EntityWorkspaceNav
        eyebrow="Datos y calidad"
        description="Datos maestros, referencias pendientes y diagnóstico editorial del grafo."
        items={items}
      />
      {children}
    </>
  )
}
