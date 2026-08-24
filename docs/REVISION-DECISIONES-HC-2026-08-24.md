# Revisión y sincronización de decisiones HC

> Acta de Dirección y Documentación. El resultado canónico de esta revisión se conserva en [`DECISIONES-HC.md`](./DECISIONES-HC.md).

- Fecha: **24 de agosto de 2026**.
- Baseline auditado: `main` en `13acdec7c07d1d974cab91b933e7d016aa19011b`.
- Estado: **revisión operativa cerrada**.
- Alcance: documentos HC versionados, estado operativo, implementación presente en `main` y cierres recientes de arquitectura, grafo y media abierta.

## Hallazgos

### 1 · La numeración no terminaba en HC-008

El repositorio ya contenía decisiones canónicas hasta **HC-013**:

- HC-005 · Históricos.
- HC-006 · Acompañamientos musicales.
- HC-008 · Organización y navegación relacional.
- HC-009 · Sistema tipográfico.
- HC-010 · Paletas cromáticas de Bandas.
- HC-011 · Tira del hilo conversacional.
- HC-012 · Sistema visual de logotipos de Bandas.
- HC-013 · Patrimonio musical relacional.

HC-001–004 y HC-007 constaban en el registro estratégico heredado, pero no disponen de un documento original independiente dentro de `docs/`. Se preservan como decisiones vigentes con formalización documental pendiente; no se inventa retrospectivamente su redacción.

### 2 · HC-009 no estaba duplicada

Los archivos:

- `HC-009-sistema-tipografico-hilo-cofrade.md`;
- `HC-009-implementacion.md`;

representan, respectivamente, la decisión y su cierre técnico. Pertenecen al mismo identificador.

### 3 · HC-008.1 estaba implementada con una cabecera obsoleta

El hardening relacional figura en el historial de `main` y conserva implementación y regresión en:

- `components/entity/RelationalThread.js`;
- `components/entity/RelationalThread.module.css`;
- `test/relational-thread-selector.test.mjs`.

Se actualiza su estado documental de **EN VALIDACIÓN** a **IMPLEMENTADA**, sin reabrir HC-008 ni consumir un ID nuevo.

### 4 · Wikimedia y media abierta exigían una decisión propia

HC-007 cubre enlaces externos y Fuentes estructuradas, pero no resuelve por sí sola:

- derechos y licencia exacta;
- autoría y titular;
- procedencia canónica;
- identidad del sujeto representado;
- portada frente a galería;
- deduplicación del recurso;
- revisión humana y publicación pública.

El contrato fusionado en la PR **#311**, documentado en [`MEDIA-ABIERTA.md`](./MEDIA-ABIERTA.md) y protegido por `20260824000215_guard_open_media_provenance`, queda registrado como:

> **HC-014 · Wikimedia Commons y media abierta con procedencia verificable → CERRADA**.

### 5 · Existían dos protocolos documentales competidores

La PR #314 proponía un segundo documento vigente. Sus reglas editoriales no duplicadas —verificación del sujeto, rol de portada/galería, reutilización canónica y revisión humana— se consolidan en `MEDIA-ABIERTA.md`.

La fuente canónica sigue siendo una sola:

`docs/MEDIA-ABIERTA.md`

## Registro resultante

| Bloque | Estado |
|---|---|
| HC-001–004 | Vigentes; documento independiente pendiente. |
| HC-005–006 | Cerradas y documentadas. |
| HC-007 | Vigente; documento independiente pendiente. |
| HC-008 | Cerrada. |
| HC-008.1 | Implementada como extensión de HC-008. |
| HC-009–010 | Cerradas. |
| HC-011 | Parcial. |
| HC-012–014 | Cerradas. |

El próximo identificador disponible es **HC-015**, pero no queda asignado ni reservado en esta revisión.

## Candidatas futuras sin numeración

- frontera Front público stateless ↔ Panel autenticado;
- importación masiva gobernada;
- Salud del grafo como cola editorial continua;
- nuevas reglas de Extraordinarias que no puedan derivarse de HC-001 y HC-004.

El protocolo responsive de directorios continúa como norma de diseño, no como decisión nueva por defecto.

## Trabajo paralelo observado

Durante esta revisión Supabase contiene dos migraciones de la secuencia activa de la Pastora:

- `20260824001013_structured_simpecados_and_musical_work_types`;
- `20260824001747_source_salve_pastora_premiere`.

Pertenecen a la PR #313 y no convierten esa rama en baseline hasta que Git, CI, preview y producción completen su ciclo. La PR #312 debe reconciliarse después de #313, según su orden operativo declarado.

## Resultado

- se crea un índice canónico único;
- se corrige la lectura real de HC-009–013;
- se cierra la obsolescencia documental de HC-008.1;
- se registra HC-014 con evidencia técnica y editorial;
- no se asignan IDs a candidatas futuras;
- se evita mantener dos protocolos Wikimedia simultáneos.

**DECISIONES HC → 🟢 SINCRONIZADAS CON LA ARQUITECTURA VIGENTE**
