# Certificación · Coria del Río · cuarto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026

**Municipio:** Coria del Río  
**Régimen:** FIRST EDITION FREEZE  
**Esquema:** sin cambios; DML exclusivamente  
**PR funcional:** #851  
**HEAD funcional fusionado:** `50c762f3323d7a3a9725021cdf5d7e3ba780964b`  
**Deployment funcional certificado:** `dpl_7357PUR7pgENFJS7ps51YyTHfeFB` · READY · producción  
**Supabase:** `ACTIVE_HEALTHY` · 12/12 migraciones estructurales activas

## Veredicto

**CORIA DEL RÍO · CERRADA Y CERTIFICADA**

El cuarto macrolote municipal HC-016 queda cerrado. No se abre automáticamente Sanlúcar la Mayor, Utrera ni ningún otro municipio. El siguiente movimiento municipal, cuando se autorice, debe partir de un recálculo nuevo de la cobertura real.

## Universo canónico

El cierre preserva ocho corporaciones públicas y evita dividir devociones o jornadas que pertenecen a una misma Hermandad:

1. Borriquita de Coria del Río.
2. Hermandad de Jesús Cautivo.
3. Hermandad de San José, con Martes Santo y Piedad del Sábado Santo en una sola corporación.
4. Hermandad del Gran Poder y Nuestra Señora del Carmen, como una sola corporación.
5. Hermandad de la Vera+Cruz.
6. Hermandad de la Soledad, con Viernes Santo y Domingo de Resurrección en una sola corporación.
7. Hermandad de Nuestra Señora del Rocío de Coria del Río.
8. Hermandad Sacramental de Nuestra Señora de la Estrella.

## Historia de ejecución gobernada

### Lote base canónico

El grafo municipal ya estaba materializado en producción mediante la familia determinista `c0160031`. La rama de #851 conserva el DML base archivado y reproducible, con 304 operaciones editoriales.

### Staging descartado

El staging `c0160040-0000-4000-8000-000000000001`, de 394 operaciones, **no se aplicó**.

El preflight detectó:

- corrupción sintáctica en el payload;
- referencias de columna erróneas;
- UUID malformados;
- un literal editorial corrupto;
- una cláusula `ON CONFLICT` incompleta;
- una fila musical desalineada;
- y, sobre todo, colisiones reales porque seis corporaciones, lugares, titulares, Pasos y Salidas ya existían bajo IDs canónicos `c0160031-*`.

El lote quedó `cancelled` con 0 Apply. No se forzó una segunda creación del grafo.

### Reconciliación final

Se creó el lote diferencial `c0160041-0000-4000-8000-000000000001`.

Resultado:

| Control | Resultado |
|---|---:|
| Manifest | 22 |
| DML real | 21 |
| Reuse canónico | 1 |
| Válidas | 22 |
| Inválidas | 0 |
| Aplicadas | 22 |
| Fallos | 0 |
| Estado | completed |

El preflight final ejecutó el delta completo dentro de transacción y terminó en `ROLLBACK` con todas las guardas en verde antes del Apply real.

## Delta final aplicado

- Nueva Fuente retrospectiva para San José · Martes Santo 2026.
- Reutilización de la Fuente canónica de *El Muñidor del Aljarafe 2026*.
- San José · Martes Santo 2026 pasa a `held`.
- Siete periodos de acompañamiento musical quedan consolidados y trazados a Fuente:
  - Cautivo · Cristo → Nazareno de La Algaba.
  - Gran Poder · Cristo → BCT Nuestro Padre Jesús del Gran Poder de Coria del Río.
  - Gran Poder · Virgen → Banda Municipal de Música de Coria del Río.
  - Vera+Cruz · Virgen → Banda Municipal de Música de Coria del Río.
  - Soledad · Viernes Santo → Banda Municipal de Música de Coria del Río.
  - Resurrección · Cristo → AM Santa Cecilia de Sevilla.
  - Resurrección · Soledad → Banda Municipal de Música de Coria del Río.
- Borriquita queda relacionada con la sede canónica rica de Santa María de la Estrella.
- Las referencias de `outings` y `outing_series` se mueven a esa sede canónica.
- El lugar duplicado se elimina después de recorrer dinámicamente todas las claves foráneas hacia `places`.

## Actualidad estricta 2026

Las ocho Salidas núcleo están presentes.

Quedan como `held` únicamente las que disponen de evidencia posterior suficiente:

- Cautivo · Lunes Santo.
- San José · Martes Santo.
- Soledad · Domingo de Resurrección.

Las restantes conservan `announced` cuando la Fuente acredita convocatoria o programa, pero no la celebración efectiva.

No se transforma automáticamente un acontecimiento pasado en celebrado por el mero paso del tiempo.

## Huecos legítimos preservados

- Piedad del Sábado Santo 2026 mantiene **0 asignaciones musicales**: no se inventa una formación.
- AM San Lucas Evangelista mantiene **0 asignaciones forzadas a Resurrección**: su papel exacto no queda acreditado con suficiente precisión.
- Rocío no recibe Imagen o Paso ficticios para elevar artificialmente la densidad de su ficha.
- No se añaden Cultos, multimedia, escudos o fotografías sin una Fuente o licencia suficiente.
- No se deduce vigencia musical para 2027.

## Reconciliación de la Banda Municipal

La Banda Municipal queda como una sola identidad pública:

