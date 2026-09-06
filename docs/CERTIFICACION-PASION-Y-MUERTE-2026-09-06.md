# Certificación editorial · Pasión y Muerte · 6 de septiembre de 2026

## Resultado

**PASIÓN Y MUERTE → CERRADA Y CERTIFICADA · 100 % TÉCNICO · INDEXABLE · GRAFO NUCLEAR LIMPIO.**

PR funcional: [#677](https://github.com/nachosanchezperez-ux/base-cofrade/pull/677).

Migración de repositorio: `20260907032000_cierra_pasion_y_muerte.sql`.

SHA funcional: `5c0d6e6daaa9bffc910de93e8087f9c82b075475`.

Deployment certificado: `dpl_ErcnVCGSYZH4BEfYgD2gHNfxgxmU`.

## Inventario certificado

| Control | Resultado |
| --- | ---: |
| Completitud técnica | 100 % |
| Sedes históricas o vigentes | 4 |
| Titulares visuales | 3 |
| Titularidades no visuales nuevas | 1 |
| Cultos recurrentes | 8 |
| Ocurrencias de 2026 | 8 |
| Series de salidas | 3 |
| Salidas publicadas | 3 |
| Asignaciones musicales de 2026 | 2 |
| Huecos de fuente del frente | 0 |
| Grupos duplicados nucleares | 0 |
| Salidas futuras marcadas como celebradas | 0 |

## Aportaciones verificadas

- se publican las sedes canónicas de Nuestra Señora de la O (1992–1997), San Vicente de Paúl (1997–2001) y Buen Aire (desde 2001), además de San Juan Bosco como sede de salida desde 2022;
- la Resurrección de Nuestro Señor se incorpora como titular no visual, sin crear una fotografía o talla inexistente;
- se documentan Vía Crucis, Quinario y Función del Cristo; Triduo y Función del Desconsuelo; Función de la Resurrección; y Triduo y Función Principal del Buen Aire;
- las reglas recurrentes quedan separadas de sus ocho ocurrencias de 2026;
- la estación de penitencia de 2026 queda `held`, con horario, itinerario y Capilla Musical Gólgota;
- la salida de Gloria de Santa María del Buen Aire del 26 de septiembre de 2026 queda `announced`, con la Banda Municipal de Música de Mairena del Alcor;
- la extraordinaria de 2016 a Santa Ana queda como hecho histórico sin inventar una fecha exacta;
- estación de penitencia, procesión de Gloria y Rosario público del Desconsuelo permanecen como series distintas.

## Actualidad estricta y deuda legítima

- la Gloria del 26 de septiembre conserva estado `announced` porque era futura en el corte editorial;
- no se inventa su itinerario exacto mientras la Hermandad no lo publique;
- las funciones pasadas que solo cuentan con convocatoria permanecen `announced`; solo Vía Crucis, Quinario, Triduo del Desconsuelo y estación pasan a `held` por disponer de memoria posterior;
- la Resurrección no genera deuda visual: la propia Hermandad declara que no posee imagen tallada;
- la relación madrina con la Estrella queda fechada y documentada, pero conserva `draft` mientras el nodo canónico de la Hermandad de la Estrella siga sin publicar;
- la ausencia de fotografías nuevas con derechos trazables no reduce el cierre documental.

## Fuentes principales

- [Historia oficial](https://hermandadpasionymuerte.es/?page_id=1363)
- [Sedes oficiales](https://hermandadpasionymuerte.es/?page_id=1314)
- [Resurrección de Nuestro Señor](https://hermandadpasionymuerte.es/?page_id=1307)
- [Nuestra Señora del Desconsuelo y Visitación](https://hermandadpasionymuerte.es/?page_id=1309)
- [Cultos del Santísimo Cristo en 2026](https://hermandadpasionymuerte.es/?p=3423)
- [Cultos del Desconsuelo en 2026](https://hermandadpasionymuerte.es/?p=3592)
- [Cultos de Santa María del Buen Aire en 2026](https://hermandadpasionymuerte.es/?p=3844)
- [Memoria posterior de la estación de penitencia](https://hermandadpasionymuerte.es/?p=3555)
- [Guía de la estación de penitencia de 2026](https://sevilla.abc.es/pasionensevilla/agenda-cofrade/viernes-de-dolores-2026-pasion-y-muerte.html)

## QA

- migración DML ejecutada dos veces dentro de una transacción revertida antes de la PR, repetida sobre cada nuevo `main` concurrente y aplicada una sola vez por la integración automática;
- `npm test`: 613 pruebas superadas;
- contrato específico: 5 pruebas superadas;
- `npm run build`: correcto;
- GitHub `verify`: correcto;
- preview de Vercel: `READY` en el SHA de la rama;
- producción: `READY` sobre el mismo SHA de `main`;
- ficha pública: HTTP 200, canonical exacta e `index, follow`;
- sede, cuatro titulares, tres pasos, música, historia, túnica, tres salidas, ocho cultos y Fuentes visibles;
- imágenes rotas: 0;
- errores runtime en la hora posterior: 0;
- PR abiertas al certificar: 0.

## Restricciones respetadas

No se introdujeron DDL, nuevas tablas, cambios RLS, arquitectura, UX ni multimedia inventada. #492 permanece abierta y aislada: Supabase Preview reprodujo el fallo histórico de `source_links_one_target` antes de alcanzar esta migración, mientras la ejecución productiva quedó validada.

## Auditor

- las PR concurrentes #676 y #678 se integraron antes de la versión final del cierre;
- se detectó y evitó una colisión temporal de versiones con la migración de #678;
- el commit concurrente final de la rama no modificó los dos archivos auditados;
- Supabase registra la aplicación operativa como `20260906234803 · cierra_pasion_y_muerte`; el inventario final demuestra una única aplicación material y cero duplicados.
