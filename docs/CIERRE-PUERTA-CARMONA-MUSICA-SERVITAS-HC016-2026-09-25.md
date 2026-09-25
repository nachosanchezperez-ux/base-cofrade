# Cierre de puerta · música y Servitas · Carmona · HC-016

**Fecha:** 25 de septiembre de 2026  
**Fase:** PRE-ROW-BY-ROW · PUERTA CERRADA  
**Base de trabajo:** `f1bcda7f2e166038a8d3dc447ce424d959fbb3f9`  
**Namespace candidato:** `c0160035-*`  
**Escrituras editoriales ejecutadas:** **0**  
**DDL / RLS:** **0**

## 1. Preflight vivo

La reapertura de Carmona se hace después del cierre certificado del P0 de producción.

- GitHub: `main` en `f1bcda7f2e166038a8d3dc447ce424d959fbb3f9`; 0 PR abiertas en el preflight.
- Vercel: último deployment productivo documental `dpl_BMwFKgHuJk2LeoaFWMh39mpYUwVc`, estado `READY`.
- Supabase: proyecto `kcevwkucqzcyrqaimyhl` en `ACTIVE_HEALTHY`; SQL operativo; 15 migraciones remotas.
- Runtime Vercel: 0 errores en la ventana de dos horas revisada.
- Namespace `c0160035-*`: 0 colisiones en `entities`, `outings`, `places`, `sources`, `steps`, `bulk_imports` y `bulk_import_items`.

El P0 deja de ser una puerta bloqueante para HC-016 Carmona.

## 2. Música penitencial · cierre de los tres huecos

### 2.1 Servitas · Viernes de Dolores · 27/03/2026

**Resultado:** CERRADO · REUSE.

La Banda Municipal de Música de Mairena del Alcor publicó el 30 de marzo de 2026 una grabación de la salida de los Servitas de Carmona del Viernes de Dolores, indicando expresamente que acompañó al paso de palio de María Santísima de los Dolores.

- Banda canónica existente: `d6852052-92bb-4b54-b551-e52b656dea6d`.
- Decisión: REUSE; no crear una nueva Banda.
- La particularidad de que la corporación recorra el primer tramo en oración sin banda y esta se incorpore después de la Prioral se conserva como nota/segmento; no invalida el acompañamiento del paso.

Fuente principal:
- Banda Municipal de Música de Mairena del Alcor · vídeo posterior: https://www.youtube.com/watch?v=PCCkBQSM1z8

### 2.2 Humildad y Paciencia · paso del Señor · 03/04/2026

**Resultado:** CERRADO PARA PRIMERA EDICIÓN · REUSE.

La vinculación con la Banda de Cornetas y Tambores Amor y Sacrificio de Lebrija queda documentada por la propia formación y por continuidad pública de la relación con la Hermandad de Humildad y Paciencia de Carmona. El director de la banda identifica expresamente el Viernes Santo de Carmona dentro de sus acompañamientos vigentes; la formación vuelve a figurar vinculada a la misma corporación carmonense en 2026.

- Banda canónica existente: `c0160033-0404-4000-8000-000000000004`.
- Decisión: REUSE; no crear una nueva Banda.
- Trazabilidad: la fuente de banda es suficiente para identificar formación y municipio; el source_link debe conservar que la evidencia de la relación es de continuidad y no una reconstrucción por oído.

Fuentes:
- Entrevista al director de Amor y Sacrificio, Hermandad del Castillo de Lebrija: https://hermandaddelcastillo.org/wp-content/uploads/2025/04/MAQUETACION-BOLETIN-26-2025-EL-CASTILLO-para-revision-2.pdf
- TV Carmona · dosier Corpus 2026, misma corporación y misma formación: https://www.televisioncarmona.com/noticia/16821/0/DOSIER-INFORMATIVO-CORPUS-CHRISTI-2026-EN-CARMONA/

### 2.3 Cristo de los Desamparados · 03/04/2026

