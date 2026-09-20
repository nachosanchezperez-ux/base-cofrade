# Imágenes · restauraciones y cronología · 20 de septiembre de 2026

## Petición y alcance

Dos cambios separados sobre la página de Imagen: hacer legible el módulo de restauraciones y añadir cada intervención publicada a la cronología de la Imagen. Referencia visual: captura real de Nuestro Padre Jesús de la Paz (El Carmen), no las maquetas generadas. Se conservan Open Sans, cabeceras, contenedor, colores corporativos y cronología vertical existentes. No se incorporan fotografías generadas ni hitos ficticios.

## Diagnóstico verificado

- Base Git: `eda4dd28066457809d69e26732a6f3b48475bcfe`, producción Vercel READY `dpl_H3yjQEME3x3VWZxQDqgNq6tHKKFx`.
- PR #867 (SEO) permanece independiente; no comparte archivos con este cambio.
- El lector público entrega `restauraciones` pero no las proyecta en `cronologia`. La ruta mostraba solo el fallback de datación (1990 en esta Imagen).
- Intervención reutilizada: `006101a9-ef14-4744-89bf-c5bdc62632d3`; su texto publicado documenta la reposición al culto del 19/09/2026 y el Taller Leal Pérez. Los meses se conservan como fechas textuales, sin inventar días.

## Solución

Componente de servidor con tarjeta, año, responsable, periodo, disciplina, resumen y desplegable HTML nativo. Se normalizan los saltos de línea escapados de registros antiguos. Todos los trabajos siguen accesibles. Un helper puro añade la misma intervención a la cronología, preserva la datación y evita duplicados por identidad. Enlaces internos conectan ambos bloques.

No hay escrituras en Supabase, DDL, cambios de RLS, nuevas consultas de datos, rutas, canonical ni dependencias. La corrección es genérica para fichas de Imagen con intervenciones publicadas.

## Validación

12 pruebas unitarias locales superadas: separación de campos, cronología 1990/2026, enlaces, ausencia de fechas inventadas, idempotencia, intervenciones distintas del mismo año, textos completos, saltos reales/escapados, vacíos, inmutabilidad y estados no inferidos. El build completo y el cierre de producción requieren las comprobaciones de CI/Vercel de la PR; no se certifican con este documento por adelantado.
