export const TASK_CATALOG = [
  { id: 'wakeUp', label: 'Aufgestanden', speech: 'Aufgestanden! Der Hahn ist wach!', enabledByDefault: true },
  { id: 'toilet', label: 'Toilette', speech: 'Toilette! Der Frosch ist wach!', enabledByDefault: false },
  { id: 'washFace', label: 'Gesicht waschen', speech: 'Gesicht gewaschen! Die Ente ist wach!', enabledByDefault: false },
  { id: 'brushTeeth', label: 'Zähne putzen', speech: 'Zähne geputzt! Der Hase ist wach!', enabledByDefault: true },
  { id: 'getDressed', label: 'Anziehen', speech: 'Angezogen! Der Schmetterling ist wach!', enabledByDefault: true },
  { id: 'combHair', label: 'Haare kämmen', speech: 'Haare gekämmt! Der Igel ist wach!', enabledByDefault: false },
  { id: 'breakfast', label: 'Frühstücken', speech: 'Lecker gefrühstückt! Das Eichhörnchen ist wach!', enabledByDefault: true },
  { id: 'washHands', label: 'Hände waschen', speech: 'Hände gewaschen! Der Marienkäfer ist wach!', enabledByDefault: false },
  { id: 'shoes', label: 'Schuhe anziehen', speech: 'Schuhe an! Der Fuchs ist wach!', enabledByDefault: true },
  { id: 'jacket', label: 'Jacke anziehen', speech: 'Jacke an! Das Schaf ist wach!', enabledByDefault: false },
  { id: 'backpack', label: 'Rucksack nehmen', speech: 'Rucksack dabei! Die Schnecke ist wach!', enabledByDefault: false },
  { id: 'makeBed', label: 'Bett machen', speech: 'Bett gemacht! Die Maus ist wach!', enabledByDefault: false },
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
  SPEECH_DELAY_MS: 350,
  FANFARE_DELAY_MS: 900,
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

export const SPEECH = {
  LANG: 'de-DE',
  PITCH: 1.25,
  RATE: 0.95,
  WAKE_UP: 'Guten Morgen!',
  ALL_DONE: 'Super! Alles geschafft! Alle Tiere sind wach!',
  TIME_TO_GO: 'Los geht’s!',
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
