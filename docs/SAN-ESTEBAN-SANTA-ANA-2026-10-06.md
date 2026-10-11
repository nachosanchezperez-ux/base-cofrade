# San Esteban · Las Cigarreras → Santa Ana · 2027

## Estado

**6 de octubre de 2026 · Cambio de datos cerrado; listado y aviso publicados y verificados.**
La incorporación responde a la petición expresa de añadir el relevo de Las Cigarreras
por Santa Ana en San Esteban a Cambios musicales 2027.

El `main` de partida es `1a07677d0d65b1e14b14d69e1341d340b54163fe`
(#1101, recorrido del Pilar); producción `dpl_6jpp6oWEpnTivwTTHSRrVPEvbPms`
está **READY**. La presentación de Cambios musicales (#1100) y Novedades (#1098)
ya están integradas y publicadas. Este corte solo modifica datos editoriales:
sin DDL, migraciones de esquema, cambios RLS, interfaz ni salidas concretas.

## Relación incorporada

| Campo | Resultado |
| --- | --- |
| Hermandad | San Esteban · Sevilla · Martes Santo |
| Paso | Palio de María Santísima Madre de los Desamparados |
| Acompañamiento anterior | Banda de Música María Santísima de la Victoria (Las Cigarreras) |
| Periodo saliente | `18ca9f4a-7c87-4f2d-b5eb-27b6bdd4734c` · **2009–2026** · publicado, `is_current = false` |
| Nuevo acompañamiento | Banda de Música Santa Ana de Dos Hermanas |
| Periodo entrante | `30d8477f-79ce-423d-8b36-d9366b37bf48` · **desde 2027**, sin año final · publicado, `is_current = true` |
| Posición | Tras el paso de palio |
| Cambios elegibles de Sevilla y provincia | **43 → 44** |

Se conserva el ID y el inicio de 2009 del periodo de Las Cigarreras. El cierre añade
el final de 2026 y su documentación, sin borrar ni reconstruir el histórico previo.
Santa Ana se registra como acompañamiento próximo durante 2026; la duración del
contrato no se fija porque la fuente consultada no la precisa. Las salidas y sus
posiciones y asignaciones musicales permanecen intactas.

## Fuente y trazabilidad

Fuente: [noticia de Nacho Sánchez en El Pespunte, 6 de octubre de 2026](https://www.elpespunte.es/articulo/cofrade/apuesta-san-esteban-santa-ana-reordena-mapa-musical-martes-santo/20261006104411155178.html).
Se incorpora una fuente, con dos enlaces a los periodos musicales y uno a la
Hermandad. Solo se documenta el acuerdo de San Esteban; las posibilidades sobre
otras Hermandades mencionadas en la noticia no se convierten en relaciones.

- [Operación SQL](./operations/SAN-ESTEBAN-SANTA-ANA-2026-10-06.sql), fuera de la cadena de migraciones activas.
- [Evidencia de ejecución y verificación](./evidence/SAN-ESTEBAN-SANTA-ANA-2026-10-06.json).

## Verificación

El ensayo terminó en **ROLLBACK, con cero residuos**. Apply terminó correctamente;
las guardas comprobaron identidades, tipos, clasificación, huella del periodo
saliente, ausencia de un relevo duplicado, incremento de una fila y enlaces de
documentación. Los fingerprints verificaron la conservación de los otros periodos,
salidas, posiciones y asignaciones musicales de San Esteban. Las **28 pruebas
relacionadas** pasaron.

El listado y el aviso de Novedades derivan del periodo entrante; no se crea un aviso
separado. El aviso utiliza la fecha de incorporación del registro, mientras el
contenido identifica el Martes Santo de 2027. La caché del listado es de 300 segundos
y la de Novedades de 60 segundos.

El postflight público confirma:

| Superficie | Resultado |
| --- | --- |
| Listado de Cambios musicales | **44 cambios, 39 corporaciones y 34 bandas entrantes** |
| San Esteban | **2026: Las Cigarreras → 2027: Santa Ana**, con enlaces correctos al Paso y a ambas Bandas |
| Novedades | Primer aviso del panel, exactamente uno para el periodo entrante |
| Navegación desde el aviso | El clic lleva al ancla correcta del cambio |
| Ficha de San Esteban | Histórico **2009–2026** y nueva fuente correctos |
| Ficha de Santa Ana | **PASS** tras recarga natural: San Esteban aparece en **Próximas vinculaciones · 2027**, Martes Santo, desde 2027, Sevilla, con el palio de Madre de los Desamparados y la nota de sucesión correcta |

El destino público verificado es
[/semana-santa/2027/cambios-musicales#cambio-30d8477f-79ce-423d-8b36-d9366b37bf48](https://hilocofrade.es/semana-santa/2027/cambios-musicales#cambio-30d8477f-79ce-423d-8b36-d9366b37bf48).

El listado se renovó por su mecanismo de caché habitual. No se acredita una purga:
el intento de Vercel devolvió `404 CDN Cache Namespace not found`.
La [ficha de Santa Ana](https://hilocofrade.es/bandas/banda-musica-santa-ana-dos-hermanas)
quedó verificada en navegador después de su recarga natural, cerrando la comprobación
que inicialmente había devuelto la caché anterior. No se repitió el DML.

Las PR #1097, #1086, #1020 y #1019 quedan preservadas y fuera de alcance. No reejecutar
la operación: el SQL bloquea su repetición cuando detecta el periodo futuro.
