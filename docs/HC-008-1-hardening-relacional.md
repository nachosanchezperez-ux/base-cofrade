# HC-008.1 · Hardening relacional de Tira del hilo

**Estado:** EN VALIDACIÓN  
**Decisión base:** HC-008 continúa **IMPLEMENTADA**  
**Ámbito:** Hermandades, Imágenes, Pasos y Bandas públicas

## Objetivo

Endurecer la navegación relacional ya implantada para que escale cuando una ficha acumule muchas relaciones, sin reabrir HC-008 ni alterar el modelo de datos.

## Reglas

1. Ninguna relación navegable debe desaparecer de forma silenciosa por superar el límite visual inicial.
2. La portada del hilo muestra un máximo compacto y el resto queda accesible mediante **Ver todas las relaciones**.
3. Los destinos se deduplican por `href`.
4. Si un mismo destino tiene varias relaciones, prevalece la relación con mayor prioridad semántica.
5. Hermandad distingue explícitamente **Vínculo institucional** de **Acompañamiento actual**.
6. Un acompañamiento musical no implica pertenencia a la Hermandad.
7. Solo se enlazan destinos con ficha pública disponible.

## Prioridad por entidad

### Hermandad

`Imagen → Paso → Banda → Marcha → Autor`

Cupo inicial recomendado: 3 Imágenes + 3 Pasos + 2 Bandas, rellenando huecos si faltan categorías.

### Imagen

`Hermandad → Paso → Autor → Imagen relacionada → Acontecimiento`

### Paso

`Imagen → Hermandad → Banda → Capataz → Autor`

### Banda

`Paso → Hermandad → Marcha → Autor`

La ficha de Banda recibe esta prioridad desde el componente común y no se modifica en esta rama para no interferir con la PR #132 de logotipos.

## Telemetría

Los clics y aperturas del bloque se registran como eventos estructurados de Vercel:

- `relational_thread_click`
- `relational_thread_expand`

Solo se envían datos de navegación del producto: tipo de origen, nombre de la ficha, tipo de destino, ruta, relación y número de relaciones ocultas. No se envían identificadores personales, cookies ni contenido de formularios.

## Datos

No requiere migraciones ni cambios de esquema.

El acompañamiento musical actual de Hermandades se lee de `music_accompaniment_periods`, que ya es la fuente usada por la ficha pública.

## Criterios de validación

- [x] Dedupe estable por destino.
- [x] Prioridad explícita por tipo de entidad.
- [x] Cupos para evitar que una categoría monopolice la portada.
- [x] Despliegue progresivo de relaciones sobrantes.
- [x] Acompañamiento actual incorporado a Hermandad sin confundirlo con banda propia.
- [x] Telemetría sin dependencia ni tabla nueva.
- [x] Tests unitarios del selector relacional añadidos.
- [ ] CI y build completos.
- [ ] Preview Vercel exacta validada.
- [ ] Regresión funcional: Baratillo, Asunción, La Cena, San Benito, Pastora y Banda del Sol.
- [ ] Producción sin errores del deployment final.
