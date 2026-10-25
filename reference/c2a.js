
/* ---------------------------------------------------------------------
   10. CANVAS + HUD
   --------------------------------------------------------------------- */
const cv = $('game');
let ctx = cv.getContext('2d');
let DPR = 1, paperC = null;
const NAME_UP = { Nehir: 'NEHİR', Bade: 'BADE' };
const SAY = {
  Nehir: 'NEHİR', Bade: 'BADE', funda: 'FUNDA', basak: 'BAŞAK', duru: 'DURU', pitir: 'KARA KEDİ PITIRCIK', ayse: 'AYŞE TEYZE', hasan: 'HASAN AMCA', kond: 'KONDÜKTÖR TAKIRTI',
  drakos: 'KONT DRAKOŞ', bora: 'KABAK KAFA BORA', mimi: 'MUMYA MİMİ', kurtul: 'KURT ADAM KURTUL', frenk: 'FRENK',
  cemile: 'CADI CEMİLE', hulya: 'HAYALET HÜLYA', selo: 'HAYALET KÖPEK SELO', kemik: 'İSKELET KEMİK', pirpir: 'PİLOT PIRPIR', gurgur: 'BULUT DEVİ GÜRGÜR',
};
const F_NAME = Object.fromEntries(FRIENDS.map((f) => [f.key, f.name]));

let lastInv = '';
function updateHUD() {
  let h = '';
  for (let i = 0; i < 3; i++) h += i < S.hearts ? '<span>❤️</span>' : '<span class="lost">❤️</span>';
  $('hud-hearts').innerHTML = h;
  const F = S.flags;
  const an = F.arrived ? FRIENDS.map((a) => `<span class="${F.lanterns[a.key] ? 'got' : ''}" title="${a.name}">🎃</span>`).join('') + `<b>${F.lanternCount}/${N_L}</b>` : '';
  if ($('hud-animals').dataset.last !== an) { $('hud-animals').innerHTML = an; $('hud-animals').dataset.last = an; }
  const rows = [];
  if (F.candyBag) rows.push(['candy', '🍬', 'Şeker çantası']);
  if (F.tickets && !F.ticketsGiven) rows.push(['tix', '🎟️', 'İki tren bileti']);
  if (F.bandage && !F.lanterns.mimi) rows.push(['band', '🧻', 'Sargı rulosu']);
  if (F.bolt && !F.lanterns.frenk) rows.push(['bolt', '🔩', 'Frenk\'in cıvatası']);
  if (F.potion && !F.lanterns.cemile) rows.push(['pot', '🧪', 'Uçan süpürge iksiri']);
  if (F.straw && !F.lanterns.cemile) rows.push(['straw', '🌾', 'Altın saman']);
  if (F.moonDrop && !F.potion) rows.push(['moon', '🌙', 'Ay ışığı damlası']);
  if (F.bells && !F.lanterns.pitir) rows.push(['bells', '🔔', 'Pıtırcık\'ın çanları']);
  if (F.notes && !F.lanterns.pitir) rows.push(['notes', '📜', 'Nota kâğıdı']);
  if (F.musicBox && !F.lanterns.hulya) rows.push(['box', '🎵', 'Müzik kutusu']);
  if (F.bone && !F.lanterns.selo) rows.push(['bone', '🦴', 'Selo\'nun kemiği']);
  if (F.lanternCount && !F.towerLit) rows.push(['lan' + F.lanternCount, '🎃', `Balkabağı feneri ${F.lanternCount}/${N_L}`]);
  const html = '<h3>🎒 ÇANTA</h3>' + (rows.length
    ? rows.map(([k, ic, name]) => `<div class="it${lastInv && !lastInv.includes('data-k="' + k + '"') ? ' new' : ''}" data-k="${k}"><span>${ic}</span><span>${name}</span></div>`).join('')
    : '<div class="empty">(boş)</div>');
  const inv = $('hud-inv');
  if (inv.dataset.last !== html) { inv.innerHTML = html; inv.dataset.last = html; lastInv = html; }
  const st = S.active === 'Nehir'
    ? 'Şimdi: NEHİR 🦇\n📡 ses dalgası: gizli şeyleri bulur\n🐭 küçük: dar yerlerden geçer\n🙃 tavana baş aşağı asılır'
    : 'Şimdi: BADE 🧛\n🌙 karanlıkta görür\n📏 uzun: yükseğe uzanır\n💪 güçlü: ağır şeyleri iter';
  if ($('hud-status').textContent !== st) $('hud-status').textContent = st;
  const kk = `<span><kbd>Q</kbd> ${S.active === 'Nehir' ? "Bade'ye" : "Nehir'e"} geç</span><span><kbd>M</kbd> Harita</span><span><kbd>Boşluk</kbd> İncele</span>`;
  if ($('hud-keys').innerHTML !== kk) $('hud-keys').innerHTML = kk;
}

