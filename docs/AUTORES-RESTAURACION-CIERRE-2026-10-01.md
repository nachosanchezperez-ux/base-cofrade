# Autores · primer lote Restauración y conservación · cierre

**01/10/2026 · APLICADO, VERIFICADO Y CERRADO.** Se certifica únicamente el primer lote de siete perfiles, con doce disciplinas y diez enlaces de Fuentes. La categoría completa mantiene las deudas documentales del inventario. No reejecutar los 22 INSERT.

## Aplicación e integridad

Autorización de publicación documental: «Autorizo». Autorización del lote exacto: «Hazlo». Preflight repetido sobre main `16597bcb68481cde953021e269bc21a3a049985d`, producción READY `dpl_BTFwCt2ZodM6DX3qePnEUBa6tWn8`; Supabase ACTIVE_HEALTHY y 17 migraciones alineadas. Se preserva el piloto de lectura de El Baratillo publicado por #1055/#1058.

El dry-run repetido terminó en ROLLBACK y sin residuos de los 22 IDs. La transacción posterior conservó las mismas guardas y terminó en `RESTORATION_APPLY_QA_OK_COMMIT`: **12 INSERT en agent_disciplines y 10 INSERT en source_links**. No hubo UPDATE, DELETE, DDL, altas de entidades ni relaciones.

Los fingerprints anteriores y posteriores de las filas existentes coinciden en nueve tablas: agents, entities, source_links, march_authors, entity_relations, agent_disciplines, image_authorships, step_phase_agents y heritage_interventions. En el cálculo posterior se excluyen únicamente los 22 IDs nuevos. Cada perfil seleccionado tiene una sola disciplina principal.

| Perfil | Principal | Secundaria | Disciplinas añadidas | Fuentes añadidas |
|---|---|---|---:|---:|
| Almudena Fernández García | Restauración | Conservación | 2 | 2 |
| Ballesteros Cascajares | Conservación | Restauración | 2 | 2 |
| Cinta Rubio Faure | Restauración | — | 1 | 1 |
| Francisco Arquillo de la Torre | Restauración | — | 1 | 1 |
| Instituto Andaluz del Patrimonio Histórico | Restauración | Conservación | 2 | 2 |
| José Joaquín Fijo León | Restauración | Conservación | 2 | 2 |
| Laura Pérez Meléndez | Restauración | Conservación | 2 | 0 |

Laura conserva su Fuente profesional anterior; no se duplica. Recuentos actuales: 422 autores elegibles, 744 entidades agente publicadas; 94 agentes con disciplinas y 115 filas de disciplinas (103 → 115). Source_links: **8511 inmediatamente antes → 8521 después**; el corte histórico de la auditoría tenía 8494 y no es el preflight de esta aplicación. Restauración: **21 → 22**; Patrimonio: **19 → 18** por la categoría principal de Arquillo. Las demás categorías se conservan.

## Verificación pública y responsive

Postflight HTTPS verificado de once rutas: directorio, filtro, dos sitemaps y siete fichas, todas HTTP 200. Las fichas tienen un H1, canonical propio, index/follow, disciplina principal correcta en datos estructurados y las diez Fuentes nuevas visibles. La Fuente profesional de Laura también está presente. El filtro conserva noindex/follow y canonical al directorio. Ambos sitemaps contienen el mismo conjunto de **422 fichas**, incluidas las siete seleccionadas.

QA responsive: **14 casos PASS**, sin desbordamiento horizontal ni errores de página. El filtro se revisó en 320, 390, 430, 768 y 1440 px; las siete fichas en 390 px; Arquillo e IAPH además en 1440 px. Se verificó el extremo del carrusel móvil, navegación real del filtro a Arquillo y apertura/visibilidad de Fuentes. Capturas de filtro y Arquillo inspeccionadas visualmente.

Método: emulación Chromium sobre una copia GET de recursos de producción obtenida mediante HTTPS con certificado verificado. No hubo CSS candidato. No equivale a teléfono físico, Safari ni navegador móvil conectado directamente por HTTPS. La comprobación HTTP pública se hizo directamente contra producción y es independiente de esta emulación.

Runtime: consulta de producción filtrada a error/fatal en `dpl_BTFwCt2ZodM6DX3qePnEUBa6tWn8`, ventana **07:44:26–07:59:26 UTC**: sin registros para esos criterios. No acredita ausencia de errores fuera de esa ventana. Este cierre modifica solo documentación; no altera código, diseño o lector. La CI de la PR debe pasar antes de integrar el cierre.

## Evidencia y continuidad

- [Auditoría histórica, fuentes y deudas](./AUTORES-RESTAURACION-AUDITORIA-2026-10-01.md).
- [Manifest exacto histórico](./evidence/autores-restauracion-lote-20261001.json) y [dry-run con ROLLBACK](./evidence/autores-restauracion-dry-run-20261001.sql).
- [Apply y fingerprints](./evidence/autores-restauracion-apply-20261001.json).
- [Recuentos finales](./evidence/autores-restauracion-recuentos-finales-20261001.json), [cobertura final](./evidence/autores-restauracion-cobertura-final-20261001.json).
- [Postflight público](./evidence/autores-restauracion-postflight-publico-20261001.json) y [QA responsive](./evidence/autores-restauracion-responsive-20261001.json).
- [Runtime](./evidence/autores-restauracion-runtime-20261001.json).

Se conservan las deudas de biografía/oficio, textiles/dorado, identidad, posibles duplicados y fuentes específicas de la auditoría; no hay normalización masiva ni fusiones. Vestidores sigue cerrado y no se reejecuta. Imaginería queda como siguiente categoría en cola para auditoría propia, sin Apply autorizado ni cambios en este cierre.
