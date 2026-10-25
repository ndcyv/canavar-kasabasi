
/* ---------------------------------------------------------------------
   20. DRAWING: ground, buildings, the heroes, the monsters
   --------------------------------------------------------------------- */
const BUILDINGS = [
  { x1: 3, y1: 2, x2: 9, y2: 6, wall: '#e8c9a0', roof: '#7a3b3b', kind: 'home', rs: 'hip' },
  { x1: 12, y1: 2, x2: 16, y2: 5, wall: '#c9b8d8', roof: '#4a3a6a', kind: 'house', n: 1, rs: 'twin' },
  { x1: 18, y1: 2, x2: 22, y2: 5, wall: '#b8d0c0', roof: '#3a5a4a', kind: 'house', n: 2, rs: 'flat' },
  { x1: 24, y1: 2, x2: 28, y2: 5, wall: '#d8c0a8', roof: '#6a4a3a', kind: 'house', n: 3, rs: 'mansard' },
  { x1: 31, y1: 2, x2: 38, y2: 6, wall: '#3e2c50', roof: '#1e1626', kind: 'train', name: '👻 KORKU TRENİ', sign: '#b3122e' },
  { x1: 38, y1: 21, x2: 41, y2: 25, wall: '#77748a', roof: '#3a3448', kind: 'tower' },
  { x1: 6, y1: 17, x2: 13, y2: 22, wall: '#d9c08a', roof: '#b89a5a', kind: 'mummy', name: '🧻 MUMYA EVİ', sign: '#8a6a30' },
  { x1: 5, y1: 35, x2: 12, y2: 39, wall: '#5e4e70', roof: '#2a1f3a', kind: 'witch', name: '🧹 CADI KULÜBESİ', sign: '#6a2a8a' },
  { x1: 60, y1: 37, x2: 66, y2: 40, wall: '#83838c', roof: '#55555c', kind: 'crypt', name: '🕯️ MAHZEN', sign: '#3a3a44' },
  { x1: 47, y1: 15, x2: 52, y2: 17, wall: '#4a4256', roof: '#2a2434', kind: 'spooky', rs: 'crooked' },
  { x1: 54, y1: 15, x2: 59, y2: 17, wall: '#4e4a5c', roof: '#3a2a2a', kind: 'spooky', rs: 'turret' },
  { x1: 61, y1: 15, x2: 68, y2: 17, wall: '#46405a', roof: '#2a3430', kind: 'spooky', rs: 'mansard' },
];
const FLOOR_COL = { 'Evimiz': ['#d9b98e', '#cfae82'], 'Mumya Evi': ['#d8c49a', '#cdb88c'], 'Cadı Kulübesi': ['#6a5878', '#625070'], 'Mahzen': ['#7c7c84', '#74747c'] };
const WALL_COL = { 'Evimiz': '#f0d2a8', 'Mumya Evi': '#e3cf9a', 'Cadı Kulübesi': '#4e3e62', 'Mahzen': '#5c5c66' };
const DECOR_PUMPKINS = [[5.2, 7.3], [8.6, 7.3], [13.2, 6.5], [15.8, 6.5], [19.2, 6.5], [21.8, 6.5], [31.6, 7.6], [37.9, 8.3], [27.6, 16.4], [43.2, 16.4], [8.0, 23.6], [11.2, 23.6], [6.8, 40.5], [10.4, 40.5], [46.2, 39.9], [24.0, 34.4], [26.2, 34.4], [45.0, 30.9], [36.4, 26.6], [33.2, 26.6], [59.5, 41.9]];
const SQUARE_LAMPS = [[26.6, 26.6], [44.4, 26.6], [26.6, 34.6], [44.4, 34.6]];
const STREET_LAMPS = [[11, 10.4], [23, 10.4], [35, 10.4]];

