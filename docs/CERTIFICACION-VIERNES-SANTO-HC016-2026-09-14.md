# Certificación HC-016 · Viernes Santo de Sevilla

**Fecha:** 14 de septiembre de 2026

**HEAD inicial:** `357360ece01bc8beb7f574d1e6b33643721e66ba`

**Ámbito:** cierre de las siete corporaciones del Viernes Santo mediante un único macrolote DML

## Selección e inventario

Viernes Santo se mantuvo por delante de Jueves Santo tras refrescar el grafo: una ficha cerrada, tres publicadas con deuda nuclear y tres sin ficha suficiente. El alcance definitivo preservó La Carretería; completó El Cachorro, La O, Montserrat y la Sagrada Mortaja; creó la ficha penitencial de San Isidoro y la Soledad de San Buenaventura.

La auditoría evitó reutilizar por nombre la Hermandad letífica de Nuestra Señora de la Salud de San Isidoro. La nueva ficha `hermandad-san-isidoro-sevilla` representa exclusivamente la cofradía sacramental y penitencial de las Tres Caídas y Loreto.

## Resultado

| Lote | Resultado | Composición |
|---|---:|---:|
| `c0160018-0000-4000-8000-000000000001` | 270/270 | 258 insert/upsert · 12 update |
| **Errores** | **0 inválidas** | **0 fallos** |

El lote incorpora o reconcilia 13 titulares, 10 relaciones con Pasos, 19 Cultos, 6 Salidas de 2026, 9 acompañamientos, 12 piezas patrimoniales, 6 acontecimientos y 77 vínculos de Fuente. La séptima Salida, La Carretería, ya estaba publicada y se preservó.

## Incidencia y corrección

El primer postflight detectó nueve relaciones Hermandad–Titular/Paso y una relación Imagen–Paso equivalentes a UUID canónicos anteriores. Se retiraron únicamente los diez enlaces redundantes creados por el lote y se modificó la receta para reutilizar los UUID preexistentes. No se eliminó ninguna entidad ni dato editorial. El replay completo posterior pasó con `ROLLBACK` y el QA final devolvió cero duplicidades relacionales.

## Cobertura final

| Hermandad | Completitud | Hueco legítimo |
|---|---:|---|
| La Carretería | 100 % | Ninguno nuclear |
| El Cachorro | 93 % | Escudo sin licencia incorporada |
| La O | 93 % | Escudo sin licencia incorporada |
| Montserrat | 93 % | Escudo sin licencia incorporada |
| Sagrada Mortaja | 93 % | Escudo sin licencia incorporada |
| Soledad de San Buenaventura | 93 % | Escudo sin licencia incorporada |
| San Isidoro | 86 % | Escudo; música no aplicable porque procesiona en silencio |

Las siete fichas tienen identidad, sede, jornada, titulares, Pasos, Cultos, Salida de 2026 y Fuentes. San Isidoro no recibe una formación ficticia para elevar su porcentaje.

## Fuentes principales

- [Viernes Santo 2026 · horarios y cortejos](https://semanasantaopendata.org/2026/dia/viernes-santo/)
- fichas institucionales del Consejo de [El Cachorro](https://www.hermandades-de-sevilla.org/semanasanta/vs_el_cachorro.html), [La O](https://www.hermandades-de-sevilla.org/semanasanta/vs_la_o.html), [San Isidoro](https://www.hermandades-de-sevilla.org/semanasanta/vs_san_isidoro.html), [Montserrat](https://www.hermandades-de-sevilla.org/semanasanta/vs_montserrat.html), [Sagrada Mortaja](https://www.hermandades-de-sevilla.org/semanasanta/vs_la_mortaja.html) y [Soledad](https://www.hermandades-de-sevilla.org/semanasanta/vs_la_soledad.html)
- webs oficiales de las seis corporaciones trabajadas.

## QA

- 7 corporaciones publicadas y 7 Salidas penitenciales de 2026;
- 0 slugs publicados duplicados;
- 0 huérfanos en Hermandad–Imagen, Hermandad–Paso, Imagen–Paso, Salida–Entidad o acompañamientos;
- 0 relaciones troncales duplicadas;
- 0 contaminación entre San Isidoro penitencial y la Salud letífica;
- 0 continuidad musical inventada para 2027;
- 0 DDL, tablas nuevas o cambios RLS.

Viernes Santo queda cerrado. Jueves Santo permanece en cola, HC-018 continúa bloqueada y `FIRST EDITION FREEZE` sigue activo.
