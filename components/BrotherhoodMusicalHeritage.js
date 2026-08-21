import Link from 'next/link';
import SectionTitle from './SectionTitle';
import styles from './BrotherhoodMusicalHeritage.module.css';

const INITIAL_VISIBLE_ITEMS = 5;
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
    return (
      <div className={styles.authorship}>
        <span>{item.authorshipText || 'Autoría por documentar'}</span>
      </div>
    );
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
            ) : (
              <strong>{item.bandRelation.name}</strong>
            )}
          </div>
        ) : null}
      </div>
      {item.listening?.url ? (
        <a
          className={styles.listen}
          href={item.listening.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Escuchar ${item.name} en ${item.listening.provider}`}
        >
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
            description="Composiciones dedicadas a la Hermandad y a sus titulares: marchas procesionales, música de capilla y coplas para cultos internos, relacionadas con sus autores, intérpretes y grabaciones cuando están documentados."
          />
          <div className={styles.summary} aria-label="Resumen del patrimonio musical">
            <strong>{items.length}</strong>
            <span>composiciones documentadas</span>
            {groups.map((group) => (
              <small key={group.key}>{group.items.length} · {group.short}</small>
            ))}
          </div>
        </div>

        <div className={styles.groups}>
          {groups.map((group) => {
            const visibleItems = group.items.slice(0, INITIAL_VISIBLE_ITEMS);
            const remainingItems = group.items.slice(INITIAL_VISIBLE_ITEMS);

            return (
              <section className={styles.group} key={group.key} aria-labelledby={`music-${group.short.toLowerCase()}`}>
                <header className={styles.groupHeader}>
                  <span className={styles.groupMark} aria-hidden="true">{group.short}</span>
                  <div>
                    <h3 id={`music-${group.short.toLowerCase()}`}>{group.label}</h3>
                    <p>{group.items.length} {group.noun} documentadas</p>
                    {group.repertoireBandContext?.name ? (
                      <div className={styles.groupContext}>
                        <small>{group.repertoireBandContext.label}</small>
                        {group.repertoireBandContext.slug ? (
                          <Link href={`/bandas/${group.repertoireBandContext.slug}`}>
                            {group.repertoireBandContext.name} <span>↗</span>
                          </Link>
                        ) : (
                          <strong>{group.repertoireBandContext.name}</strong>
                        )}
                      </div>
                    ) : null}
                  </div>
                </header>

                <div className={styles.list}>
                  {visibleItems.map((item) => <MusicRow item={item} key={item.id} />)}
                </div>

                {remainingItems.length ? (
                  <details className={styles.more}>
                    <summary>
                      <span className={styles.moreClosed}>Ver {remainingItems.length} {group.noun} más</span>
                      <span className={styles.moreOpen}>Ocultar repertorio ampliado</span>
                      <span className={styles.moreIcon} aria-hidden="true">＋</span>
                    </summary>
                    <div className={styles.moreList}>
                      {remainingItems.map((item) => <MusicRow item={item} key={item.id} />)}
                    </div>
                  </details>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
