import { renderOutingStoryImage } from '@/lib/outing-story-image';

// Imagen vertical de una salida para compartir en estados e historias.
// /salidas/<id de la salida>/estado
export async function GET(_request, { params }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(String(id || ''))) return new Response('Salida no válida', { status: 404 });
  return renderOutingStoryImage(id);
}
