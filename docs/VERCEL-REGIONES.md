# Vercel · configuración regional de Functions

## Decisión vigente · 25 de agosto de 2026

Hilo Cofrade declara una única región primaria para sus Vercel Functions:

```json
{
  "regions": ["dub1"]
}
```

`dub1` se mantiene por proximidad con Supabase, desplegado en `eu-west-1`.

## Límite del plan detectado

La configuración anterior combinaba:

```json
{
  "regions": ["dub1"],
  "functionFailoverRegions": ["fra1"]
}
```

Vercel interpreta `functionFailoverRegions` como regiones pasivas de Serverless
Functions. El deployment automático de la PR #350 fue rechazado con el mensaje:

> Deploying Serverless Function passive regions is restricted to the Enterprise plan.

El proyecto utiliza el plan Pro. Por tanto, no debe volver a añadirse
`functionFailoverRegions` sin comprobar antes que el plan contratado admite regiones
pasivas.

## Realidad observada antes de la corrección

- La producción `dpl_8LvRZvkvmpakTbsuFR75vCMhTRBj` estaba `READY` y Vercel
  informaba `iad1` como región real.
- La preview anterior de #342, `dpl_81LnYBbHNYntEnSr1Fmo2BQEtan3`, también
  informaba `iad1`.
- La presencia de `dub1` y `fra1` en el repositorio no demostraba que esas regiones
  estuvieran activas en dichos artefactos.

La región efectiva debe documentarse siempre desde el deployment resultante. La
configuración declarada no sustituye a la observación de Vercel.

## Criterio operativo

La prioridad de esta primera edición es mantener operativa la puerta:

`CI → preview → QA → producción`

No se añade infraestructura alternativa ni lógica de aplicación para suplir una
capacidad de plataforma no incluida en el plan. Si Vercel ignorase o no aplicase
`dub1`, se registrará la región real observada y se reevaluará en un corte posterior,
sin bloquear la recuperación de previews.
