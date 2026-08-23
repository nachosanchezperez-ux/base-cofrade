# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas. Este documento resume decisiones vigentes; no es un diario de commits.

## Baseline vigente

- Fecha de revisión: **2026-08-23**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main`: `c577ae24073cbff8a35963101d495437e263988a`.
- Último frente funcional integrado: **#257 · Completa la autoridad pública relacional de Hermandades**.
- Proyecto Vercel: `base-cofrade`.
- Producción: **READY** en `dpl_HJubBDVLcYoBHC46RsF83aSStXdr`, alineada con el corte de Hermandades.
- Supabase: proyecto `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) **ACTIVE_HEALTHY**.
- Última migración remota verificada: `20260823134318_mass_import_relational_integrity`.

Antes de cada tarea significativa el Orquestador debe refrescar `main`, PR abiertas, Vercel y Supabase cuando proceda. Los identificadores anteriores son un baseline, no una referencia permanente.

## Secuencia de Dirección activa

La fase actual es de consolidación. No abrir nuevos frentes estructurales fuera de esta secuencia sin una razón explícita.

1. Smoke transversal de producción → **🟢 CERRADO**.
2. Directorio unificado → **🟢 CERRADO**.
3. Fichas de Hermandad → **🟢 CERRADO**.
4. Limpieza del backlog estructural → **🟢 CERRADO**.
5. Auditoría de carga masiva / cargas relacionales → **🟢 CERRADO**.
6. **Arquitectura pública / separación Front ↔ Panel → EN CURSO**.
   - Home → **🟢 CERRADO**.
   - Hermandades → **🟢 CERRADO**.
   - **Imágenes → SIGUIENTE CORTE**.
   - Pasos.
   - Bandas.
   - Extraordinarias.
   - Marchas.
   - Personas / agentes.
7. Salud del grafo.
8. Registro y formalización de decisiones HC.
9. Elegir un único siguiente gran frente.

## Estado del backlog estructural

El antiguo conjunto de PR paralelas quedó resuelto. Directorio, Extraordinarias responsive, cabecera de Bandas, `También en Hilo Cofrade`, Sede y visita y autoridad pública de Hermandades forman parte del `main` canónico.

- **#168 · Tira del hilo 2.11** → cerrada por superada; su intención está absorbida por la arquitectura actual.
- **#49 · Importador documental MVP** → aparcada. No fusionar ni reutilizar su rama como base. Si se recupera la experiencia URL → análisis → propuesta → revisión, debe reconstruirse desde el `main` vigente.

Regla permanente: no conservar ramas antiguas por coste hundido. Si la idea sigue siendo válida y la rama ha caducado, reconstruir sobre el `main` real.

## Arquitectura pública

Objetivo: las páginas públicas deben leer datos mediante un cliente Supabase público, stateless y explícito, sin depender de cookies o de la sesión editorial del Panel.

### Home → 🟢 cerrada

- Cadena pública basada en `lib/supabase/public-server.js`.
- Sin `@supabase/ssr` ni `next/headers` en los loaders públicos.
- RLS y vistas `security_invoker` comprobadas.
- Prueba de arquitectura `test/home-public-authority.test.mjs` como barrera de regresión.
- Smoke público y producción verificados.

### Hermandades → 🟢 cerrada

El corte se cerró en dos pasos complementarios:

- **#256** migró a cliente público stateless los loaders principales:
  - `lib/supabase/brotherhoods.js`;
  - `lib/supabase/brotherhood-display.js`;
  - `lib/supabase/brotherhood-musical-heritage.js`.
- **#257** eliminó la última dependencia cookie-aware detectada en:
  - `components/BrotherhoodRelationalExtras.js`;
  y amplió la barrera de regresión a `RelationalThread` y `relational-presence`.

Verificaciones realizadas:

- tablas consumidas por la ficha: RLS activa y lectura pública para `anon`;
- `current_step_personnel`: `security_invoker=true` y lectura anónima;
- CI de #257: **success**;
- preview Vercel: **READY**;
- producción: **READY**;
- smoke SQL con rol `anon`: San Benito, El Baratillo y La Asunción de Cantillana devuelven imágenes, pasos y acompañamientos;
- smoke HTTP de producción: San Benito, El Baratillo y La Asunción de Cantillana → **200**;
- runtime del deployment tras los smokes: sin logs `error` ni `fatal`.

No se modificaron datos, esquema, RLS, UI ni Panel para cerrar este corte.

### Siguiente corte: Imágenes

Método obligatorio:

