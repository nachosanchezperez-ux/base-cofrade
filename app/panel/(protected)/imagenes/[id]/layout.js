import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function ImageEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/imagenes/${id}`
  const items = [
    { href: root, label: 'General', group: 'Ficha', match: 'exact' },
    { href: `${root}/autorias`, label: 'Autoría', group: 'Ficha' },
    { href: `${root}/intervenciones`, label: 'Intervenciones', group: 'Ficha' },
    { href: `/panel/multimedia?entity=${id}`, label: 'Multimedia', group: 'Archivo', activePath: '/panel/multimedia', tool: true },
    { href: `/panel/fuentes?entity=${id}`, label: 'Fuentes', group: 'Archivo', activePath: '/panel/fuentes', tool: true },
    { href: '/panel/relaciones/imagen-paso', label: 'Imagen ↔ Paso', group: 'Relaciones', activePath: '/panel/relaciones/imagen-paso', tool: true },
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
