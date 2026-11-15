import { madridNow, temporalUrgencyLabel } from './agenda-clock.js'
import { getProcessionLiveState } from './procession-live-status.js'

// La fecha no demuestra que se celebró: separa estado editorial y tiempo.
export function getOutingTemporalState({
  date = '',
  returnDate = '',
  departureTime = '',
  returnTime = '',
  eventStatus = 'announced',
} = {}, now = new Date()) {
  const { today } = madridNow(now)
  const liveState = getProcessionLiveState({
    date,
    endDate: returnDate,
    startTime: departureTime,
    endTime: returnTime,
  }, now)
  const isPast = Boolean(date) && liveState.state === 'done'
  const isUpcoming = ['announced', 'rescheduled'].includes(eventStatus) && Boolean(date) && !isPast

  return {
    isUpcoming,
    isPast,
    isCelebrated: eventStatus === 'held',
    isCancelled: ['cancelled', 'suspended'].includes(eventStatus),
    isPostponed: eventStatus === 'postponed',
    isLive: isUpcoming && liveState.isLive,
    urgencyLabel: isUpcoming ? temporalUrgencyLabel(date, today) : '',
  }
}
