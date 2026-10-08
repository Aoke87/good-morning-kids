export const TASK_CATALOG = [
  { id: 'wakeUp', label: 'Aufgestanden', enabledByDefault: true },
  { id: 'toilet', label: 'Toilette', enabledByDefault: false },
  { id: 'washFace', label: 'Gesicht waschen', enabledByDefault: false },
  { id: 'brushTeeth', label: 'Zähne putzen', enabledByDefault: true },
  { id: 'getDressed', label: 'Anziehen', enabledByDefault: true },
  { id: 'combHair', label: 'Haare kämmen', enabledByDefault: false },
  { id: 'breakfast', label: 'Frühstücken', enabledByDefault: true },
  { id: 'washHands', label: 'Hände waschen', enabledByDefault: false },
  { id: 'shoes', label: 'Schuhe anziehen', enabledByDefault: true },
  { id: 'jacket', label: 'Jacke anziehen', enabledByDefault: false },
  { id: 'backpack', label: 'Rucksack nehmen', enabledByDefault: false },
  { id: 'makeBed', label: 'Bett machen', enabledByDefault: false },
] as const

export type TaskId = (typeof TASK_CATALOG)[number]['id']
export type Task = (typeof TASK_CATALOG)[number]

export const TASK_BY_ID = Object.fromEntries(TASK_CATALOG.map((task) => [task.id, task])) as Record<TaskId, Task>

export const TIMING = {
  WINDOW_MINUTES: 60,
  WARNING_MINUTES: 10,
  TICK_MS: 1000,
  LONG_PRESS_MS: 700,
  CELEBRATION_MS: 7000,
  ANIMAL_CALL_DELAY_MS: 350,
  // Waits for the longest animal call (rooster) to finish so the two don't clash.
  FANFARE_DELAY_MS: 1700,
} as const

export const DEFAULT_TARGET_TIME = '08:30'
// JS Date#getDay numbering: 0 = Sunday.
export const DEFAULT_WEEKDAYS = [1, 2, 3, 4, 5]

export const WEEKDAYS_IN_DISPLAY_ORDER = [
  { day: 1, label: 'Mo' },
  { day: 2, label: 'Di' },
  { day: 3, label: 'Mi' },
  { day: 4, label: 'Do' },
  { day: 5, label: 'Fr' },
  { day: 6, label: 'Sa' },
  { day: 0, label: 'So' },
] as const

export const STORAGE_KEYS = {
  SETTINGS: 'guten-morgen:settings',
  PROGRESS: 'guten-morgen:progress',
} as const

export const TEXT = {
  START_HINT: 'Tippen, um die Sonne zu wecken',
  START_LABEL: 'Sonne wecken',
  SETTINGS_OPEN: 'Einstellungen öffnen',
  SETTINGS_TITLE: 'Für die Eltern',
  SETTINGS_TARGET_TIME: 'Wann müsst ihr aus dem Haus?',
  SETTINGS_TARGET_HINT: 'Der Sonnenweg startet eine Stunde vorher.',
  SETTINGS_WEEKDAYS: 'An welchen Tagen?',
  SETTINGS_TASKS: 'Aufgaben',
  SETTINGS_TASKS_HINT: 'Antippen zum An- und Ausschalten. Mit den Pfeilen sortieren.',
  SETTINGS_SOUND: 'Töne, Vogelstimmen und Sprache',
  SETTINGS_RESET_TODAY: 'Heute nochmal von vorn',
  SETTINGS_CLOSE: 'Fertig',
  MOVE_UP: 'nach oben',
  MOVE_DOWN: 'nach unten',
  ARROW_UP: '▲',
  ARROW_DOWN: '▼',
  UNDO_HINT: 'Lange drücken zum Zurücknehmen',
  SLEEP_GLYPH: 'z',
} as const
