import { createPublicClient as createClient } from '@/lib/supabase/public';

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data || [];
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function listeningProvider(url = '') {
  if (/spotify\.com/i.test(url)) return 'Spotify';
  if (/youtu\.be|youtube\.com/i.test(url)) return 'YouTube';
  return 'Escuchar';
}

function recordingUrl(recording) {
  if (!recording) return '';
  if (recording.external_url) return recording.external_url;
  if (recording.youtube_video_id) return `https://www.youtube.com/watch?v=${recording.youtube_video_id}`;
  return '';
}

function repertoireContextLabel(bandType = '', position = '') {
  if (/palio/i.test(position)) return 'Banda de palio actual';
  if (bandType === 'Agrupación Musical') return 'Agrupación actual';
  if (bandType === 'Cornetas y Tambores') return 'Banda actual de cornetas y tambores';
  if (bandType === 'Banda de Música') return 'Banda de música actual';
  return 'Formación actual';
}

function adapterLabel(notes = '') {
  return /instrument/i.test(notes) ? 'Instrumentación' : 'Adaptación';
}

function heritageRoleLabel(notes = '') {
  if (/letra/i.test(notes)) return 'Letra';
  if (/m[uú]sica/i.test(notes)) return 'Música';
  return 'Autoría';
}

function chronologicalSort(a, b) {
  const yearA = Number.parseInt(a.year, 10);
  const yearB = Number.parseInt(b.year, 10);
  const knownA = Number.isFinite(yearA);
  const knownB = Number.isFinite(yearB);
  if (knownA && knownB) return yearA - yearB || a.name.localeCompare(b.name, 'es');
  if (knownA) return -1;
  if (knownB) return 1;
  return a.name.localeCompare(b.name, 'es');
}

