# Certificación · saneamiento de navegación e indexación pública

**Fecha:** 9 de septiembre de 2026  
**Régimen:** `FIRST EDITION FREEZE`  
**Resultado:** CERRADO · integrado y verificado en producción

## Alcance

La auditoría global detectó dos defectos relacionados:

1. `/pasos` enlazaba dos entidades relacionales de La Estrella que no tenían perfil especializado y cuyo detalle devolvía 404.
2. La generación del sitemap consultaba 529 entidades en una única petición. En producción esa lectura fallaba de forma transitoria y el sitemap quedaba sin las fichas individuales de Bandas, Imágenes y Pasos.

También se detectaron esperas intermitentes de `source_links` en fichas públicas. La corrección reduce objetivos innecesarios en Hermandades y aplica lecturas públicas por lotes con un reintento acotado.

## Corrección integrada

La PR [#729](https://github.com/nachosanchezperez-ux/base-cofrade/pull/729) quedó fusionada mediante `9f3ac79849ab054b1b56c2be67058129bda0402c`.

- Los directorios de Imágenes y Pasos solo publican entidades con perfil especializado.
- Las consultas públicas masivas se dividen en lotes de 75 identificadores, deduplicados, con un único reintento ante fallo.
- El cálculo de indexabilidad conserva los criterios existentes y evita la petición monolítica.
- La ficha de Hermandad deja de solicitar Fuentes globales de agentes que su presentación ya descartaba.
- Se añadieron contratos para lotes, reintento, contexto de error y frontera pública de Pasos.

No hubo DDL, tablas nuevas, migraciones estructurales ni cambios RLS. #492 permanece abierta y aislada.

## QA

- Suite completa: **665/665**.
- `next build`: correcto con Next.js 16.3.0.
- CI de GitHub: correcta.
- Preview de Vercel: `READY`, sin el error `fetch failed` durante la generación del sitemap.
- Producción: `READY` en `dpl_FS9fqCU2snPS8fekpD4UB2xpN94t`, asociada al mismo SHA de `main`.
- Sitemap de producción: **553 URL**; 176 contienen `/hermandades/`, 52 `/bandas/`, 172 `/imagenes/` y 35 `/pasos/`.
- Una ficha válida de cada familia respondió **200** en el postflight.
- `paso-misterio-jesus-penas-estrella-sevilla` y `paso-palio-maria-santisima-estrella-sevilla` no aparecen en `/pasos` ni en el sitemap.
- Vercel no registró errores de ejecución en los 30 minutos del postflight.
- GitHub volvió a **0 PR abiertas** tras integrar #729.

## Decisión

El saneamiento queda cerrado. Las dos entidades de La Estrella se conservan como nodos relacionales; no se borran ni se presentan como fichas públicas hasta que exista contenido especializado suficiente.

El rediseño visual amplio del directorio continúa en Laboratorio. No se abre una octava Hermandad ni un nuevo frente editorial.
