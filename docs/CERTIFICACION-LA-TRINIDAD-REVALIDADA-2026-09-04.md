# Hilo Cofrade · Certificación documental revalidada · La Trinidad

**Corte:** 4 de septiembre de 2026  
**PR:** #582  
**Régimen:** `FIRST EDITION FREEZE` activo  
**Resultado:** 🟢 CERTIFICABLE tras QA de la corrección temporal incluida en la propia PR

## Realidad actual

Esta revalidación sustituye cualquier dato anterior de la rama que haya quedado obsoleto tras #589 y el cierre de #581. No introduce DDL, tablas, migraciones estructurales, RLS, arquitectura ni UX nueva.

La vista `brotherhood_completeness` devuelve actualmente **100 %**. El 93 % anterior queda superado: escudo/media, identidad, sede, titulares, pasos, cultos, salidas, música y Fuentes cumplen ahora el medidor vigente.

## Identidad

- Nombre canónico: **Pontificia, Real, Muy Ilustre y Trinitaria Hermandad Sacramental y Archicofradía de Nazarenos del Sagrado Decreto de la Santísima Trinidad, Santísimo Cristo de las Cinco Llagas, María Santísima de la Concepción, Nuestra Señora de la Esperanza Coronada y San Juan Bosco**.
- Nombre popular: **La Trinidad**.
- Jornada: Sábado Santo.
- Fundación: tradición de 1507; reglas de 1544 y aprobación eclesial de 1555 documentadas.
- Sede: Capilla de la Hermandad de la Trinidad, conjunto de la Basílica de María Auxiliadora, calle María Auxiliadora 18-E.
- Colores publicados: negro, azul trinitario, rojo trinitario y blanco.

## Titulares y separación salesiana

La Trinidad mantiene cuatro imágenes penitenciales vinculadas:

1. Sagrado Decreto de la Santísima Trinidad.
2. Santísimo Cristo de las Cinco Llagas.
3. María Santísima de la Concepción.
4. Nuestra Señora de la Esperanza Coronada.

La **Archicofradía de María Auxiliadora Coronada** permanece como Hermandad independiente publicada. María Auxiliadora Coronada de la Trinidad y San Juan Bosco y Santo Domingo Savio están relacionados con esa corporación, no con La Trinidad.

San Juan Bosco puede permanecer en el nombre canónico de La Trinidad sin crear una relación procesional artificial con la imagen salesiana. La auditoría devuelve **0 Fuentes directas compartidas** entre ambos ámbitos y no detecta salidas de María Auxiliadora absorbidas por La Trinidad.

## Pasos y capataces

Pasos publicados: **3**.

- Sagrado Decreto → capataz vigente para la Semana Santa de 2026: **Francisco José Gómez Calado**. Rafael Díaz Talaverón queda documentado **desde la Semana Santa de 2027**, no como vigente en 2026.
- Santísimo Cristo de las Cinco Llagas y María Santísima de la Concepción → **Juan Manuel Martín Núñez**, documentado al menos desde 2022.
- Palio de Nuestra Señora de la Esperanza → **Julián Jiménez Padilla**, documentado al menos desde 2022.

Los periodos auditados cuentan con Fuente.

## Música

### Histórico cerrado

- A.M. Santísima Trinidad → Sagrado Decreto → **1994–1996**.
- Las Cigarreras → Sagrado Decreto → **1997–2026**.
- Sagrada Columna y Azotes / juvenil de Las Cigarreras → Cruz de Guía → **1998–2026**.
- Cruz Roja → palio → **1994–1998**.

### Vigente en 2026

- Tres Caídas → paso del Santísimo Cristo de las Cinco Llagas → desde 1993.
- La Oliva de Salteras → palio de la Esperanza → documentada al menos desde 2007.

### Cambio futuro confirmado

- A.M. Juvenil Virgen de los Reyes → Cruz de Guía → **desde 2027**.
- A.M. Virgen de los Reyes → Sagrado Decreto → **desde 2027**.

