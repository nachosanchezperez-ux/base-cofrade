import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function ImageEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/imagenes/${id}`
  const items = [
    { href: root, label: 'General', mark: 'G', match: 'exact' },
    { href: `${root}/autorias`, label: 'Autoría', mark: 'Au' },
    { href: `${root}/intervenciones`, label: 'Intervenciones', mark: 'I' },
    { href: `/panel/multimedia?entity=${id}`, label: 'Multimedia', mark: 'M', activePath: '/panel/multimedia', tool: true },
    { href: `/panel/fuentes?entity=${id}`, label: 'Fuentes', mark: 'F', activePath: '/panel/fuentes', tool: true },
    { href: '/panel/relaciones/imagen-paso', label: 'Imagen ↔ Paso', mark: '↔', activePath: '/panel/relaciones/imagen-paso', tool: true },
  ]

  return (
    <>
      <EntityWorkspaceNav
        eyebrow="Ficha de Imagen"
        description="Identidad material, autoría, intervenciones, archivo visual y relaciones."
        items={items}
      />
      {children}
    </>
  )
}
