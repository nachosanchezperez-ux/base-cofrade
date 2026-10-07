# Acompañamientos musicales · QA visual e interactiva

Corte: 7 de octubre de 2026, 16:40–16:43 UTC.

## Resultado

**Lectura responsive y recorridos funcionales comprobados. Observación técnica abierta en #1110; no se certifica una ejecución sin errores de consola.**

Se inspeccionó la página pública real `https://hilocofrade.es/acompanamientos-musicales`, no una maqueta, HTML inyectado ni una respuesta simulada. Producción de referencia: `bb967bc7103ceba3b4df2e1a59b463976cbab310`, despliegue `dpl_BpH4kBCRx5Rjfv1fKAUG31D1KTbq`.

No se encontró una incidencia visual o funcional que justificase modificar la aplicación. Esta revisión solo añade pruebas y evidencia en una rama independiente; no cambia producción, datos, contratos, migraciones, permisos ni dependencias de la aplicación.

## Matriz de lectura

| Motor | Anchuras CSS | Temporadas | Casos |
| --- | --- | --- | ---: |
| Chromium | 320, 390, 430, 768, 1024, 1366, 1600 px | 2026 y avance 2027 | 14 |
| WebKit | 390, 430, 768 px | 2026 y avance 2027 | 6 |

En los **20 casos** coinciden el ancho del documento y el espacio de pantalla; no se detectó desplazamiento horizontal con los detalles cerrados o abiertos. La misma comprobación pasa con el archivo pendiente abierto en 2027. Los controles de texto conservan 16 px y una altura de al menos 44 px. Hay capturas reales de cabecera, resumen, acompañamientos y archivo pendiente.

Las capturas representativas se revisaron visualmente: disposición móvil apilada, tabla en escritorio, etiquetas de territorio, nombres largos y lectura del detalle. Las capturas finales rechazan las cookies opcionales mediante su control visible; no se elimina el aviso con CSS ni se altera el contenido.

## Diez recorridos funcionales completados

Chromium a 390 y 1366 px, ambas temporadas; WebKit a 390, 430 y 768 px, ambas temporadas. En cada recorrido se comprueban búsqueda y formación combinadas, ordenación, detalle abierto, limpieza, estado sin resultados, recuperación, orden por capital/provincia/total, apertura con Enter y cierre con Espacio y navegación real a una ficha de banda. Los recorridos iniciados en 2026 comprueban además 2026 → 2027 → 2026.

`Limpiar` vacía búsqueda y formación, recupera el orden A–Z y conserva la temporada elegida. El control del desglose muestra foco visible de 2 px. Esto no equivale a una auditoría completa con lector de pantalla.

Ejemplos verificados:

- Las Cigarreras + Banda de Música + 2026: una fila de María Santísima de la Victoria, **5 capital + 1 provincia = 6**, seis acompañamientos en su detalle.
- Santa Ana + Banda de Música + avance 2027: una fila, **3 capital + ninguno identificado en provincia = 3**, tres acompañamientos en el detalle. El guion no significa que se haya certificado la ausencia de contratos provinciales.

## Integridad de cifras mostradas

| Temporada | Capital | Resto de la provincia | Total | Bandas incluidas |
| --- | ---: | ---: | ---: | ---: |
| 2026 | 142 | 176 | 318 | 139 |
| Avance 2027 | 12 | 48 | 60 | 44 |

En todos los casos se verifica capital + provincia = total, suma de filas = totales generales, y longitud de cada detalle = total de su banda. El archivo pendiente contiene **190 vínculos en 70 bandas**: abrirlo no altera las filas ni las sumas anteriores. El avance sigue sin presentarse como censo completo de 2027.

## Observación WebKit, sin ocultación

La ejecución estricta termina **14 casos sin avisos y 6 casos WebKit con avisos**, aunque los **20 controles de lectura y los 10 recorridos funcionales se completan**. La carga inicial aislada de cada caso no genera `pageerror`; los mensajes aparecen durante los recorridos de navegación y las peticiones RSC muestran cancelaciones `Load request cancelled`. No se capturaron respuestas HTTP >=400 en esa ejecución.

El mensaje `due to access control checks` no se utiliza por sí solo para diagnosticar una configuración CORS incorrecta. Se conserva el hallazgo y la necesidad de separar las cancelaciones esperadas por cambio de documento de cualquier fallo real en [#1110](https://github.com/nachosanchezperez-ux/base-cofrade/issues/1110). No se ha añadido una lista de excepciones para poner artificialmente en verde la ejecución ni se ha debilitado ningún control de seguridad.

## Trazabilidad

- Rama de QA: `qa/acompanamientos-responsive-20261007`.
- Código ejecutado: `3c3d5b69589bd0d593f21feac3284a18daed952c`.
- [Ejecución final y diagnóstico](https://github.com/nachosanchezperez-ux/base-cofrade/actions/runs/37653751735).
- Artifact temporal: `acompanamientos-responsive-evidence`, ID `11497173187` (retención de un día).
- SHA256 del ZIP original: `4a830d98e4b549a063e867254e06e897217610d050964389ebf556d17a4542ff`.
- La ejecución anterior `37652643317` conserva los resultados previos. La primera `37651918981` detectó un error del lector de la prueba: extraía el año 2027 de la etiqueta accesible del cero. Se corrigió el lector, no la aplicación.
- Los informes JSON y las capturas se han recuperado como archivos de esta conversación. El resultado se anota también en #1104, referencia de cierre indicada en el estado canónico.

## Límites

Playwright 1.57.0 en Ubuntu 24.04, contextos de navegador independientes, idioma es-ES y zona Europe/Madrid. Es emulación en Chromium/WebKit, no prueba en un iPhone físico ni en la versión comercial de Safari. No se ha repetido la suite de 1.500 pruebas unitarias ni la compilación en esta tarea, ya que el código de aplicación no se ha modificado. La observación #1110 queda abierta.
