# Certificación HC-016 · Divina Pastora de Santa Marina

**Fecha:** 11 de septiembre de 2026  
**Contexto:** noveno lote editorial real  
**HEAD funcional integrado:** `1f41c09553fb420f25d8cc6a2b3f305f4219d4b1`  
**PR de recurso gráfico:** [#745](https://github.com/nachosanchezperez-ux/base-cofrade/pull/745)  
**Producción funcional:** `READY` · `dpl_kQPLn7RkT1QZX2B5DamDL5DYr97X`

## Diagnóstico y criterio editorial

La ficha partía de un nivel H2, con Hermandad, sede, Paso, tres Cultos de 2026, tres Salidas de 2026 y dos acompañamientos musicales señalados, pero sin titular canónica publicada ni grafo completo de Imagen, Paso, Cultos, Salida y música. También faltaban autoría, cronología, intervención documentada, fuentes patrimoniales y recursos gráficos con derechos trazables.

Se cerró exclusivamente con el modelo editorial vigente. No hubo DDL, migraciones, cambios RLS, excepciones por `slug`, rediseño, arquitectura ni funcionalidades nuevas.

## Fuentes y prudencia documental

El lote incorporó cinco fuentes nuevas y reutilizó las ya existentes. El núcleo documental procede de:

- [Consejo General de Hermandades y Cofradías de Sevilla](https://www.hermandades-de-sevilla.org/hermandades/gloria/septiembre/pastora-de-santa-marina/), para identidad, imagen y paso;
- [estudio de Francisco José Martín López, *El Zagal* n.º 25 (2023)](https://www.academia.edu/121276058/Nuevos_aportes_art%C3%ADsticos_y_documentales_de_la_imagen_de_la_Divina_Pastora_de_Santa_Marina_Francisco_Antonio_Ruiz_Gij%C3%B3n_y_la_Divina_Pastora), para atribución y contexto artístico;
- [archivo oficial de la Hermandad](https://divinapastorasantamarina.blogspot.com/2016/09/), para las andas y los candelabros;
- [Vatican News](https://www.vaticannews.va/es/iglesia/news/2025-09/la-coronacion-de-la-divina-pastora-sevilla-espana-hermandad.html), para la coronación canónica del 27 de septiembre de 2025;
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pastora_de_Santa_Marina,_Capilla_de_la_Divina_Pastora_(Sevilla).jpg), para la fotografía de Jl FilpoC, publicada bajo CC BY-SA 4.0;
- [Arte Sacro](https://www.artesacro.org/Noticia/Ver/168761/recuerden-solemnes-fiestas-septiembre-2026-divina-pastora-santa-marina), ya presente, para la convocatoria de septiembre de 2026.

La autoría de la titular se conserva como **atribuida** a Francisco Antonio Ruiz Gijón, hacia 1704–1705. El estudio de 2023 plantea una posible relación con Bartolomé García de Santiago, pero no se convirtió esa hipótesis en autoría documentada.

## Aplicación gobernada

| Lote | Resultado | Efecto |
|---|---:|---:|
| `89efa9ed-4ad7-4893-8686-30fb1dc831b1` | 43/43 | 34 insert · 9 update |
| `f5c7e46f-55eb-4ba1-a539-ab113e1a4581` | 2/2 | 2 insert |
| `e40b665a-68ef-495e-bbe6-fc51ddfd56ff` | 5/5 | 5 insert |
| **Total** | **50/50** | **41 insert · 9 update** |

Los tres lotes terminaron con 0 registros inválidos, 0 referencias sin resolver, 0 colisiones pendientes y 0 fallos. Los intentos previos que detectaron una posición musical ya existente, una restricción obligatoria de Cultos y una colisión de secuencia se revirtieron transaccionalmente; no dejaron escrituras parciales.

## Estado final del grafo

- titular canónica `Divina Pastora de las Almas de Santa Marina`, publicada y vinculada a Hermandad, andas, tres Cultos y Salida principal;
- imagen de 1,20 m, sedente y casi completa bajo las vestiduras, atribuida a Ruiz Gijón hacia 1704–1705;
- restauración de Juan Manuel Miñarro López en 1991–1992;
- andas procesionales de 1959–1960, de madera tallada y dorada con espejuelos y cuatro candelabros;
- coronillas de los candelabros realizadas por Orfebrería Andaluza en 2002;
- Agrupación Musical Santa Cecilia de Sevilla abriendo el cortejo y Banda de Música Municipal de Coria del Río tras las andas en la procesión del 20 de septiembre de 2026;
- historia actualizada con fundación en 1703, incendio de Santa Marina en 1936, establecimiento en la capilla del antiguo Hospital del Amparo en 1992 y coronación canónica de 2025;
- fotografía licenciada enlazada como cabecera de la Hermandad y portada de la Imagen, con autor, procedencia, licencia, dimensiones y texto alternativo.

La ficha publica 11 fuentes visibles. Las verificaciones globales devuelven 0 duplicados de `slug`, 0 duplicados Hermandad–Imagen, Imagen–Paso ni Salida–Entidad, 0 secuencias musicales duplicadas y 0 huérfanos en las relaciones nucleares.

## Nivel editorial y deuda legítima

La señal reproducible de `brotherhood_completeness` alcanza **100 %** y la ficha queda en **H3**. No se usa esa cifra para afirmar exhaustividad histórica.

Quedan dos huecos legítimos:

- una fotografía específica del paso completo con reutilización acreditada;
- la cronología temporal de sedes en `entity_locations`, cuya escritura está bloqueada por la política de HC-016. La sede canónica ya está publicada mediante el campo vigente de la Hermandad y no afecta a su completitud.

## QA público y técnico

- [ficha de la Hermandad](https://hilocofrade.es/hermandades/pastora-de-santa-marina): HTTP 200, cabecera licenciada, titular, Paso, Cultos, Salidas, música, historia y fuentes visibles;
- [ficha de la titular](https://hilocofrade.es/imagenes/divina-pastora-de-las-almas-santa-marina): HTTP 200, `index, follow`, autoría prudente, cronología, restauración, relaciones y crédito CC BY-SA 4.0;
- [ficha del Paso](https://hilocofrade.es/pasos/andas-procesionales-divina-pastora-santa-marina): HTTP 200, `index, follow`, Imagen, dos Bandas, patrimonio y fuente del conjunto;
- recurso gráfico WEBP: HTTP 200, 1600 × 2131 y 572.410 bytes;
- Open Graph: PNG válido de 1200 × 630;
- producción `READY` en el SHA funcional y sin errores de runtime asociados al cierre;
- 0 operaciones pendientes en los tres lotes, 0 fuentes inválidas y 0 huérfanos.

## Actualidad anual

La Novena de 2026 se conserva en curso según su convocatoria; las restantes citas de septiembre se mantienen anunciadas mientras no exista evidencia posterior. Este cierre no convierte automáticamente en celebrados los eventos cuya fecha haya pasado. La cola transversal de 56 registros históricos aún marcados como anunciados permanece separada para contraste documental individual.

**Certificación:** la Divina Pastora de Santa Marina queda cerrada, actual, fiable, relacional, indexable y documentada como noveno contexto real de HC-016.
