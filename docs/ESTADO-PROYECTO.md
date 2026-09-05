# Hilo Cofrade · Estado canónico

**Corte validado:** 5 de septiembre de 2026 · `main = 2b1dd2ddd6c9e0cc0ee5c60a332241bbd741c325`  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Fase activa:** editorial / documental sobre el modelo vigente  
**Frente editorial activo:** ninguno  
**PR abiertas:** 0

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

Repositorio, producción y modelo vigente permiten continuar con cierres editoriales profundos sin abrir arquitectura nueva.

El último cierre documental certificado es **El Cerro del Águila (#615)**. Después se han fusionado tres ajustes transversales sobre ese frente:

- #616 · fotografía principal del Rosario de la Aurora 2026;
- #617 · campo relacional **Vestidor actual** para Imágenes;
- #618 · corrección JPEG de la fotografía del Rosario del Cerro.

Producción está **READY** sobre el HEAD actual `2b1dd2d`.

## Cierres documentales vigentes

Estas fichas permanecen cerradas y no deben reabrirse por deuda legítima, mejoras cosméticas o por perseguir un 100 % técnico:

- Amparo;
- San Esteban;
- La Sed;
- Virgen del Castillo de Lebrija · actualidad de septiembre de 2026 cerrada;
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
- El Cerro del Águila.

Solo procede reabrir una ficha certificada ante regresión real o información nueva verificable que cambie materialmente su estado.

## Cierres posteriores al corte documental anterior

### Sastres · #607 + #608

- ficha cerrada al 86 % técnico;
- sede, titular, paso, cultos, salidas, patrimonio, acontecimientos y Fuentes estructurados;
- Las Cigarreras confirmada vigente en 2026, con continuidad desde 2024;
- deuda residual legítima: escudo/media con derechos y detalles patrimoniales no suficientemente publicados.

### Hermandad Sacramental de Camas · #609–#613

El cierre inicial de Dolores de Camas (#609) quedó superado por la revisión de la Fuente oficial `sacramentaldecamas.es`.

Estado canónico vigente:

- #610 corrige la búsqueda del Panel por nombre popular/oficial/localidad;
- #611 retira el placeholder duplicado que provocaba 404 y conserva Cruz Roja como histórica;
- #613 reconstruye la ficha completa como **Penitencia + Sacramental + Gloria**;
- Jueves Santo, Corpus y Procesión de Gloria quedan separados;
- Gran Poder, Dolores Coronada y San Sebastián quedan estructurados como titulares;
- 3 pasos, 12 cultos, salidas 2026, música e hitos históricos;
- colores burdeos, dorado, negro y blanco;
- completitud técnica: **100 %**.

La denominación operativa vigente es **Hermandad Sacramental de Camas**. #613 prevalece sobre #609.

### Setefilla · #612

- 93 % técnico, considerado cierre completo para su idiosincrasia;
- Santuario = sede canónica y residencia actual de la Imagen;
- Asunción = referencia parroquial, Capilla de la Virgen y lugar de la Novena;
- Casa de la Virgen = sede social y museo;
- Romería anual separada de Idas y Venidas;
- Venida 2022 e Ida 2024 estructuradas;
- `music=false` no se considera deuda automática.

### Nuestra Señora de la Luz de San Esteban · #614

- 21 % → 86 %;
- identidad histórica, sede, titular, paso, cultos y procesión de 2026 estructurados;
- Las Cigarreras documentada en 2025 sin extrapolar vigencia a 2026;
- deuda legítima: escudo y música 2026 no confirmada específicamente.

### El Cerro del Águila · #615

- 93 % técnico;
- Penitencia + Sacramental + Gloria;
- 3 titulares, 3 pasos, 8 cultos, 6 salidas, 4 periodos musicales y 5 hitos históricos;
- misión del 06/09/2026 relacionada sin duplicar la guía ya existente;
- Ángeles, Centuria Macarena y Nieves de Olivares vigentes en 2026;
- Nazareno de Huelva queda histórico 2019–2026 y no vigente para 2027;
- deuda técnica residual: escudo.

## Mejoras transversales vigentes

Además de los cierres editoriales, `main` incorpora ya como reglas comunes:

- #580 · una ficha completa no queda `noindex` por huecos secundarios transparentes;
- #584 · histórico musical estructurado visible en Hermandades;
- #587 · fotografías de Salidas guardadas en Panel se muestran en ficha pública;
- #589 · las Fuentes heredadas quedan acotadas al contexto real de la Hermandad;
- #594 · participación en el Vía Crucis de las Cofradías como relación reutilizable;
- #595–#596 · contraste estable en acompañamientos, Fuentes y Túnica;
- #597–#599 + #603 · directorios de Hermandades y Bandas ordenados por territorio, naturaleza, jornada/mes y estilo;
- #604 · nombre oficial completo visible en móvil;
- #606 · los contratos musicales futuros no contaminan la actualidad del bloque relacional;
- #610 · búsqueda del Panel por nombre corto, popular, oficial y localidad;
- #617 · `Vestidor actual` como relación `agent → dresser_of → image`, editable desde Panel, con histórico al cambiarlo y visualización pública.

No existen excepciones por slug para resolver problemas comunes de estas áreas.

## Vestidores · estado vigente

#617 está fusionada y el modelo reutiliza `entity_relations`, sin tabla nueva ni DDL.

Aplicaciones editoriales ya cargadas en producción:

- Francisco Carrera Iglesias «Paquili» → Nuestra Señora de los Dolores del Cerro;
- José Antonio Grande de León → Piedad y Caridad del Baratillo, Dolores y Misericordia de Jesús Despojado y Amor de Pino Montano;
- Leandro González Ruiz → Encarnación de San Benito;
- Antonio Sanabria Vázquez → Guadalupe y Mayor Dolor de Las Aguas.

La relación Leandro González Ruiz → María Santísima de la Estrella de Sevilla está preparada en `draft`, igual que la imagen y la Hermandad, y no constituye un frente editorial abierto ni se presenta como publicada.

## Producción y repositorio

Estado revalidado en el corte actual:

- `main = 2b1dd2ddd6c9e0cc0ee5c60a332241bbd741c325`;
- último merge: #618 · Corrige la fotografía del Rosario del Cerro;
- PR abiertas: **0**;
- Vercel producción: **READY** sobre `2b1dd2d`;
- Supabase producción: operativa;
- FIRST EDITION FREEZE: activo;
- frente editorial abierto: **ninguno**.

## #492

**#492 · Reconciliar Supabase Preview Branches → 🟣 ABIERTA Y AISLADA.**

Diagnóstico vigente: preview branches no reproducen todavía de forma segura todo el DML histórico porque algunas migraciones dependen de datos productivos que no existen antes del seed.

#492 **sí bloquea**:

- nuevo DDL;
- nuevas tablas;
- nuevas migraciones estructurales;
- cambios RLS relacionados.

#492 **no bloquea**:

- contenido y DML editorial sobre tablas existentes;
- Hermandades, titulares y pasos;
- música y periodos temporales;
- patrimonio y agentes;
- cultos y salidas;
- acontecimientos;
- Fuentes;
- fotografías/media ya soportada;
- relaciones existentes;
- SEO editorial.

No debe resolverse modificando migraciones históricas ya aplicadas en producción ni introduciendo cambios productivos para una limitación exclusiva de preview.

## Bloqueos reales

En este momento no existe ningún bloqueo editorial general.

Los límites son:

1. FIRST EDITION FREEZE;
2. #492 para estructura/RLS;
3. actualidad estricta 2026/2027;
4. no inventar datos para elevar completitud;
5. media solo con procedencia/derechos suficientemente trazables;
6. una Hermandad por frente y certificación antes de continuar.

## Siguiente movimiento autorizado

Antes de abrir una nueva Hermandad:

1. recalcular la deuda documental de todas las Hermandades publicadas sobre el estado actual;
2. clasificar ausencias como deuda real, no aplicable, dato no publicado, pendiente de verificar o hueco legítimo;
3. devolver un TOP 3 actual por oportunidad real, no solo por porcentaje;
4. seleccionar UNA sola Hermandad;
5. diagnosticarla antes de introducir contenido;
6. cerrarla con evidencia verificable, QA, PR, merge y producción;
7. volver a dejar `main`, documentación canónica y producción alineados con 0 PR abiertas.
