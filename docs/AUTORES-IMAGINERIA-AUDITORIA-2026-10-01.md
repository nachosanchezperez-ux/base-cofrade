# Autores · Imaginería y escultura · auditoría del ciclo 3

**01/10/2026 · AUDITORÍA, PROPUESTA Y DRY-RUN PASS; SIN APPLY.** Primer lote concreto: **9 INSERT**, siete disciplinas principales y dos enlaces directos de Fuentes. No se ha comprometido ninguna escritura en producción. El SQL termina en ROLLBACK y se verificaron cero residuos en ambas tablas.

## Preflight real

Main remoto `3b97c4fe4187f64b98e7b26fefbe7cab4c4fad72`; worktree aislado desde ese SHA, sin modificaciones de código. Producción `dpl_BnHKLigg6mq3xdCNTJV4w5HVXbTP`, READY y mismo SHA. Se preservan #1060 (Restauración cerrada) y #1061/#1062 (segundo piloto de lectura San Esteban, postflight estructural PASS con QA visual de ese frente aún pendiente). No generalizar ese rollout. El Baratillo permanece en su cohorte.

PR abiertas al comenzar: #1019 (Pastora aparcada) y #1020 (rendimiento draft), intactas. Supabase `kcevwkucqzcyrqaimyhl` ACTIVE_HEALTHY, 17 migraciones aplicadas y los mismos 17 SQL locales; README aparte. Ninguna migración ejecutada.

## Inventario y anomalías

751 entidades agente, 744 publicadas; 718 filas agents. El contrato público vigente da **422 perfiles elegibles**, sin rebajar el umbral. 115 disciplinas en 94 agentes tras el cierre de Restauración.

El cruce amplio por categoría, texto y autorías reúne **122 candidatos**, 89 elegibles y 105 sin disciplina. No son 122 escultores acreditados: incluye otros oficios, atribuciones, perfiles sin masa documental y contexto histórico. La categoría pública Imaginería contiene **83 perfiles**: 68 sin disciplina explícita, 27 sin Fuente directa. Los candidatos fuera de esa categoría elegibles son seis: Antonio Dubé de Luque y Antonio de Alfián/Juan de Zamora (Diseño/pintura), Gabriel de Astorga y Fernando Murciano (Restauración), Fernando Aguado (Música). No corregir por mera presencia de una autoría.

| Categoría pública | Elegibles actuales | Previsión del lote |
|---|---:|---:|
| Música | 213 | 213 |
| Imaginería y escultura | 83 | 83 |
| Restauración y conservación | 22 | 22 |
| Vestidores | 7 | 7 |
| Bordado y arte textil | 20 | 20 |
| Orfebrería | 20 | 20 |
| Talla, carpintería y dorado | 22 | 22 |
| Diseño, pintura y cartelería | 17 | 17 |
| Patrimonio y otros oficios | 18 | 18 |

La tabla image_authorships tiene 372 filas: 361 publicadas; 256 son author/documented, 53 anonymous/unknown y 52 tienen otros tipos o certezas. Se mantienen separados author, attributed_to, workshop_of, circle_of, school_of y anonymous. El oficio de un escultor no convierte todas las atribuciones de su ficha en autorías documentadas.

**Buiza:** dos principales (Diseño y Escultura); la tarjeta publica Diseño dentro de la categoría Imaginería. Es una anomalía real y visible. Se propone revisar su principal con documentación de trayectoria; este lote no modifica esas dos filas ni infiere una decisión de una sola hornacina/cartela.

**Posibles identidades duplicadas:** Antonio Dubé / Antonio Joaquín Dubé; Juan Antonio Blanco / Blanco Ramos; Rafael Barbero / Barbero Medina; Juan Ventura / Juan Antonio González García «Ventura»; Felipe de Rivas / Felipe de Ribas. Los nombres, IDs y contextos se conservan; no hay fusiones. No confundir nombre común con prueba de identidad.

**Atribución o contexto:** Blas Molner, Diego Márquez, Pedro de Mena, José Tiburcio González y José Parellada no tienen author/workshop_of publicado en este corte. Mantener sus cautelas y documentar oficio por una fuente biográfica antes de ampliar disciplinas. Las referencias a Utrera y Estepa no equivalen a autoría documental.

