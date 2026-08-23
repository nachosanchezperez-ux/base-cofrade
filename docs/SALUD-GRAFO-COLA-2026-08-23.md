# Salud del grafo · primera cola operativa

> Fotografía realizada el 23 de agosto de 2026 por Hilo Orquestador después del cierre de Arquitectura pública y del smoke transversal del baseline.

## Principio de esta pasada

No se persigue «cero incidencias». Se aplica el ciclo:

```text
incidencia → patrón → solución sistémica → validación
```

La fotografía se obtiene sobre entidades `published` y relaciones vigentes. Las incidencias se agrupan por patrón; no se trabaja ficha por ficha sin criterio transversal.

## Clasificación

### 🔴 Prioritario

- Entidades publicadas sin su fila canónica de subtipo: **0** en Hermandades, Imágenes, Pasos, Bandas, Marchas y Personas/agentes.
- No se abre un frente estructural: la muestra auditada no revela huérfanos canónicos que obliguen a reabrir Arquitectura pública.

### 🟠 Cobertura

- Imágenes publicadas sin autoría estructurada vigente: **0**.
- Pasos publicados sin responsables estructurados: **0**.
- Marchas publicadas sin autoría estructurada: **1**; se mantiene pendiente mientras no exista una Fuente inequívoca.
- Bandas publicadas sin Fuente directa: **6**.
- Existen además huecos de Fuente en agentes vinculados al entorno musical. Se tratarán como consecuencia del mismo ecosistema documental, evitando crear Fuentes o personas duplicadas.

### 🔵 Enriquecimiento

- Persisten entidades publicadas sin fotografía o multimedia propia.
- Este bloque no se selecciona todavía: antes de escalar media externa debe cerrarse el protocolo editorial de licencias, autor, procedencia, atribución, derechos y uso como portada o galería.

## Patrón sistémico seleccionado

**Bandas publicadas sin Fuente directa**.

Prioridad: **🟠 cobertura documental**.

Motivos:

1. afecta a un conjunto completo y medible;
2. mejora la trazabilidad de las fichas y de sus relaciones musicales;
3. puede resolverse reutilizando Fuentes y enlaces oficiales ya existentes cuando sean válidos;
4. no exige cambios de modelo, RLS, loaders ni contratos públicos;
5. evita anticipar una carga de fotografías antes de cerrar el protocolo de media abierta.

## Reglas de resolución

1. Identificar las seis Bandas afectadas desde la consulta canónica de Salud.
2. Revisar primero Fuentes ya existentes y enlaces oficiales de cada Banda.
3. Reutilizar registros de `sources`; no duplicar por variaciones de URL o título.
4. Vincular la Fuente directamente a la entidad Banda mediante `source_links`.
5. No convertir Spotify, una portada discográfica o una red social en Fuente general de la ficha si no documenta los datos utilizados.
6. Tratar por separado las evidencias de dirección, acompañamientos, estrenos y discografía.
7. Registrar cada alta o vínculo en `audit_log`.
8. Ejecutar de nuevo Salud del grafo y comprobar la reducción exacta de **6 → 0** en este patrón.
9. Hacer smoke de las fichas afectadas y revisar runtime.

## Trazabilidad

La fotografía completa y la selección se han registrado también en `audit_log` con:

- actor: `Hilo Orquestador · Salud del grafo`;
- acción: `checkpoint`;
- objeto: `graph_health`;
- resumen: `Primera cola priorizada y patrón sistémico seleccionado`.

El registro conserva los recuentos por categoría y la lista canónica de Bandas afectadas.

## Resultado de esta fase

```text
SALUD DEL GRAFO
→ primera cola priorizada
→ patrón seleccionado: Bandas publicadas sin Fuente directa
```

El siguiente paso autorizado es resolver este patrón completo y medir su reducción. No se abre otro frente estructural.