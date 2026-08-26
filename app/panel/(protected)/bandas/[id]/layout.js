import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function BandEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/bandas/${id}`
  const items = [
    { href: root, label: 'General', group: 'Ficha', match: 'exact' },
    { href: `${root}/direccion`, label: 'Dirección', group: 'Banda' },
    { href: `${root}/acompanamientos`, label: 'Acompañamientos', group: 'Banda' },
    { href: `${root}/extraordinarias`, label: 'Extraordinarias', group: 'Banda' },
    { href: `${root}/estrenos`, label: 'Estrenos', group: 'Banda' },
    { href: `${root}/patrimonio`, label: 'Patrimonio', group: 'Archivo' },
    { href: `${root}/discografia`, label: 'Discografía', group: 'Archivo' },
    { href: `${root}/canales`, label: 'Canales', group: 'Archivo' },
    { href: `${root}/multimedia`, label: 'Multimedia', group: 'Archivo' },
    { href: `/panel/fuentes?entity=${id}`, label: 'Fuentes', group: 'Archivo', activePath: '/panel/fuentes', tool: true },
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