**Obras con nombres repetidos:** Juan de Astorga tiene dos entidades publicadas llamadas Buen Fin; Álvarez Duarte tiene obras de advocación repetida y algunas autorías no publicadas. No sumar por nombre ni fusionar entidades por esa coincidencia. La auditoría usa IDs y estado, y el lote no altera imágenes.

## Solapamientos

No hay pares agente/image_entity_id repetidos dentro de image_authorships publicada. Se detectan **27 pares agente/obra representados en más de un sistema** entre autorías, intervenciones, relaciones genéricas y fases de Paso, dentro del universo candidato. Una coincidencia puede representar creación más restauración, no necesariamente duplicación semántica.

No se incorporan author_of, historical_original_author o intervened al contador público. El informe conserva los IDs y sistemas para revisión individual. Algunos seleccionados aparecen en esos solapamientos; el lote añade oficio y Fuentes, sin tocar el lector, relaciones, contadores ni certeza.

## Primer lote exacto

Se reutiliza **Escultura** como disciplina principal, ya reconocida por el lector de Imaginería. Imaginería/Escultura/Modelado permanecen como vocabulario existente; no se hace normalización global de variantes. No se añaden Restauración o Conservación secundarias por una intervención puntual.

| Perfil | Disciplina principal añadida | Fuente directa nueva |
|---|---|---|
| Luis Ortega Bru | Escultura | 0; se conserva la existente |
| Sebastián Santos Rojas | Escultura | 0; se conserva la existente |
| Pedro Roldán | Escultura | 0; se conserva la existente |
| Antonio Illanes Rodríguez | Escultura | 1 |
| Luis Álvarez Duarte | Escultura | 1 |
| Juan de Mesa | Escultura | 0; se conserva la existente |
| Juan de Astorga | Escultura | 0; se conserva la existente |

Respaldo revisado en fuentes primarias:

