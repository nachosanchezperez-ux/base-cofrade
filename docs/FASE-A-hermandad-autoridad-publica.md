# Fase A · Hermandad · autoridad editorial pública

Estado: IMPLEMENTACIÓN PARCIAL / SEGURA

## Objetivo

Separar de la sesión del Panel las lecturas públicas que determinan qué secciones de una Hermandad están bajo autoridad editorial de Supabase.

## Auditoría RLS

`brotherhood_section_authority` tiene RLS activa y una política específica para `anon` que permite leer únicamente autoridad de Hermandades publicadas.

`brotherhoods` tiene RLS activa y política pública condicionada a que la entidad Hermandad esté publicada. Por tanto `history_text`, cuando se consulta desde una ficha pública ya publicada, no necesita sesión editorial.

La vista `current_step_personnel`, consumida por la ficha rica de Hermandad, usa `security_invoker=true`; su tabla base `step_personnel_periods` también limita la lectura pública a filas `status = published`.

El resto de tablas principales consumidas por la ficha rica de Hermandad han sido auditadas y disponen de lectura pública compatible con el grafo publicado: entidades, titulares, pasos, colores, hábitos, patrimonio, cultos, salidas, acompañamientos, fuentes, fases, intervenciones, media y relaciones.

## Cambio de este PR

`applyBrotherhoodAuthority()` deja de usar el cliente cookie-aware y pasa a `createPublicClient()`.

Esto evita que la autoridad editorial pública dependa de si existe o no una sesión del Panel en la petición.

## Límite deliberado

`lib/supabase/brotherhoods.js` sigue usando por ahora `createClient()` en su loader principal y en helpers relacionados. Ese archivo es transversal y se migrará en un corte independiente para reducir riesgo de conflicto con trabajos concurrentes.

No se activa caché, ISR, TTL ni tags.
