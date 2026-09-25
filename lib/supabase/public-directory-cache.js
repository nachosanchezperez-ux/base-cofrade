import 'server-only'
import { unstable_cache } from 'next/cache'
import { getPublicBandsDirectory as loadPublicBandsDirectory } from '@/lib/supabase/bands-directory-public'
import { getHermandadesDirectory as loadHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'
import { getMusicalRepertoires as loadMusicalRepertoires } from '@/lib/supabase/musical-repertoires'
import { getPublicEntityDirectory as loadPublicEntityDirectory } from '@/lib/supabase/public-entity-directory'
import { getExtraordinaryDirectory as loadExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory'
import { getGloryDirectory as loadGloryDirectory } from '@/lib/supabase/glory-directory'
import { getCrewEventDirectory as loadCrewEventDirectory } from '@/lib/supabase/crew-events'
import { getConcertEventDirectory as loadConcertEventDirectory } from '@/lib/supabase/concert-events'
import { getPublicMarchDirectory as loadPublicMarchDirectory } from '@/lib/supabase/public-marches'
import { getPublicIndexableEntityEntries as loadPublicIndexableEntityEntries } from '@/lib/supabase/public-indexability'

// Cache only successful reads. Rejected loads must never become empty snapshots.
export const getPublicBandsDirectory = unstable_cache(
  (options = {}) => loadPublicBandsDirectory({ ...options, throwOnError: true }),
  ['public-directory-bands-directory-public-strict-v1'],
  { revalidate: 900 },
)

export const getHermandadesDirectory = unstable_cache(
  (options = {}) => loadHermandadesDirectory({ ...options, throwOnError: true }),
  ['public-directory-brotherhood-directory-strict-v1'],
  { revalidate: 900 },
)

export const getMusicalRepertoires = unstable_cache(
  (options = {}) => loadMusicalRepertoires({ ...options, throwOnError: true }),
  ['public-directory-musical-repertoires-strict-v1'],
  { revalidate: 900 },
)

export const getPublicEntityDirectory = unstable_cache(
  (options = {}) => loadPublicEntityDirectory({ ...options, throwOnError: true }),
  ['public-directory-public-entity-directory-strict-v1'],
  { revalidate: 900 },
)

export const getExtraordinaryDirectory = unstable_cache(
  (options = {}) => loadExtraordinaryDirectory({ ...options, throwOnError: true }),
  ['public-directory-extraordinary-directory-strict-v1'],
  { revalidate: 300 },
)

export const getGloryDirectory = unstable_cache(
  (options = {}) => loadGloryDirectory({ ...options, throwOnError: true }),
  ['public-directory-glory-directory-strict-v1'],
  { revalidate: 300, tags: ['public-glory-directory'] },
)

export const getCrewEventDirectory = unstable_cache(
  (options = {}) => loadCrewEventDirectory({ ...options, throwOnError: true }),
  ['public-directory-crew-events-strict-v1'],
  { revalidate: 300 },
)

export const getConcertEventDirectory = unstable_cache(
  (options = {}) => loadConcertEventDirectory({ ...options, throwOnError: true }),
  ['public-directory-concert-events-strict-v1'],
  { revalidate: 300 },
)

export const getPublicMarchDirectory = unstable_cache(
  (options = {}) => loadPublicMarchDirectory({ ...options, throwOnError: true }),
  ['public-directory-public-marches-strict-v1'],
  { revalidate: 900 },
)

export const getPublicIndexableEntityEntries = unstable_cache(
  (options = {}) => loadPublicIndexableEntityEntries({ ...options, throwOnError: true }),
  ['public-directory-public-indexability-strict-v1'],
  { revalidate: 900 },
)

