import type { CSSProperties } from 'react'
import type { Phase } from '../../time'
import { CHEEK, INK, lightLevel, skyGradient, starOpacity } from './palette'

/** All positions in percent of the viewport so the sun, trail and house stay aligned on any aspect ratio. */
export const SUN_PATH = {
  START_X: 7,
  END_X: 88,
  HORIZON_Y: 61,
  END_Y: 18,
  TRAIL_STEPS: 12,
} as const

const STARS = [
  [8, 8, 1], [16, 22, 0.7], [24, 6, 0.8], [31, 17, 1.1], [39, 9, 0.6], [46, 24, 0.9], [53, 5, 1],
  [60, 15, 0.7], [67, 26, 0.8], [72, 7, 1.2], [79, 19, 0.6], [86, 5, 0.9], [93, 14, 0.7], [12, 34, 0.6],
  [35, 32, 0.7], [58, 33, 0.6], [81, 31, 0.8], [96, 28, 0.6],
] as const

interface Point {
  x: number
  y: number
}

export function sunPoint(progress: number): Point {
  return {
    x: SUN_PATH.START_X + (SUN_PATH.END_X - SUN_PATH.START_X) * progress,
    y: SUN_PATH.HORIZON_Y - (SUN_PATH.HORIZON_Y - SUN_PATH.END_Y) * Math.sin((progress * Math.PI) / 2),
  }
}

const at = ({ x, y }: Point): CSSProperties => ({ left: `${x}%`, top: `${y}%` })

interface SunProps {
  isAwake: boolean
  isWarning?: boolean
  isBeaming?: boolean
}

export function Sun({ isAwake, isWarning = false, isBeaming = false }: SunProps) {
  const mouth = isBeaming ? 'M-14 12q14 16 28 0z' : 'M-11 12q11 9 22 0'
  return (
    <svg viewBox="-60 -60 120 120" className={`sun${isWarning ? ' is-warning' : ''}`} aria-hidden="true">
      <g className="sun__rays">
        {Array.from({ length: 12 }, (_, index) => (
          <path key={index} d="M-7-40L0-56 7-40z" fill="#FFB627" transform={`rotate(${index * 30})`} />
        ))}
      </g>
      <circle r="38" fill="#FFC93C" />
      <circle r="31" fill="#FFD95A" />
      {isAwake ? (
        <>
          <circle cx="-12" cy="-4" r="4.5" fill={INK} />
          <circle cx="12" cy="-4" r="4.5" fill={INK} />
          <circle cx="-10.5" cy="-5.5" r="1.6" fill="#fff" />
          <circle cx="13.5" cy="-5.5" r="1.6" fill="#fff" />
        </>
      ) : (
        <path d="M-17-3q5 5 10 0M7-3q5 5 10 0" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      )}
      <circle cx="-21" cy="7" r="5.5" fill={CHEEK} opacity={0.6} />
      <circle cx="21" cy="7" r="5.5" fill={CHEEK} opacity={0.6} />
      <path d={mouth} stroke={INK} strokeWidth={2.6} fill={isBeaming ? INK : 'none'} strokeLinecap="round" />
    </svg>
  )
}

function Moon() {
  return (
    <svg viewBox="0 0 100 100" className="moon" aria-hidden="true">
      <path d="M62 8a42 42 0 1 0 30 62A34 34 0 0 1 62 8z" fill="#FFF1B8" />
      <path d="M30 52q5 5 10 0" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M34 64q6 4 12 0" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <circle cx="26" cy="60" r="4" fill={CHEEK} opacity={0.5} />
    </svg>
  )
}

function Cloud({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 200 90" className={`cloud ${className}`} aria-hidden="true">
      <path d="M30 80a26 26 0 0 1 4-52 36 36 0 0 1 66-12 30 30 0 0 1 52 14 25 25 0 0 1 18 50z" fill="#FFFDF7" />
    </svg>
  )
}

function Trail({ progress }: { progress: number }) {
  return (
    <>
      {Array.from({ length: SUN_PATH.TRAIL_STEPS }, (_, index) => {
        const step = index / SUN_PATH.TRAIL_STEPS
        return (
          <span
            key={index}
            className={`trail-dot${step <= progress ? ' is-passed' : ''}`}
            style={at(sunPoint(step))}
          />
        )
      })}
      <span className="trail-goal" style={at(sunPoint(1))} />
    </>
  )
}

