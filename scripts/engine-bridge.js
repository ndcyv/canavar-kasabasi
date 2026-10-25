
/* =====================================================================
   MULTIPLAYER BRIDGE for Canavar Kasabası (injected at the end of the IIFE)
   The server runs the story; each browser draws the world for its own girl.
   Everything that belongs to ONE girl (her dialog, messages, hearts, camera,
   first-time explanations) lives in S.pl[name]. Accessor properties point
   the original code's S.dialog, S.hearts, … at the girl whose turn it is.
   Shared moments (the train rides, the tower, the sky, coming home) run for
   one girl while the cousin watches the same scene and reads along.
   ===================================================================== */
S.manual = true;
const NAMES = ['Nehir', 'Bade'];
const otherName = (n) => (n === 'Nehir' ? 'Bade' : 'Nehir');
function freshPl() {
  return { dialog: null, locked: 0, camTarget: null, area: '', areaT: 0, areaName: '', areaShownAt: -10, hearts: 3, fade: 0, fadeCol: '10,6,20',
    hints: {}, talkQ: [], awaitDir: null, overlayInput: false, overlayClose: null, checkpoint: null, toast: { text: '', t: 0 }, news: [], call: null, hintTimer: 0, sonarT: 0 };
}
const keepActive = S.active;
S.pl = { Nehir: freshPl(), Bade: freshPl() };
for (const f of ['dialog', 'locked', 'camTarget', 'area', 'areaT', 'areaName', 'areaShownAt', 'hearts', 'fade', 'fadeCol', 'hints', 'talkQ', 'awaitDir', 'overlayInput', 'overlayClose', 'hintTimer', 'sonarT']) {
  Object.defineProperty(S, f, { configurable: true, enumerable: false, get() { return S.pl[S.active][f]; }, set(v) { S.pl[S.active][f] = v; } });
}
Object.defineProperty(S, 'toastT', { configurable: true, enumerable: false, get() { return 0; }, set() {} });
S.active = keepActive;
S.presence = {}; S.shared = null;
const PL = () => S.pl[S.active];

/* --- "press Q to switch" becomes a walkie-talkie call to the cousin --- */
const Q_RE = /Q (?:tuşuna bas,?|tuşuyla|ile) (Nehir'e|Bade'ye) geç(?:elim)?/g;
function mpText(text) {
  const t = String(text);
  if (!Q_RE.test(t)) { Q_RE.lastIndex = 0; return { text: t, call: false }; }
  Q_RE.lastIndex = 0;
  return { text: t.replace(Q_RE, '$1 telsizden haber gitti'), call: true };
}
function notify(name, text, secs = 4.5) { S.pl[name].news.push({ text, t: secs }); if (S.pl[name].news.length > 6) S.pl[name].news.shift(); }
function notifyOther(text, secs) { notify(otherName(S.active), text, secs); }
function far() { const a = S.chars[S.active], b = S.chars[otherName(S.active)]; return Math.hypot(a.x - b.x, a.y - b.y) > 6 || areaAt(a.x, a.y) !== areaAt(b.x, b.y); }
function placeName(a) { return a || 'kasaba'; }
function callCousin(why) {
  const me = S.active, you = otherName(me), c = S.chars[me];
  if (!S.presence?.[you]) return;
  if (!cooldown('call' + me + why, 20)) return;
  S.pl[you].call = { from: me, x: c.x, y: c.y, t: S.time, why };
  notify(you, `📻 ${me} seni çağırıyor: ${why}\nYer: ${placeName(areaAt(c.x, c.y))} · Haritada 📍 işareti var (M).`, 7);
}
showToast = function (text, secs = 3.6) {
  const m = mpText(text); if (m.call) callCousin('senin gücün lazım!');
  PL().toast = { text: m.text, t: secs };
  if (!window.MULTIPLAYER_SERVER) { const t = $('toast'); t.textContent = m.text; t.classList.add('show'); }
};
hideToast = function () { PL().toast = { text: '', t: 0 }; if (!window.MULTIPLAYER_SERVER) $('toast').classList.remove('show'); };

/* --- the cousin who is far away talks over the walkie-talkie --- */
const _say = say;
say = function (text, opts = {}) {
  const you = otherName(S.active), m = mpText(text);
  if (m.call) callCousin('senin gücün lazım!');
  if (opts.speaker === NAME_UP[you] && far()) opts = Object.assign({}, opts, { speaker: `📻 ${NAME_UP[you]} (TELSİZDEN)` });
  const owner = S.active;
  return _say(m.text, opts).then((v) => { S.active = owner; return v; });
};

