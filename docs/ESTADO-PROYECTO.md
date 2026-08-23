# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas. Este documento resume el estado vigente y las reglas operativas; no sustituye la comprobación previa de las herramientas.

## Baseline operativo verificado

- Revisión: **2026-08-24 · madrugada (CEST)**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` verificado: `ea6b5ff3548d7089b05e7737693daad230207947` — **Cierra las regresiones estructurales del smoke público (#298)**.
- Proyecto Vercel: `base-cofrade`.
- Producción verificada: **READY** en `dpl_5X3Hgx9ViWT1wzKHMoseTm4hNLcL`, alineada con `ea6b5ff3548d7089b05e7737693daad230207947`.
- Runtime del deployment de cierre: **sin logs `error` / `fatal`** tras las consultas de producción.
- Agregación de errores de Vercel en la última hora comprobada: **0 errores de runtime**.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY** en la última comprobación aplicable.
- El cierre #298 no incorpora migraciones, cambios de datos, RLS ni mutaciones manuales en Supabase.
- Migraciones de Personas reconciliadas entre Git y Supabase:
  - `20260823211405_public_agent_relation_integrity`;
  - `20260823211610_harden_public_agent_relations`.
- PR estructural histórica: **#49 · Importador documental asistido** → **⚪ APARCADA** y no utilizable como base técnica.

Los SHA, deployments y estados anteriores son una fotografía operativa. Antes de cualquier tarea significativa deben refrescarse GitHub, Vercel y Supabase cuando corresponda.

## Estado de la fase actual

### Reconciliación del registro

**ESTADO-PROYECTO → 🟢 SINCRONIZADO**.

### Arquitectura pública / separación Front ↔ Panel

**ARQUITECTURA PÚBLICA / FRONT ↔ PANEL → 🟢 CERRADA**.

Cortes incluidos en el baseline:

- Home → **🟢 CERRADO**.
- Hermandades → **🟢 CERRADO**.
- Imágenes → **🟢 CERRADO**.
- Pasos → **🟢 CERRADO**.
- Bandas → **🟢 CERRADO**.
- Extraordinarias → **🟢 CERRADO**.
- Tira del hilo → **🟢 CERRADO**.
- Marchas → **🟢 CERRADO**.
- Personas / agentes → **🟢 CERRADO**.

La arquitectura pública queda fijada como baseline técnico. Cualquier nueva superficie pública debe respetar desde su diseño la misma frontera y no reabrir estos cortes salvo regresión real demostrada.

## Smoke transversal post-arquitectura

**BASELINE PÚBLICO POST-ARQUITECTURA → 🟢 VALIDADO**.

El primer recorrido transversal detectó cuatro regresiones comunes. No se declaró un cierre ficticio: se corrigieron de forma sistémica mediante la PR **#298**, se añadió una barrera automática y se repitió el smoke sobre el deployment real de producción `dpl_5X3Hgx9ViWT1wzKHMoseTm4hNLcL`.

### Regresiones cerradas por #298

1. **Landmarks semánticos**
   - `app/layout.js` conserva el único landmark `<main>` de la aplicación;
   - las páginas interiores utilizan contenedores neutros;
   - la regresión queda protegida transversalmente en `test/public-semantic-smoke-boundary.test.mjs`.

2. **Navegación de Web y redes**
   - la navegación de las fichas de Hermandad y `OfficialLinks` comparten la ancla canónica `#enlaces-de-interes`;
   - se elimina el enlace heredado roto `#enlaces-oficiales`.

3. **Acompañamiento musical de Hermandades**
   - se elimina la presentación heredada duplicada;
   - `BrotherhoodOwnBands` conserva la única sección pública del acompañamiento actual;
   - queda un solo `id="acompanamiento-musical"` por documento.

4. **Fuentes sin URL**
   - las fuentes externas continúan siendo enlaces;
   - las aportaciones directas o fuentes sin dirección se representan como filas documentales no interactivas;
   - ya no reciben `target`, seguimiento de apertura ni semántica de enlace externo.

