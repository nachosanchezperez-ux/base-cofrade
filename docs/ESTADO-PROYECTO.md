# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas. Este documento resume el estado vigente y las reglas operativas; no sustituye la comprobación previa de las herramientas.

## Baseline operativo verificado

- Revisión: **2026-08-23 · noche (CEST)**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` verificado al iniciar este corte: `9723efa147ec7ad2b5ca3e617d83a0f7d6902f9c` — **Home 2.8: pulido visual final y accesibilidad (#285)**.
- Proyecto Vercel: `base-cofrade`.
- Producción verificada: **READY** en `dpl_7cDzH9Vi4yPXvoW8ATQKnkvzNHTR`, alineada con `9723efa147ec7ad2b5ca3e617d83a0f7d6902f9c`.
- Runtime de producción, últimas seis horas verificadas: **sin errores detectados**.
- Supabase: `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) → **ACTIVE_HEALTHY**.
- Única PR abierta observada: **#49 · Importador documental asistido**.
- #49 permanece **⚪ APARCADA** y no puede utilizarse como base técnica.

Los SHA, deployments y estados anteriores son una fotografía operativa. Antes de cualquier tarea significativa deben refrescarse GitHub, Vercel y Supabase cuando corresponda.

## Estado de la fase actual

### Reconciliación del registro

**ESTADO-PROYECTO → 🟢 SINCRONIZADO** con el estado real posterior a Home 2.8.

### Arquitectura pública / separación Front ↔ Panel

**ARQUITECTURA PÚBLICA → EN CURSO**

- Home → **🟢 CERRADO**.
- Hermandades → **🟢 CERRADO**.
- Imágenes → **🟢 CERRADO**.
- Pasos → **🟢 CERRADO**.
- Bandas → **🟢 CERRADO**.
- Extraordinarias → **🟢 CERRADO**.
- Tira del hilo → **🟢 CERRADO**.
- Marchas → **🟢 CERRADO**.
- **Personas / agentes → 🔴 ÚLTIMO CORTE PENDIENTE**.

No declarar cerrada la Arquitectura pública hasta completar la auditoría, regresión, preview, smoke, producción y runtime de Personas / agentes.

## Cierres recientes incorporados al baseline

- **#272 · Bandas · autoridad pública** → fusionada.
- **#273 · Extraordinarias · autoridad pública** → fusionada.
- **#280 · Tira del hilo · autoridad pública** → fusionada.
- **#281 · Marchas · autoridad pública** → fusionada.
- **#282 · Wikimedia Commons · licencias y atribución** → fusionada.
- **#283 · Home 2.7** → fusionada.
- **#284 · Wikimedia Commons · render directo** → fusionada.
- **#285 · Home 2.8** → fusionada.

## Orden exacto de Dirección

1. Reconciliar `ESTADO-PROYECTO` → **🟢 CERRADO con este corte documental**.
2. **Auditar y cerrar Personas / agentes → ÚNICO FRENTE ESTRUCTURAL ACTIVO**.
3. Declarar Arquitectura pública / Front ↔ Panel → **🟢 CERRADA**.
4. Ejecutar smoke transversal de cierre.
5. Obtener y priorizar la primera cola de Salud del grafo.
6. Resolver un único patrón sistémico completo y medir su reducción.
7. Auditar el protocolo editorial de Wikimedia / media abierta.
8. Sincronizar el registro de decisiones HC con la arquitectura real.
9. Mantener #49 aparcada.
10. Realizar una nueva fotografía global y elegir un solo gran frente.

**No abrir una nueva fase ni otro frente estructural antes de completar esta secuencia.**

## Único frente estructural activo

### Personas / agentes · autoridad pública

Responsable principal: **Hilo Tech**, con validación de Hilo Supabase, Hilo Datos y Hilo QA cuando proceda.

Auditar de extremo a extremo:

- loaders y superficies públicas de Personas / agentes;
- relaciones Persona ↔ Paso;
- autorías de Imágenes;
- compositores de Marchas;
- restauradores, artesanos y profesionales;
- capataces y responsabilidades patrimoniales;
- Tira del hilo y presencia relacional en fichas públicas;
- cualquier directorio, componente, vista o RPC que consuma `agents`.

Buscar dependencias públicas de:

- `@/lib/supabase/server`;
- `@supabase/ssr`;
- `next/headers`;
- `cookies()`;
- sesión editorial autenticada.

Comprobar en Supabase:

- RLS activa;
- `SELECT` de `anon` correcto;
- vistas con `security_invoker=true` cuando corresponda;
- ausencia de registros `draft` en superficies públicas;
- relaciones públicas únicamente hacia extremos publicables.

Si existe una dependencia cookie-aware, migrar únicamente la lectura pública necesaria a `createPublicClient()`. No cambiar el modelo, los datos, las rutas, las entidades ni hacer un refactor general.

La definición de cierre es:

`RLS → anon → regresión automática → tests → build → preview → smoke público → producción → runtime`.

## Regla arquitectónica permanente

La separación canónica del proyecto es:

```text
FRONT PÚBLICO
→ lectura stateless / rol anon

PANEL
→ sesión editorial autenticada
```

No mezclar ambos contextos salvo necesidad técnica expresamente justificada, documentada y protegida por una barrera de regresión.

## Restricción temporal de carriles

Mientras Personas / agentes sea el último corte pendiente:

- no abrir otro frente estructural;
- no introducir nuevas tablas, vistas, RPC o rutas ajenas a ese cierre;
- no iniciar una nueva campaña masiva de enriquecimiento;
- no cambiar contratos de datos compartidos sin coordinación del Orquestador;
- solo se permiten correcciones urgentes y claramente no solapadas.

Carril A tiene prioridad absoluta. Cualquier carencia descubierta por Producto o Contenido debe elevarse al Orquestador y esperar su turno.

## Próximos controles después de Personas

### Cierre formal de Arquitectura pública

Actualizar este registro para declarar cerrados conjuntamente:

- Home;
- Hermandades;
- Imágenes;
- Pasos;
- Bandas;
- Extraordinarias;
- Tira del hilo;
- Marchas;
- Personas / agentes.

### Smoke transversal

Validar el producto real en Home, directorios, fichas, Extraordinarias, media local/Wikimedia, Tira del hilo, responsive, producción y runtime.

### Salud del grafo

Obtener una fotografía actual y clasificar incidencias:

- 🔴 prioritarias: relaciones rotas, huérfanos e incoherencias de publicación;
- 🟠 cobertura: ficha básica, autorías, responsables, acompañamientos y Fuentes;
- 🔵 enriquecimiento: escudos, logotipos, fotografías, multimedia y campos secundarios.

Dirección elegirá **un solo patrón sistémico**. No se perseguirá “cero incidencias”, sino el ciclo:

`incidencia → patrón → solución sistémica → validación`.

### Wikimedia / media abierta

El soporte técnico de licencia, atribución y render directo está integrado. Antes de escalar cargas externas debe validarse el protocolo editorial: licencia concreta, autor, URL original, Fuente, crédito, enlace de atribución, derechos y uso como portada o galería.

Que una imagen esté alojada en Wikimedia no implica automáticamente que pueda publicarse.

### Decisiones HC

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

**Siguiente acción actual: auditar y cerrar Personas / agentes de extremo a extremo.**
