'use client'

import { useSearchParams } from 'next/navigation'
import EntityDirectoryExplorer from '@/components/EntityDirectoryExplorer'

const KINDS = new Set(['all', 'brotherhood', 'image', 'step', 'band'])
const TERRITORIES = new Set(['todos', 'sevilla-capital', 'provincia'])

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function resolveOption(values, requested) {
  if (!requested) return 'todos'
  return values.find((value) => slugify(value) === slugify(requested)) || 'todos'
}

export default function EntityDirectoryExplorerFromUrl({ items }) {
  const searchParams = useSearchParams()
  const requestedKind = searchParams.get('tipo') || 'all'
  const kind = KINDS.has(requestedKind) ? requestedKind : 'all'
  const scopedItems = kind === 'all' ? items : items.filter((item) => item.kind === kind)
  const municipalities = [...new Set(scopedItems.map((item) => item.municipality).filter(Boolean))]
  const subtypeValues = [...new Set(scopedItems.flatMap((item) => item.subtypeValues || []).filter(Boolean))]
  const holyWeekDays = [...new Set(scopedItems.map((item) => item.holyWeekDay).filter(Boolean))]
  const gloryMonths = [...new Set(scopedItems.map((item) => item.gloryMonth).filter(Boolean))]
  const requestedTerritory = searchParams.get('territorio') || 'todos'

  const initialState = {
    query: searchParams.get('q') || '',
    kind,
    territory: TERRITORIES.has(requestedTerritory) ? requestedTerritory : 'todos',
    municipality: resolveOption(municipalities, searchParams.get('localidad')),
    subtype: kind === 'all' ? 'todos' : resolveOption(subtypeValues, searchParams.get('subtipo')),
    holyWeekDay: kind === 'all' ? 'todos' : resolveOption(holyWeekDays, searchParams.get('dia')),
    gloryMonth: kind === 'all' ? 'todos' : resolveOption(gloryMonths, searchParams.get('mes')),
    limit: searchParams.get('limite') || '',
  }
  const stateKey = searchParams.toString()

  return <EntityDirectoryExplorer key={stateKey} items={items} initialState={initialState} />
}