Validación del corte funcional:

`regresión automática → npm test → npm run build → preview READY → fusión #298 → producción READY → smoke HTTP real → runtime limpio`.

### Home

Verificados en el recorrido transversal:

- Hero;
- Tira del hilo;
- Hoy;
- Extraordinarias;
- Marcha del día;
- Últimos hilos;
- `Entra por donde quieras`;
- contadores públicos del grafo;
- contratos y reglas responsive integradas.

La Home conserva los módulos de Home 2.7 y Home 2.8.

### Directorios

HTTP 200 y contenido público correcto en:

- `/hermandades`;
- `/imagenes`;
- `/pasos`;
- `/bandas`;
- `/extraordinarias`.

Se comprobaron búsqueda, filtros publicados, segmentación territorial o tipológica y separación de próximas y celebradas en Extraordinarias.

### Fichas y relaciones cruzadas

Muestras finales comprobadas sobre el deployment de cierre:

- Hermandad: `/hermandades/el-baratillo`;
- Imagen Wikimedia: `/imagenes/maria-santisima-mayor-dolor-traspaso-gran-poder`;
- Paso: `/pasos/paso-de-la-piedad`;
- Banda: `/bandas/banda-del-sol`;
- Extraordinaria: `/extraordinarias/gerena-sangre-2026`.

Las cinco responden HTTP 200 y conservan, cuando corresponde:

- Hero y metadatos;
- canonical y datos estructurados;
- relaciones cruzadas y `Tira del hilo`;
- responsables, acompañamientos y patrimonio;
- discografía y contenidos musicales;
- media y créditos;
- Fuentes documentales.

En la ficha de El Baratillo se verificó expresamente:

- un único landmark `<main>` global;
- una sola sección de acompañamiento musical;
- navegación `Web y redes` hacia `#enlaces-de-interes`;
- aportación directa sin URL como fila no interactiva;
- fuentes externas conservadas como enlaces.

### Extraordinarias

Verificados:

- directorio `/extraordinarias`;
- separación de próximas y celebradas;
- búsqueda y filtros;
- guía real `/extraordinarias/gerena-sangre-2026`;
- horarios;
- recorrido;
- acompañamiento musical;
- otros momentos musicales;
- portada alojada en Supabase;
- Fuentes externas documentadas;
- estructura semántica sin un segundo `<main>`.

### Media

Verificados caminos reales de publicación:

- fotografía local o alojada en Supabase;
- fotografía servida directamente desde Wikimedia Commons;
- portada y metadato social;
- crédito público;
- licencia y enlace de procedencia cuando corresponde.

La muestra Wikimedia final conserva render directo desde `upload.wikimedia.org`, crédito `Josecarlosrosadom`, licencia `CC0 1.0` y enlace a la ficha original de Commons.

No se considera que el mero alojamiento en Wikimedia autorice automáticamente una imagen; la licencia concreta continúa siendo obligatoria.

### Tira del hilo

Comprobado en el baseline:

- buscador público de entidades bajo lectura stateless;
- resultados públicos de Hermandades, Marchas y Personas;
- estado vacío documentado para consultas sin coincidencias;
- relaciones `Tira del hilo` renderizadas en Hermandad, Imagen, Paso y Banda;
- evidencia y Fuentes públicas preservadas en las fichas relacionadas;
- comportamiento `not_documented` protegido cuando una consulta no puede resolverse con datos publicados.

**Limitación documentada:** el flujo conversacional completo usa `POST /api/tira-del-hilo` desde navegador cliente. El entorno de auditoría disponible no permitió ejecutar una interacción visual completa contra producción. No se declara una simulación inexistente: el cierre se apoya en lecturas HTTP reales, autocompletado público, relaciones renderizadas, contrato del endpoint y barreras automáticas integradas.

