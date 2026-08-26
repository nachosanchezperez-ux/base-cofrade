# Registro canónico de decisiones HC

> Índice vivo de decisiones de producto, arquitectura, datos y diseño de Hilo Cofrade. Antes de asignar un identificador nuevo deben consultarse este registro, `docs/HILO-ORQUESTADOR.md`, `docs/ESTADO-PROYECTO.md` y el estado real de GitHub, Vercel y Supabase.

- Revisión canónica: **24 de agosto de 2026**.
- Última decisión registrada: **HC-017**.
- Próximo identificador disponible: **HC-018**, todavía **no asignado ni reservado**.
- Si el registro contradice al producto real, primero se investiga y después se corrige el documento.

## Estados

- **CERRADA:** decisión aceptada, documentada e incorporada al baseline.
- **IMPLEMENTADA:** extensión técnica ejecutada que no constituye una decisión nueva.
- **PARCIAL:** dirección aceptada con evolución deliberadamente pendiente.
- **VIGENTE · DOCUMENTO ORIGINAL NO VERSIONADO:** decisión heredada conocida, sin una formulación independiente verificable dentro del repositorio.

## Registro

| ID | Decisión | Estado | Evidencia canónica |
|---|---|---|---|
| **HC-001** | Enciclopedia relacional | **VIGENTE · DOCUMENTO ORIGINAL NO VERSIONADO** | Modelo de entidades, relaciones y Fuentes. |
| **HC-002** | Identidad de Hilo Cofrade | **VIGENTE · DOCUMENTO ORIGINAL NO VERSIONADO** | Identidad aplicada al producto. |
| **HC-003** | Stack tecnológico | **VIGENTE · DOCUMENTO ORIGINAL NO VERSIONADO** | Next.js, Vercel, Supabase y GitHub. |
| **HC-004** | Datos estructurados y Fuentes | **VIGENTE · DOCUMENTO ORIGINAL NO VERSIONADO** | Modelo relacional y trazabilidad documental. |
| **HC-005** | Históricos | **CERRADA** | [`HC-005-historicos.md`](./HC-005-historicos.md). |
| **HC-006** | Acompañamientos musicales | **CERRADA** | [`HC-006-acompanamientos-musicales.md`](./HC-006-acompanamientos-musicales.md). |
| **HC-007** | Enlaces externos | **VIGENTE · DOCUMENTO ORIGINAL NO VERSIONADO** | Enlaces oficiales y Fuentes externas estructuradas. |
| **HC-008** | Organización y navegación relacional | **CERRADA** | [`HC-008-organizacion-y-navegacion-relacional.md`](./HC-008-organizacion-y-navegacion-relacional.md). |
| **HC-008.1** | Hardening de Tira del hilo | **IMPLEMENTADA** | [`HC-008-1-hardening-relacional.md`](./HC-008-1-hardening-relacional.md). |
| **HC-009** | Sistema tipográfico | **CERRADA** | [`HC-009-sistema-tipografico-hilo-cofrade.md`](./HC-009-sistema-tipografico-hilo-cofrade.md) y [`HC-009-implementacion.md`](./HC-009-implementacion.md). |
| **HC-010** | Paletas cromáticas de Bandas | **CERRADA** | [`HC-010-paletas-cromaticas-bandas.md`](./HC-010-paletas-cromaticas-bandas.md). |
| **HC-011** | Tira del hilo conversacional | **PARCIAL** | [`HC-011-tira-del-hilo-conversacional.md`](./HC-011-tira-del-hilo-conversacional.md). |
| **HC-012** | Sistema visual de logotipos de Bandas | **CERRADA** | [`HC-012-sistema-visual-logotipos-bandas.md`](./HC-012-sistema-visual-logotipos-bandas.md). |
| **HC-013** | Patrimonio musical relacional | **CERRADA** | [`HC-013-patrimonio-musical-relacional.md`](./HC-013-patrimonio-musical-relacional.md). |
| **HC-014** | Wikimedia Commons y media abierta con procedencia verificable | **CERRADA** | [`MEDIA-ABIERTA.md`](./MEDIA-ABIERTA.md) y PR #311. |
| **HC-015** | Frontera Front público ↔ Panel editorial | **CERRADA** | [`HC-015-frontera-publico-panel.md`](./HC-015-frontera-publico-panel.md). |
| **HC-016** | Importación masiva gobernada | **CERRADA** | [`HC-016-importacion-masiva-gobernada.md`](./HC-016-importacion-masiva-gobernada.md). |
| **HC-017** | Salud del grafo como cola editorial continua | **CERRADA** | [`HC-017-salud-grafo-cola-editorial.md`](./HC-017-salud-grafo-cola-editorial.md). |

## Decisiones que no se duplican

- **HC-008.1** amplía HC-008 y no consume un número.
- Los dos documentos de **HC-009** representan decisión e implementación del mismo ID.
- **HC-014** no sustituye HC-007: un enlace externo no resuelve derechos, licencia, sujeto, rol visual ni atribución.
- La autoridad editorial del Panel forma parte de **HC-015**; no necesita otra decisión.
- La organización relacional de directorios permanece en **HC-008**.
- El patrimonio musical relacional permanece en **HC-013**.
- La prioridad de logotipos se gobierna mediante **HC-012**.
- Fotografías, escudos y roles visuales se rigen por HC-014 y los contratos de media existentes, no por excepciones por entidad.

## Normas sin ID propio

### Extraordinarias

Su arquitectura actual es una aplicación de HC-001 y HC-004: acontecimientos, salidas, horarios, música, Fuentes, participantes y media estructurados. Solo necesitará una decisión propia si Dirección aprueba una regla no derivable de esas bases.

### Tarjetas y directorios

`PROTOCOLO-TARJETAS-DIRECTORIO.md` continúa como norma transversal de diseño y responsive. No todo patrón de interfaz necesita un identificador HC.

### Prioridad visual

La elección entre escudo, logotipo, fotografía, cartel, portada o galería pertenece a los contratos de entidad, media y relación editorial. No se resuelve con hardcodes por `slug`.

## Reglas de mantenimiento

1. No convertir automáticamente una PR, migración o conversación en una decisión.
2. No reutilizar un ID para una decisión distinta.
3. Toda decisión nueva debe actualizar este índice en el mismo corte.
4. Una extensión puede usar un sufijo únicamente cuando no altera la decisión base.
5. No reconstruir retrospectivamente HC-001–004 o HC-007 sin evidencia suficiente.
6. El estado no se deduce solo de una migración: deben verificarse Git, datos, despliegue y comportamiento cuando corresponda.
7. El próximo ID no se reserva hasta que exista una decisión estructural aprobada.

**DECISIONES HC → 🟢 SINCRONIZADAS CON EL PRODUCTO REAL**
