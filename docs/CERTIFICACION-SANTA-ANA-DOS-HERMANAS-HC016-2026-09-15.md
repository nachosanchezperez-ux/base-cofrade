# Certificación HC-016 · Santa Ana de Dos Hermanas

**Fecha de corte:** 15 de septiembre de 2026

**Lote:** `c0160023-0000-4000-8000-000000000001`

**Ámbito:** decimoquinto contexto editorial real de HC-016

**Régimen:** `FIRST EDITION FREEZE` · solo DML editorial

## Resultado

Santa Ana de Dos Hermanas queda cerrada como contexto independiente. El lote completó staging, preflight transaccional con `ROLLBACK`, revisión, Apply y postflight en producción sin DDL, nuevas tablas, cambios RLS, código de producto ni activación de HC-018.

La ficha publica y relaciona:

- el grupo gótico de Nuestra Señora Santa Ana, con datación prudente a principios del siglo XIV y autoría anónima;
- el paso de tumbilla y dos conjuntos patrimoniales;
- el besamanos, triduo y función solemne, con sus tres ediciones celebradas en 2026;
- la procesión del 26 de julio y el traslado del día 27 como Salidas separadas;
- Presentación al Pueblo abriendo el cortejo y la Banda de Música Santa Ana tras el paso y en el traslado;
- tres acontecimientos históricos, el Instagram oficial y nueve Fuentes relacionadas en el árbol de la ficha;
- una fotografía de Daniel Jiménez reutilizada bajo CC0 1.0, con página canónica, titular de derechos, licencia y nota de transformación conservados.

## Lote gobernado

| Estado | Preparadas | Aplicadas | Inválidas | Fallidas |
|---|---:|---:|---:|---:|
| `completed` | 49 | 49 | 0 | 0 |

La receta DML canónica queda archivada en `20260915113000_cierra_santa_ana_dos_hermanas.sql`. La reaplicación idempotente conserva un titular, un paso, tres cultos, dos Salidas y dos periodos musicales vigentes.

## Postflight relacional

| Familia | Resultado |
|---|---:|
| Hermandad | 1 |
| Imagen titular / autoría | 1 / 1 |
| Paso relacionado | 1 |
| Cultos / ocurrencias de 2026 | 3 / 3 |
| Salidas / participantes | 2 / 3 |
| Posiciones / asignaciones musicales | 3 / 3 |
| Periodos musicales vigentes | 2 |
| Patrimonio | 2 |
| Acontecimientos | 3 |
| Canal oficial | 1 |
| Relaciones multimedia | 2 |

- 0 slugs duplicados en el catálogo.
- 0 relaciones Hermandad–Imagen o Hermandad–Paso huérfanas.
- 0 Salidas pasadas conservadas en `announced`.
- La hora de retransmisión municipal, 20:00, no se convirtió en hora de salida; la procesión conserva las 20:30 publicadas.

## Fuentes principales

- [Cultos, procesión y traslado de 2026](https://www.periodicoelnazareno.es/santa-ana-celebra-sus-cultos-y-procesion/)
- [Recorrido y música de la procesión](https://www.elpespunte.es/articulo/cofrade/procesion-santa-ana-dos-hermanas-2026-recorrido-bandas-donde-verla-directo/20260726111651142604.html)
- [Crónica posterior de la procesión](https://periodicolasemana.es/2026/149494/tramo-cofrade/dos-hermanas-con-su-patrona-en-la-procesion-del-26-de-julio/)
- [Descripción histórica de Santa Ana](https://www.artesacro.org/Noticia/Ver/78701/provincia-santa-ana-patrona-dos-hermanas)
- [Fotografía y licencia CC0](https://commons.wikimedia.org/wiki/File:Santa_Ana,_Patrona_de_Dos_Hermanas.jpg)

## Huecos legítimos

- No se atribuye el grupo escultórico a un autor sin fuente suficiente.
- No se fija una fecha de ejecución de la tumbilla ni de la orfebrería.
- No se inventa hora de regreso de la procesión o del traslado.
- No se convierte la vigencia musical de 2026 en año de inicio contractual.
- No se publica escudo sin autorización verificable.

## Rutas públicas previstas

- `/hermandades/hermandad-santa-ana-dos-hermanas`
- `/imagenes/nuestra-senora-santa-ana-dos-hermanas`
- `/pasos/paso-tumbilla-santa-ana-dos-hermanas`
