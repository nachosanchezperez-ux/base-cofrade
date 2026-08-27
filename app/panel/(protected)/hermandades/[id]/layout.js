import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function BrotherhoodEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/hermandades/${id}`
  const items = [
    { href: root, label: 'General', group: 'Ficha', match: 'exact' },
    { href: `${root}/portada`, label: 'Portada', group: 'Ficha' },
    { href: `${root}/historia`, label: 'Historia', group: 'Ficha' },
    { href: `${root}/titulares`, label: 'Titulares', group: 'Ficha' },
    { href: `${root}/pasos`, label: 'Pasos', group: 'Cofradía' },
    { href: `${root}/salidas`, label: 'Salidas', group: 'Cofradía' },
    { href: `${root}/cultos`, label: 'Cultos', group: 'Cofradía' },
    { href: `${root}/habito`, label: 'Hábito', group: 'Cofradía' },
    { href: `${root}/jornada`, label: 'Jornada', group: 'Cofradía' },
    { href: `${root}/patrimonio`, label: 'Patrimonio', group: 'Archivo' },
    { href: `${root}/multimedia`, label: 'Fotos y carteles', group: 'Archivo' },
    { href: `${root}/canales`, label: 'Canales', group: 'Archivo' },
    { href: `/panel/acontecimientos?entity=${id}`, label: 'Acontecimientos', group: 'Archivo', activePath: '/panel/acontecimientos' },
    { href: `/panel/fuentes?entity=${id}`, label: 'Fuentes', group: 'Archivo', activePath: '/panel/fuentes', tool: true },
  ]

  return (
    <>
      <EntityWorkspaceNav eyebrow="Ficha de Hermandad" description="Identidad, memoria, cortejo, patrimonio, agenda y documentación conectados." items={items} />
      {children}
    </>
  )
}
