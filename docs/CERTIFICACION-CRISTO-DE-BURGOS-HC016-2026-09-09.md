# Certificación editorial · Cristo de Burgos · HC-016 · 9 de septiembre de 2026

## Resultado

**CRISTO DE BURGOS → SEXTO LOTE HC-016 COMPLETADO · 110/110 + REMATE 2/2 · INDEXABLE · GRAFO PÚBLICO COMPLETO.**

Base Git y producción previa al cierre documental: `2fdc52fb0e096c36c2d1d57a3028edebc1c39195` · deployment `dpl_4ddnFzWzcBfQyeUiBa3gCzhF2hni` · `READY`.

- lote principal: `c0160006-1000-4000-8000-000000000001`;
- remate institucional: `c0160006-2000-4000-8000-000000000001`.

## Selección y alcance

El grafo se recalculó después de cerrar El Cachorro y El Carmen. Cristo de Burgos conservaba una completitud reproducible del **43 %**, una deuda nuclear abordable y un conjunto suficiente de fuentes oficiales. Se seleccionó una sola Hermandad y se mantuvo `FIRST EDITION FREEZE`: el trabajo fue exclusivamente DML editorial sobre el modelo vigente.

Quedaron fuera del alcance el escudo, fotografías sin licencia reutilizable acreditada, catálogos exhaustivos y cualquier dato actual no verificable.

## Preflight y ejecución

El lote principal quedó preparado con 110 registros:

| Familia | Filas |
|---|---:|
| Fuentes | 13 |
| Entidades | 13 |
| Perfiles | 13 |
| Relaciones | 10 |
| Cultos | 10 |
| Salidas | 5 |
| Música | 2 |
| `source_links` | 44 |
| **Total** | **110** |

- validación estructural: 110 válidas, 0 errores y 0 colisiones;
- plan efectivo: 103 insert · 6 update · 1 reuse;
- simulación transaccional completa: correcta, con `ROLLBACK` y 0 residuos;
- Apply real atómico: 110 aplicadas, 0 inválidas y 0 fallos;
- trazabilidad registrada en `bulk_imports`, `bulk_import_items` y `audit_log`.

La primera comprobación pública reveló una relación institucional `involves` ya existente pero en borrador. El lector común conserva el Vía Crucis histórico en `outings`, pero solo lo presenta en su módulo específico cuando el acontecimiento está publicado y relacionado. El remate auditado publicó esa relación y añadió su vínculo de fuente: **2/2**, 1 update, 1 insert, 0 inválidas y 0 fallos. No requirió cambiar el lector ni introducir una excepción por `slug`.

## Inventario certificado

- identidad, denominación oficial, historia, sede, web y Miércoles Santo;
- 2 titulares publicados: Santísimo Cristo de Burgos y Madre de Dios de la Palma;
- 2 Pasos publicados y relacionados con sus imágenes;
- 3 autorías o intervenciones documentadas sobre las imágenes;
- hábito nazareno;
- 10 Cultos recurrentes;
- Estación de Penitencia del **1 de abril de 2026**, con sus dos titulares participantes;
- Vía Crucis de las Cofradías de **1999**, con el Santísimo Cristo como imagen que lo presidió;
- 4 piezas o conjuntos patrimoniales;
- 3 periodos musicales publicados;
- 45 vínculos de Fuente incorporados entre el lote principal y el remate;
- 0 borradores nucleares y 0 duplicados activos de titulares, Pasos o periodos musicales.

## Cronología musical

| Paso | Formación | Periodo | Estado |
|---|---|---:|---|
| Cristo | Capilla Musical Ars Sacra | Desde 2022 · vigente en 2026 | Vigente |
| Palio | Maestro Tejera | Vigente · 2026 | Vigente |
| Cristo | Capilla Musical de Sevilla | 2017 | Histórico |

