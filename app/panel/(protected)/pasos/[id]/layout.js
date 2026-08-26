import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function StepEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/pasos/${id}`
  const items = [
    { href: root, label: 'General', group: 'Ficha', match: 'exact' },
    { href: `${root}/responsables`, label: 'Responsables', group: 'Paso' },
    { href: `${root}/musica`, label: 'Música', group: 'Paso' },
    { href: `${root}/patrimonio`, label: 'Patrimonio', group: 'Paso' },
    { href: `/panel/multimedia?entity=${id}`, label: 'Multimedia', group: 'Archivo', activePath: '/panel/multimedia', tool: true },
    { href: `/panel/fuentes?entity=${id}`, label: 'Fuentes', group: 'Archivo', activePath: '/panel/fuentes', tool: true },
    { href: '/panel/relaciones/imagen-paso', label: 'Imagen ↔ Paso', group: 'Relaciones', activePath: '/panel/relaciones/imagen-paso', tool: true },
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
