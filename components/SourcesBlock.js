export default function SourcesBlock({
  sources = [],
  id = 'fuentes'
}) {
  if (!sources?.length) return null;

  return (
    <section className="section sources-section" id={id}>
      <div className="shell">
        <div className="sources-heading">
          <div>
            <span className="eyebrow">Documentación</span>
            <h2>Fuentes</h2>
          </div>
        </div>

        <div className="sources-list">
          {sources.map((fuente) => (
            <a
              className="source-row"
              href={fuente.url}
              target="_blank"
              rel="noreferrer"
              key={fuente.id}
            >
              <span className="source-capirote" aria-hidden="true" />
              <div className="source-copy">
                <strong>{fuente.nombre}</strong>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
