import Link from 'next/link';
import SectionTitle from './SectionTitle';
import styles from './BrotherhoodMusicalHeritage.module.css';

const GROUPS = [
  { key: 'Marcha procesional', label: 'Marchas procesionales', short: 'M', noun: 'marchas' },
  { key: 'Himno', label: 'Himnos', short: 'H', noun: 'himnos' },
  { key: 'Copla', label: 'Coplas', short: 'C', noun: 'coplas' },
  { key: 'Adaptación', label: 'Adaptaciones', short: 'A', noun: 'adaptaciones' },
];

function composerText(item) {
  if (item.composers?.length) return item.composers.map((author) => author.name).join(' · ');
  if (item.workType === 'Himno' && item.lyricists?.length) {
    return `Texto: ${item.lyricists.map((author) => author.name).join(' · ')}`;
  }
  if (item.adapters?.length) return item.adapters.map((author) => author.name).join(' · ');
  return item.authorshipText || 'Autoría por documentar';
}

function MusicRow({ item }) {
  return (
    <article className={styles.march}>
      <div className={styles.year}>
        <small>Año</small>
        <strong>{item.year || '—'}</strong>
      </div>
      <div className={styles.copy}>
        <small className={styles.fieldLabel}>Título</small>
        <h4>{item.name}</h4>
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
        <strong>{composerText(item)}</strong>
        {item.adapters?.length && item.composers?.length ? (
          <span>{item.adapters.map((author) => `${author.label || 'Adaptación'} · ${author.name}`).join(' · ')}</span>
        ) : null}
      </div>
      <div className={styles.styleColumn}>
        <small className={styles.fieldLabel}>Estilo</small>
        <strong>{item.musicType || 'Por documentar'}</strong>
      </div>
      {item.listening?.url ? (
        <a className={styles.listen} href={item.listening.url} target="_blank" rel="noreferrer" aria-label={`Escuchar ${item.name} en ${item.listening.provider}`}>
          <span>▶</span>{item.listening.provider}
        </a>
      ) : null}
    </article>
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
            description="Obras relacionadas de forma independiente con la Hermandad, sus Titulares, autores, formaciones, estrenos y fuentes. Marchas, himnos, coplas y adaptaciones se conservan como tipos distintos."
          />
          <div className={styles.summary} aria-label={`${items.length} composiciones documentadas`}>
            <strong>{items.length}</strong>
            <span>composiciones documentadas</span>
          </div>
        </div>

        <div className={styles.groups}>
          {groups.map((group) => (
            <details className={styles.group} key={group.key} open={group.key === 'Marcha procesional'}>
              <summary className={styles.groupSummary}>
                <span className={styles.groupMark} aria-hidden="true">{group.short}</span>
                <span className={styles.groupHeading}>
                  <strong>{group.label}</strong>
                  <small>{group.items.length} {group.noun} documentadas</small>
                </span>
                <span className={styles.groupToggle} aria-hidden="true">＋</span>
              </summary>
              <div className={styles.list}>
                <div className={styles.tableHead} aria-hidden="true">
                  <span>Año</span><span>Título</span><span>Compositor</span><span>Estilo</span><span />
                </div>
                {group.items.map((item) => <MusicRow item={item} key={item.id} />)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