**Resultado:** CERRADO · SIN ENTIDAD BANDA.

La salida de 2026 queda documentada como cortejo de absoluto silencio y recogimiento. No procede insertar ni asignar una Banda.

- Decisión de modelado: posición resuelta como **sin acompañamiento musical**, no como «música desconocida».
- No crear `outing_music_assignment`.
- Si se materializa una `outing_music_position`, debe quedar explícita la ausencia de banda para evitar que el UI la interprete como deuda editorial.

Fuente posterior:
- ArteSacro · «Silencio del pueblo de Carmona ante el Cristo de los Desamparados en la mañana de Viernes Santo»: https://www.artesacro.org/Noticia.asp?idreg=167327

## 3. Servitas · Procesión del Escapulario · 19/09/2026

### 3.1 REUSE de la Salida

La salida ya existe en producción:

- `outings.id = ea6ab0d1-e6c4-4ea1-8727-92cee4ce3218`
- slug `carmona-servitas-dolores-santo-escapulario-2026-09-19`
- `status = published`
- estado actual previo a corrección: `event_status = announced`.

No se recrea.

### 3.2 Celebración posterior

ArteSacro publicó el 23 de septiembre que la Fraternidad Seglar de los Siervos de María de Carmona **realizó el sábado 19 de septiembre** la Procesión del Escapulario, peregrinando al Monasterio de Santa Clara.

Decisión futura row-by-row:

- REUSE del `outing` existente;
- actualizar `event_status` de `announced` a `held`;
- mantener `status = published`;
- añadir Fuente posterior y source_link de celebración.

Fuente:
- https://www.artesacro.org/Noticia/Ver/169164/provincia-triduo-virgen-dolores-siervos-maria-carmona

### 3.3 Reparación de la Fuente original

La Fuente productiva actual `Servitas Carmona · publicación oficial en Instagram` conserva URL y fecha nulas. No se elimina; se repara/concilia contra la convocatoria oficial ya recuperada y se añade la evidencia posterior.

Convocatoria trazable:
- publicación oficial Servitas ya inventariada como `CAR-F26`;
- guía del 19 de septiembre con recorrido y MAFERMAN: https://www.elpespunte.es/articulo/cofrade/procesiones-19-septiembre-sevilla-provincia-horarios-recorridos-bandas/20260919133026152119.html

### 3.4 Música de septiembre

MAFERMAN queda **documentada como acompañamiento anunciado**. La celebración de la procesión ya está probada, pero no se ha localizado una fuente posterior que nombre expresamente a la formación durante la ejecución.

Decisión conservadora:

- no elevar el anuncio a «ejecución probada»;
- permitir source_link del anuncio;
- no forzar un `outing_music_assignment` histórico si el contrato de datos exige participación efectiva.

### 3.5 Paso de septiembre

No hay prueba suficiente para afirmar que la Procesión del Escapulario reutilizó el mismo Paso documentado para el Viernes de Dolores.

Decisión:

- relación septiembre–Paso = **NULL / no materializada**;
- no insertar un segundo Paso;
- no inferir REUSE por similitud visual.

## 4. Estado de la puerta

Con estos cierres:

- las 18 posiciones musicales penitenciales dejan de tener huecos semánticos: las bandas identificadas se modelan como REUSE/INSERT, la música de capilla no crea Banda y Desamparados se cierra como silencio;
- Servitas de septiembre deja de ser una salida meramente anunciada: existe prueba posterior para `held`;
- la Fuente productiva de septiembre tiene reparación definida;
- el posible Paso compartido de septiembre queda resuelto de forma conservadora como `NULL`;
- el namespace `c0160035-*` está libre.

**Resultado:** se autoriza abrir el **plan row-by-row de Carmona**.

Esto **no autoriza** staging, payload SQL, dry-run, Apply, DDL, RLS ni publicación. La siguiente fase debe congelar fila por fila REUSE/UPSERT, IDs deterministas, source_links y recuentos antes de cualquier escritura.
