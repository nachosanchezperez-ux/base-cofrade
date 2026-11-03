'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { trackEvent } from '@/lib/analytics/client'
import {
  followedBandsServerSnapshot,
  followedBandsSnapshot,
  subscribeFollowedBands,
  toggleFollowedBand,
  writeFollowedBands,
} from '@/lib/followed-bands'

// Lista de «Mis bandas». En el servidor y en el primer render es vacía: nada
// depende de ella para el SEO ni para el contenido indexable.
export default function useFollowedBands() {
  const followed = useSyncExternalStore(subscribeFollowedBands, followedBandsSnapshot, followedBandsServerSnapshot)

  const toggle = useCallback((band, context = '') => {
    const before = followedBandsSnapshot()
    const isFollowing = before.some((item) => item.slug === band?.slug)
    writeFollowedBands(toggleFollowedBand(before, band))
    trackEvent(isFollowing ? 'unfollow_band' : 'follow_band', {
      band_name: band?.name,
      municipality: band?.municipality,
      placement: context,
    })
  }, [])

  return { followed, toggle }
}
