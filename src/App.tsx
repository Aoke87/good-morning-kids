import { useEffect, useRef, useState } from 'react'
import { SPEECH, STORAGE_KEYS, TASK_BY_ID, TEXT, TIMING, type TaskId } from './constants'
import { DEFAULT_SETTINGS, emptyProgress, normalizeProgress, normalizeSettings, type DayProgress } from './settings'
import { dayKey, getMorningState, type MorningState } from './time'
import { useNow, useStoredState } from './hooks'
import { enterFullscreen, keepScreenOn } from './device'
import * as sound from './sound'
import { ANIMALS, Scene, TASK_ICONS } from './themes/sunrise'
import { TaskToken } from './components/TaskToken'
import { Critter } from './components/Critter'
import { Confetti } from './components/Confetti'
import { Settings } from './components/Settings'
import { StartOverlay } from './components/StartOverlay'

const AMBIENCE = { NIGHT: 0.08, DAWN: 0.25, IDLE: 0.45 } as const
const WAKE_SPEECH_DELAY_MS = 700

const clockFormat = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' })

function ambienceLevel({ phase, progress }: MorningState): number {
  if (phase === 'night') return AMBIENCE.NIGHT
  if (phase === 'morning') return AMBIENCE.DAWN + (1 - AMBIENCE.DAWN) * progress
  return AMBIENCE.IDLE
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3.2h-4l-.4 2.7a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1l.4 2.7h4l.4-2.7a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
    </svg>
  )
}

export function App() {
  const now = useNow(TIMING.TICK_MS)
  const today = dayKey(now)
  const [settings, setSettings] = useStoredState(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS, normalizeSettings)
  const [storedProgress, setStoredProgress] = useStoredState<DayProgress>(
    STORAGE_KEYS.PROGRESS,
    emptyProgress(today),
    normalizeProgress,
  )
  const [isStarted, setIsStarted] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)

  const progress = storedProgress.day === today ? storedProgress : emptyProgress(today)
  const morning = getMorningState(now, settings.targetTime, settings.weekdays)
  const tasks = settings.tasks.filter((task) => task.enabled).map((task) => TASK_BY_ID[task.id])
  const nextTaskId = tasks.find((task) => !progress.done.includes(task.id))?.id
  const isAllDone = tasks.length > 0 && nextTaskId === undefined
  const isOffDay = morning.phase === 'off'
  const ambience = isStarted && settings.soundOn ? ambienceLevel(morning) : 0

  const slots = tasks.map((task, index) => ({
    task,
    index,
    isDone: progress.done.includes(task.id),
    isAwake: isOffDay || progress.done.includes(task.id),
    Animal: ANIMALS[task.id],
    Icon: TASK_ICONS[task.id],
  }))

  useEffect(() => sound.setSoundEnabled(settings.soundOn), [settings.soundOn])
  useEffect(() => sound.setAmbience(ambience), [ambience])

  const previousPhase = useRef(morning.phase)
  useEffect(() => {
    if (previousPhase.current === 'morning' && morning.phase === 'leave') {
      sound.playDoorbell()
      sound.speak(SPEECH.TIME_TO_GO)
    }
    previousPhase.current = morning.phase
  }, [morning.phase])

  useEffect(() => {
    if (!isCelebrating) return
    const id = window.setTimeout(() => setIsCelebrating(false), TIMING.CELEBRATION_MS)
    return () => window.clearTimeout(id)
  }, [isCelebrating])

  const saveProgress = (done: TaskId[], celebrated = progress.celebrated) =>
    setStoredProgress({ day: today, done, celebrated })

  const completeTask = (id: TaskId) => {
    const done = [...progress.done, id]
    const finishesAll = tasks.every((task) => done.includes(task.id))
    sound.playCheck(progress.done.length)

    if (finishesAll && !progress.celebrated) {
      saveProgress(done, true)
      setIsCelebrating(true)
      window.setTimeout(() => {
        sound.playFanfare()
        sound.speak(SPEECH.ALL_DONE)
      }, TIMING.FANFARE_DELAY_MS)
      return
    }
    saveProgress(done)
    window.setTimeout(() => sound.speak(TASK_BY_ID[id].speech), TIMING.SPEECH_DELAY_MS)
  }

  const undoTask = (id: TaskId) => {
    sound.playUndo()
    saveProgress(progress.done.filter((doneId) => doneId !== id))
  }

  const wakeUp = () => {
    sound.unlockAudio()
    enterFullscreen()
    keepScreenOn()
    sound.playWake()
    window.setTimeout(() => sound.speak(SPEECH.WAKE_UP), WAKE_SPEECH_DELAY_MS)
  }

  return (
    <main className="app">
      <Scene
        phase={morning.phase}
        progress={morning.progress}
        isWarning={morning.isWarning}
        isDoorOpen={isAllDone || morning.phase === 'leave'}
        isCelebrating={isCelebrating}
      />

      <div className="meadow">
        {slots.map(({ task, index, isDone, isAwake, Animal, Icon }) => (
          <div key={task.id} className="meadow__slot">
            <Critter isAwake={isAwake} isDancing={isCelebrating} delayIndex={index}>
              <Animal awake={isAwake} />
            </Critter>
            {!isOffDay && (
              <TaskToken
                label={task.label}
                icon={<Icon />}
                isDone={isDone}
                isNext={task.id === nextTaskId}
                onComplete={() => completeTask(task.id)}
                onUndo={() => undoTask(task.id)}
                onNudge={sound.playBoop}
              />
            )}
          </div>
        ))}
      </div>

      <div className="parent-corner">
        <button type="button" className="gear" aria-label={TEXT.SETTINGS_OPEN} onClick={() => setIsSettingsOpen(true)}>
          <GearIcon />
        </button>
        <span className="clock">{clockFormat.format(now)}</span>
      </div>

      {isCelebrating && <Confetti />}

      {isSettingsOpen && (
        <Settings
          settings={settings}
          icons={TASK_ICONS}
          onChange={setSettings}
          onResetToday={() => setStoredProgress(emptyProgress(today))}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {!isStarted && <StartOverlay onWake={wakeUp} onDone={() => setIsStarted(true)} />}
    </main>
  )
}
