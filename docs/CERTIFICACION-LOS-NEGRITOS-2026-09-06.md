# Certificación editorial · Los Negritos

**Fecha:** 6 de septiembre de 2026  
**PR funcional:** [#676](https://github.com/nachosanchezperez-ux/base-cofrade/pull/676)  
**PR de ajuste relacional:** [#678](https://github.com/nachosanchezperez-ux/base-cofrade/pull/678)  
**Migraciones:** `20260907030000_cierra_los_negritos.sql` y `20260907031000_ajusta_paso_palio_negritos.sql`  
**Resultado:** cerrada y certificada · 100 % técnico

## Alcance certificado

- identidad completa, origen a finales del siglo XIV e historia institucional;
- sede canónica unívoca en la Capilla de Nuestra Señora de los Ángeles, Recaredo 19, con horario vigente;
- escudo oficial y paleta azul, blanco y celeste aplicada a la ficha;
- Santísimo Cristo de la Fundación y Nuestra Señora de los Ángeles Coronada publicados como titulares;
- autoría documentada de Andrés de Ocampo para el Cristo, anonimato de la Virgen e intervenciones de 1952 y 1984 diferenciadas;
- dos pasos procesionales vinculados a sus titulares;
- cuatro piezas patrimoniales dependientes de los pasos y dos insignias históricas dependientes de la Hermandad;
- ocho cultos recurrentes y ocho ocurrencias de 2026;
- estación de penitencia anual y edición de 2026 separadas del histórico extraordinario;
- Vía Crucis de las Cofradías de 1977 y tres salidas de la coronación pontificia de 2019;
- Capilla Musical Ars Sacra, Grupo de Voces Graves De Profundis y Las Nieves de Olivares vinculados a su posición y paso;
- capataces vigentes de ambos pasos;
- patrimonio musical previo conservado, incluida la dedicatoria de `Virgen de los Negritos`.

## Actualidad estricta

- la estación de penitencia de 2026 permanece `announced` porque la fuente localizada publica horario e itinerario el mismo día, pero no constituye memoria posterior;
- las ocurrencias de cultos de 2026 permanecen `announced` cuando solo existe convocatoria;
- el Vía Crucis de 1977 y las salidas de 2019 quedan `held` por documentación retrospectiva;
- no se inventan fechas exactas ni autorías cuando las fuentes mantienen una horquilla o anonimato;
- el escudo procede del recurso oficial publicado por la Hermandad.

## QA

- migración principal y ajuste DML idempotentes, ejecutados dos veces en una misma transacción con `ROLLBACK`;
- aplicación remota correcta y 83 migraciones registradas tras reconciliar el frente concurrente;
- `npm test`: 608 pruebas superadas en el cierre funcional;
- `npm run build`: correcto;
- completitud técnica: 100 %;
- sede actual: 1;
- titulares visuales: 2;
- pasos: 2;
- bienes patrimoniales ligados a pasos: 4;
- cultos y ocurrencias de 2026: 8 + 8;
- salidas concretas: 5;
- acompañamientos vigentes: 3;
- asignaciones musicales de la estación de 2026: 3;
- Vercel correcto para `main = 5c0d6e6daaa9bffc910de93e8087f9c82b075475`;
- ficha de Hermandad, dos fichas de titulares y dos fichas de pasos verificadas en producción;
- título SEO: `Los Negritos (Sevilla): titulares, pasos e historia · Hilo Cofrade`;
- 0 errores de la aplicación en la revisión pública.

## Reconciliación concurrente

La PR #677 de Pasión y Muerte apareció durante el control final. Su versión de migración coincidía con `20260907031000`; se renumeró a `20260907032000`, se actualizó su prueba, se esperó el despliegue verde y se integró después del ajuste de Los Negritos. No modifica el subgrafo certificado aquí. El corte termina con 0 PR abiertas y ambas fichas al 100 %.

## Límites respetados

- DDL: 0;
- tablas nuevas: 0;
- cambios RLS: 0;
- arquitectura: 0;
- UX nueva: 0;
- #492 permanece aislada.
