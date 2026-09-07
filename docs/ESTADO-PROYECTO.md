# Hilo Cofrade · Estado canónico

**Corte operativo:** 7 de septiembre de 2026 · HC-016.3

**HEAD real al abrir el frente:** `main = aa736bd0cf9eb00a923c13bbf3ddeae29e56369e`

**HEAD funcional certificado:** `0691e335246fdd6604dcfe02ccaacfd557210a9e` · [#689](https://github.com/nachosanchezperez-ux/base-cofrade/pull/689) fusionada

**Producción correspondiente:** `dpl_5RbQiuhhKuKR2Jfhw2KzoHd52UvR` · `READY` · mismo SHA

**PR abiertas al corte:** **0**

**Régimen:** `FIRST EDITION FREEZE` activo

**Frente editorial de Hermandad:** ninguno

> GitHub, Vercel y Supabase prevalecen sobre cualquier dato transitorio de este documento. Una PR no forma parte del estado canónico hasta estar fusionada y verificada.

## Dónde estamos ahora

Hilo Cofrade mantiene cerrados los frentes editoriales de Hermandades abiertos hasta Pasión y Muerte. HC-016.3 está certificado e integrado sobre la arquitectura existente: el importador dispone de preflight global cerrado, dependencias deterministas y segunda barrera antes de la primera escritura. No hay frente editorial de Hermandad activo.

La secuencia vigente del importador es:

```text
CARGA → STAGING → PREFLIGHT GLOBAL → REVISIÓN → APPLY → RESULTADOS
```

Apply solo debe quedar disponible para un lote completo cuyo preflight conozca la operación efectiva de cada fila y no contenga errores deterministas, referencias sin resolver, ambigüedades ni colisiones internas. Esto no equivale a una transacción SQL atómica de todo el lote.

## Estado funcional reciente

### Hermandades cerradas después del corte documental anterior

| Hermandad | Estado canónico |
|---|---|
| La Carretería | 100 % técnico · cerrada · indexable · grafo nuclear limpio |
| La Misión de Heliópolis | 100 % técnico · cerrada · indexable · grafo nuclear limpio |
| El Juncal | 100 % técnico · cerrado · indexable · patrimonio del Paso jerarquizado |
| Los Negritos | 100 % técnico · cerrada · indexable · patrimonio de ambos Pasos jerarquizado |
| Pasión y Muerte | 100 % técnico · cerrada · indexable · cultos, salidas y música vinculados |

Los cierres documentales anteriores continúan vigentes. No se reabre una ficha cerrada por deuda legítima, mejora cosmética o búsqueda artificial del 100 %; solo por regresión real o información material verificable.

### Panel

- [#683](https://github.com/nachosanchezperez-ux/base-cofrade/pull/683): escudos de Hermandades y logos de Bandas visibles, con acceso a la ficha desde la fila.
- [#684](https://github.com/nachosanchezperez-ux/base-cofrade/pull/684) y [#685](https://github.com/nachosanchezperez-ux/base-cofrade/pull/685): contención y altura estable de marcas.
- [#688](https://github.com/nachosanchezperez-ux/base-cofrade/pull/688): caja 1:1 y `object-fit: contain`, sin deformar proporciones ni romper el fallback.

### Importador HC-016

- [#686](https://github.com/nachosanchezperez-ux/base-cofrade/pull/686) · HC-016.1: contratos de tablas, columnas inválidas, obligatorios de INSERT, referencias inexistentes o ambiguas y cálculo `INSERT`/`UPDATE` efectivo.
- [#687](https://github.com/nachosanchezperez-ux/base-cofrade/pull/687) · HC-016.2: URL canónica de Fuentes, retirada de tracking y fragmentos, query útil ordenada, equivalencia de barra final, `reuse` y resolución determinista de referencias a Fuentes.
- [#689](https://github.com/nachosanchezperez-ux/base-cofrade/pull/689) · HC-016.3: barrera global antes de Apply, planificación de referencias internas, colisiones del lote completo, independencia del orden por prioridades y resultado explícito `insert`/`update`/`reuse` por fila.

Documentación técnica: `docs/HC-016-importacion-masiva-gobernada.md`, `docs/HC-016-2-FUENTES-CANONICAS.md` y `docs/HC-016-3-CIRCUITO-SEGURO.md`.

## Estado técnico

- `main` inicial del frente: `aa736bd0cf9eb00a923c13bbf3ddeae29e56369e`;
- HEAD funcional certificado: `0691e335246fdd6604dcfe02ccaacfd557210a9e`;
- GitHub: 0 PR abiertas tras la integración funcional;
- producción Vercel: `dpl_5RbQiuhhKuKR2Jfhw2KzoHd52UvR` · `READY` · mismo SHA;
- Panel: proporciones 1:1 de marcas protegidas en Hermandades y Bandas;
- Supabase: operativa sobre el modelo vigente;
- FIRST EDITION FREEZE: activo;
- frente editorial de Hermandad: ninguno.

## Reglas operativas vigentes

- actualidad estricta: prevalece el último estado verificado;
- una ausencia no es deuda por defecto;
- no se inventan fechas, relaciones, imágenes ni estados de celebración;
- las entidades se reutilizan solo cuando representan la misma realidad;
- no se admiten excepciones por slug, Hermandad, Banda o Fuente concreta;
- cualquier DML editorial debe ser idempotente, trazable y verificable;
- no se usa producción como banco de pruebas del importador;
- una carga defectuosa debe fallar de forma cerrada antes de Apply;
- no se abre otra Hermandad mientras HC-016.3 esté activo.

## #492 · aislada

[#492](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) sigue **abierta y aislada**.

No bloquea mejoras de código, validación, preflight, resolución, pruebas o Panel sobre el modelo actual. Sí bloquea nuevo DDL, tablas, migraciones estructurales y cambios RLS hasta reconciliar Supabase Preview Branches.

HC-016.3 no reescribe migraciones históricas, no altera producción para reparar previews y no promete atomicidad SQL del lote completo. Esa limitación permanece separada en #492.

## Auditor

- el estado anterior estaba atrasado respecto a `main` y se ha reducido a una fotografía operativa, no a un changelog;
- #686, #687 y #688 ya forman parte del corte canónico;
- [#689](https://github.com/nachosanchezperez-ux/base-cofrade/pull/689) está fusionada en `0691e335246fdd6604dcfe02ccaacfd557210a9e` y su producción está `READY`;
- una propuesta concurrente fuera de secuencia (#690) se cerró sin merge y permanece aislada en su rama;
- no existe frente editorial de Hermandad activo;
- HC-016.3 queda certificado sin ampliar arquitectura, esquema ni datos editoriales.

## Siguiente movimiento autorizado

Recalcular la siguiente Hermandad desde el estado real del grafo y preparar el primer lote editorial real para HC-016. El lote deberá revisarse en staging y no se aplicará en producción únicamente como demostración técnica.
