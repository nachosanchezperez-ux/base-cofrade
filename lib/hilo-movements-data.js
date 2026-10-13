// Curated editorial pilot: announcement dates are never technical update dates.
// One entry is reused on the hub and its brotherhood fiche.
export const HILO_MOVEMENTS = [
  {
    id: 'san-esteban-santa-ana-2027',
    eventKey: 'san-esteban:palio:musica:2027',
    status: 'published',
    announcedOn: '2026-10-06',
    documentedOn: '2026-10-07',
    topic: 'musica',
    kind: 'Cambio',
    municipality: 'Sevilla',
    brotherhood: { id: '36b4d5c1-f7bb-4025-a09a-948e0d5d188f', label: 'San Esteban', slug: 'san-esteban' },
    title: 'Una nueva etapa musical para Madre de los Desamparados',
    summary: 'Santa Ana de Dos Hermanas acompañará al palio desde el Martes Santo de 2027 y tomará el relevo de la Banda de Música de Las Cigarreras.',
    context: 'El relevo cierra la vinculación de Las Cigarreras con el palio, iniciada en 2009, y abre una nueva etapa con la formación de Dos Hermanas.',
    effectiveLabel: 'Martes Santo de 2027',
    relations: [
      { id: 'a23934c9-93e9-4bf1-886e-d98ec170b74f', type: 'band', label: 'Banda de Música de Las Cigarreras', role: 'Hasta 2026' },
      { id: '49b5a3e0-c7d6-4dac-980e-3eddc355a7d1', type: 'band', label: 'Santa Ana de Dos Hermanas', role: 'Desde 2027' },
    ],
    discover: { label: 'Compara el acompañamiento de 2026 y 2027', href: '/semana-santa/2027/cambios-musicales#cambio-30d8477f-79ce-423d-8b36-d9366b37bf48' },
    sources: [{ label: 'El Pespunte · Nacho Sánchez · 6 de octubre de 2026', href: 'https://www.elpespunte.es/articulo/cofrade/apuesta-san-esteban-santa-ana-reordena-mapa-musical-martes-santo/20261006104411155178.html' }],
  },
  {
    id: 'baratillo-continuidad-musical-2027',
    eventKey: 'baratillo:continuidad-musical:2027',
    status: 'published',
    announcedOn: '2026-09-24',
    documentedOn: '2026-10-07',
    topic: 'musica',
    kind: 'Renovación',
    municipality: 'Sevilla',
    brotherhood: { id: '10000000-0000-0000-0000-000000000001', label: 'El Baratillo', slug: 'el-baratillo' },
    title: 'El Miércoles Santo mantiene sus tres acompañamientos',
    summary: 'El Baratillo ratifica la continuidad de Los Gitanos Juvenil, El Sol y el Carmen de Salteras para 2027.',
    context: 'Los Gitanos Juvenil abrirá la Cruz de Guía; El Sol seguirá tras la Piedad y el Carmen de Salteras, tras la Caridad. Es una renovación, no un relevo de bandas.',
    effectiveLabel: 'Miércoles Santo de 2027',
    relations: [
      { id: '218bf3a6-9e00-4691-8306-bd86627a5d19', type: 'band', label: 'Los Gitanos Juvenil', role: 'Cruz de Guía' },
      { id: '8c860cd1-11cb-4cbc-8a40-2eaec0543f8b', type: 'band', label: 'El Sol', role: 'Paso de la Piedad' },
      { id: '24e2b89a-4d72-4ea8-9144-8972cf751046', type: 'band', label: 'Carmen de Salteras', role: 'Palio de la Caridad' },
    ],
    discover: { label: 'Descubre la historia musical del Baratillo', href: '/hermandades/el-baratillo#musica' },
    sources: [{ label: 'Hermandad del Baratillo · comunicado del 24 de septiembre de 2026', href: 'https://hermandadelbaratillo.es/renovacion-del-acompanamiento-musical/' }],
  },
  {
    id: 'domingo-ramos-orden-carrera-oficial-2027',
    eventKey: 'sevilla:domingo-ramos:orden-carrera-oficial:2027',
    status: 'published',
    announcedOn: '2026-10-09',
    documentedOn: '2026-10-09',
    topic: 'agenda',
    kind: 'Carrera Oficial',
    municipality: 'Sevilla',
    brotherhood: { id: 'c1000000-0000-0000-0000-000000000002', label: 'La Cena', slug: 'la-cena' },
    title: 'La Cena irá tercera: el Consejo fija el orden del Domingo de Ramos de 2027',
    summary: 'El Consejo ha aprobado la propuesta de las hermandades del Domingo de Ramos para su paso por la Carrera Oficial. La Borriquita abrirá la jornada, seguida de Jesús Despojado y la Cena; después pasarán Hiniesta, Paz, San Roque, Estrella, Amargura y Amor.',
    context: 'El comunicado publicado el 9 de octubre confirma el orden de paso para 2027. La fecha concreta de la aprobación no consta y el anuncio no detalla horarios ni itinerarios.',
    effectiveLabel: 'Domingo de Ramos · 21 de marzo de 2027',
    relations: [
      { id: '165e5e9a-b28b-44dc-97e6-b7a8f39c97e4', type: 'brotherhood', label: 'El Amor · La Borriquita', role: 'Primera y novena en Carrera Oficial' },
      { id: '0978bcd8-f990-4e5a-b3db-32e60f50466d', type: 'brotherhood', label: 'Jesús Despojado', role: 'Segunda en Carrera Oficial' },
      { id: 'c6100000-0000-4000-8000-000000000008', type: 'brotherhood', label: 'La Hiniesta', role: 'Cuarta en Carrera Oficial' },
      { id: 'a4220000-0000-0000-0000-000000000003', type: 'brotherhood', label: 'La Paz', role: 'Quinta en Carrera Oficial' },
      { id: 'c6100000-0000-4000-8000-000000000002', type: 'brotherhood', label: 'San Roque', role: 'Sexta en Carrera Oficial' },
      { id: 'b5c5c238-bf95-4270-a1f0-c73ffd54ea4c', type: 'brotherhood', label: 'La Estrella', role: 'Séptima en Carrera Oficial' },
      { id: 'aae6486d-3c23-4ffe-a7b3-17d737233155', type: 'brotherhood', label: 'La Amargura', role: 'Octava en Carrera Oficial' },
    ],
    discover: { label: 'Descubre los titulares y pasos de la Cena', href: '/hermandades/la-cena' },
    sources: [
      { label: 'Consejo de Hermandades de Sevilla · comunicado oficial del 9 de octubre de 2026', href: 'https://www.hermandades-de-sevilla.org/consejo/comunicado-oficial-orden-de-paso-para-el-domingo-de-ramos-de-2027/' },
      { label: 'Arte Sacro · orden de paso del Domingo de Ramos de 2027 · 9 de octubre de 2026', href: 'https://www.artesacro.org/Noticia/Ver/169426/orden-paso-domingo-ramos-2027' },
    ],
  },
  {
    id: 'carmen-candidatura-jose-luis-oliva-2026',
    eventKey: 'carmen:elecciones:candidatura:2026',
    status: 'published',
    announcedOn: '2026-10-12',
    documentedOn: '2026-10-12',
    topic: 'hermandad',
    kind: 'Elecciones',
    municipality: 'Sevilla',
    brotherhood: { id: 'eed0dc91-db66-4bb1-a194-c13a0a5900fc', label: 'El Carmen', slug: 'carmen-doloroso' },
    title: 'El Carmen llegará a las urnas con una sola candidatura',
    summary: 'José Luis Oliva Martínez encabeza la única candidatura presentada al cabildo electoral del Carmen de Omnium Sanctorum, previsto para el 16 de octubre. Su proyecto «Unidos por el Carmen» concurre a un mandato de cuatro años y aborda los cultos, la formación, la caridad, la juventud, la estación de penitencia, el patrimonio, la vida de hermandad y la comunicación.',
    context: 'Oliva ha sido diputado de Cultos, mayordomo, consiliario y, durante los últimos cuatro años, teniente de hermano mayor. Su programa propone culminar el techo de palio y los varales de la Virgen del Carmen, estudiar mejoras en el misterio del Señor de la Paz y valorar un altar para los titulares. Son propuestas electorales: la elección aún no se ha celebrado y estas actuaciones no se presentan como acuerdos aprobados.',
    effectiveLabel: 'Cabildo General de Elecciones · 16 de octubre de 2026',
    relations: [],
    discover: { label: 'Descubre los titulares y pasos del Carmen', href: '/hermandades/carmen-doloroso' },
    sources: [{ label: 'Hermandad del Carmen · candidatura y programa de José Luis Oliva · 12 de octubre de 2026', href: 'https://www.hermandaddelcarmen.es/jose-luis-oliva-martinez-candidato-hermano-mayor/' }],
  },
  {
    id: 'cigarreras-soberana-entrega-panaderos-2026',
    eventKey: 'panaderos:cigarreras:soberana-entrega:2026',
    status: 'published',
    announcedOn: '2026-10-11',
    documentedOn: '2026-10-12',
    topic: 'musica',
    kind: 'Estreno y concierto',
    municipality: 'Sevilla',
    brotherhood: { id: 'c1000000-0000-0000-0000-000000000005', label: 'Los Panaderos', slug: 'hermandad-de-los-panaderos' },
    title: 'Las Cigarreras estrenará «Soberana entrega» por los 425 años de Los Panaderos',
    summary: 'Miguel Ángel Font Morgado firma la nueva marcha de Las Cigarreras, dedicada a Los Panaderos por su 425 aniversario fundacional. Su estreno está previsto en el concierto del 16 de octubre en la Iglesia de la Misericordia, dentro de un programa dedicado a la hermandad.',
    context: 'Font fue componente de Las Cigarreras en los años noventa y se incorpora ahora como compositor a su repertorio de cara a la Semana Santa de 2027. El anuncio oficial de la marcha se publicó el 11 de octubre; la información del concierto difundida por El Pespunte el 12 de octubre fija el comienzo a las 21:30 y anuncia retransmisión por el canal de YouTube de la banda. El estreno se presenta como previsto, no como celebrado.',
    effectiveLabel: 'Concierto y estreno previsto · 16 de octubre de 2026 · 21:30 · Iglesia de la Misericordia',
    relations: [
      { id: 'b1000000-0000-0000-0000-000000000001', type: 'band', label: 'Las Cigarreras', role: 'Banda de Cornetas y Tambores · Estreno' },
      { id: 'bc201c9e-bae7-4c25-8658-67231642b812', type: 'author', label: 'Miguel Ángel Font Morgado', role: 'Compositor de «Soberana entrega»' },
    ],
    discover: { label: 'Descubre el repertorio y la historia de Las Cigarreras', href: '/bandas/las-cigarreras' },
    sources: [
      { label: 'Las Cigarreras · anuncio oficial de «Soberana entrega» · 11 de octubre de 2026', href: 'https://lascigarreras.net/estrenos-2026-soberana-entrega/' },
      { label: 'El Pespunte · Nacho Sánchez · concierto y estreno · 12 de octubre de 2026', href: 'https://www.elpespunte.es/articulo/cofrade/cigarreras-pondra-musica-425-anos-panaderos-estreno-soberana-entrega/20261012132333156078.html' },
    ],
  },
  {
    "id": "exaltacion-via-crucis-cofradias-2027",
    "eventKey": "sevilla:exaltacion:via-crucis-cofradias:2027",
    "status": "published",
    "announcedOn": "2026-10-08",
    "documentedOn": "2026-10-13",
    "topic": "agenda",
    "kind": "Designación",
    "municipality": "Sevilla",
    "brotherhood": {
      "id": "76eebd4c-3364-4744-9b12-2f4f37331e83",
      "label": "La Exaltación",
      "slug": "hermandad-de-la-exaltacion-sevilla"
    },
    "title": "El Cristo de la Exaltación presidirá el Vía Crucis de las Cofradías de 2027",
    "summary": "El Consejo ha elegido al Santísimo Cristo de la Exaltación para presidir el Vía Crucis Penitencial de las Hermandades de Sevilla. La imagen de Santa Catalina encabezará el rezo en la Catedral el lunes 15 de febrero de 2027.",
    "context": "La Sección de Penitencia realizó la elección el 8 de octubre de 2026, tras el conocimiento de la Junta Superior del Consejo. El calendario oficial sitúa el rezo a las 20:00. El comunicado de designación no concreta recorridos ni horarios de los traslados; estos detalles se incorporarán cuando sean publicados oficialmente.",
    "effectiveLabel": "Vía Crucis de las Cofradías · 15 de febrero de 2027 · 20:00 · Catedral de Sevilla",
    "relations": [],
    "discover": {
      "label": "Conoce al Santísimo Cristo de la Exaltación",
      "href": "/imagenes/santisimo-cristo-exaltacion-sevilla"
    },
    "sources": [
      {
        "label": "Consejo de Hermandades de Sevilla · designación oficial · 8 de octubre de 2026",
        "href": "https://www.hermandades-de-sevilla.org/consejo/el-santisimo-cristo-de-la-exaltacion-presidira-el-via-crucis-de-sevilla-2027/"
      },
      {
        "label": "Consejo de Hermandades de Sevilla · calendario del Vía Crucis de 2027",
        "href": "https://www.hermandades-de-sevilla.org/events/via-crucis-de-las-hermandades-penitenciales-de-sevilla-2027/"
      }
    ]
  },
  {
    "id": "simposio-hermandades-sevilla-provincia-2026",
    "eventKey": "consejo:simposio-hermandades:2026",
    "status": "published",
    "announcedOn": "2026-10-13",
    "documentedOn": "2026-10-13",
    "topic": "patrimonio",
    "kind": "Historia y patrimonio",
    "municipality": "Sevilla",
    "brotherhood": {
      "id": "e9391be0-b38a-4667-bd58-92c5368c8666",
      "label": "Pasión",
      "slug": "hermandad-de-pasion-sevilla"
    },
    "title": "El paso de Pasión y el ajuar de Valme, protagonistas del próximo simposio cofrade",
    "summary": "El Consejo ha anunciado el XXVII Simposio sobre Hermandades de Sevilla y su provincia, con ocho ponencias que recorrerán archivos, bordados y orfebrería. El encuentro abordará también la reorganización de la Cena y la historia de corporaciones de Osuna y El Saucejo; podrá seguirse presencialmente y por YouTube.",
    "context": "José Roda Peña dirige el encuentro. La inscripción cuesta 10 euros, con aforo limitado, y podrá formalizarse del 15 de octubre al 11 de noviembre. El programa incluye el paso de Jesús de la Pasión, el ajuar de la Virgen de Valme, la reorganización de la Cena en 1912, Humildad y Paciencia de Osuna y el Rosario de El Saucejo. El anuncio del Consejo está fechado el 13 de octubre, sin hora publicada.",
    "effectiveLabel": "XXVII Simposio · 14 de noviembre de 2026 · 10:00 · Consejo de Hermandades, San Gregorio, 26",
    "relations": [
      {
        "id": "52da914c-056f-47a1-85fc-c88f10a86bbe",
        "type": "brotherhood",
        "label": "Valme · Dos Hermanas",
        "role": "Ajuar de la Virgen"
      },
      {
        "id": "c1000000-0000-0000-0000-000000000002",
        "type": "brotherhood",
        "label": "La Cena",
        "role": "Reorganización de 1912"
      },
      {
        "id": "c0160034-0302-4000-8000-000000000002",
        "type": "brotherhood",
        "label": "Humildad y Paciencia · Osuna",
        "role": "Historia a través de sus actas"
      }
    ],
    "discover": {
      "label": "Descubre los pasos de Pasión",
      "href": "/hermandades/hermandad-de-pasion-sevilla#pasos"
    },
    "sources": [
      {
        "label": "Consejo de Hermandades de Sevilla · convocatoria oficial · 13 de octubre de 2026",
        "href": "https://www.hermandades-de-sevilla.org/consejo/xxvii-simposio-sobre-hermandades-de-sevilla-y-su-provincia/"
      }
    ]
  },
  {
    "id": "santo-entierro-nuevo-recorrido-2027",
    "eventKey": "santo-entierro:recorrido:2027",
    "status": "published",
    "announcedOn": "2026-10-13",
    "documentedOn": "2026-10-13",
    "topic": "agenda",
    "kind": "Nuevo recorrido",
    "municipality": "Sevilla",
    "brotherhood": {
      "id": "f69e5728-af3d-4f3a-963a-81068b417a85",
      "label": "El Santo Entierro",
      "slug": "santo-entierro-sevilla"
    },
    "title": "El Santo Entierro volverá por el Postigo y el Arenal en 2027",
    "summary": "La cofradía de San Gregorio cambia su camino de ida y vuelta para el próximo Sábado Santo. Llegará al Duque por Santa Vicenta María y Teniente Borges y, tras salir de la Catedral, regresará por el Postigo del Aceite, Castelar, Gamazo y Plaza Nueva.",
    "context": "El Consejo ha aprobado la propuesta, respaldada por unanimidad por los hermanos mayores del Sábado Santo para mejorar la fluidez de la jornada. Recorrido del cartel de la Hermandad: salida, Alfonso XII, Santa Vicenta María, Teniente Borges, plaza del Duque (lado de El Corte Inglés), Carrera Oficial, plaza Virgen de los Reyes, plaza del Triunfo, Fray Ceferino González, Almirantazgo, Postigo del Aceite, Dos de Mayo, Arfe, Puerta del Arenal, Castelar, Gamazo, Barcelona, Plaza Nueva, Tetuán, Velázquez, O’Donnell, plaza de la Campana, plaza del Duque, Alfonso XII y entrada. El anuncio no concreta horarios. El cartel detalla Dos de Mayo, Velázquez y O’Donnell, calles que no aparecen desglosadas en la relación del Consejo.",
    "effectiveLabel": "Estación de penitencia · Sábado Santo de 2027",
    "relations": [],
    "discover": {
      "label": "Conoce los titulares y pasos del Santo Entierro",
      "href": "/hermandades/santo-entierro-sevilla#pasos"
    },
    "sources": [
      {
        "label": "Consejo de Hermandades de Sevilla · aprobación del nuevo recorrido · 13 de octubre de 2026",
        "href": "https://www.hermandades-de-sevilla.org/consejo/la-seccion-de-penitencia-del-consejo-aprueba-la-modificacion-del-recorrido-de-la-hermandad-del-santo-entierro/"
      }
    ]
  },
]
