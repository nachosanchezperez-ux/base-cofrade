# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas. Este documento resume el estado vigente; no sustituye la comprobación previa de las herramientas.

## Baseline operativo verificado

- Revisión: **2026-08-24 · madrugada (CEST)**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` verificado: `1b6e4ffd1a9b6049572d479fca532d0e5deb5742` — **Protege las relaciones nucleares del grafo (#301)**.
- Proyecto Vercel: `base-cofrade`.
- Producción verificada: **READY** en `dpl_DbAX7LsNq1smR7fn4JygtJafxwMQ`, alineada con `1b6e4ffd1a9b6049572d479fca532d0e5deb5742`.
- Runtime del deployment de cierre: **61 respuestas HTTP 200 y 0 logs `error` / `fatal`** en la comprobación posterior al smoke.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
- Últimas migraciones reconciliadas entre Git y Supabase:
  - `20260823230534_guard_core_public_relations`;
  - `20260823231543_guard_core_public_relations` · repetición idempotente representada en Git mediante marcador transparente;
  - `20260823231639_complete_core_relation_invariant`.
- Única PR estructural histórica abierta: **#49 · Importador documental asistido** → **⚪ APARCADA** y no utilizable como base técnica.

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

### Smoke transversal post-arquitectura

**BASELINE PÚBLICO POST-ARQUITECTURA → 🟢 VALIDADO**.

El smoke transversal quedó cerrado mediante #298 y documentado mediante #299. Se validaron:

- Home y sus módulos de Home 2.7 y Home 2.8;
- directorios de Hermandades, Imágenes, Pasos, Bandas y Extraordinarias;
- búsqueda, filtros y relaciones cruzadas;
- fichas representativas de Hermandad, Imagen, Paso, Banda y Extraordinaria;
- portada local/Supabase y fotografía Wikimedia;
- atribución, licencia y enlace de procedencia;
- Tira del hilo, evidencia y estado sin resultado;
- canonical, metadatos y datos estructurados;
- producción `READY` y runtime limpio.

Regresiones comunes cerradas por #298:

- un único landmark `<main>` global;
- ancla canónica `#enlaces-de-interes` para Web y redes;
- una sola presentación pública del acompañamiento musical de Hermandades;
- Fuentes sin URL representadas como filas documentales no interactivas.

Limitaciones conservadas con transparencia:

- la revisión técnica responsive no sustituye una validación visual manual en dispositivo físico;
- el entorno de auditoría no ejecutó la conversación completa `POST /api/tira-del-hilo` desde navegador, aunque sí validó su frontera pública, contratos, autocompletado, relaciones renderizadas y barreras automáticas.

Conclusión: **SMOKE TRANSVERSAL DE CIERRE → 🟢 CERRADO**.

## Personas / agentes · autoridad pública

**PERSONAS / AGENTES · AUTORIDAD PÚBLICA → 🟢 CERRADA**.

Cierre funcional:

- los buscadores y loaders públicos de Personas utilizan lectura stateless;
- autores, compositores, capataces, restauradores, artesanos y responsables patrimoniales solo se exponen mediante extremos publicables;
- RLS está activa en las superficies auditadas;
- las vistas públicas relevantes utilizan `security_invoker=true` cuando corresponde;
- las relaciones públicas inválidas bajo rol `anon` quedaron en cero;
- existe barrera automática contra regresiones hacia `@/lib/supabase/server`, `@supabase/ssr`, `next/headers` y `cookies()`.

PR de cierre: **#287**. Reconciliación final con Supabase: **#289**.

## Regla arquitectónica permanente

La separación canónica del proyecto es:

```text
FRONT PÚBLICO
→ lectura stateless / rol anon

PANEL
→ sesión editorial autenticada
```

Reglas permanentes:

- una lectura pública no debe depender de cookies, sesión editorial ni del cliente SSR autenticado;
- una relación pública solo puede exponer extremos publicables o utilizar un contrato de proyección pública expresamente diseñado y documentado;
- las vistas públicas deben respetar RLS, usando `security_invoker=true` cuando corresponda;
- el Panel conserva las políticas y la sesión autenticada necesarias para edición, borradores y publicación;
- el layout raíz es el propietario del landmark principal de la aplicación;
- un mismo contenido público no debe montarse por dos caminos heredados simultáneos;
- una Fuente sin URL no debe simular ser un enlace externo;
- una excepción estructural debe quedar justificada, documentada y protegida por regresión automática.

## Salud del grafo · primera fase operativa

**SALUD DEL GRAFO · FOTOGRAFÍA, PRIORIZACIÓN Y CICLO 1 → 🟢 CERRADOS**.

### Fotografía inicial

La primera cola se clasificó por patrón, no ficha por ficha.

#### 🔴 Prioritario

Se detectaron **6 relaciones Hermandad ↔ Paso publicadas con uno o ambos extremos todavía en borrador**. Estas relaciones no tenían un contrato de proyección pública desacoplada y constituían una incoherencia estructural real.

No se detectaron incoherencias equivalentes en:

- Hermandad ↔ Imagen → `0`;
- Imagen ↔ Paso → `0`.

#### 🟠 Cobertura con proyección deliberada

No se trataron como relaciones rotas:

