# Certificación HC-016 · Santo Entierro de Dos Hermanas

**Corte:** 14 de septiembre de 2026

**Ámbito:** duodécimo contexto editorial real de HC-016

**Base reconciliada:** `054e2490abb9a92c582ba99d5b80aac27bb65ce6`

**Régimen:** `FIRST EDITION FREEZE` · solo DML editorial

## Resultado

La Hermandad del Santo Entierro de Dos Hermanas queda cerrada como duodécimo contexto real de HC-016. El lote recorrió carga, staging, preflight global, revisión, Apply y postflight en producción sin DDL, tablas, cambios RLS, código de producto ni activación de HC-018.

El cierre publica y relaciona:

- tres titulares: Santísimo Cristo Yacente, Nuestra Señora de la Soledad y Cristo Resucitado;
- dos Pasos: el del Cristo Yacente y el palio de la Soledad;
- autoría documentada de Juan Manuel Miñarro para el Yacente y autoría anónima prudente para la Soledad y el Resucitado;
- cinco Cultos documentados sin trasladar fechas históricas al calendario actual;
- el hábito negro de ruán con cola, antifaz negro y cinturón de esparto;
- la estación de penitencia del 4 de abril de 2026 y la procesión del Resucitado del 5 de abril de 2026 como Salidas independientes;
- música de capilla y Maestro Tejera en el Sábado Santo, y Banda Juvenil Santa Ana en la procesión del Resucitado, todas ligadas a la edición documentada;
- tres conjuntos patrimoniales, cuatro acontecimientos históricos, dos canales oficiales y siete Fuentes visibles.

## Lote gobernado

| Lote | Estado | Preparadas | Aplicadas | Inválidas | Fallidas | Plan efectivo |
|---|---|---:|---:|---:|---:|---|
| `9b527bb5-f011-497c-92ca-d2071e3aeb49` | `completed` | 99 | 99 | 0 | 0 | 92 insert · 6 update · 1 reuse |

El preflight completo resolvió las 29 relaciones documentales, no encontró colisiones y reutilizó la Fuente general que ya pertenecía a la ficha. Las seis actualizaciones quedaron limitadas a la Hermandad existente, su perfil, el Paso de palio ya abierto y el periodo vigente de Maestro Tejera.

La receta DML canónica está archivada en `20260913224245_cierra_santo_entierro_dos_hermanas.sql`.

## Postflight relacional

| Familia | Resultado |
|---|---:|
| Hermandad | 1 |
| Imágenes titulares | 3 |
| Autorías | 3 |
| Pasos relacionados | 2 |
| Cultos / relaciones de Culto | 5 / 5 |
| Salidas / entidades de Salida | 2 / 3 |
| Posiciones / asignaciones musicales | 3 / 3 |
| Periodos musicales vigentes | 1 |
| Patrimonio | 3 |
| Acontecimientos | 4 |
| Hábito | 1 |
| Canales oficiales | 2 |
| Fuentes visibles | 7 |

- 0 duplicados entre titulares, Pasos y Salidas.
- 0 relaciones troncales huérfanas.
- 0 registros inválidos o fallidos en el lote.
- El Sábado Santo conserva 18:30–22:30, dos titulares y dos posiciones musicales.
- El Domingo de Resurrección conserva 12:30–14:00, el Cristo Resucitado y su acompañamiento propio.

## Verificación pública

La ficha pública responde con título SEO, H1, canonical e indexación. Expone los tres titulares, los dos Pasos, el vínculo vigente con Maestro Tejera, el hábito, las dos Salidas separadas, los cinco Cultos, los dos canales y siete Fuentes. Las cinco fichas relacionales de Imagen y Paso enlazan desde la Hermandad.

- `/hermandades/santo-entierro-dos-hermanas`
- `/imagenes/santisimo-cristo-yacente-dos-hermanas`
- `/imagenes/nuestra-senora-soledad-dos-hermanas`
- `/imagenes/cristo-resucitado-dos-hermanas`
- `/pasos/paso-santisimo-cristo-yacente-dos-hermanas`
- `/pasos/paso-palio-nuestra-senora-soledad-santo-entierro-dos-hermanas`

## Fuentes principales

- [Ficha general](https://www.cofradiasyhermandades.es/fichacofradia-COFRADIAS-DosHermanas-SantoEntierro-dkQ5ZWJBOVFndndlb0Mzd25GMFRYUT09)
- [Historia, titulares, Pasos, hábito y patrimonio](https://www.artesacro.org/Noticia/Ver/24922/provincia-mirada-provincia-hermandad-santo-entierro-dos-hermanas)
- [Historia de Nuestra Señora de la Soledad](https://periodicolasemana.es/2019/72564/memoria-dh/la-soledad-de-dos-hermanas/)
- [Ficha local de la Hermandad](https://doshermanas.com/2009/03/18/santo-entierro/)
- [Sábado Santo de 2026](https://www.elpespunte.es/articulo/dos-hermanas/horario-recorrido-santo-entierro-dos-hermanas-sabado-santo/20260404174116129303.html)
- [Procesión del Cristo Resucitado](https://www.artesacro.org/Noticia/Ver/150293/provincia-galeria-domingo-resurreccion-procesion-resucitado-dos-hermanas)
- [Besapié del Cristo Resucitado](https://www.artesacro.org/Noticia/Ver/167519/galeria-besapie-cristo-resucitado-dos-hermanas-luis-m-fernandez)

## Huecos legítimos

- No se publica escudo ni fotografía propia sin autorización verificable.
- No se asigna autor conocido a la Soledad ni al Cristo Resucitado.
- No se crea un Paso específico del Resucitado sin una Fuente actual inequívoca.
- No se convierte la Banda Juvenil Santa Ana en la Banda de Música Santa Ana adulta; queda identificada por su nombre en la salida documentada.
- No se generalizan la música de capilla ni la formación juvenil a años distintos de la edición acreditada.
- Los Cultos sin calendario actual conservan la fecha anual por confirmar.

## Control técnico

- producción previa al Apply: `READY` sobre `054e2490abb9a92c582ba99d5b80aac27bb65ce6`;
- Vercel: 0 errores runtime en la hora auditada antes del Apply;
- Supabase: `ACTIVE_HEALTHY`, una sola rama principal y lote `completed` 99/99;
- #749–#759 integradas y 0 PR abiertas antes del cierre documental;
- receta exclusivamente DML y fuera de la cadena estructural activa.

El frente editorial queda cerrado. Los once contextos anteriores permanecen preservados y no se abre otra Hermandad.
