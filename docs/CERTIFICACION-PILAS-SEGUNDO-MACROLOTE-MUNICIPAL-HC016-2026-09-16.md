# Certificación · Pilas · segundo macrolote municipal HC-016

**Fecha:** 16 de septiembre de 2026

**HEAD inicial:** `b2ba99b5fee86eff6226c523f1db2953bf8337a6`

**Lote:** `c0160029-0000-4000-8000-000000000001`

**Municipio seleccionado:** Pilas  
**Esquema:** sin cambios; DML exclusivamente

## Preflight estricto

- `origin/main` y producción coincidían en `b2ba99b5fee86eff6226c523f1db2953bf8337a6`.
- Producción estaba `READY` mediante `dpl_Fd3qjT7jP9J3A2addtUZNYgKhWLh`.
- GitHub devolvía 0 PR abiertas y no existía un merge posterior.
- Supabase `Hilocofrade` estaba `ACTIVE_HEALTHY`.
- Gerena, Dos Hermanas y Alcalá de Guadaíra se preservaron como municipios cerrados.
- #492 permanecía cerrada. No se ejecutó DDL ni se modificó RLS.

## Universo auditado

Se recalculó el grafo completo de provincia, sin reutilizar el ranking anterior como verdad. El corte vivo encontró 47 municipios con presencia real, 87 nodos de Hermandad, 84 Hermandades publicadas, 41 Bandas públicas, 111 Cultos, 122 Salidas, 74 acontecimientos y 206 enlaces directos de Fuente a Hermandad. El mapa posterior al Apply está en [`MAPA-MUNICIPAL-PROVINCIA-SEGUNDO-MACROLOTE-2026-09-16.csv`](./MAPA-MUNICIPAL-PROVINCIA-SEGUNDO-MACROLOTE-2026-09-16.csv).

Los vacíos no se contaron mecánicamente como deuda: Crucetas, conciertos, igualás, cultos fechados, discografía, escudos o fotografías solo se consideran deuda nuclear cuando hay evidencia de que deberían existir y pueden publicarse con el modelo actual.

## TOP 3 recalculado

### 1 · Pilas

**Cobertura actual estimada al inicio:** 35 %

**Hermandades**

- Públicas: 2 de un universo verificable de 4.
- Incompletas: Borriquita y Belén.
- Ausentes: Cautivo y Dolores y Soledad.

**Bandas**

- Sociedad Filarmónica publicada; su formación juvenil existía en `review` y podía reutilizarse.
- Acompañamiento de San Miguel Arcángel de Puertollano documentado para la Borriquita de 2026.

**Agenda**

- Tres Salidas publicadas y cinco convocatorias municipales de 2026 todavía sin modelar.
- Sin evidencia posterior suficiente para transformar esas convocatorias pasadas en `held`.

**Deuda documental**

- Dos fichas existentes sin profundidad nuclear, dos corporaciones ausentes, titulares y pasos incompletos.

**Deuda relacional**

- Banda juvenil no publicada, paso de la Borriquita en revisión y falta de relaciones completas entre Hermandades, titulares, pasos, Salidas y Fuentes.

**Deuda legítima**

- Cultos fechados, conciertos, igualás, crucetas, acompañamientos no identificados y multimedia sin derechos.

**Fuentes disponibles:** Alta  
**Potencial HC-016:** Alto  
**Impacto para Hilo Cofrade:** Alto  
**Riesgo técnico:** Bajo

**Por qué está en el TOP 3**

- El Ayuntamiento delimita cuatro corporaciones y cinco citas de 2026.
- Dos nodos y dos bandas locales podían reutilizarse.
- El universo era suficientemente denso y, a la vez, cerrable mediante DML sin excepciones territoriales.

### 2 · Cantillana

**Cobertura actual estimada:** 40 %

**Hermandades**

- Públicas: 3.
- Incompletas: Soledad presenta deuda nuclear.
- Ausentes: el inventario municipal acredita corporaciones penitenciales adicionales; el universo combina Penitencia y Glorias.

**Bandas**

- Una Banda local pública y una Cruceta ya publicada para la Pastora.

**Agenda**

- Cuatro Salidas y seis Cultos publicados, pero sin Agenda futura municipal en el corte.

**Deuda documental**

- Profundidad desigual: Asunción y Pastora están desarrolladas; la cobertura penitencial no representa todavía el universo local.

**Deuda relacional**

- Debe reconciliarse la corporación local con titulares, pasos, música y actividad sin mezclar las dos devociones letíficas profundas ya existentes.

**Deuda legítima**

- Actualidad posterior a 2026, repertorios no documentados y multimedia no licenciada.

