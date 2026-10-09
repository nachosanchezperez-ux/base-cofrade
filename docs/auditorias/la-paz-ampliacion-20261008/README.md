# La Paz · ampliación aplicada · 8/10/2026

## Actualización posterior: vínculos corregidos el 9/10

La nueva orden del usuario autorizó el correctivo de tres relaciones y sus Fuentes. Datos y seis enlaces públicos recíprocos verificados; las limitaciones anteriores sobre relaciones ausentes quedan resueltas. Continúan QA visual no certificada y renovación del bloque Pasos de la ficha de Hermandad. Ver `../la-paz-vinculos-20261009/README.md`. No se reaplicó esta ampliación del 8/10.


## Revalidación viva · 9/10/2026
97/97 INSERT y 6/6 UPDATE coinciden con todos los campos del manifiesto mediante SELECT. Hashes preservados coincidentes. Cero duplicados por las claves lógicas auditadas y cero FK huérfanas en esas filas.
El pendiente de patrimonio del corte original queda resuelto: HTML 200 muestra corona (1949), templete (1991), ángeles (1954) y seis restauraciones, incluidas las cuatro nuevas. Música, titularidad conceptual y fuentes son públicas. La guía conserva su límite de rollout; no se certifica en la cohorte de lectura.
**NO-GO del cierre:** `image_steps` no contiene vínculos para Victoria, Paz y Prado; las tres Imágenes y los tres Pasos tampoco ofrecen navegación recíproca. No corregido: requeriría DML nuevo fuera del alcance documental. Responsive no certificado por timeout del navegador. Ver `../cierre-1122-20261009/README.md`.

## Evidencia histórica del 8/10 (no es estado pendiente actual)

Orden del usuario: «Inclúyelo», tras propuesta basada en https://www.hermandaddelapaz.org.

## Estado
DML aplicado y verificado en producción kcevwkucqzcyrqaimyhl. No reejecutar el SQL histórico adjunto.
97 INSERT y 6 UPDATE del manifiesto, más cuatro marcas de actualización de entidades y una auditoría.
Sin cambios de esquema, frontend ni despliegue.

## Alcance
- Seis dedicaciones musicales publicadas: Regina Pacis (1956), Virgen de la Paz (1970), Paz del Porvenir (1989), Nuestro Padre Jesús de la Victoria (1995), Coronación de la Paz (2016), Esplendor del Porvenir (2025).
- Reutilizadas las dos primeras marchas; cuatro nuevas marchas y sus autores; alta de Óscar Mosteiro.
- Tres piezas patrimoniales: corona de 1949, templete del Prado de 1991 y ángeles de Buiza de 1954.
- Cuatro restauraciones históricas: Virgen 1979 y 2002, Prado 2018, San Sebastián 2024.
- Titularidad conceptual del Santísimo Sacramento, sin crear imagen física.
- Ampliación de historia, guantes blancos en ambos hábitos y fuentes.
- Guía «Conoce La Paz» guardada con relaciones y fuentes. Su módulo público depende de la cohorte de lectura, que no incluye La Paz; no se ha cambiado el rollout.

## Criterio documental
La ficha oficial actual del Señor confirma bendición el 10/3/1940: se conserva.
La Virgen presenta discrepancia entre Consejo (1937) y web de la Hermandad (1939): se conserva 1937 y se documenta explícitamente.
No se redefine el palio actual a partir de la descripción histórica de malla ni del proyecto de 2021.
No se atribuye autor a la restauración de San Sebastián de 2024.

## Verificación
- Preflight: main 59edee119b5c81b470897c4899ffc8ecc5a4c25b; producción READY dpl_2jCDeirE6miwQohgXrpj9L7PJg4X, mismo SHA.
- Consultadas PR abiertas y migraciones. Diferencia previa de timestamp en add_musical_repertoire_theme, ajena al DML y no modificada.
- Guard oficial HC-016 de tipos generado para el universo de una Hermandad, incluida REUSE.
- Primer dry-run detectó enum de guantes; corregido a Blanco. Dry-run definitivo pasó; ROLLBACK confirmado con cero filas residuales en las 14 tablas.
- COMMIT del mismo candidato: PAZ_AMPLIACION_VERIFIED.
- Postflight: 97 filas insertadas presentes con los IDs del manifiesto. Cultos, salidas, contratos musicales y tipos conservan hashes previos.
- Consulta bajo rol anon: 3 piezas patrimoniales y 6 restauraciones publicadas accesibles (2 anteriores + 4 nuevas).
- HTTP público 200; seis marchas y titularidad sacramental visibles.
- Pendiente de cierre visual: HTML servido aún sin las nuevas piezas/restauraciones. Respuesta HIT, age 261, detalle Next con revalidate 900. La invalidación nativa CDN por tag devolvió 404 CDN Cache Namespace not found; no se ha forzado purga global ni redeploy. Verificar tras renovación natural del detalle; si persiste, investigar fallback/autoridad de secciones.
- No se certifica la guía como visible ni la totalidad de la ficha como renovada.

## Evidencia
manifest.json contiene valores anteriores de las seis modificaciones.
applied.sql es evidencia histórica de la transacción aplicada, terminada en ROLLBACK para evitar una reaplicación accidental; los INSERT además colisionarán con los IDs existentes.
preserved.json contiene los hashes de colecciones conservadas.
