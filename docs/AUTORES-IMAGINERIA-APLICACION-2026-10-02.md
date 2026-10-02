# Autores · Imaginería · primer lote aplicado

> Actualización posterior: la QA responsive emulada está completada y el primer lote cerrado. [Cierre del 02/10/2026](./AUTORES-IMAGINERIA-CIERRE-2026-10-02.md). Los estados pendientes que siguen describen el corte de aplicación anterior.

## Estado real

**APLICADO CON COMMIT · INTEGRIDAD, POSTFLIGHT PÚBLICO Y ESCRITORIO PASS · QA MÓVIL PENDIENTE.** No se declara certificación responsive ni cierre completo del ciclo. No reejecutar los nueve INSERT.

El usuario respondió «Vamos a ello» el 02/10/2026 a la solicitud concreta de publicar el inventario, los identificadores y el SQL en `nachosanchezperez-ux/base-cofrade` y aplicar siete disciplinas más dos enlaces de Fuentes. Esta autorización cubre la publicación de la auditoría y el lote exacto, sin ampliar operaciones.

## Preflight y aplicación

- Main y producción seguían en `3b97c4fe4187f64b98e7b26fefbe7cab4c4fad72`; deployment `dpl_BnHKLigg6mq3xdCNTJV4w5HVXbTP` READY. Se preservan ambos pilotos de lectura; la QA visual pendiente de San Esteban es independiente.
- PR abiertas #1019 y #1020 preservadas sin modificaciones.
- Repetición del SQL original con ROLLBACK: `IMAGERY_DRY_RUN_PASS_ROLLBACK`, siete disciplinas y dos enlaces; consulta posterior: cero residuos en ambas tablas.
- Los fingerprints completos de diez tablas coincidieron con el corte de auditoría. Se conservó el SQL y todas sus guardas; solo se cambió el marcador final y ROLLBACK por COMMIT para la aplicación.
- Resultado confirmado: `IMAGERY_APPLY_PASS_COMMIT`, 7 disciplinas y 2 enlaces. Consulta independiente posterior: 122 disciplinas, 8523 enlaces; siete principales Escultura y dos enlaces del lote presentes.

## Siete fichas normalizadas

| Autor | Disciplina principal | Fuente directa añadida |
|---|---|---|
| Luis Ortega Bru | Escultura | Conserva la existente |
| Sebastián Santos Rojas | Escultura | Conserva la existente |
| Pedro Roldán | Escultura | Conserva la existente |
| Antonio Illanes Rodríguez | Escultura | Fuente oficial de la Sagrada Lanzada |
| Luis Álvarez Duarte | Escultura | Fuente oficial del Cristo de la Sed |
| Juan de Mesa | Escultura | Conserva las existentes |
| Juan de Astorga | Escultura | Conserva la existente |

No hubo UPDATE, DELETE, DDL, nuevas entidades, fuentes, autorías o relaciones. El enlace de fuente directo permite consultar el oficio desde la ficha y no añade otra autoría. Se preservan las atribuciones, certezas y restauraciones.

## Postflight

- Fingerprints de las filas anteriores en `agents`, `entities`, `agent_disciplines`, `source_links`, `image_authorships`, `heritage_interventions`, `step_phase_agents`, `march_authors`, `entity_relations` y `sources`: **10/10 sin cambios**, excluyendo únicamente las nueve filas del lote en las dos tablas modificadas.
- Once rutas productivas HTTPS: directorio, filtro Imaginería, ambos sitemaps y siete fichas: **HTTP 200**.
- Siete fichas: un H1, canonical propia, `index, follow`, JSON-LD válido con Escultura y presencia en ambos sitemaps.
- Filtro Imaginería: `noindex, follow` y canonical al directorio general.
- Ambos sitemaps conservan el mismo conjunto de **422 URLs de autores**; el directorio mantiene **83 perfiles de Imaginería**. Estas cifras expresan elegibilidad editorial, no indexación efectiva de Google.
- Nuevos enlaces oficiales de Illanes y Álvarez Duarte presentes en el HTML público. Primera lectura tras el COMMIT devolvió contenido anterior; la siguiente comprobación pasó después de la renovación de caché.
- Navegador productivo: directorio y siete fichas, viewport 1363 px, `clientWidth = scrollWidth = 1348`; Escultura visible en las siete fichas. Sin desbordamiento horizontal observado.

**Límite de QA:** el navegador disponible no expone capacidad de cambiar viewport y los atajos F12 / Ctrl+Shift+M no activaron controles de emulación. No se ejecutó matriz móvil, ni se afirma prueba en teléfono físico. Pendiente comprobar 320/390/430/768 px, navegación de categorías, ficha y Fuentes antes de certificar y cerrar el ciclo. No es motivo para repetir el DML confirmado.

## Evidencia y continuidad

- [Auditoría original e inventario](./AUTORES-IMAGINERIA-AUDITORIA-2026-10-01.md): corte histórico de propuesta, anterior a la autorización.
- [SQL aplicado](./evidence/autores-imagineria-apply-20261002.sql) y [resultado](./evidence/autores-imagineria-apply-result-20261002.json).
- [Integridad posterior](./evidence/autores-imagineria-postflight-integridad-20261002.json).
- [HTTP, SEO, JSON-LD, enlaces y sitemaps](./evidence/autores-imagineria-postflight-publico-20261002.json).

Los 27 solapamientos del grafo no se convierten en duplicados por coincidencia de autor y objeto. Buiza conserva su doble principal pendiente de revisión; pares de identidad, perfiles con solo atribución y autores fuera de Imaginería mantienen su deuda. No abrir otra categoría ni fusionar identidades a partir de este lote. Vestidores y Restauración están cerrados y no se reejecutan.
