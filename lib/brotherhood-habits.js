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
    .map((habit) => ({ ...habit, summary: habitSummary(habit.fields) }))
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
