import Image from 'next/image';
import Link from 'next/link';
import RelationalEntityHeroMedia from './RelationalEntityHeroMedia';
import styles from './RelationalEntityHero.module.css';

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
              {item.href && !isCurrent ? <Link href={item.href}>{item.label}</Link> : <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>}
              {!isCurrent ? <i aria-hidden="true">→</i> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ParentRelation({ relation }) {
  if (!relation?.name || !relation?.href) return null;

  return (
    <Link className={styles.relation} href={relation.href}>
      <span className={styles.relationCopy}>
        <small>{relation.label || 'Pertenece a'}</small>
        <strong>{relation.name}</strong>
      </span>
      <span className={styles.relationArrow} aria-hidden="true">↗</span>
    </Link>
  );
}

function BrotherhoodIdentity({ identity }) {
  if (!identity?.name) return null;
  const visibleLinks = (identity.links || []).filter((link) => link?.url).slice(0, 2);

  return (
    <aside className={styles.identityBand} aria-label="Identidad de la hermandad">
      <div className={`shell ${styles.identityBandInner}`}>
        {identity.crestSrc ? (
          <span className={styles.identityCrest}>
            <Image src={identity.crestSrc} alt={identity.crestAlt || ''} width={68} height={78} sizes="68px" />
          </span>
        ) : null}
        <div className={styles.identityBandCopy}>
          <small>Identidad institucional</small>
          <strong>{identity.name}</strong>
          {identity.detail ? <span>{identity.detail}</span> : null}
        </div>
        {visibleLinks.length ? (
          <nav className={styles.identityLinks} aria-label="Enlaces oficiales destacados">
            {visibleLinks.map((link) => <a href={link.url} key={link.id || link.url} target="_blank" rel="noreferrer">{link.label || 'Canal oficial'} ↗</a>)}
          </nav>
        ) : null}
      </div>
    </aside>
  );
}

function titleScale(title = '') {
  if (title.length > 82) return 'dense';
  if (title.length > 52) return 'compact';
  return 'default';
}

export default function RelationalEntityHero({
  variant = 'image',
  entityType,
  title,
  subtitle = '',
  breadcrumbItems = [],
  badges = [],
  relation = null,
  facts = [],
  media = {},
  identity = null,
}) {
  const visibleBadges = badges.filter(Boolean).slice(0, 3);
  const visibleFacts = facts.filter((fact) => fact?.label && fact?.value).slice(0, 3);

  return (
    <>
      <section className={`${styles.hero} ${styles[`hero_${variant}`]}`} aria-labelledby="entity-hero-title">
        <div className="shell">
          <Breadcrumb items={breadcrumbItems} />
          <div className={styles.grid}>
            <div className={styles.copy}>
              <div className={styles.identityRow}>
                <span className={styles.entityType}>{entityType}</span>
                {visibleBadges.map((badge) => <span className={styles.badge} key={badge}>{badge}</span>)}
              </div>

              <h1 id="entity-hero-title" data-scale={titleScale(title)}>{title}</h1>
              {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
              <ParentRelation relation={relation} />

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

            <RelationalEntityHeroMedia variant={variant} {...media} />
          </div>
        </div>
      </section>
      {variant === 'brotherhood' ? <BrotherhoodIdentity identity={identity} /> : null}
    </>
  );
}
