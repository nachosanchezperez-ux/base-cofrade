# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas. Este documento resume el estado vigente y no sustituye la comprobación previa de las herramientas.

## Baseline operativo verificado

- Revisión: **2026-08-23 · noche (CEST)**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal funcional verificada: `966c37afb2055c5d050853a08c181c1c1750875c`.
- Último cierre funcional: **#289 · Reconcilia el cierre final de Personas con Supabase**.
- Proyecto Vercel: `base-cofrade`.
- Producción funcional: **READY** en `dpl_G3WY7a5y4EK14zAawgM2WU5qe1Pb`, alineada con `966c37afb2055c5d050853a08c181c1c1750875c`.
- Runtime del deployment final de Personas: **sin `error`/`fatal` tras smoke**.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
- Últimas migraciones remotas verificadas del cierre de Personas:
  - `20260823211405_public_agent_relation_integrity`;
  - `20260823211610_harden_public_agent_relations`.
- Única PR abierta observada antes de este corte documental: **#49 · Importador documental asistido**.
- #49 permanece **⚪ APARCADA** y no puede utilizarse como base técnica.

Los SHA y deployments son una fotografía. Antes de cualquier tarea significativa deben refrescarse GitHub, Vercel y Supabase cuando corresponda.

## Estado de la fase actual

### Arquitectura pública / separación Front ↔ Panel

**ARQUITECTURA PÚBLICA → 🟢 CERRADA**

- Home → **🟢 CERRADO**.
- Hermandades → **🟢 CERRADO**.
- Imágenes → **🟢 CERRADO**.
- Pasos → **🟢 CERRADO**.
- Bandas → **🟢 CERRADO**.
- Extraordinarias → **🟢 CERRADO**.
- Tira del hilo → **🟢 CERRADO**.
- Marchas → **🟢 CERRADO**.
- Personas / agentes → **🟢 CERRADO**.

Regla arquitectónica permanente:

```text
FRONT PÚBLICO
→ cliente Supabase stateless
→ rol anon
→ RLS / vistas security_invoker

PANEL
→ sesión editorial autenticada
```

No mezclar ambos contextos salvo necesidad técnica expresamente justificada, documentada y cubierta por regresión automática.

## Cierre de Personas / agentes

PR **#287 · Cierra la autoridad pública de Personas y agentes** → **🟢 FUSIONADA**.

- `lib/supabase/search-live.js` y `lib/supabase/search.js` dejan de depender del cliente cookie-aware y pasan a `@/lib/supabase/public`.
- Se añade `test/agent-public-authority-boundary.test.mjs`.
- Se versiona `20260823211405_public_agent_relation_integrity.sql`.
- Se corrige sistémicamente la visibilidad pública de autorías, intervenciones, personal de pasos, responsables de fases, responsables patrimoniales, autores de marchas y relaciones genéricas.
- No se publica ningún agente `draft` para resolver el problema.

PR **#289 · Reconcilia el cierre final de Personas con Supabase** → **🟢 FUSIONADA**.

- Versiona la migración remota `20260823211610_harden_public_agent_relations.sql`.
- Amplía la regresión para `agent_roles`, `band_agents` y el resto de superficies auditadas.
- Git y Supabase quedan reconciliados; no ejecuta SQL adicional ni cambia datos.

Caso sistémico detectado y resuelto durante el corte:

- una fase publicada del paso de palio del Mayor Dolor y Traspaso referenciaba a un agente `draft`;
- bajo `anon` el nombre no era visible por RLS de `entities`, pero el UUID de la relación sí podía aparecer;
- después del endurecimiento, la fase continúa publicada pero la relación hacia el agente no publicable no se expone;
- no se introducen excepciones por entidad ni publicación automática.

Verificación del cierre:

