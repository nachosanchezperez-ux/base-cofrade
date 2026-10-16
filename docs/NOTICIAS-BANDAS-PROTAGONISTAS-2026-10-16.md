# Bandas protagonistas de El Hilo se mueve

Solicitud: permitir que las bandas sean protagonistas también desde el Panel.
Base revisada: main d0e9f82a12da8517479b5c36ad05a52e9800cc29 (16/10/2026).

## Comportamiento

- Crear y editar noticias con una Hermandad o banda como protagonista mediante el mismo selector con búsqueda y tipo de ficha.
- Se conserva el flujo borrador, fuentes, relaciones, revisión y publicación/programación.
- Publicar exige que el protagonista sea una Hermandad o banda publicada con slug válido. La validación se hace antes de sustituir el vínculo existente.
- La tarjeta enlaza a la ficha canónica y utiliza el escudo/logotipo de su protagonista.
- Las fichas de bandas muestran hasta dos noticias propias o relacionadas mediante el desplegable existente. Las fichas de hermandades también leen noticias del Panel, sin depender de la lista estática del piloto.
- La noticia ya publicada del uniforme de Las Cigarreras utiliza la banda canónica como protagonista, conservando contenido, fechas y URL. Los Panaderos sigue como relación contextual.
- Invalidación de noticias y fichas de ambas clases al guardar, incluyendo la ficha anterior al cambiar el protagonista.

## Verificación

- Suite existente y pruebas editoriales ampliadas: 1.855 correctas.
- Cuatro pruebas adicionales ejecutan las Server Actions reales con sesión/transporte aislados: crear borrador de banda, publicar y editar; cambiar de Hermandad a banda; impedir cambiar una noticia publicada a banda en borrador; rechazar otros tipos de entidad y usuarios sin permiso. Cuatro correctas.
- Compilación Next.js 16.3.0 correcta.
- Lecturas de Supabase: entidad canónica Las Cigarreras publicada; relaciones editoriales genéricas y políticas existentes compatibles. No se necesita migración ni cambio de RLS. No se han escrito noticias de prueba en producción.
- La prueba de las acciones usa un transporte en memoria: no equivale a iniciar sesión y guardar desde el navegador. CI y preview/producción se registran en la PR.
