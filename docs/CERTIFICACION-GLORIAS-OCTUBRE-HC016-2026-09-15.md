# Certificación HC-016 · Glorias de octubre de Sevilla

**Fecha de corte:** 15 de septiembre de 2026  
**Lote:** `c0160022-0000-4000-8000-000000000001`  
**Alcance:** las quince entradas del censo de octubre del Consejo de Hermandades  
**Resultado:** `completed` · 186/186 aplicadas · 0 inválidas · 0 fallos

## Inventario real

El censo institucional contiene quince corporaciones o dimensiones letíficas. Se respetó la identidad de las Hermandades mixtas: Encarnación pertenece a La Cena; Divina Enfermera a la Sagrada Lanzada; Rosario de Dos de Mayo a Las Aguas; Rosario de la Macarena a La Macarena; y Salud a El Sol.

| Entrada de octubre | Corporación canónica | Estado inicial | Resultado |
|---|---|---|---|
| Nuestra Señora de la Encarnación | La Cena | Publicada y cerrada | Preservada; Salida 2026 añadida |
| Nuestra Señora de la Cabeza | Real Cofradía Sevillana de la Cabeza | Borrador sin ficha | Publicada y completada |
| Divina Enfermera | Sagrada Lanzada | Corporación publicada; dimensión letífica ausente | Titular, Paso y Salida añadidos |
| Rosario del Barrio León | Hermandad del Rosario del Barrio León | Ausente | Creada |
| Nuestra Señora del Pilar | Hermandad del Pilar de San Pedro | Ausente | Creada |
| Rosario de los Humeros | Hermandad del Rosario de los Humeros | Ausente | Creada |
| Madre de Dios del Rosario | Madre de Dios del Rosario | Publicada pero incompleta | Titular y Salida añadidos |
| Rosario de Dos de Mayo | Las Aguas | Publicada y cerrada | Preservada |
| Santísimo Rosario de San Julián | Rosario de San Julián | Ausente | Creada |
| Nuestra Señora de Guadalupe | Guadalupe de San Buenaventura | Certificada | Preservada |
| Nuestra Señora de las Nieves | Hermandad de las Nieves | Publicada y parcial | Culto y trazabilidad de octubre añadidos |
| Rosario de la Macarena | La Macarena | Publicada y cerrada | Preservada |
| Nuestra Señora de la Sierra | Hermandad de la Sierra | Ausente | Creada |
| María Santísima de la Salud | El Sol | Publicada y cerrada | Preservada |
| Nuestra Señora de Montemayor | Hermandad de Montemayor | Ausente | Creada |

## Recálculo post-Semana Santa y selección

La elección no se hizo por continuidad del calendario. Se compararon los tres carriles ordenados después de congelar Semana Santa, Glorias de septiembre, HC-019, HC-020, #492 y la auditoría de pasados en `announced`. Los 112 casos preservados no se reauditaron.

| Puesto | Frente | Alcance e impacto | Fuentes y actualidad | Capacidad de cierre | Riesgo | Puntuación comparativa |
|---:|---|---|---|---|---|---:|
| 1 | **Glorias de octubre** | 15 entradas institucionales; 8 fichas publicadas, Cabeza en borrador y 6 corporaciones ausentes en el corte inicial | Alta: censo oficial y siete salidas anunciadas entre el 3 y el 12 de octubre, dentro de los próximos 45 días | Alta mediante un único macrolote HC-016 | Medio: Hermandades mixtas, Rosarios homónimos y datos 2026 aún no publicados | **88/100** |
| 2 | **Hermandades publicadas no certificadas** | Deuda nuclear visible en fichas como Prado, Vera Cruz de Huévar y Divina Pastora de Marchena, junto con otras señales parciales | Variable y sin una misma ventana temporal | Media-baja: exige investigación y cierres independientes, no un lote temático único | Alto: el medidor mezcla deuda real con escudos sin derechos y otros huecos legítimos | **61/100** |
| 3 | **Relaciones editoriales transversales** | 0 Imágenes, Pasos o Hermandades publicados sin su perfil especializado; 91 Salidas publicadas sin `outing_entities` en el corte de control | Variable: parte usa organizador textual y no constituye deuda automática | Baja como macrolote: requiere decidir caso a caso qué relación está demostrada | Alto: riesgo de fabricar relaciones o reabrir cierres certificados | **55/100** |

