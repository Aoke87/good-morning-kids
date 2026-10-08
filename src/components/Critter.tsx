import type { CSSProperties, ReactNode } from 'react'
import { TEXT } from '../constants'

interface CritterProps {
  isAwake: boolean
  isDancing: boolean
  delayIndex: number
  children: ReactNode
}

function critterClassName(isAwake: boolean, isDancing: boolean): string {
  if (isDancing && isAwake) return 'critter is-awake is-dancing'
  return isAwake ? 'critter is-awake' : 'critter'
}

export function Critter({ isAwake, isDancing, delayIndex, children }: CritterProps) {
  return (
    <div className={critterClassName(isAwake, isDancing)} style={{ '--i': delayIndex } as CSSProperties}>
      {children}
      {!isAwake && (
        <span className="critter__zzz" aria-hidden="true">
          <b>{TEXT.SLEEP_GLYPH}</b>
          <b>{TEXT.SLEEP_GLYPH}</b>
          <b>{TEXT.SLEEP_GLYPH}</b>
        </span>
      )}
    </div>
  )
}
