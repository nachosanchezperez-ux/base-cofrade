import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function MarchEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/marchas/${id}`
  const items = [
    { href: root, label: 'General', mark: 'G', match: 'exact' },
    { href: `${root}/autoria`, label: 'Autoría', mark: 'Au' },
    { href: `${root}/dedicatorias`, label: 'Dedicatorias', mark: 'D' },
    { href: `${root}/grabaciones`, label: 'Grabaciones', mark: 'Gr' },
    { href: `/panel/multimedia?entity=${id}`, label: 'Multimedia', mark: 'M', activePath: '/panel/multimedia', tool: true },
    { href: `/panel/fuentes?entity=${id}`, label: 'Fuentes', mark: 'F', activePath: '/panel/fuentes', tool: true },
  ]

  return (
    <>
      <EntityWorkspaceNav
        eyebrow="Ficha de Marcha"
        description="Ficha musical, autoría, dedicatorias, grabaciones, archivo visual y documentación."
        items={items}
      />
      {children}
    </>
  )
}
