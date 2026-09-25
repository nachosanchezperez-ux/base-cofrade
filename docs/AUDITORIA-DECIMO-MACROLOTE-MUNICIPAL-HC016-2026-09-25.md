# Auditoría del décimo macrolote municipal HC-016 · recálculo provincial y selección de Morón de la Frontera

**Corte:** 25 de septiembre de 2026  
**Ámbito:** provincia de Sevilla, excluida Sevilla capital  
**Base viva:** `25797bb7adb9130641b3eb183d39ac8d9ddf9a36`  
**Supabase:** `kcevwkucqzcyrqaimyhl` · ACTIVE_HEALTHY  
**Resultado:** **Morón de la Frontera queda seleccionado como candidato único para el décimo macrolote municipal HC-016**  
**Límite:** selección documental; **no abre inventario, staging, SQL ni Apply**

## 1. Municipios excluidos por cierre previo

El recálculo parte de cero y excluye Sevilla capital y los once municipios ya cerrados en HC-016:

1. Gerena;
2. Dos Hermanas;
3. Alcalá de Guadaíra;
4. Pilas;
5. Cantillana;
6. Coria del Río;
7. Estepa;
8. Lebrija;
9. Osuna;
10. Carmona;
11. Écija.

Écija queda fuera por cierre certificado del 25/09: 776/776 operaciones aplicadas, QA estructural/semántico PASS y QA público verde.

HC-AUTO-03 · El Calvario permanece bloqueado y no participa en el ranking.

## 2. Método

Se recalculan desde la fotografía viva actual cinco dimensiones:

| Dimensión | Peso | Pregunta |
|---|---:|---|
| Deuda acreditada | 40 | ¿Cuánto universo penitencial/pre-penitencial 2026 verificable falta realmente? |
| Fuente actual | 20 | ¿Existe fuente institucional/primaria 2026 suficientemente estructurada? |
| Rendimiento relacional | 15 | ¿Cuántas corporaciones, Salidas, Pasos, Imágenes, Bandas y Fuentes puede aportar? |
| Cerrabilidad | 15 | ¿Puede definirse una primera edición determinista sin perseguir exhaustividad artificial? |
| Riesgo inverso | 10 | ¿Qué coste tienen duplicados, multi-cortejos, nodos draft, homónimos y conciliación previa? |

La puntuación es **operativa**, no editorial. Sirve para priorizar el siguiente lote; el inventario posterior puede corregir el universo sin invalidar la selección.

## 3. Fotografía viva de producción

### Morón de la Frontera

- municipio: **no existe** todavía en `municipalities`;
- Hermandades: **0**;
- Salidas 2026: **0**;
- Pasos: **0**;
- no existen entidades cofrades con slug/nombre de Morón; las únicas coincidencias `moron` son apellidos de autores/agentes ajenos al municipio.

### Utrera

Producción contiene tres corporaciones:

- Jesús Nazareno · penitencial;
- Vera-Cruz y Santo Entierro · penitencial;
- Consolación Coronada · gloria.

Las cuatro Salidas 2026 existentes son de septiembre/octubre o ajenas a Semana Santa; por tanto la **Semana Santa 2026 no está materializada**.

La fuente provincial cifra **13 cofradías, 10 de ellas penitenciales**, y describe varios sujetos con más de una Salida:
- Trinidad · Domingo de Ramos + Jueves Santo;
- Jesús Nazareno · Domingo de Ramos + Viernes Santo;
- Vera-Cruz/Santo Entierro · Viernes + Sábado Santo.

### Marchena

Producción transversal relevante:

- Asociación Parroquial de la Merced · published;
- Hermandad de la Soledad · **draft**;
- Divina Pastora · gloria, fuera del universo penitencial;
- 0 Pasos penitenciales cargados para el programa 2026.

La fuente provincial 2026 define:
- 7 Hermandades;
- 1 Asociación Parroquial;
- **8 sujetos**;
- **18 Pasos**.

### Mairena del Alcor

Producción transversal relevante:

- Borriquita · published;
- Humildad · **draft**;
- 1 Paso en estado review para la Borriquita;
- 0 Salidas de Semana Santa 2026.

La fuente provincial 2026 define:
- **7 Hermandades**;
- **14 Pasos**.

### Pedrera

- municipio: no existe;
- corporaciones: 0;
- Pasos: 0;
- Salidas: 0.

La fuente provincial 2026 define:
- Asociación Cristo de los Niños / Borriquita;
- San Juan Evangelista;
- Jesús Nazareno;
- Cristo de la Sangre;
- Santo Entierro;
- **5 sujetos**;
- **6 Pasos**.

## 4. Evidencia institucional 2026

### Morón de la Frontera

Turismo de la Provincia enumera **10 sujetos** y **18 Pasos**:

1. Borriquita · 1 Paso;
2. Cautivo · 2;
3. Calvario · 2;
4. Buena Muerte · 2;
5. Loreto · 2;
6. Santa Cruz · 2;
7. Jesús · 2;
8. Santo Entierro · 2;
9. Soledad · 1;
10. Soberano · 2.

Fuente:
https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-moron-de-la-frontera

El Ayuntamiento de Morón declara que la Semana Santa cuenta con **nueve cofradías desde el Domingo de Ramos hasta el Sábado Santo**. Esto es compatible con la guía provincial: el décimo sujeto, Soberano, sale el **Viernes de Dolores**, fuera de ese intervalo.

Fuente:
https://www.morondelafrontera.es/es/servicios-municipales/fiestas-mayores

