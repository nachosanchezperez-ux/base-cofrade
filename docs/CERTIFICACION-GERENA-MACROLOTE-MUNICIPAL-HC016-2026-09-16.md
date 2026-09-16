# Certificación · Gerena · primer macrolote municipal HC-016

**Fecha:** 16 de septiembre de 2026

**HEAD inicial:** `074acd5dde226c5c5305904205362b06c5ed54e6`

**Lote:** `c0160026-0000-4000-8000-000000000001`

**Municipio seleccionado:** Gerena
**Esquema:** sin cambios; DML exclusivamente

## Reconciliación previa

- #801 quedó registrada como Agenda V4.2: navegación mensual directa, contadores, tipos diferenciados y filtros preservados.
- #802 quedó registrada como nueva jerarquía editorial de Home: Agenda prioritaria, Enciclopedia como núcleo y Música e Igualás como accesos especializados.
- `main`, producción y el tablero coincidían en `074acd5dde226c5c5305904205362b06c5ed54e6`; GitHub tenía 0 PR abiertas.
- Antes de la integración entraron #803, #804 y #805; el macrolote se reconcilió sobre `f2bcfa0503394946357396da543bb4c182c5748b`, que prevalece sobre el corte inicial.
- #492 permanecía cerrada; Supabase estaba `ACTIVE_HEALTHY` y no existía deuda estructural.

## Mapa municipal real

El corte inicial encontró 47 municipios provinciales con alguna presencia real en el grafo, 50 Hermandades publicadas y 24 fichas con deuda nuclear. El detalle reproducible se conserva en [`MAPA-MUNICIPAL-PROVINCIA-2026-09-16.csv`](./MAPA-MUNICIPAL-PROVINCIA-2026-09-16.csv). Tras Gerena hay 51 Hermandades publicadas y 22 fichas con deuda nuclear según el mismo criterio.

La métrica distingue deuda real, no aplicable, no publicado, pendiente de verificar y hueco legítimo. No considera la ausencia de Cultos, Agenda, conciertos, igualás o Crucetas como deuda automática.

## TOP 3

| Posición | Municipio | Cobertura inicial | Deuda real | Valor | Dificultad y riesgo |
|---|---|---|---|---|---|
| 1 | **Gerena** | 2 Hermandades publicadas incompletas, 0 Bandas locales y una extraordinaria certificada | Tercera corporación verificable ausente, titulares y Pasos incompletos, Banda Municipal sin nodo y relaciones musicales dispersas | Universo pequeño y cerrable, tres corporaciones históricas y fuente municipal de 2026 | Media; riesgo principal de trasladar datos históricos a 2026 |
| 2 | Pilas | 2 Hermandades incompletas, 1 Banda pública y 3 Salidas de 2026 | Soledad ausente y deuda musical/relacional | Alta densidad actual y musical | Media-alta; fuentes menos homogéneas y más entidades por promover |
| 3 | Utrera | 3 Hermandades publicadas, 1 ya profunda y 2 incompletas | El Consejo local documenta más corporaciones ausentes | Máximo alcance territorial | Alta; cerrar solo las dos fichas existentes habría producido un falso cierre municipal |

Gerena ganó por deuda verificable, fuentes disponibles, capacidad de cierre, valor para el buscador y menor riesgo de declarar completo un universo abierto.

## Inventario y alcance

| Familia | Preservar | Completar | Crear |
|---|---|---|---|
| Hermandades | Coronación de la Sangre ya certificada | Gran Poder y Vera-Cruz | Soledad Coronada |
| Titulares | María Santísima de la Sangre | Gran Poder, Rosario y Cristo de la Vera Cruz | Señor de la Paz, Soledad Coronada y Cristo Yacente |
| Pasos | Palio de la Sangre | Gran Poder, Rosario y Vera Cruz | Paso del Señor de la Paz y palio de la Soledad |
| Bandas | Maestro Tejera y sus periodos existentes | Periodo del Rosario vinculado a su Paso | Banda Municipal de Música de Gerena y vínculo con la Soledad |
| Agenda | Procesión extraordinaria del 12 de septiembre, ya `held` | Ninguna | Ninguna sin convocatoria o evidencia posterior suficiente |
| Fuentes | Guías municipales de 2019 y 2026 y crónica posterior de la Coronación | Trazabilidad de las dos fichas existentes | Web oficial de la Soledad, web oficial de Vera-Cruz, Ayuntamiento y contraste patrimonial |

## Composición HC-016

| Concepto | Total |
|---|---:|
| Operaciones editoriales | 83 |
| Insert / upsert | 77 |
| Update | 6 |
| Reuse canónico | 10 |
| Fuentes nuevas | 7 |
| Enlaces de Fuente | 22 |
| Entidades | 14 |
| Relaciones Hermandad–Imagen | 6 |
| Relaciones Hermandad–Paso | 6 |
| Relaciones Imagen–Paso | 6 |

