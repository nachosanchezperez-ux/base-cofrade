# Autores · Imaginería · cierre del primer lote

**CERRADO Y CERTIFICADO CON QA RESPONSIVE EMULADA.** Las nueve inserciones de #1063 permanecen confirmadas: siete principales Escultura y dos enlaces directos de Fuentes. No se reejecutó DML ni se modificó el diseño durante esta comprobación.

El usuario autorizó explícitamente Playwright respondiendo «sí» a la comprobación del directorio, siete fichas y Fuentes en 320, 390, 430 y 768 px. Se completa la puerta pendiente del [postflight de aplicación](./AUTORES-IMAGINERIA-APLICACION-2026-10-02.md).

## Matriz completada

| Ancho | Directorio | Siete fichas | Fuentes en siete fichas | Navegación de categorías | Desbordamiento horizontal |
|---|---|---|---|---|---|
| 320 px | PASS | 7/7 PASS | 7/7 abre/cierra | PASS | 0 |
| 390 px | PASS | 7/7 PASS | 7/7 abre/cierra | PASS | 0 |
| 430 px | PASS | 7/7 PASS | 7/7 abre/cierra | PASS | 0 |
| 768 px | PASS | 7/7 PASS | 7/7 abre/cierra | PASS | 0 |

**32 vistas y 4 recorridos de navegación; 36 resultados PASS.** Los recorridos usan enlaces reales: Imaginería → Patrimonio → Imaginería, incluida la categoría al final del carril, y la entrada a Illanes desde su tarjeta. Las fichas verificadas son Ortega Bru, Santos Rojas, Pedro Roldán, Illanes, Álvarez Duarte, Juan de Mesa y Juan de Astorga.

En cada ficha se exige un H1, Escultura como principal, fuentes visibles al abrir el desplegable, filas dentro del ancho y cierre funcional. En Illanes y Álvarez Duarte se comprueba además el href oficial exacto y apertura prevista en nueva pestaña. Se verifica la interfaz y el destino del enlace; no se certifica aquí el contenido remoto de esas páginas oficiales.

No hay errores de página ni fallos en las peticiones GET verificadas que alimentan la matriz. `document.fonts.ready` se espera antes de capturar y medir. Se guardaron **40 capturas**, incluidas ocho de los dos bloques de Fuentes nuevos; se inspeccionaron visualmente capturas representativas de cabecera, identidad, directorio, nombres y Fuentes en los cuatro anchos. El informe completo entregado es `Hilo-Cofrade-Imagineria-QA-Responsive-20261002.html`, con capturas embebidas.

## Método y límites

Playwright con Chromium Headless Shell 151, viewport real por anchura; emulación móvil/táctil en 320/390/430 y viewport de tableta con tacto en 768. La descarga automática llegó incompleta; el paquete oficial alternativo de Chrome for Testing se descargó íntegro y pasó la comprobación ZIP antes de ejecutarse.

La navegación HTTPS directa de Chromium falló por `ERR_CERT_AUTHORITY_INVALID` en el entorno. Se usaron respuestas GET y recursos de producción obtenidos por un transporte HTTPS con validación de certificados, sirviéndolos a Playwright mediante interceptación de peticiones. Se conservaron HTML, CSS, JavaScript, fuentes y cabeceras de navegación RSC; no se alteró el DOM o CSS para forzar el resultado. No se usó `ignoreHTTPSErrors` ni se desactivó la validación TLS. Peticiones de escritura y destinos ajenos a los recursos del sitio quedaron fuera del transporte de prueba.

Esto certifica la presentación y los recorridos responsive **emulados**. No equivale a prueba en teléfono físico, Safari/iOS, ni navegación HTTPS móvil directa desde este navegador. El escritorio productivo de 1363 px ya pasó en #1063. Los límites están preservados, sin convertirlos en un PASS de hardware no comprobado.

## Actualidad e integridad

Main actualizado a `89d7b0ed80361ef00bc3b4cb42d924a86b4b7926`; producción `dpl_3mg1ENHyY4jf9QGVjeQUh399c8rj` READY. Los cambios desde #1063 pertenecen a la lectura de Hermandades y no modifican el código de Autores; se conservaron al actualizar el estado canónico. No se mezcla esta certificación con la QA general de San Esteban.

Consulta independiente de Supabase durante la QA: **7 principales Escultura y 2 enlaces del lote presentes**. El postflight anterior mantiene integridad de diez tablas, once rutas públicas, SEO, JSON-LD, enlaces y ambos sitemaps: 422 autores elegibles y 83 Imaginería; las capturas y navegación conservan esas cifras. No hay nuevas escrituras de contenido, migraciones ni cambios de permisos.

## Evidencia y continuidad

- [Matriz y resultados completos](./evidence/autores-imagineria-responsive-20261002.json).
- [Aplicación e integridad del lote](./AUTORES-IMAGINERIA-APLICACION-2026-10-02.md).
- [Inventario y deudas originales](./AUTORES-IMAGINERIA-AUDITORIA-2026-10-01.md).

El cierre corresponde al primer lote de nueve INSERT, no a la normalización de los 83 perfiles. Buiza, posibles identidades coincidentes, atribuciones y deuda documental de otros candidatos siguen pendientes. No fusionar ni promover certezas automáticamente. Vestidores y Restauración permanecen cerrados; ninguna operación anterior se repite y no se abre otra categoría en esta orden.
