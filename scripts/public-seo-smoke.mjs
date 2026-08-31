const BASE_URL = 'https://hilocofrade.es'

const STATIC_PATHS = [
  '/',
  '/directorio',
  '/extraordinarias',
  '/procesiones-de-gloria',
  '/igualas-y-ensayos',
  '/hermandades/el-baratillo',
  '/bandas/las-cigarreras',
]

const DYNAMIC_PREFIXES = [
  '/extraordinarias/',
  '/procesiones-de-gloria/',
  '/igualas-y-ensayos/',
]

function canonicalFor(path) {
  return `${BASE_URL}${path === '/' ? '/' : path}`
}

async function fetchHtml(path) {
  const response = await fetch(`${BASE_URL}${path}`, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Hilo-Cofrade-Production-Smoke/1.0',
      'cache-control': 'no-cache',
    },
  })

  const html = await response.text()
  if (response.status !== 200) {
    throw new Error(`${path}: HTTP ${response.status}`)
  }
  if (/Application error|Internal Server Error|This page could not be found/i.test(html)) {
    throw new Error(`${path}: contenido de error detectado`)
  }

  const expectedCanonical = canonicalFor(path)
  if (!html.includes(`rel="canonical" href="${expectedCanonical}"`)) {
    throw new Error(`${path}: canonical ausente o incorrecta (${expectedCanonical})`)
  }
  if (!html.includes('application/ld+json')) {
    throw new Error(`${path}: JSON-LD ausente`)
  }

  return html
}

async function sitemapDynamicPaths() {
  const response = await fetch(`${BASE_URL}/sitemap.xml`, {
    headers: { 'user-agent': 'Hilo-Cofrade-Production-Smoke/1.0', 'cache-control': 'no-cache' },
  })
  const xml = await response.text()
  if (response.status !== 200) throw new Error(`/sitemap.xml: HTTP ${response.status}`)

  const urls = [...xml.matchAll(/<loc>(https:\/\/hilocofrade\.es[^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname)

  const paths = []
  for (const prefix of DYNAMIC_PREFIXES) {
    const path = urls.find((candidate) => candidate.startsWith(prefix) && candidate !== prefix)
    if (!path) throw new Error(`/sitemap.xml: no se encontró una URL dinámica para ${prefix}`)
    paths.push(path)
  }
  return paths
}

const dynamicPaths = await sitemapDynamicPaths()
const paths = [...new Set([...STATIC_PATHS, ...dynamicPaths])]

for (const path of paths) {
  await fetchHtml(path)
  console.log(`✓ ${path}`)
}

console.log(`SEO smoke correcto · ${paths.length} rutas`)
