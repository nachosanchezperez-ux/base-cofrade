import 'server-only'

export const PANEL_IMAGE_MAX_BYTES = 10 * 1024 * 1024
export const PANEL_IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/avif', 'avif'],
])

function field(formData, name) {
  return String(formData.get(name) || '').trim()
}

export function imageUploadMetadata(formData, label = 'La imagen') {
  const fileName = field(formData, 'file_name').slice(0, 255)
  const fileType = field(formData, 'file_type')
  const fileSize = Number(field(formData, 'file_size'))
  const extension = PANEL_IMAGE_TYPES.get(fileType) || ''

  if (!fileName) throw new Error(`No se pudo identificar ${label.toLowerCase()} seleccionada.`)
  if (!extension) throw new Error('Formato no admitido. Usa JPG, PNG, WEBP, GIF o AVIF.')
  if (!Number.isSafeInteger(fileSize) || fileSize <= 0) throw new Error(`No se pudo comprobar el tamaño de ${label.toLowerCase()}.`)
  if (fileSize > PANEL_IMAGE_MAX_BYTES) throw new Error(`${label} no puede superar 10 MB.`)

  return { fileName, fileType, fileSize, extension }
}

export function storagePathFromPublicUrl(publicUrl = '', bucket = 'hilo-media') {
  const marker = `/storage/v1/object/public/${bucket}/`
  const index = String(publicUrl || '').indexOf(marker)
  if (index < 0) return ''

  try {
    return decodeURIComponent(String(publicUrl).slice(index + marker.length))
  } catch {
    return ''
  }
}

export async function assertStoredImageUpload(supabase, {
  storagePath,
  fileType,
  fileSize,
  bucket = 'hilo-media',
  label = 'La imagen',
}) {
  const segments = String(storagePath || '').split('/').filter(Boolean)
  const fileName = segments.pop()
  const folder = segments.join('/')
  if (!fileName || !folder) throw new Error('La ruta temporal de la imagen no es válida.')

  const result = await supabase.storage.from(bucket).list(folder, { limit: 20, search: fileName })
  if (result.error) throw new Error(`No se pudo comprobar la subida: ${result.error.message}`)

  const stored = (result.data || []).find((item) => item.name === fileName)
  if (!stored) throw new Error(`${label} no llegó correctamente al almacenamiento.`)

  const storedSize = Number(stored.metadata?.size || stored.metadata?.contentLength || 0)
  const storedType = String(stored.metadata?.mimetype || stored.metadata?.contentType || '')

  if (storedSize && storedSize !== fileSize) throw new Error(`El tamaño almacenado de ${label.toLowerCase()} no coincide con el archivo seleccionado.`)
  if (storedType && storedType !== fileType) throw new Error(`El formato almacenado de ${label.toLowerCase()} no coincide con el archivo seleccionado.`)
}
