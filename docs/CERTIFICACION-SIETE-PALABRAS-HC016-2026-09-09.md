# Certificación editorial · Las Siete Palabras · HC-016 · 9 de septiembre de 2026

## Resultado

**LAS SIETE PALABRAS → SÉPTIMO LOTE HC-016 COMPLETADO · 270/270 · INDEXABLE · GRAFO PÚBLICO AMPLIADO.**

Base Git y producción previa al cierre documental: `0ad710917cb2e8bd3389a72e540c9489f1979788` · deployment `dpl_6yENBXa8Gbw9K1VqxTFmRMqj3un1` · `READY`.

Lote aplicado: `c0160007-1000-4000-8000-000000000001`.

## Selección y alcance

El grafo se recalculó después del cierre de Cristo de Burgos. El TOP 3 fue Las Siete Palabras, El Valle y Montserrat. Las Siete Palabras quedó primera por combinar una completitud inicial del **43 %**, una web oficial profunda y un grafo singularmente denso: cinco raíces históricas fusionadas, cuádruple naturaleza corporativa, numerosos titulares, tres pasos penitenciales, una procesión de Gloria y un patrimonio material y musical explícitamente inventariado.

Se trabajó una sola Hermandad y se mantuvo `FIRST EDITION FREEZE`: el lote es exclusivamente DML editorial sobre el modelo vigente. No se incorporaron fotografías, escudo, itinerarios no comprobados ni catálogos inferidos.

## Preflight y ejecución

| Familia | Filas |
|---|---:|
| Fuentes | 13 |
| Entidades | 53 |
| Perfiles de agentes | 10 |
| Hermandad | 1 |
| Imágenes | 12 |
| Relaciones Hermandad–Imagen | 12 |
| Autorías y relaciones de autor | 23 |
| Pasos | 4 |
| Relaciones Hermandad–Paso e Imagen–Paso | 13 |
| Hábito | 1 |
| Cultos | 16 |
| Salidas y participantes | 6 |
| Patrimonio | 27 |
| Periodos musicales | 5 |
| `source_links` | 74 |
| **Total** | **270** |

- validación estructural: 270 válidas, 0 errores y 0 colisiones;
- plan material: 252 insert y 18 update;
- simulación transaccional completa: correcta, seguida de `ROLLBACK` y control de 0 residuos;
- Apply real atómico: 270 aplicadas, 0 inválidas y 0 fallos;
- lote y resultados registrados en `bulk_imports`, `bulk_import_items` y `audit_log`.

## Inventario certificado

- identidad, denominación oficial, historia, sede, web, Miércoles Santo y naturaleza penitencial, sacramental, gloriosa y de ánimas;
- 12 imágenes publicadas: los cinco titulares con página propia y los siete reunidos por la Hermandad bajo «Otros Titulares»;
- 11 autorías documentadas o atribuidas y una autoría anónima expresamente conservada como desconocida;
- 4 Pasos publicados: Divina Misericordia, misterio de las Siete Palabras, palio de la Cabeza y paso procesional del Rosario;
- 9 relaciones Imagen–Paso publicadas;
- hábito nazareno completo;
- 16 Cultos recurrentes del calendario oficial 2026-2027;
- Estación de Penitencia de 2025, acreditada como celebrada, y procesión del Rosario de 2026, conservada como anunciada;
- 27 piezas patrimoniales: 9 conjuntos materiales destacados y 18 composiciones musicales inventariadas oficialmente;
- 5 periodos musicales publicados y enlazados con sus pasos cuando el paso correspondiente existe;
- 74 nuevos vínculos de Fuente, además de conservar los dos enlaces directos preexistentes de historia y Nuestra Señora de la Cabeza;
- 0 borradores nucleares y 0 duplicados activos de titulares, Pasos o periodos musicales.

## Cronología musical

| Paso o salida | Formación | Periodo | Estado |
|---|---|---:|---|
| Divina Misericordia | Quinteto de metal de la Agrupación Musical Virgen de los Reyes | Vigente en 2026 | Vigente |
| Misterio | Esencia | Desde 2011 | Vigente |
| Palio | Carmen de Villalba | Desde 2016; renovada hasta 2027 | Vigente |
| Rosario | Maestro Tejera | Relación anual vigente | Vigente |
| Misterio | Presentación al Pueblo | 1992–2006 | Histórico |

