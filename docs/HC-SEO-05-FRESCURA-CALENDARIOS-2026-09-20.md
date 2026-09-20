# HC-SEO-05 · Frescura temporal de Agenda y Extraordinarias

Fecha de corte: 20 de septiembre de 2026.

## Diagnóstico

Agenda Cofrade ya calculaba el año visible, pero lo hacía al cargar el módulo. Extraordinarias mantenía `2026` fijado en cinco superficies distintas:

- título y descripción SEO;
- métricas de la cabecera;
- filtro de las citas que alimentaban los accesos mensuales;
- encabezado de la navegación por meses;
- bloque de coronaciones.

La consecuencia más importante no era solo una futura metadata obsoleta: una salida anunciada para 2027 podía aparecer en el calendario interactivo, pero quedaba fuera de los enlaces editoriales servidos debajo del directorio por no pertenecer a 2026.

## Cambio

- `lib/seo-calendar.js` centraliza el año de `Europe/Madrid` y el copy SEO anual de Agenda y Extraordinarias.
- Ambas páginas generan metadata y contenido estructurado desde la misma fuente temporal.
- Extraordinarias conserva el recuento documental del año vigente, pero sus accesos mensuales incluyen todas las citas próximas aunque crucen de temporada.
- Los encabezados editoriales dejan de fijar un año cuando el bloque puede contener varios ejercicios.
- Canonical, `CollectionPage`, breadcrumbs y las fichas `Event` existentes permanecen intactos.

## Validación local

- Pruebas focalizadas: 12/12.
- Suite completa: 1.000/1.000.
- Prueba de frontera temporal: Madrid sigue en 2026 a las `22:30Z` del 31 de diciembre y pasa a 2027 a las `23:30Z`.
- `next build`: correcto con Next.js 16.3.0; Agenda y Extraordinarias conservan ISR de cinco minutos.
- Smoke HTTP:
  - `/agenda-cofrade`: 200, HTML, canonical y título anual correctos;
  - `/extraordinarias`: 200, HTML, canonical y título anual correctos;
  - ambas páginas mantienen un único H1.

## Puertas de preview

1. Confirmar títulos, canonical y JSON-LD con el año de Madrid.
2. Verificar que una cita futura del ejercicio siguiente aparece en el calendario y en los accesos mensuales.
3. Confirmar que el recuento «documentadas en» sigue limitado al año vigente.
4. Revisar CI, Vercel y runtime.
5. No fusionar ni desplegar a producción sin autorización explícita.

## Siguiente corte

HC-SEO-06 debe revisar la profundidad de enlace y el contenido único de las restantes colecciones grandes —Bandas, Pasos e Imágenes— usando los sitemaps segmentados como línea de medición.
