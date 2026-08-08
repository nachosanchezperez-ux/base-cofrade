import HermandadSearch from '@/components/HermandadSearch';
import { hermandades } from '@/lib/data';

export const metadata = { title: 'Hermandades' };

export default function HermandadesPage() {
  return (
    <section className="section page-top">
      <div className="shell">
        <span className="eyebrow">Explorar</span>
        <h1 className="page-title">Hermandades</h1>
        <p className="page-lead">
          Busca por nombre, localidad o día de salida. En esta versión inicial solo está cargada
          la hermandad piloto.
        </p>
        <HermandadSearch hermandades={hermandades} />
      </div>
    </section>
  );
}
