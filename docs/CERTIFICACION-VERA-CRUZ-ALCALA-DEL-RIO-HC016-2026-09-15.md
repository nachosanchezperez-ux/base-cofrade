# Certificación HC-016 · Vera-Cruz de Alcalá del Río

**Fecha de corte:** 15 de septiembre de 2026

**Lote:** `c0160024-0000-4000-8000-000000000001`

**Ámbito:** decimosexto contexto editorial real de HC-016

**Régimen:** `FIRST EDITION FREEZE` · solo DML editorial

## Resultado

Vera-Cruz de Alcalá del Río queda cerrada como contexto independiente. El lote completó staging, preflight transaccional con `ROLLBACK`, revisión, Apply, reaplicación idempotente y postflight en producción sin DDL, nuevas tablas, cambios RLS, código de producto ni activación de HC-018.

La ficha publica y relaciona:

- el Santísimo Cristo de la Vera-Cruz y María Santísima de las Angustias Coronada, con atribuciones expresamente cautas a Roque de Balduque y José Montes de Oca;
- San Gregorio de Osset como imagen de culto vinculada históricamente a la corporación, sin inventar autoría ni cronología;
- los dos pasos actuales, cinco piezas patrimoniales y cinco intervenciones o autorías;
- cuatro cultos y sus ediciones celebradas en 2026;
- la estación de penitencia del Jueves Santo y el regreso patronal de San Gregorio como Salidas separadas;
- los dos tramos de la estación —ida a la parroquia y regreso nocturno a San Gregorio—, con sus posiciones y formaciones musicales propias;
- 2.650 hermanos, 1.568 papeletas de sitio, 902 nazarenos y 32 acólitos según el programa oficial de 2026;
- seis acontecimientos históricos, la web y el Facebook oficiales y relaciones de Fuente para identidad, atribuciones, patrimonio, cultos, Salidas y música.

## Lote gobernado

| Estado | Preparadas | Aplicadas | Inválidas | Fallidas |
|---|---:|---:|---:|---:|
| `completed` | 45 | 45 | 0 | 0 |

La receta DML canónica queda archivada en `20260915180000_cierra_vera_cruz_alcala_del_rio.sql`. La reaplicación idempotente conserva tres imágenes, dos pasos, cuatro cultos, dos Salidas y cuatro periodos musicales vigentes. La Banda de Música Virgen de las Mercedes de Bollullos del Condado se reutiliza desde su nodo histórico y vuelve a publicarse por su participación acreditada en 2026.

## Postflight relacional

| Familia | Resultado |
|---|---:|
| Hermandad | 1 |
| Imágenes relacionadas / atribuciones | 3 / 2 |
| Pasos relacionados | 2 |
| Cultos / ocurrencias de 2026 | 4 / 4 |
| Salidas / participantes | 2 / 5 |
| Hitos horarios | 5 |
| Posiciones / asignaciones musicales | 6 / 6 |
| Periodos musicales vigentes | 4 |
| Patrimonio / intervenciones | 5 / 5 |
| Acontecimientos | 6 |
| Canales oficiales | 2 |

- 0 slugs duplicados en el catálogo.
- 0 relaciones Hermandad–Imagen o Hermandad–Paso huérfanas.
- 0 Salidas pasadas conservadas en `announced`.
- El Jueves Santo cruza correctamente la medianoche: 2–3 de abril de 2026.
- Las asignaciones de ida y regreso no se funden en un único acompañamiento genérico.
- Las cuatro formaciones vigentes de la estación quedan enlazables desde la ficha pública.

## Fuentes principales

- [Historia oficial de la Hermandad](https://www.vera-cruz.org/historia)
- [Programa y horarios oficiales del Jueves Santo de 2026](https://www.vera-cruz.org/blog/eventos-1/programa-y-horarios-jueves-santo-2026-55)
- [Cultos y regreso de San Gregorio de Osset en 2026](https://www.elpespunte.es/articulo/cofrade/san-gregorio-osset-regresa-tarde-ermita-alcala-rio/20260909143843150240.html)
- [Facebook oficial](https://www.facebook.com/p/Hermandad-de-la-Vera-Cruz-Alcal%C3%A1-del-R%C3%ADo-100064737994661/)

## Huecos legítimos

- No se convierte ninguna atribución escultórica en autoría documental.
- No se identifica la talla mariana actual con el testimonio devocional de 1645 sin reservas.
- No se fija el inicio contractual de las bandas documentadas únicamente en 2026.
- No se inventa hora final para el traslado de San Gregorio.
- No se publica fotografía ni escudo sin una licencia de reutilización verificable.

## Rutas públicas previstas

- `/hermandades/vera-cruz-alcala-del-rio`
- `/imagenes/santisimo-cristo-vera-cruz-alcala-del-rio`
- `/imagenes/maria-santisima-angustias-coronada-alcala-del-rio`
- `/imagenes/san-gregorio-osset-alcala-del-rio`
- `/pasos/paso-cristo-vera-cruz-alcala-del-rio`
- `/pasos/paso-palio-angustias-coronada-alcala-del-rio`
