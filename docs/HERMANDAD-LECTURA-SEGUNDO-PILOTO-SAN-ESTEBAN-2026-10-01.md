# Lectura de Hermandades · segundo piloto · San Esteban · 1/10/2026

## Alcance autorizado

Se amplía de forma controlada la cohorte pública del nuevo sistema de lectura a una
segunda Hermandad: **San Esteban**. El Baratillo permanece como primer piloto
certificado. No se generaliza el diseño al resto del directorio.

Entidad contrastada en producción:

- San Esteban: `36b4d5c1-f7bb-4025-a09a-948e0d5d188f`
- slug público: `san-esteban`
- estado: `published`

La selección sirve para probar el mismo componente con una ficha de estructura
distinta al Baratillo: dos Titulares, dos Pasos, cronología corta, patrimonio
material amplio, 38 composiciones documentadas, 16 Fuentes y actividad
extraordinaria del centenario.

## Activación

`lib/brotherhood-reading-rollout.js` continúa siendo la única puerta de
publicación. La cohorte queda limitada a:

1. El Baratillo.
2. San Esteban.

No existe condición por slug. La resolución sigue haciéndose después de obtener
la entidad y usando su ID canónico. Retirar el ID de San Esteban revierte solo
su activación sin tocar datos, rutas ni el componente compartido.

## QA previsto

La matriz reutilizable `scripts/qa-brotherhood-reading.cjs` admite ahora
expectativas por entorno y mantiene un control fuera de cohorte en Gran Poder.

Para San Esteban:

- canonical: `https://hilocofrade.es/hermandades/san-esteban`
- Historia: 3 hitos documentados
- Fuentes: 16
- Patrimonio musical: 38 composiciones
- control: Gran Poder debe conservar la variante anterior

Puertas antes de integrar:

- CI completo y build PASS;
- Vercel Preview READY;
- HTTP 200, canonical propia, `index, follow` y un solo H1;
- seis opciones de navegación del nuevo sistema;
- cero overflow, IDs duplicados y page errors en la matriz 390/430/768/1024/1366/1600;
- Historia corta visible sin forzar disclosure;
- Titulares, Pasos, Salidas, Cultos, Patrimonio, Fuentes y conexiones conservados;
- Gran Poder continúa fuera de la cohorte.

Sin DML, DDL, migraciones, RLS ni cambios de contenido editorial.

## Postflight productivo

#1061 quedó fusionada en `035af7839c63c9ab498ab4ad3ec16ae9848856d4`.
Vercel publicó el deployment `dpl_D7AZ5LMRHYtLD7McfuRA2nhFzgUh` en estado
READY sobre ese mismo SHA. GitHub `verify` y Supabase Preview terminaron en
SUCCESS.

La URL pública `/hermandades/san-esteban` devuelve el nuevo sistema de lectura
por cohorte: navegación compacta de seis entradas —Resumen, Titulares, Historia,
Música, Patrimonio y Agenda—, guía `Conoce San Esteban`, Titulares, Pasos,
Agenda, patrimonio musical y relaciones preservadas. La respuesta pública sigue
siendo la URL canónica habitual de San Esteban.

Como control fuera de cohorte, Gran Poder conserva la variante anterior del
layout: no adopta la navegación compacta del piloto. Esto confirma que la
activación sigue limitada por ID y no se ha generalizado por slug o por presencia
de contenido `Conoce`.

Los logs del deployment no muestran entradas `error` ni `fatal` en la ventana
de veinte minutos consultada tras la publicación.

**Límite de esta certificación:** en este entorno no se ha ejecutado la matriz
visual Chromium 390/430/768/1024/1366/1600 ni se han generado screenshots del
segundo piloto. Por tanto, el estado queda **PUBLICADO · POSTFLIGHT ESTRUCTURAL
PASS · QA VISUAL MULTI-ANCHURA PENDIENTE**. No se generaliza el rollout hasta
cerrar esa comprobación visual.
