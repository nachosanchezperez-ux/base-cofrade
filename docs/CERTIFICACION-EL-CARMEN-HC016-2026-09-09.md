# Certificación editorial · El Carmen · HC-016 · 9 de septiembre de 2026

## Resultado

**EL CARMEN → QUINTO LOTE HC-016 COMPLETADO · 83/83 · INDEXABLE · CRONOLOGÍA MUSICAL PUBLICADA.**

Base Git y producción previa al remate documental: `7b895f5d8779c12e4e9b187da7b22580ed66676d` · deployment `dpl_52BkVNbnSKRvBN9w5XXoj4AAR4NH` · `READY`.

Lote aplicado: `c0160005-1000-4000-8000-000000000001`.

El remate de Cristo del Perdón se aplicó de forma separada en `c0160005-0000-4000-8000-000000000001`: 5/5 operaciones, 0 fallos. No duplicó los dos periodos musicales vigentes; incorporó dos Fuentes y tres vínculos documentales.

## Preflight y ejecución

El lote de El Carmen quedó preparado con 83 registros:

| Familia | Filas |
|---|---:|
| Fuentes | 11 |
| Entidades | 7 |
| Hermandad | 1 |
| Imágenes y Pasos | 5 |
| Agentes | 2 |
| Relaciones Hermandad–Imagen y Hermandad–Paso | 5 |
| Autorías y relaciones Imagen–Paso | 5 |
| Hábito | 1 |
| Cultos | 9 |
| Salida y participantes | 3 |
| Periodos musicales | 4 |
| `source_links` | 30 |
| **Total** | **83** |

- validación estructural: 83 válidas, 0 errores y 0 colisiones;
- plan efectivo: 74 insert · 6 update · 3 reuse;
- simulación completa en transacción revertida: correcta y sin escrituras residuales;
- Apply real atómico: 83 aplicadas, 0 inválidas y 0 fallos;
- lote y resultados registrados en `bulk_imports`, `bulk_import_items` y `audit_log`.

## Inventario certificado

- identidad, denominación oficial, historia, sede, web y Miércoles Santo;
- 3 titulares publicados: Nuestro Padre Jesús de la Paz, Nuestra Señora del Carmen en sus Misterios Dolorosos y Maravillas de María;
- 2 Pasos publicados y relacionados con sus imágenes;
- 3 autorías documentadas;
- hábito nazareno carmelita;
- 9 Cultos recurrentes;
- Estación de Penitencia del 1 de abril de 2026 publicada como celebrada y con sus dos titulares participantes;
- 4 periodos musicales publicados y vinculados a su Paso;
- 30 vínculos de Fuente del lote, 0 huérfanos;
- 0 periodos musicales duplicados o inválidos.

## Cronología musical

| Paso | Formación | Periodo | Estado |
|---|---|---:|---|
| Misterio | Pasión de Linares | 2022–2026 | Finalizado tras la edición de 2026 |
| Misterio | Agrupación Musical Virgen de los Reyes | 2013–2020 | Histórico |
| Palio | Banda de Música de Nuestra Señora de la Soledad de Cantillana | Desde 2020 | Vigente |
| Palio | Banda de Música Guadalrosal | 2009–2012 | Histórico |

La [cronología musical oficial](https://www.hermandaddelcarmen.es/patrimonio-musical/) respalda Virgen de los Reyes, Guadalrosal y la continuidad de la Soledad de Cantillana. Para Pasión de Linares, el modelo comienza en 2022 porque registra estaciones de penitencia efectivamente celebradas: la página oficial rotula el vínculo desde 2021, año sin estación ordinaria, y el corte queda fijado en 2026 conforme a la información editorial recibida y las fuentes periodísticas ya enlazadas.

La cronología publicada no se presenta como catálogo histórico exhaustivo: se incorporaron expresamente Virgen de los Reyes y Guadalrosal, sin convertir el resto de la relación oficial en alcance implícito.

## Fuentes y criterio editorial

Las Fuentes principales son páginas de la propia Hermandad:

- [historia](https://www.hermandaddelcarmen.es/historia/);
- [Cultos](https://www.hermandaddelcarmen.es/cultos/);
- [Nuestra Señora del Carmen](https://www.hermandaddelcarmen.es/nuestra-senora-del-carmen/);
- [Maravillas de María](https://www.hermandaddelcarmen.es/maravillas-de-maria/);
- [Paso del Señor](https://www.hermandaddelcarmen.es/paso-del-senor/);
- [Paso de la Virgen](https://www.hermandaddelcarmen.es/paso-virgen-carmen/);
- [patrimonio musical](https://www.hermandaddelcarmen.es/patrimonio-musical/);
- [Miércoles Santo 2026](https://www.hermandaddelcarmen.es/miercoles-santo-2026/).

La fecha de la salida queda normalizada como **1 de abril de 2026**, Miércoles Santo. La página monográfica contiene una mención interior contradictoria al día 16; se conserva la fecha que coincide con su propio encabezado/calendario y con el calendario litúrgico, sin propagar el error material.

No se incorporó escudo ni fotografía sin un recurso aportado y autorizado. Tampoco se inventaron capataces, horarios detallados o continuidades no verificadas.

## Completitud y deuda legítima

La señal reproducible `brotherhood_completeness` pasa de **43 % a 86 %**. Quedan en falso:

- `crest`: no se ha aportado un recurso gráfico autorizado;
- `music`: el medidor histórico exige una fila en `accompaniments` ligada a una Salida.

La segunda señal no describe un hueco en el lector actual: la ficha pública consume `music_accompaniment_periods` y muestra correctamente la Soledad de Cantillana como formación vigente y los tres periodos finalizados en su histórico. No se duplicó música en una tabla heredada con el único fin de elevar el porcentaje.

## QA de datos y producción

- Supabase: lote `completed`, 83/83, 0 fallos;
- 3 titulares, 2 Pasos, 9 Cultos, 1 Salida y 4 periodos musicales publicados;
- 30 `source_links` del lote, 0 huérfanos;
- 0 periodos musicales duplicados o inválidos;
- ficha pública: HTTP 200, canonical correcto e `index, follow`;
- bloques visibles comprobados: información, titulares, Pasos, música actual, túnica, Salidas, Cultos, histórico musical y Fuentes;
- cronología pública comprobada: Pasión de Linares 2022–2026, Virgen de los Reyes 2013–2020, Guadalrosal 2009–2012 y Soledad de Cantillana vigente desde 2020;
- Vercel: tres lecturas productivas de `/hermandades/carmen-doloroso` respondieron 200 y sin error de aplicación;
- `npm test`: 659/659;
- `next build`: correcto con Next.js 16.3.0 y TypeScript válido;
- `git diff --check`: limpio.

## Restricciones respetadas

No se incorporaron DDL, tablas, migraciones estructurales, cambios RLS, arquitectura, producto o UX. [#492](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) permanece abierta y aislada.

## Cierre

El Carmen queda cerrada como quinto contexto editorial real de HC-016. Solo debe reabrirse ante una regresión, una Fuente material nueva, un recurso visual autorizado o una solicitud editorial concreta.
