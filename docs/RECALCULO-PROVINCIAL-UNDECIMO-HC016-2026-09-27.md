# Recálculo provincial para el undécimo macrolote municipal HC-016

Corte: 27 de septiembre de 2026, Europe/Madrid (26 de septiembre UTC).
Estado: **análisis terminado; Utrera recomendada; ningún municipio nuevo abierto**.

## Decisión

Prioridad propuesta: **1. Utrera; 2. Marchena; 3. Mairena del Alcor**.
Es una decisión editorial razonada, no una puntuación estadística ni un inventario aprobado. Se priorizan la deuda relacional, la existencia de fuentes primarias actuales y la posibilidad de delimitar corporaciones y salidas sin duplicados. La complejidad de conciliación y las lagunas documentales reducen la prioridad.

Utrera ofrece el mejor equilibrio: diez corporaciones penitenciales identificables en la documentación institucional y trece cortejos entre Ramos y Sábado Santo, frente a dos fichas penitenciales publicadas y vinculadas al municipio. El Consejo documenta las salidas de 2026, incluidas las distintas salidas de una misma corporación. Eso permite preparar un futuro inventario con una frontera verificable.

**Único siguiente movimiento recomendado:** preparar, mediante una orden posterior, el inventario row-by-row de Utrera, conciliando primero los IDs existentes. Este informe no autoriza ni inicia manifiesto, staging, dry-run o Apply.

## Preflight del corte

- main: `25c5fc12a35be8ae144d1a4fa5cde98469301562`, PR #1008 fusionada.
- PR abierta observada: #1000, GA4, frente independiente.
- Vercel productivo: `dpl_39jFfrkgwkS1KRJtroE5QNFXBc31`, READY, aliases hilocofrade.es y www.hilocofrade.es.
- Supabase: `kcevwkucqzcyrqaimyhl`, ACTIVE_HEALTHY; referencia vigente de 17 migraciones.
- Morón permanece cerrado y certificado; lote principal 504/504 y correctivo de diez Hermandades ya concluidos.
- El refuerzo preventivo de tipos de #1008 está incorporado. No se reejecuta ningún lote.
- Este trabajo usa consultas SELECT y fuentes públicas: **0 escrituras en producción, 0 migraciones y 0 deployments solicitados**.

## Base real y límites de los recuentos

Se consultaron los 56 registros territoriales de Sevilla existentes en la base, además de entidades de Hermandad sin municipio para detectar posibles reutilizaciones. **No equivalen a los 106 municipios de la provincia**: incluyen Sevilla capital y Los Rosales, y faltan municipios. Por ello este es un recálculo de cobertura disponible y una selección documental de candidatos, no un censo provincial exhaustivo.

Se excluyen los cierres previos: Gerena, Dos Hermanas, Alcalá de Guadaíra, Pilas, Cantillana, Coria del Río, Estepa, Lebrija, Osuna, Carmona, Écija y Morón. Sevilla capital queda fuera del siguiente macrolote municipal.

Las cifras de Imágenes y Pasos cuentan relaciones existentes, sin certificar individualmente su publicación o calidad. Música cuenta periodos publicados, no necesariamente vigentes. Fuentes cuenta enlaces directos a la Hermandad, no fuentes de todas sus relaciones. No se convierten estos recuentos en porcentajes de completitud.

| Municipio | Fichas vinculadas publicadas | Relaciones Imagen / Paso | Salidas 2026 | Salidas en ventana 27/03–05/04 | Periodos musicales publicados | Fuentes directas | Bandas locales |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Utrera | 3 | 3 / 3 | 3 | 0 | 1 | 4 | 5 |
| Marchena | 2 | 1 / 0 | 2 | 0 | 1 | 1 | 4 |
| Mairena del Alcor | 1 | 0 / 1 | 0 | 0 | 1 | 1 | 1 |

La ventana temporal es un indicador, no una clasificación semántica universal de Semana Santa. Para estos tres candidatos se revisaron además las salidas existentes: las de Utrera corresponden a Consolación en septiembre, Angustias en octubre y traslado extraordinario de Dolores en septiembre; las de Marchena son Pastora y Merced en septiembre. No cubren las estaciones penitenciales ordinarias de 2026.

## TOP 3 razonado

### 1. Utrera — recomendación

Hay dos fichas penitenciales: Jesús Nazareno y Vera-Cruz/Santo Entierro. La tercera ficha, Consolación, es Gloria y no debe inflar la cobertura penitencial. De las tres relaciones de Paso, dos pertenecen a Consolación; solo una corresponde a las fichas penitenciales.

El Consejo permite distinguir trece cortejos de diez corporaciones, evitando crear entidades separadas por cada salida. También publica dos celebraciones de Resurrección: su encaje y la Sacramental de Santa María requieren delimitarse antes de congelar el futuro universo. No se da por cerrado un inventario total de diez entidades para todo el municipio.

Ventajas: fuente primaria de 2026, deuda clara de titulares/Pasos/Salidas y cinco bandas locales que justifican revisar relaciones musicales. Riesgo: corporaciones con varias salidas y títulos mixtos; la música debe acreditarse por salida y vigencia, sin inferirla de la localidad de la banda.

