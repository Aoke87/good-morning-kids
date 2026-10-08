import { useEffect, useState } from 'react'

export function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

function readStored<T>(key: string, fallback: T, normalize: (raw: unknown) => T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : normalize(JSON.parse(raw))
  } catch {
    return fallback
  }
}

export function useStoredState<T>(key: string, fallback: T, normalize: (raw: unknown) => T = (raw) => raw as T) {
  const [value, setValue] = useState(() => readStored(key, fallback, normalize))
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  return [value, setValue] as const
}
