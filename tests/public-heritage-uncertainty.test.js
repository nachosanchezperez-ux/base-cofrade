import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { isBrotherhoodEditorialHeritageType } from '../lib/brotherhood-heritage-types.js'
import { meetsPublicEditorialMinimum, publicEditorialRobots, publicText } from '../lib/supabase/public-entity-page.js'
import { loadPublicRowsInBatches, loadPublicRowsInPages } from '../lib/supabase/public-query-batches.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const narrative = 'Imagen de autoría no documentada. La bibliografía local recoge su vinculación al círculo de un escultor por afinidades estilísticas.'
for (const summary of [narrative, 'Obra de cronología no determinada, conservada en la capilla desde el siglo XIX.']) {
  test(`incertidumbre documental conserva el texto: ${summary}`, () => {
    assert.equal(publicText(summary), summary)
    assert.equal(meetsPublicEditorialMinimum({ identity: 'Imagen', type: 'Dolorosa', context: 'Municipio', summary,
      relations: ['Corporación'], sources: ['Documento'], publicValues: { summary } }), true)
  })
}
for (const summary of ['No documentada', 'Autoría: no documentada.', 'Imagen de autoría no documentada.', 'Fecha no determinada', 'Por documentar', 'Texto pendiente de revisar', 'Información sin documentar']) {
  test(`placeholder sigue excluido: ${summary}`, () => assert.equal(publicText(summary), ''))
}

async function inspect({ status = 'published', source = true, assetType = 'Simpecado', parent = 'hh', summary = 'Corporación documentada con patrimonio propio.' } = {}) {
  const h = { id: 'hh', slug: 'corporacion', nombrePopular: 'Corporación', tipos: ['Gloria'], localidad: 'Municipio', resumen: summary }
  const tables = {
    entities: [{ id: 'hh', entity_type: 'brotherhood', slug: h.slug, status: 'published' }, { id: 'asset', status }],
    brotherhoods: [{ entity_id: 'hh' }],
    heritage_assets: [{ entity_id: 'asset', parent_entity_id: parent, asset_type: assetType }],
    source_links: source ? [{ entity_id: 'asset', source_id: 'source' }] : [],
  }
  const client = { from(table) { let data = tables[table] || []; return {
    select() { return this }, eq(k,v) { data=data.filter(r=>r[k]===v); return this },
    in(k,v) { data=data.filter(r=>v.includes(r[k])); return this }, order() { return this },
    range(a,b) { data=data.slice(a,b+1); return this }, then(resolve) { resolve({ data, error: null }) },
  } } }
  const context = vm.createContext({ createPublicClient: () => client, console,
    isBrotherhoodEditorialHeritageType, meetsPublicEditorialMinimum, publicEditorialRobots,
    loadPublicRowsInBatches, loadPublicRowsInPages, process: { env: { VERCEL_ENV: 'preview' } },
    brotherhoodSeoTitle: ()=>'Corporación', brotherhoodSeoDescription: ()=>summary, pageTitle: v=>v })
  vm.runInContext(read('lib/supabase/public-indexability.js').replace(/^import 'server-only'\n/gm,'')
    .replace(/^import[\s\S]*?from '[^']+'\n/gm,'').replace(/^export /gm,''),context)
  const page=read('app/hermandades/[slug]/page.js')
  vm.runInContext(page.slice(page.indexOf('export async function generateMetadata'), page.indexOf('export default'))
    .replace('export async function','async function'),context)
  const visible = status === 'published' && parent === 'hh' && isBrotherhoodEditorialHeritageType(assetType)
  context.getHermandad = async()=>({ ...h, simpecados: visible && assetType==='Simpecado' ? ['asset'] : [],
    patrimonio: visible && assetType!=='Simpecado' ? ['asset'] : [], fuentesFicha: source && status==='published' && parent==='hh' ? ['source'] : [] })
  return {
    entries: await context.getPublicIndexableEntityEntries({ brotherhoods:[h], bandDirectory:[], images:[], steps:[] }),
    metadata: await context.generateMetadata({ params:{ slug:h.slug } }),
  }
}
for (const assetType of ['Simpecado', 'Carreta']) {
  test(`patrimonio ${assetType}: metadata y sitemap coinciden con fuente heredada`, async()=>{
    const { entries, metadata }=await inspect({ assetType })
    assert.equal(entries.length,1)
    assert.equal(metadata.robots.index,true)
    assert.equal(metadata.alternates.canonical,'/hermandades/corporacion')
  })
}
for (const options of [{status:'review'}, {source:false}, {parent:'otra'}, {assetType:'Cartel'}, {assetType:'Marcha procesional'}, {summary:'Pendiente de documentar'}]) {
  test(`patrimonio no relaja mínimos: ${JSON.stringify(options)}`,async()=>{
    const {entries,metadata}=await inspect(options)
    assert.equal(entries.length,0)
    assert.equal(metadata.robots.index,false)
  })
}
