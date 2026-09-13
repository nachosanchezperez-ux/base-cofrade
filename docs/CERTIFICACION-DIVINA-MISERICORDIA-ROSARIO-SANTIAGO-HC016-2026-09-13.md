# Certificación HC-016 · Divina Misericordia · Rosario de Santiago

**Corte:** 13 de septiembre de 2026

**Ámbito:** undécimo contexto editorial real de HC-016

**Base reconciliada:** `ba4035789c4bfc46bb4af62f70d7ce1ea999f309`

**Régimen:** `FIRST EDITION FREEZE` · solo DML editorial

## Resultado

La Hermandad de la Divina Misericordia · Rosario de Santiago, única ficha publicada de Alcalá de Guadaíra en el corte territorial, queda cerrada como undécimo contexto real de HC-016. El trabajo recorrió carga, staging, preflight global, revisión, Apply y postflight en producción sin DDL, tablas, cambios RLS, código de producto ni activación de HC-018.

El cierre publica y relaciona:

- identidad de la corporación de Penitencia y Gloria y sede canónica en la Parroquia de Santiago el Mayor;
- cuatro titulares: Santísimo Cristo de la Divina Misericordia, Nuestra Señora la Virgen del Rosario de Santiago, María Santísima de la Trinidad y Patriarca Bendito Señor San José;
- autorías documentadas de Edwin González Solís, Manuel Pineda Calderón y David Valenciano Larios;
- dos Pasos: el ya existente de la Virgen del Rosario y el del Santísimo Cristo;
- nueve Cultos recurrentes, un hábito y la estadística documentada de 60 nazarenos en 2026;
- la estación de penitencia del 4 de abril de 2026 y la procesión de Gloria del 5 de octubre de 2025, sin mezclar ambos ejercicios;
- tres relaciones musicales: Capilla Musical Dulce Nombre y Escolanía de María Santísima de la Trinidad como vigentes confirmadas para 2026, y Banda de Alcalá exclusivamente como histórico de la Gloria de 2025;
- dos piezas patrimoniales, once hitos nuevos —doce visibles al conservar la igualá preexistente—, cinco canales oficiales y ocho Fuentes principales.

## Lotes gobernados

| Lote | Estado | Preparadas | Aplicadas | Inválidas | Fallidas |
|---|---|---:|---:|---:|---:|
| `577b05a4-6ae2-42b5-ad22-641e3fbf0602` · lote principal | `completed_with_errors` | 169 | 162 | 0 | 7 |
| `a658a495-7831-4368-ab18-eafb12575454` · reutilización Banda de Alcalá | `completed` | 5 | 5 | 0 | 0 |

Las siete incidencias del lote principal tienen una sola causa: se intentó crear una Banda de Música de Alcalá de Guadaíra cuyo `slug` ya pertenecía a la ficha canónica **Banda de Alcalá** (`8e754023-a46a-4587-8952-4696c70d0bd0`). El conflicto inicial de la entidad y su perfil provocó cinco fallos relacionales en cascada. El remate omitió ambos registros redundantes, reutilizó la ficha existente sin empobrecerla y aplicó las cinco relaciones dependientes. Resultado lógico: **167 operaciones efectivas, 2 reutilizaciones semánticas y 0 fallos pendientes**.

La receta DML canónica está archivada en `20260913210000_cierra_divina_misericordia_rosario_santiago.sql` y ya incorpora directamente la reutilización correcta.

## Postflight relacional

| Familia | Resultado |
|---|---:|
| Hermandad | 1 |
| Imágenes titulares | 4 |
| Autorías | 4 |
| Pasos relacionados | 2 |
| Relaciones Imagen–Paso | 2 |
| Cultos / relaciones de Culto | 9 / 10 |
| Salidas / entidades de Salida | 2 / 2 |
| Posiciones / asignaciones musicales | 2 / 3 |
| Periodos musicales | 3 |
| Patrimonio | 2 |
| Acontecimientos visibles | 12 |
| Canales oficiales | 5 |

- 0 `slug` duplicados entre la Hermandad, sus cuatro Imágenes y sus dos Pasos.
- 0 relaciones troncales huérfanas.
- 0 entidades o relaciones troncales en borrador.
- 0 vínculos documentales sin Fuente.

## Verificación pública

La ficha de Hermandad y las cuatro fichas de Imagen responden con `index, follow`, título, H1 y canonical exacta. Las dos fichas de Paso responden y enlazan correctamente Hermandad e Imagen; mantienen el `noindex, follow` común de la superficie pública de Pasos, no una excepción creada por este lote. En las siete rutas verificadas hay 0 imágenes rotas.

- `/hermandades/divina-misericordia-rosario-santiago-alcala`
- `/imagenes/santisimo-cristo-divina-misericordia-alcala`
- `/imagenes/nuestra-senora-virgen-rosario-santiago-alcala`
- `/imagenes/maria-santisima-trinidad-alcala`
- `/imagenes/patriarca-bendito-senor-san-jose-alcala`
- `/pasos/paso-procesional-nuestra-senora-rosario-santiago-alcala`
- `/pasos/paso-santisimo-cristo-divina-misericordia-alcala`

## Fuentes principales

- [Parroquia de Santiago · Rosario de Santiago](https://parroquiasantiagoalcala.es/rosario-de-santiago/)
- [Web oficial](https://rosariodesantiago.blogspot.com/)
- [Historia oficial](https://rosariodesantiago.blogspot.com/p/historia.html)
- [Titulares oficiales](https://rosariodesantiago.blogspot.com/p/titulares.html)
- [Consejo de Hermandades de Alcalá · perfil institucional](https://www.consejohermandadesalcala.es/hermandad-de-la-divina-misericordia/)
- [Consejo de Hermandades de Alcalá · Glorias 2026](https://www.consejohermandadesalcala.es/tag/rosariosantiago/)
- [Semana Santa de Alcalá · Gloria 2025](https://www.ssantadealcala.org/2025/10/salida-rosario-santiago.html)
- [Semana Santa de Alcalá · Sábado Santo 2026](https://www.ssantadealcala.org/2026/04/sabadosanto-divinamisericordia.html)

## Huecos legítimos

- No se publica escudo ni fotografía propia sin una licencia o autorización de reutilización verificable.
- No se infiere continuidad de la Banda de Alcalá después de la procesión documentada de 2025.
- No se incorpora a María Santísima de la Trinidad al Paso penitencial: la Fuente institucional indica que todavía no procesiona en la estación de penitencia.
- No se completan dimensiones, restauraciones, autorías del Paso o inventarios patrimoniales exhaustivos sin evidencia precisa.
- Las fichas de Paso conservan la política general `noindex, follow`; modificarla sería un frente de producto ajeno a este DML.

## Control técnico

- `npm test`: **699/699**.
- `npm run build`: Next.js 16.3.0 compila y completa TypeScript; los avisos locales corresponden a la ausencia deliberada de variables públicas de Supabase en el entorno de build.
- `git diff --check`: limpio.
- #757, integrado de forma concurrente, queda preservado y su contrato de archivo también pasa en la suite.

El frente queda cerrado. Los diez contextos anteriores permanecen preservados y no se abre una duodécima Hermandad. Tras integrar esta certificación, el SHA final de `main` y su deployment productivo prevalecen sobre la base reconciliada indicada arriba.