function Hills() {
  return (
    <>
      <svg viewBox="0 0 1600 500" preserveAspectRatio="xMidYMax slice" className="land land--back" aria-hidden="true">
        <path d="M0 150C220 70 420 80 640 140S1080 60 1300 110s250 10 300 0V500H0z" fill="#93D27E" />
        {[
          [180, 118],
          [260, 104],
          [880, 112],
          [1180, 104],
        ].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y})`}>
            <rect x="-6" y="-10" width="12" height="40" fill="#5E8C4A" />
            <circle cy="-40" r="34" fill="#6DB866" />
            <circle cx="-18" cy="-18" r="22" fill="#6DB866" />
            <circle cx="18" cy="-20" r="24" fill="#6DB866" />
          </g>
        ))}
      </svg>
      <svg viewBox="0 0 1600 500" preserveAspectRatio="xMidYMax slice" className="land land--mid" aria-hidden="true">
        <path d="M0 260C300 190 600 230 900 250S1400 190 1600 200V500H0z" fill="#62BF63" />
      </svg>
    </>
  )
}

function Meadow() {
  return (
    <svg viewBox="0 0 1600 300" preserveAspectRatio="none" className="land land--front" aria-hidden="true">
      <path d="M0 60C400 20 800 40 1200 30S1500 10 1600 20V300H0z" fill="#4BAA57" />
    </svg>
  )
}

function House({ isDoorOpen }: { isDoorOpen: boolean }) {
  return (
    <svg viewBox="0 0 200 230" className={`house${isDoorOpen ? ' is-open' : ''}`} aria-hidden="true">
      <rect x="132" y="28" width="22" height="56" fill="#3B2A6E" />
      <path d="M0 108L100 16l100 92z" fill="#4A3487" />
      <rect x="22" y="100" width="156" height="130" fill="#FFB4A2" />
      <circle cx="100" cy="72" r="15" fill="#FFE58A" stroke="#3B2A6E" strokeWidth={5} />
      <rect x="36" y="120" width="44" height="38" rx="6" fill="#FFE58A" stroke="#3B2A6E" strokeWidth={5} />
      <path d="M58 120v38M36 139h44" stroke="#3B2A6E" strokeWidth={4} />
      <rect x="32" y="160" width="52" height="11" rx="3" fill="#3DB37A" />
      <circle cx="44" cy="158" r="5" fill="#FF6FB5" />
      <circle cx="58" cy="157" r="5" fill="#FFC93C" />
      <circle cx="72" cy="158" r="5" fill="#FF6FB5" />
      <path d="M104 230v-64a28 28 0 0 1 56 0v64z" className="house__doorway" fill="#FFE58A" />
      <g className="house__door">
        <path d="M104 230v-64a28 28 0 0 1 56 0v64z" fill="#3DB37A" />
        <path d="M114 230v-60a18 18 0 0 1 36 0v60" fill="none" stroke="#2E8B6A" strokeWidth={4} />
        <circle cx="148" cy="196" r="4.5" fill="#FFC93C" />
      </g>
    </svg>
  )
}

interface SceneProps {
  phase: Phase
  progress: number
  isWarning: boolean
  isDoorOpen: boolean
  isCelebrating: boolean
}

export function Scene({ phase, progress, isWarning, isDoorOpen, isCelebrating }: SceneProps) {
  const [skyTop, skyBottom] = skyGradient(phase, progress)
  const sceneStyle = {
    '--sky-top': skyTop,
    '--sky-bottom': skyBottom,
    '--light': lightLevel(phase, progress),
    '--stars': starOpacity(phase, progress),
  } as CSSProperties
  const showTrail = phase !== 'off'

  return (
    <div className="scene" style={sceneStyle}>
      <div className="sky" />
      <div className="stars">
        {STARS.map(([x, y, scale]) => (
          <span key={`${x}-${y}`} className="star" style={{ left: `${x}%`, top: `${y}%`, scale: String(scale) }} />
        ))}
      </div>
      <Moon />
      <Cloud className="cloud--a" />
      <Cloud className="cloud--b" />
      {showTrail && <Trail progress={progress} />}
      <div className={`sun-slot${isCelebrating ? ' is-celebrating' : ''}`} style={at(sunPoint(progress))}>
        <Sun isAwake={phase !== 'night'} isWarning={isWarning} isBeaming={isDoorOpen} />
      </div>
      <Hills />
      <div className="house-slot" style={{ left: `${SUN_PATH.END_X}%` }}>
        <House isDoorOpen={isDoorOpen} />
      </div>
      <Meadow />
    </div>
  )
}
