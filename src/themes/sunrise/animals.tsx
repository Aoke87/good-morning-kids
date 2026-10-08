import type { ReactNode } from 'react'
import type { TaskId } from '../../constants'
import { CHEEK, INK, PAPER, WHITE } from './palette'

interface AnimalProps {
  awake: boolean
}

interface EyeProps {
  x: number
  y: number
  awake: boolean
  r?: number
  color?: string
}

function Eye({ x, y, awake, r = 4, color = INK }: EyeProps) {
  if (!awake) {
    return <path d={`M${x - r} ${y} q${r} ${r} ${r * 2} 0`} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
  }
  return (
    <g className="eye-open">
      <circle cx={x} cy={y} r={r} fill={color} />
      <circle cx={x + r * 0.35} cy={y - r * 0.4} r={r * 0.38} fill={color === INK ? WHITE : INK} />
    </g>
  )
}

function Cheek({ x, y, r = 4 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={CHEEK} opacity={0.65} />
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" className="animal__svg" aria-hidden="true">
      {children}
    </svg>
  )
}

function Rooster({ awake }: AnimalProps) {
  return (
    <Frame>
      <path d="M40 82C16 72 10 42 22 30c4 18 12 26 22 32z" fill="#2E8B6A" />
      <path d="M42 78C22 60 28 32 42 26c-2 18 4 30 12 36z" fill="#E8573F" />
      <path d="M46 76C36 54 46 34 58 32c-6 16-2 28 4 34z" fill="#F2A541" />
      <path d="M54 98l-2 16M68 98l2 16" stroke="#F2A541" strokeWidth={4} strokeLinecap="round" />
      <ellipse cx="62" cy="82" rx="28" ry="22" fill={PAPER} />
      <ellipse cx="56" cy="84" rx="15" ry="10" fill="#EEDDBE" />
      <circle cx="80" cy="54" r="15" fill={PAPER} />
      <path d="M70 42q2-12 8-6 4-10 9-2 6-6 6 6z" fill="#E8573F" />
      <path d="M94 50l12 4-12 5z" fill="#F2A541" />
      <ellipse cx="92" cy="64" rx="4" ry="6" fill="#E8573F" />
      <Eye x={84} y={51} awake={awake} />
      <Cheek x={78} y={60} r={3.5} />
    </Frame>
  )
}

function Frog({ awake }: AnimalProps) {
  return (
    <Frame>
      <ellipse cx="60" cy="110" rx="46" ry="8" fill="#2E8B57" />
      <ellipse cx="30" cy="106" rx="11" ry="5" fill="#58AE3A" />
      <ellipse cx="90" cy="106" rx="11" ry="5" fill="#58AE3A" />
      <ellipse cx="60" cy="88" rx="36" ry="22" fill="#6CC24A" />
      <ellipse cx="60" cy="95" rx="22" ry="12" fill="#B5E37A" />
      <circle cx="42" cy="64" r="13" fill="#6CC24A" />
      <circle cx="78" cy="64" r="13" fill="#6CC24A" />
      {awake && <circle cx="42" cy="64" r="9" fill={WHITE} />}
      {awake && <circle cx="78" cy="64" r="9" fill={WHITE} />}
      <Eye x={42} y={65} awake={awake} r={5} />
      <Eye x={78} y={65} awake={awake} r={5} />
      <path d="M46 82q14 10 28 0" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      <Cheek x={36} y={80} r={5} />
      <Cheek x={84} y={80} r={5} />
    </Frame>
  )
}

function Duck({ awake }: AnimalProps) {
  return (
    <Frame>
      <ellipse cx="60" cy="110" rx="48" ry="7" fill="#7FD3F7" />
      <path d="M30 88q-14-18-8-24 10 14 18 16z" fill="#FFD23F" />
      <ellipse cx="58" cy="90" rx="32" ry="20" fill="#FFD23F" />
      <path d="M42 86q16-14 32 2-16 12-32-2z" fill="#F2B400" />
      <ellipse cx="76" cy="72" rx="10" ry="10" fill="#FFD23F" />
      <circle cx="80" cy="56" r="17" fill="#FFD23F" />
      <path d="M94 58q14-2 14 4-4 6-14 4z" fill="#FF8C42" />
      <Eye x={85} y={52} awake={awake} />
      <Cheek x={80} y={63} />
    </Frame>
  )
}