export async function getBrotherhoodMusicalHeritage(brotherhoodEntityId) {
  if (!brotherhoodEntityId) return [];

  const supabase = await createClient();
  const [dedicationResult, currentMusicResult, heritageResult] = await Promise.all([
    supabase
      .from('march_dedications')
      .select('march_entity_id')
      .eq('dedicatee_entity_id', brotherhoodEntityId)
      .eq('dedication_type', 'dedicated_to')
      .eq('status', 'published'),
    supabase
      .from('music_accompaniment_periods')
      .select('band_entity_id, position')
      .eq('brotherhood_entity_id', brotherhoodEntityId)
      .eq('is_current', true)
      .eq('status', 'published'),
    supabase
      .from('heritage_assets')
      .select('entity_id, asset_type, date_from_text, notes')
      .eq('parent_entity_id', brotherhoodEntityId)
      .in('asset_type', ['Música de capilla', 'Copla']),
  ]);

  const dedicationRows = assertQuery(dedicationResult, 'No se pudo consultar el patrimonio musical de la hermandad');
  const currentMusicRows = assertQuery(currentMusicResult, 'No se pudo consultar el contexto musical actual de la hermandad');
  const heritageRows = assertQuery(heritageResult, 'No se pudieron consultar las composiciones musicales patrimoniales');
  const marchIds = unique(dedicationRows.map((item) => item.march_entity_id));
  const heritageIds = unique(heritageRows.map((item) => item.entity_id));

  let marchItems = [];
  if (marchIds.length) {
    const [entityResult, marchResult, authorResult, recordingResult, trackResult] = await Promise.all([
      supabase.from('entities').select('id, name, slug, status').in('id', marchIds).eq('status', 'published'),
      supabase.from('marches').select('entity_id, composition_year, composition_date_text, work_type, music_type, youtube_video_id, premiere_date, premiere_date_text, premiered_by_band_entity_id, notes').in('entity_id', marchIds),
      supabase.from('march_authors').select('id, march_entity_id, agent_entity_id, author_role, notes').in('march_entity_id', marchIds).eq('status', 'published'),
      supabase.from('march_recordings').select('id, march_entity_id, band_entity_id, youtube_video_id, external_url, title, is_featured, status').in('march_entity_id', marchIds).eq('status', 'published'),
      supabase.from('band_release_tracks').select('id, release_id, march_entity_id, spotify_url').in('march_entity_id', marchIds),
    ]);

    const marchEntities = assertQuery(entityResult, 'No se pudieron consultar las obras musicales publicadas');
    const marchRows = assertQuery(marchResult, 'No se pudieron consultar los datos musicales');
    const authorRows = assertQuery(authorResult, 'No se pudieron consultar las autorías');
    const recordingRows = assertQuery(recordingResult, 'No se pudieron consultar las grabaciones');
    const trackRows = assertQuery(trackResult, 'No se pudieron consultar las pistas discográficas');
    const releaseIds = unique(trackRows.map((item) => item.release_id));
    const releaseRows = releaseIds.length
      ? assertQuery(await supabase.from('band_releases').select('id, band_entity_id, title, status').in('id', releaseIds).eq('status', 'published'), 'No se pudieron consultar los lanzamientos')
      : [];
    const releaseById = new Map(releaseRows.map((item) => [item.id, item]));
    const agentIds = unique(authorRows.map((item) => item.agent_entity_id));
    const bandIds = unique([
      ...marchRows.map((item) => item.premiered_by_band_entity_id),
      ...recordingRows.map((item) => item.band_entity_id),
      ...releaseRows.map((item) => item.band_entity_id),
      ...currentMusicRows.map((item) => item.band_entity_id),
    ]);
    const relatedIds = unique([...agentIds, ...bandIds]);
    const [relatedEntities, bandRows] = await Promise.all([
      relatedIds.length
        ? supabase.from('entities').select('id, name, slug, entity_type, status').in('id', relatedIds).eq('status', 'published').then((r) => assertQuery(r, 'No se pudieron consultar autores y bandas'))
        : Promise.resolve([]),
      bandIds.length
        ? supabase.from('bands').select('entity_id, band_type').in('entity_id', bandIds).then((r) => assertQuery(r, 'No se pudieron consultar tipos de banda'))
        : Promise.resolve([]),
    ]);
    const relatedById = new Map(relatedEntities.map((item) => [item.id, item]));
    const bandTypeById = new Map(bandRows.map((item) => [item.entity_id, item.band_type]));
    const marchById = new Map(marchRows.map((item) => [item.entity_id, item]));
    const currentRepertoireContextByType = new Map();

    currentMusicRows.forEach((period) => {
      const band = relatedById.get(period.band_entity_id);
      const bandType = bandTypeById.get(period.band_entity_id);
      if (!band?.name || !bandType || currentRepertoireContextByType.has(bandType)) return;
      currentRepertoireContextByType.set(bandType, {
        label: repertoireContextLabel(bandType, period.position),
        name: band.name,
        slug: band.slug,
      });
    });

    marchItems = marchEntities.map((entity) => {
      const march = marchById.get(entity.id) || {};
      const authors = authorRows
        .filter((item) => item.march_entity_id === entity.id)
        .map((item) => ({ ...item, entity: relatedById.get(item.agent_entity_id) }))
        .filter((item) => item.entity?.name);
      const composers = authors.filter((item) => item.author_role === 'composer');
      const adapters = authors.filter((item) => item.author_role === 'adapter');
      const lyricists = authors.filter((item) => item.author_role === 'lyricist');
      const recordings = recordingRows.filter((item) => item.march_entity_id === entity.id).sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
      const featuredRecording = recordings[0] || null;
      const tracks = trackRows.filter((item) => item.march_entity_id === entity.id);
      const discographyTrack = tracks.find((item) => item.spotify_url && releaseById.get(item.release_id)) || tracks.find((item) => releaseById.get(item.release_id)) || tracks[0] || null;
      const release = discographyTrack ? releaseById.get(discographyTrack.release_id) : null;
      const premiereBand = relatedById.get(march.premiered_by_band_entity_id);
      const recordingBand = relatedById.get(featuredRecording?.band_entity_id);
      const releaseBand = relatedById.get(release?.band_entity_id);
      const bandRelation = premiereBand
        ? { label: 'Estrenada por', name: premiereBand.name, slug: premiereBand.slug }
        : recordingBand
          ? { label: 'Grabada por', name: recordingBand.name, slug: recordingBand.slug }
          : releaseBand ? { label: 'Grabada por', name: releaseBand.name, slug: releaseBand.slug } : null;
      const featuredUrl = recordingUrl(featuredRecording);
      const listeningUrl = featuredUrl || discographyTrack?.spotify_url || (march.youtube_video_id ? `https://www.youtube.com/watch?v=${march.youtube_video_id}` : '');

      return {
        id: entity.id,
        slug: entity.slug,
        name: entity.name,
        year: march.composition_year || march.composition_date_text || '',
        workType: march.work_type || 'Marcha procesional',
        musicType: march.music_type || '',
        composers: composers.map((item) => ({ name: item.entity.name, slug: item.entity.slug })),
        adapters: adapters.map((item) => ({ name: item.entity.name, slug: item.entity.slug, label: adapterLabel(item.notes) })),
        lyricists: lyricists.map((item) => ({ name: item.entity.name, slug: item.entity.slug })),
        authorshipText: '',
        bandRelation,
        repertoireBandContext: currentRepertoireContextByType.get(march.music_type) || null,
        premiereText: march.premiere_date_text || march.premiere_date || '',
        internalNotes: march.notes || '',
        listening: listeningUrl ? { url: listeningUrl, provider: listeningProvider(listeningUrl) } : null,
      };
    });
  }

  let heritageItems = [];
  if (heritageIds.length) {
    const [heritageEntityResult, heritageAuthorResult] = await Promise.all([
      supabase.from('entities').select('id, name, slug, status').in('id', heritageIds).eq('status', 'published'),
      supabase.from('entity_relations').select('id, source_entity_id, target_entity_id, notes').in('target_entity_id', heritageIds).eq('relation_type', 'author_of').eq('status', 'published'),
    ]);
    const heritageEntities = assertQuery(heritageEntityResult, 'No se pudieron consultar las obras patrimoniales');
    const heritageAuthorRows = assertQuery(heritageAuthorResult, 'No se pudieron consultar sus autorías');
    const heritageAgentIds = unique(heritageAuthorRows.map((item) => item.source_entity_id));
    const heritageAgents = heritageAgentIds.length
      ? assertQuery(await supabase.from('entities').select('id, name, slug, status').in('id', heritageAgentIds).eq('status', 'published'), 'No se pudieron consultar autores patrimoniales')
      : [];
    const assetById = new Map(heritageRows.map((item) => [item.entity_id, item]));
    const agentById = new Map(heritageAgents.map((item) => [item.id, item]));
    heritageItems = heritageEntities.map((entity) => {
      const asset = assetById.get(entity.id) || {};
      const authors = heritageAuthorRows
        .filter((item) => item.target_entity_id === entity.id)
        .map((item) => ({ entity: agentById.get(item.source_entity_id), label: heritageRoleLabel(item.notes) }))
        .filter((item) => item.entity?.name);
      return {
        id: entity.id,
        slug: entity.slug,
        name: entity.name,
        year: asset.date_from_text || '',
        workType: asset.asset_type === 'Copla' ? 'Copla' : 'Marcha procesional',
        musicType: asset.asset_type,
        composers: authors.filter((item) => item.label !== 'Letra').map((item) => ({ name: item.entity.name, slug: item.entity.slug })),
        adapters: authors.filter((item) => item.label === 'Letra').map((item) => ({ name: item.entity.name, slug: item.entity.slug, label: 'Letra' })),
        lyricists: [],
        authorshipText: /an[oó]nima/i.test(asset.notes || '') ? 'Autoría anónima' : '',
        bandRelation: null,
        repertoireBandContext: null,
        premiereText: '',
        listening: null,
      };
    });
  }

  return [...marchItems, ...heritageItems].sort(chronologicalSort);
}
