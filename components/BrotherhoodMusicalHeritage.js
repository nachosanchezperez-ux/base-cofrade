import Link from 'next/link';
import SectionTitle from './SectionTitle';
import styles from './BrotherhoodMusicalHeritage.module.css';

const GROUPS = [
  { key: 'Agrupación Musical', label: 'Agrupación musical', short: 'AM', noun: 'marchas' },
  { key: 'Cornetas y Tambores', label: 'Cornetas y tambores', short: 'CT', noun: 'marchas' },
  { key: 'Banda de Música', label: 'Banda de música', short: 'BM', noun: 'marchas' },
  { key: 'Música de capilla', label: 'Música de capilla', short: 'CAP', noun: 'piezas' },
  { key: 'Copla', label: 'Coplas para cultos internos', short: 'COP', noun: 'coplas' },
];

function AuthorLine({ item }) {
  const composerNames = item.composers.map((author) => author.name).join(' · ');
  const adapterGroups = item.adapters.reduce((groups, author) => {
    const label = author.label || 'Adaptación';
    const names = groups.get(label) || [];
    names.push(author.name);
    groups.set(label, names);
    return groups;
  }, new Map());

  if (!composerNames && !adapterGroups.size) {
    return <div className={styles.authorship}><span>{item.authorshipText || 'Autoría por documentar'}</span></div>;
  }

  return (
    <div className={styles.authorship}>
      {composerNames ? <span>{composerNames}</span> : null}
      {[...adapterGroups.entries()].map(([label, names]) => (
        <small key={label}>{label} · {names.join(' · ')}</small>
      ))}
    </div>
  );
}

function MusicRow({ item }) {
  return (
    <article className={styles.march}>
      <div className={styles.year}>{item.year || '—'}</div>
      <div className={styles.copy}>
        <h4>{item.name}</h4>
        <AuthorLine item={item} />
        {item.bandRelation?.name ? (
          <div className={styles.bandRelation}>
            <small>{item.bandRelation.label}</small>
            {item.bandRelation.slug ? (
              <Link href={`/bandas/${item.bandRelation.slug}`}>{item.bandRelation.name} <span>↗</span></Link>
            ) : <strong>{item.bandRelation.name}</strong>}
          </div>
        ) : null}
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

  const groups = GROUPS.map((group) => {
    const groupItems = items.filter((item) => item.musicType === group.key);
    return {
      ...group,
      items: groupItems,
      repertoireBandContext: groupItems
        .map((item) => item.repertoireBandContext)
        .find((context) => context?.name) || null,
    };
  }).filter((group) => group.items.length);

  return (
    <section className={`section ${styles.section}`} id="musica">
      <div className="shell">
        <div className={styles.intro}>
          <SectionTitle
            eyebrow="Sonidos propios"
            title="Patrimonio musical"
            description="Composiciones vinculadas a la Hermandad y a sus titulares, organizadas por estilo para consultar cada repertorio sin alargar la ficha."
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
                <span className={styles.groupHeading}>
                  <strong>{group.label}</strong>
                  <small>{group.items.length} {group.noun} documentadas</small>
                  {group.repertoireBandContext?.name ? (
                    <span className={styles.groupContext}>
                      <small>{group.repertoireBandContext.label}</small>
                      <b>{group.repertoireBandContext.name}</b>
                    </span>
                  ) : null}
                </span>
                <span className={styles.groupToggle} aria-hidden="true">＋</span>
              </summary>
              <div className={styles.list}>
                {group.items.map((item) => <MusicRow item={item} key={item.id} />)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