function Rabbit({ awake }: AnimalProps) {
  return (
    <Frame>
      <circle cx="36" cy="98" r="9" fill={WHITE} />
      <ellipse cx="60" cy="94" rx="26" ry="20" fill="#F3E6D3" />
      <ellipse cx="46" cy="112" rx="10" ry="5" fill="#E6D3B8" />
      <ellipse cx="74" cy="112" rx="10" ry="5" fill="#E6D3B8" />
      <g transform="rotate(-8 49 30)">
        <ellipse cx="49" cy="30" rx="7.5" ry="20" fill="#F3E6D3" />
        <ellipse cx="49" cy="32" rx="3.5" ry="14" fill="#FFB3C1" />
      </g>
      <g transform="rotate(8 71 30)">
        <ellipse cx="71" cy="30" rx="7.5" ry="20" fill="#F3E6D3" />
        <ellipse cx="71" cy="32" rx="3.5" ry="14" fill="#FFB3C1" />
      </g>
      <circle cx="60" cy="60" r="21" fill="#F3E6D3" />
      <Eye x={52} y={57} awake={awake} />
      <Eye x={68} y={57} awake={awake} />
      <path d="M57 64h6l-3 3.5z" fill="#FF8FA3" />
      <rect x="56.5" y="70" width="7" height="7" rx="1.5" fill={WHITE} stroke={INK} strokeWidth={1.2} />
      <path d="M60 70v7" stroke={INK} strokeWidth={1.2} />
      <Cheek x={46} y={66} />
      <Cheek x={74} y={66} />
    </Frame>
  )
}

function Butterfly({ awake }: AnimalProps) {
  return (
    <Frame>
      <path d="M60 118q-3-12 0-20" stroke="#3D9A4E" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M60 112q10-8 16-4-6 8-16 4z" fill="#4FAE5B" />
      {[0, 72, 144, 216, 288].map((angle) => (
        <circle key={angle} cx="60" cy="88" r="7" fill={WHITE} transform={`rotate(${angle} 60 96)`} />
      ))}
      <circle cx="60" cy="96" r="5" fill="#FFC93C" />
      <g className="animal__wings">
        <ellipse cx="40" cy="48" rx="20" ry="16" fill="#FF6FB5" transform="rotate(-25 40 48)" />
        <ellipse cx="80" cy="48" rx="20" ry="16" fill="#FF6FB5" transform="rotate(25 80 48)" />
        <ellipse cx="44" cy="72" rx="13" ry="11" fill="#9B7BF2" />
        <ellipse cx="76" cy="72" rx="13" ry="11" fill="#9B7BF2" />
        <circle cx="36" cy="46" r="5" fill="#FFC93C" />
        <circle cx="84" cy="46" r="5" fill="#FFC93C" />
        <circle cx="44" cy="74" r="3.5" fill={WHITE} />
        <circle cx="76" cy="74" r="3.5" fill={WHITE} />
      </g>
      <rect x="56" y="44" width="8" height="40" rx="4" fill="#4A3487" />
      <path d="M57 33q-6-13-13-11M63 33q6-13 13-11" stroke="#4A3487" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <circle cx="44" cy="22" r="3" fill="#4A3487" />
      <circle cx="76" cy="22" r="3" fill="#4A3487" />
      <circle cx="60" cy="40" r="9" fill="#4A3487" />
      <Eye x={56.5} y={39} awake={awake} r={2.4} color={WHITE} />
      <Eye x={63.5} y={39} awake={awake} r={2.4} color={WHITE} />
    </Frame>
  )
}

function Hedgehog({ awake }: AnimalProps) {
  return (
    <Frame>
      <ellipse cx="40" cy="108" rx="8" ry="4" fill="#6E4A2E" />
      <ellipse cx="72" cy="108" rx="8" ry="4" fill="#6E4A2E" />
      <path
        d="M16 104l-4-12 10-4-6-12 12-2-2-14 12 2 2-14 10 8 6-14 8 12 8-10 4 14 10-6v14h10l-4 14 8 4-8 10 6 10z"
        fill="#8B5E3C"
      />
      <circle cx="44" cy="62" r="7" fill="#E8433A" />
      <path d="M44 55q3-6 8-5-2 5-8 5z" fill="#4FAE5B" />
      <path d="M80 104q-2-28 14-28 10 4 20 20-2 8-16 10z" fill="#F3D3A8" />
      <circle cx="114" cy="95" r="4" fill={INK} />
      <Eye x={96} y={86} awake={awake} />
      <Cheek x={100} y={96} />
    </Frame>
  )
}

