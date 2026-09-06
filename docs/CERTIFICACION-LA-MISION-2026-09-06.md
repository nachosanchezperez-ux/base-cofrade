# Certificación editorial · La Misión · 6 de septiembre de 2026

## Resultado

**LA MISIÓN DE HELIÓPOLIS → CERRADA Y CERTIFICADA · 100 % TÉCNICO · INDEXABLE · GRAFO NUCLEAR LIMPIO.**

PR funcional: [#671](https://github.com/nachosanchezperez-ux/base-cofrade/pull/671).
Migración de repositorio: `20260907002000_cierra_la_mision.sql`.
Registro operativo Supabase: `20260906223020 · cierra_la_mision`.
SHA funcional: `fb54dad60e4f5b1356934fb972f5726383e8fea5`.
Deployment certificado: `dpl_4U3KuWTSvsGpM4bnSdVjCukjn94p`.

## Identidad auditada

El cierre corresponde exclusivamente a la **Hermandad de la Misión de Heliópolis**, con sede en la Parroquia de San Antonio María Claret y slug `hermandad-de-la-mision-sevilla`.

No se ha mezclado con ninguna corporación homónima de Málaga ni con la misión extraordinaria de la Virgen de los Dolores del Cerro del Águila.

## Inventario certificado

- 1 sede canónica relacional;
- 4 imágenes titulares publicadas;
- 2 titularidades no visuales: Santísimo Sacramento y San Antonio María Claret;
- 2 pasos procesionales: misterio y Gloria;
- 12 cultos recurrentes;
- 11 ocurrencias de cultos de 2026;
- 3 series habituales: estación de penitencia, procesión de Gloria y procesión eucarística;
- 3 salidas concretas de 2026;
- 3 posiciones y 3 asignaciones musicales;
- 2 estrenos patrimoniales de 2026 vinculados al Santo Cristo;
- 33 enlaces de Fuente en el núcleo auditado;
- 0 cultos duplicados;
- 0 slugs de salida duplicados;
- 0 salidas sin Fuente;
- completitud técnica: 100 %.

## Actualidad estricta

- La estación de penitencia del 27 de marzo de 2026 queda `held`: el boletín oficial de mayo ofrece una memoria posterior, cifra 621 participantes y confirma horarios y acompañamientos.
- La procesión eucarística del 31 de mayo y la procesión del Inmaculado Corazón de María del 13 de junio permanecen `announced`: las fuentes localizadas son convocatorias previas, no pruebas posteriores de celebración.
- La fecha eucarística de 2026 se fija en el 31 de mayo porque el boletín oficial concreto prevalece sobre la entrada genérica del calendario.
- La participación de la corporación en el Corpus de la Catedral no se convierte en una salida propia.
- La Novena de junio permanece `announced` por el mismo criterio de evidencia posterior.
- Ningún culto ni salida futura está marcado como celebrado.

## Relaciones y patrimonio

- Santísimo Sacramento y San Antonio María Claret se modelan como advocaciones titulares, sin fabricar imágenes físicas.
- El paso del Inmaculado Corazón de María se relaciona con la Hermandad, la Imagen y Maestro Tejera, sin inventar autoría, cronología ni cuadrilla.
- La estación de penitencia conserva dos posiciones musicales: Columna y Azotes tras la Cruz de Guía y Las Cigarreras tras el misterio.
- La procesión de Gloria conserva a Maestro Tejera tras el paso, con el estado temporal de la salida todavía anunciado.
- Las potencias y los casquillos estrenados en 2026 dependen del Santo Cristo de la Misión, no de la Hermandad en abstracto.
- No se han incorporado fotografías nuevas por no disponer de una licencia de uso trazable.

## Fuentes principales

- web oficial de la Archicofradía para historia, sede, titularidades, imágenes, hábito y recorridos habituales;
- calendario oficial de cultos de 2026;
- Boletín de mayo de 2026 para la memoria de la estación y las convocatorias detalladas de las procesiones eucarística y de Gloria;
- comunicación oficial de Maestro Tejera ya existente para el acompañamiento de Gloria.

## QA

- una ejecución completa de la migración dentro de una transacción revertida;
- dos ejecuciones consecutivas dentro de una misma transacción revertida;
- `npm test`: 608 pruebas superadas;
- `npm run build`: correcto;
- CI #1797: correcta;
- preview de Vercel: `READY`;
- producción: `READY` sobre el mismo SHA de `main`;
- ficha pública: HTTP 200;
- canonical exacta;
- robots: `index, follow`;
- ancho de documento menor que el viewport en escritorio, sin desbordamiento horizontal;
- 0 imágenes rotas en la comprobación pública;
- bloques visibles: sede, titulares, pasos, música, túnica, salidas, cultos, web y fuentes;
- errores runtime `error/fatal` en la ventana posterior: 0.

## Restricciones respetadas

No se introdujeron DDL, nuevas tablas, cambios RLS, arquitectura, UX ni contenido procedente de homónimos. #492 permanece abierta y aislada: Supabase Preview falló en la migración histórica de Centuria Macarena antes de alcanzar el DML de La Misión.

## Auditor

- El hábito y los dos capataces de 2026 ya estaban correctamente modelados y no se duplicaron.
- El Santísimo Sacramento no se fuerza como Imagen; queda representado mediante identidad, relación titular, cultos y salida eucarística.
- La salida eucarística y la de Gloria no se presentan como celebradas por el mero hecho de que su fecha haya pasado.
- La ausencia de fotografías con derechos no reduce el cierre documental.
