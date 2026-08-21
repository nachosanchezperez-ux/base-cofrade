export const runtime = 'nodejs';

function text(value, max = 160) {
  return String(value || '').trim().slice(0, max);
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const event = payload?.event === 'relational_thread_expand'
      ? 'relational_thread_expand'
      : 'relational_thread_click';

    console.log(JSON.stringify({
      level: 'info',
      event,
      source_type: text(payload?.sourceType, 32),
      source: text(payload?.source, 140),
      destination_type: text(payload?.destinationType, 32),
      destination: text(payload?.destination, 180),
      relation: text(payload?.relation, 100),
      path: text(payload?.path, 180),
      hidden_count: Number.isFinite(payload?.hiddenCount) ? payload.hiddenCount : undefined,
    }));
  } catch {
    // La telemetría nunca debe interferir con la navegación pública.
  }

  return new Response(null, { status: 204 });
}
