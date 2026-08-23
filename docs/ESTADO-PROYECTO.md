# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas. Este documento resume el estado vigente y las reglas operativas; no sustituye la comprobación previa de las herramientas.

## Baseline operativo verificado

- Revisión: **2026-08-23 · noche (CEST)**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` al cerrar Personas / agentes: `966c37afb2055c5d050853a08c181c1c1750875c` — **Reconcilia el cierre final de Personas con Supabase (#289)**.
- Proyecto Vercel: `base-cofrade`.
- Producción verificada: **READY** en `dpl_G3WY7a5y4EK14zAawgM2WU5qe1Pb`, alineada con `966c37afb2055c5d050853a08c181c1c1750875c`.
- Smoke público de Personas: **HTTP 200** en ficha de Imagen, ficha de Paso y buscador de Tira del hilo.
- Runtime del deployment de cierre: **sin logs `error` / `fatal` tras los smokes**.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
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

## Orden exacto de Dirección

1. Reconciliar `ESTADO-PROYECTO` → **🟢 CERRADO**.
2. Auditar y cerrar Personas / agentes → **🟢 CERRADO**.
3. Declarar Arquitectura pública / Front ↔ Panel → **🟢 CERRADO con este corte documental**.
4. **Ejecutar smoke transversal de cierre → SIGUIENTE ACCIÓN ÚNICA**.
5. Obtener y priorizar la primera cola de Salud del grafo.
6. Resolver un único patrón sistémico completo y medir su reducción.
7. Auditar el protocolo editorial de Wikimedia / media abierta.
8. Sincronizar el registro de decisiones HC con la arquitectura real.
9. Mantener #49 aparcada.
10. Realizar una nueva fotografía global y elegir un solo gran frente.

**No abrir una nueva fase ni otro frente estructural antes de completar esta secuencia.**

## Siguiente control · smoke transversal de cierre

El siguiente paso debe validar el producto real, no reabrir arquitectura ya cerrada.

Comprobar:

### Home
- Hero;
- Tira del hilo;
- Hoy;
- Extraordinarias;
- Marcha del día;
- Últimos hilos;
- Entra por donde quieras;
- móvil especialmente.

### Directorios
- Hermandades;
- Imágenes;
- Pasos;
- Bandas;
- búsqueda;
- filtros;
- responsive.

### Fichas
- una Hermandad;
- una Imagen;
- un Paso;
- una Banda;
- relaciones cruzadas.

### Extraordinarias
- directorio;
- guía;
- música;
- horarios;
- Fuentes.

### Media
- fotografía local / Supabase;
- fotografía Wikimedia;
- atribución y licencia;
- enlace de procedencia;
- portada y galería.

### Tira del hilo
- consulta simple;
- consulta relacional;
- fuente / evidencia;
- respuesta sin resultado.

### Vercel
- deployment READY;
- ausencia de errores estructurales en runtime.

Resultado esperado:

**BASELINE PÚBLICO POST-ARQUITECTURA → 🟢 VALIDADO**.

## Después del smoke · Salud del grafo

Solo después del smoke transversal obtener una fotografía actual y clasificar incidencias:

- 🔴 prioritarias: relaciones rotas, huérfanos e incoherencias de publicación;
- 🟠 cobertura: ficha básica, autorías, responsables, acompañamientos y Fuentes;
- 🔵 enriquecimiento: escudos, logotipos, fotografías, multimedia y campos secundarios.

Dirección elegirá **un solo patrón sistémico**. No se perseguirá “cero incidencias”, sino el ciclo:

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

**Siguiente acción actual: ejecutar el smoke transversal de cierre del baseline público post-arquitectura.**
