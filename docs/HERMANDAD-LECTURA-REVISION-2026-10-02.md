# Revisión completa de lectura de Hermandades · 2/10/2026

La revisión anterior certificó estructura y responsive, pero no detectó las
inconsistencias editoriales señaladas por Nacho. Este corte las corrige.

Preflight: main `3b97c4fe4187f64b98e7b26fefbe7cab4c4fad72`; producción
`dpl_BnHKLigg6mq3xdCNTJV4w5HVXbTP` READY; Supabase ACTIVE_HEALTHY.
San Esteban ya forma parte de la cohorte tras #1061; no se revierte ni amplía.
#1019 sigue aparcada y #1020 es independiente. No se modifican datos.

| Fallo observado | Corrección |
|---|---|
| Nombre oficial oculto tras un desplegable | Denominación completa visible en cabecera, sin truncado |
| Dos vestidores cuando hay una persona | Agrupación por ID del autor, conservando los dos enlaces de Titulares y cada periodo |
| «Desde Vigente en 2026» | Se conserva «Vigente en 2026», sin inventar fecha de inicio |
| Miércoles Santo repetido en Sede | Sede y horarios contiene únicamente información de visita |
| Textos auxiliares extensos en Música | Presentación breve con catálogo íntegro |
| Contexto y origen patrimonial idénticos | El mismo texto se muestra una sola vez |
| Túnica con bloque oscuro incoherente | Superficie neutra, ambas variantes e imágenes conservadas |
| Traslado ordinario bajo «Próximas extraordinarias» | Encabezado neutral «Próximas salidas y traslados», sin cambiar el carácter documentado |
| Encabezado de estación duplicado | Se muestra el momento sin añadir otra vez la tipología |

Auditoría de todo el HTML público: cabecera, resumen, guía, Titulares, Pasos,
Historia, Vía Crucis, Música, Patrimonio, Túnica, Salidas, conexiones y Fuentes.
Los hitos de preview y cronología completa se mantienen: representan un
resumen navegable y su archivo, no entidades duplicadas.

Preparación: 1441/1441 tests PASS y build PASS. Tres nuevos tests comprueban
identidad frente a relaciones, homónimos y conservación de vigencia textual.
El runner visual incorpora auditoría de contenido y abre Vestidores, Sede,
Túnica y Salidas en las seis anchuras, además de navegación y Fuentes.

Preview `fa8f6a5c`, deployment `dpl_2QqLZRTq1mJGTBdEQMzHvctJBc2v` READY:
PASS en 390/430/768/1024/1366/1600 px. Nombre completo visible, una persona
y dos Titulares, Sede sin salida repetida, Túnica legible y ambas imágenes
decodificadas, Salidas sin el encabezado contradictorio. Teclado, navegación,
Fuentes y control Gran Poder PASS; cero overflow/IDs duplicados/pageerror.
15 hitos, 39 composiciones y 18 Fuentes preservados. GitHub verify y Vercel
PASS; Supabase Preview skipped al no haber cambios de esquema.

Método: Chromium con respuestas HTTPS servidas por fetch Node con TLS
verificado e hidratación real. Emulación de anchuras, no teléfono físico.
Los screenshots de Túnica comprobaron un contraste heredado insuficiente
durante la primera iteración; el corte certificado ya lo corrige y verifica.
Evidencia estructural: `docs/qa/hermandad-lectura-2026-10-02/preview.json`.

SELECT confirma que las dos relaciones publicadas de Vestidor comparten el
ID `64b7fcf0-376a-40ec-b197-8e2d629ad88b` y «Vigente en 2026». No hay dos
personas duplicadas en Supabase: el error estaba en su presentación.

Main concurrente `abfc9370` incorpora únicamente documentación de Imaginería;
se preserva íntegra. No se cierra por esta revisión la QA general pendiente
de San Esteban ni se altera la cohorte existente.
