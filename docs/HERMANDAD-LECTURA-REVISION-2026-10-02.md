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

La comprobación visual sobre preview queda pendiente hasta completar el runner.
