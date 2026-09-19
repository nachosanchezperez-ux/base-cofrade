# Auditoría · sexto macrolote municipal HC-016 · recálculo provincial desde cero

**Fecha:** 19 de septiembre de 2026  
**Base:** `2c9d30b36ad4f4f2a9c4bb828de5be069fc3bce4`  
**Régimen:** FIRST EDITION FREEZE  
**Resultado:** **LEBRIJA · SELECCIONADA PARA PRE-LOTE**  
**Staging:** 0  
**Apply:** 0  
**DDL/RLS:** 0

## 1. Preflight de recálculo

Fotografía de entrada:

- GitHub `main`: `2c9d30b36ad4f4f2a9c4bb828de5be069fc3bce4`;
- PR abiertas: **0**;
- producción: `dpl_CqbFFDxWiwadWZiyyyv7Z4JTGjnt` · **READY** · mismo SHA que `main`;
- Supabase `Hilocofrade`: **ACTIVE_HEALTHY**;
- migraciones estructurales: **12/12**;
- frente editorial municipal activo: **ninguno**.

Se excluyen por cierre municipal certificado:

1. Gerena.
2. Dos Hermanas.
3. Alcalá de Guadaíra.
4. Pilas.
5. Cantillana.
6. Coria del Río.
7. Estepa.

Sevilla capital no compite por definición de misión.

Después de estas exclusiones, el grafo vivo contiene **43 municipios de la provincia con alguna señal real** —Hermandad, Banda, Salida, evento, lugar o agente— que pueden entrar en la comparación.

## 2. Método

No se reutiliza el ranking que eligió Estepa.

Para cada municipio se cruza:

- cobertura actual de Hermandades y Bandas;
- titulares y Pasos;
- Salidas y actualidad 2026;
- Cultos y ediciones;
- música;
- lugares;
- Fuentes existentes;
- capacidad de cerrar el universo corporativo desde Fuentes institucionales;
- reutilización de nodos canónicos;
- riesgo de duplicidad o de corporaciones multijornada;
- volumen ejecutable mediante DML.

La deuda bruta nunca se equipara automáticamente a INSERT.

## 3. Fotografía de candidatos principales

| Municipio | Hdes. públicas en Hilo | Señal actual | Deuda externa verificable | Riesgo |
|---|---:|---|---|---|
| **Lebrija** | 1 | Castillo + Banda + salida patronal + 3 Cultos | 12 corporaciones canónicas aprox.; 11 ausentes | **Bajo** |
| **Osuna** | 1 | Consolación + Banda + Cultos | 10 penitenciales documentadas institucionalmente, todas ausentes | Bajo-medio |
| **Carmona** | 0 | 1 Salida 2026 | Semana Santa 2026 documenta 9 corporaciones principales | Medio |
| **Écija** | 1 | Valle + Banda + Cultos | 14 penitenciales; Expiración y Confalón ya existen como nodos `draft` | **Medio-alto** |
| **Utrera** | 3 | 4 Bandas + 4 Salidas + 4 Cultos | amplia red penitencial/sacramental; corporaciones multijornada | **Medio-alto** |
| Marchena | 1 | Pastora + Banda | núcleo penitencial amplio; Soledad ya existe como `draft` | Medio |
| Mairena del Alcor | 1 | Borriquita + Banda | 7 penitenciales en 2026; 6 ausentes | Medio |
| Sanlúcar la Mayor | 1 | Vera Cruz + 2 Bandas | 7 penitenciales; 6 ausentes | Medio |

## 4. TOP 5 nuevo

| Puesto | Municipio | Deuda | Fuentes | Actualidad | Reutilización | Riesgo | Ejecutabilidad |
|---|---|---|---|---|---|---|---|
| **1** | **Lebrija** | Muy alta | Muy alta | Muy alta | Alta | **Bajo** | **Muy alta** |
| **2** | **Osuna** | Muy alta | Muy alta | Alta | Alta | Bajo-medio | Muy alta |
| **3** | **Carmona** | Muy alta | Muy alta | Muy alta | Media | Medio | Alta |
| **4** | **Écija** | Máxima | Muy alta | Alta | Alta | Medio-alto | Media |
| **5** | **Utrera** | Muy alta | Muy alta | Muy alta | Muy alta | Medio-alto | Media |

### Motivos de descarte relativo

- **Écija** no baja por falta de valor: su deuda absoluta es probablemente la mayor. Baja por volumen, dos nodos `draft` previos y mayor reconciliación.
- **Utrera** conserva enorme valor, pero Jesús Nazareno y Trinidad son multijornada y existen dos identidades públicas de Álvarez Quintero que deben resolverse antes de cualquier lote integral.
- **Carmona** parte casi de cero y tiene una Semana Santa muy profunda, pero su frontera corporativa incluye Orden Seglar y varias modalidades de salida que requieren reconciliación.
- **Osuna** presenta diez penitenciales perfectamente documentadas, pero el cierre integral de Glorias todavía requiere una segunda delimitación.
- **Lebrija** tiene una frontera corporativa mucho más cerrada y un Consejo que estructura Penitencia, Gloria y Sacramental.

## 5. TOP 3 final

| Puesto | Municipio | Universo mínimo verificable | Deuda principal | Riesgo |
|---|---|---:|---|---|
| **1** | **Lebrija** | **12 corporaciones canónicas** | 11 corporaciones ausentes + remate de Castillo | **Bajo** |
| **2** | **Osuna** | ≥10 penitenciales + Glorias | 10 penitenciales ausentes; Consolación ya publicada | Bajo-medio |
| **3** | **Carmona** | 9 corporaciones principales de Semana Santa | prácticamente todo el núcleo municipal ausente | Medio |

## 6. Por qué Lebrija

### 6.1 Universo reconciliable