/* --- timers remember whose scene they belong to --- */
const resume = (owner) => (v) => { S.active = owner; return v; };
wait = function (sec) { const owner = S.active; return new Promise((r) => waiters.push({ t: S.time + sec, r, owner })).then(resume(owner)); };
tween = function (dur, fn) { const owner = S.active; return new Promise((res) => tweens.push({ t: 0, dur, fn, res, owner })).then(resume(owner)); };
waitDir = function () { const owner = S.active; return new Promise((r) => { S.awaitDir = r; }).then(resume(owner)); };
function schedule(fn, ms) { const owner = S.active, epoch = S.epoch; return setTimeout(() => { if (S.epoch !== epoch) return; const keep = S.active; S.active = owner; try { fn(); } finally { S.active = keep; } }, ms); }

// a scene always belongs to the girl who started it, whoever's turn it is when it ends
scene = async function (fn) {
  const owner = S.active, p = S.pl[owner];
  if (p.locked) return;
  const ep = S.epoch; p.locked++;
  try { await fn(); } finally { if (ep === S.epoch) p.locked = Math.max(0, p.locked - 1); S.active = owner; }
};
/* --- one girl each; no follower, no switching --- */
updateFollower = function () {};
swapCousin = function () { showToast('Her kahramanı kendi oyuncusu yönetir. Uzaktaki kuzeninle telsizden konuşursun!', 3); };
placeBoth = function (x, y) {
  const a = P(); a.x = x; a.y = y; a.trail = []; a.moving = false;
  if (S.shared) { const b = S.chars[otherName(S.active)], [fx, fy] = freeSpotNear(b.who, x - 0.9, y); b.x = fx; b.y = fy; b.trail = []; b.moving = false; }
  snapCamera();
};
teleport = async function (x, y, dir) {
  await scene(async () => {
    Sound.play('click');
    await tween(0.22, (k) => { S.fade = k; S.fadeCol = '20,14,30'; });
    const c = P(); c.x = x; c.y = y; c.trail = []; c.moving = false; c.dir = dir || c.dir;
    S.area = ''; checkAreaTitle();
    saveCheckpoint(true); Sound.play('checkpoint'); popup('💾 Kaydedildi', x, y - 1.9, '#bff0c4', 20, 1.6);
    await tween(0.25, (k) => { S.fade = 1 - k; });
    S.fade = 0;
  });
};
saveCheckpoint = function (quiet) {
  for (const n of (S.shared ? NAMES : [S.active])) { const c = S.chars[n]; S.pl[n].checkpoint = { x: c.x, y: c.y }; }
  if (!quiet) { Sound.play('checkpoint'); showToast('✨ Kontrol noktası: oyun kaydedildi', 2.2); }
};
// running out of hearts sends only THIS girl back to her last saved spot
gameOver = function () {
  const p = PL(), c = P(), cp = p.checkpoint || { x: c.x, y: c.y };
  p.hearts = 3; c.hurtT = 1.5; p.dialog = null;
  scene(async () => {
    await tween(0.3, (k) => { S.fade = k; S.fadeCol = '255,255,255'; });
    c.x = cp.x; c.y = cp.y; c.trail = []; c.moving = false; S.area = ''; checkAreaTitle();
    await tween(0.3, (k) => { S.fade = 1 - k; }); S.fade = 0;
    await say('Ay, başın döndü! Biraz dinlendin ve son kaydettiğin yerden devam ediyorsun. ❤️❤️❤️');
  });
  notifyOther(`📻 ${S.active === 'Nehir' ? "Nehir'in" : "Bade'nin"} kalpleri bitti, son kaydettiği yere döndü. Merak etme, iyi!`, 4);
};

/* --- shared news --- */
const _pickupFx = pickupFx;
pickupFx = function (text, x, y) { _pickupFx(text, x, y); notifyOther(`🎒 ${S.active} çantaya ekledi: ${text}`, 3.5); };
const _giveLantern = giveLantern;
giveLantern = async function (key, x, y) {
  const before = S.flags.lanternCount;
  await _giveLantern(key, x, y);
  if (S.flags.lanternCount > before) {
    for (const q of Object.values(S.pl)) q.hearts = 3;
    notifyOther(`🎃 ${S.active} sayesinde ${F_NAME[key]} fenerini verdi! (${S.flags.lanternCount}/${N_L})\nKalplerin de doldu ❤️`, 5);
    if (S.flags.lanternCount === N_L) for (const nm of NAMES) notify(nm, "🎃 Bütün fenerler tamam! Saat kulesindeki Büyük Fener'i birlikte yakın.", 6);
  }
};

