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
  {
    "id": "moron-inmaculada-cartelista-jimenez-munoz-2026",
    "eventKey": "moron:inmaculada:cartelista:2026",
    "status": "published",
    "announcedOn": null,
    "documentedOn": "2026-10-14",
    "topic": "patrimonio",
    "kind": "Cartelista",
    "municipality": "Morón de la Frontera",
    "editorialException": true,
    "editorialSubject": {
      "label": "Inmaculada Concepción · Patrona de Morón",
      "kind": "Asociación de Fieles"
    },
    "title": "José Antonio Jiménez Muñoz anunciará las fiestas de la Inmaculada de Morón",
    "summary": "José Antonio Jiménez Muñoz realizará el cartel de las Fiestas Patronales de Morón de la Frontera de 2026, dedicadas a la Inmaculada Concepción. La cuenta de la patrona ha anunciado la elección del artista, autor del cartel de la Semana Santa de Málaga de 2019.",
    "context": "El anuncio presenta al artista como licenciado en Bellas Artes por la Universidad de Granada y destaca su trayectoria en el arte sacro y la cartelería. Se trata del nombramiento del cartelista: la publicación no muestra la obra ni concreta la fecha de su presentación. La captura de @patronademoron consultada el 14 de octubre indica «hace 5 días»; la fecha exacta del anuncio queda pendiente de comprobación.",
    "effectiveLabel": "Fiestas Patronales de 2026 · Presentación del cartel aún sin fecha confirmada",
    "relations": [],
    "sources": [
      {
        "label": "Patrona de Morón · anuncio en Instagram aportado mediante captura; fecha exacta pendiente · enlace al perfil",
        "href": "https://www.instagram.com/patronademoron/"
      },
      {
        "label": "Turismo de Morón · identificación de la Asociación de Fieles de la Inmaculada (2023)",
        "href": "https://www.turismomoron.es/es/agenda/2023/noviembre/397/4-concurso-de-dibujo-patrona-de-moron"
      }
    ]
  },
{
  "id": "glorias-sevilla-cartelista-alejandro-martin-2027",
  "eventKey": "consejo:glorias:cartelista:2027",
  "status": "published",
  "announcedOn": "2026-10-13",
  "documentedOn": "2026-10-14",
  "topic": "patrimonio",
  "kind": "Cartelista",
  "municipality": "Sevilla",
  "editorialException": true,
  "editorialSubject": {
    "label": "Consejo de Hermandades de Sevilla",
    "kind": "Sección de Gloria"
  },
  "title": "Las Glorias de 2027 llevarán la firma de Alejandro Martín Caballero",
  "summary": "El Consejo ha encargado al artista rondeño el cartel que anunciará las Glorias de Sevilla de 2027. Su trayectoria ya está vinculada al Carmen de San Leandro, para el que realizó el cartel de 2025 y la pintura de la cartela frontal de la peana estrenada en 2026.",
  "context": "La Sección de Gloria ha designado al cartelista tras el conocimiento de la Junta Superior del Consejo. Formado en la Escuela de Arte de Sevilla, con especialidad en dorado y policromía, Alejandro Martín Caballero desarrolla su carrera artística en Ronda. El anuncio confirma el encargo, pero todavía no concreta la fecha de presentación ni la imagen que protagonizará el cartel.",
  "effectiveLabel": "Glorias de Sevilla de 2027 · Presentación del cartel aún sin fecha anunciada",
  "relations": [],
  "sources": [
    {
      "label": "Consejo de Hermandades de Sevilla · designación oficial · 13 de octubre de 2026",
      "href": "https://www.hermandades-de-sevilla.org/consejo/alejandro-martin-caballero-designado-cartelista-de-las-glorias-de-sevilla-2027/"
    }
  ]
},
{
  "id": "carmen-sanlucar-santa-ana-2026-2027",
  "eventKey": "carmen-sanlucar:musica:santa-ana:2026-2027",
  "status": "published",
  "announcedOn": null,
  "documentedOn": "2026-10-14",
  "topic": "musica",
  "kind": "Cambio musical",
  "municipality": "Sanlúcar la Mayor",
  "editorialException": true,
  "editorialSubject": {
    "label": "El Carmen de Sanlúcar la Mayor",
    "kind": "Hermandad de Gloria"
  },
  "title": "Santa Ana pondrá nuevos sones al Carmen de Sanlúcar la Mayor",
  "summary": "Santa Ana de Dos Hermanas acompañará a la Virgen del Carmen en el regreso del Rosario de la Aurora del 8 de noviembre y en la procesión del 24 de julio de 2027. La formación toma el relevo de Virgen de las Angustias; en la ida del Rosario cantará el Coro de San José Obrero.",
  "context": "El Pespunte recoge el nuevo acompañamiento en una información publicada el 14 de octubre de 2026 a las 13:00. La fecha exacta del comunicado original de la Hermandad queda pendiente de comprobación. La corporación ha agradecido a Virgen de las Angustias los años de acompañamiento. Las dos actuaciones documentadas no permiten atribuir una duración contractual adicional.",
  "effectiveLabel": "Rosario de la Aurora · 8 de noviembre de 2026 · Procesión de gloria · 24 de julio de 2027",
  "relations": [
    {
      "id": "49b5a3e0-c7d6-4dac-980e-3eddc355a7d1",
      "type": "band",
      "label": "Santa Ana de Dos Hermanas",
      "role": "Regreso del Rosario y procesión de julio"
    }
  ],
  "discover": {
    "label": "Conoce la música y la trayectoria de Santa Ana",
    "href": "/bandas/banda-musica-santa-ana-dos-hermanas"
  },
  "sources": [
    {
      "label": "El Pespunte · Nacho Sánchez · 14 de octubre de 2026, 13:00",
      "href": "https://www.elpespunte.es/articulo/cofrade/banda-santa-ana-sustituye-banda-virgen-angustias-virgen-carmen-sanlucar-mayor/20261014130058156343.html"
    }
  ]
},
{
  "status": "published",
  "documentedOn": "2026-10-14",
  "municipality": "Sevilla",
  "relations": [],
  "id": "negritos-de-profundis-renovacion-2030",
  "eventKey": "negritos:de-profundis:renovacion:2030",
  "announcedOn": "2026-10-11",
  "topic": "musica",
  "kind": "Renovación",
  "brotherhood": {
    "id": "18463c72-89ef-46f2-a889-b5192656ba2a",
    "label": "Los Negritos",
    "slug": "hermandad-de-los-negritos"
  },
  "title": "De Profundis seguirá poniendo voz al Cristo de la Fundación hasta 2030",
  "summary": "Los Negritos renuevan por cuatro años su acuerdo con De Profundis, que acompaña al Crucificado desde 2022. La continuidad abarca también el Quinario, la Función Principal de 2027 y el traslado al paso.",
  "context": "El acuerdo se firmó el 11 de octubre, según el comunicado oficial de la Hermandad. El grupo vocal e instrumental mantiene así su presencia en la estación de penitencia del Jueves Santo y en los cultos señalados por la corporación.",
  "effectiveLabel": "Renovación hasta 2030 · Acompañamiento desde 2022",
  "sources": [
    {
      "label": "Los Negritos · renovación oficial · 11 de octubre de 2026",
      "href": "https://www.hermandadlosnegritos.org/el-grupo-de-profundis-acompanara-al-crucificado-de-la-fundacion-hasta-2030/"
    }
  ],
  "discover": {
    "label": "Conoce los titulares y la historia de Los Negritos",
    "href": "/hermandades/hermandad-de-los-negritos"
  }
},
{
  "status": "published",
  "documentedOn": "2026-10-14",
  "municipality": "Sevilla",
  "relations": [],
  "id": "san-pablo-querubines-curso-2026",
  "eventKey": "san-pablo:querubines:curso:2026",
  "announcedOn": "2026-10-13",
  "topic": "hermandad",
  "kind": "Caridad y formación",
  "brotherhood": {
    "id": "6327f47e-e6f7-4978-9a89-ad9bbf782e62",
    "label": "San Pablo",
    "slug": "hermandad-de-san-pablo"
  },
  "title": "San Pablo abre un nuevo curso de «Querubines» para los niños del barrio",
  "summary": "La Diputación de Caridad retoma su programa de convivencia y apoyo a los pequeños y sus familias. La primera cita será el 17 de octubre, a las 11:00, con una ofrenda al Rosario Doloroso durante su besamanos.",
  "context": "El proyecto da continuidad al campamento solidario «La sonrisa de un barrio». La Hermandad prevé encuentros los segundos viernes de mes, cuando la actividad lo permita, y clases de apoyo educativo desde comienzos de noviembre. Las familias pueden inscribirse en secretaría los martes y jueves de 19:00 a 21:00 o en la primera actividad.",
  "effectiveLabel": "Primer encuentro · 17 de octubre de 2026 · 11:00",
  "sources": [
    {
      "label": "San Pablo · convocatoria oficial · 13 de octubre de 2026",
      "href": "https://jesuscautivoyrescatado.com/nuevo-curso-del-proyecto-querubines/"
    }
  ],
  "discover": {
    "label": "Conoce los titulares y la historia de San Pablo",
    "href": "/hermandades/hermandad-de-san-pablo"
  }
},
{
  "status": "published",
  "documentedOn": "2026-10-14",
  "municipality": "Alcalá de Guadaíra",
  "relations": [],
  "id": "aguila-peana-restaurada-museo-2026",
  "eventKey": "aguila:peana:presentacion:2026",
  "announcedOn": "2026-10-13",
  "topic": "patrimonio",
  "kind": "Restauración",
  "brotherhood": {
    "id": "9b9f2157-d526-4096-b846-f96c43e95eb6",
    "label": "Virgen del Águila",
    "slug": "virgen-aguila-alcala-guadaira"
  },
  "title": "La peana de la Virgen del Águila mostrará su restauración en el Museo de Alcalá",
  "summary": "La peana de altar de la patrona se presentará el 15 de octubre a las 19:30 en la sala de Arte Religioso del Museo. La pieza, concebida por Antonio Illanes como peana procesional, permanecerá expuesta hasta el día 25.",
  "context": "La intervención se ha realizado con ayudas municipales para conservar el patrimonio. La pieza representa un águila con las alas desplegadas y pasó a utilizarse en el altar cuando fue sustituida en el paso por una peana de orfebrería. La novedad del anuncio es su presentación pública dentro del II Ciclo de Conservación Preventiva.",
  "effectiveLabel": "Presentación · 15 de octubre de 2026 · 19:30 · Expuesta hasta el 25 de octubre",
  "sources": [
    {
      "label": "Ayuntamiento de Alcalá de Guadaíra · 13 de octubre de 2026",
      "href": "https://www.alcaladeguadaira.es/noticias/9914/el-ii-ciclo-de-conservacion-preventiva-presenta-la-restauracion-de-la-peana-de-altar-de-la-virgen-del-aguila"
    }
  ],
  "discover": {
    "label": "Conoce los titulares y la historia de Virgen del Águila",
    "href": "/hermandades/virgen-aguila-alcala-guadaira"
  }
},
{
  "status": "published",
  "documentedOn": "2026-10-14",
  "municipality": "Sevilla",
  "relations": [],
  "id": "siete-palabras-rosario-retablo-bendecido-2026",
  "eventKey": "siete-palabras:rosario:retablo:bendicion:2026",
  "announcedOn": "2026-10-14",
  "topic": "patrimonio",
  "kind": "Nuevo retablo",
  "brotherhood": {
    "id": "5aa62413-8a21-4aa0-ac94-a281435ef306",
    "label": "Las Siete Palabras",
    "slug": "siete-palabras-sevilla"
  },
  "title": "El Rosario de las Siete Palabras tiene un nuevo retablo en la calle San Vicente",
  "summary": "La Hermandad ha bendecido el retablo cerámico de su titular en el exterior de la parroquia de San Vicente. Antonio Hermosilla Caro firma la obra, que permite contemplar a la Virgen desde la calle.",
  "context": "La bendición se celebró el 11 de octubre, coincidiendo con el besamanos, y la Hermandad publicó su crónica el 14. El anuncio inicial del acto estaba fechado el 6 de octubre. El retablo está situado en la fachada de la sacristía de la capilla sacramental y representa a la Virgen de medio cuerpo con su indumentaria de salida.",
  "effectiveLabel": "Bendecido el 11 de octubre de 2026 · Crónica oficial del 14 de octubre",
  "sources": [
    {
      "label": "Las Siete Palabras · crónica de la bendición · 14 de octubre de 2026",
      "href": "https://siete-palabras.com/la-virgen-del-rosario-mas-cerca-de-su-barrio-con-la-bendicion-de-su-nuevo-retablo-ceramico/"
    },
    {
      "label": "Las Siete Palabras · anuncio inicial · 6 de octubre de 2026",
      "href": "https://siete-palabras.com/bendicion-del-nuevo-retablo-ceramico-de-nuestra-senora-del-rosario/"
    }
  ],
  "discover": {
    "label": "Conoce los titulares y la historia de Las Siete Palabras",
    "href": "/hermandades/siete-palabras-sevilla"
  }
},
{
  "status": "published",
  "documentedOn": "2026-10-14",
  "municipality": "Sevilla",
  "relations": [],
  "id": "javieres-exaltacion-juventud-cascales-2026",
  "eventKey": "javieres:exaltacion-juventud:2026",
  "announcedOn": "2026-10-09",
  "topic": "hermandad",
  "kind": "Designación",
  "brotherhood": {
    "id": "fe21b491-a72f-4312-a2a1-45f0446f1ac8",
    "label": "Los Javieres",
    "slug": "hermandad-los-javieres-sevilla"
  },
  "title": "Víctor Manuel Cascales dará voz a la juventud del Martes Santo en Los Javieres",
  "summary": "Los Javieres han designado a Víctor Manuel Cascales Vallejo para pronunciar la Exaltación de la Juventud del Martes Santo. El acto será el 14 de noviembre a las 20:30 en la iglesia del Sagrado Corazón.",
  "context": "La designación ha sido acordada por la Junta de Gobierno reunida en Cabildo de Oficiales. Cascales es hermano de la Exaltación, San José Obrero y María Auxiliadora de la Trinidad, y ha participado en pregones y actos de exaltación cofrade. La portada oficial fecha la publicación el 9 de octubre de 2026.",
  "effectiveLabel": "Exaltación · 14 de noviembre de 2026 · 20:30 · Iglesia del Sagrado Corazón",
  "sources": [
    {
      "label": "Los Javieres · designación oficial · 9 de octubre de 2026",
      "href": "https://javieres.com/exaltador-juventud-martes-santo-victor-cascales/"
    }
  ],
  "discover": {
    "label": "Conoce los titulares y la historia de Los Javieres",
    "href": "/hermandades/hermandad-los-javieres-sevilla"
  }
},
{
  "status": "published",
  "documentedOn": "2026-10-14",
  "municipality": "Sevilla",
  "relations": [],
  "id": "desamparados-alcosa-rosario-veneracion-2026",
  "eventKey": "desamparados-alcosa:reposicion-culto:2026",
  "announcedOn": "2026-10-09",
  "topic": "agenda",
  "kind": "Regreso al culto",
  "editorialException": true,
  "editorialSubject": {
    "label": "Desamparados del Parque Alcosa",
    "kind": "Hermandad de Gloria"
  },
  "title": "Alcosa recibirá a la Virgen de los Desamparados con un rosario y dos días de veneración",
  "summary": "La Virgen volverá al culto el 16 de octubre tras su restauración y presidirá el rosario a las 21:00. Los días 17 y 18 quedará expuesta a la veneración de hermanos y devotos.",
  "context": "La convocatoria del 9 de octubre concreta los cultos de un regreso anunciado previamente. El rosario discurrirá desde el convento de los Hermanos Menores Conventuales, anexo a la parroquia, hasta el presbiterio. La veneración será de 10:00 a 14:00 y de 18:00 a 22:00, con interrupciones por los actos y cultos parroquiales.",
  "effectiveLabel": "Rosario · 16 de octubre de 2026 · 21:00 · Veneración: 17 y 18 de octubre",
  "sources": [
    {
      "label": "Desamparados de Alcosa · convocatoria oficial · 9 de octubre de 2026",
      "href": "https://www.desamparadosalcosa.es/santo-rosario-y-solemne-veneracion-en-honor-a-la-santisima-virgen/"
    }
  ]
},

