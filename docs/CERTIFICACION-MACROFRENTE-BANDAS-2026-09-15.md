# Certificación · siguiente macrofrente post-Semana Santa

**Corte:** 15 de septiembre de 2026  
**Seleccionado y ejecutado:** Bandas · trazabilidad pública y reconciliación del grafo  
**Régimen:** `FIRST EDITION FREEZE`  
**Resultado de datos:** lote `c0160025-0000-4000-8000-000000000001` · 23/23 · 0 inválidas · 0 fallos  
**Arquitectura:** sin DDL, tablas, índices, RLS, rutas ni UX nuevas

## Estado general de partida

- `main`: `d6a399c6025db0c43240b967ba81c6a4903e0377`; cinco commits posteriores a la referencia `042ff60…`, todos ya integrados y dedicados al campo Guantes del hábito.
- GitHub: 0 PR abiertas.
- Vercel: `READY`, deployment `dpl_HKp55kMKtgu8JrjsviZShZHhFU9B`, exactamente sobre `d6a399c6…`.
- Supabase: proyecto `Hilocofrade` `ACTIVE_HEALTHY`, PostgreSQL 17.6.1.155.
- Estado editorial: sin frente activo; HC-018 bloqueado; Semana Santa ordinaria de Sevilla y Glorias de septiembre y octubre cerradas.

## Inventario global recalculado

| Macrofrente | Medición verificable | Deuda real | Lectura operativa |
|---|---|---|---|
| Hermandades de Sevilla provincia | 154 publicadas: 103 de Sevilla capital y 51 fuera; 67 en borrador y 1 en revisión; 84 publicadas sin patrimonio, 56 sin Cultos, 29 sin Pasos y 19 sin Imágenes | Alta | La provincia está repartida en muchos municipios con una sola ficha y profundidad desigual. El volumen es real, pero las fichas nominales y la fuente escasa impiden tratar cada hueco como deuda exigible. |
| Glorias | 62 Hermandades públicas: 37 de Sevilla y 25 provinciales; 8 sin Salida y 21 sin Cultos; hay Salidas en los doce meses | Media | Septiembre concentra 40 Salidas de 31 corporaciones y octubre 12 de 11. El resto no forma un “mes siguiente” homogéneo ni justifica abrir noviembre por continuidad. |
| Bandas | 76 públicas antes del lote; 19 sin Fuente directa, 1 sin descripción, 5 sin municipio, 43 sin logo, 56 sin cabecera, 55 sin discografía y 57 sin estrenos; solo 4 sin relación con Hermandades | Alta | La ausencia de Fuente y el duplicado activo eran deuda real. Discografía, estrenos e imágenes no son universales y se separan como profundidad o derechos. |
| Marchas | 560 públicas; 3 sin autoría, 239 sin dedicatoria, 504 sin audio, 184 sin Fuente directa y 18 grupos de título coincidente | Media | Los tres casos sin autoría son dos formas del Himno Nacional y una obra cuya Fuente no identifica autor. Dedicatoria y audio no son obligatorios; los títulos coincidentes pueden ser obras distintas. |
| HC-019 · Crucetas Musicales | 4 crucetas publicadas, 169 entradas, 169 vinculadas a Marchas, 0 entradas sin obra, 4 Salidas, 4 Bandas y 3 Pasos vinculados | Media | El modelo admite crecimiento sin esquema. No existe en Git otro repertorio documentado pendiente; el volumen potencial depende de nuevas Fuentes posteriores, no de arquitectura. |
| HC-020 · Agenda Cofrade | 141 citas futuras: 67 Salidas, 68 ocurrencias de Culto y 6 Acontecimientos; 0 grupos duplicados de Acontecimientos y 0 de Salidas | Baja | La Agenda cubre procesiones, traslados, rosarios y extraordinarias; igualás/ensayos permanecen en su calendario. Las Fuentes de Cultos suelen vivir en el Culto padre y no deben duplicarse mecánicamente en cada ocurrencia. |
| Acontecimientos históricos | 354 Acontecimientos públicos; 325 históricos en `held`; 27 sin Fuente directa; 53 sin Hermandad, de los que 43 son Pregones de las Glorias | Media | El gran bloque sin Hermandad es mayoritariamente institucional, no huérfano. Los 112 pasados preservados en `announced` no se reabrieron ni se usaron para inflar deuda. |
| Patrimonio | 349 bienes públicos; 0 sin padre, 0 con padre no público, 10 sin Fuente, 154 sin material/técnica, 251 sin intervención y 338 sin imagen pública | Media | La estructura relacional es sólida. Intervenciones, material y fotografía no aplican siempre; 338 imágenes ausentes son sobre todo deuda de derechos, no un lote editorial automático. |
| Personas y autorías | 671 agentes; 0 sin `slug`, 7 no públicos, 113 sin texto de perfil, 364 sin Fuente directa y 110 sin relación nuclear | Media | Gran parte de la evidencia está en la autoría o intervención, no en una biografía independiente. Crear 600 biografías sería profundización infinita. |
| SEO y grafo | 2.779 entidades publicadas; 0 sin `slug`, 0 grupos de `slug` duplicado, 202 sin resumen y 751 sin Fuente directa | Baja | La métrica simple de aislamiento sobrestima huérfanos porque no incluye todas las tablas especializadas. El sitemap, las rutas públicas y la navegación ya tienen contratos y regresiones específicos. |

