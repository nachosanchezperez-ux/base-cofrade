# Hilo Cofrade · Estado canónico

**Corte validado:** 3 de septiembre de 2026 · cierre de actualidad de Virgen del Castillo de Lebrija  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase activa:** editorial / documental sobre el modelo vigente

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

- Baseline de aplicación validado antes de esta sincronización documental: `1f44cb8c020856e4327595319a51c73cad6a3214`.
- Producción correspondiente: `READY` en `dpl_7uM2q5foLhL9792YiwiScTFcaY8P`.
- Runtime productivo: 0 `error/fatal` en la comprobación final de una hora.
- #568: fusionada; corrige de forma sistémica los enlaces de guías de salidas.
- #569: fusionada; mejora contraste y normalización cromática compartida.
- #570: trabajo concurrente sobre horarios de sedes; fuera del lote Castillo y no usado como bloqueo editorial.
- Amparo: 🟢 cerrada y certificada.
- San Esteban: 🟢 cerrada y certificada.
- La Sed: 🟢 cerrada y certificada.
- Virgen del Castillo de Lebrija: 🟢 deuda de actualidad de septiembre de 2026 cerrada y verificada.
- #529: cerrada.
- #492: 🟣 abierta y aislada a Supabase Preview Branches.
- Aportaciones públicas: desactivadas.

Esta sincronización es documental. No introduce UX, DDL, tablas, enums, RLS ni arquitectura.

## Supabase

**PRODUCCIÓN → 🟢 `ACTIVE_HEALTHY`**

- Proyecto: `Hilocofrade`.
- PostgreSQL: 17.6.1.
- Región: `eu-west-1`.
- Migraciones remotas verificadas en este corte: **52**.
- Última migración remota: `20260903143200_normaliza_hex_colores_hermandades`.
- Las cuatro migraciones posteriores al corte anterior corresponden a paletas/normalización editorial; no abren nuevo modelo estructural.
- El lote Castillo se ha ejecutado mediante DML editorial sobre el modelo vigente y con prevalidación `BEGIN … ROLLBACK` en los bloques de escritura.
- #492 continúa bloqueando DDL, nuevas tablas, migraciones estructurales y cambios RLS; no bloquea investigación ni DML editorial.

## Lotes cerrados

### Amparo

**AMPARO → 🟢 CERTIFICADA**

Documento: `docs/CERTIFICACION-AMPARO-2026-09-02.md`.

Se mantiene cerrada. Las correcciones posteriores han sido únicamente de QA transversal o de enlaces documentales demostrados; no se ha abierto una segunda auditoría.

### San Esteban

**SAN ESTEBAN → 🟢 CERTIFICADA**

Documento: `docs/CERTIFICACION-SAN-ESTEBAN-2026-09-02.md`.

Se mantiene cerrada y sin reapertura editorial.

### Hermandad de la Sed

**LA SED → 🟢 CERTIFICADA · SIN BLOQUEOS DE GRAFO**

Documento: `docs/CERTIFICACION-LA-SED-2026-09-03.md`.

- Completitud técnica inicial aproximada: 29 %.
- Completitud final aproximada: 86 %.
- Titulares: 3.
- Pasos: 2.
- Fases: 7.
- Capataces vigentes: 2.
- Acompañamientos vigentes: 3.
- Patrimonio material representativo: 4 bienes.
- Marchas dedicadas certificadas: 6.
- Cultos: 14.
- Ocurrencias 2026: 7.
- Acontecimientos: 2.
- Multimedia: hueco legítimo por ausencia de recursos autorizados.

### Virgen del Castillo de Lebrija

**DEUDA DE ACTUALIDAD SEPTIEMBRE 2026 → 🟢 RESUELTA**

Documento: `docs/CERTIFICACION-ACTUALIDAD-CASTILLO-LEBRIJA-2026-09-03.md`.

Este cierre no declara completitud enciclopédica integral; certifica el frente temporal ordenado para septiembre de 2026.

#### Sede y ubicación

- Sede canónica / histórica: **Ermita de Nuestra Señora del Castillo**.
- Ubicación temporal en septiembre de 2026: **Convento de la Purísima Concepción**.
- Las obras de Santa María de la Oliva obligan a suspender el traslado previsto para el 6 de septiembre.
- La excepción se modela mediante localización temporal + acontecimiento, sin sustituir la sede canónica.

#### Titular

