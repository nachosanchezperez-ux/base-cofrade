# Hilo Cofrade · Estado canónico

**Corte validado:** 3 de septiembre de 2026 · cierre del ciclo editorial
**Régimen:** `FIRST EDITION FREEZE` activo
**Fase activa:** editorial / documental sobre el modelo vigente

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

- Baseline de aplicación certificado tras el QA de este ciclo: `e5ae26a271f8696d0bc0ba2b2e1eb47f37577f09`.
- Ese SHA corresponde al merge de #562, corrección de alcance público de música y Fuentes.
- Producción de aplicación verificada: `READY` en `dpl_Au2g9t3vMu1jDMP8PjuJBrW7QtLj`.
- Runtime productivo: 0 `error/fatal` propios en la comprobación post-merge.
- PR operativas abiertas antes de esta sincronización documental: 0.
- Amparo: cerrada y certificada.
- San Esteban: cerrada y certificada.
- La Sed: cerrada y certificada.
- #529: cerrada.
- #492: abierta y aislada a Supabase Preview Branches.
- Aportaciones públicas: desactivadas; `/colabora` mantiene formulario y endpoint cerrados.
- Cola UX: 0.
- Cola estructural: 0.
- Nuevo DDL, tablas, RLS y arquitectura: bloqueados durante el freeze y mientras #492 siga abierta.

Esta sincronización de `ESTADO-PROYECTO.md` es exclusivamente documental y no modifica aplicación, UX, esquema ni arquitectura.

## Supabase

**PRODUCCIÓN → 🟢 `ACTIVE_HEALTHY`**

- Proyecto: `Hilocofrade`.
- PostgreSQL: 17.6.1.
- Región: `eu-west-1`.
- Migraciones remotas: 48.
- Últimas migraciones estructurales: `20260902121927_completa_amparo_sevilla` y `20260902125718_aplica_paleta_amparo_sevilla`.
- El cierre de La Sed se ejecutó mediante DML editorial sobre el modelo vigente.
- Cada bloque de escritura de La Sed fue prevalidado con `BEGIN … ROLLBACK`.
- No hubo DDL, nueva tabla, nuevo enum, RLS ni arquitectura.
- Supabase conserva únicamente la rama `main`.

## Lotes cerrados

### Amparo

**AMPARO → 🟢 CERTIFICADA**

Documento: `docs/CERTIFICACION-AMPARO-2026-09-02.md`.

No se reabrió el lote. Durante el smoke final se detectó una Fuente de Cantillana que llegaba a la ficha por dos enlaces globales redundantes a profesionales compartidos. Se corrigió exclusivamente esa contaminación documental:

- Fuente afectada: `Simpecado de los Devotos · Hermandad Sacramental de la Asunción`.
- Se eliminaron 2 `source_links` globales redundantes a agentes.
- Se conservaron 4 enlaces exactos de esa Fuente al Simpecado y sus intervenciones en Cantillana.
- Prevalidación: `BEGIN … ROLLBACK` correcta.
- DDL: 0.
- Smoke posterior de Amparo: HTTP 200, patrimonio musical completo y Fuente ajena ausente.

### San Esteban

**SAN ESTEBAN → 🟢 CERTIFICADA**

Documento: `docs/CERTIFICACION-SAN-ESTEBAN-2026-09-02.md`.

No se reabrió ni se modificó contenido del lote. El smoke de no regresión posterior a #562 mantuvo la ficha operativa y sus bloques certificados.

### Hermandad de la Sed

**LA SED → 🟢 CERTIFICADA · SIN BLOQUEOS DE GRAFO**

Documento: `docs/CERTIFICACION-LA-SED-2026-09-03.md`.

Top 3 inicial:

1. La Sed · prioridad aproximada 27/31 · completitud técnica 29 %.
2. Aguas Santas de Villaverde del Río · prioridad aproximada 23/31 · completitud 29 %.
3. Virgen del Castillo de Lebrija · prioridad aproximada 22/31 · completitud 21 %.

