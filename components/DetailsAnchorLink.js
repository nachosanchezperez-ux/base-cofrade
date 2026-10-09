'use client'

export default function DetailsAnchorLink({ targetId, children, ...props }) {
  return <a {...props} href={`#${targetId}`} onClick={() => {
    const target = document.getElementById(targetId)
    const details = target?.matches('details') ? target : target?.querySelector('details')
    if (details) details.open = true
  }}>{children}</a>
}
