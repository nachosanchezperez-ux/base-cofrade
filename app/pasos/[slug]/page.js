import Link from 'next/link';
import { notFound } from 'next/navigation';
import EntitySectionNav from '@/components/EntitySectionNav';
import JsonLd from '@/components/JsonLd';
import RelationalEntityHero from '@/components/RelationalEntityHero';
import RelationalThread from '@/components/RelationalThread';
import SectionTitle from '@/components/SectionTitle';
import { getStepPhotoFraming } from '@/lib/step-photo-framing';
import { getPublishedEntityCoverMedia } from '@/lib/supabase/entity-media';
import { getPasoPageBySlug } from '@/lib/supabase/public-entity-pages';
import { getPublishedStepHeritage } from '@/lib/supabase/step-heritage';
import styles from './step.module.css';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageTitle,
  seoDescription,
} from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getPasoPageBySlug(slug);

  if (!result) {
    return {
      title: 'Paso no encontrado',
      robots: { index: false, follow: false },
    };
  }

  const { paso, hermandad } = result;
  const coverMedia = await getPublishedEntityCoverMedia(paso.id);
  const title = paso.nombre;
  const description = seoDescription(
    hermandad
      ? `Ficha de ${paso.nombre}, de ${hermandad.nombrePopular}: imágenes que procesionan, configuración, patrimonio, autorías y evolución histórica.`
      : `Ficha de ${paso.nombre}: imágenes que procesionan, configuración y evolución patrimonial documentada.`
  );
  const canonical = `/pasos/${paso.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: pageTitle(title),
      description,
      url: canonical,
      ...(coverMedia?.path ? {
        images: [{
          url: coverMedia.path,
          alt: coverMedia.alt || `Fotografía de ${paso.nombre}`,
        }],
      } : {}),
    },
    twitter: {
      title: pageTitle(title),
      description,
      ...(coverMedia?.path ? {
        images: [{
          url: coverMedia.path,
          alt: coverMedia.alt || `Fotografía de ${paso.nombre}`,
        }],
      } : {}),
    },
  };
}

export default async function PasoDetailPage({params}){
  const {slug}=await params;
  const result=await getPasoPageBySlug(slug);
  if(!result) notFound();
  const {paso,hermandad,imagenes=[],bandas=[]}=result;
  const [coverMedia, heritage] = await Promise.all([
    getPublishedEntityCoverMedia(paso.id),
    getPublishedStepHeritage(paso.id),
  ]);
  const relationalItems = [
    ...(hermandad ? [{
      kind: 'Hermandad',
      relation: 'Pertenece a',
      title: hermandad.nombrePopular,
      href: `/hermandades/${hermandad.slug}`,
      context: 'Ficha matriz de la corporación',
    }] : []),
    ...imagenes.map((imagen) => ({
      kind: 'Imagen',
      relation: 'Procesiona aquí',
      title: imagen.nombre,
      href: `/imagenes/${imagen.slug}`,
      context: [imagen.autor, imagen.fecha].filter(Boolean).join(' · '),
    })),
    ...bandas.map((banda) => ({
      kind: 'Banda',
      relation: banda.posicion || 'Acompañamiento',
      title: banda.nombre,
      href: `/bandas/${banda.slug}`,
      context: [banda.salida, banda.periodo].filter(Boolean).join(' · '),
    })),
  ];
  const canonicalPath = `/pasos/${paso.slug}`;
  const breadcrumbs = [
    { name: 'Inicio', path: '/' },
    { name: 'Pasos', path: '/pasos' },
    { name: paso.nombre, path: canonicalPath },
  ];

  return (
    <main className="brotherhood-page" style={{
      '--brotherhood-primary': hermandad?.colores?.primario || '#153B69',
      '--brotherhood-secondary': hermandad?.colores?.secundario || '#A71930',
      '--brotherhood-light': hermandad?.colores?.claro || '#FFFFFF',
      '--brotherhood-dark': hermandad?.colores?.oscuro || '#0D2949',
      '--brotherhood-on-secondary': hermandad?.colores?.sobreSecundario || '#FFFFFF'
    }}>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${absoluteUrl(canonicalPath)}#work`,
        url: absoluteUrl(canonicalPath),
        name: paso.nombre,
        description: paso.descripcion,
        ...(coverMedia?.path ? { image: absoluteUrl(coverMedia.path) } : {}),
        ...(hermandad ? {
          isPartOf: {
            '@type': 'Organization',
            name: hermandad.nombreOficial || hermandad.nombrePopular,
          },
        } : {}),
      }} />
      <RelationalEntityHero
        variant="step"
        entityType="Paso procesional"
        title={paso.nombre}
        breadcrumbItems={[
          { label: 'Pasos', href: '/pasos' },
          { label: 'Ficha' },
        ]}
        badges={[
          paso.tipo,
          imagenes.length ? `${imagenes.length} ${imagenes.length === 1 ? 'imagen vinculada' : 'imágenes vinculadas'}` : '',
        ]}
        relation={hermandad ? {
          label: 'Pertenece a',
          name: hermandad.nombrePopular,
          href: `/hermandades/${hermandad.slug}`,
          crestSrc: hermandad.escudoPath || '',
        } : null}
        facts={[
          { label: 'Ejecución', value: paso.ejecucion },
          { label: 'Sistema de portadores', value: paso.sistemaPortadores },
          { label: 'Imágenes', value: imagenes.length || '' },
        ]}
        media={{
          photoSrc: coverMedia?.path || '',
          photoAlt: coverMedia?.alt || `Fotografía de ${paso.nombre}`,
          credit: coverMedia?.credit || '',
          initials: paso.nombre.slice(0, 2).toUpperCase(),
          focusPosition: getStepPhotoFraming(paso.slug).hero,
        }}
      />

      <EntitySectionNav items={[
        { href: '#resumen', label: 'Resumen' },
        relationalItems.length > 0 && { href: '#tira-del-hilo', label: 'Tira del hilo' },
        bandas.length > 0 && { href: '#acompanamiento', label: 'Acompañamiento' },
        { href: '#patrimonio', label: 'Patrimonio y evolución' },
      ]} />

      <section className="section" id="resumen"><div className="shell content-grid">
        <div>
          <SectionTitle eyebrow="Configuración actual" title="Datos del paso" />
          {paso.descripcion ? <p className="body-large">{paso.descripcion}</p> : null}
          <div className="step-facts">
            <div>
              <small>Hermandad</small>
              <strong>{hermandad?.nombrePopular || 'Sin vinculación publicada'}</strong>
            </div>
            <div><small>Tipo</small><strong>{paso.tipo}</strong></div>
            <div><small>Ejecución</small><strong>{paso.ejecucion || 'Pendiente de incorporar'}</strong></div>
            {paso.materiales ? <div><small>Materiales</small><strong>{paso.materiales}</strong></div> : null}
            <div><small>Sistema de portadores</small><strong>{paso.sistemaPortadores || 'Pendiente de incorporar'}</strong></div>
          </div>
        </div>
        <aside className="brotherhood-summary-card">
          <span className="eyebrow">Imágenes que procesionan</span>
          <div className="step-images-list">
            {imagenes.length ? imagenes.map((imagen)=>(
              <Link key={imagen.slug} href={`/imagenes/${imagen.slug}`}>{imagen.nombre}<span>{[imagen.autor, imagen.fecha].filter(Boolean).join(' · ') || 'Datos por documentar'}</span></Link>
            )) : <strong>Sin imágenes publicadas vinculadas</strong>}
          </div>
        </aside>
      </div></section>

      <RelationalThread
        currentName={paso.nombre}
        currentMeta={[paso.tipo, paso.ejecucion].filter(Boolean).join(' · ')}
        items={relationalItems}
        title="Este paso conecta patrimonio, imágenes y música"
        description="Desde aquí puedes volver a la Hermandad, abrir las fichas de las imágenes que procesionan o continuar hacia las formaciones musicales vinculadas actualmente."
      />

      {bandas.length > 0 && (
        <section className={`section ${styles.accompanimentSection}`} id="acompanamiento">
          <div className="shell">
            <SectionTitle
              eyebrow="Relación actual"
              title="Acompañamiento musical"
              description="Formaciones vinculadas actualmente a este paso mediante acompañamientos documentados."
            />
            <div className={styles.accompanimentGrid}>
              {bandas.map((banda) => (
                <Link className={styles.accompanimentCard} href={`/bandas/${banda.slug}`} key={banda.id}>
                  <span>{banda.posicion}</span>
                  <strong>{banda.nombre}</strong>
                  <small>{[banda.salida, banda.periodo].filter(Boolean).join(' · ')}</small>
                  <em aria-hidden="true">→</em>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`section brotherhood-soft ${styles.heritageSection}`} id="patrimonio">
        <div className="shell">
          <div className={styles.heritageIntro}>
            <SectionTitle
              eyebrow="Patrimonio documentado"
              title="Patrimonio y evolución"
              description={heritage.phases.length
                ? 'Diseño, talla, dorados, piezas singulares y restauraciones que explican la configuración actual del paso.'
                : 'La evolución patrimonial de este paso está pendiente de documentar.'}
            />
          </div>

          {heritage.phases.length ? (
            <div className={styles.timeline}>
              {heritage.phases.map((phase) => (
                <article className={styles.phase} key={phase.id}>
                  <div className={styles.date}>{phase.date}</div>
                  <div className={styles.card}>
                    <div className={styles.meta}>
                      <span className={styles.type}>{phase.type}</span>
                    </div>
                    <h3>{phase.title}</h3>
                    {phase.description ? <p className={styles.description}>{phase.description}</p> : null}
                    {phase.responsibles.length ? (
                      <div className={styles.people} aria-label={`Responsables de ${phase.title}`}>
                        {phase.responsibles.map((person) => (
                          <div className={styles.person} key={person.id}>
                            <strong>{person.name}</strong>
                            <small>{[person.role, person.discipline].filter(Boolean).join(' · ')}</small>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {heritage.sources.length ? (
            <div className={styles.sources}>
              <strong>Documentación:</strong>
              {heritage.sources.map((source) => source.url ? (
                <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.name}</a>
              ) : (
                <span key={source.id}>{source.type || source.name}</span>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
