import test from 'node:test'
import assert from 'node:assert/strict'
import { representativeHistory, nextBrotherhoodAppointment } from '../lib/brotherhood-reading.js'

test('history highlights retain origin, transformation, consolidation and present in chronological order', () => {
 const titles=['Fundación','Obra menor','Primera salida bajo palio','Compra','Incorporación de la actual imagen','Visita','Adquisición','Centenario','Obra','Actualidad']
 const items=titles.map((titulo,i)=>({titulo,fecha:1700+i,texto:''}))
 const selected=representativeHistory(items)
 assert.equal(selected.length,5)
 for(const title of ['Fundación','Primera salida bajo palio','Incorporación de la actual imagen','Centenario','Actualidad']) assert.ok(selected.some(item=>item.titulo===title))
 assert.deepEqual(selected.map(item=>item.fecha),[1700,1702,1704,1707,1709])
 assert.equal(items.length,10)
})
test('short timelines remain complete and unclassified timelines still sample five distinct events',()=>{
 const items=Array.from({length:9},(_,i)=>({titulo:`Evento ${i}`,fecha:i}))
 assert.equal(representativeHistory(items).length,5)
 assert.deepEqual(representativeHistory(items.slice(0,3)),items.slice(0,3))
})
test('next appointment merges dated outings and agenda and excludes past or cancelled items',()=>{
 const agenda=[{date:'2026-10-10',href:'/agenda/rosario',title:'Rosario'},{date:'2026-10-02',isCancelled:true},{date:'2026-09-30'}]
 const outings=[{id:'a',estado:'announced',fecha:'2026-10-03',hora:'19:30',nombre:'Procesión',slug:'gloria/procesion'},{estado:'held',fecha:'2026-10-02'},{estado:'announced',nombre:'Sin fecha'}]
 const next=nextBrotherhoodAppointment(agenda,outings,'2026-10-01')
 assert.equal(next.title,'Procesión');assert.equal(next.href,'/procesiones-de-gloria/procesion');assert.equal(next.startTime,'19:30')
 assert.equal(nextBrotherhoodAppointment([],outings,'2026-10-04'),null)
})
