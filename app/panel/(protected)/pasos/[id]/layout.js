import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function StepEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/pasos/${id}`
  const items = [
    { href: root, label: 'General', mark: 'G', match: 'exact' },
    { href: `/panel/multimedia?entity=${id}`, label: 'Multimedia', mark: 'M', activePath: '/panel/multimedia', tool: true },
    { href: `/panel/fuentes?entity=${id}`, label: 'Fuentes', mark: 'F', activePath: '/panel/fuentes', tool: true },
    { href: '/panel/relaciones/imagen-paso', label: 'Imagen ↔ Paso', mark: '↔', activePath: '/panel/relaciones/imagen-paso', tool: true },
  ]

  return (
    <>
      <EntityWorkspaceNav
        eyebrow="Ficha de Paso"
        description="Configuración, Imágenes, responsables, música, patrimonio y documentación."
        items={items}
      />
      {children}
    </>
  )
}
