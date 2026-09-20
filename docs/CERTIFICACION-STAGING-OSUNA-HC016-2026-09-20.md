# Certificación de staging · Osuna · séptimo macrolote municipal HC-016

**Fecha:** 20 de septiembre de 2026  
**Resultado:** `STAGING_OSUNA_OK_COMMITTED`  
**Import:** `c0160034-0000-4000-8000-000000000001`  
**Estado:** `ready`  
**Apply autorizado:** no

## Contadores

- expected: 368;
- staged: 368;
- valid: 368;
- invalid: 0;
- applied: 0;
- failed: 0;
- posiciones: 1–368, sin huecos ni duplicados.

## Comprobación posterior

- residuos editoriales `c0160034-*` en entities: 0;
- residuos editoriales en places: 0;
- residuos editoriales en sources: 0;
- residuos editoriales en outings: 0;
- único import activo: Osuna, estado `ready`.

## Puerta

El staging conserva únicamente el manifiesto de las 368 operaciones. El payload SQL archivado termina en `ROLLBACK` y no toca las tablas de staging.

**STOP obligatorio:** no ejecutar Apply sin una autorización explícita nueva y un preflight global inmediatamente anterior.
