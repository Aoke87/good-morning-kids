import type { ReactNode } from 'react'
import type { TaskId } from '../../constants'
import { INK, WHITE } from './palette'

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" className="task-icon" aria-hidden="true">
      {children}
    </svg>
  )
}

const DROP = 'M0-8C3-3 6 0 6 3A6 6 0 0 1-6 3C-6 0-3-3 0-8Z'

function AlarmClock() {
  return (
    <Frame>
      <path d="M17 54l-5 6M47 54l5 6" stroke="#E8573F" strokeWidth={4} strokeLinecap="round" />
      <circle cx="17" cy="14" r="8" fill="#E8573F" />
      <circle cx="47" cy="14" r="8" fill="#E8573F" />
      <circle cx="32" cy="36" r="22" fill="#E8573F" />
      <circle cx="32" cy="36" r="17" fill={WHITE} />
      <path d="M32 36V24M32 36l9 4" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <circle cx="32" cy="36" r="2.5" fill={INK} />
    </Frame>
  )
}

function Toilet() {
  return (
    <Frame>
      <rect x="12" y="6" width="22" height="26" rx="4" fill="#7FC8EF" />
      <rect x="17" y="10" width="10" height="4" rx="2" fill={WHITE} />
      <path d="M10 32h44q0 16-16 18l2 8H22l2-8Q10 46 10 32z" fill="#A9DCF7" />
      <rect x="7" y="28" width="50" height="7" rx="3.5" fill="#4C9ED9" />
    </Frame>
  )
}

function WashFace() {
  return (
    <Frame>
      <circle cx="32" cy="38" r="19" fill="#FFD7B0" />
      <path d="M22 36q3 3 6 0M36 36q3 3 6 0" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M25 45q7 6 14 0" stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d={DROP} fill="#4DB8F0" transform="translate(12 14)" />
      <path d={DROP} fill="#4DB8F0" transform="translate(32 10) scale(1.2)" />
      <path d={DROP} fill="#4DB8F0" transform="translate(52 16)" />
    </Frame>
  )
}

function Toothbrush() {
  return (
    <Frame>
      <g transform="rotate(-35 32 32)">
        <rect x="4" y="34" width="44" height="9" rx="4.5" fill="#4DB8F0" />
        <rect x="38" y="24" width="20" height="11" rx="2" fill={WHITE} stroke="#4DB8F0" strokeWidth={2} />
        <path d="M40 24q4-8 8-2 4-8 8 2z" fill="#8EE3C8" />
      </g>
    </Frame>
  )
}

function Shirt() {
  return (
    <Frame>
      <path d="M22 9L9 17 5 30l11 3v24h32V33l11-3-4-13L42 9q-10 8-20 0z" fill="#FF6FB5" />
      <path d="M32 33l2.5 5 5.5 1-4 4 1 5.5-5-2.7-5 2.7 1-5.5-4-4 5.5-1z" fill="#FFC93C" />
    </Frame>
  )
}

function Comb() {
  return (
    <Frame>
      <rect x="6" y="16" width="52" height="13" rx="6" fill="#9B7BF2" />
      {Array.from({ length: 9 }, (_, index) => (
        <rect key={index} x={10 + index * 5.3} y="26" width="3.2" height="20" rx="1.6" fill="#9B7BF2" />
      ))}
    </Frame>
  )
}

function Bowl() {
  return (
    <Frame>
      <path d="M44 28L56 8" stroke="#B7AFCF" strokeWidth={4.5} strokeLinecap="round" />
      <ellipse cx="32" cy="30" rx="25" ry="6" fill="#FFE2A8" />
      <circle cx="24" cy="29" r="3.5" fill="#E8433A" />
      <circle cx="34" cy="27.5" r="3.5" fill="#9B7BF2" />
      <circle cx="40" cy="31" r="3" fill="#E8433A" />
      <path d="M6 30h52q-2 25-26 25T6 30z" fill="#4DB8F0" />
      <path d="M14 38h36" stroke={WHITE} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
    </Frame>
  )
}

function Soap() {
  return (
    <Frame>
      <rect x="10" y="32" width="44" height="22" rx="9" fill="#FF9FC8" />
      <rect x="16" y="37" width="20" height="5" rx="2.5" fill={WHITE} opacity={0.7} />
      <circle cx="20" cy="22" r="6" fill={WHITE} stroke="#4DB8F0" strokeWidth={2.5} />
      <circle cx="35" cy="13" r="8" fill={WHITE} stroke="#4DB8F0" strokeWidth={2.5} />
      <circle cx="49" cy="23" r="5" fill={WHITE} stroke="#4DB8F0" strokeWidth={2.5} />
    </Frame>
  )
}

function Sneaker() {
  return (
    <Frame>
      <path d="M6 46l2-22q8-3 14 4l12 6q18 2 24 10v4z" fill="#E8573F" />
      <path d="M44 36q10 2 14 8v4H44z" fill="#FF8C6B" />
      <path d="M20 31l5-4M25 34l5-4M30 37l5-4" stroke={WHITE} strokeWidth={2.5} strokeLinecap="round" />
      <rect x="4" y="46" width="56" height="9" rx="4.5" fill="#4A3487" />
    </Frame>
  )
}

function Jacket() {
  return (
    <Frame>
      <path d="M20 7L8 15 5 57h13v2h28v-2h13l-3-42L44 7q-12 6-24 0z" fill="#FFC93C" />
      <path d="M18 22v35M46 22v35" stroke="#E0A800" strokeWidth={2.5} />
      <path d="M32 11v48" stroke={INK} strokeWidth={2.5} />
      <rect x="21" y="40" width="7" height="6" rx="2" fill="#E0A800" />
      <rect x="36" y="40" width="7" height="6" rx="2" fill="#E0A800" />
    </Frame>
  )
}

function Backpack() {
  return (
    <Frame>
      <path d="M24 14q8-12 16 0" stroke="#2E8B6A" strokeWidth={4} fill="none" />
      <rect x="11" y="12" width="42" height="47" rx="12" fill="#3DB37A" />
      <path d="M11 27q0-15 13-15h16q13 0 13 15v4H11z" fill="#2E8B6A" />
      <rect x="29" y="27" width="6" height="7" rx="1.5" fill="#FFC93C" />
      <rect x="19" y="39" width="26" height="14" rx="5" fill="#2E8B6A" />
    </Frame>
  )
}

function Bed() {
  return (
    <Frame>
      <rect x="5" y="14" width="9" height="42" rx="3" fill="#A0673A" />
      <rect x="50" y="30" width="9" height="26" rx="3" fill="#A0673A" />
      <ellipse cx="22" cy="31" rx="9" ry="5.5" fill={WHITE} stroke="#B7AFCF" strokeWidth={1.5} />
      <rect x="12" y="34" width="40" height="15" rx="4" fill="#9B7BF2" />
      <circle cx="30" cy="41" r="2" fill="#FFC93C" />
      <circle cx="42" cy="41" r="2" fill="#FFC93C" />
    </Frame>
  )
}

export const TASK_ICONS: Record<TaskId, () => ReactNode> = {
  wakeUp: AlarmClock,
  toilet: Toilet,
  washFace: WashFace,
  brushTeeth: Toothbrush,
  getDressed: Shirt,
  combHair: Comb,
  breakfast: Bowl,
  washHands: Soap,
  shoes: Sneaker,
  jacket: Jacket,
  backpack: Backpack,
  makeBed: Bed,
}