El Consejo de Lebrija enumera nueve Hermandades de Penitencia:

1. Entrada Triunfal.
2. Oración en el Huerto.
3. Humildad.
4. Ecce-Homo.
5. Castillo.
6. Dolores.
7. Vera-Cruz.
8. Santo Sepulcro.
9. Soledad.

La revisión canónica evita dos duplicaciones aparentes:

- **Aurora no es una Hermandad distinta**: Nuestra Señora de la Aurora es titular gloriosa de la Hermandad de la Humildad, que procesiona también el 15 de agosto.
- **Castillo Gloria no es otra corporación**: la Virgen del Castillo y Nuestro Padre Jesús Atado a la Columna pertenecen a la misma Hermandad mixta, ya publicada en Hilo.

Se añaden como identidades corporativas distintas:

10. Hermandad del Rocío.
11. Hermandad de San Benito.
12. Hermandad Sacramental.

El Ayuntamiento, además, sigue tratando de forma separada en actos de Corpus a **Los Dolores** y a la **Hermandad Sacramental**, por lo que no se fusionan entre sí.

Resultado: **12 corporaciones canónicas**; Hilo tiene una —Castillo— y faltan **11**.

### 6.2 Actualidad 2026

- El Ayuntamiento certificó que las **nueve Hermandades de Semana Santa** realizaron sus estaciones de penitencia con normalidad en 2026.
- Rocío salió de Lebrija el 19 de mayo.
- San Benito procesionó en julio.
- La Aurora de la Humildad celebró su Rosario procesional del 15 de agosto.
- Nuestra Señora del Castillo Coronada procesionó el 12 de septiembre y esa salida ya está publicada en Hilo.

Por tanto, el lote puede construir actualidad real `held` sin convertir convocatorias históricas en hechos.

### 6.3 Grafo existente reutilizable

Hilo ya contiene:

- municipio Lebrija: `07281b21-d892-4e5d-aa63-24ec0e9bf4d2`;
- Hermandad del Castillo: `b88c97c3-d979-414f-bdc4-145d4f337703`;
- Nuestra Señora del Castillo Coronada: `06e486fe-c229-4686-a0ec-fca6650b281b`;
- Banda de Música Virgen del Castillo de Lebrija: `c34e984b-bb36-4424-a0a5-85b22ab71f72`;
- Parroquia de Nuestra Señora de la Oliva;
- Ermita de Nuestra Señora del Castillo;
- Convento de la Purísima Concepción;
- salida patronal del 12/09/2026;
- tres Cultos/ediciones 2026 de la Virgen del Castillo;
- Fuentes municipales ya enlazadas.

## 7. Colisiones preliminares

Slugs candidatos de las 11 corporaciones ausentes:

- `entrada-triunfal-lebrija`
- `oracion-huerto-lebrija`
- `humildad-lebrija`
- `ecce-homo-lebrija`
- `dolores-lebrija`
- `vera-cruz-lebrija`
- `santo-sepulcro-lebrija`
- `soledad-lebrija`
- `rocio-lebrija`
- `san-benito-lebrija`
- `sacramental-lebrija`

Resultado contra producción: **0 colisiones**.

El namespace candidato `c0160033-*` está **libre en producción e importador**, pero **no se congela todavía**. Solo podrá reservarse después del preflight específico.

## 8. Volumen preliminar del futuro lote

No se congela todavía un número exacto de filas.

Inventario preliminar:

- 12 corporaciones canónicas · 11 nuevas + 1 REUSE/remate;
- ~24–27 Imágenes útiles;
- ~20–22 Pasos;
- 5–7 lugares nuevos;
- 12–13 Salidas/series 2026 potenciales;
- 10–16 relaciones musicales 2026, sujetas a Fuente;
- 14–20 Cultos + sus ediciones;
- 20–30 Fuentes nuevas;
- ~100–140 enlaces de Fuente.

**Envolvente preliminar:** aproximadamente **430–500 DML**, más **10–20 REUSE**.

Esta cifra sirve únicamente para decidir ejecutabilidad. El preflight específico deberá sustituirla por un plan row-by-row exacto.

## 9. Fuentes principales

### Institucionales / corporativas

- Consejo General de Hermandades y Cofradías de Lebrija  
  https://www.hermandadesdelebrija.org/
- Hermandades de Penitencia  
  https://hermandadesdelebrija.org/index.php/87-penitencia
- Hermandad Sacramental  
  https://www.hermandadesdelebrija.org/index.php/111-sacramentales/sacramental?start=5
- Ayuntamiento · balance de Semana Santa 2026  
  https://lebrija.es/es/actualidad/noticias/Concluye-una-Semana-Santa-marcada-por-las-buenas-temperaturas-y-con-una-destacada-participacion-ciudadana/
- Ayuntamiento · Rocío 2026  
  https://lebrija.es/es/actualidad/noticias/La-Hermandad-del-Rocio-de-Lebrija-inicia-su-camino-hacia-El-Rocio/
- Hermandad de la Humildad · Aurora 2026  
  https://humildaddelebrija.es/convocatoria-de-actos-y-cultos-aurora-2026/
- Hermandad de los Dolores · web oficial  
  https://hermandaddelosdolores.com/
- Hermandad del Castillo · web oficial  
  https://hermandaddelcastillo.org/

## 10. Puerta

**SELECCIÓN APROBADA · PRE-LOTE ÚNICAMENTE.**

No se crea:

- staging;
- bulk import;
- DML editorial;
- DDL;
- cambios RLS;
- segundo municipio paralelo.

Siguiente movimiento autorizado:

**preflight específico de Lebrija → reconciliar IDs/nombres/slugs/Fuentes → congelar inventario físico → plan row-by-row exacto → manifiesto determinista.**

El Apply permanece prohibido.
