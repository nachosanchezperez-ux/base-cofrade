# Hilo Cofrade · Certificación documental

## Nuestra Señora de los Reyes · Hermandad de los Sastres

**Corte:** 5 de septiembre de 2026  
**Rama:** `content/cierra-reyes-sastres`  
**Base:** `main = 5f9a895d3aa77fa6c344e1b185a54ccc17f28acb` · #606  
**Régimen:** `FIRST EDITION FREEZE` activo

**SASTRES → 🟢 CERRADA · 86 % TÉCNICO · INDEXABLE · GRAFO CLEAN**

## Resultado

La ficha partía del 21 % y estaba reducida a identidad mínima, mes de salida y una Fuente genérica del directorio de Glorias.

El cierre incorpora, sin DDL, RLS, tablas nuevas, UX ni arquitectura:

- identidad canónica completa;
- existencia documentada en 1252, diferenciada de la tradición fernandina;
- sede actual en la Parroquia de San Ildefonso y Santiago desde 1840;
- titular mariana estructurada;
- cronología y restauración documentada de la imagen;
- paso de tumbilla actual;
- tres cultos recurrentes;
- dos salidas históricas/ordinarias con fecha documentada;
- acompañamiento musical de 2024–2025 sin proyectarlo falsamente como vigente en 2026;
- dos piezas patrimoniales representativas;
- tres acontecimientos históricos relacionados mediante `involves`;
- Fuentes institucionales, diocesanas y hemerográficas enlazadas a su contexto.

## Decisiones editoriales

### Fundación

No se publica una fecha legendaria como fundación exacta. La Parroquia de San Ildefonso documenta noticia fehaciente de la existencia de la Hermandad en **1252**; la tradición corporativa remonta sus orígenes al cerco de Sevilla por San Fernando.

### Titulares

El título oficial incluye a **San Mateo Apóstol y Evangelista** y **San Fernando Rey**, pero no se crean imágenes físicas independientes de ambos mientras no exista documentación suficiente sobre sus esculturas concretas. Nuestra Señora de los Reyes sí queda estructurada como titular mariana.

### Imagen de Nuestra Señora de los Reyes

- autor desconocido;
- siglo XVI;
- imagen sedente y de vestir;
- Niño Jesús barroco posterior, también de autor desconocido;
- restauración de 2005 por Almudena Fernández García y José Joaquín Fijo León, con recuperación de una policromía dieciochesca subyacente.

No se convierte ninguna atribución no documentada en autoría canónica.

### Procesión

La regla pública estable queda como **último sábado de septiembre**.

Se registra como última salida exacta documentada la del **27 de septiembre de 2025**. No se crea una salida exacta de 2026 mientras la Hermandad no publique su convocatoria específica.

### Música

La Banda de Música de **Las Cigarreras** queda documentada tras la Virgen en 2024 y 2025. El periodo se guarda como histórico `2024–2025`, `is_current=false`.

No se presenta como acompañamiento actual de 2026 por mera continuidad histórica.

### Cultos

Se estructuran:

- Festividad de Nuestra Señora de los Reyes · 15 de agosto;
- Solemne Triduo a Nuestra Señora de los Reyes;
- Función Principal de Instituto.

El Triduo y la Función no reciben fechas exactas de septiembre de 2026 hasta convocatoria propia. La práctica reciente de 2024–2025 queda documentada sin convertirse en calendario automático.

## Historia y patrimonio

Acontecimientos estructurados:

1. 1252 · primera constancia documental;
2. 1840 · traslado a San Ildefonso tras abandonar el Convento Casa Grande de San Francisco;
3. 2003 · recuperación de la procesión anual.

También se registra como salida histórica la participación de la Virgen en el **Congreso Mariano Nacional de Zaragoza de 1954**.

Patrimonio representativo:

- coronas de plata y pedrería de la Virgen y el Niño · finales del siglo XVI;
- techo bordado de la tumbilla · diseño y ejecución de Manuel Ojeda Rodríguez · culminado en 2024.

## QA de datos

Estado final en producción antes de merge:

- completitud técnica: **86 %**;
- identidad: sí;
- sede: sí;
- jornada: sí;
- titular relacionado: 1;
- pasos: 1;
- cultos: 3;
- salidas: 2;
- periodos musicales documentados: 1;
- patrimonio: 2;
- acontecimientos históricos: 3;
- acontecimientos con `involves`: 3/3;
- Fuentes directas y contextuales reforzadas;
- música futura presentada como actual: 0;
- salida 2026 inventada: 0;
- fecha exacta de cultos de septiembre de 2026 inventada: 0.

## Deuda legítima

El 14 % residual no debe forzarse:

- escudo sin procedencia/derechos trazables;
- señal automática de música actual, porque no existe confirmación específica de acompañamiento para la procesión de 2026 al corte del 5 de septiembre;
- materialidad y autoría de las representaciones de San Mateo y San Fernando, hasta disponer de fuente suficiente;
- fechas exactas de Triduo, Función y procesión 2026 hasta convocatoria contemporánea;
- fotografías/cabecera sin derechos acreditados.

## Alcance técnico

- DDL: 0;
- tablas nuevas: 0;
- RLS: 0;
- UX: 0;
- arquitectura: 0;
- #492: permanece aislada;
- Setefilla: permanece fuera de este frente por decisión editorial.
