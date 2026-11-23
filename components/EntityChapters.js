import BrotherhoodChapterNav from './BrotherhoodChapterNav'
import styles from './EntityChapters.module.css'

// «Modo aplicación» para fichas que no son de Hermandad (24/11/2026; primero la
// Banda). Reutiliza la navegación por capítulos de la ficha de Hermandad
// (BrotherhoodChapterNav + lib/brotherhood-chapter-app.js): en móvil, cada
// capítulo es una pantalla con barra inferior; en ordenador y sin JavaScript,
// una página continua con todo el contenido (indexable).

export function EntityChapters({ items = [], name = '', crestSrc = '', heroTitleId = 'entity-hero-title', children }) {
  return (
    <div className={styles.chapters} data-chapters-root="">
      <BrotherhoodChapterNav items={items} name={name} crestSrc={crestSrc} heroTitleId={heroTitleId} />
      {children}
    </div>
  )
}

export function EntityChapter({ id, label, owner = '', children }) {
  return (
    <section className={styles.chapter} id={id} data-chapter={id} aria-labelledby={`${id}-titulo`}>
      {/* Título para lectores de pantalla y destino del foco al cambiar de pantalla. */}
      <p className={styles.chapterTitle} id={`${id}-titulo`} tabIndex={-1} data-chapter-title="">
        {owner ? `${owner}: ` : ''}{label}
      </p>
      {children}
    </section>
  )
}

// Capítulos con contenido: { id, label, icon, show } → elementos de la barra.
export function chapterNavItems(chapters = []) {
  return chapters
    .filter((chapter) => chapter.show)
    .map(({ id, label, icon }) => ({ anchor: id, href: `#${id}`, label, icon }))
}