## TOP 3

### 1 · BANDAS · TRAZABILIDAD PÚBLICA Y NODO CANÓNICO

**Deuda real estimada:** Alta

**Qué falta**

- 19 de 76 fichas públicas carecían de cualquier Fuente directa visible.
- La Agrupación Musical Juvenil María Santísima de las Angustias Coronada y Los Gitanos Juvenil representaban la misma formación en dos nodos publicados.
- Una ficha pública no tenía descripción y las relaciones de San Roque estaban en el duplicado mínimo.

**Qué ya está cubierto**

- 72 de 76 Bandas ya tenían relaciones con Hermandades o Salidas.
- Las 19 fichas sin Fuente directa disponían de evidencia en sus periodos o asignaciones musicales.
- El nodo canónico de Los Gitanos Juvenil ya conservaba nombres alternativos, cuatro Fuentes y su identidad visual.

**Fuentes disponibles:** Alta

**Valor para el grafo:** Alto

**Riesgo técnico:** Bajo

**Capacidad de cierre con arquitectura actual:** Alta

**Por qué merece estar en el TOP 3**

- Convierte evidencia ya existente en trazabilidad pública sin inventar perfiles, fechas ni catálogos.
- Repara una fragmentación real del grafo y puede cerrarse de extremo a extremo con DML gobernado.

### 2 · HERMANDADES DE SEVILLA PROVINCIA · COBERTURA TERRITORIAL

**Deuda real estimada:** Alta

**Qué falta**

- Municipios relevantes siguen representados por una sola ficha y muchas fichas provinciales carecen de titulares, Pasos, Cultos o patrimonio relacional.
- 67 Hermandades permanecen en borrador y 1 en revisión; 59 ni siquiera tienen municipio asignado todavía.
- Falta un universo territorial gobernado que distinga corporaciones inexistentes de altas nominales y fichas profundas.

**Qué ya está cubierto**

- Hay 51 Hermandades públicas fuera de Sevilla capital.
- Dos Hermanas, Alcalá de Guadaíra, Alcalá del Río y La Rinconada cuentan ya con contextos profundos certificados.
- HC-016 permite cargar titulares, Pasos, Cultos, Salidas, patrimonio, música y Fuentes sin esquema nuevo.

**Fuentes disponibles:** Media

**Valor para el grafo:** Alto

**Riesgo técnico:** Bajo

**Capacidad de cierre con arquitectura actual:** Media

**Por qué merece estar en el TOP 3**

- Es la infrarepresentación territorial más clara del producto.
- Pierde frente a Bandas porque no puede cerrarse como un único lote sin fijar antes municipios, corporaciones y umbral editorial verificable.