La [noticia de Arte Sacro de 2022](https://www.artesacro.org/Noticia/Ver/144483/capilla-musical-ars-sacra-acompanara-santisimo-cristo-burgos-miercoles) documenta el inicio de Ars Sacra y la ficha secundaria de la [estación de 2026](https://www.planomato.com/es/sevilla/p/estacion-penitencia-hermandad-cristo-burgos-sevilla-2026) permite comprobar su vigencia. Maestro Tejera ya estaba modelada como vigente con una fuente de 2026; el [informe oficial de 2017](https://cristodeburgos.es/informe-estacion-de-penitencia-2017/) añade continuidad documental y registra además a la Capilla Musical de Sevilla tras el Cristo en aquella edición.

## Fuentes y criterio editorial

Las fuentes principales son páginas de la propia Hermandad:

- [historia](https://cristodeburgos.es/nuestra_historia/);
- [sede canónica](https://cristodeburgos.es/sede-canonica/);
- [Santísimo Cristo de Burgos](https://cristodeburgos.es/cristo-de-burgos/);
- [Madre de Dios de la Palma](https://cristodeburgos.es/madre-de-dios-de-la-palma/);
- [Paso del Cristo](https://cristodeburgos.es/paso-de-cristo/);
- [Paso de la Virgen](https://cristodeburgos.es/paso-de-la-santisima-virgen/);
- [Cultos](https://cristodeburgos.es/cultos/);
- [Estación de Penitencia](https://cristodeburgos.es/estacion-de-penitencia/);
- [recorrido y horarios](https://cristodeburgos.es/recorrido-y-horarios/).

La presidencia del Vía Crucis de 1999 se contrastó en el [histórico institucional del Consejo de Hermandades](https://www.hermandades-de-sevilla.org/13957-2/hermandades-viacrucis-consejo/).

La ficha oficial de Madre de Dios de la Palma identifica la obra como realizada en **1884** en su encabezado y apertura; una mención interior a 1988 se trató como error material y no se propagó. Tampoco se inventaron fecha exacta para el Vía Crucis de 1999, itinerarios no legibles, fotografías, capataces ni continuidades musicales no acreditadas.

## Completitud y deuda legítima

La señal reproducible `brotherhood_completeness` pasa de **43 % a 86 %**. Quedan en falso:

- `crest`: no existe un recurso gráfico autorizado cargado;
- `music`: el medidor heredado exige una fila en `accompaniments` ligada a una Salida.

La segunda señal no representa una carencia pública: el lector actual consume `music_accompaniment_periods` y muestra correctamente las dos formaciones vigentes y el periodo histórico. No se duplicó información en una tabla heredada para elevar artificialmente el porcentaje.

## QA de datos y producción

- Supabase: lote principal `completed` 110/110 y remate `completed` 2/2; 0 fallos;
- 2 titulares, 2 Pasos, 1 hábito, 10 Cultos, 2 Salidas, 3 periodos musicales y 4 piezas patrimoniales;
- 45 `source_links` del cierre, sin vínculos malformados;
- 0 borradores en relaciones nucleares, Salidas, música o relación institucional;
- 0 duplicados activos de titulares, Pasos o periodos musicales;
- ficha pública: HTTP 200, canonical correcto e `index, follow`;
- bloques visibles comprobados: titulares, Pasos, música actual, Vía Crucis, túnica, Salidas, Cultos, patrimonio, histórico musical y Fuentes;
- módulo institucional comprobado con **Vía Crucis de las Cofradías 1999**;
- Vercel: 0 errores de ejecución para `/hermandades/cristo-de-burgos` en la ventana de comprobación;
- `npm test`: 662/662;
- `next build`: correcto con Next.js 16.3.0 y TypeScript válido;
- `git diff --check`: limpio.

## Restricciones respetadas

No se incorporaron DDL, tablas, migraciones estructurales, cambios RLS, arquitectura, producto o UX. [#492](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) permanece abierta y aislada.

## Cierre

Cristo de Burgos queda cerrada como sexto contexto editorial real de HC-016. Solo debe reabrirse ante una regresión, una fuente material nueva, un recurso visual autorizado o una solicitud editorial concreta.
