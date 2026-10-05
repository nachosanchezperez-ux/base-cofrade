# Personas junto a Titulares y bandas históricas · 2 de octubre de 2026

PR #1070. Base: `a22ee5fe`. Cambio solicitado sobre la variante de lectura de Hermandades; no amplía su cohorte ni modifica datos.

El vestidor deja el resumen de cabecera y se muestra después de las imágenes, dentro de Titulares, sin desplegable, contador ni tarjeta. Agrupa por identidad y conserva las imágenes y sus vigencias. El nombre enlaza al Autor publicado. El mismo bloque presenta al Hermano/Hermana Mayor cuando existe una relación publicada; no crea nombres ni cargos a partir de inferencias. Las consultas existentes se comparten con React cache durante el render.

Consulta de producción: El Baratillo no tiene una relación publicada `hermano_mayor_of` / `hermana_mayor_of`. Queda pendiente documentar ese dato antes de mostrarlo. José Antonio Grande de León conserva sus dos relaciones de vestimenta.

El registro histórico de 2004 ya resuelve Sangre de San Benito y su slug `sangre-de-san-benito`; faltaba renderizar el enlace. Ahora el título enlaza a la ficha y la fila tiene 18 px de margen interior lateral, sin sombra ni marco. Se mantiene el periodo histórico y el Paso de la Piedad.

Build local y GitHub verify PASS sobre `df241305`. Preview `dpl_E6EFyrthjqzwB3byoNv8VWhJivZ4` READY. Matriz visual PASS: 390, 430, 768, 1024, 1366 y 1600 px, con histórico abierto por teclado, vestidor visible, sus dos imágenes y enlace al Autor, enlace de Sangre de San Benito visible y margen lateral >=16 px. Se mantienen 39 composiciones, 15 hitos y 18 Fuentes. Control Gran Poder PASS; cero errores de página y desbordamientos. [Matriz](./qa/hermandad-lectura-2026-10-02/personas-musica-preview.json). Emulación Chromium sobre respuestas HTTPS verificadas; no prueba en dispositivos físicos.

La PR aparcada #1019 contiene también un enlace histórico: deberá reconciliar ese fragmento si se retoma. No se toca su rama ni su contenido editorial.

## Verificación de producción

#1070 integrada en `7586847cc3b6b0ff22e4b42bf20cdd507b874514`. Producción `dpl_D44yPDhwfRJAN7KVnguzNQNnPtZx` READY. La misma matriz de seis anchuras sobre la URL pública pasa con vestidor junto a Titulares, enlaces, margen interior, catálogo e histórico abiertos por teclado, control Gran Poder y cero errores de página o desbordamientos. [Matriz pública](./qa/hermandad-lectura-2026-10-02/personas-musica-produccion.json). Sin registros error/fatal en el deployment durante la ventana de 15 minutos consultada.