/* --- calls for help the story text does not already make --- */
const _interact = interact;
interact = async function (e) {
  const F = S.flags, me = S.active;
  if (e.type === 'pitir' && me === 'Bade' && F.pitirMet && !F.notes) callCousin('nota kâğıdı sahnenin altında, minik delikten sadece sen geçersin!');
  if (e.type === 'pitir' && me === 'Nehir' && F.pitirMet && !F.bells) callCousin('çanlar ağacın tepesinde, sen uzanabilirsin!');
  if (e.type === 'cemile' && F.cemileMet && !F.moonDrop && me === 'Nehir') callCousin('Ay ışığı damlası en üst rafta, sen uzanabilirsin!');
  return _interact(e);
};

/* --- shared moments: both girls must be together; the cousin watches and reads along --- */
function storyBusy(name) { const p = S.pl[name]; return !!(p.locked || p.dialog || p.overlayInput || p.awaitDir); }
async function together(why, dist = 4.5) {
  const me = S.active, you = otherName(me), a = S.chars[me], b = S.chars[you];
  if (!S.presence[you]) { await say(`${you} henüz oyunda değil. Bu yolculuğa ikiniz birlikte çıkmalısınız! Kuzenin oda koduyla katılınca devam edersiniz.`); return false; }
  if (Math.hypot(a.x - b.x, a.y - b.y) > dist || storyBusy(you)) {
    await say(`Kuzenini bekle! Bunu ${you} ile birlikte yapmalısınız. Ona telsizden haber verdim.`);
    callCousin(why); return false;
  }
  return true;
}
async function sharedScene(fn) {
  const me = S.active, you = otherName(me);
  S.shared = { owner: me }; S.pl[you].locked++; S.pl[you].dialog = null; S.pl[you].call = null;
  try { await fn(); }
  finally {
    S.active = me; S.shared = null; S.pl[you].locked = Math.max(0, S.pl[you].locked - 1);
    const a = S.chars[me], b = S.chars[you];
    if (Math.hypot(a.x - b.x, a.y - b.y) > 3) { const [fx, fy] = freeSpotNear(b.who, a.x - 0.9, a.y); b.x = fx; b.y = fy; b.trail = []; }
    S.pl[you].area = '';
  }
}
const _rideTrain = rideTrain, _rideHome = rideHome, _towerScene = towerScene, _skyScene = skyScene, _homeEnding = homeEnding;
rideTrain = async function () { if (await together('Korku Treni kalkıyor! Kondüktörün yanına gel, birlikte binelim.')) await sharedScene(_rideTrain); };
rideHome = async function () { if (await together('Eve dönen son tren kalkıyor! İstasyona gel, birlikte binelim.')) await sharedScene(_rideHome); };
towerScene = async function () {
  const F = S.flags, N = S.chars.Nehir, B = S.chars.Bade;
  if (F.lanternCount < N_L || Math.hypot(N.x - B.x, N.y - B.y) > 3.2 || storyBusy(otherName(S.active))) { if (F.lanternCount >= N_L) callCousin("saat kulesine gel, Büyük Fener'i birlikte yakalım!"); return _towerScene(); }
  await sharedScene(_towerScene);
};
skyScene = async function () { if (await together('Pilot Pırpır bekliyor! Helikopter pistine gel, birlikte uçalım.', 5)) await sharedScene(_skyScene); };
homeEnding = async function () {
  const you = otherName(S.active), b = S.chars[you];
  if (areaAt(b.x, b.y) !== 'Evimiz' || storyBusy(you)) {
    await say(`Eve geldik ama ${you} nerede? Annelerimize birlikte merhaba diyelim!`);
    callCousin('eve geldim, sen de gel! Annelerimiz bekliyor.');
    delete S.hints.homecoming;
    return;
  }
  await sharedScene(_homeEnding);
};

