# Tarea 07 · Control automático de integridad de la enciclopedia

**Fecha:** 12/10/2026 · **Base:** `main = 173ca09` (#1150) · **Alcance:** solo lectura. Sin cambios en datos, RLS, migraciones ni componentes visuales. No toca archivos de la Home ni de la Agenda (#1151, #1152).

## Qué añade

Un sistema de comprobaciones de solo lectura que detecta errores e incoherencias en los datos antes de que afecten a las fichas públicas, y que puede ejecutarse cada semana sin coste.

| Pieza | Ruta |
|---|---|
| Comprobaciones (funciones puras, sin dependencias) | `lib/integrity/checks/{core,music,agenda}.js` |
| Modelo, niveles y utilidades | `lib/integrity/model.js`, `lib/integrity/context.js` |
| Ejecución e informe | `lib/integrity/index.js`, `lib/integrity/report.js` |
| Lectura de la base de datos (solo `select`, paginada) | `lib/integrity/snapshot.js` |
| Script de línea de comandos | `scripts/integrity-audit.mjs` |
| Ejecución periódica | `.github/workflows/integrity-audit.yml` |
| Pruebas de comportamiento (44) | `test/integrity-checks.test.mjs`, `test/integrity-report.test.mjs` |

### Relación con lo que ya existía

- **Panel → Datos → Salud** (`lib/panel/data-health.js`) mide **completitud**: campos vacíos, fuentes, autorías, escudos, imágenes sin multimedia. No se duplica.
- Estas comprobaciones miden **coherencia**: duplicados, contradicciones, referencias que la web no puede mostrar, fechas imposibles, URLs conservadas que dejarían de funcionar.
- `accompaniments` (legado bloqueado por #1139) no se audita ni se convierte: las conversiones de #1139, #1140 y #1145 no se repiten.

### Tres niveles, para no confundir errores con fichas por completar

| Nivel | Significado |
|---|---|
| **Error confirmado** | Contradicción demostrada por los propios datos |
| **Revisar** | Patrón sospechoso que necesita criterio editorial |
| **Dato incompleto** | Falta información; la ficha funciona pero pierde un enlace, una hora o una foto |

Cada incidencia incluye: tipo, entidad, identificador, motivo, gravedad y posible solución.

## Cómo se evitan falsos positivos

Cada regla se contrastó con producción antes de escribirla. Casos que **no** se marcan, a propósito:

- Dos imágenes o pasos con la misma advocación en Hermandades distintas (solo se comparan dentro de la misma Hermandad).
- Dos salidas de una Hermandad el mismo día con imágenes distintas: son cortejos distintos (El Amor y La Borriquita; El Cautivo y La Borriquita de Écija).
- Dos bandas distintas vigentes en el mismo paso (ida y regreso, capilla y coro): San Pablo, Pasión de Dos Hermanas, Negritos…
- La misma banda en dos posiciones de una salida (tramos): Panaderos, Vera-Cruz de Alcalá del Río, Hiniesta…
- Posiciones musicales sin banda pero con nota: «sin acompañamiento», «silencio documentado», matracas (9 casos en Écija, Carmona y Estepa).
- Bandas archivadas en periodos históricos que conservan su nombre público.
- Salidas sin slug: las citas puntuales no necesitan página propia.
- Municipio de la salida distinto al de la Hermandad (Los Rosales es pedanía de Tocina; actos en la capital).
- Horarios previos a la salida (reparto de papeletas).
- URLs conservadas cuyo slug se deriva de «Hermandad + fecha» (Asunción y Pastora de Cantillana).
- Altas de Música 2027 sin fecha de fin: no son vigentes todavía, pero tampoco históricas (eran 20 avisos falsos en la primera versión).

## Informe de integridad del estado actual

**Cómo se obtuvo:** consultas SQL de solo lectura en producción (12/10/2026, 18:45–20:00), con la misma lógica que las comprobaciones automáticas. El script no pudo ejecutarse en vivo desde esta sesión porque su red bloquea Supabase.

| Nivel | Lectura completa | Modo público (ejecución semanal) |
|---|---|---|
| Error confirmado | 7 | 7 |
| Revisar | 33 | 21 (sin las 12 relaciones en borrador, que RLS oculta) |
| Dato incompleto | 45 (incluye 4 resúmenes de portadas) | 44 (sin la portada con derechos pendientes) |

**Criterio de aceptación de la primera ejecución en GitHub Actions: debe reproducir la columna «Modo público»** (salvo cambios editoriales hechos entretanto).

Lo sano: 0 referencias rotas, 0 relaciones a entidades de otro tipo, 0 relaciones publicadas hacia fichas no publicadas, coherencia Imagen ↔ Paso ↔ Hermandad, ningún paso ni titular repartido entre Hermandades, 0 portadas ambiguas, fechas de salidas y cultos coherentes, 0 acompañamientos históricos sin fin y **208 de las 209 URLs conservadas de la Agenda resuelven**.

### Errores confirmados (7)

| Incidencia | Entidad | Identificadores | Motivo | Solución propuesta |
|---|---|---|---|---|
| Salida duplicada | Las Cigarreras · Jueves Santo 2026 | `195e7c51…` (sin slug, 22/08) y `ec8adb13…` (`cigarreras-estacion-penitencia-2026`, 14/09) | Comparten la Victoria y el Señor de la Columna; la música está repartida entre ambas. Es la P1-3 de la auditoría del 11/10, aún sin aplicar | Fusión gobernada: conservar `ec8adb13` con toda la música y fuentes; archivar `195e7c51` sin borrar su ID |
| Relación vigente duplicada | Cristo de la Expiración (El Cachorro) → su paso | `ec160000-…-0009` (`processes_on`) y `6978634d…` (`processional`) | La misma relación Imagen ↔ Paso aparece dos veces | Archivar `ec160000-…-0009` y conservar la canónica de #1145 |
| Relación vigente duplicada | Patrocinio (El Cachorro) → su palio | `ec160000-…-0010` y `a4895ec2…` | Ídem | Ídem con `ec160000-…-0010` |
| Periodos solapados | San Esteban · palio · Las Cigarreras | `18ca9f4a…` (2009–2026) y `a9562180…` (2009–2020) | Mismo inicio y dos fines distintos: fin contradictorio | Conservar 2009–2026 (coherente con el cambio de 2027) y archivar el otro tras revisar su fuente |
| Periodos solapados | Valvanera · Las Nieves de Olivares | `6f5a60f6…` (desde 2014, vigente) y `8f1650c1…` (2026–2026, vigente) | La misma banda vigente dos veces en el mismo paso | Unificar en el periodo «desde 2014» y pasar la fuente de 2026 a ese registro |
| Periodos solapados | Confalón de Écija · Columna · Sangre de San Benito | `a5cdcae8…` (2020–2026) y `c0160036-1313-…` (2026–2026) | El periodo de 2026 está contenido en el de 2020–2026 | Unificar conservando la fuente de 2026 |
| URL conservada que da 404 | `/extraordinarias/nuestro-padre-jesus-preso-moriles-2026` | Salida extraordinaria de Jesús Preso de Moriles | Está en el manifiesto de 209 URLs, pero Moriles es de la provincia de Córdoba y la ruta de extraordinarias solo lee la provincia de Sevilla (`extraordinary-detail.js`). Confirmado por código | **Decidido el 12/10: Moriles queda fuera del proyecto.** La URL se retira del manifiesto (208 URLs conservadas). No estaba en el sitemap |

### Revisar (33)

| Incidencia | Casos | Detalle |
|---|---|---|
| Relación sin publicar entre fichas publicadas *(lectura completa)* | 12 | **Montserrat**: titular Cristo de la Conversión y paso de palio en borrador. **Divino Perdón** y **Desamparados del Santo Ángel**: su paso. Titulares en revisión de Los Rosales, Moriles, Aznalcázar, El Castillo de las Guardas, Paradas y Vera Cruz de Sanlúcar. Santa Cruz de Abajo y Santa Elena con su paso. La web no muestra ninguna de estas relaciones |
| Acompañamiento en paso que la Hermandad no muestra | 9 | Mismos pasos de Divino Perdón (×2), Desamparados y Montserrat; Castilblanco, Mairena del Alcor (×2) y Santa Cruz con el paso en revisión o borrador; Calle Real de Castilleja (paso de misterio en borrador y sin relación) |
| Salida sin Hermandad, organizador ni entidades | 6 | Aurora (Fuentes de Andalucía), Corona Dolorosa (Arahal), Lignum Crucis (Valencina), Marismas (Pinzón), Mayor Dolor y Traspaso (Tocina), San Francisco (Estepa) |
| Salida de Hermandad no publicada | 2 | Traslado de los Dolores de La Roda (2/11, próximo) y Rosario de San Juan Bautista: se muestran por el nombre del organizador, sin enlace |
| Alta de Música 2027 ya marcada vigente | 2 | San Esteban (`30d8477f…`, Santa Ana) y Calle Real de Castilleja (`15c7978e…`, Cigarreras). Son las únicas 2 de 46 altas 2027 marcadas así; las fichas las presentan como acompañamiento actual. **Confirmado el 12/10: ambas Hermandades han cambiado de banda estos días.** El cambio es real; queda por unificar el criterio de «vigente» con las otras 44 altas |
| Posible marcha duplicada | 1 | «Tú eres el orgullo de nuestro pueblo» (Pablo Ojeda), dos slugs. Ya señalada el 11/10 |
| Culto a imagen sin relación con su Hermandad | 1 | Eucaristía a San Juan Bosco (Trinidad): la imagen no está vinculada a ninguna Hermandad (P2-3 del 11/10) |

### Datos incompletos (45)

| Incidencia | Casos |
|---|---|
| Fichas sin fotografía de portada | 4 conjuntos: 451/480 pasos, 641/686 imágenes, 275/289 Hermandades, 150/152 bandas |
| Próximas citas sin hora o lugar | 20 de 33 próximas |
| Bandas en borrador usadas en acompañamientos públicos | 11 bandas (formaciones de Jaén, Córdoba, Cáceres, Jerez…); incluye la **Banda Municipal de Bollullos del Condado** unificada en la Tarea 05, que sigue en borrador |
| Salidas vinculadas a fichas no publicadas | 7 |
| Banda sin ficha en la música de una salida | 2 (Bollullos en Aznalcázar, 22/08) |
| Portada con derechos pendientes *(lectura completa)* | 1 (Banderín de Presentación al Pueblo) |

### Observaciones sin comprobación automática

- **Vocabulario de relaciones irregular.** Un mismo significado aparece con varios valores: `processes_on`, `Procesiona en`, `procesiona_en`, `processional`…; `titular` y `Titular`. Hoy no rompe nada (las comprobaciones lo normalizan), pero conviene unificarlo en una tarea propia con migración reproducible.
- **33 personas publicadas sin ficha de Persona.** Ya las informa Salud como «Nodo publicado sin ficha editable».

## Catálogo de comprobaciones (36)

| Área | Comprobación | Nivel |
|---|---|---|
| Hermandades, imágenes y pasos | Relación con entidad de otro tipo · Relación publicada hacia no publicada* · Relación sin publicar entre publicadas* · Relación vigente duplicada · Imagen en paso de otra Hermandad | Error / Revisar |
| | Imagen titular de varias Hermandades · Paso en varias Hermandades · Posible duplicado en la misma Hermandad · Posible marcha duplicada · Portada que la web descarta* · Portada ambigua o compartida · Hermandad fuera de la provincia de Sevilla | Revisar |
| | Fichas sin portada (resumen por tipo) | Incompleto |
| Bandas y acompañamientos | Referencia de otro tipo · Sin nombre de banda · Fechas invertidas · Vigente con fin pasado · Periodos solapados de la misma banda · Música de la próxima temporada contradice el histórico · Formación repetida en la misma posición · Música en paso de otra Hermandad | Error |
| | Paso que la Hermandad no muestra · Alta futura ya vigente · Posición sin banda ni explicación | Revisar |
| | Banda en borrador · Histórico sin fin · Banda sin ficha en una salida | Incompleto |
| Agenda | Salida duplicada · Fechas incoherentes · URL conservada que no resuelve | Error |
| | Sin organizador · Hermandad no publicada · Culto a imagen ajena · Salida fuera de la provincia de Sevilla | Revisar |
| | Vinculada a ficha no publicada · Próxima cita incompleta | Incompleto |

\* Requieren lectura completa (clave secreta). En modo público se indican como «no evaluadas».

La temporada musical cambia el Domingo de Ramos: hasta el 21/03/2027, «vigente» significa 2026 y Música 2027 es la temporada siguiente. La fecha de referencia es siempre la de Madrid.

## Pruebas ejecutadas

| Prueba | Resultado |
|---|---|
| 44 pruebas nuevas de comportamiento (casos reales: Cachorro, Cigarreras, San Esteban, Valvanera, Montserrat, Moriles, cortejos dobles, silencios documentados…) | 44/44, en UTC, UTC+14 y UTC−11 |
| Suite completa local (`node --test`) | 1.700 pruebas: 1.696 correctas; las 4 que fallan ya fallaban antes y dependen de paquetes no instalables en esta sesión (sin acceso al registro de npm) |
| Script sin credenciales / argumentos o valores erróneos / ayuda | Salida 2 con mensaje claro / 2 / 0 (cubierto por prueba) |
| Revisión independiente del código (agente sin contexto previo) | 7 errores encontrados y corregidos, entre ellos 20 avisos falsos en altas de Música 2027 y una URL rota que la primera versión no veía |
| Paridad de `slugify` con `glory-directory.js` | Correcta |
| Cifras de producción | Calculadas en SQL de solo lectura (tabla superior) |
| Ejecución en vivo del script contra Supabase | **Pendiente**: la red de esta sesión bloquea Supabase. Se valida en la primera ejecución de GitHub Actions |
| `npm run build` | Lo ejecuta la CI de la PR (no afecta a rutas ni componentes) |

Las pruebas detectaron un error antes de llegar a producción: un año ausente se convertía en «año 0», y todos los periodos vigentes sin fecha de fin habrían aparecido como terminados.

## Ejecución periódica sin costes innecesarios

**Propuesta: GitHub Actions, lunes a las 07:47 (Madrid), en modo público.**

- **Coste:** cero. Actions es gratuito en repositorios públicos; cada ejecución dura alrededor de un minuto y hace unas 35 lecturas a Supabase. No usa Vercel ni funciones.
- **Sin clave secreta en GitHub.** Basta con la URL y la clave publicable de Supabase, que ya son públicas (las usa el navegador). Se configuran una vez en *Settings → Secrets and variables → Actions* como `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Mientras no existan, el flujo termina sin error y lo indica.
- **Resultado:** informe en el resumen de la ejecución y JSON completo como artefacto durante 30 días. No falla por defecto; se puede pedir que falle si hay errores (`fail_on=error`).
- **Auditoría completa bajo demanda:** con la clave secreta en un `.env` local, `node scripts/integrity-audit.mjs` activa las 3 comprobaciones que necesitan ver borradores.

Opcional, en una fase posterior: mostrar el informe en Panel → Datos → Salud. Queda fuera de esta tarea porque implica componentes visuales.

## Riesgos

- Si una regla editorial cambia (por ejemplo, el criterio de las altas de Música 2027), la comprobación correspondiente puede necesitar ajuste.
- Las comprobaciones de duplicados son heurísticas («Revisar»), salvo cuando hay solape demostrado («Error»).
- La primera ejecución en vivo puede revelar diferencias de permisos de lectura no vistas en SQL; el script informa cada comprobación fallida sin detener el resto.

## Decisiones del propietario · 12/10/2026 (tarde)

- **#1156 autorizada y fusionada** (`16ef752`). Producción READY sobre ese commit y CI en verde. El flujo «Integridad de datos» se lanzó a mano y terminó correctamente sin leer nada, porque aún faltan `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- **San Esteban y Calle Real de Castilleja** han cambiado de banda estos días: los dos avisos de «alta 2027 ya vigente» responden a cambios reales. Siguen en «Revisar» hasta unificar el criterio con las otras 44 altas.
- **Moriles (Córdoba) queda fuera del proyecto.** En la PR «fix(agenda): Moriles fuera del ámbito»:
  - se retira su URL del manifiesto de la Agenda;
  - se añaden dos comprobaciones de ámbito («Hermandad / salida fuera de la provincia de Sevilla») para detectar casos futuros.
- Con esa PR, las cifras esperadas en modo público pasan a: **6 errores, 23 a revisar** (se suman la Hermandad y la salida de Moriles) **y 44 datos incompletos**.
- **Propuesto, sin ejecutar (requiere autorización):** archivar las tres fichas publicadas de Moriles: la Hermandad (`/hermandades/jesus-preso-moriles`), su imagen titular y la salida del 19/09. Es reversible, pero deja de servir una página pública.
