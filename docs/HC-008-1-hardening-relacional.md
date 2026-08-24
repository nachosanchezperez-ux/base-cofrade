# HC-008.1 · Hardening relacional de Tira del hilo

**Estado:** IMPLEMENTADA  
**Fecha de cierre documental:** 24/08/2026  
**Decisión base:** HC-008 continúa **CERRADA**  
**Ámbito:** Hermandades, Imágenes, Pasos y Bandas públicas

## Objetivo

Endurecer la navegación relacional para que una ficha pueda acumular muchas relaciones sin perder claridad, destinos ni semántica.

HC-008.1 es una extensión de HC-008. No consume un identificador independiente.

## Reglas implementadas

1. Ninguna relación navegable desaparece silenciosamente por superar el límite visual inicial.
2. La portada del hilo muestra un conjunto compacto y el resto permanece accesible mediante **Ver todas las relaciones**.
3. Los destinos se deduplican por `href`.
4. Cuando un destino reúne varias relaciones, prevalece la de mayor prioridad semántica.
5. Hermandad distingue **Vínculo institucional** de **Acompañamiento actual**.
6. Un acompañamiento musical no implica pertenencia institucional.
7. Solo se enlazan destinos con ficha pública disponible.
8. Si faltan categorías prioritarias, los cupos se rellenan con otras relaciones útiles.

## Prioridades

### Hermandad

`Imagen → Paso → Banda → Marcha → Autor`

Cupo inicial: 3 Imágenes + 3 Pasos + 2 Bandas, con relleno si faltan categorías.

### Imagen

`Hermandad → Paso → Autor → Imagen relacionada → Acontecimiento`

### Paso

`Imagen → Hermandad → Banda → Capataz → Autor`

### Banda

`Paso → Hermandad → Marcha → Autor`

## Telemetría

Se registran los eventos de navegación:

- `relational_thread_click`;
- `relational_thread_expand`.

Solo contienen contexto de producto —origen, destino, ruta, relación y relaciones ocultas—, sin datos personales ni contenido editorial privado.

## Evidencia

Implementación vigente:

- `components/RelationalThread.js`;
- `components/RelationalThreadClient.js`;
- `lib/relational-thread.js`;
- `app/api/analytics/relational-thread/route.js`;
- `test/relational-thread.test.mjs`.

La regresión verifica prioridades, cupos, deduplicación y relleno de capacidad.

## Datos

No requiere migraciones ni cambios de esquema.

**HC-008.1 → 🟢 IMPLEMENTADA**
