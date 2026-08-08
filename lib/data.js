export const hermandades = [
  {
    id:'H0001', slug:'el-baratillo', nombrePopular:'El Baratillo',
    nombreOficial:'Antigua y Fervorosa Hermandad de la Santa Cruz y Cofradía de Nazarenos del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad, Patriarca Bendito Señor San José, y María Santísima de la Caridad en su Soledad',
    localidad:'Sevilla', provincia:'Sevilla', sede:'Capilla de la Piedad', fundacion:'1693', diaSalida:'Miércoles Santo',
    tipos:['Penitencia'], colores:{primario:'#153B69',secundario:'#A71930',claro:'#FFFFFF'},
    resumen:'Hermandad sevillana con sede en la Capilla de la Piedad, en el Arenal. El Baratillo sirve como ficha piloto para construir una experiencia enciclopédica que conecte hermandad, titulares, pasos, cultos, salidas e historia.',
    historia:'La información histórica se irá incorporando mediante registros documentados y fuentes relacionadas. La cronología de esta versión es deliberadamente mínima para no presentar como definitivos datos que aún deben verificarse.',
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
      {id:'PASO0001',nombre:'Paso del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',tipo:'Misterio / Piedad',imagenes:['IMG0001','IMG0002'],descripcion:'Paso que representa la Piedad. Su futura ficha reunirá patrimonio, autores, intervenciones y evolución.'},
      {id:'PASO0002',nombre:'Paso de palio de María Santísima de la Caridad en su Soledad',tipo:'Palio',imagenes:['IMG0003'],descripcion:'Paso de palio de la dolorosa. Su futura ficha reunirá patrimonio, reformas, capataces y evolución histórica.'}
    ],
    habitos:[
      {id:'HAB0001',nombre:'Cortejo del paso de Cristo',tunica:'Azul de cola',antifaz:'Azul',cordon:'Rojo',botonadura:'Roja',calzado:'Zapato negro'},
      {id:'HAB0002',nombre:'Cortejo del paso de palio',tunica:'Azul de cola',antifaz:'Azul',cordon:'Blanco',botonadura:'Blanca',calzado:'Zapato negro'}
    ],
    salidas:[{id:'SAL0001',nombre:'Estación de Penitencia',tipo:'Estación de penitencia',caracter:'Ordinaria',periodicidad:'Anual',referencia:'Miércoles Santo'}],
    cultos:[
      {id:'CUL0001',nombre:'Devoto Besapié al Santísimo Cristo de la Misericordia',tipo:'Besapié',referencia:'Domingo anterior al Miércoles de Ceniza'},
      {id:'CUL0002',nombre:'Solemne Besamanos al Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',tipo:'Besamanos',referencia:'Segundo domingo de Cuaresma'},
      {id:'CUL0003',nombre:'Solemne Quinario al Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',tipo:'Quinario',referencia:'Cuaresma'},
      {id:'CUL0004',nombre:'Solemne Triduo a María Santísima de la Caridad en su Soledad',tipo:'Triduo',referencia:'Noviembre'}
    ],
    curiosidades:[{id:'CUR0001',titulo:'Un espacio para descubrir',texto:'Aquí aparecerán curiosidades verificadas y documentadas de la Hermandad. No publicamos todavía ninguna como dato histórico hasta completar su fuente.',categoria:'En preparación'}]
  }
];
export function getHermandadBySlug(slug){return hermandades.find((h)=>h.slug===slug);}
export function getImagenBySlug(slug){for(const hermandad of hermandades){const imagen=hermandad.imagenes.find((i)=>i.slug===slug);if(imagen)return{imagen,hermandad};}return null;}
