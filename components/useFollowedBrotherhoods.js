'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { trackEvent } from '@/lib/analytics/client'
import {
  followedServerSnapshot,
  followedSnapshot,
  subscribeFollowed,
  toggleFollowed,
  writeFollowed,
} from '@/lib/followed-brotherhoods'

// Lista de «Mis hermandades» compartida por todos los componentes de la página.
// En el servidor y en el primer render es una lista vacía: nada depende de ella
// para el SEO ni para el contenido indexable.
export default function useFollowedBrotherhoods() {
  const followed = useSyncExternalStore(subscribeFollowed, followedSnapshot, followedServerSnapshot)

  const toggle = useCallback((brotherhood, context = '') => {
    const before = followedSnapshot()
    const isFollowing = before.some((item) => item.slug === brotherhood?.slug)
    writeFollowed(toggleFollowed(before, brotherhood))
    trackEvent(isFollowing ? 'unfollow_brotherhood' : 'follow_brotherhood', {
      brotherhood_name: brotherhood?.name,
      municipality: brotherhood?.municipality,
      placement: context,
    })
  }, [])

  return { followed, toggle }
}