### 3 · MARCHAS Y CRUCETAS · TRAZABILIDAD DEL CATÁLOGO ACTIVO

**Deuda real estimada:** Media

**Qué falta**

- 101 de las Marchas usadas en las cuatro Crucetas no tienen Fuente directa propia, aunque sí quedan documentadas por la Fuente del repertorio.
- 184 de 560 Marchas no tienen `source_links` directos y 18 grupos comparten título.
- Solo 49 grabaciones están modeladas y 56 obras ofrecen escucha por el campo principal o una grabación relacionada.

**Qué ya está cubierto**

- 557 de 560 Marchas tienen autoría publicada.
- Las 169 entradas de Cruceta están vinculadas a Marchas públicas; no hay texto suelto ni entradas huérfanas.
- Las cuatro Crucetas relacionan Salida, Banda y Fuente y pueden crecer sin DDL.

**Fuentes disponibles:** Media

**Valor para el grafo:** Alto

**Riesgo técnico:** Bajo

**Capacidad de cierre con arquitectura actual:** Alta

**Por qué merece estar en el TOP 3**

- Activa conexiones muy densas entre obra, autor, Banda, Paso, Salida y Hermandad.
- No queda primero porque enlazar mecánicamente la Fuente de la Cruceta a 169 obras duplicaría procedencia sin añadir una Fuente independiente, y porque audio/dedicatoria no son universales.

## Seleccionado

**Bandas · trazabilidad pública y nodo canónico.**

Gana por combinar deuda determinista, impacto público inmediato, reutilización de evidencia ya almacenada, cero necesidad de DDL y un criterio de cierre completo. Provincia tiene más volumen, pero no un universo cerrable aún. Marchas ofrece más conexiones potenciales, pero gran parte de su aparente deuda no es obligatoria o ya está contextualizada por HC-019.

## Lote operativo

**Alcance**

- Todas las Bandas publicadas sin Fuente directa en el corte.
- El duplicado publicado de la formación juvenil de la Hermandad de los Gitanos.
- La única descripción vacía de una Banda pública.

**Universo**

- 76 Bandas públicas de partida.
- 19 sin Fuente directa: 18 nodos canónicos más 1 duplicado.
- 2 relaciones musicales pertenecientes al duplicado.

**Exclusiones**

- Bandas históricas archivadas y relaciones históricas no vigentes.
- Discografías, estrenos o patrimonios no acreditados.
- Logos, cabeceras y fotografías sin derechos.
- Municipios que exigen crear o verificar un nodo territorial nuevo.
- Bandas ausentes del producto no documentadas por una relación existente.

**Entidades y relaciones afectadas**

- `entities`, `bands`, `music_accompaniment_periods`, `accompaniments`, `source_links`, `bulk_imports` y `bulk_import_items`.
- No se borra ningún ID. El duplicado queda `archived`; sus dos relaciones pasan al nodo canónico.

**Fuentes**

- 18 Fuentes ya existentes y ya vinculadas a los acompañamientos correspondientes: webs oficiales, Consejo de Hermandades, ayuntamientos, medios especializados y una aportación directa preservada.
- Cada enlace limita su `scope` al hecho realmente acreditado; una Fuente de acompañamiento no se convierte en biografía general de la formación.

**Criterio de cierre**

- 0 Bandas públicas sin `slug`, descripción o Fuente directa.
- 0 relaciones musicales en el nodo duplicado.
- Nodo duplicado archivado y nodo canónico con sus dos periodos vigentes.
- 23/23 operaciones, 0 inválidas, 0 fallos, 0 huérfanos y 0 `slug` duplicados.

## Ejecución

La receta `20260915213000_cierra_trazabilidad_bandas_publicas.sql` recorrió:

1. diagnóstico global y mapa de 18 pares Banda–Fuente;
2. staging de 23 operaciones;
3. preflight transaccional completo;
4. simulación de todas las escrituras y `ROLLBACK` limpio;
5. Apply del mismo lote;
6. postflight relacional y de trazabilidad.

Resultado:

