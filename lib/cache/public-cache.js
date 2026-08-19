import 'server-only'

import { revalidateTag, unstable_cache } from 'next/cache'

export const PUBLIC_CACHE_REVALIDATE_SECONDS = 3600

export const PUBLIC_CACHE_TAGS = Object.freeze({
  ALL: 'public:all',
  AGENTS: 'public:agents',
  BANDS: 'public:bands',
  BROTHERHOODS: 'public:brotherhoods',
  HOME: 'public:home',
  IMAGES: 'public:images',
  OUTINGS: 'public:outings',
  SOURCES: 'public:sources',
  STEPS: 'public:steps',
})

function uniqueStrings(values) {
  return [...new Set(values.flat().filter(Boolean).map(String))]
}

export function publicEntityTag(entityType, identifier) {
  return `public:${entityType}:${identifier}`
}

export function getCachedPublicData({
  key,
  tags,
  loader,
  revalidate = PUBLIC_CACHE_REVALIDATE_SECONDS,
}) {
  const keyParts = uniqueStrings(['hilo-cofrade-public-v1', key])
  const cacheTags = uniqueStrings([PUBLIC_CACHE_TAGS.ALL, tags])

  return unstable_cache(loader, keyParts, {
    revalidate,
    tags: cacheTags,
  })()
}

export function revalidatePublicData(...tags) {
  for (const tag of uniqueStrings(tags)) {
    revalidateTag(tag, 'max')
  }
}