/* ---------------------------------------------------------------------
   11. SMALL HELPERS
   --------------------------------------------------------------------- */
function once(k) { if (S.hints[k]) return false; S.hints[k] = true; return true; }
function cooldown(k, s) { if (S.cool[k] !== undefined && S.time - S.cool[k] < s) return false; S.cool[k] = S.time; return true; }
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const ent = (id) => ENTS.find((e) => e.id === id);
const inDarkStreet = (x, y) => x >= 45.6 && x < 70 && y >= 15 && y < 22;
const streetLit = () => { const L = S.flags.lamps; return !!(L[1] && L[2] && L[3]) || S.flags.skyDone; };

/* ---------------------------------------------------------------------
   12. MOVEMENT: the active cousin walks, the other follows
   --------------------------------------------------------------------- */
function tryMove(c, dx, dy) {
  let moved = false;
  if (dx) {
    if (!blockedAt(c.who, c.x + dx, c.y)) { c.x += dx; moved = true; }
    else if (!dy) {
      for (const k of [0.12, 0.24, 0.36]) for (const sg of [-1, 1]) {
        if (!moved && !blockedAt(c.who, c.x + dx, c.y + sg * k) && !blockedAt(c.who, c.x, c.y + sg * Math.min(k, Math.abs(dx)))) { c.y += sg * Math.min(k, Math.abs(dx)); moved = true; }
      }
    }
  }
  if (dy) {
    if (!blockedAt(c.who, c.x, c.y + dy)) { c.y += dy; moved = true; }
    else if (!dx) {
      for (const k of [0.12, 0.24, 0.36]) for (const sg of [-1, 1]) {
        if (!moved && !blockedAt(c.who, c.x + sg * k, c.y + dy) && !blockedAt(c.who, c.x + sg * Math.min(k, Math.abs(dy)), c.y)) { c.x += sg * Math.min(k, Math.abs(dy)); moved = true; }
      }
    }
  }
  return moved;
}
function dirOf(dx, dy) { return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down'); }
function updateActive(dt) {
  const c = P();
  const ix = (input.right ? 1 : 0) - (input.left ? 1 : 0), iy = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  if (ix || iy) {
    const l = Math.hypot(ix, iy), sp = SPEED * dt;
    tryMove(c, ix / l * sp, iy / l * sp);
    c.dir = dirOf(ix, iy); c.moving = true; c.walkT += dt;
    const lastP = c.trail[c.trail.length - 1];
    if (!lastP || Math.hypot(lastP.x - c.x, lastP.y - c.y) > 0.22) { c.trail.push({ x: c.x, y: c.y }); if (c.trail.length > 500) c.trail.shift(); }
  } else c.moving = false;
}
function findPath(who, sx, sy, gx, gy) {
  const sc = Math.floor(sx), sr = Math.floor(sy - 0.15), gc = Math.floor(gx), gr = Math.floor(gy - 0.15);
  const key = (c, r) => c * 100 + r, prev = new Map([[key(sc, sr), -1]]), q = [[sc, sr]];
  let n = 0;
  while (q.length && n++ < 6000) {
    const [c, r] = q.shift();
    if (c === gc && r === gr) { const out = []; let k = key(c, r); while (k !== -1) { out.unshift({ x: Math.floor(k / 100) + 0.5, y: (k % 100) + 0.72 }); k = prev.get(k); } out.shift(); return out; }
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nc = c + dc, nr = r + dr, k = key(nc, nr), t = tileAt(nc, nr);
      if (prev.has(k) || solidFor(who, nc, nr) || t === 'd' || t === 'e') continue;
      prev.set(k, key(c, r)); q.push([nc, nr]);
    }
  }
  return null;
}
function updateFollower(dt) {
  const a = P(), f = other(), tr = a.trail;
  if (f.repathT > 0) f.repathT -= dt;
  if (dist(a, f) < 1.2) { f.moving = false; f.stuck = 0; f.path = null; return; }
  let t, usingPath = false;
  const far = dist(a, f);
  if (far > 5 && !(f.path && f.path.length) && !(f.repathT > 0)) {
    f.repathT = 1.2; const pth = findPath(f.who, f.x, f.y, a.x, a.y); if (pth) { f.path = pth; a.trail = []; }
  }
  if (f.path && f.path.length) { t = f.path[0]; usingPath = true; }
  else {
    while (tr.length && blockedAt(f.who, tr[0].x, tr[0].y)) tr.shift();
    t = tr.length ? tr[0] : a;
  }
  const dx = t.x - f.x, dy = t.y - f.y, d = Math.hypot(dx, dy);
  if (d < 0.1) { if (usingPath) f.path.shift(); else if (tr.length) tr.shift(); return; }
  const sp = Math.min(d, SPEED * (far > 3 ? 1.5 : 1.08) * dt);
  const ok = tryMove(f, dx / d * sp, dy / d * sp);
  f.moving = ok;
  if (ok) { f.walkT += dt; f.dir = dirOf(dx, dy); f.stuck = 0; return; }
  f.stuck = (f.stuck || 0) + dt;
  if (f.stuck > 0.35 && !(f.repathT > 0)) {
    f.path = findPath(f.who, f.x, f.y, a.x, a.y); f.stuck = 0; f.repathT = 1.2;
    if (f.path) a.trail = [];
  }
}
function freeSpotNear(who, x, y) {
  for (const [ox, oy] of [[0, 0], [-0.9, 0], [0.9, 0], [0, 0.7], [0, -0.7], [-0.9, 0.7], [0.9, 0.7]]) if (!blockedAt(who, x + ox, y + oy)) return [x + ox, y + oy];
  return [x, y];
}
function placeBoth(x, y) {
  const a = P(), f = other();
  a.x = x; a.y = y; a.trail = []; f.trail = []; a.path = null; f.path = null;
  const [fx, fy] = freeSpotNear(f.who, x - 0.9, y);
  f.x = fx; f.y = fy; f.moving = false; a.moving = false;
  snapCamera();
}
async function fadeOut(d = 0.22, col = '20,14,30') { await tween(d, (k) => { S.fade = k; S.fadeCol = col; }); S.fade = 1; }
async function fadeIn(d = 0.25) { await tween(d, (k) => { S.fade = 1 - k; }); S.fade = 0; }
async function teleport(x, y, dir) {
  await scene(async () => {
    Sound.play('click');
    await fadeOut();
    placeBoth(x, y); P().dir = dir || P().dir;
    S.area = ''; checkAreaTitle();
    saveCheckpoint(true); Sound.play('checkpoint'); popup('💾 Kaydedildi', x, y - 1.9, '#bff0c4', 20, 1.6);
    await fadeIn();
  });
}
function checkDoors() {
  const c = P(), tx = Math.floor(c.x), ty = Math.floor(c.y - 0.15), t = tileAt(tx, ty);
  if (t === 'd') { const d = DOORS.find((q) => q.door[0] === tx && q.door[1] === ty); if (d) { teleport(d.inside[0], d.inside[1], 'up'); return true; } }
  if (t === 'e') { const d = DOORS.find((q) => q.exit[0] === tx && q.exit[1] === ty); if (d) { teleport(d.out[0], d.out[1], 'down'); return true; } }
  return false;
}
function swapCousin() {
  S.active = S.active === 'Nehir' ? 'Bade' : 'Nehir';
  S.chars.Nehir.trail = []; S.chars.Bade.trail = []; S.chars.Nehir.path = null; S.chars.Bade.path = null;
  const c = P(); popup(NAME_UP[c.who], c.x, c.y - (c.who === 'Bade' ? 2.0 : 1.6), c.who === 'Bade' ? '#ff9db0' : '#d7c4ff', 22, 1.1);
  Sound.play('flip'); updateHUD();
}

