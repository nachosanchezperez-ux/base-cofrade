# Hilo Cofrade · Estado canónico

**Corte operativo:** 9 de septiembre de 2026 · reconciliación y orden operativo

**HEAD base auditado:** `a910fd9b53e40c9cd5e25440e06861a7f31c147d`

**Producción auditada:** `READY` · mismo SHA que el HEAD base auditado

**PR abiertas al iniciar esta reconciliación:** **0**

**Régimen:** `FIRST EDITION FREEZE` activo

**Frente ACTIVO:** ninguno; el orden operativo está cerrado y no existe un lote editorial abierto

> GitHub, Vercel y Supabase prevalecen sobre cualquier fotografía anterior. El HEAD canónico posterior será el commit de `main` que contenga este documento; `a910fd9b…` identifica la base verificada antes de este remate documental.

## Tablero operativo único

Este apartado sustituye cualquier instrucción de continuidad escrita en auditorías o certificaciones fechadas.

| Posición | Frente | Estado real | Regla |
|---|---|---|---|
| **CERRADO** | Orden operativo | Autoridad documental y cola única integradas en #712 | No reabrir salvo contradicción verificable |
| **BLOQUEADO** | [#492 · Supabase Preview Branches](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) | Reconciliación estructural pendiente | Bloquea DDL, tablas, migraciones estructurales y RLS; no bloquea DML editorial |
| **COLA 1** | Higiene de ramas | Más de 800 ramas remotas distintas de `main`; una rama no equivale por sí sola a trabajo pendiente | Preparar manifiesto por PR/estado y borrar solo en un corte autorizado y recuperable |
| **COLA 2** | Siguiente lote HC-016 | San Pablo, Mercedes de la Puerta Real y El Museo están cerradas; no existe una cuarta ficha abierta | Recalcular deuda, presentar TOP 3 y elegir una sola Hermandad antes de escribir |
| **COLA 3** | Cristo del Perdón · San José de la Rinconada | Ficha publicada; quedan por rematar la música vigente y el escudo solicitado | Tratar como remate acotado, no como ficha nueva ni como cambio estructural |
| **LABORATORIO** | Mejoras de producto y diseño | Ideas de cabeceras, nuevos campos, nuevas secciones y ampliaciones transversales | No activar mientras siga `FIRST EDITION FREEZE` |
| **BLOQUEADO** | HC-018 · Aportaciones públicas | Implementación en código, activación expresamente bloqueada | No abrir `/colabora` hasta superar sus puertas de seguridad, privacidad y antiabuso |

## Verdad de plataforma

- GitHub: `main = a910fd9b…`, 0 PR abiertas y una única issue abierta: #492.
- Vercel: producción `READY` en el mismo SHA.
- Supabase: la base productiva responde y los lotes HC-016 permanecen aplicados.
- Git ↔ Supabase: el historial no se considerará reconciliado hasta cerrar #492. No se reescriben migraciones ya aplicadas ni se usa producción para resolver una limitación de previews.

## Trabajo reciente ya cerrado

No debe mantenerse en la cola lo que ya está integrado y desplegado:

- portadas visuales y carátulas de la discografía de Bandas (#700 y #701);
- circuito seguro de HC-016 y sus tres lotes reales: San Pablo, Mercedes de la Puerta Real y El Museo;
- separación del Vía Crucis institucional y su posición editorial;
- cabeceras de Bandas con el logotipo protagonista (#663);
- ordenación de Hermandades y Bandas por jornada/tipología;
- SEO P3 de Hermandades;
- acompañamientos históricos y cronología musical por Paso de Las Aguas;
- incorporación de Pasión de Linares, Esencia y cinco Bandas de la Semana Santa de Sevilla (#708 y #709).
- paleta negra, blanca y dorada de El Museo (#711);\n- paletas de cinco Hermandades a partir de hábitos documentados (#713).

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

El cierre documental de El Museo quedó integrado en `af81be33…`, su paleta cromática en `63463d7e…`, el orden operativo en `04e75a44…` y las cinco paletas derivadas de hábitos en `a910fd9b…`. Producción estaba `READY` y coincidía con este último SHA antes del remate documental.

Este remate no cambia producto, datos ni alcance. Tras integrarlo, el SHA final de `main` y producción debe prevalecer sobre esta base auditada y GitHub debe volver a 0 PR abiertas.

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
7. **¿Existe algún bloqueo estructural aparte de #492?** No; la divergencia del historial de migraciones queda adscrita a su reconciliación.
8. **¿`main` y producción coinciden?** Sí, en `a910fd9b…` antes de este remate documental.
9. **¿Había 0 PR abiertas antes de la sincronización?** Sí.
10. **¿Existe una cuarta Hermandad abierta?** No.
11. **¿Las ramas remotas equivalen a trabajo activo?** No; deben clasificarse por PR y equivalencia antes de cualquier borrado.

## Siguiente movimiento autorizado

1. Preparar el manifiesto de higiene de ramas sin borrar todavía.
2. Recalcular la deuda editorial desde el grafo real, presentar el TOP 3 y elegir una sola Hermandad.
3. Abrir el cuarto lote real de HC-016 únicamente después de esa elección.

No se abre una Hermandad por continuidad de una conversación antigua ni se activa un frente de Laboratorio durante este corte.
