// Túnicas de nazareno en la ficha por capítulos. Política pura.
import { habitFields } from './brotherhood-ficha-content.js'

function normalized(value = '') {
  return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function lowerFirst(value = '') {
  return value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : ''
}

// Una línea para el orden del cortejo: túnica · antifaz · cíngulo.
export function habitSummary(fields = []) {
  const pick = (key) => fields.find((field) => field.key === key)?.value || ''
  return [
    pick('tunica'),
    pick('antifaz') ? (/^antifaz/i.test(pick('antifaz')) ? lowerFirst(pick('antifaz')) : `antifaz ${lowerFirst(pick('antifaz'))}`) : '',
    pick('cordon') ? `cíngulo ${lowerFirst(pick('cordon'))}` : '',
  ].filter(Boolean).join(' · ')
}

// Solo los hábitos con algún campo documentado, con su resumen.
export function documentedHabits(habits = []) {
  return habits
    .map((habit) => ({ ...habit, fields: habitFields(habit) }))
    .filter((habit) => habit.fields.length > 0)
    .map((habit) => ({ ...habit, summary: habitSummary(habit.fields), pills: habitPills(habit.fields), anchor: `#tunica-${habit.id}` }))
}

const STEP_WORDS = ['cristo', 'palio', 'misterio', 'virgen', 'dolorosa']

// ¿Delante de qué paso va cada tramo? Si el nombre del hábito dice a qué paso
// pertenece («Cortejo del paso de palio») y eso señala un único paso, va
// delante de ese paso. En cualquier otro caso, al principio del cortejo.
export function habitsBeforeSteps(habits = [], steps = []) {
  const result = {}
  if (!habits.length || !steps.length) return result
  const many = habits.length > 1
  for (const habit of habits) {
    const name = normalized(habit.nombre)
    const words = STEP_WORDS.filter((word) => name.includes(word))
    const matches = words.length
      ? steps.filter((step) => words.some((word) => normalized(`${step.tipo} ${step.nombre}`).includes(word)))
      : []
    const step = matches.length === 1 ? matches[0] : steps[0]
    ;(result[step.id] ||= []).push({ ...habit, label: many ? habit.nombre : '' })
  }
  return result
}

// Nombre corto para elegir entre hábitos: «Cortejo del paso de palio» → «Palio».
export function habitShortName(name = '') {
  const value = String(name || '').trim().replace(/^(cortejo|tramos?|nazarenos)\s+(del?|de la)\s+(paso\s+(del?|de la)\s+)?/i, '')
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : ''
}

// Prendas que cambian entre hábitos de la misma Hermandad (p. ej. el cíngulo).
export function habitDifferences(habits = []) {
  if (habits.length < 2) return new Set()
  const keys = new Set(habits.flatMap((habit) => (habit.fields || []).map((field) => field.key)))
  return new Set([...keys].filter((key) => {
    const values = habits.map((habit) => normalized((habit.fields || []).find((field) => field.key === key)?.value || ''))
    return new Set(values).size > 1
  }))
}

// Pastillas del tramo en el orden del cortejo: solo prendas con valor breve.
export function habitPills(fields = [], max = 28) {
  return ['tunica', 'antifaz', 'cordon']
    .map((key) => fields.find((field) => field.key === key))
    .filter((field) => field && field.value.length <= max)
    .map((field) => ({ key: field.key, label: field.label, value: field.value }))
}

// Comparación entre hábitos de la misma Hermandad: las prendas que cambian, con
// el valor de cada hábito ('' si no consta), y las que comparten todos.
export function habitComparison(habits = []) {
  const changes = habitDifferences(habits)
  const seen = new Map()
  for (const habit of habits) for (const field of habit.fields || []) if (!seen.has(field.key)) seen.set(field.key, field.label)
  const changed = []
  const common = []
  for (const [key, label] of seen) {
    const values = habits.map((habit) => (habit.fields || []).find((field) => field.key === key)?.value || '')
    if (changes.has(key)) changed.push({ key, label, values })
    else common.push({ key, label, value: values[0] })
  }
  return { changed, common }
}
