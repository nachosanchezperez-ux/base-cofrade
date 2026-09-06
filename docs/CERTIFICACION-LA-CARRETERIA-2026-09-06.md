# Certificación editorial · La Carretería · 6 de septiembre de 2026

## Resultado

**LA CARRETERÍA → CERRADA Y CERTIFICADA · 100 % TÉCNICO · INDEXABLE · GRAFO NUCLEAR LIMPIO.**

PR funcional: [#669](https://github.com/nachosanchezperez-ux/base-cofrade/pull/669).  
Migración de repositorio: `20260906230000_cierra_la_carreteria.sql`.  
SHA funcional: `67cf37ffb30cb0343a4560160f5bc83f512db14c`.  
Deployment certificado: `dpl_2DrWFAFTja9hW23XNouFYTNbtJCa`.

## Inventario certificado

- 4 sedes publicadas con cronología histórica;
- 3 titulares canónicos publicados;
- 8 cultos recurrentes y 1 ocurrencia de 2026;
- 2 series habituales diferenciadas;
- 3 salidas publicadas: estación de penitencia de 2026, Vía Crucis de 2026 y Vía Crucis del Consejo de 2010;
- 2 capataces actuales vinculados a sus Pasos;
- 8 bienes patrimoniales nucleares;
- 0 salidas sin Fuente;
- 0 grupos duplicados de titulares;
- completitud técnica: 100 %.

## Criterio editorial

- las sedes históricas se modelan como periodos, sin sustituir la sede canónica actual;
- la estación de penitencia y el Vía Crucis se conservan como series distintas;
- los acompañamientos musicales de 2026 quedan vinculados a la salida y al Paso correspondiente;
- las piezas procesionales dependen de sus Pasos;
- Cruz de Guía, Sinelabe y Libro de Reglas permanecen como patrimonio corporativo;
- el titular heredado duplicado se archiva sin borrar historia;
- no se inventan horarios ni ediciones no documentadas.

## Fuentes principales

- web y boletín oficiales de la Hermandad para historia, sedes, cultos y patrimonio;
- Consejo General de Hermandades y Cofradías para perfil y estación de penitencia;
- información municipal y periodística para la celebración y el itinerario de 2026.

## QA

- migración DML idempotente ejecutada una vez y dos veces consecutivas dentro de transacciones revertidas antes de producción;
- `npm test`: 608 pruebas superadas;
- `npm run build`: correcto;
- CI #1793: correcta;
- preview de Vercel: `READY`;
- producción: `READY` sobre el mismo SHA de `main`;
- ficha pública: HTTP 200;
- canonical exacta;
- robots: `index, follow`;
- bloques públicos comprobados: sede, titulares, pasos, música, historia, túnica, salidas, cultos, patrimonio y fuentes;
- errores runtime en la ventana posterior: 0.

## Restricciones respetadas

No se introdujeron DDL, nuevas tablas, cambios RLS, arquitectura ni UX. #492 permanece abierta y aislada: su fallo histórico de Preview ocurrió antes de alcanzar esta migración y no afecta a la aplicación productiva verificada.

## Auditor

Supabase registra también una aplicación operativa con timestamp propio. El DML es idempotente y el inventario final no contiene duplicados; no se modifica manualmente el historial de migraciones.
