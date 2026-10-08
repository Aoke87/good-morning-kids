let wakeLock: WakeLockSentinel | null = null

// Fullscreen and wake lock are nice-to-haves: unsupported browsers or a denied request must not break the morning.
export function enterFullscreen(): void {
  if (document.fullscreenElement || !document.documentElement.requestFullscreen) return
  document.documentElement.requestFullscreen().catch(() => undefined)
}

async function requestWakeLock(): Promise<void> {
  if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') return
  try {
    wakeLock = await navigator.wakeLock.request('screen')
  } catch {
    wakeLock = null
  }
}

/** The OS drops the wake lock whenever the tab is hidden, so it has to be re-acquired on return. */
export function keepScreenOn(): void {
  void requestWakeLock()
  document.addEventListener('visibilitychange', () => {
    if (!wakeLock || wakeLock.released) void requestWakeLock()
  })
}
