import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function BrotherhoodEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/hermandades/${id}`
  const items = [
    { href: root, label: 'General', mark: 'G', match: 'exact' },
    { href: `${root}/historia`, label: 'Historia', mark: 'Hi' },
    { href: `${root}/titulares`, label: 'Titulares', mark: 'T' },
    { href: `${root}/pasos`, label: 'Pasos', mark: 'P' },
    { href: `${root}/salidas`, label: 'Salidas', mark: 'S' },
    { href: `${root}/habito`, label: 'Hábito', mark: 'Há' },
    { href: `${root}/jornada`, label: 'Jornada', mark: 'J' },
    { href: `/panel/acontecimientos?entity=${id}`, label: 'Acontecimientos', mark: 'A', activePath: '/panel/acontecimientos' },
    { href: `/panel/multimedia?entity=${id}`, label: 'Multimedia', mark: 'M', activePath: '/panel/multimedia', tool: true },
    { href: `/panel/fuentes?entity=${id}`, label: 'Fuentes', mark: 'F', activePath: '/panel/fuentes', tool: true },
  ]

  return (
    <>
      <EntityWorkspaceNav
        eyebrow="Ficha de Hermandad"
        description="Identidad, memoria, cortejo, patrimonio, agenda y documentación conectados."
        items={items}
      />
      {children}
    </>
  )
}