La página oficial del [cortejo](https://siete-palabras.com/cortejo/) identifica los tres acompañamientos penitenciales actuales. Los periodos ya existentes de Esencia y Carmen de Villalba se conservaron y se enlazaron a sus nuevos Pasos; el primer paso incorpora el quinteto de metal de Virgen de los Reyes. La relación gloriosa de Maestro Tejera y el periodo histórico de Presentación al Pueblo no se reescribieron: solo se resolvió su vínculo con el Paso correspondiente.

## Fuentes y criterio editorial

La investigación descansa de forma prioritaria en la web de la propia Archicofradía:

- [historia y fusiones](https://siete-palabras.com/historia/);
- fichas del [Señor de la Divina Misericordia](https://siete-palabras.com/nuestro-padre-jesus-de-la-divina-misericordia/), [Cristo de las Siete Palabras](https://siete-palabras.com/santisimo-cristo-de-las-siete-palabras/), [Nuestra Señora de la Cabeza](https://siete-palabras.com/nuestra-senora-de-la-cabeza/), [María Santísima de los Remedios](https://siete-palabras.com/maria-santisima-de-los-remedios/) y [Nuestra Señora del Rosario](https://siete-palabras.com/nuestra-senora-del-rosario/);
- [otros titulares](https://siete-palabras.com/otros-titulares/);
- [Pasos](https://siete-palabras.com/pasos/), [cortejo](https://siete-palabras.com/cortejo/) y [patrimonio musical](https://siete-palabras.com/patrimonio-musical/);
- [información del Miércoles Santo de 2026](https://siete-palabras.com/informacion-de-interes-para-el-miercoles-santo-y-la-semana-santa/);
- [calendario de Cultos 2026-2027](https://siete-palabras.com/calendario-de-cultos-2026-2027/);
- [memoria del Miércoles Santo de 2025](https://siete-palabras.com/miercoles-santo-2025/).

La propia fuente oficial mantiene como desconocidas la autoría y la fecha exacta de Nuestra Señora del Rosario; el lote conserva esa incertidumbre. La Virgen de la Cabeza de Gloria se registra como atribuida a Roque de Balduque, no como autoría documentada. Tampoco se transformó en hecho celebrado la procesión del Rosario del 1 de noviembre de 2026: permanece `announced` porque, en la fecha de corte, es futura.

## Completitud y deuda legítima

La señal reproducible `brotherhood_completeness` pasa de **43 % a 86 %**. Quedan en falso:

- `crest`: no existe un recurso gráfico autorizado cargado;
- `music`: el medidor heredado exige una fila en `accompaniments` ligada a una Salida.

La segunda señal no representa una carencia pública: la ficha consume `music_accompaniment_periods` y muestra los cuatro acompañamientos vigentes y el histórico. No se duplicó información en una tabla heredada para elevar artificialmente el porcentaje.

## QA de datos y producción

- Supabase: lote `completed`, 270/270, 0 inválidas y 0 fallos;
- 12 imágenes, 4 Pasos, 1 hábito, 16 Cultos, 2 Salidas, 27 piezas patrimoniales y 5 periodos musicales publicados;
- 74 `source_links` del lote;
- 0 borradores en relaciones nucleares, Cultos, Salidas o música;
- 0 duplicados activos de titulares, Pasos o periodos musicales;
- ficha pública: HTTP 200, canonical correcto e `index, follow`;
- bloques visibles comprobados: titulares, Pasos, música actual, túnica, Salidas, Cultos, patrimonio, histórico musical y Fuentes;
- Vercel: deployment de producción `READY` y 0 errores de ejecución para `/hermandades/siete-palabras-sevilla` en la ventana de comprobación;
- `npm test`: correcto;
- `next build`: correcto con Next.js 16.3.0 y TypeScript válido;
- `git diff --check`: limpio.

## Restricciones respetadas

No se incorporaron DDL, tablas, migraciones estructurales, cambios RLS, arquitectura, producto o UX. [#492](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) permanece abierta y aislada.

## Cierre

Las Siete Palabras queda cerrada como séptimo contexto editorial real de HC-016 y como el lote individual más amplio ejecutado después de San Pablo. Solo debe reabrirse ante una regresión, una fuente material nueva, un recurso visual autorizado o una solicitud editorial concreta.
