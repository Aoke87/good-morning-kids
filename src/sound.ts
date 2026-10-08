import { SPEECH } from './constants'

const AUDIO = {
  MASTER_GAIN: 0.8,
  AMBIENCE_GAIN: 0.06,
  ATTACK_S: 0.008,
  MARIMBA_DECAY_S: 0.9,
  BELL_DECAY_S: 2.4,
  // Inharmonic partials are what make a sine stack sound like a bell instead of an organ.
  BELL_PARTIALS: [1, 2.76, 5.4],
  NOTE_GAP_S: 0.09,
  BIRD_MIN_PAUSE_MS: 350,
  BIRD_MAX_PAUSE_MS: 6000,
} as const

// Major pentatonic from C5 upward: every note fits with every other, so any completion order sounds musical.
const PENTATONIC_HZ = [523.3, 587.3, 659.3, 784, 880, 1046.5, 1174.7, 1318.5, 1568, 1760, 2093, 2349.3, 2637]

let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled = true

/** Browsers only allow audio after a user gesture, so this must run inside a tap handler. */
export function unlockAudio(): void {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = AUDIO.MASTER_GAIN
    master.connect(ctx.destination)
  }
  void ctx.resume()
}

export function setSoundEnabled(value: boolean): void {
  enabled = value
  if (!value) window.speechSynthesis?.cancel()
}

function audio(): { ctx: AudioContext; out: GainNode } | null {
  if (!enabled || !ctx || !master) return null
  // Android suspends the context on standby/background; after the first gesture it may be resumed without a new one.
  if (ctx.state !== 'running') void ctx.resume()
  return { ctx, out: master }
}

interface ToneOptions {
  freq: number
  at?: number
  duration?: number
  type?: OscillatorType
  volume?: number
  glideTo?: number
  pan?: number
}

function tone({ freq, at = 0, duration = AUDIO.MARIMBA_DECAY_S, type = 'sine', volume = 0.25, glideTo, pan = 0 }: ToneOptions): void {
  const a = audio()
  if (!a) return
  const start = a.ctx.currentTime + at
  const osc = a.ctx.createOscillator()
  const gain = a.ctx.createGain()
  const panner = a.ctx.createStereoPanner()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, start + duration * 0.8)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + AUDIO.ATTACK_S)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  panner.pan.value = pan
  osc.connect(gain).connect(panner).connect(a.out)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

function marimba(freq: number, at = 0, volume = 0.28): void {
  tone({ freq, at, volume })
  tone({ freq: freq * 4, at, volume: volume * 0.12, duration: 0.15 })
}

function bell(freq: number, at = 0, volume = 0.18): void {
  AUDIO.BELL_PARTIALS.forEach((ratio, index) =>
    tone({ freq: freq * ratio, at, volume: volume / (index + 1), duration: AUDIO.BELL_DECAY_S / (index + 1) }),
  )
}

function sparkle(at: number, base = 2093): void {
  ;[0, 1, 2, 3].forEach((step) => tone({ freq: base * (1 + step * 0.25), at: at + step * 0.04, volume: 0.05, duration: 0.25 }))
}

export function playCheck(step: number): void {
  const index = Math.min(step, PENTATONIC_HZ.length - 3)
  marimba(PENTATONIC_HZ[index])
  marimba(PENTATONIC_HZ[index + 2], AUDIO.NOTE_GAP_S)
  sparkle(AUDIO.NOTE_GAP_S * 2)
}

export function playUndo(): void {
  tone({ freq: 660, glideTo: 330, duration: 0.35, type: 'triangle', volume: 0.15 })
}

export function playBoop(): void {
  tone({ freq: 420, glideTo: 280, duration: 0.18, volume: 0.18 })
}

export function playWake(): void {
  tone({ freq: 220, glideTo: 880, duration: 1.1, type: 'triangle', volume: 0.12 })
  ;[523.3, 659.3, 784, 1046.5].forEach((freq, index) => bell(freq, 0.5 + index * 0.12, 0.1))
}

export function playFanfare(): void {
  const notes = [523.3, 659.3, 784, 1046.5]
  notes.forEach((freq, index) => tone({ freq, at: index * 0.14, type: 'triangle', volume: 0.2, duration: 0.4 }))
  const chordAt = notes.length * 0.14
  ;[523.3, 659.3, 784, 1046.5, 1318.5].forEach((freq) => tone({ freq, at: chordAt, type: 'triangle', volume: 0.1, duration: 1.8 }))
  ;[0, 1, 2, 3, 4, 5].forEach((step) => sparkle(chordAt + step * 0.18, 1568 + step * 220))
}

export function playDoorbell(): void {
  bell(659.3)
  bell(523.3, 0.55)
}

export function speak(text: string): void {
  const synth = window.speechSynthesis
  if (!enabled || !synth) return
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = SPEECH.LANG
  utterance.pitch = SPEECH.PITCH
  utterance.rate = SPEECH.RATE
  utterance.voice = synth.getVoices().find((voice) => voice.lang.startsWith('de')) ?? null
  synth.speak(utterance)
}

/* ---------- Ambience: synthesized birdsong whose density follows the sun ---------- */

function chirpTweet(pan: number): void {
  const count = 2 + Math.floor(Math.random() * 4)
  const top = 3400 + Math.random() * 1400
  for (let i = 0; i < count; i++) {
    tone({ freq: top, glideTo: top * 0.62, at: i * 0.085, duration: 0.07, volume: AUDIO.AMBIENCE_GAIN, pan })
  }
}

function chirpWhistle(pan: number): void {
  const low = 1900 + Math.random() * 500
  tone({ freq: low, glideTo: low * 1.35, duration: 0.22, volume: AUDIO.AMBIENCE_GAIN, pan })
  tone({ freq: low * 1.35, glideTo: low * 1.1, at: 0.26, duration: 0.2, volume: AUDIO.AMBIENCE_GAIN * 0.8, pan })
}

function chirpTrill(pan: number): void {
  const base = 2800 + Math.random() * 900
  for (let i = 0; i < 9; i++) {
    tone({ freq: base, glideTo: base * 1.12, at: i * 0.035, duration: 0.03, volume: AUDIO.AMBIENCE_GAIN * 0.7, pan })
  }
}

const BIRDS = [chirpTweet, chirpWhistle, chirpTrill]

let ambienceTimer: number | undefined
let ambienceLevel = 0

/** level 0 = silent, 1 = full dawn chorus. */
export function setAmbience(level: number): void {
  ambienceLevel = level
  if (ambienceTimer === undefined && level > 0) scheduleBird()
}

function scheduleBird(): void {
  const pause = AUDIO.BIRD_MAX_PAUSE_MS - (AUDIO.BIRD_MAX_PAUSE_MS - AUDIO.BIRD_MIN_PAUSE_MS) * ambienceLevel
  ambienceTimer = window.setTimeout(() => {
    ambienceTimer = undefined
    if (ambienceLevel <= 0) return
    const bird = BIRDS[Math.floor(Math.random() * BIRDS.length)]
    bird(Math.random() * 1.6 - 0.8)
    scheduleBird()
  }, pause * (0.5 + Math.random()))
}
