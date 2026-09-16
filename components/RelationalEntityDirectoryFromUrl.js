'use client'

import { useSearchParams } from 'next/navigation'
import RelationalEntityDirectory from '@/components/RelationalEntityDirectory'

export default function RelationalEntityDirectoryFromUrl({ items, kind }) {
  const searchParams = useSearchParams()
  const initialTypeSlug = searchParams.get('tipo') || ''
  const initialMunicipalitySlug = searchParams.get('localidad') || ''
  const stateKey = `${initialTypeSlug}:${initialMunicipalitySlug}`

  return (
    <RelationalEntityDirectory
      key={stateKey}
      items={items}
      kind={kind}
      initialTypeSlug={initialTypeSlug}
      initialMunicipalitySlug={initialMunicipalitySlug}
    />
  )
}