**Fuentes disponibles:** Media-alta  
**Potencial HC-016:** Alto  
**Impacto para Hilo Cofrade:** Alto  
**Riesgo técnico:** Medio

**Por qué está en el TOP 3**

- Reúne Glorias, Penitencia, Banda y Cruceta en un grafo local valioso.
- Queda segunda porque su universo es mayor y exige separar cuidadosamente corporaciones homónimas y dimensiones letíficas.

### 3 · Utrera

**Cobertura actual estimada:** 25 %

**Hermandades**

- Públicas: 3 frente a un universo oficial mucho mayor.
- Incompletas: 2.
- Ausentes: el Consejo local documenta diez corporaciones penitenciales y trece cofradías procesionales en total.

**Bandas**

- Tres nodos públicos; dos requieren control de identidad por posible solapamiento nominal de Álvarez Quintero.

**Agenda**

- Cuatro acontecimientos, cuatro Cultos y tres Salidas en el grafo; cobertura insuficiente para el universo acreditado.

**Deuda documental**

- Cobertura muy parcial de corporaciones, titulares, pasos, patrimonio e historia.

**Deuda relacional**

- Riesgo de duplicidad musical y gran número de conexiones aún no representadas.

**Deuda legítima**

- Mucha actualidad y profundidad requieren contraste individual; no puede inferirse de la recurrencia local.

**Fuentes disponibles:** Media-alta  
**Potencial HC-016:** Medio  
**Impacto para Hilo Cofrade:** Muy alto  
**Riesgo técnico:** Alto

**Por qué está en el TOP 3**

- Es la mayor deuda territorial verificable del corte.
- Queda tercera porque cerrar solo los nodos existentes produciría un falso cierre y el universo completo tiene alto riesgo de dispersión.

Pilas y Utrera compitieron de nuevo desde cero. Pilas ganó por el equilibrio entre deuda real, fuentes, reutilización, valor relacional y capacidad de certificación; Utrera no mantiene prioridad automática. Cantillana pasa a ser la única recomendación posterior, pero no se abre.

## Universo cerrado de Pilas

### Debe entrar

| Familia | Preservar | Completar o promover | Crear |
|---|---|---|---|
| Corporaciones | Borriquita y Belén | Borriquita, Belén y la Agrupación del Cautivo | Soledad |
| Titulares | Cristo del Amor y Virgen de Belén | Vínculos de las dos fichas existentes | Cautivo, Dolores, Vera Cruz, Soledad y Yacente |
| Pasos | Paso de Belén | Paso de la Borriquita | Cautivo, Dolores, Vera Cruz, Soledad y Yacente |
| Bandas | Sociedad Filarmónica | Formación juvenil | San Miguel Arcángel de Puertollano como acompañamiento externo, sin atribuirle municipio sevillano |
| Salidas | Tres existentes | Cinco convocatorias de 2026 como `announced` | Ninguna Agenda paralela |
| Fuentes | Las ya existentes | Ayuntamiento, Turismo del Aljarafe, webs oficiales y prensa local | Seis Fuentes nuevas y sus enlaces |

### No entra

- Cultos sin edición fechada y verificable.
- Conciertos, igualás o ensayos sin convocatoria vigente.
- Crucetas sin repertorio efectivamente interpretado y documentado.
- Acompañamientos musicales de las otras corporaciones cuando la fuente no identifica inequívocamente la formación.
- Escudos, logos o fotografías sin licencia o contrato de derechos.
- Estado `held` para una Salida pasada documentada solo por convocatoria.

## Composición HC-016

| Concepto | Total |
|---|---:|
| Operaciones editoriales | 118 |
| Insert / upsert | 104 |
| Update | 14 |
| Reuse canónico | 13 |
| Fuentes nuevas | 6 |
| Enlaces de Fuente | 36 |
| Entidades | 18 |
| Relaciones Hermandad–Imagen | 8 |
| Relaciones Hermandad–Paso | 7 |
| Relaciones Imagen–Paso | 8 |
| Salidas | 5 |
| Bandas | 3 |
| Periodos musicales | 1 |

## Preflight y Apply

Secuencia ejecutada: `CARGA → STAGING → PREFLIGHT GLOBAL → REVISIÓN → APPLY → RESULTADOS`.

- Staging: 118/118.
- Válidas: 118/118.
- Inválidas: 0.
- Referencias sin resolver: 0.
- Ambigüedades: 0.
- Colisiones: 0.
- Fallos: 0.
- Apply: 118/118.
- Reaplicación idempotente: correcta.

No hubo incidencias en Apply. La decisión editorial relevante fue preservar como `announced` las cinco convocatorias pasadas de 2026: fecha pasada no equivale a acto celebrado.