/* --- hazards move once and hurt whichever girl they touch --- */
function hurtAs(name, text, x, y) { const keep = S.active; S.active = name; try { hurt(text, x, y); } finally { S.active = keep; } }
function playersIn(area) { return NAMES.filter((n) => S.presence[n] && areaAt(S.chars[n].x, S.chars[n].y) === area); }
function updateHazardsMP(dt) {
  for (const p of S.pumpkins) {
    const L = PUMPKIN_LANES[p.lane];
    p.x += L.dir * L.sp * dt; p.rot += L.dir * L.sp * dt * 1.6;
    if (L.dir > 0 && p.x > 30.6) p.x = 16.6; if (L.dir < 0 && p.x < 16.6) p.x = 30.6;
    for (const n of playersIn('Balkabağı Tarlası')) { const c = S.chars[n]; if (Math.abs(c.x - p.x) < 0.7 && Math.abs(c.y - 0.15 - p.y) < 0.5) { Sound.play('roll'); hurtAs(n, 'Yuvarlanan balkabağı seni devirdi! Pat!\nKabak geçince hızlıca karşıya koş.', p.x, p.y - 0.6); } }
  }
  if (S.slimeBusy > 0) { S.slimeBusy -= dt; if (S.slimeBusy <= 0) S.candyAt = null; }
  const inYard = playersIn('Hurdalık');
  for (const s of S.slimes) {
    s.ph += dt; s.squish = Math.max(0, s.squish - dt); if (s.nap > 0) s.nap -= dt;
    let target = null, near = 99;
    for (const n of inYard) { const c = S.chars[n], d = Math.hypot(c.x - s.x, c.y - s.y); if (d < near) { near = d; target = n; } }
    let tx, ty, sp = 1.0;
    if (S.slimeBusy > 0 && S.candyAt) { tx = S.candyAt.x + Math.cos(s.ph * 2 + s.hx) * 0.35; ty = S.candyAt.y + Math.sin(s.ph * 2 + s.hx) * 0.2; sp = 2.2; s.state = 'eat'; }
    else if (target && near < 3.3 && !(s.nap > 0)) { tx = S.chars[target].x; ty = S.chars[target].y; sp = 1.65; if (s.state !== 'chase') { s.state = 'chase'; if (cooldown('slimeS', 1.0)) Sound.play('slime'); } }
    else { s.state = 'wander'; tx = s.hx + Math.cos(s.ph * 0.6) * 1.4; ty = s.hy + Math.sin(s.ph * 0.9) * 0.5; sp = 0.8; }
    tx = Math.max(50.4, Math.min(68.6, tx)); ty = Math.max(26.6, Math.min(33.8, ty));
    const dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy);
    if (d > 0.05) { const st = Math.min(d, sp * dt); s.x += dx / d * st; s.y += dy / d * st; }
    if (s.state === 'chase' && target && near < 0.6) { hurtAs(target, 'Balçık seni yapış yapış yaptı! Iyy!\nBalçıklar yaklaşınca Boşluk ile şeker at.', s.x, s.y); s.x = s.hx; s.y = s.hy; s.squish = 0.5; s.nap = 5; }
  }
  const B = S.bats, [tx, ty] = BAT_PATH[B.i], bdx = tx - B.x, bdy = ty - B.y, bd = Math.hypot(bdx, bdy);
  if (bd < 0.08) B.i = (B.i + 1) % BAT_PATH.length; else { const st = Math.min(bd, 1.7 * dt); B.x += bdx / bd * st; B.y += bdy / bd * st; }
  for (const n of playersIn('Mezarlık')) {
    const c = S.chars[n]; if (Math.hypot(c.x - B.x, c.y - 0.6 - B.y) >= 1.05) continue;
    if (n === 'Bade') { Sound.play('bats'); hurtAs(n, 'Yarasa sürüsü vampiri çimdikledi! Ay!\nYarasalardan uzak dur. Nehir\'i ise hiç ısırmazlar.', B.x, B.y); }
    else if (cooldown('batLove', 6)) { Sound.play('bats'); popup('💜', c.x, c.y - 1.8, '#d7c4ff', 22, 1.2); }
  }
}

