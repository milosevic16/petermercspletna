// Effect tracker. Every timer / rAF loop / IntersectionObserver / listener /
// Web Animation a ported effects file creates routes through one of these so a
// single dispose() call tears the whole page's activity down on route change.
// The legacy *.effects.ts files shadow the globals with these (`const setTimeout
// = __fx.setTimeout`, `__fx.on`, `__fx.anim`) — a bare addEventListener or
// el.animate would leak and stack on every navigation.

type TimerCb = (...args: unknown[]) => void

export interface Tracker {
  raf: (cb: FrameRequestCallback) => number
  caf: (id: number) => void
  setTimeout: (cb: TimerCb, ms?: number) => number
  clearTimeout: (id: number) => void
  setInterval: (cb: TimerCb, ms?: number) => number
  clearInterval: (id: number) => void
  IO: typeof IntersectionObserver
  on: (target: EventTarget, type: string, handler: EventListenerOrEventListenerObject, opts?: boolean | AddEventListenerOptions) => void
  anim: (el: Element, keyframes: Keyframe[] | PropertyIndexedKeyframes | null, opts?: number | KeyframeAnimationOptions) => Animation | undefined
  onDispose: (fn: () => void) => void
  dispose: () => void
}

export function createTracker(): Tracker {
  let disposed = false
  const timeouts = new Set<number>()
  const intervals = new Set<number>()
  const rafs = new Set<number>()
  const observers = new Set<IntersectionObserver>()
  const anims = new Set<Animation>()
  const listeners: Array<[EventTarget, string, EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined]> = []
  const disposers: Array<() => void> = []

  const raf: Tracker['raf'] = (cb) => {
    if (disposed) return 0
    let id = 0
    id = window.requestAnimationFrame((t) => { rafs.delete(id); if (!disposed) cb(t) })
    rafs.add(id)
    return id
  }
  const caf: Tracker['caf'] = (id) => { rafs.delete(id); window.cancelAnimationFrame(id) }

  const setTimeoutFx: Tracker['setTimeout'] = (cb, ms) => {
    if (disposed) return 0
    let id = 0
    id = window.setTimeout((...a: unknown[]) => { timeouts.delete(id); if (!disposed) cb(...a) }, ms)
    timeouts.add(id)
    return id
  }
  const clearTimeoutFx: Tracker['clearTimeout'] = (id) => { timeouts.delete(id); window.clearTimeout(id) }

  const setIntervalFx: Tracker['setInterval'] = (cb, ms) => {
    if (disposed) return 0
    const id = window.setInterval((...a: unknown[]) => { if (!disposed) cb(...a) }, ms)
    intervals.add(id)
    return id
  }
  const clearIntervalFx: Tracker['clearInterval'] = (id) => { intervals.delete(id); window.clearInterval(id) }

  // IntersectionObserver subclass that registers itself for teardown.
  const IO = class extends IntersectionObserver {
    constructor(cb: IntersectionObserverCallback, opts?: IntersectionObserverInit) {
      super(cb, opts)
      observers.add(this)
    }
  }

  const on: Tracker['on'] = (target, type, handler, opts) => {
    if (disposed) return
    target.addEventListener(type, handler, opts)
    listeners.push([target, type, handler, opts])
  }

  const anim: Tracker['anim'] = (el, keyframes, opts) => {
    if (disposed || !el || typeof el.animate !== 'function') return undefined
    const a = el.animate(keyframes, opts)
    anims.add(a)
    // drop finished/cancelled animations so the set doesn't grow unbounded over
    // a long session (the docket rotator etc. animate continuously).
    const done = () => anims.delete(a)
    a.finished.then(done, done)
    return a
  }

  const onDispose: Tracker['onDispose'] = (fn) => { disposers.push(fn) }

  const dispose: Tracker['dispose'] = () => {
    if (disposed) return
    disposed = true
    for (const fn of disposers) { try { fn() } catch { /* keep tearing down */ } }
    for (const id of timeouts) window.clearTimeout(id)
    for (const id of intervals) window.clearInterval(id)
    for (const id of rafs) window.cancelAnimationFrame(id)
    for (const o of observers) { try { o.disconnect() } catch { /* noop */ } }
    for (const a of anims) { try { a.cancel() } catch { /* noop */ } }
    for (const [t, type, h, o] of listeners) { try { t.removeEventListener(type, h, o) } catch { /* noop */ } }
    timeouts.clear(); intervals.clear(); rafs.clear(); observers.clear(); anims.clear(); listeners.length = 0
  }

  return {
    raf, caf,
    setTimeout: setTimeoutFx, clearTimeout: clearTimeoutFx,
    setInterval: setIntervalFx, clearInterval: clearIntervalFx,
    IO, on, anim, onDispose, dispose,
  }
}
