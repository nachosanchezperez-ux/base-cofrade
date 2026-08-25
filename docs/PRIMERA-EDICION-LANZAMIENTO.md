# Primera edición · checklist de lanzamiento

Fecha de corte: 25 de agosto de 2026  
Objetivo: publicar una primera edición comprensible, rápida y mantenible sin ampliar el producto durante el cierre.

## Qué es la edición 1.0

La primera edición permite:

- descubrir Hilo Cofrade desde Home, Directorio o Extraordinarias;
- recorrer Hermandades, Imágenes, Pasos y Bandas como una enciclopedia relacionada;
- consultar fichas con información documentada y fuentes visibles;
- preguntar a Tira del hilo sin mezclar la sesión editorial con el front público;
- mantener el contenido desde un Panel responsive y autenticado.

No forman parte del lanzamiento:

- el importador documental de #49;
- nuevas familias de entidades o secciones públicas;
- una capa de caché persistente sin mapa completo de invalidación;
- un formulario público de aportaciones hasta definir canal, privacidad y tratamiento editorial.

## Puertas de lanzamiento

### P0 · obligatorias

- [x] Historial Git ↔ Supabase completamente alineado.
- [x] Funciones públicas próximas a la región de datos.
- [x] Timeout de fuentes de Extraordinarias corregido e indexado.
- [x] Permisos internos y RPC aparcada fuera de `anon`/`authenticated`.
- [x] Suite local y build verdes.
- [ ] Preview del corte técnico sin errores de runtime y con mejora medida.
- [ ] Smoke autenticado de #342 en Pastora, San Benito y El Baratillo.
- [ ] Activar protección contra contraseñas filtradas en Supabase Auth.
- [ ] Matriz pública final en 390, 768, 1024 y 1440 px: Home, Directorio, una ficha por familia, Extraordinarias, Pregunta y Colabora.
- [ ] Verificar foco visible, teclado, títulos, landmarks, textos alternativos y ausencia de scroll horizontal.
- [ ] Producción sin errores `fatal`/`error` después del despliegue.

### P1 · antes de anunciar públicamente

- [ ] Sustituir el estado beta de Colabora por un canal real o retirar las llamadas a “Proponer información”.
- [ ] Definir una página mínima de información legal/privacidad antes de recoger datos personales.
- [ ] Revisar que las fichas destacadas de Home no contengan campos editoriales vacíos o textos provisionales.
- [ ] Confirmar dominio canónico, sitemap, robots y tarjetas sociales en producción.
- [ ] Preparar mensaje de lanzamiento y una vía única para reportar errores.

## Regla de congelación

Durante el cierre solo se aceptan correcciones de seguridad, datos incorrectos, navegación bloqueada, errores responsive, accesibilidad esencial y rendimiento crítico. Cualquier nueva función pasa al backlog posterior a 1.0.

## Secuencia de salida

1. Preview técnica y medición.
2. Smoke autenticado de #342.
3. Correcciones P0, sin nuevas funciones.
4. Fusión de los dos cortes en orden y verificación de producción.
5. Congelación de 24 horas con observación de runtime.
6. Anuncio público.
