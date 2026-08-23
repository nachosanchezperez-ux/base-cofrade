# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas. Este documento resume el estado vigente y las reglas operativas; no sustituye la comprobación previa de las herramientas.

## Baseline operativo verificado

- Revisión: **2026-08-24 · madrugada (CEST)**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` funcional verificado antes de este corte documental: `f1b6699716b80cf5d9e51c41ba97cff6a9649863` — **Añade navegación rápida global al Panel (#294)**.
- Proyecto Vercel: `base-cofrade`.
- Producción vigente verificada: **READY** en `dpl_BkzTw262px3J7chjzffBnniT2zor`, alineada con `f1b6699716b80cf5d9e51c41ba97cff6a9649863`.
- Deployment utilizado para el smoke transversal post-arquitectura: **READY** en `dpl_25snjk3QCH3DT3a1vDfScSRrd1QA`.
- Runtime de ambos controles: **sin logs `error` / `fatal`** en las ventanas comprobadas.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY** en la última comprobación aplicable.
- Migraciones de Personas reconciliadas entre Git y Supabase:
  - `20260823211405_public_agent_relation_integrity`;
  - `20260823211610_harden_public_agent_relations`.
- PR estructural histórica: **#49 · Importador documental asistido** → **⚪ APARCADA** y no utilizable como base técnica.

Los SHA, deployments y estados anteriores son una fotografía operativa. Antes de cualquier tarea significativa deben refrescarse GitHub, Vercel y Supabase cuando corresponda.

## Estado de la fase actual

### Reconciliación del registro

**ESTADO-PROYECTO → 🟢 SINCRONIZADO**.

### Arquitectura pública / separación Front ↔ Panel

**ARQUITECTURA PÚBLICA / FRONT ↔ PANEL → 🟢 CERRADA**

Cortes incluidos en el cierre:

- Home → **🟢 CERRADO**.
- Hermandades → **🟢 CERRADO**.
- Imágenes → **🟢 CERRADO**.
- Pasos → **🟢 CERRADO**.
- Bandas → **🟢 CERRADO**.
- Extraordinarias → **🟢 CERRADO**.
- Tira del hilo → **🟢 CERRADO**.
- Marchas → **🟢 CERRADO**.
- Personas / agentes → **🟢 CERRADO**.

La arquitectura pública queda cerrada como baseline técnico. Cualquier nueva superficie pública deberá respetar desde su diseño la misma frontera y no reabrir estos cortes salvo regresión real.

### Smoke transversal post-arquitectura

**BASELINE PÚBLICO POST-ARQUITECTURA → 🟢 VALIDADO**.

Smoke ejecutado sobre producción real del deployment `dpl_25snjk3QCH3DT3a1vDfScSRrd1QA` y contrastado posteriormente con la producción vigente de `main` tras #294.

#### Home

Verificados:

- Hero;
- Tira del hilo;
- Hoy;
- Extraordinarias;
- Marcha del día;
- Últimos hilos;
- `Entra por donde quieras`;
- contratos y clases responsive integrados para móvil.

La Home conserva los contadores públicos del grafo y los módulos de Home 2.7 / 2.8.

#### Directorios

HTTP 200 y contenido público correcto en:

- `/hermandades`;
- `/imagenes`;
- `/pasos`;
- `/bandas`.

Se comprobaron búsqueda, filtros publicados, segmentación territorial o tipológica y contratos responsive presentes en el render.

#### Fichas y relaciones cruzadas

Muestras comprobadas:

- Hermandad: `/hermandades/el-baratillo`;
- Imagen: `/imagenes/nuestro-padre-jesus-del-gran-poder-sevilla`;
- Paso: `/pasos/paso-de-la-piedad`;
- Banda: `/bandas/banda-del-sol`.

Las cuatro conservan sus relaciones cruzadas públicas, `Tira del hilo`, responsables, música, patrimonio y Fuentes cuando corresponden.

#### Extraordinarias

Verificados:

- directorio `/extraordinarias`;
- separación de próximas y celebradas;
- búsqueda y filtros;
- guía real `/extraordinarias/gerena-sangre-2026`;
- horarios;
- recorrido;
- acompañamiento musical;
- otros momentos musicales;
- Fuentes externas documentadas.

#### Media

Verificados dos caminos reales:

- fotografía local / Supabase, incluida la portada de la extraordinaria de Gerena;
- fotografía Wikimedia Commons en Nuestro Padre Jesús del Gran Poder.

La fotografía Wikimedia conserva:

- render directo desde `upload.wikimedia.org`;
- autor `Tiberioclaudio99`;
- licencia `CC BY-SA 4.0`;
- crédito público;
- enlace a la ficha original de Commons;
- uso como portada y metadato social de la ficha.

No se considera que el mero alojamiento en Wikimedia autorice automáticamente una imagen; la licencia concreta continúa siendo obligatoria.

#### Tira del hilo

Comprobado en el baseline:

- buscador público de entidades bajo lectura stateless;
- búsqueda pública de Personas ya validada en el cierre anterior;
- relaciones `Tira del hilo` renderizadas en Hermandad, Imagen, Paso y Banda;
- evidencia y Fuentes públicas preservadas en las fichas relacionadas;
- comportamiento `not_documented` protegido en el componente cuando una consulta no puede resolverse con datos publicados.

**Limitación de este smoke:** el flujo conversacional completo usa `POST /api/tira-del-hilo` desde un navegador cliente. El entorno de auditoría actual no permite ejecutar una interacción visual real contra producción. No se declara una simulación inexistente: el cierre se apoya en lectura HTTP real de producción, buscador público, relaciones renderizadas y barreras automáticas ya integradas.

#### Responsive / móvil

El entorno de auditoría no permite abrir un navegador real con viewport móvil contra producción. Se han validado:

- markup y contratos responsive presentes en producción;
- reglas y `sizes` móviles de directorios, Home, fichas y Extraordinarias;
- CI y barreras de regresión responsive integradas.

Esto no sustituye una futura revisión visual manual en dispositivo real, pero no bloquea el baseline técnico post-arquitectura.

#### Vercel

- deployment de smoke → **READY**;
- producción vigente posterior a #294 → **READY**;
- consultas públicas realizadas → HTTP 200;
- runtime consultado tras los controles → **0 logs `error` / `fatal`**.

Conclusión: **SMOKE TRANSVERSAL DE CIERRE → 🟢 CERRADO**.

## Personas / agentes · autoridad pública → 🟢 cerrado

PR **#287 · Cierra la autoridad pública de Personas y agentes** → **fusionada**.

Hallazgos y cambio funcional:

- `lib/supabase/search-live.js` y `lib/supabase/search.js` todavía dependían del cliente cookie-aware aunque alimentaban búsquedas públicas;
- ambos pasan al cliente público stateless;
- las relaciones públicas con autores, compositores, capataces, restauradores, artesanos, responsables patrimoniales y agentes relacionados quedan condicionadas a extremos publicables;
- no se creó una ruta pública nueva para Personas ni se alteró el modelo de datos.

PR **#289 · Reconcilia el cierre final de Personas con Supabase** → **fusionada**.

Cierre de reconciliación:

- versiona en Git la migración remota `20260823211610_harden_public_agent_relations.sql`, ya aplicada previamente en Supabase;
- amplía `test/agent-public-authority-boundary.test.mjs` para impedir regresiones hacia `@/lib/supabase/server`, `@supabase/ssr`, `next/headers` o `cookies()` en las superficies públicas auditadas;
- protege expresamente `agent_roles`, `band_agents`, autorías de Imágenes, autores de Marchas, responsables de Pasos, fases, intervenciones, novedades patrimoniales y relaciones genéricas.

Supabase verificado:

- RLS activa en `entities`, `agent_roles`, `band_agents`, `entity_relations`, `heritage_interventions`, `heritage_update_agents`, `image_authorships`, `march_authors`, `step_personnel_periods` y `step_phase_agents`;
- vistas públicas relevantes (`current_image_locations`, `image_authorship_details`, `step_brotherhood_history`, `step_image_history`, `step_phase_details`) con `security_invoker=true`;
- bajo rol `anon`: **0 relaciones inválidas visibles** hacia extremos no publicables en las nueve superficies auditadas;
- recuentos públicos conservados: 11 roles de agente, 27 relaciones Banda↔agente, 52 relaciones genéricas, 53 intervenciones, 7 responsables de novedades, 36 autorías de Imagen, 210 autorías de Marcha, 27 periodos de personal y 66 responsables de fases.

Validación final:

`RLS → anon → regresión automática → CI → build → preview → smoke público → producción READY → runtime limpio`.

Conclusión: **PERSONAS / AGENTES · AUTORIDAD PÚBLICA → 🟢 CERRADA**.

## Regla arquitectónica permanente

La separación canónica del proyecto es:

```text
FRONT PÚBLICO
→ lectura stateless / rol anon

