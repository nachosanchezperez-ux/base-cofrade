export const HILO_MEDIA_BUCKET = 'hilo-media'

const PUBLIC_OBJECT_PREFIX = `/storage/v1/object/public/${HILO_MEDIA_BUCKET}/`
const ABSOLUTE_SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:/i

function decodeStoragePath(path = '') {
  try {
    return decodeURIComponent(path)
  } catch {
    return path
  }
}

function publicStoragePath(candidate = '') {
  try {
    const url = new URL(candidate)
    const markerIndex = url.pathname.indexOf(PUBLIC_OBJECT_PREFIX)
    if (markerIndex >= 0) {
      return decodeStoragePath(url.pathname.slice(markerIndex + PUBLIC_OBJECT_PREFIX.length))
    }
  } catch {
    const markerIndex = candidate.indexOf(PUBLIC_OBJECT_PREFIX)
    if (markerIndex >= 0) {
      return decodeStoragePath(candidate.slice(markerIndex + PUBLIC_OBJECT_PREFIX.length).split(/[?#]/, 1)[0])
    }
  }

  return ''
}

export function normalizeHiloMediaReference(value = '') {
  const candidate = String(value ?? '').trim()
  if (!candidate) return ''

  const storagePath = publicStoragePath(candidate)
  if (storagePath) return storagePath

  const bucketPrefix = `${HILO_MEDIA_BUCKET}/`
  return candidate.startsWith(bucketPrefix)
    ? candidate.slice(bucketPrefix.length)
    : candidate
}

export function getHiloMediaStoragePath(value = '') {
  const normalized = normalizeHiloMediaReference(value)
  if (
    !normalized
    || normalized.startsWith('/')
    || normalized.startsWith('//')
    || ABSOLUTE_SCHEME_PATTERN.test(normalized)
  ) {
    return ''
  }

  return normalized
}

export function resolveHiloMediaReference(supabase, value = '') {
  const normalized = normalizeHiloMediaReference(value)
  if (!normalized) return ''

  const storagePath = getHiloMediaStoragePath(normalized)
  if (!storagePath) return normalized

  return supabase.storage.from(HILO_MEDIA_BUCKET).getPublicUrl(storagePath).data.publicUrl
}
