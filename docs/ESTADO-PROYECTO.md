# Hilo Cofrade · Estado canónico

**Corte validado:** 2 de septiembre de 2026 · cierre nocturno

**Régimen:** `FIRST EDITION FREEZE` activo

**Fase activa:** editorial / documental sobre el modelo vigente

## Estado general

**PRIMERA EDICIÓN → 🟢 CERRADA, CERTIFICADA Y CONGELADA**

- Baseline funcional y estructural de Primera Edición: cerrado.
- HEAD funcional observado antes de este corte documental: `6f20318dcd90120dfdf87db06c454c0d12c066dc`.
- Producción observada antes de este corte: `READY` sobre el mismo SHA.
- Check Vercel del HEAD: `success`.
- Runtime de producción: sin errores registrados en las 6 horas auditadas antes del cierre.
- PR abiertas al iniciar el corte: **0**.
- #529: **cerrada**.
- #492: **abierta y aislada** a Supabase Preview Branches; no bloquea DML editorial sobre el modelo vigente.
- Aportaciones públicas: **desactivadas**.
- Cola UX abierta: **0**.
- Cola estructural abierta: **0**.
- Nuevo DDL / nuevas tablas / cambios RLS / nueva arquitectura: **⛔ bloqueados durante el freeze y mientras #492 siga abierta**.

## Supabase

**PRODUCCIÓN → 🟢 `ACTIVE_HEALTHY`**

- Proyecto productivo: PostgreSQL 17.6.1, región `eu-west-1`.
- Historial de migraciones Git ↔ remoto auditado antes de este cierre: **48/48**.
- Últimas versiones ya canónicas:
  - `20260902121927_completa_amparo_sevilla`;
  - `20260902125718_aplica_paleta_amparo_sevilla`.
- El cierre posterior de Amparo se ha ejecutado exclusivamente como DML editorial sobre tablas y relaciones existentes.
- No se ha ejecutado DDL, no se ha alterado RLS y no se ha creado una nueva migración estructural.
- #492 conserva la deuda histórica de reproducibilidad de Preview Branches y no se reinterpreta como un fallo de producción.

## GitHub y Vercel

**ESTADO PREVIO A ESTA SINCRONIZACIÓN DOCUMENTAL → 🟢 ESTABLE**

- `main`: `6f20318dcd90120dfdf87db06c454c0d12c066dc`.
- PR abiertas: **0**.
- #529: cerrada y certificada.
- Vercel producción: `READY`.
- Check del commit: `success`.
- Errores/fatales runtime recientes: **0 detectados** en la ventana auditada.

Este documento y `docs/CERTIFICACION-AMPARO-2026-09-02.md` son una sincronización canónica del cierre editorial. No cambian aplicación, esquema, UX ni arquitectura.

## Frente de Hermandades · Amparo

**AMPARO → 🟢 CERTIFICADA**

La auditoría completa queda registrada en `docs/CERTIFICACION-AMPARO-2026-09-02.md`.

### Identidad y Sede

- Nombre canónico: **Real, Venerable e Ilustre Hermandad de Nuestra Señora del Amparo**.
- Nombre popular: **El Amparo**.
- Tipo: **Gloria**.
- Localidad: **Sevilla**.
- Sede canónica: **Real Parroquia de Santa María Magdalena**.
- Dirección: **Calle Bailén, 5, 41001 Sevilla**.
- Horarios de la Sede: documentados y verificados el **2 de septiembre de 2026**.
- La información de templo, dirección y horarios permanece en el nodo canónico de Sede; no se duplica en Hermandad.

### Titular

- Nuestra Señora del Amparo: publicada y relacionada como titular.
- Autoría conservada con prudencia documental:
  - Roque de Balduque → atribución;
  - Antonio de Alfián → atribución de policromía/estofado.
- Intervenciones documentadas:
  - José Rodríguez Rivero-Carrera · restauración · 1986;
  - Almudena Fernández García · limpieza de conservación · 2015;
  - José Joaquín Fijo León · limpieza de conservación · 2015.