1. localizar todos los loaders/componentes usados por `/imagenes` y `/imagenes/[slug]`;
2. identificar dependencias de `@/lib/supabase/server`, `@supabase/ssr`, `next/headers` o sesión editorial;
3. comprobar RLS, vistas y funciones implicadas;
4. migrar únicamente las lecturas públicas necesarias a cliente público explícito;
5. añadir barrera de regresión;
6. CI + preview;
7. smoke público sin sesión;
8. producción + runtime.

## Integridad de datos e importación

La auditoría relacional reciente consolidó duplicados de Cristo de la Corona y Escolanía Salesiana, normalizó enlaces de Fuentes y añadió guardas genéricas para:

- impedir que un mismo paso procesional tenga dos Hermandades vigentes simultáneamente sin cierre temporal;
- impedir recrear una banda cuando su nombre coincide con una denominación vigente de otra formación del mismo municipio.

Migración canónica aplicada y versionada:

- `20260823134318_mass_import_relational_integrity.sql`.

El importador masivo vigente utiliza `bulk_imports` / `bulk_import_items`. En la última auditoría aún no existían lotes reales aplicados desde esa interfaz; las cargas recientes habían entrado principalmente mediante migraciones o semillas. No declarar el importador como validado para volumen alto hasta ejecutar un lote real controlado y auditarlo de extremo a extremo.

## Deuda técnica activa · no abrir como frente salvo prioridad

Estos puntos están registrados, pero **no desplazan el siguiente corte de Imágenes** salvo incidencia:

- Panel multimedia: se registraron respuestas `413 Body exceeded 1 MB limit` en `/panel/bandas/[id]/multimedia`; revisar estrategia de subida antes de una carga intensiva de fotografías.
- Supabase: auditar funciones `SECURITY DEFINER`, especialmente `sync_music_accompaniment_public_location()` ejecutable por `anon`.
- Supabase Auth: revisar activación de protección frente a contraseñas filtradas.
- Rendimiento: existen foreign keys sin índice y políticas RLS permisivas duplicadas; tratar en una fase específica de performance, no mediante cambios aislados.
- Importador documental antiguo: `document_imports` y funciones asociadas permanecen en el remoto sin uso real; auditar consumidores y retirar mediante migración limpia si se confirma que son residuales.

## Zonas sensibles permanentes

### Hermandades

- No añadir lógica específica por slug para resolver casos de ficha.
- Mantener Patrimonio general separado de Patrimonio musical.
- Sede canónica es un nodo `place`, no texto duplicado por Hermandad.
- Las lecturas públicas no deben volver a depender de sesión/cookies.

### Directorios

`/directorio` es la arquitectura canónica. Reutilizar sus familias, filtros y segmentación; no crear listados paralelos.

### Tira del hilo

La arquitectura integrada es la única fuente de verdad. No crear una segunda lógica de grafo paralela.

### Datos

- Reutilizar entidades canónicas antes de crear nuevas.
- Preservar IDs, relaciones, fuentes e históricos.
- No degradar entidades reales a texto libre cuando existe relación estructurada.
- Resolver identidad por contexto; no imponer unicidad global de nombres cuando existen homónimos legítimos.

## Protocolo de nueva tarea

### Antes

- [ ] Leer `docs/HILO-ORQUESTADOR.md` y este registro.
- [ ] Refrescar `main` y PR abiertas.
- [ ] Detectar archivos y áreas compartidas.
- [ ] Comprobar Vercel.
- [ ] Comprobar Supabase si afecta a datos, RLS o esquema.
- [ ] Clasificar riesgo y responsable.

### Durante

- [ ] Mantener el cambio aislado.
- [ ] Evitar hardcodes y excepciones por entidad.
- [ ] Preservar IDs, relaciones e históricos.
- [ ] No duplicar modelos ni fuentes de autoridad.

### Antes de integrar

- [ ] Reconciliar con el `main` real.
- [ ] Ejecutar pruebas y build/CI.
- [ ] Revisar preview.
- [ ] Revisar responsive si hay UI.
- [ ] Verificar datos/relaciones si procede.

### Después

- [ ] Confirmar PR/`main` final.
- [ ] Confirmar producción.
- [ ] Revisar runtime.
- [ ] Actualizar este documento solo cuando cambien decisiones futuras.

## Regla para «¿Qué toca ahora?»

No generar una lluvia de ideas. Refrescar el estado, localizar el punto de la secuencia y devolver una sola acción ejecutable.

**Siguiente acción actual: auditar Imágenes de extremo a extremo para eliminar cualquier dependencia pública de sesión/cookies y dejar una barrera de regresión equivalente a Home y Hermandades.**
