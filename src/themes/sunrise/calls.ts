import type { TaskId } from '../../constants'
import { noise, tone } from '../../sound'

// Cartoon versions, not field recordings: exaggerated pitch contours read better to small children.

function rooster(): void {
  const crow = { type: 'sawtooth', hold: true, formant: 1400, volume: 0.4 } as const
  tone({ ...crow, freq: 700, glideTo: 820, duration: 0.12 })
  tone({ ...crow, freq: 620, glideTo: 700, at: 0.16, duration: 0.12 })
  tone({ ...crow, freq: 760, glideTo: 880, at: 0.32, duration: 0.12 })
  tone({ ...crow, freq: 920, glideTo: 640, at: 0.48, duration: 0.8, vibrato: { rate: 7, depth: 0.02 } })
}

function frog(): void {
  // A croak is a fast train of glottal pulses, not one continuous tone.
  ;[0, 0.55].forEach((start) => {
    for (let i = 0; i < 10; i++) {
      tone({ freq: 140, glideTo: 110, at: start + i * 0.04, duration: 0.035, type: 'square', formant: 600, volume: 0.45 })
    }
  })
}

function duck(): void {
  ;[0, 0.22].forEach((at) =>
    tone({ freq: 280, glideTo: 220, at, duration: 0.16, type: 'sawtooth', hold: true, formant: 1100, volume: 0.5 }),
  )
}

function rabbit(): void {
  ;[0, 0.32].forEach((at) => tone({ freq: 180, glideTo: 540, at, duration: 0.26, vibrato: { rate: 18, depth: 0.06 }, volume: 0.25 }))
}

function butterfly(): void {
  ;[1568, 1760, 2093, 2349.3, 2637, 3136, 2637, 3136].forEach((freq, index) =>
    tone({ freq, at: index * 0.05, duration: 0.14, type: 'triangle', volume: 0.07, pan: -0.6 + index * 0.17 }),
  )
}

function hedgehog(): void {
  ;[0, 0.13, 0.26].forEach((at) => noise({ formant: 2500, at, duration: 0.08, volume: 0.5 }))
  tone({ freq: 1800, glideTo: 2300, at: 0.45, duration: 0.1, hold: true, volume: 0.12 })
}

function squirrel(): void {
  for (let i = 0; i < 7; i++) {
    tone({ freq: 2400, glideTo: 1800, at: i * 0.06, duration: 0.04, type: 'square', formant: 2500, volume: 0.25 })
  }
}

function ladybug(): void {
  tone({ freq: 220, glideTo: 260, duration: 0.7, type: 'sawtooth', hold: true, attack: 0.05, formant: 600, vibrato: { rate: 9, depth: 0.04 }, volume: 0.3 })
}

function fox(): void {
  ;[0, 0.2].forEach((at) =>
    tone({ freq: 900, glideTo: 600, at, duration: 0.12, type: 'sawtooth', hold: true, formant: 1300, volume: 0.4 }),
  )
}

function sheep(): void {
  // Wide, fast vibrato through a fixed formant makes the harmonics flutter in and out: the bleat.
  tone({ freq: 330, glideTo: 300, duration: 0.8, type: 'sawtooth', hold: true, attack: 0.03, formant: 900, vibrato: { rate: 7, depth: 0.06 }, volume: 0.5 })
}

function snail(): void {
  tone({ freq: 300, glideTo: 150, duration: 0.3, hold: true, volume: 0.3 })
  tone({ freq: 260, glideTo: 130, at: 0.38, duration: 0.3, hold: true, volume: 0.3 })
}

function mouse(): void {
  tone({ freq: 3000, glideTo: 3400, duration: 0.08, hold: true, volume: 0.12 })
  tone({ freq: 3000, glideTo: 3400, at: 0.14, duration: 0.08, hold: true, volume: 0.12 })
  tone({ freq: 3200, glideTo: 3700, at: 0.28, duration: 0.1, hold: true, volume: 0.12 })
}

export const ANIMAL_CALLS: Record<TaskId, () => void> = {
  wakeUp: rooster,
  toilet: frog,
  washFace: duck,
  brushTeeth: rabbit,
  getDressed: butterfly,
  combHair: hedgehog,
  breakfast: squirrel,
  washHands: ladybug,
  shoes: fox,
  jacket: sheep,
  backpack: snail,
  makeBed: mouse,
}
