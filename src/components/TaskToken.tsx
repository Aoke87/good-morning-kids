import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { TEXT, TIMING } from '../constants'

const BURST_RAYS = 10

interface TaskTokenProps {
  label: string
  icon: ReactNode
  isDone: boolean
  isNext: boolean
  onComplete: () => void
  onUndo: () => void
  onNudge: () => void
}

function tokenClassName(isDone: boolean, isNext: boolean, isHolding: boolean, isWiggling: boolean): string {
  return [
    'token',
    isDone && 'is-done',
    isNext && !isDone && 'is-next',
    isHolding && 'is-holding',
    isWiggling && 'is-wiggling',
  ]
    .filter(Boolean)
    .join(' ')
}

export function TaskToken({ label, icon, isDone, isNext, onComplete, onUndo, onNudge }: TaskTokenProps) {
  const [isHolding, setIsHolding] = useState(false)
  const [isWiggling, setIsWiggling] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const holdTimer = useRef<number | undefined>(undefined)
  const didLongPress = useRef(false)

  const cancelHold = () => {
    window.clearTimeout(holdTimer.current)
    setIsHolding(false)
  }

  const handlePointerDown = () => {
    if (!isDone) return
    didLongPress.current = false
    setIsHolding(true)
    holdTimer.current = window.setTimeout(() => {
      didLongPress.current = true
      setIsHolding(false)
      onUndo()
    }, TIMING.LONG_PRESS_MS)
  }

  const handleClick = () => {
    if (didLongPress.current) {
      didLongPress.current = false
      return
    }
    if (isDone) {
      setIsWiggling(true)
      onNudge()
      return
    }
    setBurstKey((key) => key + 1)
    onComplete()
  }

  return (
    <button
      type="button"
      className={tokenClassName(isDone, isNext, isHolding, isWiggling)}
      style={{ '--long-press': `${TIMING.LONG_PRESS_MS}ms` } as CSSProperties}
      aria-label={label}
      aria-pressed={isDone}
      title={isDone ? TEXT.UNDO_HINT : label}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onContextMenu={(event) => event.preventDefault()}
      onAnimationEnd={(event) => event.animationName === 'token-wiggle' && setIsWiggling(false)}
    >
      <span className="token__ring" />
      <span className="token__face">{icon}</span>
      <span className="token__check" />
      {burstKey > 0 && (
        <span key={burstKey} className="token__burst">
          {Array.from({ length: BURST_RAYS }, (_, index) => (
            <i key={index} style={{ rotate: `${(360 / BURST_RAYS) * index}deg` }} />
          ))}
        </span>
      )}
    </button>
  )
}
