# Fuentes públicas de Pasos · corrección transversal

## Problema

El lector público ignoraba source_links cuyo entity_id era el propio Paso.
Sin fases ni piezas, devolvía Fuentes vacías. Metadata recibía ese resultado y
aplicaba noindex. La selección del sitemap solo reconocía Fuentes de fases,
excluyendo también Pasos documentados mediante piezas.

Una consulta de producción confirmó Pasos publicados con Fuentes directas y sin
fases ni piezas en Alcalá de Guadaíra (Cristo del Amor y palio de la Amargura) y
Estepa (andas de las Angustias). El defecto no es exclusivo de Utrera.

## Cambio

- El lector combina Fuentes directas, de fases publicadas y de piezas publicadas.
- Deduplica por source_id antes de cargar los documentos.
- No expone piezas no publicadas ni aprovecha sus Fuentes para indexar.
- El sitemap reconoce las mismas tres procedencias, con consultas por lotes.
- Se renueva la clave de caché de detalle de Paso a v5.
- Identidad, contexto corporativo, contenido y relaciones siguen siendo necesarios.
  No hay excepciones por slug, municipio o nombre.

Sin DML, DDL, migraciones, RLS, nuevas entidades ni vínculos. Los datos y la PR
#1009 de Utrera permanecen intactos. No se autoriza staging ni Apply por este cambio.

## Preflight

Main `2c751d493189fd9640f4f7dc29935efeaf5892a4`; producción
`dpl_5zqJGYYHEpZENYkcMNncTuh5N4PV` READY sobre ese SHA; Supabase ACTIVE_HEALTHY.
Rama independiente `fix/fuentes-publicas-pasos-20260927` desde main.

## Verificación

Nueve pruebas ejecutan los lectores, generateMetadata y la selección de sitemap
con un cliente de datos controlado: Fuentes directas, fases, piezas, combinación
sin duplicados, ausencia de Fuentes, ausencia de contexto, fase en review, pieza
en review y exclusión de Paso en review. Todas PASS.

Suite de esta rama: 1.303/1.303 PASS. Parte de main y no incorpora las 29 pruebas
exclusivas del candidato de Utrera. No comparar su contador con el de #1009.

El build local se verifica con Next.js/Turbopack. Un primer intento no llegó a
compilar porque el enlace a node_modules del otro worktree quedaba fuera de la
raíz admitida por Turbopack; se sustituyó por una copia local de las dependencias.
Segundo intento: build PASS, compilación y 31 páginas estáticas completas.
`git diff --check`: PASS.

No equivale a QA HTTP de un deployment nuevo ni certifica Utrera. Tras revisión
e integración, verificar Fuentes visibles, robots y sitemap en producción antes
de reanudar el preflight del lote municipal.