El propio Ayuntamiento identifica además al Consejo General de Hermandades y varias corporaciones locales dentro de su directorio religioso:

https://www.morondelafrontera.es/es/la-ciudad/asociaciones/17/religioso

### Utrera

La fuente provincial 2026 fija:
- 13 cofradías;
- 10 Hermandades de penitencia;
- 13 cortejos penitenciales principales por la repetición de Trinidad, Jesús Nazareno y Vera-Cruz/Santo Entierro;
- al menos **23 Pasos** descritos en la guía.

Fuente:
https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-utrera

### Marchena

La guía 2026 define 8 sujetos y 18 Pasos:
- Borriquita · 2;
- Humildad · 2;
- Dulce Nombre · 2;
- Vera Cruz · 2;
- Jesús Nazareno · 3;
- Cristo de San Pedro · 2;
- Soledad · 3;
- Asociación Madre de Dios de la Merced · 2.

Fuente:
https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-marchena

### Mairena del Alcor

La guía provincial define siete Hermandades y catorce Pasos:
- Borriquita · 2;
- Cautivo · 2;
- Humildad · 2;
- Jesús Nazareno · 2;
- Vera Cruz · 2;
- Soledad · 3;
- Sacramental / Resucitado · 1.

Fuente:
https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-mairena-del-alcor

### Pedrera

La guía provincial define cinco sujetos y seis Pasos.

Fuente:
https://www.turismosevilla.org/es/eventos-y-fiestas/semana-santa-2026-de-pedrera

## 5. TOP 5 nuevo

| Posición | Municipio | Puntuación | Lectura operativa |
|---:|---|---:|---|
| 1 | **Morón de la Frontera** | **95/100** | 10 sujetos / 18 Pasos / 0 cobertura real; dos fuentes institucionales complementarias; estructura muy limpia |
| 2 | **Utrera** | **87/100** | mayor rendimiento bruto: 10 penitenciales, 13 cortejos y ≥23 Pasos; penalizada por multi-cortejos y conciliación con nodos existentes |
| 3 | **Marchena** | **85/100** | 8 sujetos / 18 Pasos; Merced published + Soledad draft; 18 Pasos aún ausentes; fuente muy estructurada |
| 4 | **Mairena del Alcor** | **82/100** | 7 Hermandades / 14 Pasos; Borriquita published + Humildad draft; alcance cerrable |
| 5 | **Pedrera** | **69/100** | 5 sujetos / 6 Pasos y cobertura cero; muy cerrable, pero menor rendimiento absoluto |

## 6. TOP 3

1. **Morón de la Frontera**
2. **Utrera**
3. **Marchena**

Mairena queda inmediatamente detrás por menor deuda absoluta. Pedrera es muy limpia, pero su rendimiento relacional no compensa todavía frente a los tres primeros.

## 7. Por qué Morón supera a Utrera

Utrera aportaría más relaciones —13 cortejos y al menos 23 Pasos—, pero el coste de normalización es mayor:

- Trinidad tiene dos cortejos;
- Jesús Nazareno tiene dos cortejos;
- Vera-Cruz/Santo Entierro tiene dos cortejos;
- Hilo ya contiene dos corporaciones penitenciales y varias entidades/Salidas de Utrera ajenas a Semana Santa;
- Consolación es gloriosa y no debe contaminar el universo penitencial;
- existe además deuda de conciliación musical/semántica previa.

Morón ofrece un universo muy potente con menor ambigüedad:

- 10 sujetos;
- 10 Salidas;
- 18 Pasos;
- 0 corporaciones existentes;
- 0 Pasos existentes;
- 0 Salidas existentes;
- no hay conflicto con nodos cofrades previos;
- la única expansión de catálogo necesaria es crear el municipio.

La ausencia de municipio es un coste técnico acotado, no un riesgo semántico comparable a los multi-cortejos de Utrera.

## 8. Selección

### Morón de la Frontera

Morón pasa a ser el **candidato único del décimo macrolote municipal HC-016**.

Universo inicial de selección:

- **10 sujetos corporativos**;
- **10 Salidas 2026**;
- **18 Pasos**;
- cobertura actual = **0/10 sujetos, 0/10 Salidas, 0/18 Pasos**.

El futuro inventario deberá comprobar si los diez sujetos pueden tiparse todos como Hermandades penitenciales o si alguna corporación exige una tipología distinta.

## 9. Riesgos a resolver antes de cualquier dato

La selección no autoriza escrituras.

La siguiente puerta deberá comprobar:

1. identidad canónica de los 10 sujetos;
2. tipología del Soberano y su encaje como Viernes de Dolores;
3. creación determinista del municipio Morón de la Frontera;
4. sedes y posibles sedes compartidas;
5. 18 Pasos y composición Imagen–Paso;
6. evidencia posterior de celebración 2026;
7. música por cada posición;
8. posibles Bandas de Morón ya existentes bajo nombres sin topónimo;
9. homónimos de titulares;
10. fotografías/escudos fuera del lote salvo licencia verificable.

## 10. Puerta operativa

**Selección certificada: Morón de la Frontera.**

Estado:

- Morón = **SELECCIONADO / COLA**;
- inventario = NO ABIERTO;
- matriz de Fuentes = NO ABIERTA;
- staging = NO;
- SQL = NO;
- Apply = NO;
- HC-AUTO-03 = BLOQUEADO.

La próxima orden, si se continúa, debe abrir únicamente **inventario canónico + matriz de Fuentes de Morón de la Frontera**.