| Métrica | Antes | Después |
|---|---:|---:|
| Bandas públicas | 76 | 75 |
| Bandas públicas sin Fuente directa | 19 | 0 |
| Bandas públicas sin descripción | 1 | 0 |
| Nodos públicos para Los Gitanos Juvenil | 2 | 1 |
| Relaciones en el nodo duplicado | 2 | 0 |
| Periodos vigentes en el nodo canónico | 1 | 2 |
| Nuevos `source_links` | 0 | 18 |
| Operaciones gobernadas | — | 23/23 |
| Inválidas / fallos | — | 0 / 0 |

## QA de datos

- lote `completed`: 23 esperadas, 23 staged, 23 válidas, 23 aplicadas, 0 inválidas y 0 fallos;
- 18 nuevos enlaces, 0 Fuentes inexistentes y 0 entidades inexistentes;
- 0 `source_links` huérfanos en todo el grafo y 0 enlaces con más o menos de un destino;
- 0 grupos de `slug` duplicado;
- 75 Bandas públicas, 0 sin `slug`, 0 sin descripción y 0 sin Fuente directa;
- el nodo duplicado permanece archivado y recuperable, sin periodos ni acompañamientos;
- el nodo canónico conserva cuatro Fuentes propias y reúne dos periodos vigentes.
- `next build` correcto con Next.js 16.3.0, TypeScript válido y 13 páginas estáticas;
- suite completa: **798/798**, sin fallos;
- ficha canónica pública: respuesta 200, `index, follow`, canonical y resumen visibles; el `slug` duplicado responde 404 y `noindex`;
- ficha de Santa Ana de Dos Hermanas: respuesta 200, indexable y con la nueva Fuente visible; contrato responsive cubierto por la suite y comprobación HTTP móvil;
- `git diff --check`: limpio.

## Deuda legítima

- 5 Bandas públicas sin municipio canónico: no se crean municipios o sedes por deducción nominal.
- 42 sin logo y 55 sin cabecera: deuda condicionada a derechos y disponibilidad, no a completitud editorial mínima.
- 55 sin discografía y 57 sin estrenos: no todas las formaciones publican o poseen esos catálogos.
- Profundidad histórica, agentes, patrimonio musical y canales oficiales solo se completarán con evidencia específica.
- Las 9 Bandas archivadas y los acompañamientos históricos no vigentes no se publican para mejorar una métrica.

## Auditor independiente

1. **Deuda grande pero falsa:** multimedia, discografía, estrenos e intervenciones patrimoniales parecían el mayor volumen; en realidad dependen de derechos, aplicabilidad y fuentes.
2. **Área infrarepresentada de verdad:** la provincia, con 51 fichas públicas fuera de Sevilla y muchos municipios representados una sola vez.
3. **Mayor valor con menos trabajo:** elevar la Fuente que ya acreditaba un acompañamiento hasta la ficha de Banda y reunir las relaciones del duplicado canónico.
4. **Riesgo enciclopédico:** convertir cada ausencia de dedicatoria, biografía, intervención, audio o fotografía en deuda obligatoria.
5. **Funcionalidad infrautilizada:** `source_links` de entidad; la evidencia existía, pero quedaba encerrada en relaciones especializadas.
6. **Arquitectura:** HC-016 cierra el lote de Bandas, HC-019 admite nuevas Crucetas y HC-020 conserva la Agenda especializada; no hace falta arquitectura nueva.

## Certificación

El cierre satisface el criterio operativo: alcance ejecutado, lote reconciliado, 0 fallos deterministas, 0 huérfanos, deuda legítima separada, build y suite correctos, ficha pública validada y tablero canónico actualizado. El postflight de integración debe conservar esta misma verdad: `main` desplegado en `READY`, sitemap regenerado, logs sin errores atribuibles y 0 PR abiertas.

**Estado certificado:** MACROFRENTE CERRADO.

## Siguiente movimiento

Después del cierre integral, el único movimiento recomendado es **definir un lote provincial por municipios con universo y umbral editorial**, no abrir otra Hermandad aislada ni continuar con noviembre.
