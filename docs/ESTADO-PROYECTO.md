# Estado operativo de Hilo Cofrade

> Registro vivo para Hilo Orquestador. GitHub, Vercel y Supabase son la fuente de verdad. Si existe discrepancia, prevalece siempre el estado real de las herramientas.

## Baseline observado

- Comprobación: **2026-08-23 13:02 CEST**
- Repositorio: `nachosanchezperez-ux/base-cofrade`
- Rama principal: `main`
- `main`: `eb9894d585e756f462a6777c2db652fea5144f9a`
- Último frente integrado: **#214 · Autoridad pública de Hermandades**
- #242 · Directorio unificado: **fusionada**.
- #245 · Fichas de Hermandad: **fusionada**.
- Proyecto Vercel: `base-cofrade`
- Producción: **READY** sobre `eb9894d585e756f462a6777c2db652fea5144f9a`.
- Supabase: proyecto `Hilocofrade` (`kcevwkucqzcyrqaimyhl`) **ACTIVE_HEALTHY** en la última comprobación.

Antes de cada tarea significativa el Orquestador debe refrescar de nuevo `main`, PR abiertas, Vercel y Supabase cuando proceda. Este SHA es un baseline, no una referencia permanente.

## Secuencia de Dirección activa

La fase actual prioriza cierre y consolidación. No abrir nuevos frentes estructurales fuera de esta secuencia.

1. Smoke transversal de producción → **🟢 CERRADO**.
2. #242 · Directorio unificado → **🟢 CERRADO**.
3. #245 · Fichas de Hermandad → **🟢 CERRADO**.
4. Limpieza del backlog estructural → **EN CURSO**.
5. Auditoría de carga masiva → bloqueada hasta cerrar el punto 4.
6. Arquitectura pública → después del punto 4 y de la auditoría de carga, salvo los cortes antiguos ya clasificados dentro de la limpieza.
7. Salud del grafo.
8. Formalizar decisiones HC.
9. Elegir un único siguiente gran frente.

## Backlog estructural · estado actual

Estados operativos:

- **🟢 FUSIONAR**: línea vigente; reconciliar con `main`, probar, preview y smoke antes de integrar.
- **🔵 RECONSTRUIR**: intención válida, rama desfasada; rehacer sobre `main` preservando la arquitectura actual.
- **⚪ APARCAR**: trabajo válido pero no pertenece al cierre actual o tiene prerrequisitos pendientes.
- **⚫ CERRAR POR SUPERADO**: objetivo ya absorbido o sustituido.

| PR | Área | Estado operativo | Decisión vigente |
|---|---|---|---|
| #214 · Autoridad pública de Hermandades | Supabase público / autoridad editorial | ✅ **FUSIONADA** | Integrada en `main` como `eb9894d585e756f462a6777c2db652fea5144f9a`. `applyBrotherhoodAuthority()` usa ya `createPublicClient()`. |
| #232 · Calendario responsive de Extraordinarias | UI Extraordinarias | 🟢 **FUSIONAR** | **Siguiente acción única.** Cambio localizado en `components/ExtraordinaryDirectory.module.css`; reconciliar, validar móvil/escritorio y producción. |
| #211 · Cabecera de Bandas | UI Bandas / directorio | 🟢 **FUSIONAR** | Sigue aportando una hero específica de Bandas. Integrar después de #232, comprobando que no degrade el Directorio ya canónico. |
| #234 · También en Hilo Cofrade | Grafo relacional / Tira del hilo | 🟢 **FUSIONAR** | Integrar después de #211, con smoke de Hermandad, Imagen, Paso y Banda y revisión de latencia. |
| #239 · Sede y visita | Hermandades, Panel, Lugares | 🔵 **RECONSTRUIR** | Rehacer sobre el `main` resultante, preservando #245 y #214. No fusionar la rama antigua tal cual. |
| #168 · Tira del hilo 2.11 | Grafo / API / Pregunta | 🔵 **RECONSTRUIR** | Rehacer después de #234 para reutilizar una única base de grafo y descubrimiento. |
| #49 · Importador documental MVP | Panel, IA, Supabase, ingesta | ⚪ **APARCAR** | Draft y no mergeable. No aplicar sus migraciones antiguas de forma automática. Reauditar desde `main` cuando se retome ingesta. |

