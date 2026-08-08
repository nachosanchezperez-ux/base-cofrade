export const hermandades = [
  {
    id: 'H0001',
    slug: 'el-baratillo',
    nombrePopular: 'El Baratillo',
    nombreOficial:
      'Antigua y Fervorosa Hermandad de la Santa Cruz y Cofradía de Nazarenos del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad, Patriarca Bendito Señor San José, y María Santísima de la Caridad en su Soledad',
    localidad: 'Sevilla',
    provincia: 'Sevilla',
    sede: 'Capilla de la Piedad',
    fundacion: '1693',
    diaSalida: 'Miércoles Santo',
    tipos: ['Penitencia'],
    resumen:
      'Hermandad sevillana con sede en la Capilla de la Piedad, en el Arenal. Este prototipo utiliza El Baratillo como ficha piloto para validar la estructura de la futura aplicación.',
    historia:
      'La ficha histórica se integrará mediante registros documentados y fuentes relacionadas. La estructura está preparada para incorporar hitos, cambios de sede, fusiones, efemérides y acontecimientos sin convertir toda la información en un único bloque de texto.',
    imagenes: [
      {
        id: 'IMG0001',
        slug: 'santisimo-cristo-de-la-misericordia',
        nombre: 'Santísimo Cristo de la Misericordia',
        tipo: 'Cristo',
        autor: 'Luis Ortega Bru',
        fecha: '1950',
        iniciales: 'CM',
        descripcion:
          'Imagen titular del primer paso. Su ficha individual queda preparada para incorporar restauraciones, salidas extraordinarias, Vía Crucis, patrimonio relacionado y cronología.',
      },
      {
        id: 'IMG0002',
        slug: 'nuestra-senora-de-la-piedad',
        nombre: 'Nuestra Señora de la Piedad',
        tipo: 'Virgen',
        autor: 'José Rodríguez Fernández-Andes',
        fecha: '1945',
        iniciales: 'NP',
        descripcion:
          'Titular que forma la escena de la Piedad junto al Santísimo Cristo de la Misericordia.',
      },
      {
        id: 'IMG0003',
        slug: 'maria-santisima-de-la-caridad-en-su-soledad',
        nombre: 'María Santísima de la Caridad en su Soledad',
        tipo: 'Virgen',
        autor: 'José Rodríguez Fernández-Andes',
        fecha: '1931',
        iniciales: 'CS',
        descripcion:
          'Dolorosa titular que realiza la estación de penitencia en el paso de palio.',
      },
      {
        id: 'IMG0004',
        slug: 'patriarca-bendito-senor-san-jose',
        nombre: 'Patriarca Bendito Señor San José',
        tipo: 'Santo',
        autor: 'Anónimo',
        fecha: 'Siglo XVIII',
        iniciales: 'SJ',
        descripcion:
          'Titular de la Hermandad que no forma parte de los dos pasos de la estación de penitencia.',
      },
    ],
    pasos: [
      {
        id: 'PASO0001',
        nombre: 'Paso del Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',
        tipo: 'Misterio / Piedad',
        imagenes: ['IMG0001', 'IMG0002'],
        descripcion:
          'Paso que representa la Piedad. En futuras versiones cada elemento patrimonial podrá tener autoría, fecha, intervención y fuente propias.',
      },
      {
        id: 'PASO0002',
        nombre: 'Paso de palio de María Santísima de la Caridad en su Soledad',
        tipo: 'Palio',
        imagenes: ['IMG0003'],
        descripcion:
          'Paso de palio de la dolorosa. La ficha queda preparada para patrimonio, reformas, capataces y evolución histórica.',
      },
    ],
    habitos: [
      {
        id: 'HAB0001',
        nombre: 'Cortejo del paso de Cristo',
        tunica: 'Azul de cola',
        antifaz: 'Azul',
        capa: 'No',
        cordon: 'Rojo',
        botonadura: 'Roja',
        calzado: 'Zapato negro',
        calcetines: 'Negros',
      },
      {
        id: 'HAB0002',
        nombre: 'Cortejo del paso de palio',
        tunica: 'Azul de cola',
        antifaz: 'Azul',
        capa: 'No',
        cordon: 'Blanco',
        botonadura: 'Blanca',
        calzado: 'Zapato negro',
        calcetines: 'Negros',
      },
    ],
    salidas: [
      {
        id: 'SAL0001',
        nombre: 'Estación de Penitencia',
        tipo: 'Estación de penitencia',
        caracter: 'Ordinaria',
        periodicidad: 'Anual',
        referencia: 'Miércoles Santo',
      },
    ],
    cultos: [
      {
        id: 'CUL0001',
        nombre: 'Devoto Besapié al Santísimo Cristo de la Misericordia',
        tipo: 'Besapié',
        referencia: 'Domingo anterior al Miércoles de Ceniza',
      },
      {
        id: 'CUL0002',
        nombre: 'Solemne Besamanos al Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',
        tipo: 'Besamanos',
        referencia: 'Segundo domingo de Cuaresma',
      },
      {
        id: 'CUL0003',
        nombre: 'Solemne Quinario al Santísimo Cristo de la Misericordia y Nuestra Señora de la Piedad',
        tipo: 'Quinario',
        referencia: 'Cuaresma',
      },
      {
        id: 'CUL0004',
        nombre: 'Solemne Triduo a María Santísima de la Caridad en su Soledad',
        tipo: 'Triduo',
        referencia: 'Noviembre',
      },
    ],
    curiosidades: [
      {
        id: 'CUR0001',
        titulo: 'Un espacio para descubrir',
        texto:
          'Aquí aparecerán curiosidades verificadas y documentadas de cada hermandad. En esta primera versión no publicamos ninguna como dato histórico hasta completar su fuente.',
        categoria: 'Prototipo',
      },
    ],
  },
];

export function getHermandadBySlug(slug) {
  return hermandades.find((hermandad) => hermandad.slug === slug);
}

export function getImagenBySlug(slug) {
  for (const hermandad of hermandades) {
    const imagen = hermandad.imagenes.find((item) => item.slug === slug);
    if (imagen) return { imagen, hermandad };
  }
  return null;
}
