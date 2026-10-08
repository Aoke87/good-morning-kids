import { TIMING } from './constants'

export type Phase = 'off' | 'night' | 'morning' | 'leave'

export interface MorningState {
  phase: Phase
  /** 0 at window start, 1 at target time. */
  progress: number
  minutesLeft: number
  isWarning: boolean
}

const MINUTES_PER_HOUR = 60
const SECONDS_PER_MINUTE = 60

export function parseTime(hhmm: string): number {
  const [hours, minutes] = hhmm.split(':').map(Number)
  return hours * MINUTES_PER_HOUR + minutes
}

function minutesOfDay(date: Date): number {
  return date.getHours() * MINUTES_PER_HOUR + date.getMinutes() + date.getSeconds() / SECONDS_PER_MINUTE
}

// ponytail: target times before 01:00 would need a window crossing midnight; irrelevant for a morning routine.
export function getMorningState(now: Date, targetTime: string, weekdays: readonly number[]): MorningState {
  const target = parseTime(targetTime)
  const start = target - TIMING.WINDOW_MINUTES
  const current = minutesOfDay(now)
  const minutesLeft = Math.max(0, target - current)

  if (!weekdays.includes(now.getDay())) return { phase: 'off', progress: 1, minutesLeft, isWarning: false }
  if (current < start) return { phase: 'night', progress: 0, minutesLeft, isWarning: false }
  if (current >= target) return { phase: 'leave', progress: 1, minutesLeft: 0, isWarning: false }

  return {
    phase: 'morning',
    progress: (current - start) / TIMING.WINDOW_MINUTES,
    minutesLeft,
    isWarning: minutesLeft <= TIMING.WARNING_MINUTES,
  }
}

export function dayKey(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
