/* ---------------------------------------------------------------------
   6. SOUND (tiny synthesiser, no files)
   --------------------------------------------------------------------- */
const Sound = {
  ac: null, out: null, muted: false,
  init() {
    if (this.ac) { this.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ac = new AC(); this.out = this.ac.createGain(); this.out.gain.value = 0.5; this.out.connect(this.ac.destination);
    } catch (e) { this.ac = null; }
  },
  resume() { try { if (this.ac && this.ac.state === 'suspended') this.ac.resume(); } catch (e) { /* ignore */ } },
  tone(freq, dur, o = {}) {
    if (!this.ac || this.muted) return;
    const t = this.ac.currentTime + (o.delay || 0);
    const osc = this.ac.createOscillator(), g = this.ac.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(freq, t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * o.slide), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(this.out); osc.start(t); osc.stop(t + dur + 0.05);
  },
  noise(dur, o = {}) {
    if (!this.ac || this.muted) return;
    const t = this.ac.currentTime + (o.delay || 0), n = Math.floor(this.ac.sampleRate * dur);
    const buf = this.ac.createBuffer(1, n, this.ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ac.createBufferSource(); src.buffer = buf;
    const f = this.ac.createBiquadFilter(); f.type = o.filter || 'lowpass'; f.frequency.value = o.freq || 1000;
    const g = this.ac.createGain(); g.gain.setValueAtTime(o.vol || 0.3, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.out); src.start(t);
  },
  note(i) { if (!this.ac || this.muted) return; this.tone([523, 587, 659, 784][i] || 523, 0.35, { type: 'triangle', vol: 0.14 }); },
  play(name) {
    if (!this.ac || this.muted) return;
    switch (name) {
      case 'pickup': [660, 880, 1320].forEach((f, i) => this.tone(f, 0.25, { type: 'triangle', vol: 0.18, delay: i * 0.08 })); break;
      case 'firefly': [1500, 1900, 2400].forEach((f, i) => this.tone(f, 0.2, { vol: 0.07, delay: i * 0.07 })); break;
      case 'click': this.tone(900, 0.05, { type: 'square', vol: 0.03 }); break;
      case 'sparkle': [1200, 1500, 1800, 2400].forEach((f, i) => this.tone(f, 0.18, { vol: 0.06, delay: i * 0.06 })); break;
      case 'whisper': this.noise(0.6, { vol: 0.12, freq: 4000, filter: 'highpass' }); break;
      case 'meee': this.tone(420, 0.45, { type: 'sawtooth', vol: 0.06, slide: 0.9 }); this.tone(440, 0.4, { type: 'sawtooth', vol: 0.04, delay: 0.05 }); break;
      case 'hurt': this.tone(440, 0.16, { type: 'square', vol: 0.06 }); this.tone(330, 0.24, { type: 'square', vol: 0.06, delay: 0.12 }); break;
      case 'splash': this.noise(0.6, { vol: 0.4, freq: 1400 }); break;
      case 'slip': this.tone(700, 0.35, { vol: 0.12, slide: 0.3 }); this.noise(0.2, { vol: 0.25, freq: 600, delay: 0.3 }); break;
      case 'crackIce': this.noise(0.3, { vol: 0.45, freq: 3000, filter: 'bandpass' }); this.tone(1800, 0.2, { vol: 0.05, slide: 0.5 }); break;
      case 'rumble': this.noise(1.6, { vol: 0.45, freq: 150 }); break;
      case 'water': this.noise(2.5, { vol: 0.35, freq: 900 }); [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.4, { type: 'triangle', vol: 0.08, delay: 0.3 + i * 0.12 })); break;
      case 'wind': this.noise(1.2, { vol: 0.2, freq: 500 }); break;
      case 'snow': this.noise(0.25, { vol: 0.25, freq: 700 }); break;
      case 'hoot': this.tone(392, 0.35, { vol: 0.18 }); this.tone(330, 0.5, { vol: 0.18, delay: 0.38 }); break;
      case 'chime': this.tone(880 + Math.random() * 400, 0.5, { type: 'triangle', vol: 0.1 }); break;
      case 'honk': this.tone(330, 0.18, { type: 'sawtooth', vol: 0.07, slide: 0.8 }); this.tone(300, 0.2, { type: 'sawtooth', vol: 0.07, slide: 0.8, delay: 0.2 }); break;
      case 'robot': [880, 660, 880].forEach((f, i) => this.tone(f, 0.08, { type: 'square', vol: 0.04, delay: i * 0.09 })); break;
      case 'bubble': this.tone(600 + Math.random() * 600, 0.12, { vol: 0.08, slide: 1.8 }); break;
      case 'caw': this.noise(0.18, { vol: 0.25, freq: 1800, filter: 'bandpass' }); this.tone(700, 0.18, { type: 'sawtooth', vol: 0.05, slide: 0.6 }); break;
      case 'trumpet': this.tone(250, 0.6, { type: 'sawtooth', vol: 0.08, slide: 1.6 }); break;
      case 'spray': this.noise(0.4, { vol: 0.12, freq: 3000, filter: 'highpass' }); break;
      case 'flip': this.tone(1000, 0.06, { type: 'triangle', vol: 0.06 }); break;
      case 'wrong': this.tone(300, 0.2, { type: 'triangle', vol: 0.1, slide: 0.7 }); break;
      case 'checkpoint': [523, 659, 784].forEach((f, i) => this.tone(f, 0.22, { type: 'triangle', vol: 0.12, delay: i * 0.07 })); break;
      case 'howl': this.tone(420, 1.2, { type: 'sawtooth', vol: 0.06, slide: 1.5 }); this.tone(630, 1.0, { vol: 0.08, slide: 0.7, delay: 0.5 }); break;
      case 'ghost': this.tone(520, 1.1, { vol: 0.08, slide: 0.7 }); this.tone(780, 0.9, { vol: 0.04, slide: 0.6, delay: 0.15 }); break;
      case 'bats': for (let i = 0; i < 5; i++) this.tone(2200 + Math.random() * 900, 0.05, { type: 'triangle', vol: 0.05, delay: i * 0.05 }); break;
      case 'sonar': this.tone(1700, 0.12, { vol: 0.05, slide: 1.3 }); this.tone(1700, 0.1, { vol: 0.025, slide: 1.3, delay: 0.18 }); break;
      case 'train': for (let i = 0; i < 8; i++) this.noise(0.08, { vol: 0.25, freq: 500, delay: i * 0.22 }); this.tone(330, 0.6, { type: 'square', vol: 0.04, delay: 0.1 }); this.tone(392, 0.6, { type: 'square', vol: 0.04, delay: 0.1 }); break;
      case 'slime': this.tone(160, 0.25, { type: 'sine', vol: 0.12, slide: 2.2 }); break;
      case 'brew': for (let i = 0; i < 6; i++) this.tone(300 + Math.random() * 500, 0.1, { vol: 0.07, slide: 1.6, delay: i * 0.09 }); break;
      case 'heli': for (let i = 0; i < 10; i++) this.noise(0.06, { vol: 0.2, freq: 300, delay: i * 0.1 }); break;
      case 'knock': [0, 0.18, 0.36].forEach((d) => this.noise(0.07, { vol: 0.5, freq: 400, delay: d })); break;
      case 'roll': this.noise(0.5, { vol: 0.2, freq: 250 }); break;
      case 'note': break;
      case 'win': [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.45, { type: 'triangle', vol: 0.16, delay: i * 0.15 })); break;
    }
  },
};

