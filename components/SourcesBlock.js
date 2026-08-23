export default function SourcesBlock({
  sources = [],
  id = 'fuentes'
}) {
  if (!sources?.length) return null;

  return (
    <section className="section sources-section" id={id} data-hilo-section="sources">
      <div className="shell">
        <div className="sources-heading">
          <div>
            <span className="eyebrow">Documentación</span>
            <h2>Fuentes</h2>
          </div>
        </div>

        <div className="sources-list">
          {sources.map((fuente) => {
            const isExternal = Boolean(fuente.url);
            const Row = isExternal ? 'a' : 'div';
            const rowProps = isExternal
              ? {
                  href: fuente.url,
                  target: '_blank',
                  rel: 'noreferrer',
                  'data-hilo-event': 'source_open',
                  'data-hilo-scope': 'external',
                }
              : {
                  'data-hilo-scope': 'internal',
                  'data-source-static': 'true',
                };

            return (
              <Row
                className={`source-row${isExternal ? '' : ' source-row-static'}`}
                key={fuente.id}
                data-hilo-section="sources"
                {...rowProps}
              >
                <span className="source-capirote" aria-hidden="true" />
                <div className="source-copy">
                  <strong>{fuente.nombre}</strong>
                </div>
              </Row>
            );
          })}
        </div>
      </div>
    </section>
  );
}
