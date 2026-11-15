"use client";

/** Airport sound cues via WebAudio — no assets needed.
 *  stamp thud, boarding chime, announcement beep, delay buzzer. */

let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try { ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(); } catch { return null; }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", gain = 0.12, when = 0) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t = c.currentTime + when;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + dur + 0.05);
}

export const sounds = {
  /** stamp thunk */
  stamp() { tone(180, 0.18, "triangle", 0.25); tone(90, 0.22, "sine", 0.2, 0.03); },
  /** boarding chime — two-note ding */
  chime() { tone(880, 0.25, "sine", 0.1); tone(1174, 0.35, "sine", 0.1, 0.18); },
  /** gate announcement beep */
  announce() { tone(660, 0.12, "square", 0.05); tone(660, 0.12, "square", 0.05, 0.2); },
  /** delay buzzer */
  delay() { tone(220, 0.3, "sawtooth", 0.08); tone(196, 0.4, "sawtooth", 0.08, 0.25); },
  /** correct answer */
  correct() { tone(523, 0.12, "sine", 0.1); tone(784, 0.2, "sine", 0.1, 0.1); },
  /** wrong answer */
  wrong() { tone(196, 0.25, "sawtooth", 0.07); },
  /** gold stamp fanfare */
  gold() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.3, "sine", 0.1, i * 0.14)); },
};
