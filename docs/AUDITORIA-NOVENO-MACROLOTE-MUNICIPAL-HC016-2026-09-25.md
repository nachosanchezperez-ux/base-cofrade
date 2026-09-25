# Auditoría del noveno macrolote municipal HC-016 · recálculo provincial y selección de Écija

**Corte:** 25 de septiembre de 2026  
**Ámbito:** provincia de Sevilla, excluida Sevilla capital  
**Base viva:** `60ae38ef8cb1ad0c2fb1a31f36a2f255485bb46b`  
**Supabase:** `kcevwkucqzcyrqaimyhl` · ACTIVE_HEALTHY  
**Resultado:** **Écija queda seleccionada como candidata única para el noveno macrolote municipal HC-016**  
**Límite de esta puerta:** selección y certificación documental; **no abre inventario, staging, SQL ni Apply**

## 1. Exclusiones

El recálculo parte de cero y excluye Sevilla capital y los **diez municipios ya cerrados** en los ocho macrolotes municipales anteriores:

1. Gerena;
2. Dos Hermanas;
3. Alcalá de Guadaíra;
4. Pilas;
5. Cantillana;
6. Coria del Río;
7. Estepa;
8. Lebrija;
9. Osuna;
10. Carmona.

Carmona queda fuera por cierre certificado del 25/09: 530/530 operaciones aplicadas y QA de producción verde.

HC-AUTO-03 · El Calvario permanece bloqueado y no interviene en esta selección.

## 2. Método

Se mantienen las cinco dimensiones comparativas del recálculo anterior, pero se recalculan desde la fotografía viva actual:

| Dimensión | Peso | Pregunta |
|---|---:|---|
| Deuda acreditada | 40 | ¿Cuánto universo municipal 2026 verificable falta realmente? |
| Fuente actual | 20 | ¿Existe una fuente institucional 2026 suficientemente estructurada? |
| Rendimiento relacional | 15 | ¿Cuántas Hermandades, Imágenes, Pasos, Salidas, Bandas y Fuentes puede aportar? |
| Cerrabilidad | 15 | ¿Puede definirse una primera edición completa sin perseguir exhaustividad artificial? |
| Riesgo inverso | 10 | ¿Qué coste tienen duplicados, homónimos, multi-cortejos y conciliación con nodos existentes? |

La puntuación es **operativa y comparativa**. No sustituye al inventario fila a fila de la siguiente puerta.

## 3. Fotografía viva de producción

Lectura directa de Supabase, sin escrituras:

| Municipio | Hermandades en Hilo | Bandas | Imágenes | Pasos | Salidas 2026 | Lectura de deuda |
|---|---:|---:|---:|---:|---:|---|
| Écija | 1 | 1 | 1 | 1 | 1 | El único nodo corporativo es la Virgen del Valle, de gloria: el universo penitencial 2026 está prácticamente vacío |
| Mairena del Alcor | 1 | 1 | 0 | 1 | 0 | Solo está materializada La Borriquita; faltan seis corporaciones del programa provincial |
| Utrera | 3 | 4 | 3 | 3 | 4 | Base parcial; Consolación es gloriosa y solo dos nodos actuales cubren parte del universo penitencial |
| Marchena | 2 | 2 | 1 | 0 | 2 | La Merced sí entra en el universo 2026; Divina Pastora es ajena al penitencial |
| Alcalá del Río | 1 | 0 | 3 | 2 | 2 | Vera-Cruz está presente; el resto del programa sigue incompleto |
| Castilleja de la Cuesta | 0 | 0 | 0 | 0 | 0 | Vacío total, pero universo municipal pequeño |

## 4. Evidencia institucional 2026

### Écija

Turismo de la Provincia de Sevilla publica un programa 2026 que enumera **14 hermandades** y permite cerrar un universo procesional de **30 pasos**:

- Borriquita;
- Cautivo;
- Yedra;
- Expiración;
- San Gil;
- Confalón;
- Sangre;
- Silencio;
- San Juan;
- Jesús sin Soga;
- Mortaja;
- Merced;
- Soledad;
- Resucitado.