{
  "id": "san-esteban-nacimiento-cabalgata-2027",
  "eventKey": "san-esteban:centenario:presentacion-cabalgata:2027",
  "status": "published",
  "announcedOn": "2026-10-15",
  "documentedOn": "2026-10-15",
  "topic": "hermandad",
  "kind": "Centenario",
  "municipality": "Sevilla",
  "brotherhood": {
    "id": "36b4d5c1-f7bb-4025-a09a-948e0d5d188f",
    "label": "San Esteban",
    "slug": "san-esteban"
  },
  "title": "El centenario de San Esteban toma forma en la Cabalgata",
  "summary": "El Ateneo ha presentado los diseños de la Cabalgata de 2027, entre ellos el Nacimiento inspirado en la Hermandad de San Esteban por su centenario fundacional. La propuesta, dentro del trabajo artístico de Jesús Corral Zambruno, llevará esta efeméride cofrade al cortejo del próximo 5 de enero.",
  "context": "La novedad es la presentación de los diseños del 15 de octubre de 2026, recogida por Radio Sevilla a las 14:03. La dedicatoria del Nacimiento a San Esteban ya figuraba en el anuncio del Ateneo del 7 de julio. El comunicado de la presentación contiene una fecha discordante en su cuerpo; la portada del Ateneo y la crónica de Radio Sevilla sitúan la publicación y el acto el 15 de octubre de 2026.",
  "effectiveLabel": "Presentación · 15 de octubre de 2026 · Cabalgata · 5 de enero de 2027",
  "relations": [],
  "discover": {
    "label": "Descubre la historia de San Esteban y su centenario",
    "href": "/hermandades/san-esteban#historia"
  },
  "sources": [
    {
      "label": "Ateneo de Sevilla · presentación de los diseños · publicación del 15 de octubre de 2026; fecha discordante en el cuerpo",
      "href": "https://www.ateneodesevilla.es/once-nuevas-carrozas-formaran-parte-de-la-cabalgata-de-reyes-magos/"
    },
    {
      "label": "Radio Sevilla · presentación del 15 de octubre de 2026 · 14:03",
      "href": "https://cadenaser.com/andalucia/2026/10/15/las-setas-de-la-encarnacion-o-el-centenario-de-san-esteban-entre-las-11-nuevas-carrozas-de-la-cabalgata-de-reyes-magos-en-sevilla-radio-sevilla/"
    },
    {
      "label": "Ateneo de Sevilla · anuncio inicial de la dedicatoria · 7 de julio de 2026",
      "href": "https://www.ateneodesevilla.es/la-ilusion-vuelve-a-ponerse-en-marcha-presentado-el-cortejo-real-de-la-cabalgata-2027/"
    }
  ]
},


