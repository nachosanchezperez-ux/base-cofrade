# Auditoría final Front ↔ Panel · 22/08/2026

## Resultado

La auditoría de las superficies públicas principales concluye que el modelo editorial base dispone de una vía manual de administración en el Panel para los datos persistentes consumidos por el Front.

Los huecos funcionales encontrados durante la revisión fueron **fallbacks heredados del Front**, no ausencia de formularios:

1. **Bandas / Las Cigarreras**: existían acompañamientos, histórico, extraordinaria, patrimonio, estrenos y curiosidad duplicados en código. Supabase ya contiene las relaciones persistentes correspondientes. Se retira la copia local y las curiosidades pasan a resolver también enlaces editoriales `about` del Banco.
2. **Hermandades / escudos**: Baratillo y Asunción tenían rutas locales de respaldo pese a existir `crest_path` persistente. El directorio y la hero pública usan ahora el valor autoritativo de Supabase.
3. **Acontecimiento / Vía Crucis del Baratillo 1985**: el crédito «Fotografía · Hermandad» estaba forzado por slug en la página. El recurso multimedia ya contiene `source_name = Hermandad` y derechos documentados, por lo que el Front prioriza el crédito generado desde Multimedia.

## Datos contrastados antes de retirar fallbacks

- Baratillo: `crest_path = /escudos/el-baratillo.svg`.
- Asunción de Cantillana: `crest_path = /escudos/asuncion-de-cantillana.png`.
- Las Cigarreras: ficha publicada con datos de identidad, 9 períodos de acompañamiento (incluido San Bernardo 1993–2003), 4 estrenos, 1 pieza patrimonial, 19 lanzamientos y fuentes directas en Supabase.
- Las Cigarreras: existe contenido editorial publicado relacionado mediante `about`.
- Vía Crucis de las Hermandades 1985: fotografía vinculada como portada al Acontecimiento; `source_name` y `rights_holder` documentan «Hermandad».

## Regla de cierre

Un valor de presentación neutro puede tener fallback visual. Un dato específico de una entidad, una relación, un texto editorial, un crédito, un recurso o una selección pública **no puede** tener una copia local que gane a Supabase.

La matriz mantenible está en `docs/panel-front-parity.md` y la guarda automatizada en `test/front-panel-parity.test.js`.