- Nuestra Señora del Castillo Coronada queda publicada y relacionada con la Hermandad.
- No se inventa autoría.
- La ubicación actual queda resuelta en el grafo.

#### Cultos 2026

- Ofrenda floral · 11/09/2026.
- Solemne Función · 12/09/2026 · 11:00.
- Novena · 13–21/09/2026.

Cultos y ocurrencias cuentan con Fuentes relacionadas.

#### Procesión

- Procesión de Gloria: **12 de septiembre de 2026 · 19:00**.
- Se corrige el dato anterior de las 20:00.
- Origen/destino 2026: Convento de la Purísima Concepción.
- Banda: **Banda de Música Virgen del Castillo de Lebrija**, tras el paso.
- Recorrido: pendiente; no se incorpora un itinerario antiguo o no confirmado.
- Entrada: pendiente de publicación.

#### Identidad cromática

Paleta indicada por Dirección y aplicada sobre el modelo vigente:

- Morado `#5B2C83` · principal.
- Blanco `#FFFFFF`.
- Dorado `#C6A15B` · acento.

#### Acontecimiento

Se relaciona el acontecimiento de reorganización temporal de 2026 con:

- Hermandad del Castillo de Lebrija;
- Nuestra Señora del Castillo Coronada.

#### Salud del grafo

**RESULTADO → 🟢 CLEAN para el alcance de actualidad**

- Colores: 3.
- Titulares publicados: 1.
- Ubicaciones actuales: 1.
- Acontecimientos: 1.
- Relaciones del acontecimiento: 2.
- Cultos: 3.
- Ocurrencias 2026: 3.
- Enlaces de Fuente a ocurrencias: 4.
- Salidas: 1.
- Fuentes directas de salida: 2.
- Posiciones musicales: 1.
- Asignaciones musicales: 1.
- Fuente de asignación musical: 1.
- Duplicados de slug Hermandad/Imagen/Salida: 0.

#### QA público

- `/hermandades/castillo-lebrija` → HTTP 200.
- `/procesiones-de-gloria` → HTTP 200; Lebrija muestra salida 19:00.
- `/procesiones-de-gloria/lebrija-castillo-2026-09-12` → HTTP 200.
- La ficha específica muestra Convento de la Purísima, 19:00, Banda Virgen del Castillo y recorrido pendiente.
- Runtime: 0 `error/fatal` en la comprobación final.

## Reparación transversal de guías de salidas

**#568 → 🟢 MERGED**

El QA de Castillo reveló que la ficha común de Hermandad construía `Ver guía` para cualquier salida con slug, aunque no existiera una guía extraordinaria. Esto producía 404 en salidas ordinarias como Castillo y Amparo.

La solución es común, no nominal:

- el lector valida los slugs contra `extraordinary_outings_directory`;
- solo las guías extraordinarias reales exponen enlace;
- las salidas ordinarias conservan su slug en base de datos;
- no se reclasifica ninguna salida;
- no hay excepciones por slug;
- `npm ci`, `npm test`, `npm run build` y Vercel: verdes antes del merge.

## Fuentes de actualidad · Castillo

Prioridad utilizada:

1. Hermandad del Castillo de Lebrija: sede, cultos y traslados.
2. Ayuntamiento de Lebrija: Ermita del Castillo y programa de Feria y Fiestas Patronales 2026.
3. El Pespunte Cofrade: cambio temporal por obras y acompañamiento musical, 28/08/2026.

No se incorpora recorrido 2026 porque no consta publicado en las fuentes actuales verificadas.

## #492

**#492 → 🟣 AISLADA**

Mantiene su alcance de Supabase Preview Branches. No se ha intentado resolver dentro del lote editorial.

## Aportaciones públicas

**APORTACIONES → 🔒 DESACTIVADAS**

No se activó formulario ni endpoint y no se modificaron Auth, Storage, RLS o secretos.

## Estado del frente

**AMPARO → 🟢 CERRADA Y CERTIFICADA**  
**SAN ESTEBAN → 🟢 CERRADA Y CERTIFICADA**  
**LA SED → 🟢 CERRADA Y CERTIFICADA**  
**CASTILLO DE LEBRIJA · ACTUALIDAD 2026 → 🟢 CERRADA Y VERIFICADA**

**SIGUIENTE MOVIMIENTO → refrescar ranking real de deuda documental y seleccionar una sola Hermandad para la siguiente auditoría, sin introducir datos hasta devolver el diagnóstico a Dirección.**
