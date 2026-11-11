// Sons da interface, herdados do Atelier.sh (versão enxuta, só síntese).
// Ficam desligados por padrão (content.json > site.soundsDefault) e a
// pessoa liga pelo alto-falante da topbar. A escolha fica salva no navegador.
import { useSyncExternalStore } from 'react'
import { content } from '@/lib/content'

const KEY = 'atelierin:sons'
let ctx = null
const listeners = new Set()

const read = () => {
  try { const v = localStorage.getItem(KEY); return v === null ? !!content.site.soundsDefault : v === 'true' } catch { return false }
}
let enabled = typeof window !== 'undefined' ? read() : false

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq = 440, type = 'sine', duration = 0.1, volume = 0.1, attack = 0.002, release = 0.05 }) {
  const a = ac(); const now = a.currentTime
  const osc = a.createOscillator(); const g = a.createGain()
  osc.type = type; osc.frequency.setValueAtTime(freq, now)
  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(volume, now + attack)
  g.gain.linearRampToValueAtTime(0, now + duration)
  osc.connect(g); g.connect(a.destination)
  osc.start(now); osc.stop(now + duration + release)
}

// clique de telégrafo sintetizado (mesma receita do Atelier.sh)
function key() {
  const a = ac(); const now = a.currentTime; const v = Math.random()
  const len = Math.floor(a.sampleRate * 0.008)
  const buf = a.createBuffer(1, len, a.sampleRate); const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.3))
  const src = a.createBufferSource(); src.buffer = buf
  const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1200 + v * 600; bp.Q.value = 3
  const g = a.createGain(); g.gain.setValueAtTime(0.1, now)
  src.connect(bp); bp.connect(g); g.connect(a.destination); src.start(now)
}

const SOUNDS = {
  tick: () => tone({ freq: 2200, type: 'square', duration: 0.012, volume: 0.035 }),
  click: () => tone({ freq: 1800, type: 'square', duration: 0.014, volume: 0.05 }),
  key,
  on: () => { tone({ freq: 1200, duration: 0.1, volume: 0.08 }); setTimeout(() => tone({ freq: 1600, duration: 0.12, volume: 0.06 }), 90) },
}

export function play(name) {
  if (!enabled) return
  try { SOUNDS[name]?.() } catch { /* sem áudio */ }
}

export function setSounds(on) {
  enabled = on
  try { localStorage.setItem(KEY, String(on)) } catch { /* */ }
  if (on) try { SOUNDS.on() } catch { /* */ }
  listeners.forEach((l) => l())
}

export function useSoundsEnabled() {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l) }, () => enabled, () => false)
}
