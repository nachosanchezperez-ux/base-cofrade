// Rutas con barra invertida («/pregunta%5C», «/crucetas-musicales%5C%5C%5C»):
// las piden bots y enlaces mal copiados, y devolvían error 500.
// - Si solo sobran barras al final, redirección 308 a la ruta limpia.
// - Si la barra está en medio, 404.
const BACKSLASH = /%5c|\\/i
const TRAILING_BACKSLASHES = /(?:%5c|\\)+$/i

export function backslashPathResolution(pathname = '') {
  const path = String(pathname || '')
  if (!BACKSLASH.test(path)) return null
  const cleaned = path.replace(TRAILING_BACKSLASHES, '') || '/'
  if (cleaned !== path && !BACKSLASH.test(cleaned)) return { redirect: cleaned }
  return { notFound: true }
}
