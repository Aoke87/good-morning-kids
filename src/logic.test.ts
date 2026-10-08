import { describe, expect, test } from 'vitest'
import { dayKey, getMorningState, parseTime } from './time'
import { DEFAULT_SETTINGS, moveTask, normalizeSettings } from './settings'

const WEEKDAYS = [1, 2, 3, 4, 5]
// 2026-10-08 is a Thursday.
const at = (hhmm: string) => new Date(`2026-10-08T${hhmm}:00`)

describe('getMorningState', () => {
  test('is night before the window starts', () => {
    expect(getMorningState(at('07:29'), '08:30', WEEKDAYS)).toMatchObject({ phase: 'night', progress: 0 })
  })

  test('starts the window exactly one hour before target', () => {
    expect(getMorningState(at('07:30'), '08:30', WEEKDAYS)).toMatchObject({ phase: 'morning', progress: 0 })
  })

  test('reports progress halfway through the window', () => {
    expect(getMorningState(at('08:00'), '08:30', WEEKDAYS).progress).toBeCloseTo(0.5)
  })

  test('warns in the last ten minutes only', () => {
    expect(getMorningState(at('08:19'), '08:30', WEEKDAYS).isWarning).toBe(false)
    expect(getMorningState(at('08:20'), '08:30', WEEKDAYS).isWarning).toBe(true)
  })

  test('switches to leave at target time', () => {
    expect(getMorningState(at('08:30'), '08:30', WEEKDAYS)).toMatchObject({ phase: 'leave', progress: 1, minutesLeft: 0 })
  })

  test('is off on disabled weekdays', () => {
    expect(getMorningState(at('08:00'), '08:30', [6, 0]).phase).toBe('off')
  })
})

describe('time helpers', () => {
  test('parseTime converts to minutes of day', () => {
    expect(parseTime('08:30')).toBe(510)
  })

  test('dayKey uses local date', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
  })
})

describe('settings', () => {
  test('falls back to defaults for garbage', () => {
    expect(normalizeSettings('nonsense')).toEqual(DEFAULT_SETTINGS)
  })

  test('keeps stored order and appends unknown catalog tasks disabled', () => {
    const result = normalizeSettings({ tasks: [{ id: 'shoes', enabled: true }, { id: 'gone', enabled: true }] })
    expect(result.tasks[0]).toEqual({ id: 'shoes', enabled: true })
    expect(result.tasks).toHaveLength(DEFAULT_SETTINGS.tasks.length)
    expect(result.tasks.slice(1).every((task) => !task.enabled)).toBe(true)
  })

  test('rejects malformed target time', () => {
    expect(normalizeSettings({ targetTime: '8 Uhr' }).targetTime).toBe(DEFAULT_SETTINGS.targetTime)
  })

  test('moveTask swaps neighbours and ignores out-of-range moves', () => {
    const tasks = DEFAULT_SETTINGS.tasks.slice(0, 2)
    expect(moveTask(tasks, 0, 1).map((task) => task.id)).toEqual([tasks[1].id, tasks[0].id])
    expect(moveTask(tasks, 0, -1)).toBe(tasks)
  })
})