Ganó **Glorias de octubre** por combinar utilidad temporal inmediata, quince identidades beneficiadas, fuentes institucionales suficientes, seis altas reales y un cierre completo sin dependencias estructurales. El segundo y el tercer frente permanecen en cola; no se abrió ninguna de sus fichas ni se convirtió la ausencia de una relación en deuda por sí sola.

## Fuentes y actualidad

La fuente vertebral es el directorio oficial de Glorias de octubre del Consejo. Las convocatorias del propio Consejo documentan las salidas del 3, 4, 10 y 12 de octubre de 2026. Las webs institucionales de Cabeza, Barrio León, Pilar, Humeros, Rosario de San Julián y Montemayor, junto con la ficha institucional de la Sierra, sostienen identidad, sede, titular y cultos cuando están publicados.

Se han creado siete Salidas futuras, todas en `announced`:

| Fecha | Salida | Hora publicada |
|---|---|---:|
| 3 de octubre | Nuestra Señora de la Cabeza | 19:00 |
| 3 de octubre | Divina Enfermera | 19:30 |
| 4 de octubre | Nuestra Señora de la Encarnación | 19:30 |
| 10 de octubre | Rosario del Barrio León | 18:30 |
| 12 de octubre | Rosario de los Humeros | No publicada |
| 12 de octubre | María Santísima del Pilar | No publicada |
| 12 de octubre | Madre de Dios del Rosario | No publicada |

No se han trasladado a 2026 itinerarios, horarios ni acompañamientos de 2023 o 2025. Las restantes salidas de octubre no se han creado porque, a fecha de corte, no existe convocatoria institucional de 2026 suficiente.

## Composición del lote

| Familia | Operaciones |
|---|---:|
| Fuentes | 12 |
| Entidades | 24 |
| Hermandades | 7 |
| Sedes y localizaciones | 14 |
| Canales oficiales | 6 |
| Imágenes titulares | 18 |
| Pasos | 16 |
| Relaciones Imagen–Paso | 9 |
| Cultos | 7 |
| Salidas y participantes | 21 |
| `source_links` | 52 |
| **Total** | **186** |

Plan efectivo: **185 insert/upsert**, **1 update** y **19 reutilizaciones canónicas**. La receta es exclusivamente DML y está archivada fuera de la cadena estructural activa.

## Flujo HC-016

- CARGA: 186 operaciones inventariadas.
- STAGING: 186/186 válidas; 0 inválidas.
- PREFLIGHT GLOBAL: simulación transaccional completa con `ROLLBACK`.
- REVISIÓN: separación explícita de advocaciones homónimas por corporación y sede.
- APPLY: 186/186; 0 fallos.
- RESULTADOS: lote `completed`.

El primer preflight detectó que `cults.month` requiere entero; se corrigió antes de Apply. Staging detectó que su enumeración admite `upsert` y no `update`; se corrigió la representación sin alterar la operación SQL efectiva.

Durante la revisión se detectó además una colisión provisional con el UUID de la auditoría anterior. Se restauró íntegramente `c0160021` con sus 30 ítems y se asignó a octubre `c0160022`. La comprobación final devuelve ambos lotes separados, completos y con sus respectivos conteos.

## QA

- 15/15 corporaciones del censo enlazadas y publicadas.
- 7/7 Salidas futuras en `announced`.
- 0 fechas futuras en `held`.
- 0 slugs duplicados.
- 0 relaciones Hermandad–Imagen huérfanas.
- 0 relaciones Hermandad–Paso huérfanas.
- 0 relaciones Imagen–Paso huérfanas.
- 0 participantes de Salida huérfanos.
- Reaplicación idempotente: 15 vínculos de censo, 7 Salidas y 6 Hermandades nuevas antes y después.

## Huecos legítimos

- escudos, cabeceras y fotografías sin autorización de reutilización;
- autorías y cronologías no publicadas por una fuente institucional suficiente;
- itinerarios, horas de regreso, bandas, capataces y vestidores de 2026 aún no anunciados;
- salidas posteriores al 12 de octubre cuya convocatoria de 2026 todavía no está publicada;
- catálogos patrimoniales y de Cultos no exhaustivos.

No se ha activado HC-018 ni Laboratorio. No se ha introducido DDL, nuevas tablas, cambios RLS ni excepciones por `slug`.
