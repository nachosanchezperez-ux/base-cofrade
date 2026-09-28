# Profundización de ficha · Divina Pastora de Marchena

Fecha: 28/09/2026.

## Ficha activa

- Hermandad: Divina Pastora de Marchena
- entity_id: `15e73dd0-c6da-4116-8801-9c868bc09b86`
- slug: `divina-pastora-marchena`
- alcance: una sola ficha pública
- arquitectura: sin DDL, sin RLS, sin migraciones

## Estado inicial

La ficha ya conserva correctamente identidad institucional, municipio, tipología de Gloria, mes procesional, colores rojo/blanco, escudo autorizado y fotografía autorizada. También existen la salida del 19/09/2026, la Banda Municipal de Música de Arahal y su posición/asignación musical.

### P0

1. La salida del 19/09/2026 sigue como `announced` pese a existir evidencia posterior de celebración.
2. El periodo musical del 19/09/2026 conserva `is_current=true` aunque está acotado por `date_to=2026-09-19`.

### P1

- sede canónica no relacionada;
- titular no modelada;
- Paso actual no modelado;
- Cultos 2026 no modelados.

### P2

- historia de recuperación de 2015;
- serie procesional;
- relación Salida ↔ Imagen ↔ Paso ↔ Banda;
- capataces vigentes en 2026;
- trazabilidad de cada dato.

## Deuda legítima

No se fuerza:

- fecha formal de constitución del actual Redil Eucarístico;
- autoría de la imagen, mantenida como anónima;
- autoría y datación material del Paso actual;
- inventario exhaustivo de patrimonio;
- multimedia adicional.

## Plan exacto

### REUSE

- Hermandad `15e73dd0-c6da-4116-8801-9c868bc09b86`;
- municipio Marchena `8f1ef927-afb7-4694-a253-69f281074d6e`;
- Banda Municipal de Música de Arahal `95e4daf1-9db6-4bdb-805a-9f68833c8da1`;
- salida 2026 `5d8c29b6-9f66-49ea-a059-5314ce4d4495`;
- periodo musical `100cbe0e-d284-43ec-bb09-1093200a6368`;
- posición musical `bf8b7e54-d420-4de1-aa2e-759b62a73346`;
- asignación musical `ca8b4fb1-f1e4-4724-884d-da0682a87904`;
- programa directo del Redil `36534e14-a7c7-4455-ad76-a3dae9d54e68`;
- fuente previa de recorrido `f79ed51f-a856-41ff-b67d-0f5edda7b5ac`;
- fotografía autorizada `49f07dae-f536-4fa4-997a-83856557efe5`;
- escudo y colores existentes.

### INSERT

- Parroquia Matriz de San Juan Bautista como Lugar canónico;
- Imagen Divina Pastora de las Almas de Marchena;
- Paso procesional de la Divina Pastora de Marchena;
- relaciones Hermandad–Imagen, Hermandad–Paso e Imagen–Paso;
- reutilización de la fotografía autorizada como portada de la Imagen;
- Samuel González Ramírez y Sebastián Martín Morán, con periodos de capataz desde 29/06/2026;
- Triduo recurrente + edición 2026;
- Función Principal recurrente + edición 2026;
- Rosario de Vísperas concreto de 2026;
- serie anual de la procesión de septiembre;
- participantes Imagen/Paso de la salida 2026;
- acontecimiento histórico de recuperación del culto y de la procesión en 2015;
- cuatro Fuentes nuevas, estrictamente scoped;
- vínculos documentales de relaciones, Cultos, Salida, música y capataces.

### UPDATE

- Hermandad: sede canónica e historia suficiente;
- Salida 2026: `announced → held`, sede de origen/destino y serie;
- periodo musical 2026: `is_current → false` y relación con Paso;
- posición musical: relación con Paso.

### NO ACTION

- escudo;
- colores rojo/blanco;
- ruta y hora 19:30 de la salida;
- asignación Banda de Arahal;
- multimedia nueva;
- foundation_text.

### BLOCKED / deuda legítima

- autor de la Imagen;
- fecha formal del Redil actual;
- autoría/materiales históricos del Paso actual;
- patrimonio menor.

## Fuentes y scoping

- Programa directo del Redil: identidad, sede, recorrido y música 2026.
- Marchena Secreta 09/09/2026: Triduo, Función y Rosario de Vísperas.
- Marchena Secreta 19/09/2026: celebración efectiva, salida y Banda.
- Diario Avanza 16/09/2026: nombramiento de capataces.
- ArteSacro 25/04/2015: procedencia, datación aproximada y recuperación de culto de la Imagen.

## Puertas

`manifest → preflight → dry-run → ROLLBACK → 0 residuos → staging → revisión → Apply → QA → certificación`

FIRST EDITION FREEZE prevalece.