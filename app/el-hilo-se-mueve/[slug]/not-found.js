import Link from 'next/link'

// Noticia retirada o dirección mal escrita: se vuelve al índice de novedades.
export default function HiloArticleNotFound() {
  return (
    <section className="section page-top">
      <div className="shell empty-page">
        <span className="eyebrow">404</span>
        <h1>No encontramos esa noticia.</h1>
        <p>Puede que la dirección haya cambiado o que la noticia ya no esté publicada.</p>
        <Link className="button button-primary" href="/el-hilo-se-mueve">Ver todas las novedades</Link>
      </div>
    </section>
  )
}
