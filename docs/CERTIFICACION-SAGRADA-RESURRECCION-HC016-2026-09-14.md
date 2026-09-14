# Certificación HC-016 · Sagrada Resurrección de Sevilla

**Corte:** 14 de septiembre de 2026

**Ámbito:** decimotercer contexto editorial real de HC-016

**Base reconciliada:** `9ff59aa4542bf1a976c29b38fad4acba9a6f1f86`

**Régimen:** `FIRST EDITION FREEZE` · solo DML editorial

## Resultado

La Sagrada Resurrección de Sevilla queda cerrada como decimotercer contexto real de HC-016. El lote recorrió carga, staging, preflight global, revisión, Apply y postflight. No incorporó DDL, tablas, índices, funciones, políticas RLS, cambios de producto ni activación de HC-018.

El cierre publica y relaciona:

- cinco titulares: Sagrada Resurrección, Nuestra Señora de la Aurora, María Santísima del Amor, Santa Marina y San Juan Bautista de La Salle;
- dos Pasos: Sagrada Resurrección y palio de la Aurora;
- siete relaciones de autoría documentadas, con reutilización de Francisco Buiza y Antonio Joaquín Dubé;
- cuatro Cultos recurrentes y cuatro ediciones de 2026, incluido el triduo de la Aurora con sus tres jornadas;
- la estación de penitencia del 5 de abril de 2026, de 08:15 a 16:30;
- tres posiciones musicales actuales y seis periodos musicales en total;
- nueve bienes patrimoniales, doce acontecimientos históricos, hábito nazareno y cuatro canales oficiales;
- siete Fuentes oficiales nuevas, dos ya existentes y diez Fuentes visibles en la ficha pública.

## Lote gobernado

| Lote | Estado | Preparadas | Aplicadas | Inválidas | Fallidas | Plan efectivo |
|---|---|---:|---:|---:|---:|---|
| `feb6f1c2-4df3-4208-a4d8-b808d97609e9` | `completed` | 164 | 164 | 0 | 0 | 160 insert · 4 update |

El preflight global fue limpio: 164/164 válidas, 0 colisiones y tres envíos de staging. Durante Apply aparecieron incompatibilidades de valores que la validación estructural no detectaba: `celebrated` frente a `held`, `twitter` frente a `x` y la ausencia de fecha inicial textual en un periodo musical. Se corrigieron dentro del mismo alcance mediante DML, se completaron las doce operaciones pendientes y el lote quedó reconciliado como `completed`, 164/164, con su auditoría persistida.

La receta canónica queda archivada en `20260914021602_cierra_sagrada_resurreccion_sevilla.sql`.

## Postflight relacional

| Familia | Resultado |
|---|---:|
| Hermandad | 1 |
| Imágenes titulares | 5 |
| Autorías | 7 |
| Pasos relacionados | 2 |
| Cultos / ediciones 2026 | 4 / 4 |
| Salidas | 1 |
| Posiciones / asignaciones musicales | 3 / 3 |
| Periodos musicales | 6 |
| Patrimonio | 9 |
| Acontecimientos | 12 |
| Hábito | 1 |
| Canales oficiales | 4 |
| Fuentes visibles | 10 |

- 0 duplicados nucleares entre titulares y Pasos.
- 0 relaciones troncales huérfanas de Imagen, Paso, Banda o Fuente.
- La cronología de Virgen de los Reyes queda corregida a 1983–1987 y desde 1989.
- Cruz Roja (1992–1993), Soledad de Cantillana (1994–1995) y Victoria de Las Cigarreras (desde 1996) quedan diferenciadas.
- La formación juvenil consta vigente en la Cruz de Guía en 2026 sin inventar el año de inicio.

## Verificación pública

La ficha `/hermandades/la-resurreccion` responde con el título SEO «La Resurrección (Sevilla): titulares y pasos · Hilo Cofrade». Publica 5 titulares, 2 Pasos, 3 bandas actuales, la Salida de 2026, 4 Cultos, hábito, cronología musical, canales y 10 Fuentes.

La navegación relacional enlaza titulares, Pasos, autores y Bandas. La comprobación pública no detectó errores propios de la ficha ni desbordamientos de contenido.

## Fuentes principales

- [Historia oficial](https://www.hermandaddelaresurreccion.com/historia/)
- [Ficha de la cofradía](https://www.hermandaddelaresurreccion.com/ficha-cofradia/)
- [Pasos procesionales](https://www.hermandaddelaresurreccion.com/pasos/)
- [Cronología musical](https://www.hermandaddelaresurreccion.com/musica/)
- [Sagrada Resurrección](https://www.hermandaddelaresurreccion.com/sagrada-resurreccion/)
- [Nuestra Señora de la Aurora](https://www.hermandaddelaresurreccion.com/nuestra-senora-de-la-aurora/)
- [Otros titulares](https://www.hermandaddelaresurreccion.com/otros-titulares/)
- [Estación de penitencia de 2026](https://www.hermandaddelaresurreccion.com/informacion-sobre-el-horario-e-itinerario-de-la-estacion-de-penitencia-2026/)

## Huecos legítimos

- escudo, cabecera y fotografías sin licencia o autorización reutilizable;
- año inicial de la Agrupación Musical Juvenil Virgen de los Reyes en la Cruz de Guía;
- cifras de hermanos o nazarenos, por su carácter volátil;
- horarios no acreditados de los Cultos y catálogo patrimonial exhaustivo;
- fases y personal de ejecución de los Pasos, cuyo modelado está fuera de la política de escritura de HC-016.

## Control técnico

- producción previa al lote `READY` sobre `9ff59aa4542bf1a976c29b38fad4acba9a6f1f86`;
- Supabase `ACTIVE_HEALTHY`, una sola rama principal y lote `completed` 164/164;
- #749–#761 absorbidas y 0 PR abiertas al iniciar el cierre documental;
- receta exclusivamente DML y archivada fuera de la cadena estructural activa.

El frente editorial queda cerrado. Los doce contextos anteriores permanecen preservados y no se abre otra Hermandad.
