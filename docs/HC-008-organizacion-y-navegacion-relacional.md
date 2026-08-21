# HC-008 · Organización inicial de Hermandades y navegación relacional

**Estado:** IMPLEMENTADA  
**Fecha de cierre:** 21/08/2026  
**Ámbito:** web pública de Hilo Cofrade  

## Decisión

Hilo Cofrade organiza las Hermandades como nodos principales de una enciclopedia relacional, manteniendo entidades independientes para imágenes, pasos y bandas y permitiendo navegar entre ellas sin confundir la naturaleza de cada relación.

La navegación pública debe conservar contexto y hacer explícitas las relaciones documentadas mediante directorios conectados, fichas enlazadas y la capa transversal **Tira del hilo**.

## Criterios de cierre

HC-008 se considera implementada al cumplirse conjuntamente estos criterios:

1. Los directorios públicos de Hermandades, Imágenes, Pasos y Bandas están conectados y mantienen navegación de ida y vuelta.
2. Las clasificaciones de Hermandad se respetan sin inferencias falsas.
3. La Tira del hilo está disponible de forma coherente en Hermandades, Imágenes, Pasos y Bandas.
4. Los pasos muestran únicamente las imágenes realmente vinculadas a ellos.
5. Las salidas muestran únicamente las imágenes documentadas como participantes de esa salida.
6. Los contratos musicales no se presentan como relaciones institucionales.
7. Las relaciones sin ficha pública no generan enlaces rotos.
8. La estructura de navegación es usable en escritorio y móvil y mantiene los cuatro directorios accesibles.
9. La capa relacional escala mediante priorización, deduplicación y límites de destinos, mientras los módulos de detalle conservan el conjunto completo de información.

## Reglas semánticas fijadas

### Titularidad no equivale a participación procesional

Que una imagen sea titular de una Hermandad no implica que participe en todas sus salidas.

Las salidas concretas deben leer sus participantes desde `outing_entities`. Para imágenes que procesionan se utiliza el rol:

`processional_image`

No se debe reconstruir la participación de una salida a partir del conjunto completo de titulares de la Hermandad.

Caso de control: el **Patriarca Bendito Señor San José** pertenece a la titularidad del Baratillo, pero no debe figurar como imagen participante en su Estación de Penitencia de 2026.

### Contrato musical no equivale a vínculo institucional

Una banda puede acompañar a una Hermandad o a un paso sin pertenecer a la corporación ni estar asociada institucionalmente a ella.

La navegación relacional distingue:

- vínculo institucional;
- acompañamiento musical vigente;
- acompañamiento histórico;
- relación banda ↔ paso;
- relación banda ↔ salida / Hermandad.

## Matriz de auditoría final

### El Baratillo

- Clasificación: solo **Penitencia**.
- Tira del hilo: Hermandad ↔ imágenes ↔ pasos.
- Paso de la Piedad: enlaza exclusivamente sus imágenes procesionales y su acompañamiento musical vigente.
- Estación de Penitencia 2026: los participantes se obtienen de `outing_entities`; San José queda fuera de la salida sin dejar de ser titular de la Hermandad.

### La Asunción de Cantillana

- Clasificación: solo **Gloria**.
- No se presenta como Sacramental.
- Imagen y paso mantienen navegación relacional de ida y vuelta.
- El acompañamiento musical se mantiene como relación procesional, no institucional.

### La Cena

- Clasificaciones simultáneas: **Penitencia · Gloria · Sacramental**.
- La ficha soporta múltiples imágenes y pasos sin degradar la navegación.
- Tira del hilo prioriza destinos y limita el resumen relacional; los módulos específicos mantienen el catálogo completo.

### Bandas / caso de estrés

- Las fichas de banda priorizan vínculos institucionales y acompañamientos vigentes con destino público disponible.
- Los históricos permanecen separados de la relación vigente.
- No se crean enlaces hacia fichas aún no publicadas.

## Implementación relacionada

- PR #124 · Directorios públicos relacionados y navegación transversal.
- PR #127 · Fase 2 · Tira del hilo relacional en fichas públicas.
- Cierre HC-008 · auditoría de consistencia, participantes reales de salidas y acceso uniforme a Tira del hilo.

## Base de datos

El cierre de HC-008 no requiere migraciones ni cambios de esquema. La relación necesaria entre salidas y participantes ya existe en el modelo mediante `outing_entities`.

## Siguiente frente

Con HC-008 cerrada, el siguiente frente de consolidación de interfaz es **HC-009 · Sistema tipográfico de Hilo Cofrade**, aplicándolo de forma homogénea en web pública y Panel de Control.
