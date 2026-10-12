# El hilo escondido · Piloto sin DDL

Estado: propuesta implementada en rama de prueba, no publicada en producción.

## Contrato editorial
- Juego original de adivinanzas por pistas, no rejilla de Wordle ni identificación de hermandades o marchas de Cofradle.
- Una palabra al día para todos los visitantes, según fecha civil de Europe/Madrid.
- Ronda: adivinanza gratuita, tres pistas voluntarias y cuatro intentos como máximo.
- Puntuación local: 100 puntos iniciales, -18 por pista, -12 por error anterior al acierto; 0 sin resolver. Sin ranking ni cuentas.
- Modalidad experta «La última chicotá»: CAPATAZ → TRABAJADERA → CHICOTÁ, tres cabos sucesivos.
- Solución, definición y enlace a sección documental de Hilo Cofrade. No se crean URLs por palabra.
- Enlace de cortesía a Cofradle como proyecto independiente, sin integración ni reutilización de sus mecánicas.
- Enlace y nombre «De capirote a trabajadera» solo cuando el glosario exista y tenga rutas reales.

## Datos, privacidad y límites
- Banco inicial de 14 palabras diarias y tres expertas, redactadas editorialmente en lib/hilo-escondido.js.
- La serie vuelve a empezar tras 14 días. Antes de lanzamiento público estable, ampliar y validar banco editorial y establecer revisión de palabras para evitar repeticiones.
- No hay tablas nuevas, DDL, DML, endpoints, llamadas a IA, servicios externos, cookies nuevas ni cuentas.
- Solo se usa localStorage del navegador para continuar la ronda; no se envían resultados al servidor.
- Al estar las soluciones disponibles en el cliente no se promete competición segura ni clasificación pública.
- La puntuación no se presenta como récord verificable.

## Integración y puertas de publicación
- Ruta única estable: /juegos/el-hilo-escondido, con metadata y canonical.
- Piloto aislado de la portada: no tocar HomeToday ni los destacados mientras #1144 esté abierto.
- Tras validar con QA en 320/390/430/768/1366 px, accesibilidad por teclado, transición 00:00 Madrid, persistencia y Vercel preview, integrar una entrada breve y discreta en «Descubre hoy».
- Para una fase posterior: vocabulario editorial conectado a glosario publicado, mayor catálogo, inclusión en sitemap, métricas agregadas solo con consentimiento, jamás inventar relaciones ni fichas.
