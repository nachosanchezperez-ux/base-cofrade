export const metadata = {
  robots: { index: false, follow: false },
};

export default function PruebaNextPage() {
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Next.js funciona</h1>
      <p>Esta página no consulta Supabase.</p>
    </main>
  )
}
