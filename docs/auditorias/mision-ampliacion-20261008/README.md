# La Misión · ampliación oficial · 8/10/2026

Continuación del encargo de contenido al recibir https://archicofradiamision.es.

## Datos aplicados
Seis UPDATE iniciales: historia, cuatro imágenes y hábito; después tres UPDATE descriptivos sobre las mismas filas para que las precisiones de las notas se lean en los campos públicos. No hay entidades ni fuentes nuevas. Cinco marcas de frescura y dos registros de auditoría.
- Corregida Saint-Eugène por Nuestra Señora de las Victorias de París, según historia oficial; origen de la matriz, no nacimiento universal de la devoción.
- Ampliadas fechas de 1949, 1987, 1988 y 2007 y el fervorín de Heliópolis.
- Cristo: 172 cm, anatomía, técnica e iconografía; piedras de la Vía Sacra y firma de la lagartija.
- Inmaculado Corazón: dimensiones documentadas sin asignar ejes no rotulados, técnica y escapulario.
- San Juan: talla completa, iconografía adolescente y procedencia de Jesús Despojado en 1986.
- Amparo: distinguida titular actual de Bonilla (1999) de la imagen previa (1967) remodelada en 1975; no se aplican intervenciones antiguas a la réplica.
- Hábito: cíngulo, antifaz, escapulario y prohibición de guantes. gloves_color queda NULL: su enum solo admite Blanco/Negro y no expresa ausencia.

## Fuentes existentes reutilizadas
https://archicofradiamision.es/historia/
https://archicofradiamision.es/santo-cristo-de-la-mision/
https://archicofradiamision.es/inmaculado-corazon-de-maria/
https://archicofradiamision.es/nuestra-senora-del-amparo/
https://archicofradiamision.es/san-juan-evangelista/
https://archicofradiamision.es/cofradia/

Cada fila contaba ya con enlace de Fuente correspondiente. No se duplican.
No se convierte un recorrido genérico sin año en convocatoria anual ni se reproduce la biografía de Claret, que contiene erratas históricas evidentes.

## Validación
Main 59edee119b5c81b470897c4899ffc8ecc5a4c25b y producción dpl_2jCDeirE6miwQohgXrpj9L7PJg4X READY coincidentes. PR abiertas consultadas, sin solape de datos; 19 migraciones, con discrepancia previa del timestamp musical documentada en lotes anteriores, intacta.
Guard oficial HC-016 generado para c1000000-0000-0000-0000-000000000001. Gloria, Sacramental y Penitencia conservadas.
Dry-run inicial PASS, verificación de valores anteriores tras ROLLBACK 6/6, COMMIT y postflight 6/6. Segundo ajuste descriptivo: dry-run y COMMIT PASS.
Cultos, salidas y contratos mantienen hashes: {"cults":"b34c3c7fd7d09decf618ee1a831fb4cc","music":"b1613fc964bfbc9163a144c4616f4833","outings":"5bdadd3ca57de55380a105a8a0746f6a"}.
HTTP 200: HTML confirma dimensiones nuevas, iconografía del Cristo y detalles del hábito. La plantilla no muestra history_text ni notes del hábito en esta vista; no se certifica visible la historia. Los tres últimos ajustes descriptivos quedan sujetos a la renovación natural del detalle.
No se certifica QA responsive. Sin frontend, DDL, RLS ni despliegue.

Los SQL archivados son evidencia ya aplicada, terminados en ROLLBACK. No reejecutar.