- nodo canónico: `63f719d8-61ab-4357-a43f-cc7977bdda43`;
- nombre público: **Banda Municipal de Música de Coria del Río**;
- nodo duplicado `870f7ec0-8a57-4652-96ff-05725104a47b`: `archived`;
- referencias semánticas residuales al nodo archivado: **0**.

## QA de datos y grafo en producción

Tras el Apply:

| Control | Resultado |
|---|---:|
| Corporaciones públicas de Coria | 8 |
| Slugs de Hermandad duplicados | 0 |
| Salidas núcleo 2026 | 8 |
| Salidas núcleo futuras | 0 |
| Periodos musicales finales | 7 |
| Enlaces de Fuente de esos periodos | 7 |
| Referencias semánticas a Banda Municipal duplicada | 0 |
| Filas del lugar duplicado | 0 |
| Música inferida en Piedad | 0 |
| San Lucas inferida en Resurrección | 0 |
| Fuente retrospectiva enlazada a San José | 1 |

El Domingo de Resurrección de la Soledad utiliza su Paso de gloria específico y no el palio del Viernes Santo.

## QA de aplicación, SEO y superficie pública

En el deployment funcional final `dpl_7357PUR7pgENFJS7ps51YyTHfeFB`:

- 8/8 fichas de Hermandad de Coria responden HTTP 200;
- 3/3 fichas de Banda local/canónica responden HTTP 200;
- todos esos documentos publican canonical propio;
- directorios de Hermandades y Bandas responden HTTP 200 y contienen Coria del Río;
- Agenda Cofrade responde HTTP 200;
- la estructura SSR incorpora la navegación móvil en las fichas comprobadas;
- el sitemap responde HTTP 200 y se regeneró de 404 a 410 URLs tras #851;
- el sitemap incorpora las jornadas municipales de Coria que faltaban: Lunes, Martes, Miércoles, Jueves y Viernes Santo.

Las fichas individuales de Hermandades y Bandas no forman parte actualmente del sitemap dinámico de **ningún municipio**. Se registra como comportamiento transversal ya existente y no se abre una corrección SEO ajena al alcance de Coria.

### Frontera editorial de indexación

Rocío de Coria y AM San Lucas responden 200 con canonical propio y `noindex, follow`.

No se fuerza `index` para cerrar el macrolote: la regla genérica `meetsPublicEditorialMinimum` exige densidad documental y relacional suficiente. Rocío conserva legítimamente el hueco de Imagen/Paso y San Lucas no recibe una relación procesional ambigua. Las demás fichas municipales comprobadas que superan el mínimo publican `index, follow`.

## Buscador y navegación territorial

#851 no introduce una excepción nominal de Coria en el motor de búsqueda. La suite conserva en verde las regresiones genéricas de:

- listados territoriales;
- jornadas de Semana Santa;
- filtros municipales;
- navegación directa;
- continuidad conversacional sobre conjuntos de Hermandades.

El endpoint público de Tira del hilo es POST y el conector de verificación disponible no permite ejecutar ese POST como navegador. No se presenta por ello una prueba manual ficticia del diálogo en vivo; la certificación se apoya en la suite determinista y en la superficie pública HTTP comprobada.

## CI y despliegue

- Head final de la rama antes del merge: `2e851c2d48a696b23fb739e60601cd5098142745`.
- CI #2260: **SUCCESS**.
- `npm test`: **SUCCESS**.
- `npm run build`: **SUCCESS**.
- Vercel Preview de la rama: **READY**.
- #851: fusionada mediante squash.
- `main` funcional: `50c762f3323d7a3a9725021cdf5d7e3ba780964b`.
- Deployment de producción: `dpl_7357PUR7pgENFJS7ps51YyTHfeFB`.
- Estado del deployment: **READY**.
- Alias `hilocofrade.es`: asignado sin error.
- Runtime del deployment tras QA público: **0 logs error/fatal** en la ventana de control.

## Supabase

- Proyecto: `Hilocofrade`.
- Estado: `ACTIVE_HEALTHY`.
- Migraciones remotas: **12/12**.
- No se ejecutó DDL.
- No se modificó RLS.
- No se alteró la cadena estructural de migraciones.

## Observación de Auditor

1. La deuda aparente de Coria estaba sobredimensionada porque una parte importante del grafo ya había sido aplicada bajo IDs deterministas `c0160031-*`.
2. El preflight evitó una duplicación masiva: el lote 394 fue cancelado en lugar de forzarlo.
3. La reconciliación final se redujo al delta comprobable de 22 movimientos.
4. Se preservaron expresamente las incertidumbres de Piedad y AM San Lucas.
5. La Banda Municipal y la sede de Santa María de la Estrella quedan reconciliadas sin nodos públicos competidores.
6. El modelo soporta las jornadas múltiples de San José y Soledad sin dividir artificialmente corporaciones.
7. No apareció un problema de arquitectura que justifique abrir un nuevo HC.
8. La ausencia de fichas individuales en sitemap es transversal y queda fuera de este cierre; no bloquea la consistencia municipal ni se resuelve mediante una excepción de Coria.

## Cierre operativo

Al fusionarse esta certificación, el tablero debe quedar con:

- Coria del Río: **CERRADA**.
- Frente editorial activo: **NINGUNO**.
- PR abiertas: **0**.
- Siguiente municipio: **NO SE ABRE AUTOMÁTICAMENTE**.

El siguiente movimiento permitido es un **nuevo recálculo provincial desde cero** cuando se ordene. El ranking histórico Coria del Río → Sanlúcar la Mayor → Utrera no constituye una cola automática después de este cierre.