/* ---------------------------------------------------------------------
   13. HAZARDS: rolling pumpkins, sticky slimes, the bat swarm
   --------------------------------------------------------------------- */
function resetHazards() {
  S.pumpkins = [];
  PUMPKIN_LANES.forEach((L, i) => { for (let k = 0; k < 2; k++) S.pumpkins.push({ lane: i, x: L.dir > 0 ? 16.6 + k * 7 : 30.4 - k * 7, y: L.y, rot: 0 }); });
  S.slimes = SLIME_HOMES.map(([x, y], i) => ({ hx: x, hy: y, x, y, ph: i * 2.1, state: 'wander', squish: 0 }));
  S.slimeBusy = 0; S.candyAt = null;
  S.bats = { i: 1, x: BAT_PATH[0][0], y: BAT_PATH[0][1] };
}
function hurt(text, fromX, fromY) {
  const c = P();
  if (c.hurtT > 0 || S.locked) return;
  S.hearts--; c.hurtT = 1.6; Sound.play('hurt'); shake(0.35); updateHUD();
  const dx = c.x - fromX, dy = c.y - fromY, d = Math.hypot(dx, dy) || 1;
  for (let i = 0; i < 6; i++) tryMove(c, dx / d * 0.18, dy / d * 0.18);
  if (S.hearts <= 0) { gameOver(); return; }
  if (once('heartTip')) showToast(text + '\n❤️ Üzülme! Meydandaki sıcak kakao ya da bir canavar arkadaşa yardım etmek kalplerini doldurur.', 6.5);
  else showToast(text, 2.8);
}
function updateHazards(dt) {
  const c = P(), area = areaAt(c.x, c.y), F = S.flags;
  // --- rolling pumpkins in the field
  for (const p of S.pumpkins) {
    const L = PUMPKIN_LANES[p.lane];
    p.x += L.dir * L.sp * dt; p.rot += L.dir * L.sp * dt * 1.6;
    if (L.dir > 0 && p.x > 30.6) p.x = 16.6; if (L.dir < 0 && p.x < 16.6) p.x = 30.6;
    if (area === 'Balkabağı Tarlası' && Math.abs(c.x - p.x) < 0.7 && Math.abs(c.y - 0.15 - p.y) < 0.5) {
      Sound.play('roll'); hurt('Yuvarlanan balkabağı seni devirdi! Pat!\nKabak geçince hızlıca karşıya koş.', p.x, p.y - 0.6);
    }
  }
  // --- slimes in the junkyard (they love candy)
  if (S.slimeBusy > 0) { S.slimeBusy -= dt; if (S.slimeBusy <= 0) S.candyAt = null; }
  for (const s of S.slimes) {
    s.ph += dt; s.squish = Math.max(0, s.squish - dt); if (s.nap > 0) s.nap -= dt;
    let tx, ty, sp = 1.0;
    const near = Math.hypot(c.x - s.x, c.y - s.y);
    if (S.slimeBusy > 0 && S.candyAt) { tx = S.candyAt.x + Math.cos(s.ph * 2 + s.hx) * 0.35; ty = S.candyAt.y + Math.sin(s.ph * 2 + s.hx) * 0.2; sp = 2.2; s.state = 'eat'; }
    else if (area === 'Hurdalık' && near < 3.3 && S.mode === 'play' && !(s.nap > 0)) { tx = c.x; ty = c.y; sp = 1.65; if (s.state !== 'chase') { s.state = 'chase'; if (cooldown('slimeS', 1.0)) Sound.play('slime'); } }
    else { s.state = 'wander'; tx = s.hx + Math.cos(s.ph * 0.6) * 1.4; ty = s.hy + Math.sin(s.ph * 0.9) * 0.5; sp = 0.8; }
    tx = Math.max(50.4, Math.min(68.6, tx)); ty = Math.max(26.6, Math.min(33.8, ty));
    const dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy);
    if (d > 0.05) { const st = Math.min(d, sp * dt); s.x += dx / d * st; s.y += dy / d * st; }
    if (s.state === 'chase' && near < 0.6) { hurt('Balçık seni yapış yapış yaptı! Iyy!\nBalçıklar yaklaşınca Boşluk ile şeker at.', s.x, s.y); s.x = s.hx; s.y = s.hy; s.squish = 0.5; s.nap = 5; }
  }
  // --- the bat swarm in the graveyard: they only pinch the vampire
  const B = S.bats;
  const [tx, ty] = BAT_PATH[B.i], bdx = tx - B.x, bdy = ty - B.y, bd = Math.hypot(bdx, bdy);
  if (bd < 0.08) B.i = (B.i + 1) % BAT_PATH.length; else { const st = Math.min(bd, 1.7 * dt); B.x += bdx / bd * st; B.y += bdy / bd * st; }
  if (area === 'Mezarlık' && Math.hypot(c.x - B.x, c.y - 0.6 - B.y) < 1.05) {
    if (c.who === 'Bade') { Sound.play('bats'); hurt("Yarasa sürüsü vampiri çimdikledi! Ay!\nQ ile Nehir'e geç: yarasalar Nehir'i çok sever.", B.x, B.y); }
    else if (cooldown('batLove', 6)) { Sound.play('bats'); popup('💜', c.x, c.y - 1.8, '#d7c4ff', 22, 1.2); }
  }
}

