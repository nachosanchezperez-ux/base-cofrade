# Hilo Cofrade · Estado canónico

**Corte validado:** 6 de septiembre de 2026 · cierre avanzado de Consolación de Osuna  
**HEAD funcional previo a esta sincronización:** `main = f0af0d048dc0f81c6ff4c4cb56f6fa0d6ad3746b`  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase:** editorial / documental sobre el modelo vigente  
**Frente editorial de Hermandad activo:** ninguno

> GitHub, Supabase y Vercel prevalecen siempre sobre cualquier SHA transitorio escrito en documentación. Las PR abiertas no se consideran estado canónico hasta su integración y validación.

## Última actualización cerrada · Consolación de Osuna · 2026-09-06

**CONSOLACIÓN DE OSUNA → CERRADA Y CERTIFICADA · 100 % TÉCNICO · INDEXABLE · GRAFO NUCLEAR LIMPIO.**

Documento: `docs/CERTIFICACION-CONSOLACION-OSUNA-2026-09-06.md`.

PR funcional: [#661](https://github.com/nachosanchezperez-ux/base-cofrade/pull/661).

Resultado:

- punto de partida: 36 % técnico;
- identidad oficial, fundación en 1624 y sede canónica estructuradas;
- 1 titular publicado;
- 1 paso de Gloria relacionado;
- 2 cultos recurrentes y 2 ocurrencias de 2026;
- 1 salida patronal de 2026 enlazada con titular, paso, sede y música;
- Banda de Música Villa de Osuna como acompañamiento actual documentado;
- 3 integrantes del equipo de capataces y auxiliares de 2026;
- 2 acontecimientos históricos estructurados;
- fuentes institucionales, patrimoniales y periodísticas enlazadas;
- duplicados nucleares a cero;
- completitud técnica final: 100 %.

### Actualidad estricta

- la salida del 8 de septiembre de 2026 permanece `announced` hasta que exista evidencia posterior de celebración;
- la Novena y la Función Principal conservan su estado temporal de 2026 sin adelantar hechos futuros;
- el convenio de la Banda Villa de Osuna se documenta desde el 23 de diciembre de 2025 con una vigencia publicada de cuatro años;
- no se inventa una fecha exacta de finalización del convenio;
- el convenio municipal no se presenta como contrato directo de la Hermandad;
- los 24 costaleros y el equipo de capataces/auxiliares se acotan a la salida de 2026;
- no se asigna a cada integrante una función concreta que la fuente no desglose.

### Cronología de la titular

No se fuerza una fecha única para Nuestra Señora de Consolación:

- el catálogo BIC del BOE la data como obra anónima anterior a 1400, reformada en el siglo XVII;
- la tradición difundida por el Ayuntamiento de Osuna la vincula a una llegada desde Inglaterra en el siglo XVI.

La ficha conserva ambas capas separadas y no convierte la tradición local en datación artística.

### QA público

Validado sobre producción:

- `/hermandades/consolacion-osuna` → HTTP 200;
- canonical exacta;
- `index, follow`;
- OG/Twitter válidos;
- sede, titular, paso, acompañamiento, historia, salida, cultos y fuentes visibles;
- 10 fuentes visibles;
- 0 errores `error/fatal` localizados para la ruta durante la ventana auditada.

### Migraciones

- `20260906095000_cierra_consolacion_osuna.sql`;
- `20260906095100_vincula_acompanamiento_consolacion_osuna.sql`;
- `20260906095200_ajusta_vigencia_banda_villa_osuna.sql`.

Supabase producción: **72 migraciones alineadas**, última versión `20260906095200`.

## Estado técnico actual

Estado validado tras el cierre funcional #661 y antes de esta sincronización documental:

- GitHub: `main = f0af0d048dc0f81c6ff4c4cb56f6fa0d6ad3746b`;
- producción Vercel: `dpl_HWbce3Wc6VSo9GW8GKkjeAcP6G9X` · `READY` · mismo SHA de `main`;
- Supabase: operativa · 72 migraciones alineadas;
- Consolación de Osuna: 100 % técnico · indexable · grafo nuclear limpio;
- Purísima de La Algaba: 93 % técnico · cerrada · música 2026 sin confirmar;
- San Bernardo: 100 % técnico · cerrada;
- Jesús Despojado: 100 % técnico · cerrado;
- Las Aguas: cerrada y revalidada;
- #492: abierta y aislada;
- FIRST EDITION FREEZE: activo.

## PR concurrentes abiertas

A la hora de este corte existen dos PR abiertas que **no forman parte del cierre de Consolación de Osuna** y no deben mezclarse con él:

### #659 · Rediseña las salidas de las Hermandades

- tipo: UX / presentación;
- base original: `94aea60f5f37e9195c5189e8a3cb2c94e326d598`;
- estado observado: abierta;
- no se considera canónica mientras no se reconcilie contra el `main` posterior a #661 y se valide de nuevo.

### #660 · Corrige Sastres y la Luz en la Banda de Música de Las Cigarreras

- tipo: corrección de datos/regresión;
- base original: `94aea60f5f37e9195c5189e8a3cb2c94e326d598`;
- estado observado: abierta y mergeable antes de reconciliar con #661;
- corrige la asignación de Nuestra Señora de los Reyes · Sastres y Nuestra Señora de la Luz hacia la Banda de Música María Santísima de la Victoria;
- no se considera canónica hasta su integración y validación sobre el `main` actual.

Estas PR explican que el repositorio no esté en estado de **0 PR abiertas** aunque Consolación de Osuna sí haya quedado cerrada.

## Cierres documentales vigentes

Estas fichas no deben reabrirse por deuda legítima, mejoras cosméticas o por perseguir porcentajes. Solo procede reabrirlas ante una regresión real o nueva información verificable que cambie materialmente su estado.

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
- **Consolación de Osuna · 100 % técnico**.

Los detalles de cada cierre permanecen en sus documentos de certificación específicos y no se duplican aquí salvo cuando afectan al estado operativo actual.

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

No bloquea:

- contenido/DML editorial;
- Hermandades, titulares y pasos;
- música, patrimonio y cultos;
- acontecimientos y salidas;
- Fuentes, agentes y relaciones existentes;
- SEO editorial.

Sí bloquea:

- nuevo DDL;
- nuevas tablas;
- migraciones estructurales;
- cambios RLS relacionados.

No debe resolverse reescribiendo migraciones históricas ya aplicadas ni modificando producción por un problema exclusivo de preview.

## Auditor

El cierre de Consolación de Osuna es válido y no queda deuda A pendiente en su contrato actual.

La desviación operativa real está fuera de la ficha: mientras este cierre se ejecutaba aparecieron #659 y #660 desde frentes concurrentes. No se han mezclado, fusionado ni modificado desde este ciclo.

Por disciplina de frente único, **no debe abrirse otra Hermandad mientras #659 y #660 sigan abiertas sin reconciliar contra el `main` real**.

## Siguiente movimiento autorizado

1. terminar esta sincronización documental;
2. reconciliar #659 y #660 contra el `main` posterior a #661;
3. decidir por separado si cada una sigue siendo válida y mergeable;
4. volver a 0 PR abiertas o documentar expresamente el bloqueo que lo impida;
5. solo después ejecutar un nuevo recálculo de deuda antes de elegir otra Hermandad.
