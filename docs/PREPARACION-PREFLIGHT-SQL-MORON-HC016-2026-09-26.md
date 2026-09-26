# Preparación · PREFLIGHT SQL READ-ONLY · Morón · HC-016

**Fecha:** 26 de septiembre de 2026  
**Modo:** solo lectura · SELECT/CTE  
**Escrituras permitidas:** **0**  
**BEGIN/ROLLBACK:** no necesarios; no se ejecuta DML.  
**Base documental:** Plan ROW-BY-ROW + Manifiesto determinista del mismo corte.

## 1. Guardas

El preflight ejecutado comprueba, sin escribir:

1. namespace `c0160037-*` vacío en todas las familias objetivo y en `bulk_imports/items`;
2. slug municipal libre;
3. 73 slugs de entities, 8 de places y 10 de outings sin colisión;
4. 24 URLs canónicas de sources sin colisión;
5. 10 nombres exactos de bandas INSERT sin colisión;
6. cuatro bandas REUSE presentes, publicadas y tipadas;
7. Ars Sacra existente solo como nodo externo, sin asignación planificada a Morón 2026;
8. taxonomías `mystery`, `palio`, `cross_guide`;
9. `participation_mode=unspecified` existente;
10. `event_status=held` existente;
11. ausencia de `bulk_import` de Morón;
12. HC-AUTO-03 exactamente `ready 55/55 · 0 aplicado`.

## 2. Naturaleza de la consulta

La consulta certificada usa únicamente `WITH ... VALUES`, `SELECT`, `JOIN`, `COUNT`, `UNION ALL`, `CASE` y funciones de lectura. No contiene `INSERT`, `UPDATE`, `DELETE`, `UPSERT`, `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, RPC mutante ni llamada de Apply.

## 3. Token de éxito

La salida solo es apta si todas las guardas devuelven `ok=true` y el token global es:

`PREFLIGHT_MORON_READ_ONLY_OK`

Este preflight **no simula Apply** y por tanto certifica únicamente la puerta previa a staging.
