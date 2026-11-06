import { renderOutingStoryImage } from '@/lib/outing-story-image';

// Imagen de una salida para redes.
// /salidas/<id de la salida>/estado            → vertical (estados e historias)
// /salidas/<id de la salida>/estado?formato=cuadrado → cuadrada (publicaciones)
export async function GET(request, { params }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(String(id || ''))) return new Response('Salida no válida', { status: 404 });
  const format = new URL(request.url).searchParams.get('formato') === 'cuadrado' ? 'cuadrado' : 'estado';
  return renderOutingStoryImage(id, format);
}
