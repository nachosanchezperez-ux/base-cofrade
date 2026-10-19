import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  brotherhoodChapterProfile,
  brotherhoodChapters,
  chapterAnchor,
  chapterHeroFacts,
  foundingYearLabel,
} from '../lib/brotherhood-chapters.js';
import { BROTHERHOOD_CHAPTERS_PILOT, usesBrotherhoodChapters } from '../lib/brotherhood-chapters-rollout.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

const full = {
  titulars: 3, steps: 2, currentBands: 2, marches: 5, hasMusic: true,
  heritagePieces: 4, simpecados: 1, hasHeritage: true, hasOutings: true,
  historyEvents: 12, hasHistory: true,
};

test('Penitencia: Inicio · Cortejo · Música · Historia · Hilo', () => {
  const chapters = brotherhoodChapters({ types: ['Penitencia', 'Sacramental'], availability: full });
  assert.deepEqual(chapters.map((item) => item.label), ['Inicio', 'Cortejo', 'Música', 'Historia', 'Hilo']);
  assert.equal(chapters[1].summary, '3 titulares · 2 pasos');
  assert.equal(chapters[2].summary, '2 bandas actuales · 5 composiciones dedicadas');
  assert.equal(chapters[3].summary, '12 acontecimientos');
});

test('Gloria: Inicio · Procesión · Patrimonio · Historia · Hilo, sin apartados de Penitencia', () => {
  const chapters = brotherhoodChapters({ types: ['Gloria'], availability: { ...full, titulars: 1, steps: 1 } });
  assert.deepEqual(chapters.map((item) => item.label), ['Inicio', 'Procesión', 'Patrimonio', 'Historia', 'Hilo']);
  assert.equal(chapters[1].summary, '1 titular · 1 paso');
  assert.equal(chapters.some((item) => ['cortejo', 'musica'].includes(item.id)), false);
});

test('Una Hermandad de Penitencia con procesión de Gloria se lee como cortejo', () => {
  assert.equal(brotherhoodChapterProfile(['Gloria', 'Penitencia']), 'penitencia');
  assert.equal(brotherhoodChapterProfile(['Gloria']), 'gloria');
  assert.equal(brotherhoodChapterProfile(undefined), 'gloria');
});

test('Sin contenido documentado no hay capítulo (ni en la navegación)', () => {
  const chapters = brotherhoodChapters({ types: ['Penitencia'], availability: { titulars: 1 } });
  assert.deepEqual(chapters.map((item) => item.id), ['inicio', 'cortejo', 'hilo']);
  assert.equal(chapters[1].summary, '1 titular');
});

test('Los recuentos no muestran ceros ni inventan cifras', () => {
  const [, , music] = brotherhoodChapters({ types: ['Penitencia'], availability: { titulars: 1, hasMusic: true } });
  assert.equal(music.summary, 'Bandas y marchas');
  assert.doesNotMatch(JSON.stringify(brotherhoodChapters({ types: ['Gloria'], availability: { hasHeritage: true } })), /\b0 /);
});

test('Las anclas no chocan con las secciones existentes de la ficha', () => {
  const ids = brotherhoodChapters({ types: ['Penitencia'], availability: full }).map((item) => item.anchor);
  for (const existing of ['musica', 'patrimonio', 'historia', 'agenda', 'resumen', 'titulares', 'pasos']) {
    assert.equal(ids.includes(existing), false);
  }
  assert.equal(chapterAnchor('hilo'), 'capitulo-hilo');
});

test('Cabecera: jornada habitual antes que la edición de un año en una Gloria', () => {
  assert.deepEqual(chapterHeroFacts({
    profile: 'gloria',
    recurringGloryDay: 'Segundo domingo de noviembre',
    gloryEditionDate: '8 de noviembre de 2026',
    foundingYear: '1735',
  }), [
    { label: 'Salida', value: 'Segundo domingo de noviembre' },
    { label: 'Fundación', value: '1735' },
  ]);
  const penitence = chapterHeroFacts({ profile: 'penitencia', holyWeekValue: 'Martes Santo · 3 pasos', foundingYear: '1554', nazarenes: { label: 'Nazarenos · 2026', value: '' } });
  assert.deepEqual(penitence.map((fact) => fact.label), ['Semana Santa', 'Fundación']);
  assert.equal(JSON.stringify(chapterHeroFacts({ profile: 'gloria', foundingYear: '1735' })).includes('Nazarenos'), false);
});

test('Cohorte piloto por ID: San Benito, El Baratillo y El Amparo', () => {
  assert.equal(BROTHERHOOD_CHAPTERS_PILOT.length, 3);
  assert.equal(Object.isFrozen(BROTHERHOOD_CHAPTERS_PILOT), true);
  assert.equal(usesBrotherhoodChapters('206cf962-fd63-4fae-ad0d-9454554283d8'), true);
  assert.equal(usesBrotherhoodChapters('fc0942dd-d555-43b2-9495-399daba54903'), true);
  assert.equal(usesBrotherhoodChapters('san-benito'), false);
  assert.equal(usesBrotherhoodChapters('36b4d5c1-f7bb-4025-a09a-948e0d5d188f'), false);
});

