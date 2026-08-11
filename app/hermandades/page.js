import HermandadesDirectory from '@/components/HermandadesDirectory';
import { hermandades } from '@/lib/data';

export const metadata = {
  title: 'Hermandades de Sevilla',
  description: 'Hermandades de Sevilla capital en Hilo Cofrade, organizadas por día de salida y conectadas con sus imágenes, pasos y patrimonio',
};

export default function HermandadesPage() {
  return (
    <section className="section page-top">
      <div className="shell">
        <span className="eyebrow">Sevilla capital</span>
        <h1 className="page-title">Hermandades de Sevilla</h1>
        <p className="page-lead">
          Busca por nombre, sede o día de salida y entra directamente en la ficha de cada hermandad
        </p>
        <HermandadesDirectory hermandades={hermandades} />
      </div>
    </section>
  );
}
