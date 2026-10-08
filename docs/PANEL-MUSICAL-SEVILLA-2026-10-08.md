# Panel musical: Sevilla capital · 8 de octubre de 2026

Petición y cierre funcional en PR #1116. Base de integración d6973c15bfb2050384c791bb58fbca5c212336de. No sustituye al seguimiento de #1110 ni a los frentes del directorio.

## Presentación

La entrada sin filtros prioriza Sevilla capital y el archivo de 2026. La provincia y el conjunto siguen disponibles. En capital se muestran bandas, jornadas (con vísperas) y posiciones. Pasos, cruz de guía y posiciones imprecisas suman el total. La condición juvenil es transversal: se filtra únicamente por menciones explícitas; sin mención no equivale a formación adulta. No se fusionan ni se inventan entidades juveniles.

Los filtros de jornada, posición y mención juvenil se aplican antes de estadísticas, ranking, tabla y CSV. La tabla incluye todos los registros filtrados en su exportación, no solamente la página visible. Se conserva la metodología temporal y territorial del lector público. Las fuentes de los contratos no se deducen de una gráfica.

## Primera revisión editorial aplicada

Se han estructurado cinco horizontes contractuales que ya figuraban en las notas. Se conserva el inicio histórico, `is_current=true`, identidad, posición, fechas exactas, notas y restantes registros. `year_to` expresa la cobertura documentada del acuerdo, no una ruptura anunciada. No se generan cambios de banda ficticios.

| Hermandad | Banda | Periodo existente | Horizonte documentado | Fuente |
|---|---|---|---:|---|
| Torreblanca | La Sentencia de Jerez | 231fa231-7537-43ea-a1d8-58400e52a800 | 2028 | https://amlasentencia.com/renovacion-%C2%B7-cautivo-de-torreblanca/ |
| Dulce Nombre de Bellavista | Santa Ana de Dos Hermanas | 34e7392b-e433-4807-8645-3a7658fc53d3 | 2027 | https://www.diariodesevilla.es/semana_santa/bellavista-cuatro-anos-mas-santa-ana-dos-hermanas_0_1840617594.amp.html |
| La Estrella | Rosario de Cádiz | 7fb4405e-61c1-4450-b2ff-d5713e6d395b | 2029 | https://www.diariodesevilla.es/semana_santa/estrella-firma-renovacion-rosario-cadiz_0_2005214544.html |
| Las Siete Palabras, palio | Carmen de Villalba | 168e903b-09ce-41aa-a451-47599fcb9d7d | 2027 | https://siete-palabras.com/renovacion-de-la-banda-de-musica-de-nuestra-senora-del-carmen-hasta-2027/ |
| La Paz | La Puebla del Río | 9d5bab12-c743-4fde-a2cb-93e6c00137eb | 2027 | https://www.gentedepaz.es/la-banda-municipal-de-la-puebla-renueva-su-compromiso-musical-con-la-hermandad-de-la-paz-para-el-domingo-de-ramos-de-2027/ |

Operación: ensayo transaccional con ROLLBACK, lectura posterior de los cinco `year_to=null`, aplicación con guardas por ID de hermandad, banda, jornada, inicio, fechas y territorio. Comparación de todas las filas antes/después dentro de la transacción: exactamente cinco cambios, únicamente horizonte y marca temporal; número total de periodos inalterado (554). Se añadieron dos fuentes y sus dos enlaces a los periodos (Bellavista y fuente oficial de Siete Palabras); el resto de evidencias ya estaban vinculadas. Sin DDL persistente, RLS, permisos ni cambios de bandas. No repetir la operación sin nuevo preflight: las guardas impiden volver a aplicarla sobre valores ya actualizados.

## Cobertura pendiente

El archivo previo de capital contenía 142 acompañamientos y 53 bandas para 2026; en 2027, 12 acompañamientos identificados y 128 vínculos pendientes. Esta primera revisión debe trasladar cinco pendientes al avance sin cambiar 2026: 17 identificados y 123 pendientes de capital, sujeto a lectura pública posterior y posibles ediciones concurrentes. No representa un censo completo de Sevilla ni permite interpretar una caída interanual. Fuera de la capital no se han cambiado contratos.

Persisten casos a contrastar, entre ellos renovaciones de San Gonzalo, Cruz Roja con Redención, los Gitanos Juvenil con Baratillo y Virgen de los Reyes con San Esteban. No se ha alterado su vigencia basándose solamente en la redacción de las notas. La auditoría por jornadas se exporta en `capital-audit.json` en la revisión automatizada.

## Verificación

Primer candidato: 1.535 pruebas y build correctos. La matriz visual inicial no detectó desbordamiento, pero seis recorridos se detuvieron por un selector de prueba que omitía el contador del nombre accesible del botón. Se corrige el selector y se repite la matriz completa, sin suprimir errores del navegador ni relajar la aserción de interacción.

El workflow `qa-music-capital.yml` compila primero la candidata exacta; después utiliza una copia identificada del archivo público en un adaptador exclusivo del runner para revisar el componente compilado. No añade credenciales al cliente. Artefacto `music-capital-review`: pruebas, builds, captura del corte, auditoría por jornadas, veinte vistas (Chromium y WebKit), seis recorridos completos y capturas. El resultado final y la comprobación pública de publicación se anotan en PR #1116. Las imágenes son de la revisión aislada, no de un iPhone físico ni de una sesión interactiva real de producción.