test('La página decide por ID y conserva el laboratorio; nada depende de slugs', () => {
  const page = read('../app/hermandades/[slug]/page.js');
  const layout = read('../components/BrotherhoodChaptersLayout.js');
  assert.match(page, /usesBrotherhoodChapters\(h\.id\)/);
  assert.match(page, /!readingOverride && usesBrotherhoodChapters/);
  for (const source of [page, layout, read('../lib/brotherhood-chapters.js')]) {
    assert.doesNotMatch(source, /['"](san-benito|el-baratillo|amparo-sevilla)['"]/);
  }
});

test('Navegación indexable: anclas normales, contenido en el servidor y un solo sistema', () => {
  const nav = read('../components/BrotherhoodChapterNav.js');
  const layout = read('../components/BrotherhoodChaptersLayout.js');
  assert.match(nav, /href=\{item\.href\}/);
  assert.doesNotMatch(nav, /role="tab"|\shidden=\{/);
  assert.doesNotMatch(layout, /'use client'/);
  assert.equal((layout.match(/<BrotherhoodChapterNav/g) || []).length, 1);
  assert.doesNotMatch(layout, /EntitySectionNav/);
});

test('La actualidad sube a Inicio y el layout no la repite al final', () => {
  const page = read('../app/hermandades/[slug]/page.js');
  const routeLayout = read('../app/hermandades/[slug]/layout.js');
  assert.match(page, /selectHiloMovements\(items, \{ entityHref: canonicalPath/);
  assert.match(routeLayout, /chaptersPilot \? null : <Suspense/);
});

test('Año de fundación solo cuando el texto lo dice sin ambigüedad', () => {
  assert.equal(foundingYearLabel('18 de julio de 1554'), '1554');
  assert.equal(foundingYearLabel('Hermandad formada en 1735; primeras Reglas aprobadas el 22 de diciembre de 1736'), '1735');
  assert.equal(foundingYearLabel('1693'), '1693');
  assert.equal(foundingYearLabel('Reorganizada en 1940 sobre una corporación de 1600'), 'Reorganizada en 1940 sobre una corporación de 1600');
  assert.equal(foundingYearLabel(''), '');
});

test('Segunda tanda: titulares sin huecos, historia con ancla #historia y hilo verificable', () => {
  const titulars = read('../components/BrotherhoodChapterTitulars.js');
  const history = read('../components/BrotherhoodChapterHistory.js');
  const page = read('../app/hermandades/[slug]/page.js');
  assert.doesNotMatch(titulars, /portrait-placeholder|✦/);
  assert.match(titulars, /item\.media\?\.path \? <figure/);
  assert.match(history, /id="historia"/);
  assert.match(history, /Anunciado, aún por celebrar/);
  assert.match(page, /collapseOfficialName=\{chapters\}/);
  assert.match(page, /thread: <BrotherhoodThread nodes=\{threadNodes\}/);
});

test('El acceso a Hilo resume el recorrido real cuando existe', () => {
  const chapters = brotherhoodChapters({ types: ['Penitencia'], availability: { titulars: 1, threadLength: 6, threadEnd: 'Cristóbal López Gándara' } });
  assert.equal(chapters.at(-1).summary, '5 fichas enlazadas, hasta Cristóbal López Gándara');
  const fallback = brotherhoodChapters({ types: ['Penitencia'], availability: { titulars: 1, threadLength: 2, threadEnd: 'X' } });
  assert.equal(fallback.at(-1).summary, 'Hermandades, bandas y autores relacionados');
});

test('Modo aplicación: solo en móvil, solo con JavaScript y sin quitar contenido del HTML', () => {
  const css = read('../components/BrotherhoodChaptersLayout.module.css');
  const nav = read('../components/BrotherhoodChapterNav.js');
  const layout = read('../components/BrotherhoodChaptersLayout.js');
  // La regla que oculta capítulos exige data-app="on" (lo pone el JS) y pantalla de móvil.
  const hide = css.indexOf("[data-app='on'] > section[data-chapter]:not([data-active])");
  assert.ok(hide > 0);
  assert.ok(css.lastIndexOf('@media (max-width: 899px)', hide) > css.lastIndexOf('}\n\n@media (min-width', hide));
  assert.match(nav, /matchMedia\(APP_QUERY\)/);
  assert.match(nav, /history\.pushState\(null/);
  // Los capítulos se renderizan siempre en el servidor (sin condición de cliente).
  assert.doesNotMatch(layout, /'use client'/);
  assert.match(layout, /data-chapters-root/);
  assert.match(layout, /Sigue con/);
});

test('Cortejo en orden: Cruz de Guía y pasos con su banda, sin inventar periodos', () => {
  const procession = read('../components/BrotherhoodChapterProcession.js');
  assert.match(procession, /id="pasos"/);
  assert.match(procession, /Abre el cortejo/);
  assert.match(procession, /\^desde\\s\+\\d\{4\}\$/);
});
