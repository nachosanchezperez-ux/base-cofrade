export const hermandades = [{
  id:'H0001', slug:'el-baratillo', nombrePopular:'El Baratillo',
  nombreOficial:'Antigua y Fervorosa Hermandad de la Santa Cruz y Cofradía de Nazarenos del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad, Patriarca Bendito Señor San José, y María Santísima de la Caridad en su Soledad',
  localidad:'Sevilla', provincia:'Sevilla', sede:'Capilla de la Piedad', fundacion:'1693', diaSalida:'Miércoles Santo',
  tipos:['Penitencia'], colores:{primario:'#153B69',secundario:'#A71930',claro:'#FFFFFF'},
  datosJornada:{ano:'2026',ordenJornada:'4.ª',totalNazarenos:'2.292',tiempoCarreraOficial:'2 h 34 min',fuenteEstadisticas:'https://semanasantaopendata.org/2026/hermandad/el-baratillo/'},
  resumen:'Hermandad sevillana con sede en la Capilla de la Piedad, en el Arenal. El Baratillo sirve como ficha piloto para construir una experiencia enciclopédica que conecte hermandad, titulares, pasos, cultos, salidas, patrimonio musical, actualidad e historia.',
  historia:'La información histórica se irá incorporando mediante registros documentados y fuentes relacionadas. La cronología de esta versión es deliberadamente mínima para no presentar como definitivos datos que aún deben verificarse.',
  participacionesConsejo:[
    {
      id:'PCO0001',
      tipo:'viacrucis',
      categoria:'Vía Crucis de las Hermandades',
      ano:'1985',
      titulo:'Presidió el Vía Crucis de las Hermandades',
      protagonistas:'Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',
      resumen:'El misterio de la Piedad fue designado para presidir el Vía Crucis cuaresmal de las Hermandades de Penitencia de Sevilla.',
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
    {id:'IMG0003',slug:'maria-santisima-de-la-caridad-en-su-soledad',nombre:'María Santísima de la Caridad en su Soledad',tipo:'Virgen',autor:'José Rodríguez Fernández-Andes',fecha:'1931',iniciales:'CS'},
    {id:'IMG0004',slug:'patriarca-bendito-senor-san-jose',nombre:'Patriarca Bendito Señor San José',tipo:'Santo',autor:'Anónimo',fecha:'Siglo XVIII',iniciales:'SJ'}
  ],
  pasos:[
    {id:'PASO0001',slug:'paso-de-la-piedad',nombre:'Paso del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',tipo:'Paso de Misterio',imagenes:['IMG0001','IMG0002'],descripcion:'Paso que representa la Piedad. Su ficha reunirá patrimonio, autores, intervenciones y evolución.',capatazActual:'Pendiente de incorporar',acompanamientoActual:'Pendiente de incorporar'},
    {id:'PASO0002',slug:'paso-de-palio-de-maria-santisima-de-la-caridad',nombre:'Paso de palio de María Santísima de la Caridad en su Soledad',tipo:'Palio',imagenes:['IMG0003'],descripcion:'Paso de palio de la dolorosa. Su ficha reunirá patrimonio, reformas, capataces y evolución histórica.',capatazActual:'Pendiente de incorporar',acompanamientoActual:'Pendiente de incorporar'}
  ],
  acompanamientoActual:[
    {id:'AMU0001',posicion:'Cruz de Guía',banda:'Pendiente de incorporar',tipo:'Cornetas y Tambores / Agrupación Musical / Música',observaciones:''},
    {id:'AMU0002',posicion:'Paso de Misterio',banda:'Pendiente de incorporar',tipo:'Pendiente de definir',observaciones:''},
    {id:'AMU0003',posicion:'Paso de Palio',banda:'Pendiente de incorporar',tipo:'Banda de Música',observaciones:''}
  ],
  habitos:[
    {id:'HAB0001',nombre:'Cortejo del paso de Cristo',tunica:'Azul de cola',antifaz:'Azul',cordon:'Rojo',botonadura:'Roja',calzado:'Zapato negro'},
    {id:'HAB0002',nombre:'Cortejo del paso de palio',tunica:'Azul de cola',antifaz:'Azul',cordon:'Blanco',botonadura:'Blanca',calzado:'Zapato negro'}
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
    {id:'CUL0001',nombre:'Devoto Besapié al Santísimo Cristo de la Misericordia',tipo:'Besapié',referencia:'Domingo anterior al Miércoles de Ceniza'},
    {id:'CUL0002',nombre:'Solemne Besamanos al Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',tipo:'Besamanos',referencia:'Segundo domingo de Cuaresma'},
    {id:'CUL0003',nombre:'Solemne Quinario al Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',tipo:'Quinario',referencia:'Cuaresma'},
    {id:'CUL0004',nombre:'Misa Solemne en honor al Patriarca Bendito Señor San José',tipo:'Misa Solemne',referencia:'19 de marzo',fechaCorta:'19 MAR'},
    {id:'CUL0005',nombre:'Misa Solemne en honor a María Santísima de la Caridad en su Soledad',tipo:'Misa Solemne',referencia:'15 de agosto',fechaCorta:'15 AGO'},
    {id:'CUL0006',nombre:'Solemne Triduo a María Santísima de la Caridad en su Soledad',tipo:'Triduo',referencia:'Noviembre'}
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

export function getHermandadBySlug(slug){return hermandades.find((h)=>h.slug===slug);}
export function getImagenBySlug(slug){for(const hermandad of hermandades){const imagen=hermandad.imagenes.find((i)=>i.slug===slug);if(imagen)return{imagen,hermandad};}return null;}

export function getPasoBySlug(slug){
  for(const hermandad of hermandades){
    const paso=hermandad.pasos.find((p)=>p.slug===slug);
    if(paso)return{paso,hermandad};
  }
  return null;
}