function drawGround(c, r, x, y) {
  const t = tileAt(c, r), h = hash(c, r);
  const grass = (a, b) => {
    ctx.fillStyle = (c + r) % 2 ? a : b; ctx.fillRect(x, y, TS, TS);
    if (h < 0.3) { ctx.strokeStyle = 'rgba(20,40,25,.6)'; ctx.lineWidth = 1.5; const gx = x + h * 120 % 36 + 6, gy = y + (h * 977) % 30 + 12; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx - 2, gy - 6); ctx.moveTo(gx + 3, gy); ctx.lineTo(gx + 4, gy - 7); ctx.stroke(); }
    if (h > 0.955) { const mx = x + 12 + h * 20, my = y + 30; ctx.fillStyle = '#e8e0f0'; ctx.fillRect(mx - 1, my - 5, 2, 5); ctx.fillStyle = pick2(['#c9a0ff', '#ff9db0', '#9fe0ff'], h); ctx.beginPath(); ctx.ellipse(mx, my - 5, 4, 2.6, 0, Math.PI, 0); ctx.fill(); }
  };
  switch (t) {
    case 'g': case 'T': case 'h': case 'B': case 'n': grass('#36553d', '#335139'); break;
    case 'f': grass(r >= 36 && c >= 47 ? '#2f4436' : '#36553d', r >= 36 && c >= 47 ? '#2c4033' : '#335139'); if (c >= 49 && c <= 69 && r >= 25 && r <= 34) { ctx.fillStyle = '#5d5448'; ctx.fillRect(x, y, TS, TS); } break;
    case 'q': case 'Y': grass('#2f4436', '#2c4033'); break;
    case 'p': case 'd':
      if (r < 12) { ctx.fillStyle = '#4a4a56'; ctx.fillRect(x, y, TS, TS); if (r === 8 && c % 3 === 0) { ctx.fillStyle = 'rgba(240,230,200,.5)'; ctx.fillRect(x + 6, y + TS - 3, 22, 3); } }
      else {
        ctx.fillStyle = '#6b6478'; ctx.fillRect(x, y, TS, TS);
        ctx.strokeStyle = 'rgba(30,25,40,.35)'; ctx.lineWidth = 1.5;
        for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const ox = (i + (j % 2) * 0.5) * 24; rr(ctx, x + ox + 1, y + j * 24 + 1, 22, 22, 6); ctx.stroke(); }
      }
      break;
    case 'v': ctx.fillStyle = '#5b4030'; ctx.fillRect(x, y, TS, TS); ctx.strokeStyle = 'rgba(30,18,10,.35)'; ctx.lineWidth = 2; for (const yy of [12, 28, 44]) { ctx.beginPath(); ctx.moveTo(x, y + yy); ctx.lineTo(x + TS, y + yy); ctx.stroke(); } break;
    case 'j': case 'J': ctx.fillStyle = '#5d5448'; ctx.fillRect(x, y, TS, TS); if (h < 0.3) { ctx.fillStyle = 'rgba(20,20,30,.35)'; ctx.beginPath(); ctx.ellipse(x + 10 + h * 60, y + 24, 9, 4, 0, 0, 7); ctx.fill(); } if (h > 0.85) { ctx.fillStyle = '#8a8a90'; ctx.fillRect(x + 30, y + 30, 6, 3); } break;
    case 'R':
      ctx.fillStyle = '#4a4038'; ctx.fillRect(x, y, TS, TS);
      ctx.fillStyle = '#6a4a30'; for (let i = 0; i < 3; i++) ctx.fillRect(x + 4 + i * 16, y + 6, 8, TS - 12);
      ctx.fillStyle = '#a8a8b4'; ctx.fillRect(x, y + 12, TS, 4); ctx.fillRect(x, y + TS - 16, TS, 4);
      break;
    case 'Q': case 'm':
      if (t === 'm' && r < 18) {   // Kurtul's narrow alley between the houses
        ctx.fillStyle = '#4a4458'; ctx.fillRect(x, y, TS, TS); ctx.fillStyle = '#2a2434'; ctx.fillRect(x, y, 10, TS); ctx.fillRect(x + TS - 10, y, 10, TS); break;
      }
      ctx.fillStyle = (c % 2) ? '#8a5a34' : '#82542f'; ctx.fillRect(x, y, TS, TS);
      ctx.strokeStyle = 'rgba(40,20,10,.35)'; ctx.lineWidth = 1.5; for (const yy of [12, 24, 36]) { ctx.beginPath(); ctx.moveTo(x, y + yy); ctx.lineTo(x + TS, y + yy); ctx.stroke(); }
      if (tileAt(c, r + 1) !== 'Q' && tileAt(c, r + 1) !== 'm') { ctx.fillStyle = '#5a3a20'; ctx.fillRect(x, y + TS - 10, TS, 10); }
      if (t === 'm') { ctx.fillStyle = '#140c08'; ctx.beginPath(); ctx.ellipse(x + TS / 2, y + TS - 6, 13, 11, 0, Math.PI, 0); ctx.fill(); }
      break;
    case 'H': ctx.fillStyle = (c + r) % 2 ? '#6c6c76' : '#686872'; ctx.fillRect(x, y, TS, TS); break;
    case 'F': case 'K': case 'e': {
      const a = areaAt(c + 0.5, r + 0.5), fc = FLOOR_COL[a] || ['#c9b08a', '#bfa680'];
      ctx.fillStyle = (c + r) % 2 ? fc[0] : fc[1]; ctx.fillRect(x, y, TS, TS);
      if (a === 'Evimiz' || a === 'Cadı Kulübesi') { ctx.strokeStyle = 'rgba(40,20,10,.22)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + 16); ctx.lineTo(x + TS, y + 16); ctx.moveTo(x, y + 32); ctx.lineTo(x + TS, y + 32); ctx.stroke(); }
      if (t === 'e') { ctx.fillStyle = '#b3122e'; rr(ctx, x + 4, y + 8, TS - 8, TS - 16, 6); ctx.fill(); ctx.fillStyle = '#fff3d6'; ctx.font = 'bold 15px "Trebuchet MS",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ÇIKIŞ', x + TS / 2, y + TS / 2); ctx.textBaseline = 'alphabetic'; }
      break;
    }
    case 'X': {
      const below = tileAt(c, r + 1);
      if (below === 'F' || below === 'K' || below === 'e') {
        ctx.fillStyle = WALL_COL[areaAt(c + 0.5, r + 1.5)] || '#8a7a6a'; ctx.fillRect(x, y, TS, TS);
        ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(x, y + TS - 6, TS, 6);
        ctx.fillStyle = '#2a2230'; ctx.fillRect(x, y, TS, 7);
      } else { ctx.fillStyle = '#2a2230'; ctx.fillRect(x, y, TS, TS); ctx.fillStyle = '#383040'; ctx.fillRect(x + 2, y + 2, TS - 4, TS - 4); }
      break;
    }
    default: ctx.fillStyle = '#0e0a14'; ctx.fillRect(x, y, TS, TS);
  }
}
function pick2(arr, h) { return arr[Math.floor(h * 997) % arr.length]; }
const isFenceT = (t) => t === 'f' || t === 'n';
function drawFenceTile(c, r, x, y) {
  const t = tileAt(c, r), cx = x + TS / 2, top = y + TS * 0.12, bot = y + TS * 0.8;
  const iron = r >= 36 && c >= 47;
  const wood = c >= 41 && c <= 47 && r >= 42 && !iron || (c === 47 && r >= 42 && r <= 48);
  const col = iron && !wood ? '#20202a' : wood ? '#7a5a3a' : '#5a5560';
  ctx.strokeStyle = col; ctx.lineWidth = iron && !wood ? 3 : 4;
  if (isFenceT(tileAt(c + 1, r))) { ctx.beginPath(); ctx.moveTo(cx, top + 8); ctx.lineTo(cx + TS, top + 8); ctx.moveTo(cx, bot - 8); ctx.lineTo(cx + TS, bot - 8); ctx.stroke(); }
  if (isFenceT(tileAt(c, r + 1))) { ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, top + 4); ctx.lineTo(cx, top + TS + 4); ctx.stroke(); }
  if (t === 'n') { ctx.fillStyle = col; ctx.fillRect(cx - 4, top - 2, 8, 9); ctx.fillRect(cx - 4, bot - 8, 8, 8); return; }
  ctx.fillStyle = col; ctx.fillRect(cx - 3, top, 6, bot - top);
  if (iron && !wood) { ctx.beginPath(); ctx.moveTo(cx - 5, top + 1); ctx.lineTo(cx, top - 8); ctx.lineTo(cx + 5, top + 1); ctx.closePath(); ctx.fill(); }
  else { ctx.beginPath(); ctx.moveTo(cx - 3, top); ctx.lineTo(cx, top - 5); ctx.lineTo(cx + 3, top); ctx.fill(); }
}
function drawTree(x, b, h) {
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, b - 4, 20, 7, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#3a2a24'; ctx.beginPath(); ctx.moveTo(x - 6, b - 2); ctx.lineTo(x - 3, b - 40); ctx.lineTo(x + 3, b - 40); ctx.lineTo(x + 6, b - 2); ctx.closePath(); ctx.fill();
  if (h < 0.35) {   // bare, twisty branches
    ctx.strokeStyle = '#3a2a24'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, b - 34); ctx.quadraticCurveTo(x - 14, b - 44, x - 20, b - 62); ctx.moveTo(x - 10, b - 46); ctx.lineTo(x - 22, b - 46);
    ctx.moveTo(x, b - 38); ctx.quadraticCurveTo(x + 12, b - 50, x + 18, b - 66); ctx.moveTo(x + 12, b - 54); ctx.lineTo(x + 24, b - 58); ctx.moveTo(x, b - 40); ctx.lineTo(x + 2, b - 70); ctx.stroke(); ctx.lineCap = 'butt';
    if (h < 0.08) drawBat(x + 18, b - 62, 0.5, true);
    return;
  }
  const cols = ['#24402c', '#2a4a32', '#203a28', '#3a2f4a'], col = cols[Math.floor(h * 4)];
  ctx.fillStyle = col; ctx.beginPath(); circ(x, b - 50, 22); circ(x - 15, b - 40, 15); circ(x + 15, b - 40, 15); ctx.fill();
  ctx.fillStyle = 'rgba(200,190,255,.08)'; ctx.beginPath(); circ(x - 6, b - 58, 9); ctx.fill();
  if (h > 0.9) { ctx.fillStyle = '#ffb347'; ctx.beginPath(); circ(x + 8, b - 46, 2); circ(x + 12, b - 46, 2); ctx.fill(); }   // owl eyes in the leaves
}
function drawHedge(x, y) {
  ctx.fillStyle = '#1f3a24'; rr(ctx, x - 1, y - 14, TS + 2, TS + 12, 10); ctx.fill();
  ctx.fillStyle = '#2c4c30'; rr(ctx, x + 1, y - 14, TS - 2, TS - 6, 10); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.beginPath(); circ(x + 14, y - 4, 6); circ(x + 32, y + 4, 5); ctx.fill();
}
function drawGrave(x, b, h) {
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, b - 2, 18, 5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#8c8c94'; ctx.beginPath(); ctx.moveTo(x - 14, b - 2); ctx.lineTo(x - 14, b - 30); ctx.arc(x, b - 30, 14, Math.PI, 0); ctx.lineTo(x + 14, b - 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#a4a4ac'; ctx.fillRect(x - 12, b - 30, 4, 26);
  ctx.strokeStyle = '#5c5c66'; ctx.lineWidth = 2;
  if (h < 0.5) { ctx.beginPath(); ctx.moveTo(x, b - 36); ctx.lineTo(x, b - 18); ctx.moveTo(x - 6, b - 30); ctx.lineTo(x + 6, b - 30); ctx.stroke(); }
  else { ctx.fillStyle = '#5c5c66'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('BÖÖ', x, b - 24); ctx.beginPath(); ctx.moveTo(x + 6, b - 40); ctx.lineTo(x + 2, b - 34); ctx.lineTo(x + 5, b - 30); ctx.stroke(); }
  ctx.fillStyle = '#2a4a32'; ctx.beginPath(); circ(x - 10, b - 2, 4); circ(x + 9, b - 2, 4); ctx.fill();
}
// roofs in different shapes so no two houses look alike
function drawRoof(B, x, w, top, base) {
  const rs = B.rs || 'gable', L = x - 8, Rr = x + w + 8, lit = B.kind !== 'spooky' || streetLit();
  const shape = () => {
    ctx.beginPath();
    if (rs === 'hip') { ctx.moveTo(L, base); ctx.lineTo(x + w * 0.22, top - 10); ctx.lineTo(x + w * 0.78, top - 10); ctx.lineTo(Rr, base); }
    else if (rs === 'twin') { ctx.moveTo(L, base); ctx.lineTo(x + w * 0.27, top - 22); ctx.lineTo(x + w * 0.5, base - 30); ctx.lineTo(x + w * 0.73, top - 22); ctx.lineTo(Rr, base); }
    else if (rs === 'flat') { ctx.moveTo(L + 4, base); ctx.lineTo(L + 4, top + 14); ctx.lineTo(Rr - 4, top + 14); ctx.lineTo(Rr - 4, base); }
    else if (rs === 'mansard') { ctx.moveTo(L, base); ctx.lineTo(x + 8, top + 8); ctx.lineTo(x + w - 8, top + 8); ctx.lineTo(Rr, base); }
    else if (rs === 'crooked') { ctx.moveTo(L, base); ctx.quadraticCurveTo(x + w * 0.3, top - 10, x + w * 0.62, top - 52); ctx.quadraticCurveTo(x + w * 0.75, top - 10, Rr, base); }
    else { ctx.moveTo(L, base); ctx.lineTo(x + w / 2, top - 30); ctx.lineTo(Rr, base); }
    ctx.closePath();
  };
  ctx.fillStyle = B.roof; shape(); ctx.fill();
  ctx.save(); shape(); ctx.clip(); ctx.fillStyle = 'rgba(0,0,0,.2)';
  if (rs === 'flat') { for (let xx = L; xx < Rr; xx += 22) ctx.fillRect(xx, top + 14, 2, base - top); }
  else for (let yy = top - 60; yy < base; yy += 13) ctx.fillRect(L, yy, Rr - L, 2.5);
  ctx.restore();
  if (rs === 'flat') {   // parapet + water tank + a little witch weathervane
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(L + 4, top + 10, Rr - L - 8, 6);
    ctx.fillStyle = '#6a5a4a'; ctx.fillRect(x + w * 0.62, top - 14, 30, 26); ctx.fillStyle = '#4a3a2a'; ctx.fillRect(x + w * 0.62 - 3, top - 18, 36, 5);
    ctx.strokeStyle = '#2a2230'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + w * 0.25, top + 12); ctx.lineTo(x + w * 0.25, top - 22); ctx.stroke();
    ctx.fillStyle = '#2a2230'; ctx.beginPath(); ctx.moveTo(x + w * 0.25 - 10, top - 20); ctx.lineTo(x + w * 0.25 + 12, top - 22); ctx.lineTo(x + w * 0.25 + 2, top - 30); ctx.closePath(); ctx.fill();
  }
  if (rs === 'mansard') {   // dormer windows
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x + 8, top + 8, w - 16, 5);
    for (const k of [0.3, 0.7]) { const dx = x + w * k; ctx.fillStyle = B.roof; ctx.beginPath(); ctx.moveTo(dx - 14, base - 12); ctx.lineTo(dx - 14, base - 34); ctx.lineTo(dx, base - 46); ctx.lineTo(dx + 14, base - 34); ctx.lineTo(dx + 14, base - 12); ctx.closePath(); ctx.fill(); win(dx - 7, base - 32, 14, 16, lit && B.n !== 3, '#2a1f2a'); }
  }
  if (rs === 'twin') { for (const k of [0.27, 0.73]) win(x + w * k - 7, top + 4, 14, 14, true, '#2a1f2a'); }
  if (rs === 'hip') { ctx.fillStyle = '#5a2a2a'; ctx.fillRect(x + w - 54, top - 26, 16, 30); ctx.fillStyle = 'rgba(220,220,230,.5)'; ctx.beginPath(); circ(x + w - 46 + Math.sin(S.time) * 3, top - 36 - (S.time * 8) % 16, 6); ctx.fill(); }
  if (rs === 'turret') {   // a round little tower with a pointy cap on one side
    const tx = x + w - 34; ctx.fillStyle = B.wall; ctx.fillRect(tx - 18, top - 20, 36, base - top + 16);
    win(tx - 6, top - 6, 12, 18, lit, '#2a1f2a');
    ctx.fillStyle = B.roof; ctx.beginPath(); ctx.moveTo(tx - 24, top - 18); ctx.lineTo(tx, top - 70); ctx.lineTo(tx + 24, top - 18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#c9a050'; ctx.beginPath(); circ(tx, top - 72, 3); ctx.fill();
  }
  if (rs === 'crooked') { ctx.fillStyle = '#3a3040'; ctx.fillRect(x + 18, top - 18, 12, 30); drawBat(x + w * 0.62, top - 56, 0.5, true); }
}
function drawJunk(x, b, h) {
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, b - 2, 24, 7, 0, 0, 7); ctx.fill();
  const v = Math.floor(h * 5);
  if (v === 0) {   // a stack of old tyres and a barrel
    for (let i = 0; i < 3; i++) { ctx.fillStyle = '#26262a'; ctx.beginPath(); ctx.ellipse(x - 8, b - 6 - i * 9, 14, 6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#4a4a50'; ctx.beginPath(); ctx.ellipse(x - 8, b - 6 - i * 9, 6, 2.5, 0, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#4a6a8a'; rr(ctx, x + 6, b - 30, 18, 28, 3); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x + 6, b - 22, 18, 2); ctx.fillRect(x + 6, b - 12, 18, 2);
  } else if (v === 1) {   // a broken washing machine and a box
    ctx.fillStyle = '#c8c8cc'; rr(ctx, x - 18, b - 34, 26, 32, 3); ctx.fill(); ctx.fillStyle = '#5a6a7a'; ctx.beginPath(); circ(x - 5, b - 18, 8); ctx.fill(); ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - 10, b - 22); ctx.lineTo(x - 2, b - 14); ctx.stroke();
    ctx.fillStyle = '#a07a4a'; ctx.fillRect(x + 8, b - 18, 16, 16); ctx.strokeStyle = '#6a4a2a'; ctx.strokeRect(x + 8, b - 18, 16, 16);
  } else if (v === 2) {   // old TVs piled up
    for (const [dx, dy, w2] of [[-16, 0, 22], [6, 0, 18], [-6, -20, 20]]) { ctx.fillStyle = '#6a5a4a'; rr(ctx, x + dx, b - 20 + dy, w2, 18, 3); ctx.fill(); ctx.fillStyle = '#3a4a4a'; rr(ctx, x + dx + 3, b - 17 + dy, w2 - 9, 12, 2); ctx.fill(); }
    ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - 2, b - 40); ctx.lineTo(x - 8, b - 50); ctx.moveTo(x + 4, b - 40); ctx.lineTo(x + 10, b - 50); ctx.stroke();
  } else if (v === 3) {   // a rusty bicycle and some cans
    ctx.strokeStyle = '#8a4a2a'; ctx.lineWidth = 2.5; ctx.beginPath(); circ(x - 12, b - 10, 9); circ(x + 12, b - 10, 9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 12, b - 10); ctx.lineTo(x, b - 22); ctx.lineTo(x + 12, b - 10); ctx.moveTo(x, b - 22); ctx.lineTo(x - 4, b - 28); ctx.stroke();
    ctx.fillStyle = '#a8a8b0'; for (const dx of [-22, 20]) { rr(ctx, x + dx, b - 8, 6, 8, 1); ctx.fill(); }
  } else {   // a heap of scrap metal with a ladder
    ctx.fillStyle = '#6a6a72'; ctx.beginPath(); ctx.moveTo(x - 24, b - 2); ctx.lineTo(x - 10, b - 26); ctx.lineTo(x + 4, b - 18); ctx.lineTo(x + 14, b - 30); ctx.lineTo(x + 24, b - 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#8a7a5a'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - 18, b - 4); ctx.lineTo(x + 6, b - 42); ctx.moveTo(x - 10, b - 4); ctx.lineTo(x + 14, b - 42); for (let i = 1; i < 5; i++) { ctx.moveTo(x - 18 + i * 4.8, b - 4 - i * 7.6); ctx.lineTo(x - 10 + i * 4.8, b - 4 - i * 7.6); } ctx.stroke();
  }
}
// the one heap Frenk talks about: an old red car with scrap on top
function drawRedCarHeap(x, b) {
  ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(x, b - 2, 62, 12, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#b3262a'; rr(ctx, x - 56, b - 30, 112, 24, 8); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 30, b - 30); ctx.lineTo(x - 18, b - 50); ctx.lineTo(x + 22, b - 50); ctx.lineTo(x + 36, b - 30); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#9fc8d8'; ctx.beginPath(); ctx.moveTo(x - 24, b - 32); ctx.lineTo(x - 15, b - 46); ctx.lineTo(x, b - 46); ctx.lineTo(x, b - 32); ctx.closePath(); ctx.moveTo(x + 4, b - 32); ctx.lineTo(x + 4, b - 46); ctx.lineTo(x + 19, b - 46); ctx.lineTo(x + 30, b - 32); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#7a1a1e'; ctx.fillRect(x - 56, b - 16, 112, 3);
  ctx.fillStyle = '#26262a'; for (const wx of [-34, 34]) { ctx.beginPath(); circ(x + wx, b - 6, 10); ctx.fill(); ctx.fillStyle = '#8a8a90'; ctx.beginPath(); circ(x + wx, b - 6, 4); ctx.fill(); ctx.fillStyle = '#26262a'; }
  ctx.fillStyle = '#ffe9a0'; ctx.beginPath(); circ(x + 52, b - 22, 4); ctx.fill();
  drawJunk(x - 14, b - 44, 0.45); drawJunk(x + 18, b - 46, 0.85);
}
function win(x, y, w, h, lit, frame) {
  ctx.fillStyle = frame || '#2a1f2a'; ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = lit ? '#ffcf6a' : '#1e1a2c'; ctx.fillRect(x, y, w, h);
  if (lit) { ctx.fillStyle = 'rgba(255,240,180,.5)'; ctx.fillRect(x + 2, y + 2, 5, h - 4); }
  ctx.fillStyle = frame || '#2a1f2a'; ctx.fillRect(x + w / 2 - 1, y, 2, h); ctx.fillRect(x, y + h / 2 - 1, w, 2);
}
function cobweb(x, y, s) {
  ctx.strokeStyle = 'rgba(230,230,240,.55)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) { const a = i / 4 * Math.PI / 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s); ctx.stroke(); }
  for (const k of [0.35, 0.65, 0.95]) { ctx.beginPath(); for (let i = 0; i <= 4; i++) { const a = i / 4 * Math.PI / 2; const px = x + Math.cos(a) * s * k, py = y + Math.sin(a) * s * k; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.stroke(); }
}
function drawBuilding(B, ox, oy) {
  const x = ox + B.x1 * TS, w = (B.x2 - B.x1 + 1) * TS, by = oy + (B.y2 + 1) * TS, FH = TS * 1.7, top = oy + B.y1 * TS - TS * 0.4, K = B.kind, F = S.flags;
  const dcol = DOORS.find((d) => d.door[1] === B.y2 && d.door[0] >= B.x1 && d.door[0] <= B.x2);
  const doorX = dcol ? ox + (dcol.door[0] + 0.5) * TS : ox + ((B.x1 + B.x2) / 2 + 0.5) * TS;
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x + 6, by - 4, w, 10);
  // --- roofs
  if (K === 'tower') {
    const cx = x + w / 2;
    ctx.fillStyle = B.wall; ctx.fillRect(x + 8, top - TS * 2.2, w - 16, by - FH - top + TS * 2.2 + 4);
    ctx.fillStyle = 'rgba(0,0,0,.15)'; for (let yy = top - TS * 2; yy < by - FH; yy += 22) ctx.fillRect(x + 8, yy, w - 16, 2);
    // clock
    ctx.fillStyle = '#f4ead0'; ctx.beginPath(); circ(cx, top - TS * 0.6, 30); ctx.fill(); ctx.strokeStyle = '#3a3448'; ctx.lineWidth = 4; ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, top - TS * 0.6); ctx.lineTo(cx, top - TS * 0.6 - 22); ctx.moveTo(cx, top - TS * 0.6); ctx.lineTo(cx + 2, top - TS * 0.6 - 16); ctx.stroke();
    ctx.fillStyle = '#3a3448'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('XII', cx, top - TS * 0.6 - 18);
    // the big lantern on the top
    const ly = top - TS * 2.2;
    ctx.fillStyle = B.roof; ctx.beginPath(); ctx.moveTo(x - 4, ly + 6); ctx.lineTo(cx, ly - 30); ctx.lineTo(x + w + 4, ly + 6); ctx.closePath(); ctx.fill();
    const lit = F.towerLit;
    if (lit) { const g = ctx.createRadialGradient(cx, ly - 52, 4, cx, ly - 52, 70); g.addColorStop(0, 'rgba(255,200,90,.9)'); g.addColorStop(1, 'rgba(255,160,40,0)'); ctx.fillStyle = g; ctx.beginPath(); circ(cx, ly - 52, 70); ctx.fill(); }
    ctx.fillStyle = '#2a2230'; ctx.fillRect(cx - 18, ly - 74, 36, 6); ctx.fillRect(cx - 14, ly - 34, 28, 6);
    ctx.fillStyle = lit ? '#ffcf6a' : '#3a3448'; ctx.fillRect(cx - 14, ly - 68, 28, 34);
    ctx.strokeStyle = '#2a2230'; ctx.lineWidth = 2; ctx.strokeRect(cx - 14, ly - 68, 28, 34); ctx.beginPath(); ctx.moveTo(cx, ly - 68); ctx.lineTo(cx, ly - 34); ctx.stroke();
    if (lit) { ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.ellipse(cx, ly - 50, 5, 9, 0, 0, 7); ctx.fill(); }
    // light beam into the sky
    if (lit && !F.skyDone) {
      const k = S.beam === undefined || S.beam === 0 ? 1 : S.beam;
      const gr = ctx.createLinearGradient(0, ly - 60, 0, ly - 60 - 600 * k); gr.addColorStop(0, 'rgba(255,220,140,.55)'); gr.addColorStop(1, 'rgba(255,220,140,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(cx - 12, ly - 60); ctx.lineTo(cx - 70, ly - 60 - 600 * k); ctx.lineTo(cx + 70, ly - 60 - 600 * k); ctx.lineTo(cx + 12, ly - 60); ctx.closePath(); ctx.fill();
    }
  } else if (K === 'train') {
    ctx.fillStyle = B.roof; ctx.beginPath(); ctx.moveTo(x - 8, by - FH + 4); ctx.lineTo(x + 20, top - 10); ctx.lineTo(x + w - 20, top - 10); ctx.lineTo(x + w + 8, by - FH + 4); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 5; i++) { const tx = x + 20 + i * (w - 40) / 4; ctx.fillStyle = '#2e2240'; ctx.beginPath(); ctx.moveTo(tx - 8, top - 10); ctx.lineTo(tx, top - 26); ctx.lineTo(tx + 8, top - 10); ctx.fill(); }
    ctx.fillStyle = '#e8e0f0'; ctx.beginPath(); ctx.arc(x + w - 40, top + 6, 10, Math.PI, 0); ctx.lineTo(x + w - 30, top + 22); ctx.lineTo(x + w - 35, top + 18); ctx.lineTo(x + w - 40, top + 22); ctx.lineTo(x + w - 45, top + 18); ctx.lineTo(x + w - 50, top + 22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1e1626'; ctx.beginPath(); circ(x + w - 44, top + 6, 2); circ(x + w - 36, top + 6, 2); ctx.fill();
  } else if (K === 'mummy') {
    ctx.fillStyle = B.roof; ctx.beginPath(); ctx.moveTo(x - 10, by - FH + 6); ctx.lineTo(x + w / 2, top - 40); ctx.lineTo(x + w + 10, by - FH + 6); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(90,70,30,.4)'; ctx.lineWidth = 2; for (let i = 1; i < 6; i++) { const yy = by - FH + 6 - i * (by - FH + 46 - top) / 6, half = (w / 2 + 10) * (1 - i / 6); ctx.beginPath(); ctx.moveTo(x + w / 2 - half, yy); ctx.lineTo(x + w / 2 + half, yy); ctx.stroke(); }
    ctx.fillStyle = '#3a2a1a'; ctx.beginPath(); ctx.ellipse(x + w / 2, top + 10, 14, 7, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#e3cf9a'; ctx.beginPath(); circ(x + w / 2, top + 10, 4); ctx.fill();
  } else if (K === 'witch') {
    ctx.fillStyle = B.roof; ctx.beginPath(); ctx.moveTo(x - 14, by - FH + 8); ctx.lineTo(x + w * 0.62, top - 56); ctx.lineTo(x + w + 12, by - FH + 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#4a3a2a'; ctx.fillRect(x + w * 0.2, top - 20, 16, 34);
    for (let i = 0; i < 3; i++) { const t = (S.time * 0.5 + i / 3) % 1; ctx.fillStyle = `rgba(140,230,150,${0.6 - t * 0.6})`; ctx.beginPath(); circ(x + w * 0.2 + 8 + Math.sin(t * 6 + i) * 6, top - 26 - t * 50, 5 + t * 8); ctx.fill(); }
    ctx.fillStyle = '#ffcf6a'; ctx.beginPath(); circ(x + w * 0.62, top + 4, 10); ctx.fill(); ctx.strokeStyle = '#2a1f3a'; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + w * 0.62 - 10, top + 4); ctx.lineTo(x + w * 0.62 + 10, top + 4); ctx.moveTo(x + w * 0.62, top - 6); ctx.lineTo(x + w * 0.62, top + 14); ctx.stroke();
  } else if (K === 'crypt') {
    ctx.fillStyle = B.roof; ctx.beginPath(); ctx.moveTo(x - 8, by - FH + 6); ctx.lineTo(x + w / 2, top - 18); ctx.lineTo(x + w + 8, by - FH + 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#6a6a72'; ctx.fillRect(x + w / 2 - 4, top - 44, 8, 30); ctx.fillRect(x + w / 2 - 12, top - 36, 24, 7);
    drawBat(x + 22, top + 4, 0.55, false); drawBat(x + w - 22, top + 4, 0.55, false);
  } else {
    // houses: crooked for the spooky street
    drawRoof(B, x, w, top, by - FH + 6);
    if (K === 'home') { ctx.fillStyle = '#5a2a2a'; ctx.fillRect(x + w - 50, top - 18, 16, 26); ctx.fillStyle = 'rgba(220,220,230,.5)'; ctx.beginPath(); circ(x + w - 42 + Math.sin(S.time) * 3, top - 28 - (S.time * 8) % 16, 6); ctx.fill(); }
    if (K === 'house') cobweb(x - 6, by - FH + 4, 30);
  }
  // --- facade
  if (K !== 'tower') {
    ctx.fillStyle = B.wall; ctx.fillRect(x, by - FH, w, FH);
    ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(x, by - 8, w, 8);
  } else {
    ctx.fillStyle = B.wall; ctx.fillRect(x + 8, by - FH, w - 16, FH); ctx.fillStyle = '#5a5668'; ctx.fillRect(x, by - 14, w, 14);
  }
  if (K === 'mummy') { ctx.fillStyle = 'rgba(90,60,20,.55)'; ctx.font = '18px sans-serif'; ctx.textAlign = 'center'; ['𓂀', '𓃭', '𓆣'].forEach((g, i) => ctx.fillText(g, x + 30 + i * (w - 60) / 2, by - FH + 34)); }
  if (K === 'crypt') { for (const px of [x + 30, x + w - 30]) { ctx.fillStyle = '#a4a4ac'; ctx.fillRect(px - 9, by - FH + 6, 18, FH - 12); ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(px + 3, by - FH + 6, 5, FH - 12); } }
  if (K === 'train') {   // the tunnel mouth with glowing eyes
    const cx = x + w / 2; ctx.fillStyle = '#0a0610'; ctx.beginPath(); ctx.moveTo(cx - 60, by); ctx.lineTo(cx - 60, by - 44); ctx.arc(cx, by - 44, 60, Math.PI, 0); ctx.lineTo(cx + 60, by); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#7a5a8a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, by - 44, 62, Math.PI, 0); ctx.stroke();
    const bl = (S.time % 4) < 0.15; ctx.fillStyle = '#ffe066'; if (!bl) { ctx.beginPath(); ctx.ellipse(cx - 16, by - 50, 6, 8, 0, 0, 7); ctx.ellipse(cx + 16, by - 50, 6, 8, 0, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#a8a8b4'; ctx.fillRect(cx - 34, by - 4, 6, 12); ctx.fillRect(cx + 28, by - 4, 6, 12);
    for (const sx of [x + 24, x + w - 24]) { ctx.fillStyle = '#ffb347'; ctx.beginPath(); circ(sx, by - FH + 24, 7); ctx.fill(); }
  } else if (K !== 'tower') {
    const lit = K === 'home' || (K === 'house' && B.n !== 3) || (K === 'spooky' && streetLit()) || K === 'witch' || K === 'mummy';
    for (let c = B.x1; c <= B.x2; c++) {
      if (dcol && Math.abs(c - dcol.door[0]) <= (K === 'crypt' ? 1 : 0)) continue;
      if (!dcol && K !== 'spooky' && K !== 'house' && Math.abs(ox + (c + 0.5) * TS - doorX) < TS) continue;
      if (K === 'house' && c === B.x1 + 2) continue;
      if (K === 'crypt') continue;
      if ((c - B.x1) % 2 === 0 || K === 'home') win(ox + c * TS + 13, by - FH + 18, TS - 26, 28, lit && (K === 'home' || hash(c, B.y1) > (K === 'spooky' ? 0.2 : 0.15)), K === 'mummy' ? '#8a6a30' : null);
    }
  }
  // --- doors
  if (K === 'house') {
    const dx = ox + (B.x1 + 2.5) * TS;
    ctx.fillStyle = '#3a2418'; rr(ctx, dx - 15, by - 50, 30, 50, 5); ctx.fill(); ctx.fillStyle = '#e0b84a'; ctx.beginPath(); circ(dx + 8, by - 26, 3); ctx.fill();
    ctx.fillStyle = '#7a6a5a'; ctx.fillRect(dx - 20, by - 2, 40, 6);
    if (B.n === 3) { ctx.fillStyle = '#fffaf0'; ctx.fillRect(dx - 8, by - 42, 16, 12); }
  } else if (dcol) {
    const arch = K === 'crypt' || K === 'mummy' || K === 'witch';
    ctx.fillStyle = K === 'witch' ? '#3a2a1a' : K === 'crypt' ? '#2a2a30' : '#5a3a22';
    if (arch) { ctx.beginPath(); ctx.moveTo(doorX - 17, by); ctx.lineTo(doorX - 17, by - 36); ctx.arc(doorX, by - 36, 17, Math.PI, 0); ctx.lineTo(doorX + 17, by); ctx.closePath(); ctx.fill(); }
    else { rr(ctx, doorX - 16, by - 54, 32, 54, 5); ctx.fill(); }
    ctx.fillStyle = '#e0b84a'; ctx.beginPath(); circ(doorX + 9, by - 24, 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,200,.9)'; ctx.beginPath(); ctx.moveTo(doorX, by + 16); ctx.lineTo(doorX - 7, by + 6); ctx.lineTo(doorX + 7, by + 6); ctx.closePath(); ctx.fill();
  }
  if (K === 'tower' && F.towerLit) for (let i = 0; i < N_L; i++) drawJack(x + 8 + i * (w - 16) / (N_L - 1), by + 8, 0.5, true);
  // --- sign
  if (B.name) {
    ctx.font = 'bold 15px "Trebuchet MS", sans-serif'; const tw = ctx.measureText(B.name).width + 20, sy = by - FH - 2;
    ctx.fillStyle = B.sign || '#3a2a4a'; rr(ctx, doorX - tw / 2, sy - 13, tw, 26, 7); ctx.fill(); ctx.strokeStyle = '#e8d8b8'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(B.name, doorX, sy); ctx.textBaseline = 'alphabetic';
  }
}

/* --- the heroes in costume (drawn in the zoo game's style: face to the camera) --- */
function shadow(x, b, w) { ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(x, b, w, w * 0.35, 0, 0, 7); ctx.fill(); }
function sparkleDots(pts, col) { const t = S.time; for (let i = 0; i < pts.length; i++) { const k = 0.5 + 0.5 * Math.sin(t * 4 + i * 1.7); ctx.fillStyle = `rgba(${col},${0.35 + k * 0.6})`; ctx.beginPath(); ctx.arc(pts[i][0], pts[i][1], 0.9 + k * 0.6, 0, 7); ctx.fill(); } }
let KID_MOVING = false;
function drawKid(c, x, b, portrait) {
  const nehir = c.who === 'Nehir', dir = c.dir || 'down';
  if (c.hurtT > 0 && Math.floor(c.hurtT * 10) % 2 === 0) return;
  shadow(x, b, nehir ? 11 : 13);
  const s = nehir ? 0.74 : 0.84;
  ctx.save(); ctx.translate(x, b); ctx.scale(dir === 'left' ? -s : s, s);
  const moving = !!c.moving; KID_MOVING = moving; const ph = (c.walkT || 0) * 13, step = moving ? Math.sin(ph) : 0, bob = moving ? -Math.abs(Math.sin(ph)) * 1.5 : 0;
  if (nehir) drawBat_Nehir(dir, step, bob, portrait); else drawVampire_Bade(dir, step, bob, portrait);
  ctx.restore();
}
function faceEyes(fx, headY, blink) {
  ctx.fillStyle = '#2a1f17';
  if (blink) { ctx.fillRect(-6 + fx, headY + 1, 4, 1.4); ctx.fillRect(2 + fx, headY + 1, 4, 1.4); }
  else { ctx.beginPath(); ctx.arc(-4 + fx, headY + 1, 1.8, 0, 7); ctx.arc(4 + fx, headY + 1, 1.8, 0, 7); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(-3.4 + fx, headY + 0.4, 0.6, 0, 7); ctx.arc(4.6 + fx, headY + 0.4, 0.6, 0, 7); ctx.fill(); }
  ctx.fillStyle = 'rgba(240,120,120,.35)'; ctx.beginPath(); ctx.arc(-7.5 + fx, headY + 5, 2.3, 0, 7); ctx.arc(7.5 + fx, headY + 5, 2.3, 0, 7); ctx.fill();
}
function drawBat_Nehir(dir, step, bob, portrait) {
  const t = S.time, skin = '#f2c8a0', hair = '#2b1a12', hairHi = '#4a2e20', suit = '#2b2238', suitHi = '#3d3150', wingC = '#231c30', wingL = '#4b3d63';
  const fx = dir === 'down' ? 0 : 2.5, headY = -67 + bob, blink = (t % 3.7) < 0.12;
  const flap = Math.sin(t * (KID_MOVING ? 10 : 2.5)) * (KID_MOVING ? 0.2 : 0.1);
  const wing = (sg) => {
    ctx.save(); ctx.translate(sg * 8, -50 + bob); ctx.rotate(sg * flap);
    ctx.fillStyle = wingC; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sg * 14, -14, sg * 28, -10);
    ctx.quadraticCurveTo(sg * 25, 2, sg * 27, 10); ctx.quadraticCurveTo(sg * 20, 6, sg * 18, 16); ctx.quadraticCurveTo(sg * 12, 12, sg * 8, 22); ctx.quadraticCurveTo(sg * 4, 14, 0, 18); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = wingL; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(sg * 27, 10); ctx.moveTo(0, 0); ctx.lineTo(sg * 18, 16); ctx.moveTo(0, 0); ctx.lineTo(sg * 8, 22); ctx.stroke();
    sparkleDots([[sg * 22, -8], [sg * 14, 4], [sg * 20, 8]], '215,196,255');
    ctx.restore();
  };
  if (dir === 'up') {
    ctx.fillStyle = '#1d1826'; ctx.fillRect(-7, -24 + bob, 6, 20 + step * 2.5); ctx.fillRect(1, -24 + bob, 6, 20 - step * 2.5);
    ctx.fillStyle = '#3a2f52'; ctx.fillRect(-8, -6 + step * 2.5, 8, 6); ctx.fillRect(0, -6 - step * 2.5, 8, 6);
    ctx.fillStyle = suit; ctx.beginPath(); ctx.moveTo(-9, -54 + bob); ctx.lineTo(9, -54 + bob); ctx.lineTo(12, -22 + bob); ctx.lineTo(-12, -22 + bob); ctx.closePath(); ctx.fill();
    ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(-14, headY); ctx.quadraticCurveTo(-16, headY + 20, -12, headY + 30); ctx.lineTo(12, headY + 30); ctx.quadraticCurveTo(16, headY + 20, 14, headY); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(0, headY, 13.5, 0, 7); ctx.fill();
    wing(-1); wing(1);
    ctx.fillStyle = suit; ctx.beginPath(); ctx.arc(0, headY - 2, 14.5, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
    batEars(headY);
    return;
  }
  // wings behind, long hair behind the shoulders
  wing(-1); wing(1);
  ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(-14, headY - 4); ctx.quadraticCurveTo(-17, headY + 18, -14, headY + 30); ctx.lineTo(14, headY + 30); ctx.quadraticCurveTo(17, headY + 18, 14, headY - 4); ctx.closePath(); ctx.fill();
  // legs: black tights, sparkly shoes
  ctx.fillStyle = '#1d1826'; ctx.fillRect(-7, -24 + bob, 6, 20 + step * 2.5); ctx.fillRect(1, -24 + bob, 6, 20 - step * 2.5);
  ctx.fillStyle = '#3a2f52'; ctx.fillRect(-8, -6 + step * 2.5, 8, 6); ctx.fillRect(0, -6 - step * 2.5, 8, 6);
  sparkleDots([[-4, -4 + step * 2.5], [4, -4 - step * 2.5]], '255,255,255');
  // the bat suit with sparkles and a lighter tummy
  ctx.fillStyle = suit; ctx.beginPath(); ctx.moveTo(-9, -54 + bob); ctx.lineTo(9, -54 + bob); ctx.lineTo(12, -22 + bob); ctx.lineTo(-12, -22 + bob); ctx.closePath(); ctx.fill();
  ctx.fillStyle = suitHi; ctx.beginPath(); ctx.ellipse(0, -36 + bob, 6, 10, 0, 0, 7); ctx.fill();
  sparkleDots([[-6, -48 + bob], [5, -44 + bob], [-3, -30 + bob], [7, -27 + bob], [-8, -38 + bob]], '215,196,255');
  if (S.flags && S.flags.badges) { ctx.fillStyle = '#f2c21b'; star(ctx, -4, -46 + bob, 4.5, 2, 5); }
  // back arm
  ctx.save(); ctx.translate(-10, -51 + bob); ctx.rotate(-step * 0.35); ctx.fillStyle = suit; ctx.fillRect(-2.5, 0, 5, 18); ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, 20, 3, 0, 7); ctx.fill(); ctx.restore();
  // head + hair framing the face
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, headY, 12.5, 0, 7); ctx.fill(); ctx.fillRect(-3, headY + 10, 6, 5);
  ctx.fillStyle = hair; ctx.fillRect(-14.5, headY - 4, 5, 26); ctx.fillRect(9.5, headY - 4, 5, 26);
  ctx.beginPath(); ctx.moveTo(-1, headY - 12); ctx.quadraticCurveTo(-8, headY - 9, -12, headY - 2); ctx.lineTo(-13, headY - 7); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f6efe0'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(11.5, headY - 1 + i * 5, 1.3, 0, 7); ctx.fill(); }
  // hood with bat ears
  ctx.fillStyle = suit; ctx.beginPath(); ctx.arc(0, headY - 2, 14.5, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
  ctx.fillRect(-14.8, headY - 4, 3, 8); ctx.fillRect(11.8, headY - 4, 3, 8);
  batEars(headY);
  ctx.fillStyle = hairHi; ctx.fillRect(-9, headY - 9, 6, 1.5);
  // face + glasses
  faceEyes(fx, headY, blink);
  ctx.strokeStyle = '#8a3a2a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(fx, headY + 5.5, 3.4, 0.25, Math.PI - 0.25); ctx.stroke();
  ctx.fillStyle = 'rgba(235,240,255,.35)'; ctx.beginPath(); ctx.arc(-4.2 + fx, headY + 1, 4.1, 0, 7); ctx.arc(4.2 + fx, headY + 1, 4.1, 0, 7); ctx.fill();
  ctx.strokeStyle = '#d9b3b8'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(-4.2 + fx, headY + 1, 4.1, 0, 7); ctx.moveTo(8.3 + fx, headY + 1); ctx.arc(4.2 + fx, headY + 1, 4.1, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-0.8 + fx, headY + 0.5); ctx.lineTo(0.8 + fx, headY + 0.5); ctx.stroke();
  // front arm
  ctx.strokeStyle = suit; ctx.lineWidth = 5.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(9, -50 + bob); ctx.lineTo(13 + step * 1.5, -36 + bob); ctx.stroke(); ctx.lineCap = 'butt';
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(13.5 + step * 1.5, -35 + bob, 3.2, 0, 7); ctx.fill();
  void portrait;
}
function batEars(headY) {
  for (const sg of [-1, 1]) {
    ctx.fillStyle = '#2b2238'; ctx.beginPath(); ctx.moveTo(sg * 3, headY - 13); ctx.lineTo(sg * 12, headY - 27); ctx.lineTo(sg * 13, headY - 9); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8e5bc2'; ctx.beginPath(); ctx.moveTo(sg * 6, headY - 13); ctx.lineTo(sg * 11.5, headY - 22); ctx.lineTo(sg * 11.5, headY - 12); ctx.closePath(); ctx.fill();
  }
}
function drawVampire_Bade(dir, step, bob, portrait) {
  const t = S.time, skin = '#f7d6c4', hair = '#d8642a', hairHi = '#f08a48', bod = '#2a1636', skirt = '#3a1f4a', lace = '#140c1c', red = '#b3122e';
  const fx = dir === 'down' ? 0 : 2.5, headY = -78 + bob, blink = (t % 4.1) < 0.12, cw = Math.sin(t * 2) * 1.5 + (KID_MOVING ? step * 2 : 0);
  if (dir === 'up') {
    ctx.fillStyle = '#111018'; ctx.fillRect(-6, -32 + bob, 5, 28 + step * 2.5); ctx.fillRect(1, -32 + bob, 5, 28 - step * 2.5);
    ctx.fillStyle = '#0a0a0e'; ctx.fillRect(-7, -5 + step * 2.5, 7, 5); ctx.fillRect(0, -5 - step * 2.5, 7, 5);
    ctx.fillStyle = '#15121c'; ctx.beginPath(); ctx.moveTo(-11, -66 + bob); ctx.lineTo(11, -66 + bob); ctx.quadraticCurveTo(20, -30, 22 + cw, -6); ctx.lineTo(-22 - cw, -6); ctx.quadraticCurveTo(-20, -30, -11, -66 + bob); ctx.closePath(); ctx.fill();
    ctx.fillStyle = red; ctx.fillRect(-22 - cw, -9, 44 + cw * 2, 3);
    ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(0, headY, 13.5, 0, 7); ctx.fill();
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(0, headY + 12 + i * 5.5, 4 - i * 0.25, 3.4, 0, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#15121c'; ctx.beginPath(); ctx.moveTo(-15, headY + 12); ctx.lineTo(-10, headY - 2); ctx.lineTo(-6, headY + 14); ctx.closePath(); ctx.moveTo(15, headY + 12); ctx.lineTo(10, headY - 2); ctx.lineTo(6, headY + 14); ctx.closePath(); ctx.fill();
    return;
  }
  // cape: we see its red lining behind her
  ctx.fillStyle = '#15121c'; ctx.beginPath(); ctx.moveTo(-12, -66 + bob); ctx.lineTo(12, -66 + bob); ctx.quadraticCurveTo(22, -32, 24 + cw, -5); ctx.lineTo(-24 - cw, -5); ctx.quadraticCurveTo(-22, -32, -12, -66 + bob); ctx.closePath(); ctx.fill();
  ctx.fillStyle = red; ctx.beginPath(); ctx.moveTo(-9, -64 + bob); ctx.lineTo(9, -64 + bob); ctx.quadraticCurveTo(18, -32, 20 + cw, -8); ctx.lineTo(-20 - cw, -8); ctx.quadraticCurveTo(-18, -32, -9, -64 + bob); ctx.closePath(); ctx.fill();
  // high collar
  for (const sg of [-1, 1]) { ctx.fillStyle = '#15121c'; ctx.beginPath(); ctx.moveTo(sg * 6, -66 + bob); ctx.lineTo(sg * 19, headY + 2); ctx.lineTo(sg * 13, -64 + bob); ctx.closePath(); ctx.fill(); ctx.fillStyle = red; ctx.beginPath(); ctx.moveTo(sg * 7, -66 + bob); ctx.lineTo(sg * 16.5, headY + 5); ctx.lineTo(sg * 12, -65 + bob); ctx.closePath(); ctx.fill(); }
  // legs: black tights, black heels
  ctx.fillStyle = '#111018'; ctx.fillRect(-6, -32 + bob, 5, 28 + step * 2.5); ctx.fillRect(1, -32 + bob, 5, 28 - step * 2.5);
  ctx.fillStyle = '#0a0a0e';
  for (const [lx, sy] of [[-7, step * 2.5], [0, -step * 2.5]]) { ctx.fillRect(lx, -5 + sy, 7, 4); ctx.beginPath(); ctx.moveTo(lx + 1, -1 + sy); ctx.lineTo(lx + 2.5, 2 + sy); ctx.lineTo(lx + 3.5, -1 + sy); ctx.fill(); }
  // the gothic dress
  ctx.fillStyle = skirt; ctx.beginPath(); ctx.moveTo(-8, -50 + bob); ctx.lineTo(8, -50 + bob); ctx.lineTo(16, -28 + bob); ctx.lineTo(-16, -28 + bob); ctx.closePath(); ctx.fill();
  ctx.fillStyle = lace; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(-14 + i * 4, -28 + bob, 2.3, 0, Math.PI); ctx.fill(); }
  ctx.strokeStyle = 'rgba(160,110,200,.35)'; ctx.lineWidth = 1; for (const k of [-6, 0, 6]) { ctx.beginPath(); ctx.moveTo(k * 0.6, -50 + bob); ctx.lineTo(k * 1.6, -29 + bob); ctx.stroke(); }
  ctx.fillStyle = bod; ctx.beginPath(); ctx.moveTo(-9, -65 + bob); ctx.lineTo(9, -65 + bob); ctx.lineTo(8, -49 + bob); ctx.lineTo(-8, -49 + bob); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#6a2a8a'; ctx.fillRect(-8.5, -51 + bob, 17, 3);
  ctx.fillStyle = red; ctx.beginPath(); ctx.moveTo(0, -63 + bob); ctx.lineTo(3, -59 + bob); ctx.lineTo(0, -55 + bob); ctx.lineTo(-3, -59 + bob); ctx.closePath(); ctx.fill();
  if (S.flags && S.flags.badges) { ctx.fillStyle = '#f2c21b'; star(ctx, -4, -58 + bob, 4.5, 2, 5); }
  // back arm
  ctx.save(); ctx.translate(-10, -62 + bob); ctx.rotate(-step * 0.35); ctx.fillStyle = bod; ctx.fillRect(-2.5, 0, 5, 20); ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, 22, 3, 0, 7); ctx.fill(); ctx.restore();
  // head + copper side-swept hair
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, headY, 12.5, 0, 7); ctx.fill(); ctx.fillRect(-3, headY + 10, 6, 4);
  ctx.fillStyle = hair;
  ctx.beginPath(); ctx.arc(0, headY - 1, 13.5, Math.PI * 1.0, Math.PI * 2.0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-13, headY + 2); ctx.quadraticCurveTo(-6, headY - 16, 13, headY - 6); ctx.quadraticCurveTo(4, headY - 9, -6, headY - 2); ctx.closePath(); ctx.fill();
  ctx.fillRect(-14, headY - 4, 4, 12); ctx.fillRect(10, headY - 4, 4, 10);
  ctx.strokeStyle = hairHi; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-8, headY - 9); ctx.quadraticCurveTo(0, headY - 14, 8, headY - 10); ctx.stroke();
  // face: freckles, brows, a smile with two tiny fangs
  faceEyes(fx, headY, blink);
  ctx.fillStyle = 'rgba(190,100,60,.5)'; for (const [a, b2] of [[-7, 2.5], [-5.5, 3.6], [5.5, 3.6], [7, 2.5], [-6.3, 4.5], [6.3, 4.5]]) { ctx.beginPath(); ctx.arc(a + fx, headY + b2, 0.75, 0, 7); ctx.fill(); }
  ctx.strokeStyle = hair; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-6.5 + fx, headY - 3); ctx.lineTo(-2 + fx, headY - 3.6); ctx.moveTo(2 + fx, headY - 3.6); ctx.lineTo(6.5 + fx, headY - 3); ctx.stroke();
  ctx.fillStyle = '#9a2a3a'; ctx.beginPath(); ctx.arc(fx, headY + 5.6, 3.6, 0.15, Math.PI - 0.15); ctx.fill();
  ctx.fillStyle = '#ffffff'; for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(fx + sg * 2.6, headY + 5.8); ctx.lineTo(fx + sg * 1.4, headY + 5.8); ctx.lineTo(fx + sg * 2.0, headY + 8.4); ctx.closePath(); ctx.fill(); }
  // braid over the shoulder
  ctx.fillStyle = hair; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(-11 - i * 0.3, headY + 13 + i * 5.2, 4 - i * 0.25, 3.4, 0, 0, 7); ctx.fill(); }
  ctx.fillStyle = red; ctx.fillRect(-14, headY + 37, 6, 3);
  // front arm
  ctx.strokeStyle = bod; ctx.lineWidth = 5.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(9, -61 + bob); ctx.lineTo(13 + step * 1.5, -45 + bob); ctx.stroke(); ctx.lineCap = 'butt';
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(13.5 + step * 1.5, -44 + bob, 3.2, 0, 7); ctx.fill();
  void portrait;
}

