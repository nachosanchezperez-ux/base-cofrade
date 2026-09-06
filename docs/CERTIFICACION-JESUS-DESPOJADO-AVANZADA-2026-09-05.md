# Certificación editorial · Jesús Despojado · ficha avanzada

Fecha de corte: **5 de septiembre de 2026**  
Slug: `hermandad-jesus-despojado-sevilla`

## Resultado

La ficha base ya estaba correctamente resuelta. Esta segunda pasada amplía el frente de **devoción, cultos, salidas y música** sin modificar arquitectura, RLS ni experiencia de usuario.

Tras aplicar `20260905235900_amplia_jesus_despojado_devocion_salidas.sql`, la señal reproducible `brotherhood_completeness` debe pasar de **79 % a 100 %**: cultos, salidas y música vinculada a una salida dejan de estar vacíos.

## Aportaciones verificables

- Se incorpora **Nuestra Señora del Mayor Dolor**, talla barroca anónima de finales del siglo XVIII y titular histórica de la capilla, con autoría anónima explícita y fuente oficial.
- Se modelan nueve cultos recurrentes: Quinario, Función Principal, veneraciones de febrero y septiembre, Triduo de Dolores y Misericordia, Vía Crucis, Rosario Vespertino, Triduo del Mayor Dolor y Jubileo Circular.
- Las reglas recurrentes quedan separadas de sus ocurrencias fechadas. Solo se marcan como celebradas las citas que cuentan con crónica oficial posterior.
- Se incorpora la estación de penitencia del **29 de marzo de 2026** y el primer Rosario Vespertino del **4 de octubre de 2025**.
- La Agrupación Musical Virgen de los Reyes se vincula a la salida de 2026 mediante la continuidad `2005–actualidad` publicada por la propia formación.
- La música del Rosario de 2025 se conserva como denominación textual para evitar crear entidades musicales incompletas.

## Actualidad estricta

- No se proyectan horarios de una edición sobre otra: los horarios de 2026 quedan ligados exclusivamente a esa salida.
- Un calendario previo sirve para fechar convocatorias, pero no basta para declarar una celebración. Las ocurrencias marcadas `held` tienen confirmación posterior.
- No se afirma acompañamiento tras el palio en 2026 al no disponer de una confirmación específica suficientemente reciente.
- La fuente de la Agrupación Musical Virgen de los Reyes se usa como continuidad vigente, no como extrapolación histórica genérica.

## Fuentes principales

- [Título y heráldica de la Hermandad](https://jesusdespojado.org/titulo-de-la-hermandad/)
- [Capilla del Mayor Dolor](https://jesusdespojado.org/capilla-mayor/)
- [Quinario a Nuestro Padre Jesús Despojado](https://jesusdespojado.org/quinario-ntro-padre-jesus-despojado/)
- [Triduo a María Santísima de los Dolores y Misericordia](https://jesusdespojado.org/triduo-ma-stma-de-los-dolores-y-misericordia/)
- [Triduo a Nuestra Señora del Mayor Dolor](https://jesusdespojado.org/triduo-ntra-senora-del-mayor-dolor/)
- [Otros cultos](https://jesusdespojado.org/otros-cultos/)
- [Calendario de cultos septiembre 2025–junio 2026](https://jesusdespojado.org/2025/09/14/calendario-cultos-septiembre-2025-junio-2026/)
- [Función Principal Histórica · 2026](https://jesusdespojado.org/2026/02/09/funcion-principal-historica/)
- [Rosario Vespertino · 2025](https://jesusdespojado.org/2025/10/05/rosario-vespertino/)
- [Nuestra Semana Santa · Agrupación Musical Virgen de los Reyes](https://www.virgendelosreyes.es/nuestra-semana-santa/)

## Criterio de cierre

La migración es DML e idempotente: resuelve claves por `slug`, evita duplicados y conserva las fuentes en el mismo modelo relacional. El cierre final requiere CI verde, aplicación en producción y recálculo posterior de inventario, duplicados, fuentes y señales de completitud.
