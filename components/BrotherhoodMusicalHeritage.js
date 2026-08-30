import Link from 'next/link';
import SectionTitle from './SectionTitle';
import { publicText } from '@/lib/supabase/public-entity-page';
import styles from './BrotherhoodMusicalHeritage.module.css';

const GROUPS = [
  { key: 'Marcha procesional', label: 'Marchas procesionales', short: 'M', noun: 'marchas' },
  { key: 'Himno', label: 'Himnos', short: 'H', noun: 'himnos' },
  { key: 'Copla', label: 'Coplas', short: 'C', noun: 'coplas' },
  { key: 'Adaptación', label: 'Adaptaciones', short: 'A', noun: 'adaptaciones' },
];

const MARCH_STYLE_GROUPS = [
  { key: 'Banda de Música', label: 'Banda de Música', short: 'BM' },
  { key: 'Cornetas y Tambores', label: 'Banda de CC. y TT.', short: 'CT' },
  { key: 'Agrupación Musical', label: 'Agrupación Musical', short: 'AM' },
];

const KNOWN_MARCH_STYLES = new Set(MARCH_STYLE_GROUPS.map((group) => group.key));

function composerText(item) {
  if (item.composers?.length) return item.composers.map((author) => author.name).join(' · ');
  if (item.workType === 'Himno' && item.lyricists?.length) {
    return `Texto: ${item.lyricists.map((author) => author.name).join(' · ')}`;
  }
  if (item.adapters?.length) return item.adapters.map((author) => author.name).join(' · ');
  return publicText(item.authorshipText);
}

function compactYear(value) {
  const text = String(value ?? '').trim();
  return /^\d{4}$/.test(text) ? text : '';
}

function MusicRow({ item, showStyle = true, headingLevel = 4 }) {
  const Heading = `h${headingLevel}`;
  const year = compactYear(item.year);
  const composer = composerText(item);
  const musicType = publicText(item.musicType);

  return (
    <article className={`${styles.march} ${showStyle ? '' : styles.marchCompact}`}>
      <div className={styles.year}>
        <small>Año</small>
        {year ? <strong>{year}</strong> : null}
      </div>
      <div className={styles.copy}>
        <small className={styles.fieldLabel}>Título</small>
        <Heading>{item.name}</Heading>
        {item.bandRelation?.name ? (
          <div className={styles.bandRelation}>
            <small>{item.bandRelation.label}</small>
            {item.bandRelation.slug ? (
              <Link href={`/bandas/${item.bandRelation.slug}`}>{item.bandRelation.name} <span>↗</span></Link>
            ) : <strong>{item.bandRelation.name}</strong>}
          </div>
        ) : null}
      </div>
      <div className={styles.authorColumn}>
        <small className={styles.fieldLabel}>Compositor</small>
        {composer ? <strong>{composer}</strong> : null}
        {item.adapters?.length && item.composers?.length ? (
          <span>{item.adapters.map((author) => `${author.label || 'Adaptación'} · ${author.name}`).join(' · ')}</span>
        ) : null}
      </div>
      {showStyle ? (
        <div className={styles.styleColumn}>
          <small className={styles.fieldLabel}>Estilo</small>
          {musicType ? <strong>{musicType}</strong> : null}
        </div>
      ) : null}
      {item.listening?.url ? (
        <a className={styles.listen} href={item.listening.url} target="_blank" rel="noreferrer" aria-label={`Escuchar ${item.name} en ${item.listening.provider}`}>
          <span>▶</span>{item.listening.provider}
        </a>
      ) : null}
    </article>
  );
}

function MusicList({ items, showStyle = true, headingLevel = 4 }) {
  return (
    <div className={styles.list}>
      <div className={`${styles.tableHead} ${showStyle ? '' : styles.tableHeadCompact}`} aria-hidden="true">
        <span>Año</span><span>Título</span><span>Compositor</span>{showStyle ? <span>Estilo</span> : null}<span />
      </div>
      {items.map((item) => (
        <MusicRow item={item} key={item.id} showStyle={showStyle} headingLevel={headingLevel} />
      ))}
    </div>
  );
}

function MarchStyleGroups({ items }) {
  const styleGroups = MARCH_STYLE_GROUPS.map((group) => ({
    ...group,
    items: items.filter((item) => item.musicType === group.key),
  })).filter((group) => group.items.length);

  const otherItems = items.filter((item) => !KNOWN_MARCH_STYLES.has(item.musicType));
  if (otherItems.length) {
    styleGroups.push({ key: 'Otros', label: 'Otros estilos', short: 'OT', items: otherItems });
  }

  return (
    <div className={styles.styleGroups} aria-label="Marchas procesionales por estilo musical">
      {styleGroups.map((group) => (
        <details className={styles.styleGroup} key={group.key}>
          <summary className={styles.styleSummary}>
            <span className={styles.styleMark} aria-hidden="true">{group.short}</span>
            <div className={styles.styleHeading}>
              <h4>{group.label}</h4>
              <small>{group.items.length} {group.items.length === 1 ? 'marcha documentada' : 'marchas documentadas'}</small>
            </div>
            <span className={styles.styleToggle} aria-hidden="true">＋</span>
          </summary>
          <MusicList items={group.items} showStyle={false} headingLevel={5} />
        </details>
      ))}
    </div>
  );
}

export default function BrotherhoodMusicalHeritage({ items = [] }) {
  if (!items.length) return null;

  const groups = GROUPS.map((group) => ({
    ...group,
    items: items.filter((item) => (item.workType || 'Marcha procesional') === group.key),
  })).filter((group) => group.items.length);

  return (
    <section className={`section ${styles.section}`} id="musica">
      <div className="shell">
        <div className={styles.intro}>
          <SectionTitle
            eyebrow="Sonidos propios"
            title="Patrimonio musical"
            description="Obras relacionadas de forma independiente con la Hermandad, sus Titulares, autores, formaciones, estrenos y fuentes. Las marchas procesionales se ordenan por estilo musical; himnos, coplas y adaptaciones se conservan como tipos distintos."
          />
          <div className={styles.summary} aria-label={`${items.length} composiciones documentadas`}>
            <strong>{items.length}</strong>
            <span>composiciones documentadas</span>
          </div>
        </div>

        <div className={styles.groups}>
          {groups.map((group) => (
            <details className={styles.group} key={group.key}>
              <summary className={styles.groupSummary}>
                <span className={styles.groupMark} aria-hidden="true">{group.short}</span>
                <div className={styles.groupHeading}>
                  <h3>{group.label}</h3>
                  <small>{group.items.length} {group.noun} documentadas</small>
                </div>
                <span className={styles.groupToggle} aria-hidden="true">＋</span>
              </summary>
              {group.key === 'Marcha procesional'
                ? <MarchStyleGroups items={group.items} />
                : <MusicList items={group.items} headingLevel={4} />}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
