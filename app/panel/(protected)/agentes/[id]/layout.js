import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function AgentEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/agentes/${id}`
  const items = [
    { href: root, label: 'General', mark: 'G', match: 'exact' },
    { href: `${root}/nombres`, label: 'Nombres', mark: 'N' },
    { href: `${root}/disciplinas`, label: 'Disciplinas', mark: 'D' },
    { href: `${root}/roles`, label: 'Roles', mark: 'R' },
    { href: `${root}/obra`, label: 'Obra y relaciones', mark: 'O' },
    { href: `/panel/multimedia?entity=${id}`, label: 'Multimedia', mark: 'M', activePath: '/panel/multimedia', tool: true },
    { href: `/panel/fuentes?entity=${id}`, label: 'Fuentes', mark: 'F', activePath: '/panel/fuentes', tool: true },
  ]

  return (
    <>
      <EntityWorkspaceNav
        eyebrow="Ficha de Persona / Autor"
        description="Identidad, nombres, disciplinas, trayectoria, obra relacionada y documentación."
        items={items}
      />
      {children}
    </>
  )
}