/* ---------------------------------------------------------------------
   7. INPUT (keyboard + on-screen buttons)
   --------------------------------------------------------------------- */
const $ = (id) => document.getElementById(id);
const input = { left: false, right: false, up: false, down: false, act: false, swap: false, map: false, pressed: {} };
const KEYMAP = {
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  Space: 'act', Enter: 'act', KeyE: 'act', NumpadEnter: 'act', Tab: 'swap', KeyQ: 'swap', KeyM: 'map',
};
function press(k) { if (!input[k]) input.pressed[k] = true; input[k] = true; }
function release(k) { input[k] = false; }
window.addEventListener('keydown', (e) => {
  Sound.resume();
  if (S.overlayInput) {
    if (e.code === 'Escape' && S.overlayClose) S.overlayClose();
    if (S.memKeys && !e.repeat && S.memKeys(e.code)) e.preventDefault();
    return;
  }
  if (S.mapOpen) { if (/^(KeyM|Escape|Space|Enter|Tab)$/.test(e.code)) { e.preventDefault(); toggleMap(false); } return; }
  const k = KEYMAP[e.code];
  if (S.mode !== 'play' && (e.code === 'Enter' || e.code === 'Space')) {
    const ov = S.mode === 'title' ? $('btn-start') : S.mode === 'intro' ? $('btn-intro') : S.mode === 'gameover' ? $('btn-checkpoint') : $('btn-again');
    const onBtn = document.activeElement && document.activeElement.tagName === 'BUTTON';
    if (ov && !e.repeat && !onBtn) { e.preventDefault(); ov.click(); }
    return;
  }
  if (S.dialog && S.dialog.choices && /^Digit[1-9]$|^Numpad[1-9]$/.test(e.code)) {
    const i = parseInt(e.code.slice(-1), 10) - 1;
    if (i < S.dialog.choices.length) { e.preventDefault(); closeDialog(i); }
    return;
  }
  if (k) { e.preventDefault(); if (!e.repeat) press(k); else input[k] = true; }
});
window.addEventListener('keyup', (e) => { const k = KEYMAP[e.code]; if (k) release(k); });
window.addEventListener('blur', () => { ['left', 'right', 'up', 'down', 'act', 'swap', 'map'].forEach(release); });
document.querySelectorAll('.pad').forEach((b) => {
  const k = b.dataset.k;
  const down = (e) => { e.preventDefault(); Sound.init(); press(k); b.classList.add('on'); try { b.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } };
  const up = () => { release(k); b.classList.remove('on'); };
  b.addEventListener('pointerdown', down);
  b.addEventListener('pointerup', up);
  b.addEventListener('pointercancel', up);
  b.addEventListener('lostpointercapture', up);
  b.addEventListener('contextmenu', (e) => e.preventDefault());
});