- **Luis Ortega Bru:** [Luis Ortega Bru · Fuente oficial](https://hermandadelbaratillo.es/cultos-y-actos-por-el-lxxv-aniversario-del-stmo-cristo-de-la-misericordia/). El Baratillo identifica la hechura del Cristo de la Misericordia como obra de Ortega Bru.
- **Sebastián Santos Rojas:** [Sebastián Santos Rojas · Fuente oficial](https://lacenadesevilla.es/senor-de-la-sagrada-cena/). La Cena identifica a Santos Rojas como autor de su Titular de 1955.
- **Pedro Roldán:** [Pedro Roldán · Fuente oficial](https://siete-palabras.com/otros-titulares). Siete Palabras documenta el pago final a Roldán por San Miguel en 1657; no se apoya la propuesta en las atribuciones del resto del conjunto.
- **Antonio Illanes Rodríguez:** [Antonio Illanes Rodríguez · Fuente oficial](https://lanzada.org/titulares/santisimo-cristo-de-la-sagrada-lanzada). La Lanzada identifica al escultor Illanes como autor del Crucificado de 1929.
- **Luis Álvarez Duarte:** [Luis Álvarez Duarte · Fuente oficial](https://hermandaddelased.org/stmo-cristo-de-la-sed/). La Sed identifica la autoría y el contrato de la talla de 1969–1970. Sus restauraciones posteriores se conservan como intervenciones.
- **Juan de Mesa:** [Juan de Mesa · Fuente oficial](https://www.gran-poder.es/imagenes/nuestro-padre-jesus-del-gran-poder/). Gran Poder distingue la atribución antigua a Montañés del pago documental a Mesa por Jesús y San Juan en 1620.
- **Juan de Astorga:** [Juan de Astorga · Fuente oficial](https://lanzada.org/titulares/maria-santisima-del-buen-fin-2/). La Lanzada identifica al escultor Juan de Astorga y la hechura de Buen Fin de 1810.

Las páginas de Las Aguas devolvieron una pantalla de verificación al buscador; se utilizaron las fuentes oficiales accesibles de La Lanzada y La Sed ya presentes en sources y vinculadas a autorías publicadas. No se afirma haber leído contenido bloqueado. No se crean Fuentes nuevas ni se borran los enlaces anteriores.

**Operaciones:** siete INSERT en agent_disciplines y dos INSERT en source_links; 0 UPDATE, DELETE, DDL, relaciones o entidades. Los IDs del lote usan c0200003. El manifest enumera agente, fuente, autoría existente, URL, notas y scope exactos.

## Impacto simulado y dry-run

- agent_disciplines: **115 → 122**; agentes con disciplina: **94 → 101**.
- source_links: **8521 → 8523**; fuentes directas Illanes: **0 → 1**, Álvarez Duarte: **1 → 2**.
- Imaginería sin disciplina explícita: **68 → 61**; sin Fuente directa: **27 → 26**.
- **422 elegibles, 83 Imaginería**, URLs, índices, relaciones y demás categorías se conservan.
- Las siete fichas pasarían de la etiqueta fallback a Escultura en disciplina principal, title y Person.jobTitle. Es un cambio semántico documentado, sin redesign.

Dry-run `IMAGERY_DRY_RUN_PASS_ROLLBACK`: 7 + 2 INSERT correctos. Guardas de deriva del snapshot y preservación de filas existentes en **diez tablas**: agents, entities, agent_disciplines, source_links, image_authorships, heritage_interventions, step_phase_agents, march_authors, entity_relations y sources. Se exige agente publicado con slug esperado, disciplina previa vacía, evidencia author/documented publicada, URL/source exactos, ausencia del enlace e IDs nuevos y una principal por perfil. Fingerprints excluyen únicamente los IDs propuestos al comparar después. ROLLBACK confirmado con **0 residuos**.

## QA pública de baseline

Once rutas de producción HTTPS: directorio, filtro, dos sitemaps y las siete fichas; todas HTTP 200. Las fichas tienen un H1, canonical propia, index/follow y JSON-LD. El filtro conserva noindex/follow y canonical al directorio. Los dos sitemaps contienen el mismo conjunto de **422 fichas**, incluidas las siete candidatas.

Navegador real de producción, escritorio con innerWidth 1363 px: directorio y siete fichas revisados, sin desbordamiento horizontal (scrollWidth 1348 px). Directorio y cabecera de Astorga inspeccionados visualmente; las Fuentes actuales se conservaron en la lectura. Esto es QA del baseline, **no postflight del lote**. No se acredita QA móvil multi-anchura en este ciclo; deberá ejecutarse tras el Apply antes de certificar.

Runtime de producción, deployment vigente, filtro error/fatal: sin registros entre **17:21:30 y 17:36:30 UTC**. No se extrapola fuera de esa ventana.

## Evidencia y siguiente paso

- [Inventario](./evidence/autores-imagineria-inventario-20261001.json) y [cobertura](./evidence/autores-imagineria-cobertura-20261001.json).
- [Grafo](./evidence/autores-imagineria-grafo-20261001.json), [solapamientos](./evidence/autores-imagineria-solapamientos-20261001.json), [resumen](./evidence/autores-imagineria-resumen-20261001.json).
- [Fuentes revisadas](./evidence/autores-imagineria-fuentes-revisadas-20261001.json).
- [Manifest exacto](./evidence/autores-imagineria-lote-20261001.json), [SQL de dry-run](./evidence/autores-imagineria-dry-run-20261001.sql), [resultado](./evidence/autores-imagineria-dry-run-result-20261001.json).
- [Fingerprints anteriores](./evidence/autores-imagineria-fingerprints-antes-20261001.json), [HTTP público](./evidence/autores-imagineria-publico-20261001.json), [runtime](./evidence/autores-imagineria-runtime-20261001.json).

Primera propuesta de Imaginería concreta y verificable. Antes de Apply: refrescar main/producción, repetir guardas y dry-run. Después: una principal por ficha, fuentes nuevas, titles/Person.jobTitle, 422 perfiles y 83 Imaginería, QA PC/móvil, sitemaps, integridad y cierre. La autorización anterior de aplicación correspondía al lote de 22 INSERT de Restauración; no se reejecuta. Las deudas anteriores quedan abiertas; no abrir otra categoría antes de certificar este lote.
