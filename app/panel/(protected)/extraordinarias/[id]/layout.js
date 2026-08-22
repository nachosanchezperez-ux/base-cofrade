import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function ExtraordinaryEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/extraordinarias/${id}`
  const items = [
    { href: `${root}/general`, label: 'General', mark: 'G' },
    { href: `${root}/horarios`, label: 'Horarios', mark: 'H' },
    { href: `${root}/musica`, label: 'Música', mark: 'M' },
    { href: `${root}/fuentes`, label: 'Fuentes', mark: 'F' },
    { href: root, label: 'Multimedia', mark: 'Mu', match: 'exact' },
  ]

  return (
    <>
      <EntityWorkspaceNav
        eyebrow="Ficha de Extraordinaria"
        description="Datos de la salida, cronología, música, documentación y archivo visual en un único espacio editorial."
        items={items}
      />
      {children}
    </>
  )
}
