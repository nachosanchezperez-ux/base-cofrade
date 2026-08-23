# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas.

## Baseline observado

- Comprobación: **2026-08-23 16:50 CEST**.
- Repositorio: `nachosanchezperez-ux/base-cofrade`.
- Rama principal: `main`.
- `main` funcional: `c577ae24073cbff8a35963101d495437e263988a`.
- Último frente funcional integrado: **#257 · Completa la autoridad pública relacional de Hermandades**.
- Proyecto Vercel: `base-cofrade`.
- Producción funcional: **READY** en `dpl_HJubBDVLcYoBHC46RsF83aSStXdr`, alineada con `c577ae24073cbff8a35963101d495437e263988a`.
- Supabase: proyecto `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) **ACTIVE_HEALTHY**.
- Última migración remota verificada: `20260823134318_mass_import_relational_integrity`.

Antes de cada tarea significativa el Orquestador debe refrescar de nuevo `main`, PR abiertas, Vercel y Supabase cuando proceda. Estos identificadores son un baseline y no referencias permanentes.

## Secuencia de Dirección activa

1. Smoke transversal de producción → **🟢 CERRADO**.
2. Directorio unificado (#242) → **🟢 CERRADO**.
3. Fichas de Hermandad (#245) → **🟢 CERRADO**.
4. Limpieza del backlog estructural → **🟢 CERRADO**.
5. Auditoría de carga masiva / cargas relacionales recientes → **🟢 CERRADO**.
6. **Arquitectura pública / separación Front ↔ Panel → EN CURSO**.
   - Home → **🟢 CERRADO**.
   - Hermandades → **🟢 CERRADO**.
   - Imágenes → **SIGUIENTE CORTE**.
7. Salud del grafo.
8. Registro y formalización de decisiones HC.
9. Elegir un único siguiente gran frente.

No abrir nuevos frentes estructurales fuera de esta secuencia mientras el punto activo no esté cerrado.

## Backlog estructural · cierre

| PR | Área | Estado final | Resolución |
|---|---|---|---|
| #232 | Extraordinarias responsive | 🟢 **FUSIONADA** | Integrada y validada en producción. |
| #211 | Cabecera de Bandas | 🟢 **FUSIONADA** | Integrada sin degradar el Directorio canónico. |
| #234 | También en Hilo Cofrade | 🟢 **FUSIONADA** | Reconciliada sobre `main`, CI/preview/producción correctos. |
| #239 | Sede y visita | 🟢 **RECONSTRUIDA Y FUSIONADA** | Rehecha sobre `main`, preservando #245 y autoridad pública. |
| #168 | Tira del hilo 2.11 | ⚫ **CERRADA POR SUPERADA** | Su intención está absorbida por la arquitectura actual V11/V12. |
| #49 | Importador documental MVP | ⚪ **APARCADA** | La base técnica antigua fue sustituida por el importador masivo actual. Conservar solo como referencia de producto para una futura experiencia URL → análisis → propuesta → revisión reconstruida desde `main`. |
| #214 | Autoridad pública de Hermandades | 🟢 **INTEGRADA** | Precedente conceptual. No reabrir ni reutilizar su rama antigua. |

Regla permanente: no conservar ramas viejas por coste hundido. Si la intención sigue siendo válida pero la rama ha caducado, reconstruir sobre el `main` real.

## Auditoría de cargas relacionales · cierre

Muestras auditadas: **San Esteban**, **Bendición y Esperanza**, **Gran Poder**, ampliada a **Cristo de la Corona** y **Escolanía Salesiana María Auxiliadora de Sevilla**.

PR **#252 · Audita y protege las importaciones relacionales** → **🟢 FUSIONADA**.

Migración aplicada y versionada:

- `20260823134318_mass_import_relational_integrity.sql`.

Resultado estable:

- duplicado `la-corona` consolidado sobre `cristo-de-la-corona` sin cambiar el ID canónico;
- duplicado de Escolanía consolidado sobre `escolania-salesiana-maria-auxiliadora-sevilla` sin perder sus cuatro acompañamientos;
- fuentes reunificadas y `source_links` legacy normalizados hacia FK estructuradas cuando existía correspondencia inequívoca;
- trazabilidad de Bendición y Esperanza completada con fuentes ya documentadas;
- guarda de propietario vigente único para pasos procesionales;
- guardas contextuales de identidad de bandas dentro del mismo municipio;
- 0 pasos con dos Hermandades vigentes tras la corrección;
- pruebas negativas de duplicación bloqueadas por la base de datos.

No imponer unicidad global por nombre: existen homónimos legítimos en el dominio cofrade.

La infraestructura de importación masiva vigente está en `app/panel/(protected)/datos/importar`, `lib/panel/bulk-import*.js` y `20260822204505_bulk_import_pipeline.sql`. Las guardas de integridad viven en el modelo y protegen cualquier writer.

## Zonas sensibles vigentes

### Hermandades

- #245, #239, #214, #256 y #257 forman parte del estado canónico.
- La ficha y su enriquecimiento relacional público no deben depender de sesión/cookies editoriales.
- No añadir lógica específica por slug para resolver casos de ficha.
- Mantener Patrimonio general separado de Patrimonio musical.
- Conservar Sede y visita como relación canónica con `places`.

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

Objetivo: **separar completamente las lecturas públicas de la sesión/cookie editorial del Panel**.

Orden de auditoría:

1. Home → **🟢 CERRADO**.
2. Hermandades → **🟢 CERRADO**.
3. Imágenes → **SIGUIENTE CORTE**.
4. Pasos.
5. Bandas.
6. Extraordinarias.
7. Marchas.
8. Personas/agentes.

Método por corte pequeño:

1. comprobar RLS y vistas/funciones implicadas;
2. usar cliente público explícito en el loader público;
3. eliminar dependencia accidental de cookie/sesión editorial;
4. añadir o ajustar pruebas de arquitectura;
5. CI + preview;
6. smoke público sin sesión;
7. producción + runtime;
8. actualizar este registro únicamente cuando cambie el mapa de coordinación.

### Home · cierre verificado

PR **#254 · Blinda la autoridad pública de Home** → **🟢 FUSIONADA**.

Home ya utilizaba una cadena de loaders pública y stateless. Se añadió `test/home-public-authority.test.mjs` para impedir que futuros cambios introduzcan `@/lib/supabase/server`, `next/headers` o un cliente cookie-aware.

Verificado:

- vistas de Home con `security_invoker=true`;
- tablas base con RLS y políticas públicas;
- lectura equivalente con rol `anon` correcta;
- CI y preview verdes;
- producción y `/` HTTP 200;
- sin errores `error`/`fatal` tras smoke.

Conclusión: **HOME · AUTORIDAD PÚBLICA → 🟢 CERRADO**.

### Hermandades · cierre verificado

La auditoría del `main` actual detectó primero tres loaders de ficha que todavía importaban `@/lib/supabase/server`:

- `lib/supabase/brotherhoods.js`;
- `lib/supabase/brotherhood-display.js`;
- `lib/supabase/brotherhood-musical-heritage.js`.

PR **#256 · Aísla Hermandades de la sesión editorial** → **🟢 FUSIONADA**.

#256 migró esos tres loaders a `@/lib/supabase/public` sin modificar consultas, filtros, fallbacks, relaciones, patrimonio, salidas, fuentes, Sede y visita, UI ni Panel. Añadió además `test/brotherhood-public-authority-boundary.test.mjs`.

Durante el cierre apareció una concurrencia complementaria: **#257 · Completa la autoridad pública relacional de Hermandades** detectó la última dependencia transitive cookie-aware en:

- `components/BrotherhoodRelationalExtras.js`.

#257 la migró también al cliente público y amplió la barrera de regresión para cubrir:

- `BrotherhoodRelationalExtras.js`;
- `RelationalThread.js`;
- `lib/supabase/relational-presence.js`;
- la comprobación de paridad Front/Panel correspondiente.

La concurrencia no se resolvió ignorando uno de los trabajos: se incorporó como parte del mismo corte y se revalidó el estado real antes del cierre.

Seguridad comprobada:

- tablas consumidas por la cadena pública: RLS activa y lectura anónima prevista;
- `current_step_personnel`: `security_invoker=true`;
- smoke SQL con `SET ROLE anon` correcto para San Benito, El Baratillo y Asunción de Cantillana;
- no se requirió migración ni cambio de políticas.

Verificación técnica y pública:

- CI de #256: **success**;
- CI de #257: **success**;
- previews Vercel: **READY**;
- `main` funcional: `c577ae24073cbff8a35963101d495437e263988a`;
- producción funcional: `dpl_HJubBDVLcYoBHC46RsF83aSStXdr` **READY**;
- `/hermandades`: **HTTP 200**, 14 hermandades publicadas;
- `/hermandades/san-benito`: **HTTP 200**, preservando la separación Patrimonio / Patrimonio musical de #245;
- `/hermandades/el-baratillo`: **HTTP 200**;
- `/hermandades/asuncion-de-cantillana`: **HTTP 200**, manteniendo Sede compartida, titular, paso, capataz, música, patrimonio, fuentes y enriquecimiento relacional;
- `/hermandades/semana-santa`: **HTTP 200**;
- `/hermandades/gloria`: **HTTP 200**;
- `/hermandades/sacramentales`: **HTTP 200**;
- runtime posterior: sin clusters de error y sin logs `error`/`fatal` en el deployment funcional.

Conclusión: **HERMANDADES · AUTORIDAD PÚBLICA → 🟢 CERRADO**.

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

**Siguiente acción actual: auditar Imágenes de extremo a extremo para detectar cualquier loader público que aún dependa de sesión/cookies, verificando RLS/vistas, cliente público explícito, CI, preview, smoke público y runtime antes de dar el corte por cerrado.**