## QA de datos y grafo

- 4 corporaciones publicadas y vinculadas a Pilas.
- 2 Bandas locales publicadas; San Miguel Arcángel conserva su identidad externa de Puertollano.
- 8 imágenes titulares publicadas.
- 8 pasos publicados.
- 8 Salidas públicas en el municipio.
- 1 acompañamiento vigente verificado y territorialmente contextualizado.
- 0 slugs publicados duplicados.
- 0 titulares publicados huérfanos.
- 0 pasos publicados huérfanos.
- 0 Salidas atribuidas a un municipio incorrecto.
- 0 Salidas de Pilas elevadas a `held` sin evidencia posterior.
- Los 112 acontecimientos pasados globales en `announced` no se reabrieron.

## Directorio, buscador, público y SEO

- «Hermandades de Pilas» deriva del municipio canónico y reúne las cuatro corporaciones, incluida la Agrupación Parroquial.
- «Bandas de Pilas» deriva del mismo grafo y reúne las dos formaciones locales.
- «Qué hay en Pilas» puede combinar ambas familias sin una excepción por nombre o `slug`.
- Las cuatro fichas de Hermandad y las dos fichas de Banda son la unidad de QA público.
- Canonical, sitemap, indexabilidad, enlaces internos y ausencia de secciones rotas se verifican en preview y producción durante el postflight.
- Desktop y móvil reutilizan el directorio y las fichas comunes; no se abre un rediseño.

## Fuentes principales

- [Ayuntamiento de Pilas · Semana Santa y Las Carreritas 2026](https://pilas.es/es/actualidad/noticias/Semana-Santa-y-Fiesta-de-Resurreccion-Las-Carreritas.-Pilas-del-29-de-marzo-al-5-de-abril-de-2026/)
- [Horarios y recorridos de la Semana Santa de Pilas 2026](https://www.aljarafedigital.com/aljarafe/pilas/horarios-y-recorridos-de-la-semana-santa-de-pilas-2026/)
- [Turismo del Aljarafe · Hermandad del Cautivo](https://turismo.aljarafe.com/descubre/turismo-cultural/Hermandad-de-El-Cautivo)
- [Ayuntamiento de Pilas · Agrupación Parroquial del Cautivo y Dolores](https://www.pilas.es/es/municipio/asociaciones/Agrupacion-Parroquial-Nuestro-Padre-Jesus-Cautivo-y-Ntra.-Sra.-de-Los-Dolores/)
- [Web oficial · Hermandad de la Soledad](https://www.soledadpilas.es/her%C3%A1ldica)
- [Turismo del Aljarafe · Hermandad de la Soledad](https://turismo.aljarafe.com/descubre/turismo-cultural/Hermandad-de-La-Soledad-00006)

## Deuda legítima restante

- Cultos fechados: la recurrencia no se convirtió en convocatoria.
- Salidas 2026: cinco permanecen `announced` hasta encontrar crónica posterior inequívoca.
- Música: solo se publicó el acompañamiento identificado con precisión; no se infirieron continuidades para 2027.
- Agenda futura, conciertos, igualás y ensayos: sin convocatoria vigente verificable.
- Crucetas y Marchas: sin repertorio documentado para este cierre.
- Multimedia, escudos y logos: no se incorporaron recursos sin derechos.
- Profundización patrimonial: queda como mejora opcional, no como bloqueo municipal.

## Observación de Auditor

1. Pilas estaba realmente incompleto: faltaban dos de cuatro corporaciones y las dos existentes carecían de profundidad nuclear.
2. Los falsos pendientes principales fueron exigir Cultos, conciertos, Crucetas o multimedia como si fueran universales.
3. Se reutilizaron las dos Hermandades existentes, sus titulares, pasos, sedes, la Sociedad Filarmónica y su formación juvenil.
4. La deuda legítima restante se concentra en evidencia temporal posterior, música no identificada y derechos visuales.
5. No apareció un problema transversal del modelo: HC-016, directorios y búsqueda municipal soportan el cierre sin DDL ni hardcode territorial.
6. No merece abrir una corrección de arquitectura; las ausencias legítimas deben esperar evidencia nueva.
7. Cantillana queda como única recomendación para un recálculo futuro, sin activarla ni mantener a Utrera artificialmente en cola.

## Cierre técnico

La PR, el SHA final, el deployment exacto y los errores posteriores forman parte del postflight de integración y del entregable final, porque no pueden conocerse antes del commit que contiene esta certificación. Pilas solo se declara **MUNICIPIO CERRADO** cuando CI, Supabase Preview y Vercel estén correctos, `main` y producción coincidan y GitHub vuelva a 0 PR abiertas.