IDs que deben preservarse:
- Jesús Nazareno: `4e462b02-979d-4b88-ab98-0c97f2dbf0a0`.
- Vera-Cruz/Santo Entierro: `7bab2fe6-c69e-48e5-9446-a247b4169910`.
- Consolación: `8d4e62d9-a428-4363-afc7-6a2f9e8c1450`.

Municipio canónico: `e4319248-831a-4f4c-adb8-19c496f95dd6`.

### 2. Marchena — alternativa sólida

El Consejo enumera siete Hermandades de Semana Santa. Ninguna de esas siete tiene una ficha publicada vinculada al municipio en el corte consultado. Las dos existentes son Merced y Pastora; no deben presentarse como dos de las siete.

Existe una posible reutilización de Soledad en borrador, sin municipio: `c6100000-0000-4000-8000-000000000006`. Debe verificarse su identidad antes de reasignar o crear nada.

La asociación de la Merced tiene tipos vacíos; se registra el hallazgo sin corregirlo ni asumir Penitencia. Su naturaleza y participación deben documentarse. La referencia anterior a ocho sujetos y dieciocho Pasos no queda revalidada íntegramente en este corte. Esta frontera adicional y el menor detalle documental 2026 recuperado dejan Marchena por detrás de Utrera.

### 3. Mairena del Alcor — candidata condicionada

Solo Borriquita figura publicada y vinculada al municipio. Tiene una relación de Paso, ninguna de Imagen y ninguna Salida 2026; el recuento no acredita la calidad del Paso existente.

Hay dos posibles reutilizaciones en borrador sin municipio:
- Humildad: `d071de1d-47f8-4433-a88c-b29697824d66`.
- Jesús Nazareno: `c6100000-0000-4000-8000-000000000017`.

La segunda también debe conciliarse, aunque no estuviera destacada en el análisis anterior. El Ayuntamiento acredita la coordinación de la Semana Santa 2026 y existe un plan municipal, pero no se pudo recuperar íntegro el PDF. El universo histórico de siete Hermandades y catorce Pasos queda **pendiente de revalidación**, no certificado. Su tercer puesto es provisional por menor accesibilidad documental.

## Alternativas contrastadas

- **Sanlúcar la Mayor:** una ficha vinculada, una Imagen, ningún Paso y ninguna salida en la ventana de Semana Santa. Se localizó un programa 2026 con siete cortejos en prensa local; falta contrastar íntegramente con fuente primaria. No se asigna a este municipio un borrador llamado «Soberano Poder de Sanlúcar»: el nombre es ambiguo.
- **Arahal:** ninguna Hermandad vinculada y cuatro bandas locales. Existe un Consejo activo y posibles borradores de Esperanza y San Antonio; la ausencia de vínculo no demuestra ausencia de entidades. Requiere mayor conciliación antes de fijar un universo.
- **Guadalcanal y Lora del Río:** la presencia de Guaditoca y Setefilla no equivale a cobertura penitencial. Conservan interés para un recálculo posterior.
- **Pedrera, Herrera, Las Cabezas y La Campana:** no aparecen como registros municipales en el agregado consultado. Eso no demuestra ausencia de todas sus entidades; no se les atribuye un cero global ni una menor importancia patrimonial.
- **La Rinconada:** el agregado ya contiene cinco fichas publicadas, diez relaciones de Paso y cinco salidas en la ventana, por lo que presenta menor deuda aparente que los candidatos seleccionados.

## Fuentes y reproducibilidad

Consultadas en este corte:
1. [Consejo de Utrera, Semana Santa 2026](https://consejodehermandadesdeutrera.org/semana-santa/semana-santa-de-utrera-2026/): lectura directa; distingue cortejos y corporaciones.
2. [Consejo de Marchena](https://consejodehermandadesdemarchena.es/): lectura directa; siete Hermandades penitenciales y actividad de 2026.
3. [Ayuntamiento de Mairena, coordinación de Semana Santa 2026](https://www.mairenadelalcor.org/es/actualidad/noticias/Mairena-del-Alcor-ultima-los-preparativos-para-una-Semana-Santa-marcada-por-la-coordinacion-y-la-seguridad/): lectura directa; publicación del 24/03/2026.
4. [Turismo de Sevilla, Utrera 2026](https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-utrera): extracto indexado con diez Hermandades y trece cofradías; apertura completa fallida, corroboración mediante Consejo.
5. [Programa de Sanlúcar 2026, Aljarafe Digital](https://www.aljarafedigital.com/aljarafe/sanlucar-la-mayor/horarios-y-recorridos-de-la-semana-santa-de-sanlucar-la-mayor-2026/): fuente secundaria, no utilizada para aprobar inventario.

Los fallos de recuperación de Turismo de Sevilla y del PDF de Mairena son limitaciones de esta consulta, no incidencias de Hilo Cofrade. No se han trasladado automáticamente cifras de Pasos de la auditoría del 25/09.

Evidencia local: [snapshot de datos](./evidence/recalculo-provincial-2026-09-27/snapshot.json) y [consultas SELECT](./evidence/recalculo-provincial-2026-09-27/queries.sql). El snapshot conserva la consulta amplia de borradores, incluidos casos ajenos a los candidatos; no constituye una asignación municipal.

El guard de tipos de [HC-016](./HC016-PREFLIGHT-TIPOS-2026-09-27.md) será obligatorio en cualquier futuro lote. No se alteran fichas, clasificaciones, salidas ni documentación histórica con este recálculo.
