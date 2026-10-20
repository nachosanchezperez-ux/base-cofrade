# Auditoría y plan · coletillas genéricas en los cultos

**Fecha:** 19 de octubre de 2026
**Decisión del propietario:** «prepara para borrar» (19/10, 00:17).
**Estado:** **APPLY EJECUTADO Y VERIFICADO** (19/10/2026, ~00:45), con autorización expresa del propietario («Hazlo», 00:43).

## Qué se borra
Las descripciones de culto que no informan al lector, sino que son notas de procedencia cargadas en `public.cults.description`. Desde #1287 ya están ocultas en la web; este plan las vacía también en la base de datos.

Solo se toca la columna `description`, que pasa a `NULL`; la columna admite nulos y la tabla no tiene disparadores. El título, el tipo, las fechas, las notas, las relaciones y el estado de cada culto **no cambian**.

## Auditoría (solo lectura, 19/10/2026)
- **157 cultos**, todos publicados, de **35 hermandades**. No hay ninguno en borrador.
- Coincidencia **exacta** con 10 frases de una lista cerrada. No se usa ningún patrón, así que una descripción con contenido propio no puede verse afectada.
- 9 de esos cultos tienen notas internas (`notes`); no se tocan.
- Huella de control: md5 de «id|descripción» ordenado por id = `6193c316a210248fdd7caceb609ece44`.

| Frase | Cultos |
|---|---|
| Culto anual documentado por la corporación. | 82 |
| Culto anual documentado por la Hermandad. | 17 |
| Culto anual documentado por la corporación o la ficha institucional. | 16 |
| Culto anual documentado en el calendario oficial de la Archicofradía. | 15 |
| Culto documentado para la edición de 2026. | 8 |
| Culto anual recogido en las Reglas y fuentes oficiales. | 7 |
| Culto anual de la corporación. | 6 |
| Culto interno documentado en la agenda oficial de la Hermandad. | 4 |
| Culto anunciado en el calendario oficial de 2026. | 1 |
| Culto incluido en el calendario oficial del curso 2026-2027 de la Archicofradía. | 1 |

**Por hermandad:** Siete Palabras (16), Buen Fin (10), Santa Genoveva (7), Vera Cruz (7), Candelaria (6), Amargura (6), Redención (6), Hiniesta (6), San Roque (6), La Cena (6), Santa Marta (6), Estrella (5), La O (5), Estudiantes (5), Amor (5), Javieres (5), San Isidoro (5), Montserrat (5), Cigarreras (4), Pasión (4), Monte-Sion (4), Resurrección (4), Quinta Angustia (4), Soledad de San Buenaventura (4), Pilar (3), Rosario de los Humeros (3), Angustias de Estepa (2) y 1 cada una: Asunción, Calvario, Dulce Nombre, Estudiantes, Remedios y San Pedro (Estepa), San Pablo y Nieves.

**Se conservan**, porque aportan información aunque empiecen por «Culto…»: por ejemplo, «Culto de cinco días que culmina el primer sábado de Cuaresma» o «Culto documentado en la historia de la corporación; calendario actual no fijado».

## Archivos
Todos están en `supabase/migrations_archive/post-first-edition-editorial/`, fuera de la cadena que Supabase ejecuta automáticamente:

1. `20261019010000_preflight_coletillas_cultos.sql`: hace el cambio y **siempre lo deshace**.
2. `20261019010100_apply_coletillas_cultos.sql`: el borrado, en una sola transacción.
3. `20261019010200_rollback_coletillas_cultos.sql`: la reversión, con los 157 identificadores y su frase original.

Copia de seguridad: `docs/datos/coletillas-cultos-2026-10-19.json`, con cada frase y los identificadores que la llevaban. Su huella, recalculada en local, coincide con la auditada.

## Guardas
El Apply solo modifica si se cumplen las tres condiciones; si falla una, se deshace entero:
- coinciden exactamente 157 filas;
- la huella es la auditada, es decir, ningún culto ha cambiado desde la auditoría;
- el `UPDATE` afecta exactamente a 157 filas.

## Preflight (19/10/2026)
Resultado: `PREFLIGHT_COLETILLAS_OK_ROLLED_BACK: 157 filas actualizables, huella verificada`.

Comprobado después: las 82 frases de «…por la corporación.» siguen en su sitio, no hay vacías nuevas (15, las que ya existían) y no quedan tablas temporales.

**Reversión ensayada:** ejecutada tal cual sobre los datos actuales. Su guarda la detuvo sin tocar nada (`0 de 157 siguen vacías`) y confirmó que la copia coincide fila a fila con la base de datos (157/157). El archivo es válido y restaurable.

## Procedimiento cuando se autorice
1. Repetir el preflight; debe devolver `PREFLIGHT_COLETILLAS_OK_ROLLED_BACK`.
2. Ejecutar el Apply; debe devolver `APPLY_COLETILLAS_OK_COMMITTED: 157`.
3. Comprobar: 0 cultos con alguna de las 10 frases y 157 + 15 = 172 descripciones vacías.
4. Revisar en la web La O, Siete Palabras y una de Estepa: sin coletilla (ya estaba oculta) y sin errores.
5. Opcional, en una PR aparte: retirar el filtro de pantalla de `lib/brotherhood-ficha-content.js`. Recomendación: mantenerlo como protección por si se vuelven a cargar notas de procedencia como descripción.

## Recuperación
Ejecutar `20261019010200_rollback_coletillas_cultos.sql`. Solo restaura si las 157 siguen vacías; si alguien ha escrito una descripción nueva en alguno de esos cultos, se detiene sin tocar nada para revisarlo a mano.

## Certificación del Apply (19/10/2026)
1. Preflight repetido: `PREFLIGHT_COLETILLAS_OK_ROLLED_BACK: 157 filas actualizables, huella verificada`.
2. Apply ejecutado (`20261019010100_apply_coletillas_cultos.sql`) sin errores; las guardas se superaron.
3. Comprobación en la base de datos:
   - coletillas restantes: **0**;
   - descripciones vacías: **172** (157 + 15 previas);
   - cultos totales: 692 (687 publicados), sin cambios;
   - títulos intactos (por ejemplo, «Solemne Quinario a Nuestro Padre Jesús Nazareno» de La O);
   - las descripciones con contenido se conservan;
   - no quedan tablas temporales.
4. Comprobación en la web: La O (5 cultos), Siete Palabras (16) y Angustias de Estepa (2) sin coletilla y sin errores de consola.

Reversión disponible: `20261019010200_rollback_coletillas_cultos.sql`, ensayada y válida.
