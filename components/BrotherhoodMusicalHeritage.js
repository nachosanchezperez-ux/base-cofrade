import Link from 'next/link';
import SectionTitle from './SectionTitle';
import styles from './BrotherhoodMusicalHeritage.module.css';

const INITIAL_VISIBLE_MARCHES = 5;
const GROUPS = [
  { key: 'Cornetas y Tambores', label: 'Cornetas y tambores', short: 'CT' },
  { key: 'Banda de Música', label: 'Banda de música', short: 'BM' },
];

function AuthorLine({ item }) {
  const composerNames = item.composers.map((author) => author.name).join(' · ');
  const adapterNames = item.adapters.map((author) => author.name).join(' · ');

  return (
    <div className={styles.authorship}>
      <span>{composerNames || 'Autoría por documentar'}</span>
      {adapterNames ? <small>Instrumentación · {adapterNames}</small> : null}
    </div>
  );
}

function MarchRow({ item }) {
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
            description="Marchas dedicadas a la Hermandad y a sus titulares. La dedicatoria forma parte de su patrimonio con independencia de qué banda la estrene, la grabe o acompañe actualmente a la cofradía."
          />
          <div className={styles.summary} aria-label="Resumen del patrimonio musical">
            <strong>{items.length}</strong>
            <span>marchas documentadas</span>
            {groups.map((group) => (
              <small key={group.key}>{group.items.length} · {group.short}</small>
            ))}
          </div>
        </div>

        <div className={styles.groups}>
          {groups.map((group) => {
            const visibleItems = group.items.slice(0, INITIAL_VISIBLE_MARCHES);
            const remainingItems = group.items.slice(INITIAL_VISIBLE_MARCHES);

            return (
              <section className={styles.group} key={group.key} aria-labelledby={`music-${group.short.toLowerCase()}`}>
                <header className={styles.groupHeader}>
                  <span className={styles.groupMark} aria-hidden="true">{group.short}</span>
                  <div>
                    <h3 id={`music-${group.short.toLowerCase()}`}>{group.label}</h3>
                    <p>{group.items.length} marchas documentadas</p>
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
                  {visibleItems.map((item) => <MarchRow item={item} key={item.id} />)}
                </div>

                {remainingItems.length ? (
                  <details className={styles.more}>
                    <summary>
                      <span className={styles.moreClosed}>Ver {remainingItems.length} marchas más</span>
                      <span className={styles.moreOpen}>Ocultar repertorio ampliado</span>
                      <span className={styles.moreIcon} aria-hidden="true">＋</span>
                    </summary>
                    <div className={styles.moreList}>
                      {remainingItems.map((item) => <MarchRow item={item} key={item.id} />)}
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
