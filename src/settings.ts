import { DEFAULT_TARGET_TIME, DEFAULT_WEEKDAYS, TASK_BY_ID, TASK_CATALOG, type TaskId } from './constants'

export interface TaskSetting {
  id: TaskId
  enabled: boolean
}

export interface Settings {
  targetTime: string
  weekdays: number[]
  tasks: TaskSetting[]
  soundOn: boolean
}

export interface DayProgress {
  day: string
  done: TaskId[]
  celebrated: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  targetTime: DEFAULT_TARGET_TIME,
  weekdays: DEFAULT_WEEKDAYS,
  tasks: TASK_CATALOG.map((task) => ({ id: task.id, enabled: task.enabledByDefault })),
  soundOn: true,
}

// Matches "HH:MM" as produced by <input type="time">.
const TIME_PATTERN = /^\d{2}:\d{2}$/

/** Stored data comes from an older app version or a hand-edited localStorage, so never trust its shape. */
export function normalizeSettings(raw: unknown): Settings {
  const stored = (raw ?? {}) as Partial<Settings>
  const storedTasks = Array.isArray(stored.tasks) ? stored.tasks.filter((task) => task?.id in TASK_BY_ID) : []
  const knownIds = new Set(storedTasks.map((task) => task.id))
  const newCatalogTasks = TASK_CATALOG.filter((task) => !knownIds.has(task.id)).map((task) => ({
    id: task.id,
    enabled: false,
  }))

  return {
    targetTime:
      typeof stored.targetTime === 'string' && TIME_PATTERN.test(stored.targetTime)
        ? stored.targetTime
        : DEFAULT_SETTINGS.targetTime,
    weekdays: Array.isArray(stored.weekdays) ? stored.weekdays.filter(Number.isInteger) : DEFAULT_SETTINGS.weekdays,
    tasks: storedTasks.length > 0 ? [...storedTasks, ...newCatalogTasks] : DEFAULT_SETTINGS.tasks,
    soundOn: typeof stored.soundOn === 'boolean' ? stored.soundOn : DEFAULT_SETTINGS.soundOn,
  }
}

export function normalizeProgress(raw: unknown): DayProgress {
  const stored = (raw ?? {}) as Partial<Record<keyof DayProgress, unknown>>
  const done = Array.isArray(stored.done) ? stored.done : []
  return {
    day: typeof stored.day === 'string' ? stored.day : '',
    done: done.filter((id): id is TaskId => typeof id === 'string' && id in TASK_BY_ID),
    celebrated: stored.celebrated === true,
  }
}

export function emptyProgress(day: string): DayProgress {
  return { day, done: [], celebrated: false }
}

export function moveTask(tasks: TaskSetting[], index: number, offset: -1 | 1): TaskSetting[] {
  const target = index + offset
  if (target < 0 || target >= tasks.length) return tasks
  const next = [...tasks]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}
