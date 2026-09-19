# Inventario canónico y matriz de Fuentes · Lebrija · sexto macrolote municipal HC-016

**Fecha:** 19 de septiembre de 2026  
**Fase:** PREFLIGHT CERRADO · inventario físico reconciliado  
**Municipio:** Lebrija  
**Municipality ID existente:** `07281b21-d892-4e5d-aa63-24ec0e9bf4d2`  
**Namespace candidato:** `c0160033-*` · **LIBRE, NO RESERVADO**  
**Apply:** 0 · **Staging:** 0

## 1. Universo corporativo canónico

| # | Corporación | Tipo | Estado Hilo | Acción preliminar |
|---|---|---|---|---|
| 1 | Entrada Triunfal | Penitencia | Ausente | INSERT |
| 2 | Oración en el Huerto | Penitencia | Ausente | INSERT |
| 3 | Humildad | Penitencia + Gloria | Ausente | INSERT |
| 4 | Ecce-Homo · Los Gitanos | Penitencia | Ausente | INSERT |
| 5 | Castillo | Penitencia + Gloria | **Publicada** | REUSE + completar |
| 6 | Dolores | Penitencia + Sacramental | Ausente | INSERT |
| 7 | Vera-Cruz | Penitencia | Ausente | INSERT |
| 8 | Santo Sepulcro | Penitencia | Ausente | INSERT |
| 9 | Soledad | Penitencia | Ausente | INSERT |
| 10 | Rocío | Gloria / Romería | Ausente | INSERT |
| 11 | San Benito | Gloria / Patronal | Ausente | INSERT |
| 12 | Hermandad Sacramental | Sacramental | Ausente | INSERT |

### Reconciliaciones obligatorias

- **Aurora** se integra en Humildad: no crear Hermandad separada.
- **Castillo Gloria** se integra en Castillo: no crear segunda corporación.
- **Dolores** posee título sacramental, pero no absorbe a la **Hermandad Sacramental histórica**: fuentes municipales recientes las tratan separadamente.
- El Santo Sepulcro y la Soledad permanecen como dos corporaciones distintas pese a su relación histórica con el Santo Entierro.

## 2. Titulares y Pasos · inventario preliminar

La autoridad del preflight deberá cerrar IDs físicos; esta tabla no los congela.

| Corporación | Titulares/elementos documentados | Pasos documentados |
|---|---|---:|
| Entrada Triunfal | Jesús en la Entrada Triunfal · Ntra. Sra. de la Estrella · San Juan Evangelista | 2 |
| Oración | Jesús Orando en el Huerto · Cristo de la Buena Muerte · Santa María de Jesús | 3 |
| Humildad | Jesús de la Humildad · Ntra. Sra. de la Victoria · Ntra. Sra. de la Aurora · San Juan Evangelista | 3 penitenciales + Paso de Gloria de Aurora a reconciliar |
| Ecce-Homo | Jesús del Ecce-Homo · Ntra. Sra. del Mayor Dolor · Beato Ceferino Mártir | 2 |
| Castillo | Jesús Atado a la Columna · Ntra. Sra. del Castillo Coronada · San Pedro Apóstol | 2; Virgen ya existente, Pasos por crear/reconciliar |
| Dolores | Ntro. Padre Jesús Nazareno · María Stma. de los Dolores · San Juan Evangelista · Santa Mujer Verónica | 4 |
| Vera-Cruz | Stmo. Cristo de la Vera-Cruz · Ntra. Sra. de Consolación | 2 |
| Santo Sepulcro | Cristo de las Cinco Llagas / Yacente | Urna · 1 |
| Soledad | Ntra. Sra. de la Soledad | 1 |
| Rocío | Simpecado / patrimonio rociero | No forzar Paso convencional hasta preflight |
| San Benito | San Benito Abad | 1 |
| Sacramental | Santísimo Sacramento y patrimonio eucarístico | No forzar Paso si no corresponde al modelo |

## 3. Salidas 2026 a preservar

### Semana Santa

El Ayuntamiento certifica retrospectivamente que las nueve Hermandades de Penitencia realizaron sus estaciones de penitencia en 2026. El lote deberá crear nueve Salidas `held` si la documentación individual permite fijar cada fecha y relación.

### Glorias / otras salidas

- Rocío · salida de Lebrija hacia la aldea · 19/05/2026 · evidencia posterior municipal.
- San Benito · salida procesional patronal · julio de 2026 · evidencia municipal.
- Aurora · Rosario procesional · 15/08/2026 · fuente oficial de la Hermandad.
- Castillo · procesión patronal · 12/09/2026 · **ya existente en Hilo**.

La procesión eucarística de la Hermandad Sacramental solo se elevará a Salida 2026 si se obtiene Fuente actual y fecha concreta; no se deduce por recurrencia.

## 4. Lugares

### REUSE

- Parroquia de Nuestra Señora de la Oliva · `067dda49-ad58-4a45-9da8-da87491fa7b2`.
- Ermita de Nuestra Señora del Castillo · `4f08d608-a848-479a-9cae-c6dc1366a5dc`.
- Convento de la Purísima Concepción · `f4a9cd86-4ee2-4f9a-9d26-7bbaba286176`.

### Por crear/reconciliar

- Parroquia / Iglesia de Santa María de Jesús.
- Capilla de la Aurora.
- Iglesia / Ermita de Belén.
- Iglesia de San Francisco.
- Ermita de San Benito.
- cualquier sede adicional solo tras verificar denominación y municipio.

## 5. Música

Hilo ya posee la **Banda de Música Virgen del Castillo de Lebrija**.

El futuro lote no debe inferir acompañamientos por costumbre. Cada relación 2026 requiere:

1. Salida concreta;
2. posición;
3. Banda canónica o texto temporal inequívoco;
4. Fuente 2026;
5. periodo histórico solo cuando la continuidad esté documentada.

Las Bandas externas deberán primero reconciliarse con el directorio existente.

## 6. Matriz de Fuentes

| Bloque | Fuente primaria | Uso |
|---|---|---|
| Universo penitencial | Consejo · categoría Penitencia | 9 corporaciones |
| Entrada Triunfal | Consejo · itinerarios | nombre, sede, 2 Pasos |
| Oración | Consejo · itinerarios / Parroquia Santa María de Jesús | nombre, sede, 3 Pasos |
| Humildad + Aurora | Consejo + web oficial Humildad | una sola corporación; doble carácter; Paso de Gloria |
| Ecce-Homo | Consejo | identidad, sede, 2 Pasos |
| Castillo | Consejo + web oficial + Hilo | REUSE; doble carácter |
| Dolores | Consejo + web oficial Dolores | identidad actual sacramental/servita, 4 titulares |
| Vera-Cruz | Consejo | identidad, 2 titulares |
| Santo Sepulcro | Consejo | identidad, urna, historia |
| Soledad | Consejo | identidad propia, 1 Paso |
| Rocío | Ayuntamiento 2026 + Consejo | salida held 2026 |
| San Benito | Ayuntamiento 2026 + Consejo | salida held 2026 |
| Sacramental | Consejo + Ayuntamiento Corpus | identidad separada |
| Semana Santa 2026 | Ayuntamiento | 9/9 estaciones realizadas |
| Aurora 2026 | web oficial Humildad | Rosario 15/08/2026 |
| Castillo 2026 | Ayuntamiento + Fuentes ya en Hilo | salida 12/09/2026 |

## 7. Fuentes URL

- https://www.hermandadesdelebrija.org/
- https://hermandadesdelebrija.org/index.php/87-penitencia
- https://www.hermandadesdelebrija.org/index.php/86-consejo?start=25
- https://www.hermandadesdelebrija.org/index.php/noticiasve/86-consejo?start=20
- https://www.hermandadesdelebrija.org/index.php/noticiasau/103-penitencia/dolores?start=10
- https://www.hermandadesdelebrija.org/index.php/noticiassc/104-penitencia/veracruz?start=10
- https://www.hermandadesdelebrija.org/index.php/105-penitencia/santosepulcro?start=10
- https://www.hermandadesdelebrija.org/index.php/106-penitencia/soledad?start=5
- https://www.hermandadesdelebrija.org/index.php/107-gloria/rocio
- https://www.hermandadesdelebrija.org/index.php/fotossb/110-gloria/sanbenito
- https://www.hermandadesdelebrija.org/index.php/111-sacramentales/sacramental?start=5
- https://lebrija.es/es/actualidad/noticias/Concluye-una-Semana-Santa-marcada-por-las-buenas-temperaturas-y-con-una-destacada-participacion-ciudadana/
- https://lebrija.es/es/actualidad/noticias/La-Hermandad-del-Rocio-de-Lebrija-inicia-su-camino-hacia-El-Rocio/
- https://humildaddelebrija.es/convocatoria-de-actos-y-cultos-aurora-2026/
- https://hermandaddelosdolores.com/
- https://hermandaddelcastillo.org/

## 8. Fotografía actual de Hilo

Antes del pre-lote:

- Hermandades Lebrija: **1**;
- Bandas locales: **1**;
- Imágenes ligadas a Hermandad municipal: **1**;
- Pasos ligados a Hermandad municipal: **0**;
- Salidas: **1**;
- Cultos: **3**;
- ediciones 2026: **3**;
- lugares: **3**;
- Fuentes con señal nominal/URL de Lebrija: al menos **8**.

## 9. Estimación de filas

La estimación útil actual es **430–500 DML**.

No congelar esa cifra. Las mayores variables son:

- número físico final de Imágenes;
- Paso de Gloria de Aurora;
- relaciones exactas de Dolores;
- modelado del Rocío;
- Corpus/Sacramental;
- acompañamientos musicales 2026;
- número de Fuentes y source_links.

## 10. Incertidumbres resueltas por el preflight

1. Humildad: 3 Pasos penitenciales; Aurora añade 1 Paso de Gloria propio.
2. Dolores: 4 titulares procesionales y 4 Pasos.
3. Rocío: Simpecado + carreta como patrimonio; 0 `step`.
4. San Benito: Hermandad + Imagen + salida 2026; 0 `step` hasta Fuente física suficiente.
5. Sacramental: alta institucional; 0 salida 2026 sin evidencia actual inequívoca.
6. Música: solo cuatro relaciones 2026 verificadas entran al plan seguro.
7. Bandas: Afligidos, Agripino Lozano y Banda Municipal Ntra. Sra. del Rosario de El Cuervo son altas nuevas; Banda Virgen del Castillo es REUSE.
8. Fuentes: las 8 ya existentes de Lebrija se preservan y reutilizan.

Inventario físico resultante para el row-by-row:

- 12 Hermandades · 11 nuevas + Castillo REUSE;
- 25 Imágenes relacionadas · 24 nuevas + Virgen del Castillo REUSE;
- 21 Pasos nuevos;
- 12 Salidas nuevas `held` + salida patronal de Castillo REUSE;
- 4 acompañamientos musicales 2026 seguros;
- Aurora y San Benito con Cultos 2026 mínimos documentados.

## 11. Puerta

Este inventario **no crea staging ni autoriza Apply**.

Siguiente orden interna:

**plan row-by-row determinista → IDs/slugs definitivos → colisiones → Fuentes y source_links exactos → recuento INSERT/UPDATE/DELETE/REUSE → manifiesto determinista.**