{
  "id": "cigarreras-nuevo-uniforme-verano-2026",
  "eventKey": "cigarreras:uniformidad:verano:2026",
  "status": "published",
  "announcedOn": "2026-10-15",
  "documentedOn": "2026-10-15",
  "topic": "musica",
  "kind": "Nueva uniformidad",
  "municipality": "Sevilla",
  "subject": {
    "id": "b1000000-0000-0000-0000-000000000001",
    "type": "band",
    "label": "Las Cigarreras"
  },
  "title": "Las Cigarreras vuelve a sus orígenes con un nuevo uniforme de verano",
  "summary": "La banda recupera el aire de sus primeros uniformes de los años ochenta con una camisa beige, pantalón gris antracita y cinturón de piel gris. Lo estrenará el 16 de octubre en el concierto de la Misericordia por los 425 años de Los Panaderos.",
  "context": "El anuncio oficial del 15 de octubre detalla una camisa Oxford de manga corta con el nombre de la formación y el Ángel de la Fama bordados, además de la columna del emblema en el pantalón. El cinturón prescinde de la chapa con escudo del diseño anterior. José Carlos Garrido ha liderado la propuesta junto al equipo de uniformidad; Artebandas es el proveedor y Lara Garrido ha digitalizado el Ángel de la Fama. El estreno está previsto en el concierto de las 21:30, donde también se presentará la marcha «Soberana entrega».",
  "effectiveLabel": "Estreno previsto · 16 de octubre de 2026 · 21:30 · Iglesia de la Misericordia",
  "relations": [
    {
      "id": "b1000000-0000-0000-0000-000000000001",
      "type": "band",
      "label": "Las Cigarreras",
      "role": "Banda de Cornetas y Tambores · Nueva uniformidad"
    },
    {
      "id": "c1000000-0000-0000-0000-000000000005",
      "type": "brotherhood",
      "label": "Los Panaderos",
      "role": "Concierto del 425 aniversario"
    }
  ],
  "discover": {
    "label": "Conoce la historia y el repertorio de Las Cigarreras",
    "href": "/bandas/las-cigarreras"
  },
  "sources": [
    {
      "label": "Las Cigarreras · anuncio oficial del nuevo uniforme · 15 de octubre de 2026",
      "href": "https://lascigarreras.net/nueva-uniformidad-de-verano/"
    },
    {
      "label": "Las Cigarreras · convocatoria oficial del concierto · 15 de octubre de 2026",
      "href": "https://lascigarreras.net/concierto-panaderos-2026/"
    }
  ]
},

]