/* ---------------------------------------------------------------------
   14. WHAT CAN BE TOUCHED
   --------------------------------------------------------------------- */
function entPos(e) {
  if (e.id === 'drakos' && S.drakPos) return S.drakPos;
  return e;
}
function entActive(e) {
  const F = S.flags;
  switch (e.type) {
    case 'knock': return !F.homeBack;
    case 'bowl3': return !F.bowl3 && !F.homeBack;
    case 'note3': return !F.note3 && !F.homeBack;
    case 'trainGate': return !F.arrived;
    case 'kond': return e.id === 'kond2' ? F.skyDone && !F.homeBack : !F.arrived;
    case 'duru': return true;
    case 'moonDrop': return !F.moonDrop;
    case 'pitir': return !F.lanterns.pitir;
    case 'bells': return !F.bells;
    case 'notes': return !F.notes;
    case 'drakos': return F.arrived && !F.skyDone;
    case 'bora': return F.arrived;
    case 'bigLantern': return F.arrived && !F.towerLit;
    case 'heli': return F.towerLit && !F.skyDone;
    case 'jar': return !F.bandage;
    case 'mimi': return !F.lanterns.mimi;
    case 'lamp': return !F.lamps[e.n];
    case 'kurtul': return !F.lanterns.kurtul;
    case 'frenk': return !F.lanterns.frenk;
    case 'heavy': return !F.moved[e.id];
    case 'bolt': return !!F.moved.junk && !F.bolt;
    case 'cemile': return !F.lanterns.cemile;
    case 'cauldron': return !F.potion;
    case 'straw': return !F.straw;
    case 'selo': return !F.lanterns.selo;
    case 'prints': return !F.bone;
    case 'dig': return !F.bone;
    case 'hulya': return !F.lanterns.hulya;
    case 'musicBox': return !F.musicBox;
    default: return true;
  }
}
// things in the dark street that only the vampire's eyes can see
function darkHidden(e) {
  if (!e.dark) return false;
  if (e.type === 'kurtul') return !streetLit();
  return true;   // Selo the ghost dog hides in the shadows: only vampire eyes see him
}
function entVisibleFor(e, who) {
  if (!entActive(e)) return false;
  if (e.hidden && who !== 'Nehir') return false;
  if (darkHidden(e) && who !== 'Bade') return false;
  return true;
}
function nearestInteractable() {
  const c = P(); let best = null, bd = 1e9;
  for (const e of ENTS) {
    if (!entVisibleFor(e, c.who)) continue;
    const p = entPos(e), r = e.r || 1.4;
    const d = Math.hypot(p.x - c.x, p.y - (c.y - 0.3));
    if (d < r && d < bd) { bd = d; best = e; }
  }
  return best;
}
function contextAction() {
  const F = S.flags, c = P(), area = areaAt(c.x, c.y);
  if (area === 'Hurdalık' && F.candyBag && S.slimeBusy <= 0) return { label: 'ŞEKER AT 🍬', fn: throwCandy };
  return null;
}
function verbOf(e) {
  const c = P(), F = S.flags;
  if (e.type === 'jar') return c.who === 'Nehir' ? 'SES DALGASI 📡' : 'KAVANOZU AL';
  if (e.high && c.who === 'Nehir') return 'ÇOK YÜKSEK';
  if (e.hang) return c.who === 'Nehir' ? 'BAŞ AŞAĞI ASIL 🙃' : 'ÇOK YÜKSEK';
  switch (e.type) {
    case 'mom': case 'duru': case 'pitir': case 'kond': case 'drakos': case 'mimi': case 'kurtul': case 'frenk': case 'cemile': case 'hulya': case 'selo': case 'kemik': return 'KONUŞ';
    case 'bora': return 'KAKAO İÇ ☕';
    case 'knock': return F.knocked[e.n] && e.n !== 2 ? 'KAPI' : 'KAPIYI ÇAL';
    case 'bowl3': return 'ŞEKER AL';
    case 'trainGate': return 'TRENE BİN';
    case 'bigLantern': return F.lanternCount >= N_L ? 'BÜYÜK FENERİ YAK' : 'İNCELE';
    case 'bells': return 'ÇANLARI AL';
    case 'notes': return 'NOTAYI AL';
    case 'moonDrop': return 'ŞİŞEYİ AL';
    case 'heli': return 'HELİKOPTERE BİN';
    case 'lamp': return 'LAMBAYI YAK';
    case 'heavy': return c.who === 'Bade' ? 'İT 💪' : 'İNCELE';
    case 'bolt': return 'SES DALGASI 📡';
    case 'straw': return 'AL';
    case 'dig': return 'KAZ';
    case 'prints': return 'İZLERE BAK';
    case 'cauldron': return 'İKSİR YAP';
    case 'recipe': return 'TARİFİ OKU';
    case 'note3': return 'NOTU OKU';
    default: return 'İNCELE';
  }
}
function throwCandy() {
  const c = P(), off = { left: [-2, 0], right: [2, 0], up: [0, -1.6], down: [0, 1.6] }[c.dir] || [0, 1.6];
  S.candyAt = { x: Math.max(50.6, Math.min(68.4, c.x + off[0])), y: Math.max(26.8, Math.min(33.6, c.y + off[1])) };
  S.slimeBusy = 15; Sound.play('pickup'); popup('🍬', S.candyAt.x, S.candyAt.y - 0.5, '#fff3c4', 26);
  showToast('Bir şeker attın! Balçıklar şekere koştu.\nBiraz oyalanırlar, acele et!', 3);
}
