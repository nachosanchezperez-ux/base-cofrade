# Registro canónico de decisiones HC

> Índice versionado de decisiones de producto, datos, diseño y arquitectura de Hilo Cofrade. Los documentos enlazados son la fuente de verdad de cada decisión; este archivo evita duplicidades de numeración y permite saber qué está vigente, implementado o todavía en evolución.

## Reglas del registro

1. Cada decisión principal usa un identificador único `HC-XXX`.
2. Una extensión compatible puede usar `HC-XXX.Y` sin reabrir la decisión base.
3. Un documento de implementación puede compartir el identificador de su decisión únicamente si declara de forma explícita cuál es el documento de referencia; no constituye una segunda decisión.
4. No se reutilizan identificadores cerrados o descartados.
5. Una decisión **IMPLEMENTADA** fija un contrato estable de producto/arquitectura; que el contenido editorial siga creciendo no reabre la decisión.
6. Una decisión **APROBADA / VIGENTE** es obligatoria aunque su aplicación pueda seguir ampliándose.
7. La siguiente decisión principal libre es **HC-014**.

## Índice

| ID | Decisión | Estado canónico | Documento |
| --- | --- | --- | --- |
| HC-001 | Enciclopedia relacional | IMPLEMENTADA / VIGENTE | `docs/HC-001-enciclopedia-relacional.md` |
| HC-002 | Identidad de Hilo Cofrade | IMPLEMENTADA / VIGENTE | `docs/HC-002-identidad-hilo-cofrade.md` |
| HC-003 | Stack técnico | IMPLEMENTADA / VIGENTE | `docs/HC-003-stack-tecnico.md` |
| HC-004 | Datos estructurados y autoridad editorial | IMPLEMENTADA / VIGENTE | `docs/HC-004-datos-estructurados.md` |
| HC-005 | Históricos | IMPLEMENTADA | `docs/HC-005-historicos.md` |
| HC-006 | Acompañamientos musicales | IMPLEMENTADA | `docs/HC-006-acompanamientos-musicales.md` |
| HC-007 | Enlaces externos | IMPLEMENTADA / VIGENTE | `docs/HC-007-enlaces-externos.md` |
| HC-008 | Organización inicial de Hermandades y navegación relacional | IMPLEMENTADA | `docs/HC-008-organizacion-y-navegacion-relacional.md` |
| HC-008.1 | Hardening relacional de Tira del hilo | IMPLEMENTADA / ABSORBIDA EN HC-008 | `docs/HC-008-1-hardening-relacional.md` |
| HC-009 | Sistema tipográfico | APROBADA + IMPLEMENTADA | `docs/HC-009-sistema-tipografico-hilo-cofrade.md` + `docs/HC-009-implementacion.md` |
| HC-010 | Paletas cromáticas estructuradas de Bandas | APROBADA / VIGENTE | `docs/HC-010-paletas-cromaticas-bandas.md` |
| HC-011 | Tira del hilo como buscador conversacional | EN IMPLEMENTACIÓN | `docs/HC-011-tira-del-hilo-conversacional.md` |
| HC-012 | Sistema visual de logotipos de Bandas | APROBADA / VIGENTE | `docs/HC-012-sistema-visual-logotipos-bandas.md` |
| HC-013 | Patrimonio musical como relación independiente | APROBADA / VIGENTE | `docs/HC-013-patrimonio-musical-relacional.md` |

## Aclaración sobre HC-009

`HC-009-sistema-tipografico-hilo-cofrade.md` es la decisión. `HC-009-implementacion.md` documenta cómo se ejecutó y valida la misma decisión. No existe colisión de IDs.

## Relación con el estado operativo

Las decisiones HC fijan contratos duraderos; `docs/ESTADO-PROYECTO.md` fija el corte operativo actual. Un cambio de `main`, un deployment o una carga editorial no exige modificar este registro salvo que cambie una decisión, su estado o su numeración.

## Próxima decisión

Cualquier nuevo contrato principal que necesite formalización debe comenzar en **HC-014**. No crear un nuevo `HC-009`, `HC-010`, etc. para una implementación distinta.