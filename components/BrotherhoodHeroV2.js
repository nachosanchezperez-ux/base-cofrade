import Image from 'next/image';
import Link from 'next/link';
import baratilloHeroPhoto from '@/components/preview/baratilloHeroPhoto';
import styles from './BrotherhoodHeroV2.module.css';

function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
      <span className={styles.breadcrumbAccent} aria-hidden="true" />
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !isCurrent ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>
              )}
              {!isCurrent ? <i aria-hidden="true">→</i> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function BrotherhoodHeroV2({
  entityType = 'Hermandad',
  title,
  subtitle = '',
  breadcrumbItems = [],
  badges = [],
  facts = [],
  crestSrc = '',
  crestAlt = '',
}) {
  const visibleBadges = badges.filter(Boolean).slice(0, 3);
  const visibleFacts = facts.filter((fact) => fact?.label && fact?.value).slice(0, 3);
  const processionDay = visibleFacts.find((fact) => fact.label === 'Día de salida')?.value || '';
  const canonicalSeat = visibleFacts.find((fact) => fact.label === 'Sede canónica')?.value || '';
  const context = [processionDay, canonicalSeat].filter(Boolean).join(' · ');

  return (
    <section className={styles.hero} aria-labelledby="entity-hero-title">
      <img
        className={styles.photo}
        src={baratilloHeroPhoto}
        alt="Nazareno de El Baratillo ante la Plaza de Toros de la Maestranza"
      />
      <span className={styles.photoVeil} aria-hidden="true" />
      <span className={styles.texture} aria-hidden="true" />

      <div className={`shell ${styles.shell}`}>
        <Breadcrumb items={breadcrumbItems} />

        <div className={styles.content}>
          <div className={styles.identityBar}>
            {crestSrc ? (
              <span className={styles.crest}>
                <Image
                  src={crestSrc}
                  alt={crestAlt || `Escudo de ${title}`}
                  width={104}
                  height={122}
                  sizes="(max-width: 620px) 68px, 104px"
                  priority
                />
              </span>
            ) : null}

            <div className={styles.identityMeta}>
              <span className={styles.entityType}>{entityType}</span>
              <div className={styles.badges}>
                {visibleBadges.map((badge) => <span key={badge}>{badge}</span>)}
              </div>
            </div>
          </div>

          <h1 id="entity-hero-title">{title}</h1>
          {context ? <p className={styles.context}>{context}</p> : null}
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}

          {visibleFacts.length ? (
            <dl className={styles.facts} data-count={visibleFacts.length}>
              {visibleFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.href ? <Link href={fact.href}>{fact.value}</Link> : fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      <span className={styles.credit}>Fotografía · Adolfo Sánchez</span>
    </section>
  );
}
