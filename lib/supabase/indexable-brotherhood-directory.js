import { cache } from 'react'
import { filterIndexableBrotherhoods } from '@/lib/brotherhood-public-index'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'
import { getPublicIndexableEntityEntries } from '@/lib/supabase/public-indexability'

export const getIndexableBrotherhoodDirectory = cache(async () => {
  const brotherhoods = await getHermandadesDirectory()
  const entries = await getPublicIndexableEntityEntries({
    brotherhoods,
    bandDirectory: [],
    images: [],
    steps: [],
  })

  return filterIndexableBrotherhoods(brotherhoods, entries)
})
