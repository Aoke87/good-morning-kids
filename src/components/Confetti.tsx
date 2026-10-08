import { useState, type CSSProperties } from 'react'

const CONFETTI = {
  COUNT: 90,
  COLORS: ['#FFC93C', '#FF6FB5', '#4DB8F0', '#3DB37A', '#9B7BF2', '#E8573F', '#FFFDF7'],
  SHAPES: ['square', 'circle', 'strip'],
  MAX_DELAY_S: 1.2,
  MIN_FALL_S: 2.6,
  FALL_RANGE_S: 2.4,
  MAX_DRIFT_VW: 16,
} as const

function makePieces() {
  return Array.from({ length: CONFETTI.COUNT }, (_, index) => ({
    id: index,
    className: `confetti__piece confetti__piece--${CONFETTI.SHAPES[index % CONFETTI.SHAPES.length]}`,
    style: {
      left: `${Math.random() * 100}%`,
      background: CONFETTI.COLORS[index % CONFETTI.COLORS.length],
      animationDelay: `${Math.random() * CONFETTI.MAX_DELAY_S}s`,
      animationDuration: `${CONFETTI.MIN_FALL_S + Math.random() * CONFETTI.FALL_RANGE_S}s`,
      '--drift': `${(Math.random() - 0.5) * 2 * CONFETTI.MAX_DRIFT_VW}vw`,
      '--spin': `${Math.random() > 0.5 ? 1 : -1}`,
    } as CSSProperties,
  }))
}

export function Confetti() {
  const [pieces] = useState(makePieces)
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span key={piece.id} className={piece.className} style={piece.style} />
      ))}
    </div>
  )
}