- Autoría, atribución e intervención permanecen separadas.

### Paso

- Paso procesional de Nuestra Señora del Amparo: publicado y relacionado con la titular.
- Dos fases estructuradas:
  - **Peana procesional · 1831** → Melchor Cano (diseño) + Lucas de Prada (ejecución/talla).
  - **Paso procesional actual · 1927** → Taller de Antonio Corrales, Rafael Domínguez, Luis Domínguez, Montenegro y Jorge Ferrer.
- La fuente oficial identifica al proyectista del paso únicamente como **Montenegro**; no se inventa nombre de pila ni una identificación más precisa.
- Capataz: **Ismael Vargas**, vigente en 2026; fecha inicial no documentada.

### Patrimonio material

Se mantienen separados patrimonio material y patrimonio musical.

Patrimonio material certificado:

1. **Simpecado de Gala** · 1804–1807, estrenado en 1807.
   - Bordado original: taller de Francisca de Paula Zuloaga.
   - Lienzo central: Salvador Gutiérrez.
   - Restauraciones estructuradas y fechadas: Joaquín Ossorio, Almudena Fernández García, José Joaquín Fijo León y José Ramón Paleteiro.
   - Media autorizada y trazable.
2. **Manto procesional de Nuestra Señora del Amparo** · 1851.
   - Autoría original: Manuel María Ariza.
   - Restauración 2009–2010: Emilio José Gómez Moreno.
   - Sin fotografía publicada al no existir media certificada en el cierre.
3. **Coronas históricas de Nuestra Señora del Amparo y el Niño Jesús** · principios del siglo XVIII.
   - Proyecto de restauración y enriquecimiento reversible documentado para la Coronación Canónica de 2026.
   - Participan Joaquín Ossorio, Ana Amparo Cerrejón Lozano y Javier Sánchez de los Reyes.
   - Sin fotografía publicada al no existir media certificada en el cierre.

Regla aplicada: **sin foto > foto sin derechos**.

### Patrimonio musical

**Procesión → 6 marchas dedicadas y relacionadas**

- `Amparo` · José del Castillo Díaz · 1929.
- `Virgen del Amparo` · José Martínez Peralto · 1956.
- `Amparo` · Pedro Morales Muñoz · 2005.
- `Bajo tu Amparo` · Rubén Jordán Flores · 2014.
- `Al Amparo de María` · Juan Catón Guillén / instrumentación de Alberto Barea · 2015.
- `Virgen del Amparo` · Julián Martín Fernández · 2015.

**Cultos → 7 composiciones separadas de las marchas procesionales**

- Plegaria a la Santísima Virgen del Amparo · 1920.
- Plegaria a la Santísima Virgen del Amparo · 1923.
- Alabado · 1924.
- Sub Tuum Praesidium · 2014.
- Missa Refugium Peccatorum · 2015.
- Bajo tu Amparo · 2016.
- Sonata da Chiesa Sancta Dei Genitrix · 2019.

No se registra como marcha procesional ninguna obra cuyo destino documentado sea el culto interno.

### Cultos 2026 y Coronación Canónica

Los cultos ordinarios permanecen separados de las ocurrencias excepcionales de 2026.

Programa extraordinario estructurado sin convertirlo en recurrencia anual:

- Besamanos extraordinario · **17–18 de octubre**.
- Novena de la Coronación · **24 de octubre–1 de noviembre**; el 29 de octubre se documenta la procesión claustral con el Santísimo Sacramento.
- Vísperas Solemnes · **7 de noviembre**.
- Función Principal de Instituto y **Coronación Canónica** · **8 de noviembre · 10:00**.
- Segundo Besamanos extraordinario · **14–15 de noviembre**.
- Misa por los hermanos difuntos · **16 de noviembre · 20:00**.

