import { createHash } from 'node:crypto'

// Límite de peticiones en memoria, por instancia de función y por cliente.
//
// Protege las APIs públicas de Tira del hilo frente a ráfagas automatizadas sin
// escribir en Supabase: cada consulta de la Tira ya cuesta varias lecturas a la base
// de datos y, si la capa semántica está activada, llamadas de pago a OpenAI.
//
// Límite conocido: el contador vive en la memoria de cada instancia de Vercel, así que
// no es un límite global exacto. Frena el abuso por ráfagas desde una misma IP; un
// límite global estricto corresponde al firewall de Vercel o a un contador compartido.

const DEFAULT_MAX_KEYS = 5000

export function createRateLimiter({ limit, windowMs, maxKeys = DEFAULT_MAX_KEYS, now = () => Date.now() }) {
  if (!Number.isInteger(limit) || limit < 1) throw new Error('limit debe ser un entero positivo')
  if (!Number.isInteger(windowMs) || windowMs < 1) throw new Error('windowMs debe ser un entero positivo')

  const buckets = new Map()

  function prune(current) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= current) buckets.delete(key)
    }
    // Si aun así se supera el tope (muchas IP distintas a la vez), se descartan las
    // ventanas más antiguas para que la memoria nunca crezca sin límite.
    while (buckets.size >= maxKeys) {
      const oldestKey = buckets.keys().next().value
      buckets.delete(oldestKey)
    }
  }

  return {
    consume(key) {
      const current = now()
      const id = String(key || 'anonimo')
      let bucket = buckets.get(id)

      if (!bucket || bucket.resetAt <= current) {
        if (!bucket && buckets.size >= maxKeys) prune(current)
        bucket = { count: 0, resetAt: current + windowMs }
        buckets.delete(id)
        buckets.set(id, bucket)
      }

      if (bucket.count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - current) / 1000)),
        }
      }

      bucket.count += 1
      return { allowed: true, remaining: limit - bucket.count, retryAfterSeconds: 0 }
    },
    size() {
      return buckets.size
    },
  }
}

// Identifica al cliente sin guardar su IP en claro. En Vercel, la cabecera
// x-forwarded-for la fija la propia plataforma con la IP real del visitante.
export function clientKey(requestHeaders) {
  const forwarded = requestHeaders?.get?.('x-forwarded-for') || requestHeaders?.get?.('x-real-ip') || ''
  const ip = String(forwarded).split(',')[0].trim().slice(0, 64)
  const source = ip ? `ip:${ip}` : `ua:${String(requestHeaders?.get?.('user-agent') || '').slice(0, 300)}`
  return createHash('sha256').update(source).digest('hex').slice(0, 32)
}

// Preguntas completas: cada una puede encadenar muchas lecturas y, si está activa,
// la capa semántica. Una persona difícilmente supera 15 preguntas por minuto.
export const tiraQuestionLimiter = createRateLimiter({ limit: 15, windowMs: 60_000 })

// Autocompletado: se dispara mientras se escribe, por eso admite más margen.
export const tiraSearchLimiter = createRateLimiter({ limit: 90, windowMs: 60_000 })
