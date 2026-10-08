import type { Phase } from '../../time'

export const INK = '#2B2350'
export const PAPER = '#FFF6E5'
export const WHITE = '#FFFDF7'
export const CHEEK = '#FF8A8A'

type Gradient = readonly [top: string, bottom: string]

const SKY: Record<'night' | 'dawn' | 'morning' | 'day', Gradient> = {
  night: ['#141845', '#35296A'],
  dawn: ['#3B2C7A', '#FF9F7A'],
  morning: ['#6FA3E6', '#FFD49A'],
  day: ['#4FBDF2', '#CDEFFF'],
}

const LIGHT = { NIGHT: 0.45, DAWN: 0.6 } as const
const STAR_FADE_SPEED = 4

function lerpHex(from: string, to: string, t: number): string {
  const channel = (hex: string, index: number) => parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16)
  const mixed = [0, 1, 2].map((i) => Math.round(channel(from, i) + (channel(to, i) - channel(from, i)) * t))
  return `#${mixed.map((value) => value.toString(16).padStart(2, '0')).join('')}`
}

function lerpGradient(from: Gradient, to: Gradient, t: number): Gradient {
  return [lerpHex(from[0], to[0], t), lerpHex(from[1], to[1], t)]
}

export function skyGradient(phase: Phase, progress: number): Gradient {
  if (phase === 'night') return SKY.night
  if (phase !== 'morning') return SKY.day
  return progress < 0.5
    ? lerpGradient(SKY.dawn, SKY.morning, progress * 2)
    : lerpGradient(SKY.morning, SKY.day, (progress - 0.5) * 2)
}

export function lightLevel(phase: Phase, progress: number): number {
  if (phase === 'night') return LIGHT.NIGHT
  if (phase !== 'morning') return 1
  return LIGHT.DAWN + (1 - LIGHT.DAWN) * progress
}

export function starOpacity(phase: Phase, progress: number): number {
  if (phase === 'night') return 1
  if (phase !== 'morning') return 0
  return Math.max(0, 1 - progress * STAR_FADE_SPEED)
}
