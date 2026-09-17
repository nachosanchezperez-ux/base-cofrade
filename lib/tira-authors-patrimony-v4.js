export function normalizePatrimonyText(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[¿?¡!.,;:()«»"']/g, ' ').replace(/\s+/g, ' ').trim()
}

export function patrimonyV4Intent(question = '', context = null) {
  const q = normalizePatrimonyText(question)
  if (!q) return null
  const agentContext = context?.entityType === 'agent'
  const imageContext = context?.entityType === 'image'

  if (imageContext && /\b(mismo autor|misma autoria|mismo escultor|mismo imaginero)\b/.test(q) && /\b(misma hermandad|esta hermandad|esa hermandad)\b/.test(q)) return { kind: 'same_author_images_in_brotherhood' }

  const intervention = /\b(restauracion|restauraciones|intervencion|intervenciones|restaurad[ao]s?|intervenid[ao]s?)\b/.test(q)
  const asksWho = /\b(quien|quienes|restaurador|restauradores)\b/.test(q)
  if ((imageContext || /\b(imagen|virgen|cristo|jesus|senora)\b/.test(q)) && intervention && !asksWho) return { kind: 'image_interventions' }

  const images = /\b(imagen|imagenes|virgen|virgenes|cristo|cristos|titular|titulares)\b/.test(q)
  const creation = /\b(hizo|realizo|esculpio|tallo|creo|obra|obras|autoria|autor)\b/.test(q)
  if ((agentContext && images) || (images && creation && /\b(que|cuales|otras|todas)\b/.test(q))) return { kind: 'agent_images' }

  const steps = /\b(paso|pasos|palio|palios|misterio|misterios)\b/.test(q)
  const work = /\b(trabajo|trabajos|intervino|participo|diseno|realizo|hizo|obra|obras)\b/.test(q)
  if ((agentContext && steps) || (steps && work)) return { kind: 'agent_steps' }

  const brotherhoods = /\b(hermandad|hermandades|cofradia|cofradias)\b/.test(q)
  if (/\b(que relacion|cual es la relacion|que vinculo|que obras)\b/.test(q) && brotherhoods) return { kind: 'agent_brotherhood_works' }
  if (brotherhoods && /\b(en que|donde|cuales|que)\b/.test(q) && /\b(obra|obras|imagen|imagenes|paso|pasos|trabajo|trabajos)\b/.test(q)) return { kind: 'agent_brotherhoods' }
  return null
}

export function patrimonyEntityScore(name = '', question = '') {
  const target = normalizePatrimonyText(name)
  const q = normalizePatrimonyText(question)
  if (!target || !q) return 0
  if (q === target) return 2000
  if (q.includes(target)) return 1500 + Math.min(target.length, 100)
  const generic = new Set(['antonio','autor','cristo','de','del','el','escultor','hermandad','imagen','la','las','los','luis','nuestra','nuestro','paso','senora','virgen','y'])
  const tokens = target.split(' ').filter((token) => token.length >= 4 && !generic.has(token))
  const matched = tokens.filter((token) => q.includes(token)).length
  return matched ? matched * 180 + Math.round((matched / Math.max(tokens.length, 1)) * 300) : 0
}
