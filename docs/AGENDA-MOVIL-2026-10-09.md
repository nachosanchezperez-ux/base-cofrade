# Agenda móvil · fechas, horarios y detalle a un toque

## Alcance

Solicitud directa del usuario: conservar paleta, potenciar móvil y acceder a fechas, hora e información con facilidad. Base `d1086171d26c7fcff2de8c2dd414f8c69c349391`, producción READY `dpl_DvdL87tbu9brzjL15244A95LUheS`.

Preflight: AGENTS.md, HILO-ORQUESTADOR y tablero leídos; documentación CSS y componentes cliente de Next 16.3.0 consultada. PR abiertas #1123, #1113, #1111, #1097, #1086, #1020 y #1019: sin solape de archivos de implementación. `docs/ESTADO-PROYECTO.md` compartido con #1123/#1097/#1086/#1020/#1019; reconciliar al integrar. No datos, SQL, migraciones, RLS, consultas ni servicios nuevos.

## Cambio

- Cabecera móvil compacta, mismos azul noche, burdeos, crema y colores por tipo. Se mantienen H1, metadatos, canonical y JSON-LD.
- Hoy/Mañana/Fin de semana/Próximos con fecha explícita y selección visible. En móvil permanecen accesibles al desplazarse; pulsar vuelve al comienzo del listado.
- Filtros de lugar y tipo agrupados, desplegables; cantidades coherentes con la selección. Limpieza accesible y recuperación desde resultados vacíos.
- Fecha con día de la semana, mes y año cuando corresponde; horario completo destacado, sin recortar los turnos partidos. Los actos de varios días indican su intervalo y muestran horarios diarios en el detalle si existen.
- Fotografía/escudo preservados en una cabecera de tarjeta; contenido móvil a todo el ancho para evitar nombres comprimidos.
- Un toque despliega información, recorrido/repertorio y enlaces relacionados. Sin desplegables anidados para consultar el recorrido.
- Accesos especializados siguen al final del contenido móvil; navegación de escritorio y rutas temporales conservadas.
- Dos correcciones del contrato servidor→cliente: se preservan `scope` (capital/provincia y municipios) y `daySchedules` (horario por fecha). Antes se eliminaban al compactar. No se inventan horas en días sin horario documentado.

## Verificación

- Batería local en UTC: 1.580 pruebas PASS; incluye regresión ejecutando la función real de compactación y proyectando horarios partidos/distintos y día sin horario, además de localización.
- Build Next 16.3.0 PASS y `git diff --check` PASS.
- QA Chromium emulado sobre `next build` + `next start`, con aplicación real y React hidratado: 320/390/430/768/1366 px sin desbordamiento. Fechas y horario del primer acto visibles inicialmente a 390/430 px.
- Hoy 1, Mañana 10, Fin de semana 20, Próximos 61 en snapshot público de este corte. Municipio La Rinconada, filtro de tipo, vacío, restablecimiento, recorrido con un toque, enlaces y teclado comprobados.
- La ruta temporal de QA usa 61 actos tomados del HTML público. Se reconstruye `scope` con la misma regla del lector (Sevilla = capital); la conservación de `daySchedules` se prueba con casos sintéticos identificados. Esa ruta y los datos de prueba se retiran antes del commit.
- Límites: emulación Chromium, no iPhone/Safari físico. Lectura pública de producción como snapshot; no se certifica acceso local a Supabase. El optimizador local agota la espera de algunas imágenes remotas; se conserva el mecanismo existente de foto→escudo→marcador. Novedades del encabezado devuelve 503 sin configuración local: fuera del alcance de la agenda.

Evidencia automática: [QA de cinco anchuras e interacciones](./AGENDA-MOVIL-QA-2026-10-09.json).

## Entrega

La PR y su preview registran el estado remoto de CI y despliegue. No afirmar publicación hasta verificar el SHA servido en producción.
