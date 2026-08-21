# HC-009 · Implementación del sistema tipográfico de Hilo Cofrade

**Estado:** IMPLEMENTADA  
**Decisión de referencia:** `docs/HC-009-sistema-tipografico-hilo-cofrade.md`  
**Ámbito:** web pública + Panel de control  
**Base tipográfica:** Open Sans

## Objetivo

Convertir la decisión HC-009 en una regla de interfaz efectiva, transversal y mantenible. La tipografía deja de depender de cada módulo o ficha y pasa a estar gobernada por una capa canónica común a todo Hilo Cofrade.

## Implementación

### 1. Una sola familia cargada

La interfaz carga únicamente **Open Sans** mediante `@fontsource` desde `app/layout.js`.

Pesos disponibles:

- 400 · texto general;
- 600 · etiquetas y metadatos secundarios;
- 700 · subtítulos, tarjetas, datos y controles;
- 800 · jerarquía principal y títulos de máximo nivel.

No se carga ningún peso 900 ni una segunda familia tipográfica.

### 2. Capa canónica

`app/typography.css` es la fuente de verdad de la presentación tipográfica. Contiene:

- familia;
- pesos admitidos;
- escala de tamaños;
- `line-height`;
- `letter-spacing`;
- jerarquía pública;
- jerarquía específica del Panel;
- adaptación responsive.

La capa usa el ámbito global `#hc-app` para prevalecer sobre declaraciones históricas que aún permanezcan en hojas de estilo antiguas.

### 3. Sin pesos sintéticos

`font-synthesis: none` evita que el navegador fabrique visualmente pesos inexistentes cuando una regla histórica solicita, por ejemplo, 900. El resultado renderizado permanece dentro de los pesos Open Sans realmente cargados.

### 4. Web pública

La escala pública queda gobernada por los tokens HC-009:

- display / H1: 42–58 px;
- H2: 30–40 px;
- H3 / tarjeta: 21–26 px como escala disponible;
- lead: 18 px;
- cuerpo: 16 px;
- lectura larga: 17 px;
- metadatos: 12 px;
- eyebrow: 10 px;
- controles: 13 px.

En móvil se reduce la escala de display manteniendo la jerarquía y la legibilidad.

### 5. Panel de control

`app/panel/layout.js` delimita el ámbito con `#hc-panel`.

El Panel usa la misma familia, pesos y lógica jerárquica que la web pública, pero con una densidad funcional propia:

- H1: 30–44 px;
- H2: 21 px;
- H3: 18 px;
- subtítulos de edición: 15 px;
- cuerpo: 14 px;
- controles: 13 px.

Esto evita una segunda identidad visual sin sobredimensionar formularios, tablas o herramientas de edición.

## Compatibilidad con CSS heredado

Todavía existen declaraciones históricas como `font-family: Georgia, serif` o `font-weight: 900` dentro de hojas antiguas, especialmente `app/globals.css`.

No son la fuente de verdad ni bloquean HC-009: la capa canónica de `app/typography.css`, con mayor especificidad dentro de `#hc-app`, gobierna la familia renderizada; `font-synthesis: none` impide pesos artificiales.

La eliminación física de esas declaraciones queda como **limpieza técnica progresiva**, para evitar una refactorización masiva de estilos sin valor funcional y reducir el riesgo de regresiones visuales.

## Protección frente a regresiones

`test/typography-system.test.mjs` comprueba automáticamente que:

- solo se carga Open Sans;
- solo se cargan 400 / 600 / 700 / 800;
- existe la escala canónica;
- no aparece Georgia ni Times New Roman dentro de la propia capa HC-009;
- el Panel mantiene un ámbito tipográfico propio dentro del mismo sistema;
- la interfaz conserva `font-synthesis: none`.

## Cambios de datos

Ninguno.

- No hay migraciones Supabase.
- No hay cambios de esquema.
- No hay cambios de contenido editorial.

## Validación de cierre · 21/08/2026

Implementación principal:

- PR **#134 · Implementa HC-009 · sistema tipográfico global**;
- merge en `main`: `db5d5de83e61192e60231bf987cee799d62d313b`;
- deployment funcional de producción: `dpl_BAobuwxFxnEyXi5sAyNs67HaF7h9`.

Validación automática:

- **17/17 tests** superados;
- `npm run build` superado;
- preview Vercel del head validado antes del merge;
- build de producción sin errores.

Smoke test sobre `hilocofrade.es`, sirviendo el deployment exacto de HC-009:

- Home · 200;
- directorio de Hermandades · 200;
- ficha de El Baratillo · 200;
- ficha de Nuestra Señora de la Piedad · 200;
- ficha de Banda del Sol · 200;
- acceso al Panel · 200;
- `#hc-app` presente en la aplicación;
- `#hc-panel` presente en el ámbito administrativo;
- navegación y relaciones previas conservadas.

Evidencia de CSS en producción:

- Open Sans es la única familia cargada mediante `@font-face` por HC-009;
- solo se cargan pesos 400 / 600 / 700 / 800;
- los tokens canónicos están presentes en el bundle servido;
- `#hc-app` aplica la familia y `font-synthesis: none`;
- `#hc-panel` aplica la escala administrativa;
- las reglas responsive de HC-009 están presentes.

Runtime del deployment exacto `dpl_BAobuwxFxnEyXi5sAyNs67HaF7h9`:

- **0 logs `error` / `fatal`** durante la validación.

La consulta global del proyecto sí conserva dos respuestas 429 de Supabase Auth procedentes de un deployment anterior (`dpl_5jPR2a5wHWsnzjPAZCQmnygENDBu`); no corresponden al deployment de HC-009 y no se consideran regresión de esta decisión.

La validación móvil de cierre es **estructural responsive**: viewport correcto y media queries canónicas servidas en producción. La limpieza visual pixel-perfect por navegador/dispositivo queda fuera del criterio de implementación de la decisión tipográfica.

## Criterios de cierre

- [x] Open Sans es la única familia cargada por la aplicación.
- [x] Los únicos pesos cargados son 400 / 600 / 700 / 800.
- [x] Existe una escala tipográfica centralizada y reusable.
- [x] Web pública y Panel comparten la misma identidad tipográfica.
- [x] El Panel dispone de una escala compacta explícita.
- [x] La jerarquía responsive está definida.
- [x] Existe protección automática frente a regresiones básicas.
- [x] CI y build de producción validados.
- [x] Smoke test final de web pública y Panel validado.

**HC-009 queda IMPLEMENTADA.** La retirada física de declaraciones tipográficas heredadas se mantiene como deuda técnica de limpieza y no reabre la decisión mientras la capa canónica siga gobernando la interfaz.
