import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function BandEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/bandas/${id}`
  const items = [
    { href: root, label: 'General', mark: 'G', match: 'exact' },
    { href: `${root}/direccion`, label: 'Dirección', mark: 'Di' },
    { href: `${root}/acompanamientos`, label: 'Acompañamientos', mark: 'Ac' },
    { href: `${root}/extraordinarias`, label: 'Extraordinarias', mark: 'Ex' },
    { href: `${root}/estrenos`, label: 'Estrenos', mark: 'Es' },
    { href: `${root}/patrimonio`, label: 'Patrimonio', mark: 'Pa' },
    { href: `${root}/discografia`, label: 'Discografía', mark: 'D' },
    { href: `${root}/canales`, label: 'Canales', mark: 'Ca' },
    { href: `${root}/multimedia`, label: 'Multimedia', mark: 'M' },
    { href: `/panel/fuentes?entity=${id}`, label: 'Fuentes', mark: 'F', activePath: '/panel/fuentes', tool: true },
  ]

  return (
    <>
      <EntityWorkspaceNav
        eyebrow="Ficha de Banda"
        description="Identidad, dirección, acompañamientos, repertorio, patrimonio, discografía y archivo visual."
        items={items}
      />
      {children}
    </>
  )
}
