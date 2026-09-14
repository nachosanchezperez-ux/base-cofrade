# Certificación HC-016 · Sábado Santo de Sevilla

**Corte:** 14 de septiembre de 2026

**Ámbito:** macrolote transversal editorial sobre las cinco Hermandades del Sábado Santo de Sevilla

**Base reconciliada:** `caddc48644ab78cc9505cdcd991cccc8df115acd`

**Régimen:** `FIRST EDITION FREEZE` · solo DML editorial

## Resultado

El Sábado Santo de Sevilla queda cubierto con sus cinco corporaciones publicadas: El Sol, Santo Entierro, Soledad de San Lorenzo, Trinidad y Servitas. El lote publica y completa El Sol, crea el Santo Entierro de Sevilla y completa Soledad de San Lorenzo. Trinidad y Servitas se preservan sin reabrir sus cierres.

El trabajo recorrió carga, staging, preflight global, revisión, Apply y postflight. No incorporó DDL, tablas, índices, funciones, políticas RLS, cambios de producto ni activación de HC-018.

## Lote gobernado

| Lote | Estado | Preparadas | Aplicadas | Inválidas | Fallidas | Plan efectivo |
|---|---|---:|---:|---:|---:|---|
| `7fe7b65d-4f00-4d40-906f-82df8ee7c0a2` | `completed` | 206 | 206 | 0 | 0 | 199 insert · 7 update |

El preflight global terminó con 206/206 registros válidos, cero colisiones y tres envíos protegidos. La barrera completa se volvió a comprobar antes de la primera escritura y Apply concluyó sin incidencias. La receta idempotente queda archivada en `20260914130000_cierra_sabado_santo_sevilla.sql`, fuera de la cadena estructural activa.

## Alcance editorial

| Familia | Filas del lote |
|---|---:|
| Fuentes | 14 |
| Lugares | 2 |
| Entidades | 31 |
| Perfiles de Hermandad | 3 |
| Imágenes / relaciones con Hermandad / autorías | 8 / 8 / 8 |
| Pasos / relaciones con Hermandad / relaciones con Imagen | 6 / 6 / 8 |
| Cultos / relaciones | 11 / 11 |
| Salidas / relaciones | 3 / 8 |
| Acontecimientos | 9 |
| Patrimonio | 2 |
| Hábitos | 3 |
| Bandas | 2 |
| Periodos musicales | 5 |
| Vínculos de Fuente | 57 |
| **Total** | **206** |

## Postflight por corporación trabajada

| Hermandad | Estado | Titulares | Pasos | Cultos | Salidas | Hitos visibles | Música vigente | Fuentes directas |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| El Sol | `published` | 4 | 2 | 5 | 1 | 3 | 3 | 6 |
| Santo Entierro | `published` | 3 | 3 | 3 | 1 | 4 | 2 | 4 |
| Soledad de San Lorenzo | `published` | 1 | 1 | 3 | 1 | 3 | silencio | 8 |

- El Sol conserva y actualiza sus dos periodos musicales ya existentes y añade la formación de apertura documentada en 2026.
- El Santo Entierro separa sus tres pasos y documenta los acompañamientos de la urna y el Duelo.
- Soledad de San Lorenzo conserva la ausencia de acompañamiento musical como característica documentada, no como deuda.
- No se incorporan las imágenes secundarias del Duelo sin expediente individual suficiente.
- No se incorporan escudos ni fotografías sin licencia o autorización reutilizable.

## Integridad relacional

- 0 nombres duplicados entre las entidades creadas y el grafo existente;
- 0 Imágenes sin relación con Hermandad;
- 0 Pasos sin relación con Hermandad;
- 0 Cultos sin titular relacionado;
- 0 Salidas sin entidad participante;
- Trinidad y Servitas continúan `published` en la jornada correcta.

## Verificación pública

La ruta `/hermandades/semana-santa/sevilla-capital/sabado-santo` publica exactamente cinco Hermandades y enlaza correctamente El Santo Entierro, El Sol, Soledad de San Lorenzo, Trinidad y Servitas.

Las tres fichas trabajadas responden con sede, denominación, jornada, titulares, Pasos, Cultos, Salida de 2026, acontecimientos y Fuentes. El Sol y Santo Entierro muestran sus acompañamientos vigentes; Soledad muestra su patrimonio musical separado, sin fingir acompañamiento procesional.

## Fuentes principales

- Consejo General de Hermandades y Cofradías de Sevilla: nómina oficial de 2026 y fichas de El Sol y Santo Entierro;
- web oficial de la Hermandad del Sol: identidad, titulares, Cultos y música;
- web oficial del Santo Entierro de Sevilla: identidad, cultos y documentación del Cristo Yacente;
- web oficial de la Soledad de San Lorenzo: titular, Paso, Función Principal y estación de penitencia;
- Planomato, solo como apoyo secundario para la configuración musical del Santo Entierro en 2026.

## Huecos legítimos

- escudos, cabeceras y fotografías sin licencia reutilizable;
- imágenes secundarias del Duelo sin expediente propio suficiente;
- catálogos patrimoniales y musicales exhaustivos;
- horarios o ediciones de Cultos no acreditados de forma inequívoca;
- cifras volátiles y responsables actuales;
- autorías, dataciones o intervenciones que las Fuentes no permiten afirmar.

## Control técnico

- `main` y producción partían alineados en `caddc48644ab78cc9505cdcd991cccc8df115acd`;
- producción `READY` en `dpl_Hnqt6jDkVQgENr5ra7TJWpHCXvxp` antes del lote;
- Supabase `ACTIVE_HEALTHY`, una sola rama principal y lote `completed` 206/206;
- 0 PR abiertas al iniciar el cierre;
- receta exclusivamente DML y archivada fuera de la cadena estructural activa.

El frente del Sábado Santo queda cerrado. Los trece contextos HC-016 y el macrolote de la Madrugá permanecen preservados.
