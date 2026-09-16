# Auditoría del tercer macrolote municipal

**Fecha:** 16 de septiembre de 2026  
**HEAD de preflight:** `9d8e09b5a4a9acedebafaf574c8b938ebbb14cca`  
**Producción de preflight:** `READY` · `dpl_DEe9z4X9CK6jWTed3HfVopGxCqNP` · mismo SHA  
**GitHub:** 0 PR abiertas  
**Supabase:** `ACTIVE_HEALTHY`

## Alcance y método

El inventario se recalculó desde el grafo vivo, no desde una cola histórica. Incluye los municipios de la provincia de Sevilla con al menos una Hermandad o Banda local representada: **56 municipios**, **85 Hermandades publicadas** y **51 Bandas publicadas** fuera de Sevilla capital. Gerena, Dos Hermanas, Alcalá de Guadaíra y Pilas quedan excluidos del ranking porque sus macrolotes municipales ya están certificados.

La cobertura estimada pondera presencia corporativa, profundidad documental, relaciones, actualidad, música y trazabilidad. Es una medida comparativa del grafo, no un porcentaje enciclopédico: multimedia sin derechos, datos no aplicables e información no verificable no reducen por sí solos la puntuación.

## TOP 3

### 1 · Cantillana

**Cobertura actual estimada:** 72 %  
**Hermandades:** 3 públicas; La Asunción y La Pastora tienen un grafo profundo; La Soledad concentra la deuda nuclear.  
**Bandas:** 1 Banda local publicada, relacionada y con cinco Fuentes directas.  
**Agenda y actualidad:** 6 Cultos, 4 Salidas y 1 Salida futura en el grafo; no se inferirán convocatorias por recurrencia.  
**Deuda documental:** La Soledad carece de titulares, Pasos, Cultos y Salidas estructurados; dos de las tres fichas requieren revisar historia pública.  
**Deuda relacional:** reconciliar la dimensión penitencial con la Banda local sin mezclarla con las dos Glorias; preservar la Cruceta de la Pastora.  
**Deuda legítima:** multimedia y calendario no anunciado; cualquier dato de 2027 queda fuera hasta tener vigencia propia.  
**Fuentes disponibles:** Alta para Asunción, Pastora, Banda y entorno municipal; Media para la Soledad.  
**Potencial HC-016:** Alto.  
**Impacto para Hilo Cofrade:** Alto.  
**Riesgo técnico:** Bajo; no exige DDL ni excepciones por municipio.

Está primero porque el valor local no depende solo de completar una ficha: conecta Penitencia, dos Glorias, Banda, acompañamientos y una Cruceta ya publicada. La mayor parte del grafo puede preservarse y la deuda está concentrada en una corporación.

### 2 · Coria del Río

**Cobertura actual estimada:** 56 %  
**Hermandades:** 2 públicas; La Estrella tiene profundidad útil y la Borriquita conserva deuda en Pasos y Cultos.  
**Bandas:** 2 nodos publicados con nombres casi equivalentes que deben tratarse como posible duplicidad, no fusionarse por nombre.  
**Agenda y actualidad:** 4 Cultos, 4 Salidas y 1 Salida futura en el grafo.  
**Deuda documental:** completar la Borriquita y verificar el universo corporativo local.  
**Deuda relacional:** resolver la identidad de la Banda Municipal y retirar enlaces documentales ajenos al municipio cuando se confirme su sustitución.  
**Deuda legítima:** actividad no anunciada y recursos visuales sin licencia.  
**Fuentes disponibles:** Media.  
**Potencial HC-016:** Alto.  
**Impacto para Hilo Cofrade:** Medio.  
**Riesgo técnico:** Bajo.

Queda segunda porque presenta una anomalía relacional concreta y resoluble que afecta a Hermandades y música, pero necesita cerrar primero la identidad canónica de la Banda.

### 3 · Utrera

**Cobertura actual estimada:** 28 %  
**Hermandades:** 3 públicas frente a un universo documental de 13 corporaciones; dos fichas carecen de Pasos y Cultos y una no tiene Fuente directa.  
**Bandas:** 3 nodos publicados; los dos nodos Álvarez Quintero requieren desambiguación y dos fichas arrastran una Fuente ajena al municipio.  
**Agenda y actualidad:** 4 Cultos, 3 Salidas y 2 Salidas futuras en el grafo.  
**Deuda documental:** cobertura corporativa y profundidad insuficientes para certificar el municipio con un lote pequeño.  
**Deuda relacional:** identidad musical, acompañamientos y vínculos municipales incompletos.  
**Deuda legítima:** actualidad sin convocatoria verificable y multimedia sin derechos.  
**Fuentes disponibles:** Media-Alta.  
**Potencial HC-016:** Medio.  
**Impacto para Hilo Cofrade:** Alto.  
**Riesgo técnico:** Medio por volumen y dispersión editorial.

Utrera permanece en el TOP 3 por su valor territorial y su deuda real, pero no gana: exige definir y documentar un universo mucho mayor antes de aplicar cambios.

## Municipio seleccionado · Cantillana

### Debe entrar

- preservar La Asunción de Cantillana y La Pastora de Cantillana;
- completar la identidad, titulares, Pasos, Cultos, Salidas, acontecimientos y Fuentes verificables de La Soledad de Cantillana;
- preservar y reconciliar la Banda de Música de Nuestra Señora de la Soledad de Cantillana;
- conservar la Cruceta publicada de la Pastora con sus 48 obras y 60 interpretaciones;
- revisar Agenda y acompañamientos de 2026 sin duplicar Salida, acontecimiento y edición;
- validar el directorio y las búsquedas «Hermandades de Cantillana», «Bandas de Cantillana» y «Qué hay en Cantillana» desde relaciones canónicas.

### No entra todavía

- corporaciones, agrupaciones o formaciones sin identidad y Fuente suficientes;
- actos recurrentes sin convocatoria concreta de 2026;
- vigencias anunciadas solo para 2027;
- fotografías, escudos o logotipos sin derechos claros;
- mejoras cosméticas y cualquier arquitectura nueva.

## Preflight del futuro Apply

El universo queda seleccionado, pero el Apply editorial **no ha comenzado**. Antes de cargar se exige una matriz de fuentes que resuelva, como mínimo, la identidad canónica de la Soledad, sus titulares, Pasos, calendario de 2026 y acompañamientos vigentes. Después se publicará el recuento `TOTAL / INSERT / UPDATE / REUSE` y se exigirá `0 INVALID / 0 UNRESOLVED / 0 AMBIGUOUS / 0 COLLISION / 0 FALLos`.

## Incidencia transversal detectada

La Home consultaba Marchas, agentes, patrimonio y acontecimientos como filas completas. El límite de 1.000 filas de la API producía conteos parciales: mostraba cero para las **560 Marchas** y los **349 elementos patrimoniales** publicados. La corrección sustituye esa lectura por cuatro conteos exactos en cabecera; no altera contenido, esquema ni RLS.

## Observación de Auditor

Cantillana no estaba globalmente vacía: dos Glorias, la Banda y la Cruceta ya aportan buena profundidad. El falso pendiente principal era tratar ese contenido preservado como deuda. La deuda real está concentrada en la dimensión penitencial de la Soledad y en su actualidad verificable. Coria del Río pasa a ser la candidata inmediata tras Cantillana si su identidad musical puede resolverse; Utrera requiere primero un universo documental cerrado y no debe abrirse por inercia.

**Resultado:** `CANTILLANA SELECCIONADA · APPLY PENDIENTE DE UNIVERSO Y FUENTES`.
