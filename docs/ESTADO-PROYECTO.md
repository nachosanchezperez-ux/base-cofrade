# Hilo Cofrade · Estado canónico

**Corte operativo:** 8 de septiembre de 2026 · segundo lote editorial real de HC-016

**HEAD funcional auditado:** `2ab67af601f6ec3314e0ca07f610535446088e41` · [#706](https://github.com/nachosanchezperez-ux/base-cofrade/pull/706) fusionada

**Producción auditada:** `dpl_2NPrhdVh5167Fw8CLfWYyiVrPD6n` · `READY` · mismo SHA que el HEAD funcional auditado

**PR abiertas al cierre:** **0**

**Régimen:** `FIRST EDITION FREEZE` activo

**Frente editorial de Hermandad:** San Pablo y Mercedes de la Puerta Real cerradas; no existe otra ficha abierta

> GitHub, Vercel y Supabase prevalecen sobre cualquier fotografía anterior. El HEAD canónico posterior es el commit de `main` que contiene esta fotografía; `2ab67af…` identifica el producto y el flujo que se auditaron antes de su sincronización documental.

## Dónde estamos ahora

HC-016 ha completado dos lotes editoriales reales. San Pablo continúa certificado y Mercedes de la Puerta Real queda certificada como segundo contexto: una Hermandad de Gloria, con fuentes, titulares, Paso, intervenciones, Cultos, Salida, acompañamiento y patrimonio distintos de los del primer lote.

El segundo cierre se realizó mediante el circuito canónico, sin incorporación manual masiva, nuevo DDL, tablas, migraciones estructurales, cambios RLS ni excepciones específicas:

```text
CARGA → STAGING → PREFLIGHT GLOBAL → REVISIÓN → APPLY → RESULTADOS
```

La primera ejecución de Mercedes descubrió un valor limitado por `CHECK` que HC-016 todavía no validaba. Dos filas alcanzaron Apply y fallaron; las 35 anteriores ya se habían escrito. Por tanto, no se presenta esa primera pasada como atómica ni como perfecta. Se detuvo el frente, se corrigió la causa común en [#705](https://github.com/nachosanchezperez-ux/base-cofrade/pull/705), se desplegó el arreglo y solo entonces se preparó el remate. La segunda ejecución terminó 68/68 y un fixture posterior demuestra que el mismo fallo queda bloqueado antes de Apply.

## Primer lote real · San Pablo

San Pablo sigue cerrado. Las 183 filas originales permanecen aplicadas, remediadas o descartadas con causa; el cierre `bc2def40-4dbe-464e-a6c5-43ccfbad8027` aplicó 41/41 actualizaciones. No han reaparecido duplicados, huérfanos ni regresiones públicas en su ficha.

Las correcciones de [#694](https://github.com/nachosanchezperez-ux/base-cofrade/pull/694), [#695](https://github.com/nachosanchezperez-ux/base-cofrade/pull/695), [#696](https://github.com/nachosanchezperez-ux/base-cofrade/pull/696), [#698](https://github.com/nachosanchezperez-ux/base-cofrade/pull/698) y [#699](https://github.com/nachosanchezperez-ux/base-cofrade/pull/699) continúan integradas: Fuentes paginadas con orden estable, UPDATE efectivo, bloqueo de tablas no escribibles, Pasos de Salidas correctamente tipados y `on_conflict` limitado a claves reales.

## Recálculo de deuda y selección

El ranking se recalculó desde el grafo real, exclusivamente entre Hermandades publicadas no certificadas y antes de escribir datos. Se clasificaron las ausencias como deuda real, no aplicable, no publicada, pendiente de verificar o hueco legítimo.

| Candidata | Completitud inicial aprox. | Deuda y potencial | Fuentes | Dificultad | Cierre posible con HC-016 |
|---|---:|---|---|---|---:|
| Mercedes de la Puerta Real | 43 % | Alto potencial en titulares, Paso, intervenciones, Cultos, Gloria, música y patrimonio | Muy buena, mayoritariamente oficial | Media | 95 % |
| El Museo | 43 % | Alto potencial histórico, artístico y relacional | Buena | Media-alta | 93 % |
| El Cachorro | 43 % | Potencial muy alto, pero con mayor volumen y ambigüedad | Muy buena | Alta | 88 % |

Se eligió **Mercedes de la Puerta Real** porque permitía probar más familias de HC-016 en un contexto de Gloria con fuentes oficiales suficientes, reutilización de nodos ya existentes y un lote abordable. El Museo no llegó a Staging ni se escribió.

## Segundo lote real · inventario y ejecución

### Núcleo, titulares y Paso

Lote `c525cad2-04ff-4e68-a778-5cf2c354f2c4`:

- 37 filas preparadas y revisadas;
- plan efectivo: 34 insert · 3 update;
- resultado: 35 aplicadas · 2 fallidas;
- familias: 8 Fuentes, sede canónica, Hermandad, 4 titulares, 4 relaciones Hermandad–Imagen, autorías, Paso, relación Imagen–Paso y 8 `source_links`.

Las posiciones 24 y 25 intentaban representar la remodelación de 1969 y la conservación de 2000 como `image_authorships.authorship_type = remodeling/restoration`. El `CHECK` real solo admite `author`, `attributed_to`, `workshop_of`, `circle_of`, `school_of` y `anonymous`. Las dos filas fallaron y no existen en la base.

La modelización correcta no era ampliar el `CHECK` ni falsear autorías: ambas actuaciones se trasladaron a `heritage_interventions`, reutilizando a Luis Álvarez Duarte. Las autorías desconocidas de la Virgen y San Pedro Nolasco se expresaron como `anonymous` con certeza `unknown`.

### Cierre editorial

Lote `0eebc10c-137f-4485-974f-04df7dfed11e`:

| Familia | Filas |
|---|---:|
| Fuentes | 5 |
| Hermandad | 1 |
| Entidades | 6 |
| Relaciones Hermandad–Imagen | 4 |
| Autorías de imágenes | 4 |
| Relación Imagen–Paso | 1 |
| Intervenciones patrimoniales | 2 |
| Cultos recurrentes | 6 |
| Ocurrencias de Cultos 2026 | 6 |
| Salida 2026 | 1 |
| Participantes de la Salida | 2 |
| Posición, asignación y periodo musical | 3 |
| Piezas patrimoniales | 2 |
| `source_links` | 25 |
| **Total** | **68** |

Se reutilizaron la Hermandad, la capilla canónica, el Paso procesional, la Banda Municipal de Música de La Puebla del Río, Luis Álvarez Duarte y las cuatro imágenes creadas en el primer envío. No se duplicaron esos nodos.

Resultado del circuito completo:

- Carga: 68/68 válidas y 0 colisiones;
- Staging y Preflight global: 68/68, 0 errores;
- revisión manual: referencias y dependencias resueltas;
- plan efectivo: 56 insert · 12 update · 0 errores;
- Apply: 68/68 aplicadas, 0 fallos.

## Incidencias y correcciones genéricas

- [#705](https://github.com/nachosanchezperez-ux/base-cofrade/pull/705) valida `image_authorships.authorship_type` contra el `CHECK` real. No contiene excepciones para Mercedes. Un fixture con `restoration` queda en `0/1`, informa `INVALID_VALUE`, termina en `Preflight bloqueado` y registra 0 aplicados. El lote diagnóstico `9a332188-b5c3-4307-80b2-9b2582ed93e0` quedó cancelado después de la prueba.
- [#706](https://github.com/nachosanchezperez-ux/base-cofrade/pull/706) evita mostrar `outings.reason` bajo el rótulo «Recorrido» cuando no existe `route_summary`. La corrección es común a todas las Salidas y conserva la ausencia documental legítima.

No apareció una nueva columna inválida, referencia no resuelta, ambigüedad, conflicto, permiso, `on_conflict` incorrecto o dependencia rota en el lote de cierre. Ningún error determinista de esa segunda ejecución alcanzó Apply.

## Certificación de Mercedes de la Puerta Real

La ficha pasa aproximadamente de **43 % a 92 %** de completitud editorial útil:

- identidad, denominación oficial, sede canónica y canales publicados;
- 4 titulares publicados, con autorías o anonimía explícita y 2 intervenciones de la Virgen;
- Paso procesional publicado y relacionado con la Virgen;
- Banda Municipal de Música de La Puebla del Río vigente tras el Paso;
- 6 Cultos recurrentes y 6 ocurrencias de 2026 publicadas;
- Salida ordinaria del 26 de septiembre de 2026 a las 19:00, publicada y visible en Procesiones de Gloria;
- participantes resueltos como Imagen procesional y Paso procesional, sin confusión con música litúrgica;
- manto blanco de salida de 2012 y corona de oro de 1972 publicados;
- 15 Fuentes visibles en la ficha pública;
- 0 duplicados activos de titulares o autorías, 0 autorías con valores inválidos, 0 `source_links` huérfanos y 0 participantes huérfanos;
- título SEO, canonical y `robots=index, follow` correctos; la Salida está presente en el directorio y en el sitemap.

Huecos legítimos o pendientes de verificación, no datos inventados:

- itinerario exacto de 2026: no se publicó por falta de una fuente oficial inequívoca;
- fotografías de titulares y patrimonio: no se incorporaron sin licencia reutilizable comprobada;
- vestidor actual: pendiente de una fuente oficial concluyente;
- catálogo musical y patrimonial exhaustivo: existe documentación de referencia, pero no se fuerza una exhaustividad artificial; las dedicatorias musicales estructuradas no son escribibles por el rol actual de HC-016 y no se cambió RLS;
- hábito penitencial: no aplicable a esta Hermandad de Gloria.

## QA y producción

- pruebas específicas del importador, autorías y Salidas: verdes;
- suite completa: 650/650;
- `next build`: correcto con Next.js 16.3.0, TypeScript válido y 13 páginas estáticas;
- `git diff --check`: limpio;
- PR #705: CI verde, preview `READY`, squash merge `ba318b6aefcd0d3a1b691697139a9415b5453faa`;
- PR #706: CI verde, preview `READY`, squash merge `2ab67af601f6ec3314e0ca07f610535446088e41`;
- producción #706: `READY` y SHA idéntico a `main`;
- ficha pública, Panel, directorio de Gloria y detalle de la Salida comprobados después del despliegue.

Durante el build de #706, la generación del sitemap registró un `fetch failed` transitorio al consultar Supabase y omitió las fichas individuales de entidades en esa versión estática; no fue un error de datos de Mercedes. La indexabilidad directa de su ficha es correcta y el siguiente despliegue debe volver a generar el sitemap. Si la omisión global persistiera, será una regresión técnica separada y no se ocultará como completitud editorial.

## #492 · aislada

[#492](https://github.com/nachosanchezperez-ux/base-cofrade/issues/492) sigue **abierta y aislada**. No bloquea contenido ni relaciones soportadas por el modelo actual. Sí bloquea nuevo DDL, tablas, migraciones estructurales y cambios RLS hasta reconciliar Supabase Preview Branches.

No existe otro bloqueo operativo.

## Auditor

1. **¿San Pablo continúa cerrado?** Sí.
2. **¿Mercedes de la Puerta Real está cerrada?** Sí, con los huecos legítimos expresos anteriores.
3. **¿Queda alguna fila de los dos lotes en estado indeterminado?** No: 35 se aplicaron en el núcleo, 2 se descartaron y reformularon con causa, y 68 se aplicaron en el cierre.
4. **¿Puede repetirse el fallo determinista de autorías por el mismo camino?** No: Carga y Preflight lo bloquean antes de Apply.
5. **¿HC-016 ha demostrado reutilización en un segundo contexto real?** Sí: el cierre 68/68 se ejecutó íntegramente con HC-016, reutilizando nodos y sin carga manual masiva.
6. **¿Existe algún bloqueo aparte de #492?** No.
7. **¿`main`, producción y estado canónico coinciden?** Sí al cierre; esta fotografía documenta el HEAD funcional verificado.
8. **¿Hay 0 PR abiertas?** Sí.

## Siguiente movimiento autorizado

HC-016 pasa de importador certificado a método editorial operativo. El siguiente movimiento permitido es recalcular otra vez la deuda documental desde el grafo real y seleccionar **una** única Hermandad. No se autoriza ampliar arquitectura ni abrir varias fichas en paralelo.
