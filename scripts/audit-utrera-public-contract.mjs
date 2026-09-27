import { readFileSync, writeFileSync } from 'node:fs'
import vm from 'node:vm'
import { buildUtreraManifest } from './build-utrera-manifest.mjs'
import { meetsPublicEditorialMinimum } from '../lib/supabase/public-entity-page.js'
import { loadPublicRowsInBatches, loadPublicRowsInPages } from '../lib/supabase/public-query-batches.js'
const folder = new URL('../docs/evidence/modelado-utrera-2026-09-27/', import.meta.url)
const read = (name) => JSON.parse(readFileSync(new URL(name, folder)))
const m = buildUtreraManifest(), local = read('manifest-local-snapshot.json'), global = read('manifest-production-snapshot.json')
const tables = { ...global, ...local, brotherhoods: global.brotherhoods }
for (const op of m.operations) {
  const rows = tables[op.table] || [], old = rows.find((r) => r[op.pk] === op.id)
  tables[op.table] = [...rows.filter((r) => r[op.pk] !== op.id), { ...old, ...op.data }]
}
const rows = (t) => tables[t] || []
const client = { from(t) { let data = rows(t); return {
  select() { return this }, eq(k,v) { data = data.filter((r)=>r[k]===v); return this },
  in(k,v) { data = data.filter((r)=>v.includes(r[k])); return this },
  order() { return this }, range(a,b) { data = data.slice(a,b+1); return this },
  then(resolve) { resolve({ data, error: null }) },
} } }
const context = vm.createContext({ createPublicClient:()=>client, console, meetsPublicEditorialMinimum,
  loadPublicRowsInBatches, loadPublicRowsInPages, process:{env:{VERCEL_ENV:'preview'}} })
for (const file of ['public-indexability.js','step-heritage.js']) {
  const code = readFileSync(new URL(`../lib/supabase/${file}`,import.meta.url),'utf8')
    .replace(/^import 'server-only'\n/gm,'').replace(/^import[\s\S]*?from '[^']+'\n/gm,'').replace(/^export /gm,'')
  vm.runInContext(code,context)
}
const published = rows('entities').filter((r)=>r.status==='published')
const entity = (id)=>published.find((r)=>r.id===id)
const profile = (t,id)=>rows(t).find((r)=>r.entity_id===id)||{}
const parent = (t,col,id)=> {
  const link=rows(t).find((r)=>r[col]===id&&r.status==='published'&&entity(r.brotherhood_entity_id))
  if(!link)return {}
  const e=entity(link.brotherhood_entity_id),p=profile('brotherhoods',e.id)
  return {brotherhoodName:p.popular_name||e.name,brotherhoodSlug:e.slug,municipality:'Utrera'}
}
const selected = m.identities.filter((r)=>['brotherhood','image','step'].includes(r.type)&&entity(r.id))
const brotherhoods=selected.filter((r)=>r.type==='brotherhood').map(({id})=>{
  const e=entity(id),p=profile('brotherhoods',id)
  return {id,slug:e.slug,nombrePopular:p.popular_name||e.name,nombreOficial:p.official_name,tipos:p.brotherhood_types,localidad:'Utrera',resumen:e.summary}
})
const images=selected.filter((r)=>r.type==='image').map(({id})=>{const e=entity(id),p=profile('images',id);return {id,slug:e.slug,name:e.name,type:p.image_type,summary:p.description||e.summary,...parent('brotherhood_images','image_entity_id',id)}})
const steps=selected.filter((r)=>r.type==='step').map(({id})=>{const e=entity(id),p=profile('steps',id);return {id,slug:e.slug,name:e.name,type:p.step_type,summary:p.description||e.summary,imageNames:rows('image_steps').filter((r)=>r.step_entity_id===id&&r.status==='published').map((r)=>entity(r.image_entity_id)?.name).filter(Boolean),...parent('brotherhood_steps','step_entity_id',id)}})
const entries=await context.getPublicIndexableEntityEntries({brotherhoods,images,steps,bandDirectory:[]})
const indexed=new Set(entries.map((r)=>r.id)), results=[]
for(const row of selected){
  let metadataReady=indexed.has(row.id)
  if(row.type==='brotherhood'){
    const h=brotherhoods.find((r)=>r.id===row.id)
    metadataReady=context.isBrotherhoodEditoriallyIndexable({...h,
      imagenes:rows('brotherhood_images').filter((r)=>r.brotherhood_entity_id===row.id&&r.status==='published'),
      pasos:rows('brotherhood_steps').filter((r)=>r.brotherhood_entity_id===row.id&&r.status==='published'),
      patrimonio:rows('heritage_assets').filter((r)=>r.parent_entity_id===row.id&&entity(r.entity_id)),
      fuentesFicha:rows('source_links').filter((r)=>r.entity_id===row.id)})
  }
  if(row.type==='step'){
    const s=steps.find((r)=>r.id===row.id),heritage=await context.getPublishedStepHeritage(row.id)
    metadataReady=context.isStepEditoriallyIndexable({paso:{nombre:s.name,tipo:s.type,descripcion:s.summary},hermandad:s.brotherhoodName?{id:s.brotherhoodSlug,localidad:s.municipality}:null,imagenes:s.imageNames},heritage)
  }
  results.push({key:row.key,id:row.id,type:row.type,published:true,sitemap:indexed.has(row.id),metadata:metadataReady,canonical:`/${{brotherhood:'hermandades',image:'imagenes',step:'pasos'}[row.type]}/${entity(row.id).slug}`})
}
const blockers=results.filter((r)=>!r.sitemap||!r.metadata)
const excluded=m.non_public_keys.map((key)=>({key,id:m.ids[key],status:rows('entities').find((r)=>r.id===m.ids[key])?.status,public_profile:false}))
if(excluded.some((r)=>r.status!=='review'||indexed.has(r.id)))throw Error('Invalid non-public decision')
const audit={kind:'STATIC_PUBLIC_CONTRACT_AUDIT_NOT_WEB_QA',main:m.meta.main,result:blockers.length?'NO_GO':'PASS',affected_candidates:blockers,excluded,counts:{corporations:brotherhoods.length,images:images.length,steps:steps.length},results,method:'Actual shared sitemap selector, editorial predicates and step source reader on candidate plus original snapshots. Territorial context projected from the canonical municipal universe; live drift checked separately. No HTTP QA claimed.'}
writeFileSync(new URL('public-contract-audit.json',folder),JSON.stringify(audit,null,2)+'\n')
console.log(JSON.stringify({result:audit.result,counts:audit.counts,blockers,excluded},null,2))