function Squirrel({ awake }: AnimalProps) {
  return (
    <Frame>
      <path d="M48 108C8 104 4 50 30 34c20-12 36 6 24 20-8 8-18 12-14 26 2 10 10 16 16 20z" fill="#D96F28" />
      <ellipse cx="68" cy="90" rx="20" ry="22" fill="#E8833A" />
      <ellipse cx="72" cy="94" rx="11" ry="15" fill="#FFE2C2" />
      <ellipse cx="60" cy="112" rx="9" ry="4" fill="#D96F28" />
      <ellipse cx="80" cy="112" rx="9" ry="4" fill="#D96F28" />
      <path d="M62 46V28l10 14zM80 42l8-16 2 20z" fill="#E8833A" />
      <circle cx="74" cy="56" r="16" fill="#E8833A" />
      <ellipse cx="80" cy="86" rx="7" ry="8" fill="#A0673A" />
      <path d="M72 82q8-11 16 0z" fill="#6E4A2E" />
      <circle cx="74" cy="88" r="4" fill="#D96F28" />
      <circle cx="86" cy="88" r="4" fill="#D96F28" />
      <circle cx="89" cy="58" r="2.5" fill={INK} />
      <Eye x={79} y={53} awake={awake} />
      <Cheek x={81} y={63} />
    </Frame>
  )
}

function Ladybug({ awake }: AnimalProps) {
  return (
    <Frame>
      <path d="M6 112q54-30 108-4-54 16-108 4z" fill="#4FAE5B" />
      <path d="M20 110q40-10 84-3" stroke="#3D9A4E" strokeWidth={2} fill="none" />
      <path d="M36 104l-6 6M58 104v8M80 104l6 6" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <path d="M18 104a40 40 0 0 1 80 0z" fill="#E8433A" />
      {[
        [38, 86, 6],
        [54, 74, 5],
        [72, 80, 6],
        [86, 94, 4.5],
        [50, 96, 4.5],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={INK} />
      ))}
      <path d="M106 82q6-12 12-10" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <circle cx="118" cy="72" r="2.5" fill={INK} />
      <circle cx="102" cy="94" r="14" fill={INK} />
      <Eye x={106} y={91} awake={awake} r={3} color={WHITE} />
      <Cheek x={108} y={100} r={3} />
    </Frame>
  )
}

function Fox({ awake }: AnimalProps) {
  return (
    <Frame>
      <ellipse cx="92" cy="98" rx="26" ry="11" fill="#F07B2B" transform="rotate(-30 92 98)" />
      <ellipse cx="110" cy="86" rx="9" ry="7" fill={WHITE} transform="rotate(-30 110 86)" />
      <path d="M40 114q-4-38 20-42 24 4 20 42z" fill="#F07B2B" />
      <path d="M50 114q0-28 10-32 10 4 10 32z" fill={WHITE} />
      <ellipse cx="50" cy="114" rx="8" ry="4" fill="#5A3A2A" />
      <ellipse cx="70" cy="114" rx="8" ry="4" fill="#5A3A2A" />
      <path d="M38 52l2-30 14 16q6-2 12 0l14-16 2 30q-2 18-22 22-20-4-22-22z" fill="#F07B2B" />
      <path d="M43 30l1 10 6-3zM77 30l-1 10-6-3z" fill="#5A3A2A" />
      <path d="M44 56q16-4 32 0-4 16-16 18-12-2-16-18z" fill={WHITE} />
      <ellipse cx="60" cy="63" rx="4" ry="3" fill={INK} />
      <Eye x={51} y={50} awake={awake} />
      <Eye x={69} y={50} awake={awake} />
      <Cheek x={45} y={60} r={3} />
      <Cheek x={75} y={60} r={3} />
    </Frame>
  )
}

const WOOL_PUFFS = [
  [38, 84, 14],
  [50, 72, 16],
  [68, 70, 16],
  [84, 80, 14],
  [86, 94, 13],
  [70, 100, 14],
  [50, 100, 14],
  [36, 96, 12],
] as const

