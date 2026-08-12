import HermandadesDirectory from '@/components/HermandadesDirectory';
import { getHermandadesDirectory } from '@/lib/supabase/brotherhoods';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hermandades de Sevilla y provincia',
  description: 'Hermandades de Sevilla capital y provincia en Hilo Cofrade, organizadas por día de salida y conectadas con sus imágenes, pasos y patrimonio',
};

export default async function HermandadesPage() {
  const hermandades = await getHermandadesDirectory();

  return (
    <section className="section page-top">
      <div className="shell">
        <span className="eyebrow">Sevilla capital y provincia</span>
        <h1 className="page-title">Hermandades de Sevilla y provincia</h1>
        <p className="page-lead">
          Busca por nombre, sede o día de salida y entra directamente en la ficha de cada hermandad
        </p>
        <HermandadesDirectory hermandades={hermandades} />
      </div>
    </section>
  );
}