La reauditoría detectó una regresión transversal: el lector trataba como “actual” cualquier periodo marcado `is_current=true`, aunque su inicio fuese futuro. #582 incorpora una corrección común que excluye del bloque vigente los periodos cuya fecha o año de inicio todavía no ha llegado. Los contratos de 2027 permanecen documentados y con Fuente; no se convierten en históricos ni se presentan como vigentes de 2026.

## Cultos

- Cultos canónicos publicados: **17**.
- Ocurrencias específicas verificadas de 2026: **9**.

Incluyen Vía Crucis del Cristo, Besapiés, Quinario, Función Principal, Jubileo Circular, Eucaristía de Viernes de Dolores, Función de la Santísima Trinidad, Triduo Eucarístico y aniversario de la Coronación Canónica de la Esperanza.

## Salidas

Salidas publicadas: **4**.

- Estación de penitencia · 4/04/2026 · ordinaria.
- Rosario Vespertino de Nuestra Señora de la Esperanza · **13/12/2025** · ordinaria/devocional.
- Vía Crucis del Consejo del Santísimo Cristo de las Cinco Llagas · 15/02/2016 · extraordinaria.
- Procesión extraordinaria histórica del **V Centenario fundacional · 7/09/2008**.

Todas cuentan con evidencia relacionada.

## Patrimonio y marchas

Patrimonio material representativo: **3 bienes**.

- Cruz de Guía · años 1950.
- Guion Sacramental · 1982.
- Relicario procesional de San Juan Bosco · 2008.

Marchas dedicadas estructuradas: **3**.

- `Esperanza, Eterna Luz de Vida` · Borja Romero González · 2020.
- `La Esperanza` · Jesús Joaquín Espinosa de los Monteros Pérez · 2024.
- `El Hijo de la Esperanza` · Francisco Javier Cebrero Arias / José María Sánchez Martín · 2026.

No quedan marchas sin autor ni dedicatorias sin Fuente dentro del alcance certificado.

## Fuentes y efecto de #589

#589 no invalida la ficha: su filtrado evita que Fuentes de autores o profesionales se hereden por segundo grado si no documentan realmente a La Trinidad.

La auditoría reforzada no detecta Fuentes directas de María Auxiliadora mezcladas con La Trinidad. La incidencia encontrada no fue contaminación documental, sino el criterio temporal de los acompañamientos confirmados para 2027, corregido sistémicamente en #582.

## Multimedia

La deuda anterior de escudo/cabecera ya no existe. La ficha dispone de recurso de cabecera autorizado, acreditado a **Hermandad**, con texto alternativo y `rights_status=authorized`.

## Salud del grafo

- titulares: 4;
- pasos: 3;
- cultos: 17;
- ocurrencias 2026: 9;
- salidas: 4;
- patrimonio: 3;
- marchas dedicadas: 3;
- periodos musicales: 9;
- imágenes sin autoría: 0;
- periodos de capataz sin Fuente: 0;
- cultos sin Fuente: 0;
- salidas sin Fuente: 0;
- patrimonio sin Fuente: 0;
- marchas sin autor: 0;
- dedicatorias sin Fuente: 0;
- periodos musicales sin Fuente: 0;
- slug de Hermandad duplicado: 0;
- grupos duplicados de slugs de Imagen: 0;
- grupos duplicados de slugs de Paso: 0.

**Grafo → 🟢 CLEAN para el alcance certificado.**

## Indexabilidad

La ficha pública responde HTTP 200 y mantiene `robots=index, follow` y canonical de Hilo Cofrade.

## Deuda legítima no bloqueante

- No se inventa el inicio exacto de periodos documentados únicamente como “al menos desde”.
- El inicio exacto del periodo de Francisco José Gómez Calado previo a 2027 queda sin forzar.
- Los cambios de 2027 conservan el año confirmado sin inferir una fecha exacta no publicada.

## Resultado

**LA TRINIDAD → 🟢 CERTIFICABLE** tras CI, build, preview y smoke de la corrección temporal incluida en #582.