## Preflight y Apply

Secuencia ejecutada: `CARGA → STAGING → PREFLIGHT GLOBAL → REVISIÓN → APPLY → RESULTADOS`.

- Staging: 83/83.
- Válidas: 83/83.
- Inválidas: 0.
- Referencias sin resolver: 0.
- Ambigüedades: 0.
- Colisiones: 0.
- Fallos: 0.
- Apply: 83/83.
- Reaplicación idempotente: correcta.

Incidencias de preparación, resueltas antes del Apply final:

1. La Fuente de la capilla debía vincularse a `entity_location`, no al UUID de `places` como si fuera una entidad.
2. `bulk_import_items.operation` admite la operación gobernada `upsert`; la distinción insert/update se conserva en `result` y en el resumen del lote.
3. La relación ya existente del palio de la Sangre estaba en `review`; se publicó junto con el Paso canónico, sin duplicarlo.
4. La consulta aislada «Bandas de Gerena» entraba en el flujo de acompañamientos de una Hermandad. Se corrigió el lector territorial común para Bandas y resúmenes municipales, con cobertura genérica y sin excepciones por nombre.

## QA de datos

- 3 Hermandades publicadas y territorialmente vinculadas a Gerena.
- 1 Banda local publicada.
- 7 titulares relacionados.
- 6 Pasos publicados y relacionados.
- 2 periodos musicales visibles.
- 0 slugs duplicados globales.
- 0 Hermandades o Bandas huérfanas.
- 0 contaminación territorial.
- 0 Salidas pasadas de Gerena en `announced`.
- Los 112 acontecimientos pasados preservados globalmente no fueron reabiertos.

## QA pública y técnica

- «Hermandades de Gerena» devuelve las tres corporaciones publicadas.
- «Bandas de Gerena» consulta el directorio público de Bandas por municipio.
- «Qué hay en Gerena» combina Hermandades y Bandas mediante relaciones territoriales.
- Las fichas públicas de Gran Poder, Vera-Cruz, Soledad Coronada y Banda Municipal son navegables y conservan sus relaciones.
- Suite completa sobre el corte reconciliado: 822/822.
- Build de producción y comprobación TypeScript de Next.js: correctos.
- `git diff --check`: correcto.

## Deuda legítima restante

- Agenda futura: no hay convocatorias posteriores verificables que justifiquen nuevas citas.
- Cultos fechados: la recurrencia histórica no se convirtió en edición 2026.
- Igualás y ensayos: no existe convocatoria vigente documentada.
- Conciertos: la tabla relacional existe, pero no hay concierto municipal verificable para publicar.
- Crucetas: no existe repertorio efectivamente interpretado y documentado.
- Multimedia: no se publicaron recursos sin contrato de derechos.
- Música del Domingo de Resurrección de 2027: no se trasladó a la vigencia de 2026.

## Fuentes principales

- [Guía de la Semana Santa de Gerena 2026](https://www.gerena.es/es/actualidad/noticias/Guia-de-la-Semana-Santa-de-Gerena-2026/?urlBack=)
- [Semana Santa de Gerena · Junta de Andalucía](https://www.juntadeandalucia.es/cultura/agendaculturaldeandalucia/evento/semana-santa-de-gerena)
- [Web oficial de la Soledad Coronada](https://www.hermandaddelasoledadcoronadadegerena.com/)
- [Patrimonio de la Soledad Coronada](https://www.hermandaddelasoledadcoronadadegerena.com/patrimonio/)
- [Estación de penitencia de la Soledad](https://www.hermandaddelasoledadcoronadadegerena.com/estacion-de-penitencia/)
- [Web oficial de la Vera-Cruz de Gerena](https://veracruzdegerena.com/)
- [Patrimonio de la Vera-Cruz](https://www.artesacro.org/Noticia/Ver/34504/provincia-mirada-provincia-hermandad-vera-cruz-gerena)
- [Banda Municipal de Música · Cultura Gerena](https://www.gerena.es/es/cultura/)

## Cierre técnico

La PR, el SHA final, el deployment exacto y los errores posteriores forman parte del postflight de integración y del entregable de cierre, porque no pueden conocerse antes de que se cree el propio commit que contiene esta certificación. El municipio no se considera cerrado hasta que `main` y producción coincidan y GitHub vuelva a 0 PR abiertas.

## Observación de Auditor

El primer cierre municipal demuestra que la prioridad no debe recaer en la localidad con mayor volumen. Gerena ganó porque el grafo permitía delimitar tres corporaciones, una Banda y sus relaciones sin DDL ni inferencias de actualidad. Agenda, Cultos, conciertos, igualás y Crucetas vacíos siguen siendo huecos legítimos cuando falta evidencia fechada.
