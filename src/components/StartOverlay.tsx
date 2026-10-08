import { useState } from 'react'
import { TEXT } from '../constants'
import { Sun } from '../themes/sunrise'

const WAKE_ANIMATION_MS = 1100

interface StartOverlayProps {
  onWake: () => void
  onDone: () => void
}

export function StartOverlay({ onWake, onDone }: StartOverlayProps) {
  const [isWaking, setIsWaking] = useState(false)

  const handleClick = () => {
    if (isWaking) return
    setIsWaking(true)
    onWake()
    window.setTimeout(onDone, WAKE_ANIMATION_MS)
  }

  return (
    <button
      type="button"
      className={`start${isWaking ? ' is-waking' : ''}`}
      aria-label={TEXT.START_LABEL}
      onClick={handleClick}
    >
      <span className="start__sun">
        <Sun isAwake={isWaking} isBeaming={isWaking} />
      </span>
      <span className="start__hint">{TEXT.START_HINT}</span>
    </button>
  )
}
