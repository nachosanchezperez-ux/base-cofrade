# Hilo Cofrade · Estado canónico

**Corte operativo:** 8 de septiembre de 2026 · El Museo certificado mediante HC-016

**HEAD funcional auditado:** `9022aaa1cf90d4c9d6aa4aade8a9e3454926362f`

**Producción auditada:** `dpl_GG5TAiW4Cb3iGJXypUdtm9jmrSQk` · `READY` · mismo SHA que el HEAD funcional auditado

**PR abiertas antes de sincronizar esta fotografía:** **0**

**Régimen:** `FIRST EDITION FREEZE` activo

**Frente editorial de Hermandad:** San Pablo, Mercedes de la Puerta Real y El Museo cerradas; no existe otra ficha abierta

> GitHub, Vercel y Supabase prevalecen sobre cualquier fotografía anterior. El HEAD canónico posterior será el commit de `main` que contenga este documento; `9022aaa1…` identifica el producto y los datos auditados antes de la sincronización documental.

## Dónde estamos ahora

HC-016 ya funciona como método editorial operativo. San Pablo fue el primer lote real; Mercedes de la Puerta Real acreditó el segundo contexto y dejó corregida la validación sistémica de autorías; El Museo vuelve a ejecutar el circuito completo en una Hermandad penitencial con mayor densidad histórica, artística, litúrgica y relacional.

El cierre de El Museo no incorporó código, DDL, tablas, migraciones, cambios RLS ni excepciones por `slug`. Todo el DML pasó por:

```text
CARGA → STAGING → PREFLIGHT GLOBAL → REVISIÓN → APPLY → RESULTADOS
```

## Lotes anteriores que siguen certificados

- **San Pablo:** 183 filas originales aplicadas, remediadas o descartadas con causa; su remate de 41/41 continúa cerrado. Las correcciones de #694, #695, #696, #698 y #699 siguen integradas.
- **Mercedes de la Puerta Real:** segundo contexto real cerrado. La validación genérica de `image_authorships.authorship_type` de #705 impide que el fallo determinista descubierto alcance Apply; #706 mantiene separados motivo e itinerario de Salidas.

## Recálculo de deuda y selección de El Museo

La deuda se recalculó desde el grafo real entre Hermandades publicadas no certificadas, antes de escribir. No se confundieron ausencia documental, dato no aplicable, contenido no publicado, pendiente de verificar y deuda real.

| Candidata | Completitud inicial aprox. | Deuda real y potencial | Fuentes | Dificultad | Valor editorial | Cierre con HC-016 |
|---|---:|---|---|---|---|---:|
| El Museo | 43 % | Titulares, Pasos, autorías, hábitos, patrimonio, Cultos, Salidas y relaciones | Buena y mayoritariamente oficial | Media-alta | Muy alto | 93 % |
| El Cachorro | 43 % | Grafo artístico y procesional muy amplio, con más volumen y ambigüedad | Muy buena | Alta | Muy alto | 88 % |
| Cristo de Burgos | 43 % | Núcleo penitencial, titulares, Pasos, Cultos y patrimonio | Buena, con web oficial | Media | Alto | 90 % |

Se eligió **El Museo** porque combinaba fuentes oficiales suficientes, reutilización de nodos existentes y familias relacionales distintas de Mercedes. Era el mejor equilibrio para volver a demostrar el método sin optar simplemente por la ficha más vacía.

## El Museo · diagnóstico inicial

La identidad y la sede ya existían. No había titulares, Pasos, hábitos, Cultos, patrimonio ni media publicados. Sí existía el acompañamiento vigente de la Banda de Música de la Oliva de Salteras, asociado a un Paso de palio aún en borrador; también existían en borrador la Salida histórica del Vía Crucis del Consejo de 2014 y su relación institucional.

La deuda abordable era editorial y relacional. La ausencia de fotografías con licencia reutilizable no justificaba inventar media ni bloquear el cierre.

## Diseño y ejecución del lote

El inventario respetó el orden Fuentes → entidades → Hermandad → titulares/Pasos → agentes → música → patrimonio → Cultos → Salidas → relaciones → `source_links`. Se canonicalizaron las Fuentes y se reutilizaron los nodos que representaban la misma realidad.

### Lote principal

`efbb56a9-640b-4207-9b67-287a39992479` · 114 filas en 17 tablas:

| Familia | Filas |
|---|---:|
| Fuentes | 15 |
| Entidades | 15 |
| Hermandad | 1 |
| Imágenes titulares | 2 |
| Agentes | 4 |
| Pasos | 2 |
| Relaciones Hermandad–Imagen y Hermandad–Paso | 4 |
| Autorías y relaciones Imagen–Paso | 4 |
| Hábitos | 2 |
| Patrimonio e intervenciones | 12 |
| Cultos | 9 |
| Salidas y participantes | 7 |
| `source_links` | 37 |
| **Total** | **114** |

- Carga, Staging y Preflight global: 114/114 válidas, 0 incidencias.
- Plan efectivo: 106 insert · 5 update · 3 reuse.
- Apply: 114/114 procesadas, 0 inválidas, 0 fallos.

Las tres reutilizaciones fueron las Fuentes oficiales de historia y música y la Fuente del Consejo. Los cinco UPDATE afectaron al perfil de El Museo, al Paso de palio y su relación, y a la Salida histórica de 2014; no duplicaron filas existentes.

