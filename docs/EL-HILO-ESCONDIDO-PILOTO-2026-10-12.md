# El hilo escondido · Piloto de juego cofrade · 12/10/2026

## Alcance y estado

Piloto autocontenido para Hilo Cofrade. Se desarrolla en rama independiente y PR de revisión; **no supone autorización de merge ni publicación en producción** hasta superar CI, preview, QA móvil y revisión editorial.

- **Ruta permanente:** /juegos/el-hilo-escondido (un solo canonical, sin páginas por partida).
- **Acceso:** enlace discreto en «Descubre hoy», más «Explorar» en navegación.
- **Dos juegos:** «El hilo del día» (una palabra); «La última chicotá» (tres palabras encadenadas).
- **Mecánica propia:** adivinanza inicial + tres pistas temáticas voluntarias + cuatro intentos erróneos como máximo. No se copia la cuadrícula ni la clasificación de otros juegos.
- **Puntuación:** 100 por palabra acertada, menos 15 por pista abierta y 18 por error anterior, mínimo 10 si acierta; 0 si agota las oportunidades. Experto: hasta 300.
- **Vínculo enciclopédico:** al terminar una palabra, se muestra definición y enlace al directorio relevante. Cuando exista el glosario «De capirote a trabajadera», los vínculos podrán apuntar a su ficha editorial verificada.
- **Cofradle:** mención opcional como recurso externo independiente, nunca incrustado ni presentado como socio.

## Datos y actualización

Un banco estático inicial de vocabulario, con tres pistas y una definición editorial por término, sin inventar enlaces individuales de entidades. La fecha se calcula en **Europe/Madrid**. Ambos modos usan selección determinista que todos los visitantes comparten.

**Limitación deliberada del piloto:** los retos empiezan a repetirse cuando se agota el banco de términos y las cadenas expertas son menos numerosas. Antes de convertirlo en un producto diario permanente se necesita un calendario editorial más amplio, con revisión humana de los términos, dificultad y pistas. No simular una renovación infinita ni la existencia de un sistema de publicación editorial que todavía no está desarrollado.

## Privacidad, coste y seguridad

- Sin registro, terceros, cookies analíticas propias del juego ni escrituras a Supabase.
- La partida y la racha de aciertos se guardan en localStorage del navegador cuando está disponible; no hay sincronización entre dispositivos.
- No hay clasificación pública ni rankings. La puntuación es personal; el banco está empaquetado en el frontend, por lo que **no es una competición resistente a trampas**.
- Compartir voluntario mediante Web Share API o copiar al portapapeles. El texto no revela la solución.
- Sin coste incremental de terceros ni despliegues especiales ni migraciones.
- Conexiones actuales a directorios existentes; evitar dar por publicada una futura página de glosario.

## QA antes de integrar

1. npm test y npm run build: sin regresiones en Next.js 16.
2. Preview: ruta HTTP 200 y canonical estable; comprobar la aparición en «Explorar», en «Descubre hoy» y en sitemap.
3. QA móvil 320 / 375 / 390 / 430 / 768 / 1366 px, incluidos teclado, foco visible, no desbordamiento y botones táctiles.
4. Juego: acierto sin pistas, error, respuesta repetida, pistas intercaladas, agotamiento de intentos, retorno a mitad de partida, cambio de modalidad, fin de experta, copia/compartir y cambio de día en Madrid.
5. Revisar contenido: ortografía, significado y pistas por quien conoce la terminología antes del GO editorial.
6. No tocar funciones de panel, la agenda, las relaciones ni PRs abiertas. El acceso de home es una tarjeta compacta, no un bloque nuevo de noticias.

## Siguiente fase, fuera de esta PR

Calendario editorial de tres meses o más sin repetición, vinculación con glosario y fichas documentadas por término, telemetría agregada solo conforme a consentimiento y controles de privacidad existentes; no asumir ni desplegar estas funciones sin una decisión posterior.
