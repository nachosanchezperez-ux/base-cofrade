'use client'

import { useSearchParams } from 'next/navigation'
import BandsDirectoryView from './BandsDirectoryView'

export default function BandsDirectoryFilter({ bands }) {
  const searchParams = useSearchParams()
  const type = searchParams.get('tipo') || ''
  const municipality = searchParams.get('localidad') || ''
  const visibleBands = bands.filter((band) => (
    (!type || band.typeSlug === type)
    && (!municipality || band.municipalitySlug === municipality)
  ))
  const activeFilter = type
    ? bands.find((band) => band.typeSlug === type)?.type
    : bands.find((band) => band.municipalitySlug === municipality)?.municipality

  return <BandsDirectoryView visibleBands={visibleBands} activeFilter={activeFilter} />
}