/* --- the server tick: each girl takes her turn, then her story continues --- */
const soundEvents = []; let soundSerial = 0;
if (window.MULTIPLAYER_SERVER) Sound.play = (name) => { soundEvents.push({ id: ++soundSerial, name, owner: S.shared ? undefined : S.active }); if (soundEvents.length > 40) soundEvents.shift(); };
if (window.MULTIPLAYER_SERVER) Sound.note = (i) => { soundEvents.push({ id: ++soundSerial, name: 'note' + i, owner: S.shared ? undefined : S.active }); if (soundEvents.length > 40) soundEvents.shift(); };
function setKeys(player) {
  for (const k of ['left', 'right', 'up', 'down', 'act']) input[k] = !!player?.keys?.[k];
  input.swap = false; input.map = false;
  input.pressed = { ...(player?.pressed || {}) };
}
function startRoom(saved) {
  S.mode = 'play'; S.flags = freshFlags(); S.flags.introDone = true; S.manual = true; showOverlay(null);
  S.pl = { Nehir: freshPl(), Bade: freshPl() };
  S.chars = { Nehir: makeChar('Nehir', 80.8, 6.6), Bade: makeChar('Bade', 82.3, 6.6) };
  if (saved) {
    Object.assign(S.flags, saved.flags);
    if (saved.chars) for (const n of NAMES) if (saved.chars[n]) Object.assign(S.chars[n], saved.chars[n], { trail: [], moving: false });
    if (saved.pl) for (const n of NAMES) if (saved.pl[n]) Object.assign(S.pl[n], { hearts: saved.pl[n].hearts || 3, checkpoint: saved.pl[n].checkpoint || null, hints: saved.pl[n].hints || {} });
    if (S.flags.finished) S.mode = 'ending';
  }
  for (const n of NAMES) { if (!S.pl[n].checkpoint) S.pl[n].checkpoint = { x: S.chars[n].x, y: S.chars[n].y }; }
  S.active = 'Nehir';
  resetHazards(); updateHUD();
}
function savedState() {
  return { flags: S.flags, chars: Object.fromEntries(NAMES.map((n) => [n, { x: S.chars[n].x, y: S.chars[n].y, dir: S.chars[n].dir }])),
    pl: Object.fromEntries(NAMES.map((n) => [n, { hearts: S.pl[n].hearts, checkpoint: S.pl[n].checkpoint, hints: S.pl[n].hints }])) };
}
let ticking = false;
async function tickRoom(dt, players, flush) {
  if (ticking) return; ticking = true;
  try {
    S.presence = Object.fromEntries(NAMES.map((n) => [n, !!players[n]?.online]));
    S.time += dt;
    updateEffects(dt);
    if (S.mode === 'play' && !S.shared) updateHazardsMP(dt);
    for (const name of NAMES) {
      S.active = name;
      const p = PL(), pl = players[name], online = !!pl?.online, c = P();
      for (let i = waiters.length - 1; i >= 0; i--) { const w = waiters[i]; if (w.owner === name && S.time >= w.t) { waiters.splice(i, 1); w.r(); } }
      for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; if (tw.owner !== name) continue; tw.t += dt; const k = Math.min(1, tw.t / tw.dur); tw.fn(k); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
      if (c.hurtT > 0) c.hurtT -= dt;
      if (p.toast.t > 0) p.toast.t -= dt;
      else if (p.news.length && !p.dialog) p.toast = p.news.shift();
      setKeys(online ? pl : null);
      if (S.mode === 'play' && online) {
        S.playTime += dt / 2;
        if (!p.hints.opening && !p.locked) { p.hints.opening = true; opening(); }
        if (p.awaitDir && !p.dialog) { for (const d of ['up', 'down', 'left', 'right']) if (input.pressed[d]) { const r = p.awaitDir; p.awaitDir = null; r(d); break; } }
        else if (p.dialog) handleDialogInput();
        else if (!p.locked && !p.overlayInput) {
          updateActive(dt);
          if (p.talkQ.length) { const fn = p.talkQ.shift(); c.moving = false; scene(fn); }
          else checkHiddenNearby();
          if (!p.locked && !checkDoors() && input.pressed.act) {
            const e = nearestInteractable(), ca = contextAction();
            if (e) interact(e); else if (ca) ca.fn(); else if (cooldown('nothing' + name, 2.5)) showToast('Burada incelenecek bir şey yok.', 1.8);
          }
        } else c.moving = false;
        updateSonar(dt);
        if (!S.shared) checkAreaTitle();
        if (p.areaT > 0) p.areaT -= dt;
        p.hintTimer += dt;
        if (p.hintTimer > 150 && !p.dialog && !p.locked) { p.hintTimer = 0; showToast('💡 İpucu: ' + nextHint() + '\nM tuşu: harita · Uzaktaki kuzeninle telsizden konuşursun.', 7); }
        if (p.call && S.time - p.call.t > 90) p.call = null;
      } else c.moving = false;
      if (pl) pl.pressed = {};
      input.pressed = {};
      if (flush) await flush();
    }
  } finally { ticking = false; }
}
function commandRoom(name, command, payload) {
  S.active = name; const p = PL();
  if (command === 'dialog' && p.dialog) {
    const d = p.dialog;
    if (d.choices && (!Number.isInteger(payload) || payload < 0 || payload >= d.choices.length)) return false;
    closeDialog(d.choices ? payload : 0); return true;
  }
  return false;
}
const SHARED_FIELDS = ['mode', 'flags', 'chars', 'time', 'playTime', 'drakPos', 'leaving', 'gift', 'dance', 'lift', 'hang', 'spin', 'beam', 'heliIn', 'howl', 'cemileFly', 'smoke', 'batPuff', 'ring', 'rings', 'pumpkins', 'slimes', 'slimeBusy', 'candyAt', 'bats', 'ride', 'sky', 'festT', 'frenkFixed', 'ending', 'shake', 'shared'];
function packFor(name) {
  S.active = name;
  const p = PL(), owner = S.shared && S.shared.owner !== name ? S.pl[S.shared.owner] : null;
  const d = p.dialog || (owner && owner.dialog), spectator = !p.dialog && !!(owner && owner.dialog);
  const state = Object.fromEntries(SHARED_FIELDS.filter((k) => S[k] !== undefined).map((k) => [k, S[k]]));
  state.particles = S.particles.slice(-140); state.popups = S.popups;
  const me = { hearts: p.hearts, camTarget: owner ? owner.camTarget : p.camTarget, area: p.area, areaT: p.areaT, areaName: p.areaName, areaShownAt: p.areaShownAt,
    fade: owner ? owner.fade : p.fade, fadeCol: owner ? owner.fadeCol : p.fadeCol, call: p.call, locked: p.locked ? 1 : 0, hints: { opening: !!p.hints.opening } };
  const you = otherName(name), yc = S.chars[you];
  return JSON.parse(JSON.stringify({ state, me,
    dialog: d ? { text: d.text, speaker: d.speaker, choices: d.choices, loud: d.loud, sel: d.sel, born: d.born, spectator } : null,
    toast: p.toast,
    endingHtml: S.mode === 'ending' ? $('ending-card').innerHTML : '',
    entities: ENTS.filter((e) => e.type === 'heavy').map((e) => ({ id: e.id, dx: e.dx || 0, dy: e.dy || 0 })),
    sounds: soundEvents.filter((s) => s.owner === name || s.owner === undefined),
    cousin: { name: you, area: areaAt(yc.x, yc.y), busy: storyBusy(you), x: yc.x, y: yc.y },
  }));
}
/* --- on the browser: smooth camera and walking; the cousin and calls on the map --- */
function cosmetic(dt) { updateCamera(dt); for (const c of Object.values(S.chars)) if (c.moving) c.walkT += dt; if (S.pl[S.active].areaT > 0) S.pl[S.active].areaT -= dt; }
const _drawTownMap = drawTownMap;
drawTownMap = function () {
  _drawTownMap();
  const g = $('map-canvas').getContext('2d'), s = 10, me = S.active, you = otherName(me), yc = S.chars[you];
  const spot = (c) => { if (c.x < 72) return [c.x, c.y]; const d = DOORS.find((q) => q.name === areaAt(c.x, c.y)); return d ? d.out : [c.x, c.y]; };
  const [yx, yy] = spot(yc);
  g.font = '22px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(you === 'Bade' ? '🧛' : '🦇', yx * s, yy * s - 6);
  g.font = 'bold 13px "Trebuchet MS",sans-serif'; g.lineWidth = 3; g.strokeStyle = '#fffaf0'; g.strokeText(you, yx * s, yy * s - 24); g.fillStyle = '#3a2a1b'; g.fillText(you, yx * s, yy * s - 24);
  const call = S.pl[me].call;
  if (call) { const [cx, cy] = spot(call); g.font = '26px sans-serif'; g.fillText('📍', cx * s, cy * s - 30); }
};
window.__multiplayer = { S, input, startRoom, tickRoom, commandRoom, packFor, savedState, storyBusy, cosmetic, renderDialog, updateHUD, showOverlay, toggleMap, drawTownMap, drawPortraits, showToast, snapCamera, Sound, ENTS,
  interact, ent, closeDialog, freshFlags, hurt, saveCheckpoint, solidFor, blockedAt, contextAction, areaAt, DOORS, nearestInteractable };