La Sed fue la única Hermandad abierta como nuevo lote.

## Cierre documental · La Sed

### Identidad y Sede

- Nombre canónico completo normalizado.
- Nombre popular: La Sed.
- Penitencia + Sacramental.
- Fundación: 8 de septiembre de 1969.
- Fusión sacramental: 28 de octubre de 1972.
- Sede: Parroquia de la Concepción Inmaculada.
- Dirección: Calle Cristo de la Sed, 41, 41005 Sevilla.
- Horarios de apertura y misas verificados el 3/09/2026.
- Hábito reglamentario estructurado.
- Colores negro y blanco, sin HEX inventado.

### Titulares

Tres titulares publicados y relacionados:

- Santísimo Cristo de la Sed · Luis Álvarez Duarte · 1969–1970.
- Santa María de Consolación Madre de la Iglesia · Antonio Joaquín Dubé de Luque · 1969.
- San Juan Evangelista · Antonio Joaquín Dubé de Luque · 1986.

Intervenciones estructuradas: 8.

La evaluación de Pedro Manzano de marzo de 2026 se conserva como diagnóstico publicado; no se inventa una intervención posterior.

### Pasos y capataces

- Pasos publicados: 2.
- Fases: 7.
- Agentes/autores en fases: 15.
- Cristo: Fernando Adriaensens Lázaro, vigente en 2026.
- Palio: Manuel Vizcaya López, vigente en 2026.

### Música

Acompañamientos vigentes:

- Rosario de Cádiz → Cristo → desde 2017.
- Banda Municipal de Música de Mairena del Alcor → palio → desde 2001.
- Banda de Música La Oliva de Salteras → palio → desde 2002.

La procesión de Consolación del 3 de octubre de 2026 permanece sin banda asignada porque su Fuente específica no documenta acompañamiento musical.

### Patrimonio

Cuatro bienes representativos:

- Custodia Sacramental · 1997–1998 · Hermanos Caballero González.
- Cruz de Guía · 1981–1983 · Manuel de los Ríos.
- Potencias del Cristo · Fernando Marmolejo Camargo / Fernando Marmolejo.
- Manto de salida de Consolación · Fernando Prini / taller de Charo Bernardino · 2017–2025.

El nuevo techo de palio aprobado en mayo de 2026 queda como proyecto/acontecimiento, no como patrimonio ejecutado.

### Patrimonio musical

Seis marchas certificadas:

- `Cristo de la Sed` · Pedro Gámez Laserna / Juan Antonio Cuevas Muñoz · 1973.
- `Consolación de Nervión` · Abel Moreno · 1987.
- `Consolación` · Pedro Morales · enero de 2002.
- `Madre de Consolación` · José Juan Gámez Varo · 2007.
- `Camino vas del Calvario` · Manuel Alejandro González Cruz «Quini» · 2013.
- `A mi Cristo de la Sed` · Francisco Javier Alonso Jiménez · 2026.

No se amplía por homonimia.

### Cultos

- Cultos ordinarios: 14.
- Ocurrencias concretas de 2026: 7.
- Fechas futuras no confirmadas del Mes de la Virgen no se infieren.
- Besamanos: último domingo de septiembre y sábado anterior, según modificación del artículo 50.K aprobada en 2007; la discrepancia con la redacción anterior de la página de Reglas queda documentada.

### Salidas y acontecimientos

- Procesión ordinaria de Consolación: 3 de octubre de 2026, 18:00; Virgen y paso relacionados.
- Extraordinaria histórica: 17 de septiembre de 1994 por el XXV aniversario fundacional.
- Acontecimientos: XXV aniversario de 1994 y aprobación del nuevo techo de palio el 13 de mayo de 2026.

### Multimedia

**HUECO LEGÍTIMO → 🟣 0 RECURSOS AUTORIZADOS**

