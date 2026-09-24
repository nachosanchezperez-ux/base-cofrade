import { cache } from 'react'
import { filterIndexableBrotherhoods } from '@/lib/brotherhood-public-index'
import { getHermandadesDirectory } from '@/lib/supabase/public-directory-cache'
import { getPublicIndexableEntityEntries } from '@/lib/supabase/public-directory-cache'

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
