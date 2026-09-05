# Certificación · Consolación de Utrera

**Fecha:** 5 de septiembre de 2026  
**Base de trabajo:** `main = 6b8c25be9360b74d011b93e95678f6e92cb68ec7`  
**Entidad:** `8d4e62d9-a428-4363-afc7-6a2f9e8c1450` · `consolacion-utrera`  
**Régimen:** FIRST EDITION FREEZE · #492 aislada

## Diagnóstico de partida

La Hermandad estaba publicada al 30 % técnico y mantenía una única salida de 2026 ya estructurada, pero carecía de sede canónica, titular, pasos, cultos, acontecimientos, patrimonio y grafo suficiente.

## Estado de cierre

Completitud técnica tras el lote: **90 %**.

Se consideran documentados:

- identidad;
- sede canónica;
- día/ciclo procesional;
- titular;
- pasos/andas;
- cultos;
- salidas ordinarias y extraordinarias;
- música histórica verificable;
- patrimonio material;
- acontecimientos;
- patrimonio musical;
- agentes/autores;
- Fuentes y relaciones.

El único indicador técnico negativo es `crest=false`.

## Identidad y sede

Denominación canónica: **Pontificia, Real e Ilustre Hermandad de Nuestra Señora de Consolación Coronada**.  
Nombre popular: **Consolación de Utrera**.  
Fundación: **siglo XVI**.  
Sede canónica: **Santuario de Nuestra Señora de Consolación**, Paseo de Consolación, s/n, Utrera.

La historia recoge la llegada de la imagen a Utrera en 1507, la ermita de 1520, la vinculación con los Mínimos, la antigua romería, la distinción de Alcaldesa Perpetua, la Coronación Canónica y los Años Jubilares de 2007 y 2014.

## Titular

**Nuestra Señora de Consolación Coronada** queda creada como Imagen publicada y vinculada a la Hermandad y a su residencia actual en el Santuario.

La autoría exacta no se fuerza: las Fuentes oficiales consultadas no proporcionan una atribución suficientemente firme para convertirla en dato canónico.

## Pasos y andas

1. **Andas procesionales de Nuestra Señora de Consolación Coronada (2026)**: metal repujado y cincelado con acabado en baño de plata, vigentes para la salida del 8 de septiembre de 2026. No se fija taller como dato canónico por falta de identificación inequívoca en la Fuente principal utilizada.
2. **Trono de la Coronación de Nuestra Señora de Consolación (1964)**: obra de Fernando Marmolejo, conservado como pieza histórica y reutilizado en la procesión de clausura del II Congreso Internacional de Hermandades de 2024.

## Cultos

Cuatro ciclos recurrentes estructurados:

- Solemne Novena;
- Función Principal del 8 de septiembre;
- cultos por el aniversario de la Coronación Canónica;
- veneración anual.

Ocurrencias 2026:

- Novena · 30/08–07/09 · `announced`;
- Función Principal · 08/09 · `announced`;
- Triduo del LXII aniversario · 28–30/04 · `held`;
- Veneración · 03/05 · `held`.

El modelo no dispone de estado `ongoing`; por ello la Novena que está celebrándose en el corte del 5 de septiembre permanece `announced` y no se falsifica como `held`.

## Salidas y temporalidad

### 2026

Se reutiliza la salida existente del **8 de septiembre de 2026 a las 07:00**, que permanece `announced`. Se vincula a la nueva serie anual, al Santuario como origen/destino y al recorrido por el Real de Consolación y Parque del V Centenario.

El **Coro de la Virgen** se conserva en notas públicas y no se transforma en una banda.

### 2024

Se incorpora la participación de la Virgen en la procesión de clausura del **II Congreso Internacional de Hermandades y Piedad Popular**, el 8 de diciembre de 2024 en Sevilla, como salida extraordinaria `held`.

La **Asociación Musical Álvarez Quintero** queda relacionada exclusivamente con esa salida histórica de 2024. No existe ningún periodo de acompañamiento musical actual para 2026.

## Patrimonio

Tres piezas estructuradas bajo la Hermandad para su lectura pública:

- Barquito de oro y cristal de roca · siglo XVI;
- coronas de la Coronación Canónica · Fernando Marmolejo · 1964;
- peana de plata de la Coronación · donación de la Hermandad de la Macarena · 1964.

Durante el QA se detectó que inicialmente estas piezas estaban parentadas a la Imagen. El lector común de Hermandades carga el patrimonio cuyo padre es la Hermandad, por lo que se corrigió la relación de datos sin introducir ninguna excepción de slug ni cambio de UX.

## Patrimonio musical y agentes

Cinco composiciones dedicadas quedan relacionadas con la Imagen:

- *Himno de la Virgen de Consolación de Utrera* · José Antonio Ramírez García;
- *Consolación* · Nicolás Miguel Barbero Rivas · 1998;
- *Plegaria a la Virgen de Consolación* · José Salazar Rodríguez · 2005;
- *Virgen de Consolación de Utrera · V Centenario* · José Antonio Ramírez García · 2006;
- *Señora y Madre de Utrera* · Adrián Tinajero Cadenas · 2022.

No se inventa año para el Himno cuando la Fuente institucional consultada no lo fija.

## Fuentes principales

- Santuario Diocesano de Nuestra Señora de Consolación · historia y patrimonio;
- Santuario Diocesano · cultos 2026;
- Directorio diocesano de Hermandades y Cofradías · identidad, sede y patrimonio musical;
- Utrera al día · nuevas andas 2026;
- Consejo General de Hermandades y Cofradías de Sevilla · procesión de clausura de 2024;
- UTRERAWeb · cultos del LXII aniversario de la Coronación.

## QA

- completitud técnica: 30 % → 90 %;
- Imagen: 1;
- pasos: 2;
- cultos: 4;
- ocurrencias de culto 2026: 4;
- salidas: 2;
- acontecimientos: 4;
- piezas patrimoniales: 3;
- marchas dedicadas: 5;
- acompañamientos históricos 2024: 1;
- periodos musicales actuales: 0;
- slugs duplicados del lote: 0;
- relaciones de Imagen duplicadas: 0;
- relaciones de Paso duplicadas: 0;
- acontecimientos sin `involves`: 0;
- salidas futuras marcadas como `held`: 0;
- slugs musicales duplicados: 0;
- ficha pública: HTTP 200;
- SEO: `index, follow` + canonical correcto;
- runtime: peticiones de la ficha con 200 y sin errores asociados.

## Deuda legítima

- **Escudo / cabecera / fotografías**: pendiente de recurso con procedencia y derechos trazables.
- **Autoría exacta de la talla**: pendiente de Fuente suficientemente firme.
- **Vestidor actual**: dato no fijado sin evidencia verificable.
- **Autoría exacta de las andas 2026**: pendiente de Fuente primaria inequívoca; existe prensa secundaria que atribuye el trabajo, pero no se fuerza como dato canónico en este lote.
- **Música vigente 2026**: no se inventa. El coro previsto para la salida no equivale a una formación musical de acompañamiento en el modelo de bandas.

Estas ausencias no invalidan el cierre documental.

## Restricciones

**DDL 0 · tablas nuevas 0 · migraciones 0 · RLS 0 · UX nueva 0 · arquitectura 0.**

#492 permanece aislada y no ha interferido en el cierre editorial.