/* --- townsfolk and monsters --- */
function drawPerson(x, b, o = {}) {
  const s = o.s || 1, skin = o.skin || '#f0c49a', sw = o.walk ? Math.sin(S.time * 12) : 0;
  shadow(x, b, 13 * s);
  ctx.fillStyle = o.pants || '#3a3a4a'; ctx.fillRect(x - 6 * s, b - 16 * s, 5 * s, 14 * s + sw * 2); ctx.fillRect(x + 1 * s, b - 16 * s, 5 * s, 14 * s - sw * 2);
  ctx.fillStyle = o.shirt || '#6a5f8f'; rr(ctx, x - 10 * s, b - 40 * s, 20 * s, 26 * s, 6 * s); ctx.fill();
  if (o.apron) { ctx.fillStyle = o.apron === true ? '#ffffff' : o.apron; rr(ctx, x - 7 * s, b - 34 * s, 14 * s, 22 * s, 4); ctx.fill(); }
  ctx.fillStyle = o.shirt || '#6a5f8f'; ctx.fillRect(x - 13 * s, b - 38 * s, 4 * s, 18 * s); ctx.fillRect(x + 9 * s, b - 38 * s, 4 * s, 18 * s);
  ctx.fillStyle = skin; ctx.beginPath(); circ(x, b - 50 * s, 11 * s); ctx.fill();
  ctx.fillStyle = o.hair || '#5a3a22';
  ctx.beginPath(); ctx.arc(x, b - 51 * s, 12 * s, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
  if (o.long) { ctx.fillRect(x - 12 * s, b - 52 * s, 4 * s, 16 * s); ctx.fillRect(x + 8 * s, b - 52 * s, 4 * s, 16 * s); }
  if (o.bun) { ctx.beginPath(); circ(x, b - 64 * s, 6 * s); ctx.fill(); }
  ctx.fillStyle = '#2a1a12'; ctx.beginPath(); circ(x - 4 * s, b - 49 * s, 1.6); if (!o.patch) circ(x + 4 * s, b - 49 * s, 1.6); ctx.fill();
  ctx.strokeStyle = '#8a3a2a'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(x, b - 45 * s, 3 * s, 0.2, Math.PI - 0.2); ctx.stroke();
  if (o.glasses) { ctx.strokeStyle = '#333'; ctx.beginPath(); circ(x - 4 * s, b - 49 * s, 3.4); circ(x + 4 * s, b - 49 * s, 3.4); ctx.stroke(); }
  if (o.mustache) { ctx.fillStyle = '#4a3020'; ctx.beginPath(); ctx.ellipse(x, b - 45.5 * s, 6 * s, 2 * s, 0, 0, 7); ctx.fill(); }
  if (o.patch) { ctx.fillStyle = '#111'; ctx.beginPath(); circ(x + 4 * s, b - 49 * s, 3); ctx.fill(); ctx.strokeStyle = '#111'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 11 * s, b - 54 * s); ctx.lineTo(x + 11 * s, b - 47 * s); ctx.stroke(); }
  if (o.bandana) { ctx.fillStyle = o.bandana; ctx.beginPath(); ctx.arc(x, b - 54 * s, 12 * s, Math.PI, 0); ctx.fill(); ctx.fillRect(x + 9 * s, b - 56 * s, 9 * s, 4 * s); ctx.fillStyle = '#fff'; ctx.beginPath(); circ(x - 4 * s, b - 58 * s, 1.5); circ(x + 3 * s, b - 59 * s, 1.5); ctx.fill(); }
  if (o.witchHat) { ctx.fillStyle = o.witchHat; ctx.beginPath(); ctx.ellipse(x, b - 58 * s, 18 * s, 4 * s, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 10 * s, b - 58 * s); ctx.lineTo(x + 6 * s, b - 86 * s); ctx.lineTo(x + 10 * s, b - 58 * s); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#ffb347'; ctx.fillRect(x - 9 * s, b - 63 * s, 18 * s, 4 * s); }
  if (o.catEars) { ctx.fillStyle = '#1a1420'; for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + sg * 4 * s, b - 60 * s); ctx.lineTo(x + sg * 10 * s, b - 70 * s); ctx.lineTo(x + sg * 11 * s, b - 57 * s); ctx.closePath(); ctx.fill(); } }
}
function drawSkeleton(x, b, o = {}) {
  const s = o.s || 1, sw = o.walk ? Math.sin(S.time * 12) : 0;
  shadow(x, b, 12 * s);
  ctx.strokeStyle = '#f2efe6'; ctx.lineCap = 'round';
  ctx.lineWidth = 3.5 * s; ctx.beginPath(); ctx.moveTo(x - 4 * s, b - 22 * s); ctx.lineTo(x - 5 * s + sw * 2, b - 2); ctx.moveTo(x + 4 * s, b - 22 * s); ctx.lineTo(x + 5 * s - sw * 2, b - 2); ctx.stroke();
  ctx.fillStyle = o.coat || '#2a3a6a'; if (o.coat !== false) { rr(ctx, x - 11 * s, b - 46 * s, 22 * s, 26 * s, 5 * s); ctx.fill(); ctx.fillStyle = '#e0b84a'; for (let i = 0; i < 3; i++) { ctx.beginPath(); circ(x, b - 41 * s + i * 7 * s, 1.6 * s); ctx.fill(); } }
  else { ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(x, b - 46 * s); ctx.lineTo(x, b - 22 * s); for (let i = 0; i < 4; i++) { ctx.moveTo(x - 8 * s, b - 42 * s + i * 5 * s); ctx.quadraticCurveTo(x, b - 45 * s + i * 5 * s, x + 8 * s, b - 42 * s + i * 5 * s); } ctx.stroke(); }
  ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(x - 10 * s, b - 44 * s); ctx.lineTo(x - 14 * s, b - 26 * s); ctx.moveTo(x + 10 * s, b - 44 * s); ctx.lineTo(x + 14 * s, b - 26 * s); ctx.stroke(); ctx.lineCap = 'butt';
  ctx.fillStyle = '#f2efe6'; ctx.beginPath(); circ(x, b - 56 * s, 10 * s); ctx.fill(); ctx.fillRect(x - 5 * s, b - 50 * s, 10 * s, 5 * s);
  ctx.fillStyle = '#1a1420'; ctx.beginPath(); ctx.ellipse(x - 4 * s, b - 57 * s, 2.8 * s, 3.4 * s, 0, 0, 7); ctx.ellipse(x + 4 * s, b - 57 * s, 2.8 * s, 3.4 * s, 0, 0, 7); ctx.fill();
  ctx.fillRect(x - 1 * s, b - 52 * s, 2 * s, 2 * s); ctx.strokeStyle = '#1a1420'; ctx.lineWidth = 1; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x + i * 2 * s, b - 48.5 * s); ctx.lineTo(x + i * 2 * s, b - 45.5 * s); ctx.stroke(); }
  if (o.cap) { ctx.fillStyle = '#2a3a6a'; ctx.beginPath(); ctx.arc(x, b - 62 * s, 10 * s, Math.PI, 0); ctx.fill(); ctx.fillRect(x - 2 * s, b - 63 * s, 15 * s, 3 * s); ctx.fillStyle = '#e0b84a'; ctx.beginPath(); circ(x, b - 66 * s, 2.2 * s); ctx.fill(); }
}
function drawDrakos(x, b, walk) {
  const sw = walk ? Math.sin(S.time * 10) : 0, cw = Math.sin(S.time * 1.6) * 2;
  shadow(x, b, 15);
  ctx.fillStyle = '#15121c'; ctx.beginPath(); ctx.moveTo(x - 14, b - 66); ctx.quadraticCurveTo(x - 26 - cw, b - 30, x - 24 - cw, b - 2); ctx.lineTo(x + 24 + cw, b - 2); ctx.quadraticCurveTo(x + 26 + cw, b - 30, x + 14, b - 66); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5a2a7a'; ctx.beginPath(); ctx.moveTo(x - 11, b - 64); ctx.quadraticCurveTo(x - 21 - cw, b - 30, x - 19 - cw, b - 6); ctx.lineTo(x + 19 + cw, b - 6); ctx.quadraticCurveTo(x + 21 + cw, b - 30, x + 11, b - 64); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a1a22'; ctx.fillRect(x - 7, b - 26, 5, 24 + sw * 2); ctx.fillRect(x + 2, b - 26, 5, 24 - sw * 2);
  ctx.fillStyle = '#22222c'; rr(ctx, x - 11, b - 62, 22, 38, 5); ctx.fill();
  ctx.fillStyle = '#f4f0e8'; ctx.beginPath(); ctx.moveTo(x - 5, b - 62); ctx.lineTo(x + 5, b - 62); ctx.lineTo(x, b - 46); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#e0b84a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 10, b - 60); ctx.lineTo(x + 10, b - 32); ctx.stroke();
  ctx.fillStyle = '#b3122e'; ctx.beginPath(); circ(x, b - 50, 3.2); ctx.fill();
  ctx.fillStyle = '#d8dcd0'; ctx.beginPath(); circ(x, b - 74, 11); ctx.fill();
  ctx.fillStyle = '#15121c'; ctx.beginPath(); ctx.moveTo(x - 12, b - 74); ctx.quadraticCurveTo(x - 12, b - 88, x, b - 86); ctx.quadraticCurveTo(x + 12, b - 88, x + 12, b - 74); ctx.lineTo(x + 8, b - 80); ctx.lineTo(x, b - 76); ctx.lineTo(x - 8, b - 80); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2a1f17'; ctx.beginPath(); circ(x - 4, b - 74, 1.7); circ(x + 4, b - 74, 1.7); ctx.fill();
  ctx.strokeStyle = '#6a2a2a'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(x, b - 70, 3.4, 0.2, Math.PI - 0.2); ctx.stroke();
  ctx.fillStyle = '#ffffff'; for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + sg * 2.6, b - 67.4); ctx.lineTo(x + sg * 1.2, b - 67.4); ctx.lineTo(x + sg * 1.9, b - 64.8); ctx.fill(); }
  for (const sg of [-1, 1]) { ctx.fillStyle = '#15121c'; ctx.beginPath(); ctx.moveTo(x + sg * 8, b - 64); ctx.lineTo(x + sg * 18, b - 80); ctx.lineTo(x + sg * 14, b - 62); ctx.closePath(); ctx.fill(); }
}
function drawBora(x, b) {
  ctx.fillStyle = '#6a4a2a'; ctx.fillRect(x - 40, b - 34, 80, 32); ctx.fillStyle = '#8a6a3a'; ctx.fillRect(x - 44, b - 38, 88, 6);
  ctx.fillStyle = '#7a5a36'; ctx.fillRect(x - 40, b - 96, 4, 62); ctx.fillRect(x + 36, b - 96, 4, 62);
  for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? '#ffb347' : '#5a2a7a'; ctx.beginPath(); ctx.moveTo(x - 46 + i * 15.3, b - 96); ctx.lineTo(x - 46 + (i + 1) * 15.3, b - 96); ctx.lineTo(x - 46 + (i + 0.5) * 15.3, b - 84); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = '#fffaf0'; rr(ctx, x - 36, b - 112, 72, 18, 5); ctx.fill(); ctx.fillStyle = '#5a2a2a'; ctx.font = 'bold 10px "Trebuchet MS",sans-serif'; ctx.textAlign = 'center'; ctx.fillText('☕ SICAK KAKAO', x, b - 99);
  ctx.fillStyle = '#9aa6b1'; rr(ctx, x + 12, b - 54, 20, 16, 4); ctx.fill();
  for (let i = 0; i < 2; i++) { const t = (S.time * 0.8 + i * 0.5) % 1; ctx.strokeStyle = `rgba(255,255,255,${0.6 - t * 0.6})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 22 + i * 4, b - 56 - t * 20); ctx.quadraticCurveTo(x + 18 + i * 4, b - 62 - t * 20, x + 22 + i * 4, b - 68 - t * 20); ctx.stroke(); }
  // Bora: a pumpkin-head with an apron
  ctx.fillStyle = '#4a7a3a'; rr(ctx, x - 22, b - 62, 20, 26, 5); ctx.fill(); ctx.fillStyle = '#fffaf0'; rr(ctx, x - 19, b - 58, 14, 20, 3); ctx.fill();
  drawJack(x - 12, b - 62, 0.85, true, true);
}
function drawJack(x, b, s = 1, lit = true, smile = false) {
  ctx.fillStyle = '#e8802a'; ctx.beginPath(); ctx.ellipse(x, b - 11 * s, 14 * s, 11 * s, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#c8641a'; ctx.beginPath(); ctx.ellipse(x - 5 * s, b - 11 * s, 4 * s, 10.5 * s, 0, 0, 7); ctx.ellipse(x + 5 * s, b - 11 * s, 4 * s, 10.5 * s, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#4a6a2a'; ctx.fillRect(x - 1.5 * s, b - 25 * s, 3 * s, 5 * s);
  ctx.fillStyle = lit ? `rgba(255,${200 + Math.sin(S.time * 9 + x) * 30},80,1)` : '#3a2010';
  ctx.beginPath(); ctx.moveTo(x - 8 * s, b - 15 * s); ctx.lineTo(x - 3 * s, b - 15 * s); ctx.lineTo(x - 5.5 * s, b - 19 * s); ctx.closePath(); ctx.moveTo(x + 8 * s, b - 15 * s); ctx.lineTo(x + 3 * s, b - 15 * s); ctx.lineTo(x + 5.5 * s, b - 19 * s); ctx.closePath(); ctx.fill();
  ctx.beginPath(); if (smile) { ctx.arc(x, b - 10 * s, 7 * s, 0.1, Math.PI - 0.1); ctx.closePath(); } else { ctx.moveTo(x - 8 * s, b - 9 * s); ctx.lineTo(x - 4 * s, b - 6 * s); ctx.lineTo(x, b - 9 * s); ctx.lineTo(x + 4 * s, b - 6 * s); ctx.lineTo(x + 8 * s, b - 9 * s); ctx.lineTo(x, b - 4 * s); ctx.closePath(); } ctx.fill();
}
function drawMummy(x, b, wrapped, spin) {
  const sad = !wrapped, wob = spin ? Math.sin(spin * 40) * 4 : 0;
  shadow(x, b, 13);
  ctx.save(); ctx.translate(x + wob, b);
  ctx.fillStyle = '#efe6d0'; ctx.fillRect(-7, -22, 6, 20); ctx.fillRect(1, -22, 6, 20);
  rr(ctx, -11, -48, 22, 30, 6); ctx.fill(); ctx.fillRect(-15, -46, 5, 20); ctx.fillRect(10, -46, 5, 20);
  ctx.beginPath(); circ(0, -58, 12); ctx.fill();
  ctx.strokeStyle = '#c9bea4'; ctx.lineWidth = 1.4;
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-11, -46 + i * 3.6); ctx.lineTo(11, -43 + i * 3.6); ctx.stroke(); }
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-11, -64 + i * 4); ctx.lineTo(11, -61 + i * 4); ctx.stroke(); }
  ctx.fillStyle = '#2a2018'; ctx.fillRect(-9, -61, 18, 5);
  ctx.fillStyle = '#ffe066'; ctx.beginPath(); circ(-4, -58.5, 1.8); circ(4, -58.5, 1.8); ctx.fill();
  if (sad) {
    ctx.fillStyle = '#efe6d0'; const sw2 = Math.sin(S.time * 3) * 3;
    ctx.beginPath(); ctx.moveTo(10, -40); ctx.quadraticCurveTo(22 + sw2, -30, 18, -8); ctx.lineTo(14, -8); ctx.quadraticCurveTo(18 + sw2, -28, 9, -36); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-10, -30); ctx.quadraticCurveTo(-22 - sw2, -20, -24, -2); ctx.lineTo(-20, -2); ctx.quadraticCurveTo(-18 - sw2, -20, -10, -26); ctx.fill();
    ctx.fillStyle = '#7fc8ff'; ctx.beginPath(); ctx.ellipse(-6, -54 + (S.time * 10) % 8, 1.5, 2.5, 0, 0, 7); ctx.fill();
  } else { ctx.strokeStyle = '#8a5a3a'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(0, -53, 3, 0.2, Math.PI - 0.2); ctx.stroke(); ctx.fillStyle = '#ff8fc4'; ctx.beginPath(); ctx.moveTo(4, -70); ctx.lineTo(12, -74); ctx.lineTo(12, -66); ctx.closePath(); ctx.moveTo(4, -70); ctx.lineTo(-4, -74); ctx.lineTo(-4, -66); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function drawWerewolf(x, b, scared) {
  const tr = scared ? Math.sin(S.time * 40) * 1.2 : 0, howl = S.howl > 0;
  shadow(x, b, 14);
  ctx.save(); ctx.translate(x + tr, b);
  ctx.fillStyle = '#6a4a32'; ctx.fillRect(-7, -20, 6, 18); ctx.fillRect(1, -20, 6, 18);
  ctx.fillStyle = '#4a6a9a'; rr(ctx, -12, -46, 24, 28, 7); ctx.fill(); ctx.fillStyle = '#3a5a8a'; ctx.fillRect(-12, -24, 24, 4);
  ctx.fillStyle = '#7a5a3a'; ctx.fillRect(-16, -44, 5, 18); ctx.fillRect(11, -44, 5, 18);
  ctx.fillStyle = '#7a5a3a'; ctx.beginPath(); circ(0, -58, 13); ctx.fill();
  for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * 4, -68); ctx.lineTo(sg * 12, -82); ctx.lineTo(sg * 13, -62); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = '#c9a07a'; ctx.beginPath(); ctx.ellipse(0, howl ? -60 : -54, 7, 6, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#2a1a12'; ctx.beginPath(); circ(0, howl ? -64 : -57, 2.2); ctx.fill();
  if (howl) { ctx.fillStyle = '#2a1a12'; ctx.beginPath(); ctx.ellipse(0, -55, 3, 4, 0, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); circ(-5, -62, 3.2); circ(5, -62, 3.2); ctx.fill();
  ctx.fillStyle = '#2a1a12'; ctx.beginPath(); circ(-5, -61.5, scared ? 1.2 : 1.8); circ(5, -61.5, scared ? 1.2 : 1.8); ctx.fill();
  if (scared) { ctx.fillStyle = '#9fd6ff'; ctx.beginPath(); ctx.ellipse(12, -66, 2, 3, 0, 0, 7); ctx.fill(); }
  ctx.restore();
}
function drawFrank(x, b, fixed) {
  const tilt = fixed ? 0 : 0.35 + Math.sin(S.time * 2) * 0.05;
  shadow(x, b, 15);
  ctx.fillStyle = '#2a2a30'; ctx.fillRect(-9 + x, b - 8, 9, 8); ctx.fillRect(x + 1, b - 8, 9, 8);
  ctx.fillStyle = '#3a3a48'; ctx.fillRect(x - 8, b - 26, 7, 18); ctx.fillRect(x + 1, b - 26, 7, 18);
  ctx.fillStyle = '#4a3a5a'; rr(ctx, x - 14, b - 56, 28, 32, 4); ctx.fill(); ctx.fillStyle = '#2a2a30'; ctx.fillRect(x - 14, b - 30, 28, 4);
  ctx.fillStyle = '#7fae6a'; ctx.fillRect(x - 18, b - 54, 5, 24); ctx.fillRect(x + 13, b - 54, 5, 24);
  ctx.save(); ctx.translate(x, b - 58); ctx.rotate(tilt);
  ctx.fillStyle = '#8fbf7a'; rr(ctx, -11, -24, 22, 24, 4); ctx.fill();
  ctx.fillStyle = '#1a1a20'; ctx.fillRect(-12, -26, 24, 7);
  ctx.fillStyle = '#2a1f17'; ctx.fillRect(-7, -14, 4, 3); ctx.fillRect(3, -14, 4, 3);
  ctx.strokeStyle = '#2a3a2a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-5, -5); ctx.lineTo(5, -5); ctx.stroke(); ctx.beginPath(); for (let i = -4; i <= 4; i += 2) { ctx.moveTo(i, -7); ctx.lineTo(i, -3); } ctx.stroke();
  ctx.fillStyle = '#a8a8b4'; ctx.fillRect(-15, -8, 4, 6); if (fixed) ctx.fillRect(11, -8, 4, 6);
  ctx.restore();
}
function drawWitch(x, b, fly) {
  const up = fly ? Math.abs(Math.sin(S.time * 3)) * 26 + 20 : 0, xx = x + (fly ? Math.sin(S.time * 2) * 20 : 0);
  shadow(x, b, 13);
  if (fly) { ctx.strokeStyle = '#7a5a36'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(xx - 24, b - up - 12); ctx.lineTo(xx + 20, b - up - 18); ctx.stroke(); ctx.fillStyle = '#e8c040'; ctx.beginPath(); ctx.moveTo(xx - 24, b - up - 12); ctx.lineTo(xx - 38, b - up - 4); ctx.lineTo(xx - 36, b - up - 20); ctx.closePath(); ctx.fill(); }
  drawPerson(xx, b - up, { shirt: '#6a2a8a', pants: '#1a1a22', hair: '#e8802a', long: true, witchHat: '#3a1f4a', skin: '#f6d0b0' });
}
function drawGhost(x, b, o = {}) {
  const bob = Math.sin(S.time * 2 + x) * 4, a = o.alpha || 0.88;
  ctx.fillStyle = `rgba(0,0,0,${0.15})`; ctx.beginPath(); ctx.ellipse(x, b, 12, 4, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, b - 10 + bob);
  ctx.fillStyle = '#f4f2ff'; ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(-15, -30); ctx.arc(0, -30, 15, Math.PI, 0); ctx.lineTo(15, 0);
  for (let i = 0; i < 5; i++) { const w = Math.sin(S.time * 5 + i) * 2; ctx.quadraticCurveTo(15 - i * 6 - 3, 6 + w, 15 - (i + 1) * 6, 0); }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2a2040'; ctx.beginPath(); ctx.ellipse(-5, -32, 2.6, 3.6, 0, 0, 7); ctx.ellipse(5, -32, 2.6, 3.6, 0, 0, 7); ctx.fill();
  if (o.sad) { ctx.strokeStyle = '#2a2040'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, -21, 3, Math.PI + 0.3, -0.3); ctx.stroke(); }
  else { ctx.fillStyle = '#2a2040'; ctx.beginPath(); ctx.ellipse(0, -23, 3, 2.4, 0, 0, 7); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,140,180,.4)'; ctx.beginPath(); circ(-9, -26, 2.6); circ(9, -26, 2.6); ctx.fill();
  if (o.bow) { ctx.fillStyle = '#ff6fae'; ctx.beginPath(); ctx.moveTo(8, -42); ctx.lineTo(16, -48); ctx.lineTo(16, -38); ctx.closePath(); ctx.moveTo(8, -42); ctx.lineTo(0, -48); ctx.lineTo(0, -38); ctx.closePath(); ctx.fill(); }
  if (o.goggles) { ctx.strokeStyle = '#8a5a32'; ctx.lineWidth = 2; ctx.beginPath(); circ(-5, -32, 4.5); circ(5, -32, 4.5); ctx.stroke(); ctx.fillStyle = '#d64545'; ctx.fillRect(-12, -16, 24, 4); ctx.fillRect(6, -14, 5, 10); }
  ctx.restore();
}
function drawGhostDog(x, b, happy) {
  const bob = Math.sin(S.time * (happy ? 8 : 2)) * (happy ? 4 : 1.5), wag = Math.sin(S.time * (happy ? 18 : 3)) * (happy ? 0.6 : 0.15);
  ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.beginPath(); ctx.ellipse(x, b, 14, 4, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.globalAlpha = 0.85; ctx.translate(x, b - 6 + bob);
  ctx.fillStyle = '#eef0ff';
  ctx.save(); ctx.translate(-14, -14); ctx.rotate(-0.8 + wag); ctx.fillRect(-2, -12, 4, 12); ctx.restore();
  ctx.beginPath(); ctx.ellipse(0, -12, 15, 9, 0, 0, 7); ctx.fill();
  for (const lx of [-9, -3, 4, 10]) ctx.fillRect(lx - 2, -6, 4, 7);
  ctx.beginPath(); circ(14, -22, 9); ctx.fill(); ctx.beginPath(); ctx.ellipse(20, -19, 5, 4, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#d0d4f0'; ctx.beginPath(); ctx.ellipse(8, -22, 3.5, 7, 0.4, 0, 7); ctx.fill();
  ctx.fillStyle = '#2a2040'; ctx.beginPath(); circ(16, -24, 1.7); circ(24, -20, 2); ctx.fill();
  if (happy) { ctx.fillStyle = '#ff8fc4'; ctx.beginPath(); ctx.ellipse(21, -14, 2, 3, 0, 0, 7); ctx.fill(); }
  ctx.restore();
}
function drawBat(x, y, s = 1, flap = true) {
  const w = flap ? Math.sin(S.time * 18 + x) * 0.5 : 0;
  ctx.fillStyle = '#1a1424';
  for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sg * 8 * s, y - (8 + w * 8) * s, x + sg * 16 * s, y - (2 + w * 10) * s); ctx.quadraticCurveTo(x + sg * 10 * s, y + 1 * s, x + sg * 8 * s, y + 4 * s); ctx.quadraticCurveTo(x + sg * 4 * s, y + 1 * s, x, y + 4 * s); ctx.fill(); }
  ctx.beginPath(); circ(x, y, 4 * s); ctx.fill();
  ctx.fillStyle = '#ffe066'; ctx.beginPath(); circ(x - 1.5 * s, y - 0.5 * s, 0.9 * s); circ(x + 1.5 * s, y - 0.5 * s, 0.9 * s); ctx.fill();
}
function drawSlime(sl, x, b) {
  const sq = 1 + Math.sin(S.time * 5 + sl.hx) * 0.08 + sl.squish * 0.4;
  ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(x, b, 16, 5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = sl.state === 'eat' ? '#8fe07a' : '#6fcf5a'; ctx.beginPath(); ctx.moveTo(x - 16 * sq, b); ctx.quadraticCurveTo(x - 16 * sq, b - 26 / sq, x, b - 26 / sq); ctx.quadraticCurveTo(x + 16 * sq, b - 26 / sq, x + 16 * sq, b); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.ellipse(x - 6, b - 18 / sq, 4, 2.5, -0.5, 0, 7); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); circ(x - 5, b - 14 / sq, 3.5); circ(x + 5, b - 14 / sq, 3.5); ctx.fill();
  ctx.fillStyle = '#1a2a1a'; ctx.beginPath(); circ(x - 5 + (sl.state === 'chase' ? 1 : 0), b - 14 / sq, 1.7); circ(x + 5 + (sl.state === 'chase' ? 1 : 0), b - 14 / sq, 1.7); ctx.fill();
  if (sl.state === 'eat') { ctx.strokeStyle = '#1a2a1a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x, b - 9 / sq, 3, 0.2, Math.PI - 0.2); ctx.stroke(); }
}
function drawRollingPumpkin(p, x, b) {
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, b, 18, 5, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.translate(x, b - 16); ctx.rotate(p.rot);
  ctx.fillStyle = '#e8802a'; ctx.beginPath(); circ(0, 0, 16); ctx.fill();
  ctx.strokeStyle = '#c8641a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 6, 16, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, 16, 6, 0, 0, 7); ctx.stroke();
  ctx.fillStyle = '#4a6a2a'; ctx.fillRect(-2, -19, 4, 5);
  ctx.fillStyle = '#3a2010'; ctx.beginPath(); circ(-5, -4, 2.4); circ(5, -4, 2.4); ctx.fill(); ctx.beginPath(); ctx.arc(0, 2, 6, 0.2, Math.PI - 0.2); ctx.fill();
  ctx.restore();
}
function drawHelicopter(x, b, rot, passengers) {
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, b, 60, 12, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#2a2230'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 40, b - 4); ctx.lineTo(x + 34, b - 4); ctx.moveTo(x - 26, b - 4); ctx.lineTo(x - 22, b - 18); ctx.moveTo(x + 20, b - 4); ctx.lineTo(x + 16, b - 18); ctx.stroke();
  ctx.fillStyle = '#6a3a9a'; ctx.beginPath(); ctx.ellipse(x - 4, b - 38, 38, 24, 0, 0, 7); ctx.fill();
  ctx.fillRect(x + 26, b - 46, 54, 10); ctx.beginPath(); ctx.moveTo(x + 76, b - 46); ctx.lineTo(x + 86, b - 66); ctx.lineTo(x + 86, b - 36); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffb347'; ctx.beginPath(); circ(x + 86, b - 52, 5); ctx.fill();
  ctx.fillStyle = 'rgba(190,225,255,.75)'; ctx.beginPath(); ctx.ellipse(x - 16, b - 42, 20, 16, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.ellipse(x - 16, b - 42, 20, 16, 0, 0, 7); ctx.clip(); drawGhost(x - 16, b - 20, { goggles: true, alpha: 0.95 }); ctx.restore();
  if (passengers) {
    ctx.fillStyle = 'rgba(190,225,255,.8)'; rr(ctx, x + 4, b - 58, 34, 22, 6); ctx.fill();
    ctx.save(); rr(ctx, x + 4, b - 58, 34, 22, 6); ctx.clip(); ctx.translate(x + 12, b - 20); ctx.scale(0.5, 0.5); drawKid({ who: 'Nehir', dir: 'down' }, 0, 0); drawKid({ who: 'Bade', dir: 'down' }, 30, 6); ctx.restore();
  }
  ctx.fillStyle = '#ffe066'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('PIRPIR', x + 16, b - 24);
  ctx.fillStyle = '#2a2230'; ctx.fillRect(x - 6, b - 66, 6, 8);
  const r = rot || 0; ctx.strokeStyle = 'rgba(40,30,50,.85)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 3 - Math.cos(r) * 80, b - 68 - Math.sin(r) * 6); ctx.lineTo(x - 3 + Math.cos(r) * 80, b - 68 + Math.sin(r) * 6); ctx.stroke();
  ctx.strokeStyle = 'rgba(40,30,50,.35)'; ctx.beginPath(); ctx.moveTo(x - 3 - Math.cos(r + 1.2) * 80, b - 68 - Math.sin(r + 1.2) * 6); ctx.lineTo(x - 3 + Math.cos(r + 1.2) * 80, b - 68 + Math.sin(r + 1.2) * 6); ctx.stroke();
}

/* --- the two mums: Funda (Nehir's) and Başak (Bade's) --- */
function drawMom(x, b, who) {
  const funda = who === 'Funda', s = funda ? 1.0 : 0.97, t = S.time, blink = (t % (funda ? 3.9 : 4.4)) < 0.12;
  shadow(x, b, 13);
  ctx.save(); ctx.translate(x, b); ctx.scale(s * 0.86, s * 0.86);
  const skin = funda ? '#efc9a6' : '#f6d8c4', headY = -94;
  if (funda) {
    // auburn hair: smooth on top, soft waves from the ears down to the shoulders (behind)
    ctx.fillStyle = '#6e3422'; ctx.beginPath(); ctx.moveTo(-13.5, headY - 2); ctx.quadraticCurveTo(-15.5, headY + 10, -14.5, headY + 22);
    for (let i = 0; i < 6; i++) { const x0 = -14.5 + i * 5.8; ctx.quadraticCurveTo(x0 + 2.9, headY + 26.5, x0 + 5.8, headY + 22); }
    ctx.quadraticCurveTo(15.5, headY + 10, 13.5, headY - 2); ctx.closePath(); ctx.fill();
    // legs + sandals, a red sleeveless summer dress
    ctx.fillStyle = skin; ctx.fillRect(-7, -28, 5, 24); ctx.fillRect(2, -28, 5, 24);
    ctx.fillStyle = '#8a5a3a'; ctx.fillRect(-8, -4, 7, 4); ctx.fillRect(1, -4, 7, 4);
    ctx.fillStyle = skin; ctx.fillRect(-15, -78, 5, 30); ctx.fillRect(10, -78, 5, 30); ctx.beginPath(); ctx.arc(-12.5, -46, 3.2, 0, 7); ctx.arc(12.5, -46, 3.2, 0, 7); ctx.fill();
    ctx.fillStyle = '#c62a2e'; ctx.beginPath(); ctx.moveTo(-10, -78); ctx.lineTo(10, -78); ctx.lineTo(11, -56); ctx.quadraticCurveTo(14, -40, 18, -26); ctx.lineTo(-18, -26); ctx.quadraticCurveTo(-14, -40, -11, -56); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#a81e24'; ctx.fillRect(-11, -58, 22, 3);                                                                // waist seam
    ctx.strokeStyle = '#c62a2e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-8, -78); ctx.lineTo(-7, -82); ctx.moveTo(8, -78); ctx.lineTo(7, -82); ctx.stroke();   // thin straps
    ctx.fillStyle = skin; ctx.beginPath(); ctx.moveTo(-6, -82); ctx.lineTo(6, -82); ctx.lineTo(0, -75); ctx.closePath(); ctx.fill();   // neckline
    ctx.fillStyle = '#d8d8e0'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(10 + i * 2, -49, 1, 0, 7); ctx.fill(); }   // the chain bracelet
    ctx.fillStyle = '#7a1a2a'; ctx.fillRect(11, -44, 4, 1.5);                                                                // dark red nails
  } else {
    // long, straight dark-blonde hair falling past the shoulders (behind)
    ctx.fillStyle = '#9a7048'; ctx.beginPath(); ctx.moveTo(-14, headY - 2); ctx.lineTo(-16, headY + 44); ctx.lineTo(16, headY + 44); ctx.lineTo(14, headY - 2); ctx.closePath(); ctx.fill();
    // legs + sandals, the blue sleeveless dress with embroidered flowers
    ctx.fillStyle = skin; ctx.fillRect(-7, -26, 5, 22); ctx.fillRect(2, -26, 5, 22);
    ctx.fillStyle = '#8a6a4a'; ctx.fillRect(-8, -4, 7, 4); ctx.fillRect(1, -4, 7, 4);
    ctx.fillStyle = '#2f4f8f'; ctx.beginPath(); ctx.moveTo(-10, -80); ctx.lineTo(10, -80); ctx.lineTo(12, -56); ctx.lineTo(17, -24); ctx.lineTo(-17, -24); ctx.lineTo(-12, -56); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e6e6ee'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(0, -76 + i * 6, 0.9, 0, 7); ctx.fill(); }
    for (const [fx2, fy, c] of [[-6, -68, '#e86aa0'], [6, -66, '#e86aa0'], [-8, -58, '#f2c84a'], [7, -57, '#7fc8ff'], [-3, -62, '#6ab86a'], [4, -61, '#6ab86a']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(fx2, fy, 1.9, 0, 7); ctx.fill(); }
    ctx.fillStyle = skin; ctx.fillRect(-15, -78, 5, 30); ctx.fillRect(10, -78, 5, 30); ctx.beginPath(); ctx.arc(-12.5, -46, 3.2, 0, 7); ctx.arc(12.5, -46, 3.2, 0, 7); ctx.fill();
    ctx.strokeStyle = '#1a1a1e'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-5, -80); ctx.lineTo(0, -70); ctx.lineTo(5, -80); ctx.stroke();   // thin necklace cord
  }
  // head
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, headY, 12.5, 0, 7); ctx.fill(); ctx.fillRect(-3, headY + 10, 6, 6);
  if (funda) {
    ctx.fillStyle = '#6e3422'; ctx.beginPath(); ctx.arc(0, headY - 1, 13.3, Math.PI * 1.0, Math.PI * 2.0); ctx.fill();   // smooth top
    ctx.beginPath(); ctx.moveTo(-1, headY - 13); ctx.quadraticCurveTo(-9, headY - 10, -12.5, headY - 1); ctx.lineTo(-13.5, headY - 6); ctx.closePath(); ctx.fill();   // side parting sweep
    ctx.fillRect(-14, headY - 4, 4, 12); ctx.fillRect(10, headY - 4, 4, 12);                                                   // falls straight past the face
    for (const [hx, hy, r] of [[-13.5, 9, 3.2], [-12.5, 14, 3], [-14, 18, 2.8], [13.5, 9, 3.2], [12.5, 14, 3], [14, 18, 2.8]]) { ctx.beginPath(); ctx.arc(hx, headY + hy, r, 0, 7); ctx.fill(); }   // soft waves at the ends
    ctx.strokeStyle = '#94492a'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(-9, headY - 9); ctx.quadraticCurveTo(-3, headY - 13, 5, headY - 12); ctx.stroke();
    ctx.beginPath(); ctx.arc(-13, headY + 12, 2, 0.5, 2.5); ctx.arc(13, headY + 12, 2, 0.6, 2.6); ctx.stroke();
  } else {
    ctx.fillStyle = '#9a7048'; ctx.beginPath(); ctx.arc(0, headY - 1, 13.5, Math.PI * 1.0, Math.PI * 2.0); ctx.fill();
    ctx.fillRect(-14.5, headY - 3, 4.5, 30); ctx.fillRect(10, headY - 3, 4.5, 30);
    ctx.fillStyle = '#b88c5c'; ctx.fillRect(-1, headY - 14, 2, 6);                                               // centre parting highlight
    ctx.fillStyle = '#2a2a30'; ctx.beginPath(); ctx.ellipse(-5, headY - 11, 5, 3, 0, 0, 7); ctx.ellipse(5, headY - 11, 5, 3, 0, 0, 7); ctx.fill();   // sunglasses on her head
    ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-1, headY - 11); ctx.lineTo(1, headY - 11); ctx.stroke();
  }
  faceEyes(0, headY, blink);
  ctx.strokeStyle = funda ? '#4a2418' : '#7a5a3a'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-6.5, headY - 3.4); ctx.lineTo(-2, headY - 3.8); ctx.moveTo(2, headY - 3.8); ctx.lineTo(6.5, headY - 3.4); ctx.stroke();
  ctx.fillStyle = funda ? '#b0505a' : '#c06070'; ctx.beginPath(); ctx.arc(0, headY + 5.4, 3.6, 0.15, Math.PI - 0.15); ctx.fill();
  ctx.restore();
}

/* --- Kara Kedi Pıtırcık and little Duru --- */
function drawCat(x, b, happy) {
  const tail = Math.sin(S.time * (happy ? 6 : 2)) * 0.4;
  shadow(x, b, 12);
  ctx.save(); ctx.translate(x, b);
  ctx.strokeStyle = '#18141e'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(8, -6); ctx.quadraticCurveTo(22, -10, 18 + tail * 10, -30); ctx.stroke(); ctx.lineCap = 'butt';
  ctx.fillStyle = '#18141e'; ctx.beginPath(); ctx.ellipse(0, -14, 11, 14, 0, 0, 7); ctx.fill();
  ctx.beginPath(); circ(0, -34, 10); ctx.fill();
  for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sg * 3, -42); ctx.lineTo(sg * 9, -52); ctx.lineTo(sg * 10, -36); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = '#ffd84d'; ctx.beginPath(); ctx.ellipse(-4, -35, 2.6, happy ? 1.2 : 3, 0, 0, 7); ctx.ellipse(4, -35, 2.6, happy ? 1.2 : 3, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#ff8fb0'; ctx.beginPath(); ctx.moveTo(-1.5, -31); ctx.lineTo(1.5, -31); ctx.lineTo(0, -29.5); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 0.8; ctx.beginPath(); for (const sg of [-1, 1]) { ctx.moveTo(sg * 3, -30); ctx.lineTo(sg * 12, -32); ctx.moveTo(sg * 3, -29); ctx.lineTo(sg * 12, -28); } ctx.stroke();
  ctx.fillStyle = '#c0302a'; ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(-6, -27); ctx.lineTo(-6, -21); ctx.closePath(); ctx.moveTo(0, -24); ctx.lineTo(6, -27); ctx.lineTo(6, -21); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function drawDuru(x, b) {
  // four years old, in everyday clothes
  const bob = Math.abs(Math.sin(S.time * 3)) * 1.5, skin = '#f6d8c4', hair = '#e8c460';
  shadow(x, b, 9);
  ctx.save(); ctx.translate(x, b - bob); ctx.scale(0.62, 0.62);
  ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(-13, -54, 4, 7, 0.3, 0, 7); ctx.ellipse(13, -54, 4, 7, -0.3, 0, 7); ctx.fill();   // two little pigtails
  ctx.fillStyle = '#5a6aa8'; ctx.fillRect(-7, -22, 6, 20); ctx.fillRect(1, -22, 6, 20);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(-8, -4, 8, 4); ctx.fillRect(0, -4, 8, 4);
  ctx.fillStyle = '#f29ab8'; rr(ctx, -11, -44, 22, 25, 6); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, -34, 4, 0, 7); ctx.fill(); ctx.fillStyle = '#ffd84d'; ctx.beginPath(); ctx.arc(0, -34, 1.6, 0, 7); ctx.fill();   // a flower on her top
  ctx.save(); ctx.translate(-12, -42); ctx.rotate(0.3 + Math.sin(S.time * 4) * 0.25); ctx.fillStyle = '#f29ab8'; ctx.fillRect(-2.5, 0, 5, 16); ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, 17, 2.8, 0, 7); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#f29ab8'; ctx.fillRect(9.5, -42, 5, 16); ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(12, -25, 2.8, 0, 7); ctx.fill();
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(0, -56, 11.5, 0, 7); ctx.fill();
  ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(0, -57, 12.3, Math.PI * 1.02, Math.PI * 1.98); ctx.fill(); ctx.fillRect(-12, -60, 3, 7); ctx.fillRect(9, -60, 3, 7);
  ctx.beginPath(); ctx.moveTo(-9, -63); ctx.quadraticCurveTo(0, -58, 9, -63); ctx.lineTo(9, -66); ctx.lineTo(-9, -66); ctx.closePath(); ctx.fill();   // fringe
  ctx.fillStyle = '#f29ab8'; ctx.beginPath(); ctx.arc(-12, -60, 2.2, 0, 7); ctx.arc(12, -60, 2.2, 0, 7); ctx.fill();                           // hair ties
  faceEyes(0, -55, (S.time % 3.3) < 0.12);
  ctx.strokeStyle = '#8a3a2a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, -50.5, 3, 0.2, Math.PI - 0.2); ctx.stroke();
  ctx.restore();
}

/* --- the speaker's face in the dialogue box --- */
const FACE = {
  'NEHİR': [(g) => drawKid({ who: 'Nehir', dir: 'down' }, 0, 0, true), 0, -49, 2.2],
  'BADE': [(g) => drawKid({ who: 'Bade', dir: 'down' }, 0, 0, true), 0, -64, 2.1],
  'NEHİR VE BADE': [(g) => { drawKid({ who: 'Nehir', dir: 'down' }, -15, 10, true); drawKid({ who: 'Bade', dir: 'down' }, 15, 0, true); }, 0, -48, 1.25],
  'FUNDA': [() => drawMom(0, 0, 'Funda'), 0, -80, 2.7], 'BAŞAK': [() => drawMom(0, 0, 'Başak'), 0, -77, 2.7], 'DURU': [() => drawDuru(0, 0), 0, -35, 3.7],
  'AYŞE TEYZE': [() => drawPerson(0, 0, { shirt: '#5a2a7a', hair: '#cccccc', bun: true, witchHat: '#2a1f3a', glasses: true }), 0, -56, 1.9],
  'HASAN AMCA': [() => drawPerson(0, 0, { shirt: '#f2f2f2', hair: '#4a3020', bandana: '#c0302a', patch: true, mustache: true }), 0, -52, 2.1],
  'KONDÜKTÖR TAKIRTI': [() => drawSkeleton(0, 0, { cap: true }), 0, -58, 2.1], 'İSKELET KEMİK': [() => drawSkeleton(0, 0, { coat: false }), 0, -55, 2.6],
  'KONT DRAKOŞ': [() => drawDrakos(0, 0, false), 0, -76, 1.9], 'KABAK KAFA BORA': [() => drawJack(0, 0, 1.6, true, true), 0, -18, 2.1],
  'MUMYA MİMİ': [() => drawMummy(0, 0, S.flags.bandage, 0), 0, -58, 2.1], 'KURT ADAM KURTUL': [() => drawWerewolf(0, 0, !streetLit()), 0, -62, 1.9],
  'FRENK': [() => drawFrank(0, 0, S.frenkFixed), 0, -70, 1.9], 'CADI CEMİLE': [() => drawPerson(0, 0, { shirt: '#6a2a8a', hair: '#e8802a', long: true, witchHat: '#3a1f4a', skin: '#f6d0b0' }), 0, -60, 1.7],
  'HAYALET HÜLYA': [() => drawGhost(0, 0, { bow: true }), 0, -38, 1.9], 'HAYALET KÖPEK SELO': [() => drawGhostDog(0, 0, S.flags.bone), 15, -27, 2.6],
  'PİLOT PIRPIR': [() => drawGhost(0, 0, { goggles: true }), 0, -36, 2.0], 'KARA KEDİ PITIRCIK': [() => drawCat(0, 0, true), 0, -36, 2.2],
  'BULUT DEVİ GÜRGÜR': [() => { cloudShape(-34, 0, 0.75, '#5a5468'); ctx.fillStyle = '#1a1424'; ctx.beginPath(); circ(-8, -2, 3.5); circ(14, -2, 3.5); ctx.fill(); }, -4, -4, 1.25],
};
function drawSpeakerFace(name) {
  const f = FACE[name], pc = $('dlg-face'); if (!f || !pc) return false;
  const g = pc.getContext('2d'), keep = ctx, [fn, cx, cy, sc] = f;
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, pc.width, pc.height);
  g.save(); g.beginPath(); g.arc(pc.width / 2, pc.height / 2, pc.width / 2, 0, 7); g.clip();
  g.setTransform(sc, 0, 0, sc, pc.width / 2 - cx * sc, pc.height / 2 - cy * sc);
  ctx = g;
  try { fn(g); } catch (_) { /* ignore */ } finally { ctx = keep; g.restore(); }
  return true;
}
