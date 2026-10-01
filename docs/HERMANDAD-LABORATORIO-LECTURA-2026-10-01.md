# Laboratorio de lectura de Hermandades · 1/10/2026

## Preflight verificado

- main y producción: `a993ca20e4402cdfcdede1ec7e94be043bcc299f`.
- Producción Vercel: `dpl_Dq6rTjTVKMWhjDDvQFxJu3hTdpLZ`, READY.
- Supabase: ACTIVE_HEALTHY. Sin escrituras, migraciones ni cambios de permisos.
- Últimos merges: #1049 (recorridos), #1048 (repertorios), #1047 (primer plegado), #1046 (editorial).
- PR abiertas: #1050 buscador; #1020 rendimiento de portada; #1019 Pastora de Marchena aparcada.
- #1019 comparte `app/hermandades/[slug]/page.js`. El laboratorio parte de main actual; no integra, cierra ni cambia esa PR. Antes de una futura integración, reconciliar su ajuste de enlace histórico de Banda.

## Diagnóstico

Inspección pública real a 1363 × 936: hero 699 px, Titulares a 2658 px, Historia a 8445 px, total 16412 px. Dos módulos Tira del hilo comparten ID; un módulo de descubrimiento adicional precede a Música. Sede y horarios abiertos pesan 1314 px; Pasos abiertos 1581 px. La cronología y Conoce ya estaban plegados: no se rehace el frente editorial cerrado.

## Arquitectura propuesta

1. Cabecera compacta con foto y escudo gobernados; nombre oficial desplegable.
2. Menú de seis áreas como máximo.
3. Síntesis + próxima cita en dos columnas si existen datos.
4. Conoce: resumen y claves disponibles en SSR.
5. Titulares y Pasos, con datos técnicos de Paso plegados.
6. Historia: cinco hitos con criterios temáticos, cronología íntegra.
7. Música: actual, propia, composiciones, crucetas e histórico agrupados.
8. Patrimonio: piezas, intervenciones y documentos asociados.
9. Agenda y cultos: próxima cita y archivo de ediciones.
10. Una única sección de conexiones, cuatro relaciones iniciales y todas las restantes; rutas de segundo grado plegadas.
11. Enlaces y fuentes documentales.

Fondos blancos y grises neutros. Colores de entidad en líneas y detalles, sin mezclar automáticamente el secundario en grandes superficies.

## Aislamiento

Ruta genérica `/laboratorio/hermandades/[slug]`, disponible en desarrollo y preview, 404 en producción. No contiene condición por slug. Las rutas públicas conservan su diseño. Esta puerta permite validar El Baratillo antes de decidir una activación: fusionar el laboratorio por sí solo NO activa el rediseño público.

El laboratorio usa canonical de la ficha pública, `noindex, follow` para impedir una segunda URL indexada; la ficha pública conserva su metadata, schema y robots. Contenido de detalles renderizado íntegramente en servidor. Sin bibliotecas nuevas ni dependencias de producto.

## Validación

Build correcto y suite 1423/1423 en el primer corte. La matriz visual y la preview remota siguen pendientes en este corte; no se declara QA PASS hasta verificarlas.

## Puerta

NO PRODUCCIÓN. Requiere evaluación de preview y autorización expresa posterior para activación pública.
