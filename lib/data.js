export const hermandades = [{
  id:'H0001', slug:'el-baratillo', nombrePopular:'El Baratillo',
  nombreOficial:'Antigua y Fervorosa Hermandad de la Santa Cruz y Cofradía de Nazarenos del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad, Patriarca Bendito Señor San José, y María Santísima de la Caridad en su Soledad',
  localidad:'Sevilla', provincia:'Sevilla', sede:'Capilla de la Piedad', fundacion:'1693', diaSalida:'Miércoles Santo',
  tipos:['Penitencia'], colores:{primario:'#153B69',secundario:'#A71930',claro:'#FFFFFF'},
  datosJornada:{ano:'2026',ordenJornada:'4.ª',totalHermanos:'5.500',totalNazarenos:'2.292',tiempoCarreraOficial:'2 h 34 min',fuenteEstadisticas:'https://semanasantaopendata.org/2026/hermandad/el-baratillo/'},
  resumen:'Hermandad sevillana con sede en la Capilla de la Piedad, en el Arenal. El Baratillo sirve como ficha piloto para construir una experiencia enciclopédica que conecte hermandad, titulares, pasos, cultos, salidas, patrimonio musical, actualidad e historia.',
  historia:'La información histórica se irá incorporando mediante registros documentados y fuentes relacionadas. La cronología de esta versión es deliberadamente mínima para no presentar como definitivos datos que aún deben verificarse.',
  fuentesFicha:[
    {
      id:'FUE0001',
      nombre:'Semana Santa Open Data',
      descripcion:'Datos estadísticos de la Estación de Penitencia 2026: orden en la jornada, nazarenos y tiempo en Carrera Oficial.',
      url:'https://semanasantaopendata.org/2026/hermandad/el-baratillo/'
    },
    {
      id:'FUE0002',
      nombre:'Consejo General de Hermandades y Cofradías de Sevilla',
      descripcion:'Participación de la Hermandad en el Vía Crucis de las Hermandades de 1985.',
      url:'https://www.hermandades-de-sevilla.org/13957-2/hermandades-viacrucis-consejo/'
    },
    {
      id:'FUE0003',
      nombre:'Hermandad del Baratillo',
      descripcion:'Información histórica, patrimonial y corporativa utilizada en la documentación de la ficha.',
      url:'https://hermandadelbaratillo.es/'
    }
  ],
  participacionesConsejo:[
    {
      id:'PCO0001',
      tipo:'viacrucis',
      categoria:'Vía Crucis de las Hermandades',
      ano:'1985',
      titulo:'Presidió el Vía Crucis de las Hermandades',
      protagonistas:'Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',
      resumen:'El Cristo de la Misericordia fue designado para presidir el Vía Crucis cuaresmal de las Hermandades de Penitencia de Sevilla, el primer lunes de Cuaresma de 1985. Una participación que se realizó conjunta a la Virgen de la Piedad, que estuvo ataviada de hebrea para presidir este acto en el interior de la Catedral de Sevilla.',
      lugar:'Santa Iglesia Catedral de Sevilla',
      imagen:null,
      fuentes:[
        'https://www.hermandades-de-sevilla.org/13957-2/hermandades-viacrucis-consejo/',
        'https://hermandadelbaratillo.es/la-piedad-en-el-baratillo/'
      ]
    }
  ],
  cronologia:[
    {fecha:'1693',titulo:'Fundación',texto:'Año de fundación utilizado como punto de partida de la ficha piloto.',estado:'Dato básico del prototipo'},
    {fecha:'1931',titulo:'María Santísima de la Caridad en su Soledad',texto:'Fecha asociada en el prototipo a la actual dolorosa titular.',estado:'Pendiente de ampliar con fuente'},
    {fecha:'1945',titulo:'Nuestra Señora de la Piedad',texto:'Fecha asociada en el prototipo a la imagen titular de Nuestra Señora de la Piedad.',estado:'Pendiente de ampliar con fuente'},
    {fecha:'1950',titulo:'Santísimo Cristo de la Misericordia',texto:'Fecha asociada en el prototipo a la imagen de Luis Ortega Bru.',estado:'Pendiente de ampliar con fuente'}
  ],
  imagenes:[
    {id:'IMG0001',slug:'santisimo-cristo-de-la-misericordia',nombre:'Santísimo Cristo de la Misericordia',tipo:'Cristo',autor:'Luis Ortega Bru',fecha:'1950',iniciales:'CM'},
    {id:'IMG0002',slug:'nuestra-senora-de-la-piedad',nombre:'Nuestra Señora de la Piedad',tipo:'Virgen',autor:'José Rodríguez Fernández-Andes',fecha:'1945',iniciales:'NP'},
    {
      id:'IMG0003',
      slug:'maria-santisima-de-la-caridad-en-su-soledad',
      nombre:'María Santísima de la Caridad en su Soledad',
      tipo:'Virgen',
      tipologia:'Virgen · Dolorosa',
      autor:'José Rodríguez Fernández-Andes',
      fecha:'1931',
      iniciales:'CS',
      coronacionCanonica:{
        acto:{
          fecha:'20 · marzo · 1960',
          titulo:'Imposición de la corona',
          texto:'Acto celebrado en la Capilla de la Piedad. La corona fue impuesta por el cardenal José María Bueno Monreal, actuando como padrinos el teniente general Castejón Espinosa y su señora.'
        },
        reconocimiento:{
          fecha:'1 · enero · 2009',
          titulo:'Reconocimiento canónico',
          texto:'El cardenal Carlos Amigo Vallejo firmó el decreto por el que se concedía rango de Coronación Canónica al acto de imposición de la corona celebrado en 1960.'
        }
      },
      cronologia:[
        {
          fecha:'1931',
          titulo:'Ejecución de la imagen',
          texto:'Fecha de realización asociada a María Santísima de la Caridad en su Soledad.'
        },
        {
          fecha:'20 · marzo · 1960',
          titulo:'Imposición de la corona',
          texto:'La corona fue impuesta en la Capilla de la Piedad por el cardenal José María Bueno Monreal. Actuaron como padrinos el teniente general Castejón Espinosa y su señora.'
        },
        {
          fecha:'1 · enero · 2009',
          titulo:'Reconocimiento como Coronación Canónica',
          texto:'El cardenal Carlos Amigo Vallejo firmó el decreto que concedía rango de Coronación Canónica al acto celebrado en 1960.'
        }
      ],
      fuentes:[
        {
          id:'FUEIMG0001',
          nombre:'Hermandad del Baratillo',
          url:'https://hermandadelbaratillo.es/'
        }
      ]
    },
    {id:'IMG0004',slug:'patriarca-bendito-senor-san-jose',nombre:'Patriarca Bendito Señor San José',tipo:'Santo',autor:'Anónimo',fecha:'Siglo XVIII',iniciales:'SJ'}
  ],
  pasos:[
    {id:'PASO0001',slug:'paso-de-la-piedad',nombre:'Paso del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',tipo:'Paso de Misterio',imagenes:['IMG0001','IMG0002'],descripcion:'Paso que representa la Piedad. Su ficha reunirá patrimonio, autores, intervenciones y evolución.',capatazActual:'Pendiente de incorporar',acompanamientoActual:'Pendiente de incorporar'},
    {id:'PASO0002',slug:'paso-de-palio-de-maria-santisima-de-la-caridad',nombre:'Paso de palio de María Santísima de la Caridad en su Soledad',tipo:'Paso de Palio',imagenes:['IMG0003'],descripcion:'Paso de palio de la dolorosa. Su ficha reunirá patrimonio, reformas, capataces y evolución histórica.',capatazActual:'Pendiente de incorporar',acompanamientoActual:'Pendiente de incorporar'}
  ],
  acompanamientoActual:[
    {id:'AMU0001',posicion:'Cruz de Guía',banda:'Pendiente de incorporar',tipo:'Cornetas y Tambores / Agrupación Musical / Música',observaciones:''},
    {id:'AMU0002',posicion:'Paso de Misterio',banda:'Pendiente de incorporar',tipo:'Pendiente de definir',observaciones:''},
    {id:'AMU0003',posicion:'Paso de Palio',banda:'Pendiente de incorporar',tipo:'Banda de Música',observaciones:''}
  ],
  habitos:[
    {
      id:'HAB0001',
      nombre:'Cortejo del paso de Cristo',
      tunica:'Azul de cola',
      antifaz:'Azul',
      cordon:'Rojo',
      botonadura:'Roja',
      escudo:'Serigrafiado con borde rojo',
      calzado:'Zapato negro',
      imagenPath:'/hermandades/el-baratillo/tunicas/cortejo-cristo.svg',
      imagenAlt:'Túnica de nazareno azul del cortejo del paso de Cristo del Baratillo, con cíngulo y botonadura rojos'
    },
    {
      id:'HAB0002',
      nombre:'Cortejo del paso de palio',
      tunica:'Azul de cola',
      antifaz:'Azul',
      cordon:'Blanco',
      botonadura:'Blanca',
      escudo:'Serigrafiado con borde blanco',
      calzado:'Zapato negro',
      imagenPath:'/hermandades/el-baratillo/tunicas/cortejo-palio.svg',
      imagenAlt:'Túnica de nazareno azul del cortejo del paso de palio del Baratillo, con cíngulo y botonadura blancos'
    }
  ],
  salidas:[
    {
      id:'SAL0001',
      nombre:'Estación de Penitencia',
      tipo:'Estación de penitencia',
      caracter:'Ordinaria',
      titulares:'Santísimo Cristo de la Misericordia, Nuestra Señora de la Piedad y María Santísima de la Caridad en su Soledad',
      momento:'Miércoles Santo',
      destino:'Santa Iglesia Catedral de Sevilla',
      ediciones:[
        {
          ano:'2026',
          salida:'17:10 h',
          entrada:'01:30 h',
          recorrido:[
            'Adriano',
            'Pastor y Landero',
            'Reyes Católicos',
            'Puerta de Triana',
            'San Pablo',
            'Plaza de la Magdalena',
            'Méndez Núñez',
            'Plaza Nueva',
            'Tetuán',
            'Velázquez',
            'O’Donnell',
            'Carrera Oficial',
            'Plaza del Triunfo (lados Casa de la Provincia y muralla del Alcázar)',
            'Santo Tomás',
            'Adolfo Rodríguez Jurado',
            'Plaza Ministro Indalecio Prieto',
            'Tomás de Ibarra',
            'Almirantazgo',
            'Arco del Postigo',
            'Dos de Mayo',
            'Arfe',
            'Adriano'
          ]
        }
      ]
    },
    {
      id:'SAL0002',
      nombre:'Traslados de Nuestra Señora de la Piedad y el Santísimo Cristo de la Misericordia',
      tipo:'Traslado',
      titulares:'Nuestra Señora de la Piedad y Santísimo Cristo de la Misericordia',
      movimientos:[
        {sentido:'Ida',momento:'Primer sábado de Cuaresma, a la finalización del último día del Quinario.'},
        {sentido:'Regreso',momento:'El domingo siguiente, a la finalización de la Función Principal de Instituto.',destino:'Capilla de la Piedad'}
      ]
    },
    {
      id:'SAL0003',
      nombre:'Traslados de María Santísima de la Caridad en su Soledad',
      tipo:'Traslado',
      titulares:'María Santísima de la Caridad en su Soledad',
      movimientos:[
        {sentido:'Ida',momento:'El sábado en el que se celebra el último día del Triduo en su honor.'},
        {sentido:'Regreso',momento:'El domingo siguiente, a la finalización de la Función Solemne.',destino:'Capilla de la Piedad'}
      ]
    }
  ],
  cultos:[
    {id:'CUL0001',nombre:'Devoto Besapié al Santísimo Cristo de la Misericordia',tipo:'Besapié',referencia:'Domingo anterior al Miércoles de Ceniza',fechaCorta:'DOM. PREVIO',fechaDetalle:'Al Miércoles de Ceniza'},
    {id:'CUL0002',nombre:'Solemne Besamanos al Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',tipo:'Besamanos',referencia:'Segundo domingo de Cuaresma',fechaCorta:'2.º DOM.',fechaDetalle:'De Cuaresma'},
    {id:'CUL0003',nombre:'Solemne Quinario al Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',tipo:'Quinario',referencia:'Cuaresma',fechaCorta:'CUARESMA'},
    {id:'CUL0004',nombre:'Misa Solemne en honor al Patriarca Bendito Señor San José',tipo:'Misa Solemne',referencia:'19 de marzo',fechaCorta:'19 MAR'},
    {id:'CUL0005',nombre:'Misa Solemne en honor a María Santísima de la Caridad en su Soledad',tipo:'Misa Solemne',referencia:'15 de agosto',fechaCorta:'15 AGO'},
    {id:'CUL0006',nombre:'Solemne Triduo a María Santísima de la Caridad en su Soledad',tipo:'Triduo',referencia:'Noviembre',fechaCorta:'NOVIEMBRE'}
  ],
  estrenos:[
    {id:'EST0001',ano:'—',tipo:'Módulo preparado',titulo:'Próximos estrenos y novedades',descripcion:'Este espacio mostrará las novedades patrimoniales de cada año cuando incorporemos los registros documentados.',autoria:'Pendiente de datos verificados'}
  ],
  patrimonioMusical:[
    {id:'MUS0001',nombre:'Patrimonio musical del Baratillo',autor:'Listado de marchas en preparación',ano:'—',youtube:''}
  ],
  acompanamientos:[
    {id:'ACO0001',periodo:'—',banda:'Histórico musical en preparación',paso:'Los registros se incorporarán diferenciados por paso y año.',tipo:'Pendiente de datos verificados'}
  ],
  noticias:[
    {id:'NOT0001',fecha:'Próximamente',categoria:'Actualidad',titulo:'Las noticias de la Hermandad aparecerán aquí',extracto:'Este módulo permitirá relacionar artículos y noticias con la ficha enciclopédica del Baratillo.',url:''}
  ],
  curiosidades:[
    {id:'CUR0001',titulo:'Un espacio para descubrir',texto:'Aquí aparecerán curiosidades verificadas y documentadas de la Hermandad. No publicamos todavía ninguna como dato histórico hasta completar su fuente.',categoria:'En preparación'}
  ]
}];

// La ficha pública de Hermandad ya no puede usar conocimiento local como fallback.
// Se conserva el dataset únicamente para generateStaticParams, directorios y las
// fichas de Imagen/Paso hasta abordar esas dependencias en pasos posteriores.
export function getHermandadBySlug(){return null;}
export function getImagenBySlug(slug){for(const hermandad of hermandades){const imagen=hermandad.imagenes.find((i)=>i.slug===slug);if(imagen)return{imagen,hermandad};}return null;}

export function getPasoBySlug(slug){
  for(const hermandad of hermandades){
    const paso=hermandad.pasos.find((p)=>p.slug===slug);
    if(paso)return{paso,hermandad};
  }
  return null;
}