/* ---------------------------------------------------------------------
   8. UI: hearts, bag, toast, dialogue
   --------------------------------------------------------------------- */
function showToast(text, secs = 3.6) { const t = $('toast'); t.textContent = text; t.classList.add('show'); S.toastT = secs; }
function hideToast() { $('toast').classList.remove('show'); S.toastT = 0; }
function say(text, opts = {}) {
  return new Promise((resolve) => {
    S.dialog = { text, speaker: opts.speaker || '', choices: opts.choices || null, loud: !!opts.loud, sel: 0, resolve, born: S.time };
    renderDialog();
  });
}
function closeDialog(val) {
  const d = S.dialog; if (!d) return;
  S.dialog = null; renderDialog(); Sound.play('click');
  d.resolve(val);
}
function renderDialog() {
  const box = $('dialog'), d = S.dialog;
  if (!d) { box.hidden = true; return; }
  hideToast();
  box.hidden = false;
  $('dlg-speaker').textContent = d.speaker;
  $('dlg-face').hidden = !drawSpeakerFace(d.speaker);
  const txt = $('dlg-text'); txt.textContent = d.text; txt.classList.toggle('loud', d.loud);
  const ch = $('dlg-choices'); ch.innerHTML = '';
  if (d.choices) {
    d.choices.forEach((c, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'choice' + (i === d.sel ? ' sel' : ''); b.textContent = c;
      b.addEventListener('click', (e) => { e.stopPropagation(); closeDialog(i); });
      ch.appendChild(b);
    });
  }
  $('dlg-next').hidden = !!d.choices;
}
$('dialog').addEventListener('click', () => { if (S.dialog && !S.dialog.choices && S.time - S.dialog.born > 0.15) closeDialog(0); });
function handleDialogInput() {
  const d = S.dialog, P = input.pressed;
  if (S.time - d.born < 0.18) return;
  if (d.choices) {
    if (P.up || P.left) { d.sel = (d.sel + d.choices.length - 1) % d.choices.length; renderDialog(); }
    if (P.down || P.right) { d.sel = (d.sel + 1) % d.choices.length; renderDialog(); }
    if (P.act) closeDialog(d.sel);
  } else if (P.act) closeDialog(0);
}

/* ---------------------------------------------------------------------
   9. TIMING HELPERS + EFFECTS
   --------------------------------------------------------------------- */
const waiters = [], tweens = [];
function wait(sec) { return new Promise((r) => waiters.push({ t: S.time + sec, r })); }
function tween(dur, fn) { return new Promise((res) => tweens.push({ t: 0, dur, fn, res })); }
async function scene(fn) {
  if (S.locked) return;
  const ep = S.epoch; S.locked++;
  try { await fn(); } finally { if (ep === S.epoch) S.locked = Math.max(0, S.locked - 1); }
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function particle(o) { S.particles.push(Object.assign({ vx: 0, vy: 0, g: 0, life: 1, max: 1, size: 3, color: '#fff', kind: 'dot', rot: 0, vr: 0 }, o)); }
function sparkle(x, y, color = '#ffe9a8', n = 18) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = 0.6 + Math.random() * 2.2;
    particle({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.6, g: 1.2, life: 0.7 + Math.random() * 0.6, max: 1.3, size: 3 + Math.random() * 4, color, kind: 'spark' });
  }
}
function dust(x, y, n = 10, color = '#c9b89e') {
  for (let i = 0; i < n; i++) particle({ x: x + (Math.random() - 0.5), y, vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 1.2, g: 0.5, life: 0.6 + Math.random() * 0.6, max: 1.2, size: 2 + Math.random() * 4, color });
}
function splash(x, y) {
  for (let i = 0; i < 22; i++) particle({ x: x + (Math.random() - 0.5) * 0.6, y, vx: (Math.random() - 0.5) * 3.5, vy: -2 - Math.random() * 4, g: 14, life: 0.7 + Math.random() * 0.4, max: 1.1, size: 2.5 + Math.random() * 3, color: i % 3 ? '#9fd6ff' : '#e8f6ff' });
}
function popup(text, x, y, color = '#fff3c4', size = 30, life = 1.6) { S.popups.push({ text, x, y, color, size, life, max: life }); }
function shake(amount) { S.shake = Math.max(S.shake, amount); }

