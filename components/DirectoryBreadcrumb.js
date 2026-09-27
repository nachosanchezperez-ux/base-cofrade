import SiteBreadcrumb from './SiteBreadcrumb'

export default function DirectoryBreadcrumb({ items = [], showAccent = true }) {
  return (
    <SiteBreadcrumb
      items={items}
      tone="light"
      showAccent={showAccent}
      ariaLabel="Ruta de navegación"
    />
  )
}