Fuente: https://turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-ecija

El nodo actual `Hermandad de Nuestra Señora del Valle Coronada` no reduce esta deuda: su procesión es de gloria y figura con día actual 8 de septiembre.

### Marchena

La fuente provincial 2026 define **ocho sujetos** —siete hermandades y la Asociación Parroquial de la Merced— y **18 pasos**. En producción solo la Asociación de la Merced pertenece a ese universo; la Divina Pastora existente es gloriosa.

Fuente: https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-marchena

### Mairena del Alcor

La fuente provincial 2026 enumera **siete corporaciones** y **14 pasos**. Producción solo contiene La Borriquita y no tiene ninguna Salida 2026 municipal materializada.

Fuente: https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-mairena-del-alcor

### Utrera

La fuente provincial 2026 cifra el conjunto en **13 cofradías**, de las cuales **10 son hermandades de penitencia**. En producción existen Jesús Nazareno y Vera-Cruz/Santo Entierro dentro de ese universo; Consolación es gloriosa. La deuda penitencial mínima es por tanto **8 de 10 corporaciones**.

Fuente: https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-utrera

### Alcalá del Río

La fuente provincial 2026 documenta **cuatro sujetos corporativos** y **ocho pasos**. Hilo Cofrade ya contiene la Vera-Cruz, por lo que la deuda corporativa principal es de tres sujetos.

Fuente: https://turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-alcala-del-rio

## 5. Cribado ampliado

El recálculo no se ha limitado a los candidatos del 20/09.

Se revisaron también municipios con fuente provincial 2026 y cobertura nula o muy baja:

- **Castilleja de la Cuesta:** dos hermandades, 0 cargadas; gran cerrabilidad pero impacto relacional menor.
- **Pedrera:** cinco sujetos documentados, pero ni siquiera existe aún nodo municipal en producción; el rendimiento absoluto es inferior al TOP 5.
- **Morón de la Frontera:** deuda muy alta y municipio todavía no materializado; la fuente provincial es útil pero presenta inconsistencias internas de jornada/titular en algunos bloques, lo que eleva el riesgo de normalización.
- **Constantina, La Campana y Las Cabezas de San Juan:** fuentes 2026 disponibles, pero menor rendimiento absoluto para el siguiente macrolote.

No se selecciona un municipio solo por estar completamente vacío: el criterio penaliza universos pequeños o con mayor riesgo documental.

## 6. TOP 5 nuevo

| Posición | Municipio | Puntuación | Lectura operativa |
|---:|---|---:|---|
| 1 | **Écija** | **89/100** | 14 hermandades y 30 pasos documentados; 0 cobertura penitencial real; máximo rendimiento relacional |
| 2 | **Marchena** | **86/100** | 8 sujetos / 18 pasos; solo 1 sujeto del universo ya materializado; fuente 2026 muy estructurada |
| 3 | **Mairena del Alcor** | **85/100** | 7 corporaciones / 14 pasos; solo Borriquita cargada; alcance muy cerrable y bajo riesgo |
| 4 | **Utrera** | **82/100** | Deuda mínima 8/10 penitenciales y alto rendimiento, penalizada por multi-cortejos y conciliación parcial existente |
| 5 | **Alcalá del Río** | **75/100** | Programa compacto, fuente excelente y cerrabilidad alta, pero menor deuda absoluta |

## 7. TOP 3

1. **Écija**
2. **Marchena**
3. **Mairena del Alcor**

Utrera queda fuera del TOP 3 pese a su gran deuda porque la base parcial existente y la reutilización de corporaciones en distintos cortejos elevan el coste de conciliación. Mairena y Marchena permiten una primera edición más determinista.

## 8. Selección

### Écija

Écija pasa a ser el **candidato único del noveno macrolote municipal HC-016**.

Motivos:

- **deuda penitencial real 0/14:** el único nodo corporativo actual es una hermandad gloriosa;
- **30 pasos** ya descritos por una fuente institucional 2026;
- fuente suficientemente estructurada para fijar Hermandad, sede, jornada, pasos y titulares;
- rendimiento relacional superior al resto del TOP 5;
- permite aportar de una sola vez un núcleo municipal de gran valor para Hermandades, Imágenes, Pasos, Salidas, música y Fuentes;
- la complejidad es alta, pero está acotada por un universo institucional explícito.

## 9. Riesgos que deberán resolverse antes de cualquier dato

La selección **no autoriza todavía** el inventario operativo ni escrituras.

La siguiente puerta deberá comprobar, como mínimo:

1. identidad canónica de las 14 corporaciones;
2. si el programa provincial mezcla titulares no procesionales con titulares efectivos;
3. sedes canónicas y lugares compartidos;
4. 30 pasos y composición Imagen–Paso sin duplicar devociones homónimas;
5. posibles corporaciones con más de un cortejo;
6. bandas locales ya existentes o externas reutilizables;
7. evidencia posterior para elevar las Salidas 2026 a `held`;
8. conciliación estricta con la Virgen del Valle sin absorberla en el universo penitencial;
9. namespace determinista nuevo, sin reutilizar `c0160035-*`;
10. fotografías y escudos fuera del lote salvo licencia verificable.

## 10. Puerta operativa

**Selección certificada: Écija.**

Estado resultante:

- Écija = **SELECCIONADA / COLA**;
- inventario = **NO ABIERTO**;
- matriz de Fuentes = **NO ABIERTA**;
- staging = **NO**;
- SQL = **NO**;
- Apply = **NO**;
- HC-AUTO-03 = **BLOQUEADO**.

La próxima orden, si se decide continuar, debe abrir únicamente **inventario canónico + matriz de Fuentes de Écija**, no staging ni Apply.


## 11. Rectificación posterior al inventario

La selección de Écija **no cambia**, pero la primera fotografía de esta auditoría queda corregida por el cruce posterior con el Consejo oficial, la aplicación/programa municipal 2026 y las fuentes de cada cortejo.

### Universo correcto

- **14 Hermandades penitenciales canónicas**;
- **1 Agrupación Parroquial**: Las Penas;
- **15 sujetos corporativos**;
- **16 Salidas procesionales 2026**;
- **32 Pasos procesionales 2026**.

### Por qué la primera lectura daba 14 / 30

La ficha provincial funciona como una guía procesional, no como censo canónico de corporaciones:

- separa **La Borriquita** y **El Cautivo** aunque pertenecen a una misma Hermandad;
- no incorpora la **Hermandad del Amor** en esa relación inicial;
- no incorpora a **Las Penas** como Agrupación Parroquial;
- el programa oficial 2026 sí distingue las 16 Salidas efectivas.

Por tanto, la deuda real no debe expresarse como «0/14 hermandades cargadas», sino como:

- **0/14 Hermandades penitenciales** cargadas;
- **0/1 Agrupación Parroquial** cargada;
- **0/15 sujetos** del universo materializados.

El único nodo corporativo actual de Écija, la Hermandad de Nuestra Señora del Valle Coronada, permanece fuera del universo por ser glorioso.

### Puerta resultante

Inventario y matriz de Fuentes quedan cerrados en:

- [INVENTARIO-ECIJA-NOVENO-MACROLOTE-MUNICIPAL-HC016-2026-09-25.md](./INVENTARIO-ECIJA-NOVENO-MACROLOTE-MUNICIPAL-HC016-2026-09-25.md)
- [MATRIZ-FUENTES-ECIJA-NOVENO-MACROLOTE-MUNICIPAL-HC016-2026-09-25.md](./MATRIZ-FUENTES-ECIJA-NOVENO-MACROLOTE-MUNICIPAL-HC016-2026-09-25.md)

La siguiente fase permitida es **modelado de participación + evidencia posterior por Salida + conciliación musical**.

No se autorizan todavía row-by-row, staging, SQL editorial, dry-run, Apply, DDL ni RLS.
