import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function BandEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/bandas/${id}`
  const items = [
    { href: root, label: 'General', mark: 'G', match: 'exact' },
    { href: `${root}/multimedia`, label: 'Multimedia', mark: 'M' },
    { href: `${root}/discografia`, label: 'Discografía', mark: 'D' },
    { href: `/panel/fuentes?entity=${id}`, label: 'Fuentes', mark: 'F', activePath: '/panel/fuentes', tool: true },
  ]

  return (
    <>
      <EntityWorkspaceNav
        eyebrow="Ficha de Banda"
        description="Identidad, acompañamientos, repertorio, discografía, archivo visual y documentación."
        items={items}
      />
      {children}
    </>
  )
}