La **Coronación Canónica de Nuestra Señora del Amparo** queda como `event` propio, fechado el 8 de noviembre de 2026, relacionado con la Hermandad y la Real Parroquia de Santa María Magdalena.

### Salida y acompañamiento

Corrección editorial de actualidad estricta:

- La salida de la tarde del **8 de noviembre de 2026** queda clasificada como **Procesión de Gloria ordinaria**, celebrada en la jornada de la Coronación Canónica.
- El hecho extraordinario es la **Coronación Canónica** de la mañana; no se fuerza la procesión anual a `extraordinary`.
- Salida documentada: **17:00**.
- Visita prevista al Ayuntamiento y continuación por la feligresía.
- Itinerario detallado y hora de entrada permanecen pendientes de anuncio oficial.
- **Carmen de Salteras** → tras el paso → vigente en 2026; fecha inicial no documentada.
- La posición musical queda relacionada con la salida y con el paso exacto.

### Multimedia

- Titular: media autorizada, con `alt`, autor/crédito y estado de derechos.
- Paso: se conserva la fotografía autorizada y acreditada.
- Simpecado: media autorizada y acreditada.
- Se retiró de la ficha una fotografía duplicada del paso que figuraba sin autor/crédito; el asset quedó eliminado al no conservar otras relaciones.
- Manto y coronas: sin media publicada por ausencia de recurso certificado.

### Fuentes

- **14 Fuentes relevantes** sostienen los bloques certificados.
- Prioridad aplicada: web oficial de la Hermandad → fuentes institucionales/diocesanas → fuente especializada actual para datos no disponibles en la web oficial.
- URLs duplicadas dentro del ámbito Amparo: **0**.
- No quedan cultos, ocurrencias, intervenciones, capataz ni acompañamiento vigente sin Fuente.

### Salud del grafo

**RESULTADO → 🟢 LIMPIO**

- Fases del paso: **2**.
- Autorías/agentes estructurados en fases: **7**.
- Patrimonio material: **3 piezas**.
- Música de cultos: **7 obras**.
- Marchas procesionales dedicadas: **6**.
- Media crítica incompleta: **0**.
- Intervenciones sin Fuente: **0**.
- Cultos sin Fuente: **0**.
- Ocurrencias 2026 sin Fuente: **0**.
- Capataz vigente sin Fuente: **0**.
- Acompañamiento vigente sin Fuente: **0**.
- Entidades del ámbito Amparo huérfanas detectadas: **0**.
- URLs de Fuente duplicadas en el ámbito auditado: **0**.

## Primera Edición y #492

**#492 → 🟣 AISLADA · NO BLOQUEA ESTE FRENTE EDITORIAL**

La deuda de Supabase Preview Branches sigue sin resolverse y continúa bloqueando:

- nuevo DDL;
- nuevas tablas;
- nuevas migraciones estructurales;
- cambios RLS;
- ampliaciones de arquitectura.

No bloquea:

- contenido;
- Fuentes;
- media trazable;
- relaciones sobre tablas existentes;
- patrimonio;
- cultos;
- acompañamientos;
- acontecimientos y salidas soportados por el modelo actual.

## Aportaciones públicas

**APORTACIONES → ⚪ INFRAESTRUCTURA PREPARADA · 🔒 DESACTIVADAS**

- `PUBLIC_CONTRIBUTIONS_ENABLED=false` permanece como estado canónico.
- No se activa `/colabora` ni escritura pública durante este corte.
- No se modifica RLS, Auth, Storage ni secretos.

## Siguiente frente

Amparo queda cerrada y certificada.

A partir de la integración de este documento debe seleccionarse **una sola Hermandad** siguiente, con este orden de prioridad:

1. actualidad documental;
2. salida o acontecimiento extraordinario próximo cuando exista;
3. deuda documental real;
4. potencial relacional con Imágenes, Pasos, Bandas, Patrimonio, Cultos, Salidas y Fuentes.

No se abrirá en paralelo otra Hermandad, Banda, UX, módulo, tabla ni arquitectura.