function Sheep({ awake }: AnimalProps) {
  return (
    <Frame>
      <path d="M46 98v16M58 100v14M70 100v14M80 98v16" stroke="#3A3550" strokeWidth={6} strokeLinecap="round" />
      {WOOL_PUFFS.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={WHITE} />
      ))}
      <ellipse cx="60" cy="86" rx="28" ry="18" fill={WHITE} />
      <ellipse cx="80" cy="60" rx="8" ry="4" fill="#3A3550" transform="rotate(-30 80 60)" />
      <ellipse cx="105" cy="60" rx="8" ry="4" fill="#3A3550" transform="rotate(30 105 60)" />
      <ellipse cx="92" cy="70" rx="12" ry="15" fill="#3A3550" />
      <circle cx="87" cy="56" r="6" fill={WHITE} />
      <circle cx="95" cy="54" r="6" fill={WHITE} />
      <Eye x={88} y={70} awake={awake} r={2.6} color={WHITE} />
      <Eye x={97} y={70} awake={awake} r={2.6} color={WHITE} />
      <path d="M89 79q3 3 6 0" stroke={WHITE} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <Cheek x={85} y={77} r={2.5} />
      <Cheek x={100} y={77} r={2.5} />
    </Frame>
  )
}

function Snail({ awake }: AnimalProps) {
  return (
    <Frame>
      <path d="M98 60l-6-20M104 60l6-20" stroke="#C9E07A" strokeWidth={4} strokeLinecap="round" />
      <path d="M14 110q0-10 16-10h56q8-2 8-16V66q0-8 7-8t7 8v30q0 16-16 16H22q-8 0-8-2z" fill="#C9E07A" />
      <circle cx="92" cy="40" r="6" fill="#C9E07A" />
      <circle cx="110" cy="40" r="6" fill="#C9E07A" />
      <Eye x={92} y={40} awake={awake} r={3} />
      <Eye x={110} y={40} awake={awake} r={3} />
      <path d="M98 76q4 4 8 0" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Cheek x={104} y={84} r={3} />
      <circle cx="54" cy="74" r="28" fill="#F29E4C" />
      <path
        d="M50 74a4 4 0 1 1 8 0a9 9 0 1 1-18 0a14 14 0 1 1 28 0a19 19 0 1 1-38 0"
        stroke="#C9672A"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
    </Frame>
  )
}

function Mouse({ awake }: AnimalProps) {
  return (
    <Frame>
      <path d="M38 104c-24 4-28-14-16-20 8-4 8-14 0-16" stroke="#B7AFCF" strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="96" rx="24" ry="18" fill="#B7AFCF" />
      <ellipse cx="60" cy="100" rx="13" ry="10" fill="#E4DDF2" />
      <ellipse cx="50" cy="113" rx="8" ry="4" fill="#FFB3C1" />
      <ellipse cx="70" cy="113" rx="8" ry="4" fill="#FFB3C1" />
      <circle cx="44" cy="46" r="13" fill="#B7AFCF" />
      <circle cx="76" cy="46" r="13" fill="#B7AFCF" />
      <circle cx="44" cy="46" r="8" fill="#FFB3C1" />
      <circle cx="76" cy="46" r="8" fill="#FFB3C1" />
      <circle cx="60" cy="66" r="19" fill="#B7AFCF" />
      <Eye x={53} y={63} awake={awake} />
      <Eye x={67} y={63} awake={awake} />
      <circle cx="60" cy="72" r="3.5" fill="#FF8FA3" />
      <path d="M48 74l-14-3M48 77l-14 2M72 74l14-3M72 77l14 2" stroke={INK} strokeWidth={1.2} opacity={0.6} />
      <Cheek x={47} y={70} />
      <Cheek x={73} y={70} />
    </Frame>
  )
}

export const ANIMALS: Record<TaskId, (props: AnimalProps) => ReactNode> = {
  wakeUp: Rooster,
  toilet: Frog,
  washFace: Duck,
  brushTeeth: Rabbit,
  getDressed: Butterfly,
  combHair: Hedgehog,
  breakfast: Squirrel,
  washHands: Ladybug,
  shoes: Fox,
  jacket: Sheep,
  backpack: Snail,
  makeBed: Mouse,
}
