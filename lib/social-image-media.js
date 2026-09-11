import { Buffer } from 'node:buffer';

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 5_000;
const SUPPORTED_MEDIA_TYPES = new Set(['image/jpeg', 'image/png']);

function normalizedMediaType(value) {
  const mediaType = String(value || '').split(';', 1)[0].trim().toLowerCase();
  return mediaType === 'image/jpg' ? 'image/jpeg' : mediaType;
}

function hasSupportedSignature(bytes, mediaType) {
  if (mediaType === 'image/jpeg') {
    return bytes.length >= 3
      && bytes[0] === 0xff
      && bytes[1] === 0xd8
      && bytes[2] === 0xff;
  }

  if (mediaType === 'image/png') {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return bytes.length >= signature.length
      && signature.every((value, index) => bytes[index] === value);
  }

  return false;
}

export async function resolveSocialImageSource(
  url,
  { fetchImpl = fetch, timeoutMs = FETCH_TIMEOUT_MS } = {}
) {
  if (!url) return '';

  try {
    const response = await fetchImpl(url, {
      cache: 'force-cache',
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!response.ok) return '';

    const mediaType = normalizedMediaType(response.headers.get('content-type'));
    if (!SUPPORTED_MEDIA_TYPES.has(mediaType)) return '';

    const declaredLength = Number(response.headers.get('content-length') || 0);
    if (declaredLength > MAX_IMAGE_BYTES) return '';

    const bytes = new Uint8Array(await response.arrayBuffer());
    if (
      bytes.length === 0
      || bytes.length > MAX_IMAGE_BYTES
      || !hasSupportedSignature(bytes, mediaType)
    ) {
      return '';
    }

    return `data:${mediaType};base64,${Buffer.from(bytes).toString('base64')}`;
  } catch {
    return '';
  }
}
