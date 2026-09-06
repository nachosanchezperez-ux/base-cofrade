# Hilo Cofrade · Estado canónico

**Corte validado:** 6 de septiembre de 2026 · La Carretería · cierre documental avanzado  
**HEAD funcional previo a esta sincronización:** `main = 67cf37ffb30cb0343a4560160f5bc83f512db14c`  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase:** editorial / documental sobre el modelo vigente  
**Frente editorial de Hermandad activo:** ninguno

> GitHub, Supabase y Vercel prevalecen siempre sobre cualquier SHA transitorio escrito en documentación. Las PR abiertas no se consideran estado canónico hasta su integración y validación.

## Último cierre de Hermandad · La Carretería · 2026-09-06

**LA CARRETERÍA → CERRADA Y CERTIFICADA · 100 % TÉCNICO · INDEXABLE · GRAFO NUCLEAR LIMPIO.**

Documento: `docs/CERTIFICACION-LA-CARRETERIA-2026-09-06.md`.  
PR funcional: [#669](https://github.com/nachosanchezperez-ux/base-cofrade/pull/669).

Resultado:

- 4 sedes históricas/canónicas publicadas;
- 3 titulares canónicos;
- 8 cultos y 1 ocurrencia de 2026;
- 2 series habituales y 3 salidas documentadas;
- música de 2026 vinculada a salida y Paso;
- 2 capataces actuales;
- 8 bienes patrimoniales en su nivel correcto del grafo;
- 0 salidas sin Fuente y 0 grupos duplicados de titulares;
- completitud técnica final: 100 %;
- producción `READY`, HTTP 200, canonical exacta, `index, follow` y 0 errores runtime.

Migración: `20260906230000_cierra_la_carreteria.sql`.

## Frente técnico reconciliado · #668 · 2026-09-06

Antes de publicar La Carretería apareció la PR #668. Se detuvo el frente editorial, se auditó e integró primero:

- CI y Vercel correctos;
- 16 piezas procesionales de Las Aguas redistribuidas entre sus tres Pasos (2 / 11 / 3);
- sin DDL, RLS ni arquitectura;
- producción `READY` en `3471ea18a78b39851c81586588b1cabf9cc5beee`;
- #492 reprodujo únicamente el fallo histórico ya aislado.

## Actualización material · Las Aguas · 2026-09-06

La ficha cerrada de Las Aguas se reabrió únicamente por nueva información material verificable: faltaban sus dos salidas habituales en el modelo de series.

PR funcional: [#666](https://github.com/nachosanchezperez-ux/base-cofrade/pull/666).

Resultado:

- estación de penitencia anual del Lunes Santo publicada;
- procesión de gloria anual de Nuestra Señora del Rosario publicada;
- fecha, horario e itinerario concretos reservados para cada edición, sin inventar datos fijos;
- ambas series enlazadas a fuentes institucionales;
- migración DML idempotente, sin DDL, nuevas tablas ni cambios RLS;
- producción y ficha pública certificadas en el deployment `dpl_5VuYin1x1uYmmeR1ixxrWHZmivUF`;
- HTTP 200, canonical exacta, `index, follow` y 0 errores `error/fatal`.

Migración: `20260906215000_completa_salidas_habituales_las_aguas.sql`.

## Último cierre de Hermandad · Consolación de Osuna · 2026-09-06

**CONSOLACIÓN DE OSUNA → CERRADA Y CERTIFICADA · 100 % TÉCNICO · INDEXABLE · GRAFO NUCLEAR LIMPIO.**

Documento: `docs/CERTIFICACION-CONSOLACION-OSUNA-2026-09-06.md`.  
PR funcional: [#661](https://github.com/nachosanchezperez-ux/base-cofrade/pull/661).

Resultado:

- punto de partida: 36 % técnico;
- identidad oficial, fundación en 1624 y sede canónica estructuradas;
- 1 titular y 1 paso de Gloria;
- 2 cultos recurrentes y 2 ocurrencias de 2026;
- salida patronal del 8 de septiembre de 2026 enlazada con titular, paso, sede y música;
- Banda de Música Villa de Osuna como acompañamiento actual documentado;
- 3 integrantes del equipo de capataces y auxiliares de 2026;
- 2 acontecimientos históricos estructurados;
- fuentes institucionales, patrimoniales y periodísticas enlazadas;
- duplicados nucleares a cero;
- completitud técnica final: 100 %.

### Actualidad estricta aplicada

- la salida del 8 de septiembre permanece `announced` hasta disponer de evidencia posterior de celebración;
- la Novena y la Función Principal conservan su estado temporal real de 2026;
- el convenio de la Banda Villa de Osuna se documenta desde el 23 de diciembre de 2025 con una vigencia publicada de cuatro años;
- no se inventa una fecha exacta de finalización del convenio;
- el convenio municipal no se presenta como contrato directo de la Hermandad;
- los 24 costaleros y el equipo de capataces/auxiliares se acotan a 2026;
- no se atribuye a cada integrante un rol individual que la fuente no desglose;
- la cronología de la titular se conserva como discrepancia documentada: catálogo BIC anterior a 1400 con reforma en el siglo XVII frente a tradición local vinculada al siglo XVI.

### QA público final

Revalidado después de integrar los cambios concurrentes de frontend:

- `/hermandades/consolacion-osuna` → HTTP 200;
- canonical exacta;
- `index, follow`;
- OG/Twitter válidos;
- sede, titular, paso, acompañamiento, historia, nuevo módulo de Salidas, cultos y 10 Fuentes visibles;
- 0 errores `error/fatal` en el deployment final durante la ventana auditada.

### Migraciones propias del cierre

- `20260906095000_cierra_consolacion_osuna.sql`;
- `20260906095100_vincula_acompanamiento_consolacion_osuna.sql`;
- `20260906095200_ajusta_vigencia_banda_villa_osuna.sql`.

Las escrituras se probaron dos veces con `ROLLBACK` antes de aplicarse.

## Frentes concurrentes reconciliados

Durante el cierre de Osuna aparecieron trabajos independientes. Se aplicó actualidad estricta y se reconciliaron de forma separada, sin mezclarlos con el DML de la Hermandad.

### #660 · Corrección musical Sastres / Luz

- integrada antes de la primera sincronización de Osuna;
- corrige dos acompañamientos de Gloria asociados a la Banda de Música María Santísima de la Victoria de Las Cigarreras;
- añadió `20260906095500 · corrige_acompanamientos_banda_musica_cigarreras`;
- Osuna fue revalidada después y mantuvo el 100 % técnico.

### #659 · Rediseño del bloque Salidas de Hermandades

- PR originalmente creada desde un `main` anterior;
- se comprobó que sus siete archivos no habían sufrido cambios en los merges posteriores;
- se rebasó sobre el `main` actualizado conservando exactamente su contenido funcional;
- preview Vercel `READY` y build correcto;
- integrada en `f85f7511f530bf7c2f12866f6bb349e6349e9dcd`;
- el nuevo módulo de Salidas está visible también en la ficha de Consolación de Osuna.

### #663 · Cabeceras de Bandas

- ajuste exclusivamente visual de cabeceras/logotipos de fichas de Bandas;
- seis archivos aislados de datos, Hermandades y Salidas;
- rebasado sobre el `main` posterior a #659;
- preview Vercel `READY` y build correcto;
- integrado en `c9938ce440c6baa5583cb99f8a3db372461089a7`.

## Estado técnico actual

Estado validado antes de esta sincronización documental:

- GitHub: `main = 67cf37ffb30cb0343a4560160f5bc83f512db14c`;
- PR abiertas: **0**;
- producción Vercel: `dpl_2DrWFAFTja9hW23XNouFYTNbtJCa` · `READY` · mismo SHA de `main`;
- producción: ficha de Las Aguas comprobada con las dos series anuales visibles;
- runtime `error/fatal`: 0 en el deployment final durante la ventana auditada;
- Supabase: operativa · **77 migraciones registradas** · La Carretería aplicada y verificada;
- Consolación de Osuna: 100 % técnico · cerrada · indexable · grafo nuclear limpio;
- Purísima de La Algaba: 93 % técnico · cerrada · música 2026 sin confirmar;
- San Bernardo: 100 % técnico · cerrado;
- Jesús Despojado: 100 % técnico · cerrado;
- Las Aguas: cerrada y revalidada · estación de penitencia y procesión de Gloria anuales publicadas · patrimonio procesional jerarquizado por Paso;
- La Carretería: 100 % técnico · cerrada · indexable · grafo nuclear limpio;
- #492: abierta y aislada;
- FIRST EDITION FREEZE: activo;
- frente editorial de Hermandad activo: ninguno.

## Cierres documentales vigentes

Estas fichas no deben reabrirse por deuda legítima, mejoras cosméticas o por perseguir porcentajes. Solo procede reabrirlas ante regresión real o nueva información verificable que cambie materialmente su estado.

- Amparo;
- Las Aguas;
- San Esteban;
- La Sed;
- Virgen del Castillo de Lebrija · actualidad de septiembre de 2026;
- Estrella de Coria;
- La Trinidad;
- Consolación de Carrión de los Céspedes;
- Mercedes de Mairena del Aljarafe;
- Dulce Nombre de Bellavista;
- Pino Montano;
- Vera Cruz y Encarnación de Aznalcázar;
- Hermandad Sacramental de Tomares;
- Nuestra Señora de los Reyes · Sastres;
- Hermandad Mayor de Nuestra Señora de Setefilla;
- Hermandad Sacramental de Camas;
- Nuestra Señora de la Luz de San Esteban;
- El Cerro del Águila;
- Pontificia, Real e Ilustre Hermandad de Nuestra Señora de Consolación Coronada de Utrera;
- Hermandad de Nuestra Señora del Valle Coronada de Écija;
- Hermandad de San Bernardo;
- Jesús Despojado · ficha avanzada;
- Purísima de La Algaba · 93 % técnico · música 2026 pendiente de confirmación;
- **Consolación de Osuna · 100 % técnico**;
- **La Carretería · 100 % técnico**.

## Reglas operativas vigentes

- actualidad estricta: el último estado explícitamente validado prevalece;
- una ausencia no es deuda por defecto;
- cada hueco se clasifica como A · deuda real, B · no aplicable, C · no publicado, D · pendiente de verificar o E · hueco legítimo;
- no se persigue el 100 % técnico rellenando datos sin evidencia;
- contratos futuros o duraciones sin fecha exacta no se convierten en fechas inventadas;
- las entidades se reutilizan solo cuando representan la misma realidad;
- no se admiten excepciones por slug para ocultar problemas comunes;
- fotografía/media pública requiere procedencia o derechos trazables;
- cualquier DML editorial nuevo debe ser idempotente y verificable;
- una ficha cerrada solo se reabre por regresión real o nueva información material.

## #492

**#492 · Reconciliar Supabase Preview Branches → ABIERTA Y AISLADA.**

No bloquea contenido/DML editorial, Hermandades, titulares, pasos, música, patrimonio, cultos, acontecimientos, salidas, Fuentes, agentes, relaciones existentes ni SEO editorial.

Sí bloquea nuevo DDL, nuevas tablas, migraciones estructurales y cambios RLS relacionados.

No debe resolverse reescribiendo migraciones históricas ya aplicadas ni modificando producción por un problema exclusivo de preview.

## Auditor

El ciclo queda limpio:

- #668 fue integrada antes de abrir La Carretería y no quedó como frente técnico pendiente;
- La Carretería queda cerrada al 100 %, sin salidas huérfanas de Fuente ni titulares duplicados;
- el doble registro operativo de la migración idempotente de #668 no duplicó datos y no se trata como bloqueo;

- cierre de Consolación de Osuna certificado;
- ampliación material de Las Aguas certificada en base de datos y ficha pública;
- cambios concurrentes reconciliados contra `main` antes de integrarse;
- ningún dato de Osuna fue sobreescrito por los frentes UX o la corrección musical;
- las dos series de Las Aguas están publicadas una sola vez y cada una conserva una fuente enlazada;
- ninguna PR permanece abierta en el corte validado;
- no existe frente editorial de Hermandad activo.

## Siguiente movimiento autorizado

No hay frente editorial activo. El siguiente movimiento deberá comenzar con un preflight de GitHub y producción y, solo con 0 PR abiertas, recalcular la deuda documental sin reutilizar rankings antiguos.
