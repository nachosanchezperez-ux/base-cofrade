# Fechas 2026 de cultos que se repiten cada año · 16/10/2026

Los cultos se guardan en `cults` con una regla («8 de diciembre», «Último viernes de noviembre») y cada año necesitan su edición con fecha en `cult_occurrences`. Sin esa edición no aparecen en la Agenda.

El 16/10/2026 había 74 cultos publicados de octubre a diciembre sin edición de 2026.

## Hecho: 33 borradores (no visibles en la web)

`cultos-fechas-2026.sql`, en estado **draft**; reversión: `cultos-fechas-2026-rollback.sql`. Solo se han creado cuando la fecha es inequívoca:

- **Día fijo en la regla:** «1 de noviembre», «9, 10 y 11 de diciembre», «15 al 18 de diciembre de 2026»…
- **Regla calculable:**
  - «Primer miércoles de noviembre» → 4/11;
  - «Segundo domingo de noviembre» → 8/11;
  - «Último viernes de noviembre» → 27/11;
  - «Tres días previos al 8 de diciembre» → 5–7/12;
  - «Segundo domingo de Adviento» → 6/12 (el primer domingo de Adviento de 2026 es el 29/11).
- **Fecha de 2026 ya escrita en el propio culto:** Vísperas (7/11), Función Principal y Coronación (8/11) y Misa de difuntos (16/11) del Amparo.

Para publicarlos, una vez confirmados: `cultos-fechas-2026-publicar.sql`.

## Pendientes de fecha (requieren la convocatoria de cada hermandad)

Futuros con regla ambigua:
- **Buen Fin:** Triduo a la Palma («Finales de octubre»).
- **La Exaltación:** Triduo a las Lágrimas («Tercera semana de octubre»).
- **El Valle:** Cultos al Cristo de la Coronación («En torno a Cristo Rey»; Cristo Rey es el 22/11).
- **Noviembre, sin día:**
  - Santo Entierro: Triduo a Villaviciosa;
  - El Calvario: Triduo a la Presentación;
  - San Bernardo: Función de Ánimas;
  - Cerro del Águila: Triduo a la Humildad («Primeros días»);
  - Soledad de La Algaba: Triduo al Cristo Yacente.
- **El Carmen:** Triduo («Última semana de noviembre, finalizando el domingo con Función»).
- **Diciembre, sin día:**
  - Trinidad: Triduo, Besamanos y Función de la Esperanza, y Besamanos de la Concepción;
  - El Silencio: cultos de la Concepción;
  - El Museo: Triduo y Función de las Aguas;
  - Cristo de Burgos: Triduo y Función de la Palma;
  - Pastora de Padre Pío: Besamanos.

Además, varios cultos de primeros de octubre ya han pasado. No se les crea edición.