No hay actualmente ninguna de estas siete líneas clasificada como **⚫ CERRAR POR SUPERADO**.

## #214 · cierre verificado

La rama original estaba desfasada y dejó de ser mergeable contra el `main` vigente. Se reconstruyó sobre `2c6c3a63c157cf22f3de54140695db77839c149f`, reaplicando únicamente dos cambios:

- `lib/supabase/brotherhood-authority.js`: cliente público en lugar del cliente cookie-aware;
- `docs/FASE-A-hermandad-autoridad-publica.md`: auditoría y alcance del corte.

Comprobaciones realizadas:

- `brotherhood_section_authority`, `brotherhoods` y `step_personnel_periods`: RLS activa;
- lectura pública limitada a datos publicados;
- `current_step_personnel`: `security_invoker=true`;
- preview Vercel: **READY**;
- producción Vercel: **READY** sobre `eb9894d585e756f462a6777c2db652fea5144f9a`;
- `/hermandades/san-benito`: HTTP 200 en producción;
- `/hermandades/el-baratillo`: HTTP 200 en producción;
- runtime del deployment tras los smokes: sin errores `error`/`fatal` detectados.

Conclusión: **#214 → 🟢 CERRADO**.

## Orden operativo del backlog

1. **#232** · Extraordinarias responsive.
2. **#211** · cabecera de Bandas.
3. **#234** · También en Hilo Cofrade.
4. **Reconstruir #239** sobre el `main` resultante.
5. **Reconstruir #168** después de estabilizar #234.
6. **#49 permanece aparcada**.

Antes de cada fusión:

1. refrescar `main`;
2. comparar la rama contra el árbol actual;
3. reconstruir si existe deuda de rama o solape peligroso;
4. ejecutar pruebas relevantes;
5. comprobar build y preview Vercel;
6. hacer smoke funcional;
7. fusionar únicamente si producción puede quedar verde.

## Supabase y migraciones

Estado de coordinación vigente:

- #232, #211, #234, #239 y #168 no declaran migraciones en su alcance actual;
- #214 no ha requerido cambios de esquema ni RLS;
- #49 contiene las migraciones de ingesta `20260818134549_document_imports.sql`, `20260818150550_document_imports_music.sql` y `20260818235551_document_imports_agent_guard.sql`; en la última auditoría no figuraban aplicadas en `supabase_migrations.schema_migrations`.

Reglas permanentes:

- comparar historial local y remoto antes de tocar esquema;
- no modificar una migración ya aplicada;
- no aplicar las migraciones de #49 hasta reconstruir y volver a auditar el importador.

## Zonas sensibles

### Hermandades

- #245 y #214 forman ya parte del `main` canónico.
- #239 debe reconstruirse preservando ambas capas.
- No añadir lógica específica por slug para resolver casos de ficha.

### Directorios

#242 es la arquitectura canónica de Directorio. Cualquier cambio posterior en listados, navegación o Bandas debe partir de ella.

### Extraordinarias

#232 es el siguiente corte a cerrar. Debe mantenerse intacto el dominio editorial y las fichas ya estables; el alcance esperado es responsive/presentación del calendario secundario.

### Tira del hilo

- #234 entra antes que #168.
- #168 no debe crear una segunda lógica de grafo paralela al sistema actual.

### Ingesta masiva

#49 queda como referencia de producto, no como base técnica integrable. La auditoría de carga masiva de la fase de Dirección debe buscar patrones sistémicos y no limitarse a corregir casos individuales.

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

**Siguiente acción actual: cerrar #232 · Calendario responsive de Extraordinarias.**