### Responsive / móvil

Se han validado:

- markup y contratos responsive presentes en producción;
- reglas y `sizes` móviles de Home, directorios, fichas y Extraordinarias;
- barreras de regresión responsive existentes;
- compilación y render del producto real.

El entorno de auditoría no sustituyó una revisión visual manual en un dispositivo físico. Esta limitación no bloquea el baseline técnico, pero debe mantenerse separada de futuras revisiones puramente visuales o de usabilidad.

### Vercel

- CI de la PR #298 → **correcto**;
- pruebas automatizadas → **correctas**;
- build de Next.js → **correcto**;
- preview → **READY**;
- producción `dpl_5X3Hgx9ViWT1wzKHMoseTm4hNLcL` → **READY**;
- muestras públicas finales → **HTTP 200**;
- runtime tras el smoke → **0 logs `error` / `fatal`**;
- agregación de errores de la última hora → **0 errores**.

Conclusión: **SMOKE TRANSVERSAL DE CIERRE → 🟢 CERRADO**.

## Personas / agentes · autoridad pública → 🟢 cerrado

PR **#287 · Cierra la autoridad pública de Personas y agentes** → **fusionada**.

Hallazgos y cambio funcional:

- `lib/supabase/search-live.js` y `lib/supabase/search.js` dependían del cliente cookie-aware aunque alimentaban búsquedas públicas;
- ambos usan ahora el cliente público stateless;
- las relaciones públicas con autores, compositores, capataces, restauradores, artesanos, responsables patrimoniales y agentes relacionados quedan condicionadas a extremos publicables;
- no se creó una ruta pública nueva para Personas ni se alteró el modelo de datos.

PR **#289 · Reconcilia el cierre final de Personas con Supabase** → **fusionada**.

Cierre de reconciliación:

- versiona en Git la migración remota `20260823211610_harden_public_agent_relations.sql`, aplicada previamente en Supabase;
- amplía `test/agent-public-authority-boundary.test.mjs` para impedir regresiones hacia `@/lib/supabase/server`, `@supabase/ssr`, `next/headers` o `cookies()` en las superficies públicas auditadas;
- protege `agent_roles`, `band_agents`, autorías de Imágenes, autores de Marchas, responsables de Pasos, fases, intervenciones, novedades patrimoniales y relaciones genéricas.

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
- el Panel conserva las políticas y la sesión autenticada necesarias para edición, borradores y publicación;
- el layout raíz es el propietario del landmark principal de la aplicación;
- un mismo contenido público no debe montarse por dos caminos heredados simultáneos;
- una Fuente sin URL no debe simular ser un enlace externo.

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
- **#293 · navegación del Panel** → fusionada.
- **#294 · navegación rápida global del Panel** → fusionada.
- **#296 · jerarquía y densidad de formularios del Panel** → fusionada.
- **#298 · cierre de regresiones estructurales del smoke público** → fusionada.

## Orden exacto de Dirección

1. Reconciliar `ESTADO-PROYECTO` → **🟢 CERRADO**.
2. Auditar y cerrar Personas / agentes → **🟢 CERRADO**.
3. Declarar Arquitectura pública / Front ↔ Panel → **🟢 CERRADO**.
4. Ejecutar y cerrar el smoke transversal → **🟢 CERRADO**.
5. **Obtener y priorizar la primera cola de Salud del grafo → SIGUIENTE ACCIÓN ÚNICA**.
6. Resolver un único patrón sistémico completo y medir su reducción.
7. Auditar el protocolo editorial de Wikimedia / media abierta.
8. Sincronizar el registro de decisiones HC con la arquitectura real.
9. Mantener #49 aparcada.
10. Realizar una nueva fotografía global y elegir un solo gran frente.

**No abrir una nueva fase estructural antes de completar esta secuencia.**

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
- arquitectura de Extraordinarias;
- semántica estructural y accesibilidad del layout público.

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
