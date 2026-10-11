# Panel de acompañamientos · integración de la propuesta aprobada

Orden expresa del usuario: «Me gusta. Vamos a incluirlo» tras la aprobación de la propuesta interactiva.

## Alcance

Sustituye la presentación de `/acompanamientos-musicales`, sin nueva ruta ni nueva fuente de datos. Conserva el lector público, elegibilidad, deduplicación, caché e invalidación de #1104. Los dos resúmenes anuales se leen del archivo publicado; no se utiliza el JSON estático del prototipo. No hay DML, DDL, RLS, migraciones ni dependencias nuevas de aplicación.

El panel incorpora indicadores, ranking de ocho bandas, reparto capital/provincia, presencia territorial, histograma, media, mediana, peso de las cinco primeras, desgloses por formación y municipio y tabla de diez filas con CSV del conjunto filtrado. Todos los cálculos parten de los mismos items filtrados. Las bandas con solo vínculos pendientes quedan fuera de gráficos, estadísticas y CSV. El avance de 2027 no se interpreta como caída/crecimiento frente a 2026.

Filtros: temporada, búsqueda, tipo, ámbito, municipio e identidad exacta de banda desde el gráfico. URL compartible y recuperación con Atrás; anclas `#banda-*` conservadas mediante paginación. Sin duplicar campana, cabecera ni directorio. CSV UTF-8 con BOM, separador de punto y coma y protección de fórmulas.

## Preflight y concurrencia

Base verificada `bb967bc7103ceba3b4df2e1a59b463976cbab310`, producción `dpl_BpH4kBCRx5Rjfv1fKAUG31D1KTbq` READY. Rama existente `feat/panel-estadisticas-musicales-20261007`, que seguía en la base tras los errores de guardado anteriores. #1113, #1097, #1086, #1020 y #1019 independientes; no se modifican portada, layout global, fichas, lector de datos ni tablas. Reconciliar el tablero si main avanza antes del merge.

## Verificación y puerta de publicación

18 pruebas puras nuevas superadas localmente. Comprueban filtros simultáneos, medianas pares/impares, denominadores, particiones, pendientes, paginación, URLs, CSV e inmutabilidad. El entorno local carece de acceso de red para clonar/instalar; se utiliza el conector GitHub para publicar el árbol y el runner aislado para build/QA.

El workflow acotado a la rama verifica primero el candidato sin cambios. Después copia el HTML público del directorio precedente a un adaptador de datos solo del runner y prueba el mismo componente dentro de Next y su shell en Chromium y WebKit. Ese adaptador nunca se guarda en Git ni se despliega. Las capturas de ese ensayo deben identificarse como QA aislada con datos públicos, no producción.

Pendientes al crear este documento: CI, compilación, revisión visual y funcional del candidato, respuesta de preview con el lector real, decisión GO/NO-GO y comprobación productiva. No declarar publicado mientras no se cierren. Mantener #1110 como observación de WebKit histórica, sin silenciar errores ni modificar seguridad para poner pruebas en verde.