### Remates editoriales

- `20010f90-60d5-474f-aa1d-80aa8daaa546` · 8/8 UPDATE, 0 fallos: ajustó los vínculos de Fuentes relacionales al contrato genérico `entity_id + scope` que consume el Panel.
- `ec97160a-e0e5-44ec-b6bf-67501dd64fb3` · 2/2, 0 fallos: 1 insert y 1 update para publicar la relación del Vía Crucis del Consejo de 2014 y enlazar su Fuente oficial.

Resultado acumulado: **124/124 operaciones procesadas**, con **107 insert, 14 update y 3 reuse**; ningún error determinista alcanzó Apply.

La incidencia de visibilidad de ocho Fuentes fue una discordancia editorial del lote con el contrato de presentación ya vigente. Se corrigió en el propio lote. No reveló una carencia de validación, resolución, planificación, dependencias, permisos o Apply y no justificó un parche sistémico.

## Certificación de El Museo

La ficha pasa aproximadamente de **43 % a 92 %** de completitud editorial útil:

- identidad, denominación, historia, sede y web oficial;
- 2 titulares publicados con autoría, cronología y material documentados;
- 2 Pasos publicados y relacionados con sus imágenes;
- acompañamiento vigente de la Oliva de Salteras correctamente mostrado como música procesional del palio;
- 2 hábitos penitenciales;
- 9 Cultos recurrentes;
- Estación de Penitencia de 2026 publicada como celebrada, con horario e itinerario documentados;
- Vía Crucis del Consejo de 2014 publicado como salida histórica e integrado en el módulo institucional;
- 6 piezas patrimoniales y 6 intervenciones asociadas;
- 15 Fuentes visibles en la ficha pública y 38 vínculos de Fuente del lote;
- 0 relaciones de El Museo en borrador, 0 duplicados activos de titulares, Pasos o Salidas y 0 enlaces huérfanos.

Huecos legítimos o pendientes de verificar:

- escudo y fotografías con derechos de reutilización comprobados;
- canales sociales distintos de la web oficial;
- capataces, vestidores u otros oficios actuales sin Fuente oficial inequívoca;
- catálogo musical y patrimonial exhaustivo.

No se transformaron anuncios en hechos celebrados ni se inventaron continuidades, fechas, autorías o responsables.

## QA

- auditoría final de Supabase: 2 titulares, 2 Pasos, 2 hábitos, 6 piezas, 9 Cultos y 2 Salidas publicados; relación institucional de 2014 publicada y con Fuente;
- 38 `source_links` del lote, 0 huérfanos, 0 duplicados activos y 0 relaciones relacionadas en borrador;
- Panel: titulares, Pasos, hábitos, Cultos, patrimonio, Salidas y distintivos de Fuentes comprobados;
- ficha pública: canonical correcto, `index, follow`, Open Graph correcto, tres bloques JSON-LD, sin imágenes rotas, desbordamiento horizontal ni errores de aplicación;
- desktop comprobado directamente; los contratos responsive de tablet y móvil quedaron cubiertos por la suite, ya que el navegador remoto no expuso redimensionado de viewport;
- suite completa actual: **659/659**;
- `next build`: correcto con Next.js 16.3.0, TypeScript válido y 13 páginas estáticas;
- `git diff --check`: limpio.

## Actualidad de `main` y producción

Después del corte inicial `08135180…` se integraron cambios ajenos al frente de El Museo hasta `9022aaa1…`. El cierre los conserva. Producción está `READY` en `dpl_GG5TAiW4Cb3iGJXypUdtm9jmrSQk` y coincide con ese SHA antes de esta actualización documental.

La siguiente sincronización documental debe fusionarse mediante una única PR acotada, desplegarse y terminar con producción en el mismo SHA final de `main` y 0 PR abiertas.

## #492 · aislada

[#492](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) sigue abierta y aislada. No bloquea DML editorial ni relaciones soportadas por el modelo vigente. Sí mantiene fuera de alcance nuevo DDL, tablas, migraciones estructurales y cambios RLS.

No existe otro bloqueo operativo.

## Auditor

1. **¿San Pablo continúa cerrado?** Sí.
2. **¿Mercedes de la Puerta Real continúa cerrada?** Sí.
3. **¿El Museo está cerrado?** Sí, con los huecos legítimos expresos.
4. **¿Queda alguna fila del lote en estado indeterminado?** No: 124/124 están aplicadas o reutilizadas con resultado conocido.
5. **¿Algún error determinista nuevo alcanzó Apply?** No.
6. **¿HC-016 es reutilizable como método editorial?** Sí; El Museo repite el circuito sin incorporación manual masiva ni cambios de arquitectura.
7. **¿Existe algún bloqueo aparte de #492?** No.
8. **¿`main`, producción y estado canónico coinciden?** Sí para el HEAD funcional auditado; el commit que contenga esta fotografía será el nuevo HEAD canónico.
9. **¿Había 0 PR abiertas antes de la sincronización?** Sí.

## Siguiente movimiento autorizado

Cerrar la PR documental, verificar producción y volver a 0 PR abiertas. Después podrá recalcularse la deuda y elegirse una única Hermandad; no se abre una tercera ficha durante este frente.
