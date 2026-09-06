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
import {
  meetsPublicEditorialMinimum,
  publicEditorialRobots,
  publicText,
} from '@/lib/supabase/public-entity-page';
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

  const { paso, hermandad, imagenes = [], bandas = [] } = result;
  const [coverMedia, heritage] = await Promise.all([
    getPublishedEntityCoverMedia(paso.id),
    getPublishedStepHeritage(paso.id),
  ]);
  const title = paso.nombre;
  const description = seoDescription(
    hermandad
      ? `Ficha de ${paso.nombre}, de ${hermandad.nombrePopular}: imágenes que procesionan, configuración, patrimonio, autorías y evolución histórica.`
      : `Ficha de ${paso.nombre}: imágenes que procesionan, configuración y evolución patrimonial documentada.`
  );
  const canonical = `/pasos/${paso.slug}`;
  const editoriallyReady = meetsPublicEditorialMinimum({
    identity: paso.nombre,
    type: paso.tipo,
    context: hermandad?.localidad || hermandad?.nombrePopular,
    summary: paso.descripcion,
    relations: [hermandad?.id, imagenes, bandas, heritage.phases, heritage.pieces],
    sources: heritage.sources || [],
    publicValues: [paso, heritage.phases, heritage.pieces],
  });

  return {
    title,
    description,
    alternates: { canonical },
    robots: publicEditorialRobots(editoriallyReady),
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
    <div className="brotherhood-page" style={{
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
        ...(publicText(paso.descripcion) ? { description: publicText(paso.descripcion) } : {}),
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
          publicText(paso.ejecucion) ? { label: 'Ejecución', value: publicText(paso.ejecucion) } : null,
          publicText(paso.sistemaPortadores) ? { label: 'Sistema de portadores', value: publicText(paso.sistemaPortadores) } : null,
          { label: 'Imágenes', value: imagenes.length || '' },
        ]}
        media={{
          photoSrc: coverMedia?.path || '',
          photoAlt: coverMedia?.alt || `Fotografía de ${paso.nombre}`,
          credit: coverMedia?.credit || '',
          initials: paso.nombre.slice(0, 2).toUpperCase(),
          width: coverMedia?.width,
          height: coverMedia?.height,
          focusX: coverMedia?.focusX,
          focusY: coverMedia?.focusY,
          mobileFocusX: coverMedia?.mobileFocusX,
          mobileFocusY: coverMedia?.mobileFocusY,
          fitMode: coverMedia?.fitMode,
          focusPosition: coverMedia?.focusPosition || getStepPhotoFraming(paso.slug).hero,
        }}
      />

      <EntitySectionNav items={[
        { href: '#resumen', label: 'Resumen' },
        relationalItems.length > 0 && { href: '#tira-del-hilo', label: 'Tira del hilo' },
        bandas.length > 0 && { href: '#acompanamiento', label: 'Acompañamiento' },
        (heritage.phases.length > 0 || heritage.pieces.length > 0 || heritage.sources.length > 0) && { href: '#patrimonio', label: 'Patrimonio y evolución' },
      ]} />

      <section className="section" id="resumen"><div className="shell content-grid">
        <div>
          <SectionTitle eyebrow="Configuración actual" title="Datos del paso" />
          {publicText(paso.descripcion) ? <p className="body-large">{publicText(paso.descripcion)}</p> : null}
          <div className="step-facts">
            {hermandad ? <div>
              <small>Hermandad</small>
              <strong>{hermandad.nombrePopular}</strong>
            </div> : null}
            {publicText(paso.tipo) ? <div><small>Tipo</small><strong>{publicText(paso.tipo)}</strong></div> : null}
            {publicText(paso.ejecucion) ? <div><small>Ejecución</small><strong>{publicText(paso.ejecucion)}</strong></div> : null}
            {publicText(paso.materiales) ? <div><small>Materiales</small><strong>{publicText(paso.materiales)}</strong></div> : null}
            {publicText(paso.sistemaPortadores) ? <div><small>Sistema de portadores</small><strong>{publicText(paso.sistemaPortadores)}</strong></div> : null}
          </div>
        </div>
        {imagenes.length > 0 ? <aside className="brotherhood-summary-card">
          <span className="eyebrow">Imágenes que procesionan</span>
          <div className="step-images-list">
            {imagenes.map((imagen)=>(
              <Link key={imagen.slug} href={`/imagenes/${imagen.slug}`}>{imagen.nombre}{[publicText(imagen.autor), publicText(imagen.fecha)].filter(Boolean).length ? <span>{[publicText(imagen.autor), publicText(imagen.fecha)].filter(Boolean).join(' · ')}</span> : null}</Link>
            ))}
          </div>
        </aside> : null}
      </div></section>

      <RelationalThread
        currentName={paso.nombre}
        currentMeta={[paso.tipo, paso.ejecucion].filter(Boolean).join(' · ')}
        items={relationalItems}
        priorityProfile="paso"
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

      {(heritage.phases.length > 0 || heritage.pieces.length > 0 || heritage.sources.length > 0) ? <section className={`section brotherhood-soft ${styles.heritageSection}`} id="patrimonio">
        <div className="shell">
          <div className={styles.heritageIntro}>
            <SectionTitle
              eyebrow="Patrimonio documentado"
              title="Patrimonio y evolución"
              description={(heritage.phases.length || heritage.pieces.length)
                ? 'Las piezas del paso y su evolución material: diseño, talla, bordado, orfebrería, dorados y restauraciones.'
                : 'Fuentes documentales vinculadas a la configuración patrimonial del paso.'}
            />
          </div>

          {heritage.pieces.length ? (
            <div className={styles.pieces} aria-label="Piezas patrimoniales del paso">
              {heritage.pieces.map((piece) => (
                <article className={styles.piece} key={piece.id}>
                  <div className={styles.pieceMeta}>
                    <span>{piece.type}</span>
                    {piece.date ? <small>{piece.date}</small> : null}
                  </div>
                  <h3>{piece.title}</h3>
                  {piece.description ? <p>{piece.description}</p> : null}
                  {piece.detail ? <strong>{piece.detail}</strong> : null}
                  {piece.context ? <details><summary>Contexto histórico</summary><p>{piece.context}</p></details> : null}
                  {!piece.current ? <em>Elemento histórico</em> : null}
                </article>
              ))}
            </div>
          ) : null}

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
      </section> : null}
    </div>
  );
}
