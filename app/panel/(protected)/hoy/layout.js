import EntityWorkspaceNav from '@/components/panel/EntityWorkspaceNav'

export default function HomeEditorialLayout({ children }) {
  const root = '/panel/hoy'
  const items = [
    { href: root, label: 'Resumen', mark: 'R', match: 'exact' },
    { href: `${root}/programacion`, label: 'Programación', mark: 'P' },
    { href: `${root}/banco`, label: 'Banco editorial', mark: 'B' },
  ]

  return (
    <>
      <EntityWorkspaceNav
        eyebrow="Portada editorial"
        description="Qué muestra la Home, qué se selecciona automáticamente y qué se fuerza manualmente."
        items={items}
      />
      {children}
    </>
  )
}
