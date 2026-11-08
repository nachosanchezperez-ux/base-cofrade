# Buscar contenido dentro de las fichas del panel

## Diagnóstico y alcance

Base: main `6d6ee1d48ee73dfe88f6f6112b3c17a86e324fd6`. Producción Vercel READY (`dpl_5fWSjrFX1dEPT7XpDNTtAV43nGbc`); Supabase Hilocofrade ACTIVE_HEALTHY. Se revisaron las PR abiertas: no duplican este buscador. No se toca #1364; #1405 comparte cultos pero esta PR solo añade el ancla del formulario en esa pantalla.

El editor presenta todas las piezas patrimoniales como formularios completos. La navegación por secciones no permite localizar contenido situado en otro apartado. Se añade un buscador común al layout de las fichas de Hermandad; no modifica el buscador público ni los editores de otros tipos de entidad.

Una lectura SQL confirmó en El Amparo (`fc0942dd-d555-43b2-9495-399daba54903`) la pieza `fe196e69-d1e7-4fee-86e1-d3f5a94fb2aa`, «Coronas históricas de Nuestra Señora del Amparo y el Niño Jesús» (tipo Coronas). Ese nombre e identificadores se usan en la regresión. Las descripciones adicionales de los tests son sintéticas.

## Comportamiento

- Buscar mediante botón o Intro: no se consulta la base en cada pulsación ni al abrir una ficha.
- Busca títulos y texto editorial en General, Historia, Patrimonio (incluidos autores e intervenciones), estrenos y restauraciones, Cultos, Salidas, salidas habituales, Titulares, Pasos, Hábito, Jornada y Canales.
- Ignora mayúsculas, tildes y artículos/preposiciones comunes; permite corona/coronas. Exige todos los términos significativos y prioriza coincidencias en el título.
- Cada resultado incluye título, apartado, estado editorial, extracto y enlace al formulario concreto. General e Historia abren su apartado. No filtra ni desmonta los formularios mientras se busca.
- Hasta 40 resultados, con total y aviso para afinar. Estado vacío, error recuperable y botón Limpiar. El perfil colaborador recibe «Ir al registro».
- Enlace con ancla estable y realce visual en destino; se advierte al abandonar formularios modificados. La búsqueda no guarda nada.
- No indexa fotos/carteles, los campos visuales de Portada ni herramientas externas como Fuentes/Acontecimientos. Se indican los apartados incluidos junto al buscador. No pretende buscar los textos íntegros de las fichas enlazadas de Imagen/Paso.

## Acceso y consultas

Endpoint GET autenticado con `getPanelUser`; no basta una sesión sin perfil activo. Utiliza el cliente de sesión y RLS, nunca service role. Respuestas `private, no-store` y `Vary: Cookie`, sin caché compartida. Valida UUID y longitud de consulta. Solo devuelve extractos y rutas generadas por la aplicación; no filas crudas ni detalles de errores.

Lecturas acotadas a la Hermandad y sus relaciones, paginadas y con consultas por lotes. Los estados archivados siguen la visibilidad de cada editor. No se cargan los catálogos globales de candidatos. No hay tablas, migraciones, índices persistentes, dependencias, cambios de permisos ni escrituras editoriales.

## Validación

- 14 pruebas específicas: caso Amparo; singular/plural; acentos; búsqueda en apartados no abiertos; autorías; cero resultados; límite; estados; aislamiento entre fichas; más de 1.000 filas; denegación sin usuario; colaborador/editor; entradas inválidas; fallo sin filtrar detalles internos.
- Suite completa: 2.505 pruebas correctas.
- `npm run build`: correcto.
- `git diff --check`: correcto.
- Pendiente: revisión visual y de navegación en sesión autenticada del panel, en móvil y escritorio. El caso Amparo está contrastado mediante lectura real y pruebas de lógica; no se presenta como una prueba de navegador autenticada.

Sin merge ni despliegue de producción. La PR se entrega en borrador para revisión.
