# Certificación HC-016 · Jueves Santo de Sevilla

**Fecha:** 14 de septiembre de 2026

**HEAD inicial reconciliado:** `bbfa0adc5592f802df3409f6e0f2baec114a12a7`

**Ámbito:** cierre de las siete corporaciones del Jueves Santo mediante un único macrolote DML

## Selección e inventario

Después de cerrar Viernes Santo, Jueves Santo era la única jornada ordinaria de la Semana Santa de Sevilla sin certificación transversal. El inventario preservó Los Negritos y El Valle; remató Las Cigarreras y la Quinta Angustia; y promovió desde nodos parciales La Exaltación, Monte-Sión y Pasión.

El lote reutiliza los pasos y bandas ya existentes y mantiene separados Pasión y Pasión y Muerte, la Virgen del Valle de Sevilla y la patrona de Écija, y el Cristo de la Salud de Monte-Sión respecto de sus homónimos.

## Resultado

| Lote | Resultado | Composición |
|---|---:|---:|
| `c0160019-0000-4000-8000-000000000001` | 223/223 | 206 insert/upsert · 17 update |
| **Errores** | **0 inválidas** | **0 fallos** |

El lote incorpora o reconcilia siete titulares, seis Pasos, diecinueve Cultos, cinco estaciones de penitencia de 2026, ocho acompañamientos, diez piezas patrimoniales, cinco hitos y sesenta vínculos de Fuente. Las salidas y relaciones ya certificadas de Los Negritos y El Valle se preservaron. También se publicaron, sin duplicarlas, las participaciones de la Quinta Angustia y Pasión en los Vía Crucis del Consejo de 1996 y 1981.

## Fuentes principales

- [Jueves Santo 2026 · horarios e itinerarios](https://cadenaser.com/andalucia/2026/04/02/las-hermandades-del-jueves-santo-estaran-15-minutos-mas-en-carrera-oficial-radio-sevilla/)
- fichas institucionales del Consejo de [La Exaltación](https://www.hermandades-de-sevilla.org/semanasanta/js_la_exaltacion.html), [Las Cigarreras](https://www.hermandades-de-sevilla.org/semanasanta/js_columna_y_azotes.html), [Monte-Sión](https://www.hermandades-de-sevilla.org/semanasanta/js_montesion.html), [Quinta Angustia](https://www.hermandades-de-sevilla.org/semanasanta/js_la_quinta_angustia.html) y [Pasión](https://www.hermandades-de-sevilla.org/semanasanta/js_pasion.html)
- webs oficiales de las cinco corporaciones trabajadas.

## QA

- 7 corporaciones publicadas y clasificadas como Jueves Santo;
- las 7 fichas públicas y el directorio responden 200;
- titulares, Pasos, Cultos, Salidas, patrimonio y Fuentes visibles en las cinco fichas intervenidas;
- 0 slugs duplicados, 0 huérfanos y 0 contaminación entre homónimos;
- el paso del Señor de Pasión permanece sin música inventada;
- suite completa vigente: 764/764 pruebas superadas;
- build de producción y TypeScript: correctos;
- 0 DDL, tablas nuevas o cambios RLS.

Huecos legítimos: escudos o fotografías sin licencia reutilizable, catálogos patrimoniales no exhaustivos y datos volátiles no publicados oficialmente. No bloquean el cierre.

Jueves Santo queda cerrado. No se abre otra jornada, HC-018 continúa bloqueada y `FIRST EDITION FREEZE` sigue activo.
