import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default async function ExtraordinaryEditorLayout({ children, params }) {
  const { id } = await params
  const root = `/panel/extraordinarias/${id}`
  const items = [
    { href: `${root}/general`, label: 'General', group: 'Ficha' },
    { href: `${root}/horarios`, label: 'Horarios', group: 'Salida' },
    { href: `${root}/musica`, label: 'Música', group: 'Salida' },
    { href: `${root}/fuentes`, label: 'Fuentes', group: 'Archivo' },
    { href: root, label: 'Multimedia', group: 'Archivo', match: 'exact' },
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
