# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas.

## Baseline observado

- Comprobación: **2026-08-23 16:10 CEST**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main`: `87905706674edc7857f34325f644eecef8d5a03c`.
- Último frente integrado: **#254 · Blindaje de la autoridad pública de Home**.
- Proyecto Vercel: `base-cofrade`.
- Producción: **READY** en `dpl_3VA2DruVaxoVjKggkxUJ99BPVmLH`, alineada con `87905706674edc7857f34325f644eecef8d5a03c`.
- Supabase: proyecto `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) **ACTIVE_HEALTHY**.
- Última migración remota verificada: `20260823134318_mass_import_relational_integrity`.

Antes de cada tarea significativa el Orquestador debe refrescar de nuevo `main`, PR abiertas, Vercel y Supabase cuando proceda. Este SHA es un baseline, no una referencia permanente.

## Secuencia de Dirección activa

La fase actual prioriza cierre y consolidación. No abrir nuevos frentes estructurales fuera de esta secuencia.

1. Smoke transversal de producción → **🟢 CERRADO**.
2. Directorio unificado (#242) → **🟢 CERRADO**.
3. Fichas de Hermandad (#245) → **🟢 CERRADO**.
4. Limpieza del backlog estructural → **🟢 CERRADO**.
5. Auditoría de carga masiva / cargas relacionales recientes → **🟢 CERRADO**.
6. **Arquitectura pública / separación Front ↔ Panel → EN CURSO**.
   - Home → **🟢 CERRADO**.
   - Hermandades → **SIGUIENTE CORTE**.
7. Salud del grafo.
8. Registro y formalización de decisiones HC.
9. Elegir un único siguiente gran frente.

## Limpieza del backlog · cierre

Estados resueltos:

| PR | Área | Estado final | Resolución |
|---|---|---|---|
| #232 | Extraordinarias responsive | 🟢 **FUSIONADA** | Integrada y validada en producción. |
| #211 | Cabecera de Bandas | 🟢 **FUSIONADA** | Integrada sin degradar el Directorio canónico. |
| #234 | También en Hilo Cofrade | 🟢 **FUSIONADA** | Reconciliada sobre `main`, CI/preview/producción correctos. |
| #239 | Sede y visita | 🟢 **RECONSTRUIDA Y FUSIONADA** | Rehecha sobre `main`, preservando #245 y la autoridad pública ya vigente. |
| #168 | Tira del hilo 2.11 | ⚫ **CERRADA POR SUPERADA** | Su intención está absorbida por la arquitectura actual de Tira del hilo, ya evolucionada hasta V11/V12. |
| #49 | Importador documental MVP | ⚪ **APARCADA** | La infraestructura técnica antigua fue sustituida por el importador masivo actual. Se conserva como referencia de producto para una futura experiencia URL → análisis → propuesta → revisión, reconstruida desde la arquitectura vigente. |
| #214 | Autoridad pública de Hermandades | 🟢 **YA INTEGRADA** | El corte de autoridad pública forma parte de `main`; para el punto 6 no se debe reabrir ni reutilizar su rama antigua como base técnica. |

Regla permanente: no conservar ramas viejas por coste hundido. Si una idea sigue siendo válida pero la rama ha caducado, reconstruir desde el `main` real.

## Auditoría de carga masiva / cargas relacionales · cierre

Muestras auditadas de extremo a extremo:

1. **San Esteban**.
2. **Bendición y Esperanza** como muestra de Viernes de Dolores.
3. **Gran Poder** como carga reciente adicional.
4. La auditoría se amplió a **Cristo de la Corona** y **Escolanía Salesiana María Auxiliadora de Sevilla** al aparecer una duplicidad sistémica.

Recorrido comprobado: Hermandad → Titulares → Imágenes → Pasos → Capataces → Bandas → Acompañamientos → Fuentes → Front. La paridad con Panel se ha verificado a nivel de modelo/tablas y loaders; no se declara smoke visual autenticado del Panel cuando no se ha iniciado sesión editorial.

### Hallazgos sistémicos corregidos

- Existían dos nodos para la misma corporación de **Cristo de la Corona**: una ficha publicada y un nodo legacy `la-corona` en borrador, ambos enlazados al mismo paso procesional.
- Existían dos nodos para la misma **Escolanía Salesiana María Auxiliadora**; la ficha rica/canónica ya contenía como denominación vigente el nombre usado por el duplicado.
- El acompañamiento de la Escolanía a Cristo de la Corona estaba repartido entre ambos pares de nodos y sus fuentes.
- Parte de los enlaces de Fuentes guardaba IDs de relaciones dentro de texto `scope` (`relation:image_authorship:<uuid>` y `relation:brotherhood_image:<uuid>`) en vez de usar las FK estructuradas de `source_links`.
- **Bendición y Esperanza** tenía fuentes oficiales ya cargadas, pero faltaban enlaces relacionales desde Hermandad, titulares, autorías y paso.

### Corrección aplicada

PR **#252 · Audita y protege las importaciones relacionales** → **🟢 FUSIONADA**.

Migración aplicada y versionada:

- `20260823134318_mass_import_relational_integrity.sql`.

La migración:

- consolida `la-corona` sobre la entidad canónica publicada `cristo-de-la-corona` sin cambiar el ID canónico;
- consolida la Escolanía duplicada sobre `escolania-salesiana-maria-auxiliadora-sevilla` sin cambiar el ID canónico;
- reúne y conserva las fuentes de los acompañamientos durante la consolidación;
- normaliza `source_links` legacy hacia `image_authorship_id` y `brotherhood_image_id` reales cuando existe FK compatible;
- completa la trazabilidad de Bendición y Esperanza usando fuentes oficiales ya incorporadas por el propio lote;
- añade una guarda para impedir que un mismo `processional_step` tenga dos Hermandades vigentes simultáneamente sin cierre temporal;
- añade guardas de identidad de bandas para impedir recrear una formación cuando su nombre coincide con el nombre o denominación vigente de otra formación del mismo municipio.

No se ha impuesto unicidad global por nombre: existen homónimos legítimos en el dominio cofrade y las guardas se limitan a patrones donde la identidad es realmente incompatible.

### Verificación posterior

- Duplicados residuales `la-corona` / `escolania-maria-auxiliadora-sevilla`: **0**.
- Pasos procesionales con más de un propietario vigente: **0**.
- La Escolanía canónica conserva **4 acompañamientos**; no se perdieron relaciones.
- El acompañamiento canónico de Cristo de la Corona conserva **2 fuentes** acumuladas.
- Bendición y Esperanza: **0 huecos** de fuente en Hermandad, titulares, autorías y paso dentro del alcance auditado.
- Gran Poder: la autoría anónima del Mayor Dolor y Traspaso queda enlazada por `image_authorship_id` real.
- Pruebas negativas: intentar recrear la Escolanía duplicada o asignar un segundo propietario vigente al paso de la Corona es bloqueado por la base de datos y no deja residuos.
- CI de #252: **success**.
- Producción funcional de #252: `dpl_9UdAw1S7jhsaXYcXFceW38toFqq4` **READY** sobre `41bf6e1958401012c5fe72c187538af5a9374427`.
- Runtime tras smoke: sin errores `error`/`fatal` ni clusters de error detectados.
- Smoke público: San Esteban, Bendición y Esperanza, Gran Poder, Cristo de la Corona y la Escolanía canónica responden correctamente.
- Rutas legacy `/hermandades/la-corona` y `/bandas/escolania-maria-auxiliadora-sevilla`: **404 real**, como corresponde tras consolidar los duplicados.

### Incompletitud documentada que NO es error de integridad

- San Esteban no tiene capataces cargados para sus dos pasos: el Front muestra **Pendiente de incorporar** y no inventa datos.
- El Cristo de San Esteban mantiene autoría desconocida donde no existe atribución documentada estructurada.
- En Gran Poder y otras fichas pueden existir campos de multimedia, horarios o acompañamientos todavía pendientes. Se consideran enriquecimiento/completitud, no inconsistencia roja.

### Importador masivo actual

La infraestructura de importación masiva vigente existe en `app/panel/(protected)/datos/importar`, `lib/panel/bulk-import*.js` y `20260822204505_bulk_import_pipeline.sql`.

En la auditoría de 2026-08-23 las tablas `bulk_imports`, `bulk_import_items` y `document_imports` tenían **0 lotes reales**: San Esteban, Viernes de Dolores y las otras cargas recientes auditadas habían entrado principalmente mediante migraciones/semillas directas. Las nuevas guardas viven en el modelo de datos, por lo que protegen tanto futuras importaciones del Panel como escrituras procedentes de migraciones u otros writers.

No se declara todavía el importador como transaccional de lote completo: su aplicación actual es por filas/chunks. Esa mejora queda fuera de este cierre porque no causó los defectos observados y abriría un nuevo frente de arquitectura de ingesta.

## Zonas sensibles vigentes

### Hermandades

- #245, autoridad pública y #239 forman parte del `main` canónico.
- No añadir lógica específica por slug para resolver casos de ficha.
- Mantener Patrimonio general separado de Patrimonio musical.

### Directorios

#242 es la arquitectura canónica de Directorio. Los cambios posteriores deben reutilizar sus familias, filtros y segmentación, no crear listados paralelos.

### Tira del hilo

#234 es la base integrada. #168 está superada. No crear una segunda lógica de grafo paralela.

### Datos e importación

- Reutilizar entidades canónicas antes de crear nuevas.
- Preservar IDs, relaciones, fuentes e históricos.
- No degradar entidades reales a texto libre cuando existe relación estructurada.
- Tratar duplicados por identidad contextual, no mediante unicidad global de nombres.

## Punto activo · Arquitectura pública

El frente único activo es **separar completamente las lecturas públicas de la sesión/cookie editorial del Panel**.

Orden de auditoría:

1. Home → **🟢 CERRADO**.
2. Hermandades → **SIGUIENTE CORTE**.
3. Imágenes.
4. Pasos.
5. Bandas.
6. Extraordinarias.
7. Marchas.
8. Personas/agentes.

Método por corte pequeño:

1. comprobar RLS y vistas/funciones implicadas;
2. usar cliente público explícito en el loader público;
3. eliminar dependencia accidental de cookie/sesión editorial;
4. añadir o ajustar pruebas;
5. CI + preview;
6. smoke público sin sesión;
7. producción + runtime.

### Home · cierre verificado

La auditoría de Home confirmó que la arquitectura funcional ya era correcta y no necesitaba una reescritura:

- `app/page.js` entra en datos mediante `getHomeSnapshot()`;
- la cadena pública de loaders de Home usa `lib/supabase/public-server.js`;
- `public-server.js` usa `@supabase/supabase-js` + publishable key, sin `@supabase/ssr`, sin `next/headers` y con sesión no persistente;
- `lib/supabase/server.js` continúa siendo el cliente cookie-aware para contexto editorial/autenticado, pero no forma parte de la cadena de Home;
- las vistas consumidas por Home (`today_ephemeris_candidates`, `daily_editorial_candidates`, `daily_march_candidates`, `home_knowledge_threads`, `upcoming_extraordinary_outings`, `outing_music_details`, `step_image_history`) tienen `security_invoker=true`;
- las tablas base consultadas por Home tienen RLS activa y políticas de lectura pública limitadas a contenido publicable/publicado;
- un smoke SQL con `SET ROLE anon` leyó correctamente entidades, contenidos diarios, hilos, extraordinarias, música de salidas y multimedia.

PR **#254 · Blinda la autoridad pública de Home** → **🟢 FUSIONADA**.

El cambio no reescribe loaders: añade `test/home-public-authority.test.mjs` como barrera de regresión para impedir que Home vuelva a importar el cliente de sesión, `next/headers` o un cliente Supabase distinto del público explícito.

Comprobaciones:

- CI de #254: **success**;
- preview Vercel: **READY**;
- `main` tras merge: `87905706674edc7857f34325f644eecef8d5a03c`;
- producción: `dpl_3VA2DruVaxoVjKggkxUJ99BPVmLH` **READY** y alineada con ese commit;
- `/`: **HTTP 200** en producción sobre ese deployment;
- smoke público sin sesión: Tira del hilo, próxima Extraordinaria, `Hoy en Hilo Cofrade`, Últimos hilos y métricas públicas renderizados con datos reales;
- runtime: sin clusters de error y sin logs `error`/`fatal` en la comprobación posterior.

Conclusión: **HOME · AUTORIDAD PÚBLICA → 🟢 CERRADO**.

El trabajo ya integrado de #214 sirve como precedente conceptual y como corte existente para Hermandades, pero **no** se debe reabrir su rama antigua ni asumir que toda la ruta de Hermandades ya cumple el mismo patrón sin auditar sus loaders actuales.

## Protocolo de nueva tarea

### Antes

- [ ] Leer `docs/HILO-ORQUESTADOR.md` y este registro.
- [ ] Refrescar `main` y PR abiertas.
- [ ] Detectar archivos/áreas compartidas.
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
- [ ] Ejecutar pruebas y build.
- [ ] Revisar preview.
- [ ] Revisar responsive si hay UI.
- [ ] Verificar datos/relaciones si procede.

### Después

- [ ] Confirmar PR/`main` final.
- [ ] Confirmar producción.
- [ ] Actualizar este registro solo cuando cambie decisiones futuras.

## Regla para «¿Qué toca ahora?»

No generar una lluvia de ideas. Refrescar el estado, localizar el punto de la secuencia y devolver una sola acción ejecutable.

**Siguiente acción actual: auditar Hermandades de extremo a extremo para detectar cualquier loader público que aún dependa de sesión/cookies, partiendo del `main` actual y reutilizando la arquitectura ya integrada de #214 sin reabrir su rama antigua.**
