# Certificación editorial · El Juncal

**Fecha:** 6 de septiembre de 2026  
**PR funcional:** [#673](https://github.com/nachosanchezperez-ux/base-cofrade/pull/673)  
**Migración:** `20260907013000_cierra_el_juncal.sql`  
**Resultado:** cerrada y certificada · 100 % técnico

## Alcance certificado

- identidad completa, fundación del 11 de junio de 1968 e historia institucional;
- sede canónica unívoca en la Parroquia de Nuestra Señora del Juncal, Plaza del Sella, 8;
- tres imágenes titulares y titularidad sacramental no visual;
- autoría de Nuestra Señora del Juncal y de María Santísima de la Esperanza, Reina de los Mártires, y atribución del Cautivo diferenciadas;
- paso de Nuestra Señora del Juncal vinculado a la titular;
- cuatro piezas patrimoniales dependientes del Paso: estructura y peanas, respiraderos, candelabros y jarras con llamador;
- nueve cultos recurrentes y siete ocurrencias de 2026;
- tres series habituales: Procesión de Gloria, Vía Crucis y Procesión de Enfermos e Impedidos;
- salida de Gloria de 2026, Vía Crucis de 2026 y dos salidas extraordinarias históricas;
- Banda de Música de la Cruz Roja vinculada al Paso y a la edición anunciada del 12 de septiembre de 2026.

## Actualidad estricta

- la salida de Gloria del 12 de septiembre permanece `announced` por ser futura en el corte;
- los cultos y el Vía Crucis de 2026 permanecen `announced` cuando solo existe convocatoria;
- el Rosario de la Aurora de 1993 y la procesión extraordinaria del Cautivo de 1998 se marcan `held` por proceder de una crónica oficial retrospectiva;
- la cronología de la dolorosa conserva la horquilla 1992–1993 ante las variantes institucionales;
- no se incorporan fotografías sin procedencia o derechos trazables.

## QA

- migración DML idempotente ejecutada dos veces en una misma transacción con `ROLLBACK`;
- aplicación remota correcta y registrada como migración 79;
- completitud técnica: 100 %;
- sede actual: 1;
- titulares visuales: 3;
- pasos: 1;
- bienes patrimoniales ligados al Paso: 4;
- cultos: 9;
- ocurrencias de 2026: 7;
- series de salidas: 3;
- salidas concretas: 4;
- asignaciones musicales de 2026: 1;
- producción Vercel `READY` en `dpl_AwNpbqE6MFHPPfpwn23cEohzG6o7`;
- `/hermandades/juncal-sevilla` y `/pasos/paso-procesional-nuestra-senora-juncal`: HTTP 200;
- canonical e indexación correctas;
- 0 errores `error/fatal` en la ventana auditada.

## Límites respetados

- DDL: 0;
- tablas nuevas: 0;
- cambios RLS: 0;
- arquitectura: 0;
- UX nueva: 0;
- #492 permanece aislada.