- **58** acompañamientos musicales con extremos auxiliares en borrador: las 58 filas conservan los campos públicos necesarios;
- **23** dedicatorias musicales con destinatario canónico en borrador: las 23 conservan texto de dedicatoria y Fuente exacta.

Estas dos superficies cuentan con una proyección pública deliberada y documentada. No debían degradarse por aplicar mecánicamente la regla de las relaciones nucleares.

### Patrón sistémico seleccionado

> Una relación nuclear solo puede permanecer publicada cuando ambos extremos existen, conservan el tipo esperado y están publicados.

Ámbito:

- Hermandad ↔ Imagen;
- Hermandad ↔ Paso;
- Imagen ↔ Paso.

### Solución sistémica · PR #301

La PR **#301 · Protege las relaciones nucleares del grafo** quedó fusionada en `main`.

Incluye:

- `guard_core_relation_publication()` para degradar a `draft` cualquier intento de publicación incoherente;
- endurecimiento de las tres políticas públicas para comprobar ambos extremos;
- reconciliación de las seis relaciones detectadas sin borrar UUID ni Fuentes;
- dos bloqueos `FOR SHARE` durante la validación para cerrar la carrera con una despublicación concurrente;
- `demote_invalid_core_relations_after_entity_change()`;
- trigger sobre `entities` para degradar automáticamente las relaciones afectadas si un extremo publicado vuelve a borrador o cambia de tipo;
- barreras automáticas para publicación, lectura pública y cambio posterior de los extremos;
- marcador local transparente para representar la repetición idempotente registrada en el historial remoto, sin manipular manualmente `supabase_migrations.schema_migrations`.

### Validación

- funciones, triggers, RLS y migraciones presentes en Supabase;
- tres pruebas transaccionales reales con `ROLLBACK`, una por cada tabla nuclear;
- CI completo → **correcto**;
- preview → **READY**;
- producción → **READY**;
- smoke público de Paso y relaciones cruzadas → **HTTP 200**;
- runtime posterior → **61 respuestas 200 y 0 errores `error` / `fatal`**.

### Métrica final

```text
Relaciones nucleares incoherentes
6 → 0

Proyecciones deliberadas conservadas
Música: 58 / 58
Dedicatorias: 23 / 23
```

El objetivo no era perseguir cero incidencias en todo Hilo Cofrade, sino demostrar el ciclo continuo:

`incidencia → patrón → solución sistémica → validación`.

Conclusión: **PRIMER CICLO OPERATIVO DE SALUD DEL GRAFO → 🟢 CERRADO**.

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
- **#299 · cierre documental del smoke transversal** → fusionada.
- **#301 · primer patrón sistémico de Salud del grafo** → fusionada.

## Orden exacto de Dirección

1. Reconciliar `ESTADO-PROYECTO` → **🟢 CERRADO**.
2. Auditar y cerrar Personas / agentes → **🟢 CERRADO**.
3. Declarar Arquitectura pública / Front ↔ Panel → **🟢 CERRADO**.
4. Ejecutar y cerrar el smoke transversal → **🟢 CERRADO**.
5. Obtener y priorizar la primera cola de Salud del grafo → **🟢 CERRADO**.
6. Resolver un único patrón sistémico completo y medir su reducción → **🟢 CERRADO**.
7. **Auditar el protocolo editorial de Wikimedia / media abierta → SIGUIENTE ACCIÓN ÚNICA**.
8. Sincronizar el registro de decisiones HC con la arquitectura real.
9. Mantener #49 aparcada.
10. Realizar una nueva fotografía global y elegir un solo gran frente.

**No abrir una nueva fase estructural antes de completar esta secuencia.**

## Siguiente acción · Wikimedia / media abierta

El soporte técnico de licencia, atribución y render directo está integrado. Ahora debe auditarse el protocolo editorial antes de escalar cargas externas.

Comprobar:

- licencias admisibles y licencias excluidas;
- autor o creador del recurso;
- licencia exacta y versión;
- URL del archivo original;
- página de procedencia;
- Fuente documental;
- crédito público;
- enlace de atribución;
- estado de derechos y permiso;
- uso como portada o como galería;
- comportamiento cuando falta cualquiera de los datos obligatorios;
- compatibilidad del Panel, Supabase y Front con el mismo contrato.

Regla de partida:

> Que una imagen esté alojada en Wikimedia no implica automáticamente que pueda publicarse. La licencia concreta y sus obligaciones mandan.

Resultado esperado:

**PROTOCOLO EDITORIAL WIKIMEDIA / MEDIA ABIERTA → 🟢 VALIDADO O COMPLETADO**.

## Decisiones HC

Después de Wikimedia/media debe consultarse el registro vigente antes de asignar nuevos números. Revisar la formalización de:

- separación Front público ↔ Panel;
- autoridad pública stateless;
- protocolo visual de directorios;
- importación masiva;
- Salud del grafo como cola editorial;
- media externa licenciada;
- atribución y derechos;
- arquitectura de Extraordinarias;
- semántica estructural y accesibilidad del layout público.

No asignar números HC por intuición ni sin revisar previamente el registro canónico.

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
3. Descartar automáticamente los pasos ya cerrados.
4. Devolver **una única acción ejecutable**.

**Siguiente acción actual: auditar y cerrar el protocolo editorial de Wikimedia / media abierta.**
