# Esperanza de Triana · patrimonio musical · 9/10/2026

APLICADO EN PRODUCCIÓN. Continuación autorizada del expediente #1123 a partir del programa de Santa Ana aportado por el usuario (IMG_4272.jpeg, lámina 2/2).

## Resultado
Dos marchas creadas: Cristo de las Tres Caídas (Ángel Alcaide, 1996) y Yo soy la Esperanza (Daniel Albarrán, 2015), con autores existentes reutilizados.
Seis fichas ampliadas, conservando sus descripciones previas de interpretaciones: Triana de Esperanza (2004), Soleá, dame la mano (1918), La Esperanza de Triana (1925), Triana, tu Esperanza (2003), Siempre la Esperanza (2012) y Se arrodilla Triana (2019).
Siete relaciones de dedicatoria añadidas a la Hermandad. Total pasa de una a ocho; Reina la Esperanza se conserva.
Soleá se documenta como vínculo histórico: la dedicatoria original es a los presos, no se genera dedicatoria formal a la Hermandad.
Corregido el acento indebido de «Triana, tú Esperanza» conservando ID y slug.

## Evidencia y límites
El programa acredita títulos, autores abreviados y programación del 9/10/2026, no acredita ejecución ni estreno. No se inventa URL para el archivo aportado.
Dedicatorias y años contrastados mediante catálogo especializado; la obra de Alcaide tiene fuente propia y se distingue de la homónima de Bienvenido Puelles.
Fuentes incorporadas:
- Esperanza de Triana · catálogo de marchas dedicadas: https://www.cofradiasyhermandades.es/fichaimagineriaytallas.php?ii=7594602
- Cristo de las Tres Caídas · Ángel Alcaide · 1996: https://discografiasdemarchasprocesionales.com/marchas/7016/
- Soleá, dame la mano · dedicatoria e inspiración: https://www.lalineacofrade.com/patrimonio-musica/manuel-font-de-anta/
- Santa Ana · programa del concierto en la Esperanza de Triana · 9/10/2026: aportación directa sin URL pública
Corroboración adicional:
- https://laolivadesalteras.com/triana-tu-esperanza-jose-de-la-vega-sanchez/
- https://www.marchasdeprocesion.com/2020/01/daniel-albarran-acosta.html
- https://www.bandacruzroja.es/musica/discografia/nuevas-marchas-cofradieras (1918, Soleá)
- https://www.patrimoniomusical.com/bd-marcha-430
No se da por completo el catálogo musical de la Hermandad.

## Verificación
- Main 59edee119b5c81b470897c4899ffc8ecc5a4c25b; producción dpl_2jCDeirE6miwQohgXrpj9L7PJg4X READY, mismo SHA.
- PR #1123 usada para continuidad; #1122 y demás frentes independientes. ESTADO-PROYECTO compartido: reconciliar al integrar.
- 19 migraciones remotas; no DDL/RLS ni nueva migración; discrepancia de timestamp de add_musical_repertoire_theme ya conocida e independiente.
- Dry-run con guard HC016 generado sobre universo explícito de una Hermandad y ROLLBACK: PASS.
- Después de rollback: 0 entidades nuevas, 0 fuentes nuevas, 6 años anteriores NULL y una dedicatoria original.
- Mismo SQL COMMIT: MUSICA_ESPERANZA_OK.
- Postflight: 8 dedicatorias totales; 2 nuevas autorías; 24 enlaces a 4 fuentes; Soleá sin dedicatoria formal y con nota explicativa.
- Hash de autorías anteriores conservado: a5468f6bb2f95ae3ab5830c97d0a3e98.
- Página pública HTTP 200; los siete títulos añadidos comprobados en texto visible SSR excluyendo scripts y estilos.
- Sin cambios de código, acompañamientos, salidas, imágenes/pasos ni despliegue.
El SQL adjunto es HISTÓRICO, ya aplicado, y termina en ROLLBACK. No reejecutar.
