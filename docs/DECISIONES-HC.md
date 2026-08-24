# Registro canónico de decisiones HC

> Índice vivo de las decisiones de producto, arquitectura, datos y diseño de Hilo Cofrade. Antes de asignar un identificador nuevo deben consultarse este registro, `docs/HILO-ORQUESTADOR.md`, `docs/ESTADO-PROYECTO.md` y el estado real de GitHub, Vercel y Supabase.

- Revisión canónica: **24 de agosto de 2026**.
- Última decisión registrada: **HC-014**.
- Próximo identificador disponible: **HC-015**, todavía **no asignado ni reservado**.
- Regla de prevalencia: si este índice contradice el código, las migraciones aplicadas o las herramientas, primero se investiga y después se corrige el registro; nunca se fuerza la realidad para mantener un documento antiguo.

## Estados

- **CERRADA:** decisión aceptada, documentada e incorporada al baseline.
- **IMPLEMENTADA:** extensión técnica ejecutada y protegida, sin constituir una decisión nueva.
- **PARCIAL:** intención aceptada con una implementación deliberadamente incompleta o evolutiva.
- **VIGENTE · DOCUMENTO PENDIENTE:** decisión heredada que consta en el registro estratégico, pero cuyo documento original independiente no está versionado en el repositorio.

## Registro

| ID | Decisión | Estado | Evidencia canónica |
|---|---|---|---|
| **HC-001** | Enciclopedia relacional | **VIGENTE · DOCUMENTO PENDIENTE** | Principio consolidado en el modelo de entidades, relaciones y Fuentes; referencia heredada en `ESTADO-PROYECTO`. |
| **HC-002** | Identidad de Hilo Cofrade | **VIGENTE · DOCUMENTO PENDIENTE** | Identidad aplicada al producto; la formulación original independiente no está versionada. |
| **HC-003** | Stack tecnológico | **VIGENTE · DOCUMENTO PENDIENTE** | Next.js, Vercel, Supabase y GitHub constituyen el stack real; la formulación original independiente no está versionada. |
| **HC-004** | Datos estructurados y Fuentes | **VIGENTE · DOCUMENTO PENDIENTE** | El modelo relacional y la trazabilidad documental son el contrato vigente; la formulación original independiente no está versionada. |
| **HC-005** | Históricos | **CERRADA** | [`HC-005-historicos.md`](./HC-005-historicos.md). |
| **HC-006** | Acompañamientos musicales | **CERRADA** | [`HC-006-acompanamientos-musicales.md`](./HC-006-acompanamientos-musicales.md). |
| **HC-007** | Enlaces externos | **VIGENTE · DOCUMENTO PENDIENTE** | Enlaces oficiales y Fuentes externas permanecen estructurados; la formulación original independiente no está versionada. |
| **HC-008** | Organización y navegación relacional | **CERRADA** | [`HC-008-organizacion-y-navegacion-relacional.md`](./HC-008-organizacion-y-navegacion-relacional.md), ampliada sin nuevo ID por [`HC-008-1-hardening-relacional.md`](./HC-008-1-hardening-relacional.md). |
| **HC-009** | Sistema tipográfico de Hilo Cofrade | **CERRADA** | Decisión: [`HC-009-sistema-tipografico-hilo-cofrade.md`](./HC-009-sistema-tipografico-hilo-cofrade.md). Cierre técnico: [`HC-009-implementacion.md`](./HC-009-implementacion.md). Ambos documentos pertenecen al mismo ID. |
| **HC-010** | Paletas cromáticas de Bandas | **CERRADA** | [`HC-010-paletas-cromaticas-bandas.md`](./HC-010-paletas-cromaticas-bandas.md). |
| **HC-011** | Tira del hilo conversacional | **PARCIAL** | [`HC-011-tira-del-hilo-conversacional.md`](./HC-011-tira-del-hilo-conversacional.md). La experiencia guiada está implantada; el agente conversacional completo sigue siendo evolución futura. |
| **HC-012** | Sistema visual de logotipos de Bandas | **CERRADA** | [`HC-012-sistema-visual-logotipos-bandas.md`](./HC-012-sistema-visual-logotipos-bandas.md). |
| **HC-013** | Patrimonio musical relacional | **CERRADA** | [`HC-013-patrimonio-musical-relacional.md`](./HC-013-patrimonio-musical-relacional.md). |
| **HC-014** | Wikimedia Commons y media abierta con procedencia verificable | **CERRADA** | [`MEDIA-ABIERTA.md`](./MEDIA-ABIERTA.md), PR **#311** y migración `20260824000215_guard_open_media_provenance`. |

## Aclaraciones de numeración

### HC-008.1 no es una decisión independiente

`HC-008.1` endurece la selección, expansión, deduplicación y telemetría de la navegación relacional. Mantiene HC-008 cerrada y no consume un nuevo identificador.

### HC-009 no está duplicada

El repositorio conserva un documento de decisión y otro de implementación. Los dos forman parte de HC-009 y deben leerse conjuntamente.

### HC-014 no sustituye HC-007

HC-007 gobierna enlaces externos estructurados. HC-014 añade una regla distinta y no derivable solo del enlace: derechos, licencia, autoría, procedencia, identidad del sujeto, rol editorial y publicación de recursos externos. Por ello queda registrada como decisión propia.

## Temas sin identificador asignado

Los siguientes asuntos pueden requerir una decisión futura, pero **no tienen ID reservado**:

- frontera permanente entre Front público stateless y Panel autenticado;
- importación masiva gobernada y revisión humana;
- Salud del grafo como cola editorial continua;
- cualquier nueva regla de producto para Extraordinarias que no pueda derivarse de HC-001 y HC-004.

El protocolo responsive de directorios se mantiene como norma de diseño mientras no introduzca una regla arquitectónica nueva.

## Reglas de mantenimiento

1. No convertir automáticamente una PR, migración o conversación en una decisión HC.
2. No reutilizar un ID existente para una decisión distinta.
3. Toda decisión nueva debe incorporar en el mismo corte:
   - documento canónico;
   - estado y fecha;
   - relación con decisiones anteriores;
   - evidencias de implementación cuando existan;
   - actualización de este índice.
4. Una implementación parcial o una extensión puede usar un sufijo —por ejemplo, `HC-008.1`— únicamente cuando no modifica la decisión base.
5. Las decisiones heredadas HC-001–004 y HC-007 no deben recibir una formulación retrospectiva inventada. Su documentación original podrá reconstruirse solo con evidencia suficiente y quedará marcada como tal.
6. El estado de una decisión no se deduce de que una migración esté aplicada: también deben verificarse Git, CI, despliegue, datos y comportamiento público cuando corresponda.

**REGISTRO DE DECISIONES HC → 🟢 SINCRONIZADO HASTA HC-014**