PANEL
→ sesión editorial autenticada
```

No mezclar ambos contextos salvo necesidad técnica expresamente justificada, documentada y protegida por una barrera de regresión.

En concreto:

- una lectura pública no debe depender de cookies, sesión editorial ni del cliente SSR autenticado;
- las relaciones públicas solo pueden exponer extremos publicables;
- las vistas públicas deben respetar RLS, usando `security_invoker=true` cuando corresponda;
- el Panel conserva las políticas y la sesión autenticada necesarias para edición, borradores y publicación.

## Cierres recientes incorporados al baseline

- **#272 · Bandas · autoridad pública** → fusionada.
- **#273 · Extraordinarias · autoridad pública** → fusionada.
- **#280 · Tira del hilo · autoridad pública** → fusionada.
- **#281 · Marchas · autoridad pública** → fusionada.
- **#282 · Wikimedia Commons · licencias y atribución** → fusionada.
- **#283 · Home 2.7** → fusionada.
- **#284 · Wikimedia Commons · render directo** → fusionada.
- **#285 · Home 2.8** → fusionada.
- **#287 · Personas / agentes · autoridad pública** → fusionada.
- **#289 · reconciliación final Personas ↔ Supabase** → fusionada.
- **#291 · Arquitectura pública / Front ↔ Panel** → fusionada.
- **#294 · navegación rápida global del Panel** → fusionada.

## Orden exacto de Dirección

1. Reconciliar `ESTADO-PROYECTO` → **🟢 CERRADO**.
2. Auditar y cerrar Personas / agentes → **🟢 CERRADO**.
3. Declarar Arquitectura pública / Front ↔ Panel → **🟢 CERRADO**.
4. Ejecutar smoke transversal de cierre → **🟢 CERRADO**.
5. **Obtener y priorizar la primera cola de Salud del grafo → SIGUIENTE ACCIÓN ÚNICA**.
6. Resolver un único patrón sistémico completo y medir su reducción.
7. Auditar el protocolo editorial de Wikimedia / media abierta.
8. Sincronizar el registro de decisiones HC con la arquitectura real.
9. Mantener #49 aparcada.
10. Realizar una nueva fotografía global y elegir un solo gran frente.

**No abrir una nueva fase ni otro frente estructural antes de completar esta secuencia.**

## Siguiente acción · Salud del grafo

Obtener una fotografía actual del sistema y clasificar incidencias:

- 🔴 prioritarias: relaciones rotas, huérfanos, extremos inexistentes o no publicables e incoherencias de publicación;
- 🟠 cobertura: ficha básica, autorías, responsables, acompañamientos y Fuentes;
- 🔵 enriquecimiento: escudos, logotipos, fotografías, multimedia y campos secundarios.

Dirección debe elegir **un solo patrón sistémico** para el primer ciclo. No se perseguirá “cero incidencias”, sino:

`incidencia → patrón → solución sistémica → validación`.

## Wikimedia / media abierta

El soporte técnico de licencia, atribución y render directo está integrado. Antes de escalar cargas externas debe validarse el protocolo editorial: licencia concreta, autor, URL original, Fuente, crédito, enlace de atribución, derechos y uso como portada o galería.

Que una imagen esté alojada en Wikimedia no implica automáticamente que pueda publicarse.

## Decisiones HC

Consultar el registro vigente antes de asignar nuevos números. Revisar la formalización de:

- separación Front público ↔ Panel;
- autoridad pública stateless;
- protocolo visual de directorios;
- importación masiva;
- Salud del grafo;
- media externa licenciada;
- atribución y derechos;
- arquitectura de Extraordinarias.

## #49 · Importador documental asistido

Estado: **⚪ APARCADA**.

Reglas:

- no fusionar;
- no actualizar ahora;
- no aplicar sus migraciones por inercia;
- no salvar su rama por coste hundido;
- no utilizarla como base técnica.

La importación masiva vigente tiene su propia arquitectura. Si en el futuro se recupera el flujo `URL → extracción → IA → propuesta → revisión humana`, debe reconstruirse sobre el `main` vigente y el importador actual. #49 podrá entonces cerrarse como implementación histórica superada.

## Regla para «¿Qué toca?»

1. Refrescar GitHub, Vercel y Supabase.
2. Consultar esta secuencia.
3. Descartar los pasos ya cerrados.
4. Devolver **una única acción ejecutable**.

**Siguiente acción actual: obtener la fotografía de Salud del grafo, priorizarla por patrón y seleccionar un solo patrón sistémico para el primer ciclo.**