- CI de #287 y reconciliación final: correctos;
- preview: READY;
- producción final: `dpl_G3WY7a5y4EK14zAawgM2WU5qe1Pb` READY;
- `/pregunta`: HTTP 200;
- búsqueda pública de `Cristóbal López Gándara`: agente publicado y resultados relacionados correctos;
- paso del Mayor Dolor y Traspaso: HTTP 200;
- imagen representativa del Gran Poder: HTTP 200;
- Banda de Las Cigarreras: HTTP 200;
- runtime posterior: sin `error`/`fatal`.

## Cierres recientes incorporados

- #272 · Bandas · autoridad pública → fusionada.
- #273/#274 · Extraordinarias · autoridad pública → integradas y validadas.
- #280 · Tira del hilo · autoridad pública → fusionada.
- #281 · Marchas · autoridad pública → fusionada.
- #282 · Wikimedia Commons · licencias y atribución → fusionada.
- #283 · Home 2.7 → fusionada.
- #284 · Wikimedia Commons · render directo → fusionada.
- #285 · Home 2.8 → fusionada.
- #287 · Personas / agentes · autoridad pública → fusionada.
- #289 · reconciliación final Personas / Supabase → fusionada.

## Orden exacto de Dirección desde este punto

1. Arquitectura pública / Front ↔ Panel → **🟢 CERRADA**.
2. **Smoke transversal de cierre → ÚNICA ACCIÓN ACTIVA**.
3. Obtener y priorizar la primera cola de Salud del grafo.
4. Resolver un único patrón sistémico completo y medir su reducción.
5. Auditar el protocolo editorial de Wikimedia / media abierta.
6. Sincronizar el registro de decisiones HC con la arquitectura real.
7. Mantener #49 aparcada.
8. Realizar una nueva fotografía global y elegir un solo gran frente.

**No abrir una nueva fase ni otro frente estructural antes de completar esta secuencia.**

## Smoke transversal · alcance obligatorio

Validar el producto real en producción:

- `/`;
- `/directorio`;
- `/hermandades`;
- `/imagenes`;
- `/pasos`;
- `/bandas`;
- `/extraordinarias`;
- una ficha representativa de cada familia;
- `/pregunta`;
- `/api/tira-del-hilo/search` con una persona publicada;
- media local y Wikimedia en superficies representativas;
- 404/ausencia de rutas obsoletas cuando corresponda;
- runtime `error`/`fatal` del deployment final.

No confundir validación HTML/estructural con QA visual pixel-perfect o responsive si no se utiliza navegador visual.

## Salud del grafo · siguiente fase tras smoke

Obtener una fotografía actual y clasificar incidencias:

- 🔴 prioritarias: relaciones rotas, huérfanos e incoherencias de publicación;
- 🟠 cobertura: ficha básica, autorías, responsables, acompañamientos y Fuentes;
- 🔵 enriquecimiento: escudos, logotipos, fotografías, multimedia y campos secundarios.

Dirección elegirá **un solo patrón sistémico**. No se perseguirá “cero incidencias”, sino:

`incidencia → patrón → solución sistémica → validación → nueva medición`.

## Wikimedia / media abierta

El soporte técnico de licencia, atribución y render directo está integrado. Antes de escalar cargas externas debe validarse el protocolo editorial: licencia concreta, autor, URL original, Fuente, crédito, enlace de atribución, derechos y uso como portada o galería.

Que una imagen esté alojada en Wikimedia no implica automáticamente que pueda publicarse.

## Decisiones HC

Consultar el registro vigente antes de asignar nuevos números. Revisar y formalizar únicamente si aún no están documentadas:

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

Si en el futuro se recupera el flujo `URL → extracción → IA → propuesta → revisión humana`, debe reconstruirse sobre el `main` vigente y el importador actual.

## Regla para «¿Qué toca?»

1. Refrescar GitHub, Vercel y Supabase.
2. Consultar esta secuencia.
3. Descartar los pasos ya cerrados.
4. Devolver una única acción ejecutable.

**Siguiente acción actual: ejecutar el smoke transversal de cierre de Arquitectura pública y registrar su resultado antes de abrir Salud del grafo.**
