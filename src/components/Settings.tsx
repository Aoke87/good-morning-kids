import type { ReactNode } from 'react'
import { TASK_BY_ID, TEXT, WEEKDAYS_IN_DISPLAY_ORDER, type TaskId } from '../constants'
import { moveTask, type Settings as SettingsData } from '../settings'

interface SettingsProps {
  settings: SettingsData
  icons: Record<TaskId, () => ReactNode>
  onChange: (settings: SettingsData) => void
  onResetToday: () => void
  onClose: () => void
}

function toggleWeekday(weekdays: number[], day: number): number[] {
  return weekdays.includes(day) ? weekdays.filter((value) => value !== day) : [...weekdays, day]
}

export function Settings({ settings, icons, onChange, onResetToday, onClose }: SettingsProps) {
  const update = (patch: Partial<SettingsData>) => onChange({ ...settings, ...patch })

  const toggleTask = (id: TaskId) =>
    update({ tasks: settings.tasks.map((task) => (task.id === id ? { ...task, enabled: !task.enabled } : task)) })

  return (
    <div className="settings-backdrop" onClick={onClose}>
      <section
        className="settings"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings__header">
          <h2 id="settings-title">{TEXT.SETTINGS_TITLE}</h2>
          <button type="button" className="settings__close" onClick={onClose}>
            {TEXT.SETTINGS_CLOSE}
          </button>
        </header>

        <div className="settings__body">
          <div className="settings__column">
            <label className="field">
              <span className="field__label">{TEXT.SETTINGS_TARGET_TIME}</span>
              <input
                type="time"
                className="field__time"
                value={settings.targetTime}
                onChange={(event) => event.target.value && update({ targetTime: event.target.value })}
              />
              <span className="field__hint">{TEXT.SETTINGS_TARGET_HINT}</span>
            </label>

            <fieldset className="field">
              <legend className="field__label">{TEXT.SETTINGS_WEEKDAYS}</legend>
              <div className="weekdays">
                {WEEKDAYS_IN_DISPLAY_ORDER.map(({ day, label }) => (
                  <button
                    key={day}
                    type="button"
                    className="chip"
                    aria-pressed={settings.weekdays.includes(day)}
                    onClick={() => update({ weekdays: toggleWeekday(settings.weekdays, day) })}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="switch">
              <input
                type="checkbox"
                checked={settings.soundOn}
                onChange={(event) => update({ soundOn: event.target.checked })}
              />
              <span className="switch__track" />
              <span>{TEXT.SETTINGS_SOUND}</span>
            </label>

            <button type="button" className="settings__reset" onClick={onResetToday}>
              {TEXT.SETTINGS_RESET_TODAY}
            </button>
          </div>

          <fieldset className="field settings__tasks">
            <legend className="field__label">{TEXT.SETTINGS_TASKS}</legend>
            <span className="field__hint">{TEXT.SETTINGS_TASKS_HINT}</span>
            <ol className="task-list">
              {settings.tasks.map((task, index) => {
                const Icon = icons[task.id]
                const label = TASK_BY_ID[task.id].label
                return (
                  <li key={task.id} className="task-row">
                    <button
                      type="button"
                      className="task-row__toggle"
                      aria-pressed={task.enabled}
                      onClick={() => toggleTask(task.id)}
                    >
                      <span className="task-row__icon">
                        <Icon />
                      </span>
                      {label}
                    </button>
                    <button
                      type="button"
                      className="task-row__move"
                      aria-label={`${label} ${TEXT.MOVE_UP}`}
                      disabled={index === 0}
                      onClick={() => update({ tasks: moveTask(settings.tasks, index, -1) })}
                    >
                      {TEXT.ARROW_UP}
                    </button>
                    <button
                      type="button"
                      className="task-row__move"
                      aria-label={`${label} ${TEXT.MOVE_DOWN}`}
                      disabled={index === settings.tasks.length - 1}
                      onClick={() => update({ tasks: moveTask(settings.tasks, index, 1) })}
                    >
                      {TEXT.ARROW_DOWN}
                    </button>
                  </li>
                )
              })}
            </ol>
          </fieldset>
        </div>
      </section>
    </div>
  )
}