No se incorporan imágenes web o de prensa sin trazabilidad de derechos.

**SIN FOTO > FOTO SIN DERECHOS.**

### Fuentes

- No quedan relaciones críticas certificadas sin Fuente.
- URLs duplicadas dentro del lote: 0.
- El smoke post-certificación detectó que la vista pública heredaba Fuentes de agentes compartidos y que Patrimonio musical solo leía dedicatorias al nodo Hermandad.
- #562 corrigió ambas lecturas de forma genérica: dedicatorias a Hermandad + titulares y filtrado de Fuentes que llegan exclusivamente por agentes compartidos.
- Smoke de producción posterior a #562: las 6 marchas aparecen en Patrimonio musical y desaparecen las Fuentes ajenas de San Esteban, Baratillo y San Benito.

## Salud del grafo · La Sed

**RESULTADO → 🟢 CLEAN**

- Titulares: 3.
- Pasos: 2.
- Fases: 7.
- Agentes de fase: 15.
- Capataces vigentes: 2.
- Acompañamientos vigentes: 3.
- Patrimonio material: 4.
- Marchas dedicadas: 6.
- Cultos: 14.
- Ocurrencias 2026: 7.
- Acontecimientos: 2.
- Salidas: 2.
- Enlaces Imagen/Paso del 3/10: 2.
- Imágenes sin autoría: 0.
- Relaciones críticas sin Fuente: 0.
- Patrimonio sin padre: 0.
- Marchas sin autor: 0.
- Media incompleta: 0.
- Slugs duplicados: 0.
- URLs duplicadas en el lote: 0.

## Completitud · La Sed

- Inicial: 29 %.
- Final: 86 %.

Aproximación editorial:

- Identidad → 95 %.
- Sede → 100 %.
- Titulares → 95 %.
- Pasos → 95 %.
- Música → 90 %.
- Patrimonio → 90 %.
- Cultos → 92 %.
- Extraordinarias / acontecimientos → 85 %.
- Multimedia → 15 %.
- Fuentes → 100 %.

La baja puntuación de Multimedia refleja ausencia de recursos autorizados, no relaciones rotas.

## QA de aplicación posterior a la certificación

**#562 → 🟢 MERGED**

Corrección demostrada durante el smoke de La Sed:

- Patrimonio musical público ahora incluye dedicatorias a la Hermandad y a sus titulares.
- Las Fuentes globales de autores/capataces compartidos ya no contaminan otras fichas salvo que tengan además una relación propia con la Hermandad mostrada.
- Sin excepciones nominales.
- `npm ci`: verde.
- `npm test`: verde.
- `npm run build`: verde.
- Vercel: verde.
- Producción: `READY`.
- Runtime: 0 `error/fatal` propios.

## Actualidad urgente fuera del lote

Durante la selección se detectó una discrepancia actual en Virgen del Castillo de Lebrija: la información reciente por obras de Santa María de la Oliva modifica la sede/traslado y el programa municipal sitúa la procesión del 12 de septiembre a las 19:00 mientras Hilo conserva un dato anterior. No se abrió ni modificó esa Hermandad para respetar la regla de un único lote.

## #492

**#492 → 🟣 AISLADA**

Sigue bloqueando DDL, nuevas tablas, migraciones estructurales, RLS y arquitectura. No bloquea DML editorial.

## Aportaciones públicas

**APORTACIONES → 🔒 DESACTIVADAS**

- `/colabora` mantiene el servicio cerrado.
- No se activó formulario ni endpoint.
- No se modificaron RLS, Auth, Storage ni secretos.

## Estado del frente

**AMPARO → 🟢 CERRADA Y CERTIFICADA**
**SAN ESTEBAN → 🟢 CERRADA Y CERTIFICADA**
**LA SED → 🟢 CERRADA Y CERTIFICADA**

No queda otra Hermandad abierta por esta orden.

**SIGUIENTE MOVIMIENTO → ESPERAR DIRECCIÓN.**
