import test from 'node:test'
import assert from 'node:assert/strict'
import { dashboardFilters, dashboardHref, musicDashboardCsv, selectMusicDashboard } from '../lib/music-dashboard.js'
const item = (id, scope = 'capital', municipality = 'Sevilla') => ({ id, scope, municipality, brotherhoodName: `Hermandad ${id}`, day: 'Martes Santo' })
const band = (id, items, rest = {}) => ({ id, name: id, type: 'Banda de música', typeKey: 'musica', href: `/bandas/${id}`, items, pendingItems: [], capital: 999, province: 999, total: 999, ...rest })
const summary = { year: 2027, isAdvance: true, bands: [
  band('A', [item('a'), item('b', 'province', 'Dos Hermanas')]),
  band('B', [item('c', 'province', 'Écija')], { type: 'Agrupación musical', typeKey: 'agrupacion' }),
  band('C', [item('d'), item('e'), item('f')], { name: 'María Santísima de la Victoria', href: '/bandas/las-cigarreras-musica', pendingItems: [item('g', 'province', 'Utrera')] }),
  band('D', [], { pendingItems: [item('h')] }),
] }
const filters = (p = {}) => dashboardFilters({ temporada: '2027', ...p })

test('statistics use eligible item lists, never stale redundant counters', () => {
  const d = selectMusicDashboard(summary, filters())
  assert.deepEqual(d.totals, {capital:4,province:2,total:6})
  assert.equal(d.bandsCount,3); assert.equal(d.pendingTotal,2); assert.equal(d.rows.reduce((n,b)=>n+b.items.length,0),6)
})
test('mean, even/odd medians and top shares are mathematically coherent', () => {
  const d=selectMusicDashboard(summary,filters()); assert.equal(d.mean,2);assert.equal(d.median,2);assert.equal(d.topShare,100);assert.equal(d.topCount,3)
  const even=selectMusicDashboard({bands:[...summary.bands.slice(0,2)]},filters());assert.equal(even.median,1.5)
})
test('territory filter recalculates every row, statistic and pending list',()=>{
  const d=selectMusicDashboard(summary,filters({ambito:'province'}));assert.deepEqual(d.totals,{capital:0,province:2,total:2});assert.equal(d.bandsCount,2);assert.equal(d.pendingTotal,1);assert.equal(d.mean,1);assert.equal(d.provincePercent,100)
})
test('municipality exact filter never introduces another territory',()=>{
  const d=selectMusicDashboard(summary,filters({municipio:'Écija'}));assert.equal(d.bandsCount,1);assert.equal(d.totals.total,1);assert.equal(d.rows[0].id,'B')
})
test('incompatible territory and municipality produce an honest empty selection',()=>{assert.equal(selectMusicDashboard(summary,filters({municipio:'Écija',ambito:'capital'})).totals.total,0)})
test('formation filters counts and pending together',()=>{const d=selectMusicDashboard(summary,filters({tipo:'agrupacion'}));assert.equal(d.bandsCount,1);assert.equal(d.pendingTotal,0)})
test('familiar public route names are searchable without conflating exact band IDs',()=>{
  const d=selectMusicDashboard(summary,filters({q:'Las Cigarreras'}));assert.equal(d.rows[0].id,'C');assert.equal(d.pendingTotal,1)
  assert.equal(selectMusicDashboard(summary,filters({banda:'C'})).totals.total,3)
})
test('search is accent insensitive and arrays are safely parsed',()=>{assert.equal(selectMusicDashboard(summary,filters({q:'maria santisima'})).rows.length,1);assert.equal(dashboardFilters({q:['uno','dos']}).query,'uno')})
test('presence, histogram, formations and municipality counts partition the selection',()=>{
  const d=selectMusicDashboard(summary,filters());assert.deepEqual(d.presence,{capital:1,both:1,province:1});assert.equal(d.histogram.reduce((n,b)=>n+b.count,0),3);assert.equal(d.types.reduce((n,b)=>n+b.count,0),6);assert.equal(d.municipalities.reduce((n,b)=>n+b.count,0),6)
})
test('rank is volume descending with deterministic Spanish tie breaks',()=>{const d=selectMusicDashboard(summary,filters());assert.deepEqual(d.ranking.map(b=>b.id),['C','A','B']);assert.deepEqual(d.rows.map(b=>b.id),['A','B','C'])})
test('pagination changes no aggregate, clamps bounds and preserves all CSV rows',()=>{
  const s={bands:Array.from({length:23},(_,i)=>band(`B${i}`,[item(String(i))]))};const d=selectMusicDashboard(s,filters({pagina:'9999'}));assert.equal(d.page,3);assert.equal(d.pageRows.length,3);assert.equal(d.totals.total,23);assert.equal(musicDashboardCsv(d.rows,2027).split('\r\n').length,25)
})
test('numeric ordering and page size work independently of displayed names',()=>{
  const d=selectMusicDashboard(summary,filters({orden:'capital'}),2);assert.deepEqual(d.pageRows.map(b=>b.id),['C','A']);assert.equal(d.pages,2)
})
test('empty set returns no NaN, invented average or misleading 100%',()=>{const d=selectMusicDashboard(summary,filters({q:'no-existe'}));assert.equal(d.mean,null);assert.equal(d.median,null);assert.equal(d.topShare,null);assert.equal(d.capitalPercent,0);assert.equal(d.pages,1)})
test('pending-only band does not enter any statistic or export',()=>{const d=selectMusicDashboard(summary,filters({banda:'D'}));assert.equal(d.bandsCount,0);assert.equal(d.pendingTotal,1);assert.equal(musicDashboardCsv(d.rows,2027).includes('"D"'),false)})
test('serialized filters roundtrip including accents and exact band selector',()=>{const f=filters({q:'María',tipo:'musica',ambito:'province',municipio:'Écija',banda:'A',orden:'total',pagina:'2'});assert.deepEqual(dashboardFilters(new URL(dashboardHref(f),'https://example.test').searchParams),f)})
test('unknown seasons/ordering and invalid page are bounded',()=>{assert.equal(dashboardFilters({temporada:'9999',orden:'__proto__',pagina:'-8'}).year,2026);assert.equal(dashboardFilters({pagina:'-8'}).page,1);assert.equal(dashboardFilters({orden:'bad'}).order,'nombre')})
test('CSV protects formula-leading names and correctly quotes separators, quotes, accents and linebreaks',()=>{
  const csv=musicDashboardCsv([band('1',[],{name:' =HYPERLINK("x");\nÁ',type:'@prueba',capital:1,province:2,total:3})],2026);assert.equal(csv.charCodeAt(0),0xfeff);assert.ok(csv.includes('"\' =HYPERLINK(""x"");\nÁ"'));assert.ok(csv.includes('"\'@prueba"'))
})
test('input snapshot is not mutated by sorting and selecting',()=>{const before=JSON.stringify(summary);selectMusicDashboard(summary,filters({orden:'total',ambito:'capital'}));assert.equal(JSON.stringify(summary),before)})
