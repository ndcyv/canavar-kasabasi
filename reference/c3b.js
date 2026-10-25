
/* --- things --- */
let OX = 0, OY = 0; const ox_ = (t) => OX + t * TS, oy_ = (t) => OY + t * TS;
function glint(x, y) { const k = 0.5 + 0.5 * Math.sin(S.time * 5 + x); ctx.fillStyle = `rgba(255,255,220,${0.5 + k * 0.5})`; star(ctx, x, y, 6 + k * 3, 2, 4); }
function signBoard(x, b, lines, col) {
  ctx.fillStyle = '#5a4030'; ctx.fillRect(x - 3, b - 44, 6, 44);
  ctx.fillStyle = col || '#e8d8b8'; rr(ctx, x - 30, b - 64, 60, 24, 5); ctx.fill(); ctx.strokeStyle = '#3a2a1b'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#3a2a1b'; ctx.font = 'bold 10px "Trebuchet MS",sans-serif'; ctx.textAlign = 'center'; lines.forEach((l, i) => ctx.fillText(l, x, b - 54 + i * 11));
}
function drawEntity(e, x, b) {
  const F = S.flags, nehir = S.active === 'Nehir', bade = !nehir;
  const gone = (k) => S.leaving && S.leaving.key === k;
  switch (e.type) {
    case 'mom': {
      drawMom(x, b, e.who);
      ctx.font = '600 11px "Trebuchet MS",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const w = ctx.measureText(e.who).width + 12;
      ctx.fillStyle = 'rgba(255,248,235,.55)'; rr(ctx, x - w / 2, b + 6, w, 15, 7); ctx.fill();
      ctx.fillStyle = 'rgba(58,42,27,.8)'; ctx.fillText(e.who, x, b + 13.5); ctx.textBaseline = 'alphabetic';
      break;
    }
    case 'mirror':
      ctx.fillStyle = '#c9a050'; rr(ctx, x - 22, b - 82, 44, 54, 20); ctx.fill(); ctx.fillStyle = '#bcd8e8'; rr(ctx, x - 17, b - 77, 34, 44, 16); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(x - 10, b - 72, 4, 30);
      break;
    case 'knock':
      if (e.n === 1 && F.knocked[1]) drawPerson(x - 0.1 * TS, b - 0.45 * TS, { shirt: '#5a2a7a', pants: '#2a2a3a', hair: '#cccccc', bun: true, witchHat: '#2a1f3a', glasses: true, s: 0.92 });
      if (e.n === 2 && F.knocked[2]) drawPerson(x - 0.1 * TS, b - 0.45 * TS, { shirt: '#f2f2f2', pants: '#2a2a3a', hair: '#4a3020', bandana: '#c0302a', patch: true, mustache: true, s: 0.95 });
      break;
    case 'bowl3':
      ctx.fillStyle = '#8a6a5a'; ctx.fillRect(x - 18, b - 44, 36, 5);
      if (!F.bowl3) { ctx.fillStyle = '#e8e0f0'; ctx.beginPath(); ctx.ellipse(x, b - 48, 13, 6, 0, 0, Math.PI); ctx.fill(); for (const [cx2, col] of [[-6, '#ff6fae'], [0, '#ffe066'], [6, '#7fe0a0']]) { ctx.fillStyle = col; ctx.beginPath(); circ(x + cx2, b - 50, 3.5); ctx.fill(); } glint(x + 12, b - 58); }
      break;
    case 'note3': if (nehir && !F.note3) { ctx.fillStyle = '#fffaf0'; ctx.save(); ctx.translate(x, b - 8); ctx.rotate(0.3); ctx.fillRect(-7, -5, 14, 10); ctx.restore(); glint(x + 8, b - 16); } break;
    case 'trainGate': if (!F.arrived) signBoard(x - 1.3 * TS, b + 4, ['🎟️ BİLETLİ', 'GİRİŞ'], '#e8c0c8'); break;
    case 'kond': if (e.id === 'kond2' ? F.skyDone && !F.homeBack : !F.arrived) drawSkeleton(x, b, { cap: true }); break;
    case 'duru': drawDuru(x, b); break;
    case 'pitir': if (!F.lanterns.pitir && !gone('pitir')) drawCat(x, b, F.bells && F.notes); break;
    case 'bells': if (!F.bells) { for (let i = 0; i < 3; i++) { const bx = x - 14 + i * 14, by = b - 70 + (i % 2) * 8 + Math.sin(S.time * 3 + i) * 2; ctx.strokeStyle = '#d8c8a0'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx, by - 14); ctx.lineTo(bx, by - 6); ctx.stroke(); ctx.fillStyle = '#e0b84a'; ctx.beginPath(); ctx.moveTo(bx - 6, by + 4); ctx.quadraticCurveTo(bx - 6, by - 7, bx, by - 7); ctx.quadraticCurveTo(bx + 6, by - 7, bx + 6, by + 4); ctx.closePath(); ctx.fill(); } glint(x + 18, b - 80); } break;
    case 'notes': if (!F.notes) { ctx.fillStyle = '#fffaf0'; ctx.save(); ctx.translate(x, b - 10); ctx.rotate(-0.25); ctx.fillRect(-9, -6, 18, 12); ctx.fillStyle = '#3a2a1b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('♪♫', 0, 3); ctx.restore(); glint(x + 10, b - 18); } break;
    case 'moonDrop': if (!F.moonDrop) { ctx.fillStyle = 'rgba(200,220,255,.5)'; ctx.beginPath(); circ(x, b - 66, 9); ctx.fill(); ctx.fillStyle = '#e8e4ff'; rr(ctx, x - 6, b - 72, 12, 14, 4); ctx.fill(); ctx.fillStyle = '#8a6a3a'; ctx.fillRect(x - 3, b - 77, 6, 5); ctx.fillStyle = '#fff6d0'; ctx.beginPath(); ctx.arc(x, b - 65, 4, 0.6, 5.4); ctx.fill(); glint(x + 9, b - 78); } break;
    case 'stationSign': signBoard(x, b, ['CANAVAR', 'KASABASI'], '#d7c4ff'); break;
    case 'info': signBoard(x, b, e.id === 'junkInfo' ? ['HURDALIK', '⚠ BALÇIK'] : ['MEZARLIK', '⚠ YARASA'], '#ffd84d'); break;
    case 'drakos': if (F.arrived && !F.skyDone) { const pp = entPos(e); drawDrakos(x, b, pp.walk); } break;
    case 'bora': if (F.arrived) drawBora(x, b); break;
    case 'bigLantern':
      if (F.arrived && !F.towerLit) { ctx.fillStyle = '#4a4458'; ctx.fillRect(x - 46, b - 6, 92, 8); ctx.fillStyle = '#5a5468'; ctx.fillRect(x - 40, b - 12, 80, 7); if (F.lanternCount >= N_L) glint(x, b - 30); }
      break;
    case 'heli':
      if (F.towerLit && !F.skyDone) { const k = S.heliIn === null || S.heliIn === undefined ? 1 : S.heliIn; drawHelicopter(x, b - (1 - k) * 320, S.time * (k < 1 ? 30 : 8)); }
      break;
    // Mumya Evi
    case 'jar': {
      const taken = F.bandage && e.n === F.jarRight, tried = F.jarsTried[e.n];
      ctx.fillStyle = 'rgba(200,225,235,.55)'; rr(ctx, x - 13, b - 74, 26, 32, 6); ctx.fill(); ctx.strokeStyle = '#8aa0b0'; ctx.lineWidth = 1.5; ctx.stroke();
      if (!tried && !taken) { ctx.fillStyle = '#8a6a3a'; ctx.fillRect(x - 14, b - 78, 28, 6); }
      if (F.jarPinged[e.n] && e.n === F.jarRight && !taken) { ctx.fillStyle = '#efe6d0'; ctx.beginPath(); circ(x, b - 56, 8); ctx.fill(); ctx.fillStyle = 'rgba(215,196,255,.6)'; ctx.beginPath(); circ(x, b - 58, 16 + Math.sin(S.time * 4) * 2); ctx.fill(); }
      if (F.jarPinged[e.n] && e.n !== F.jarRight) { ctx.fillStyle = '#3a2a1b'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('✗', x, b - 52); }
      ctx.fillStyle = '#fff3d6'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(String(e.n + 1), x, b - 82);
      break;
    }
    case 'mimi': if (!F.lanterns.mimi && !gone('mimi')) drawMummy(x, b, F.bandage && S.spin ? S.spin.k > 0.5 : false, S.spin ? S.spin.k : 0); break;
    // Karanlık Sokak
    case 'lamp': {
      const lit = F.lamps[e.n];
      if (!lit && !bade) break;
      ctx.fillStyle = '#2a2a34'; ctx.fillRect(x - 3, b - 84, 6, 84); ctx.fillRect(x - 8, b - 4, 16, 4);
      ctx.fillStyle = lit ? '#ffcf6a' : '#4a4a5a'; ctx.beginPath(); ctx.moveTo(x - 11, b - 84); ctx.lineTo(x + 11, b - 84); ctx.lineTo(x + 7, b - 102); ctx.lineTo(x - 7, b - 102); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#2a2a34'; ctx.fillRect(x - 12, b - 86, 24, 4); ctx.beginPath(); ctx.moveTo(x - 9, b - 102); ctx.lineTo(x, b - 110); ctx.lineTo(x + 9, b - 102); ctx.fill();
      if (!lit) { ctx.fillStyle = 'rgba(215,196,255,.8)'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('?', x, b - 90); }
      break;
    }
    case 'kurtul': if (!F.lanterns.kurtul && !gone('kurtul') && (bade || streetLit())) drawWerewolf(x, b, !streetLit()); break;
    // Hurdalık
    case 'frenk': if (!F.lanterns.frenk && !gone('frenk')) drawFrank(x, b, S.frenkFixed); break;
    case 'heavy': {
      const mv = F.moved[e.id], hx = mv ? ox_(e.to[0]) : x + (e.dx || 0) * TS, hb = mv ? oy_(e.to[1]) : b + (e.dy || 0) * TS;
      if (e.id === 'junk') drawRedCarHeap(hx, hb);
      else { shadow(hx, hb, 26); ctx.fillStyle = '#7a7a82'; ctx.beginPath(); ctx.ellipse(hx, hb - 22, 24, 22, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#9a9aa2'; ctx.beginPath(); ctx.ellipse(hx - 7, hb - 30, 9, 7, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#5a5a62'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx + 4, hb - 40); ctx.lineTo(hx + 10, hb - 28); ctx.lineTo(hx + 6, hb - 18); ctx.stroke(); ctx.fillStyle = '#3a5a3a'; ctx.beginPath(); circ(hx - 14, hb - 6, 5); ctx.fill(); }
      break;
    }
    case 'bolt': if (F.moved.junk && !F.bolt && nehir) { ctx.fillStyle = '#c8c8d0'; ctx.fillRect(x - 3, b - 14, 6, 12); ctx.fillRect(x - 7, b - 16, 14, 4); glint(x + 8, b - 18); } break;
    // Cadı Kulübesi
    case 'recipe':
      ctx.fillStyle = '#5a3a22'; ctx.fillRect(x - 3, b - 30, 6, 30); ctx.fillRect(x - 16, b - 4, 32, 4);
      ctx.fillStyle = '#8a2a4a'; ctx.beginPath(); ctx.moveTo(x - 24, b - 30); ctx.lineTo(x + 24, b - 30); ctx.lineTo(x + 20, b - 44); ctx.lineTo(x - 20, b - 44); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff3d6'; ctx.fillRect(x - 18, b - 42, 17, 10); ctx.fillRect(x + 1, b - 42, 17, 10); ctx.fillStyle = '#3a2a1b'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🐸🦇', x - 9, b - 34); ctx.fillText('🌙', x + 9, b - 34);
      break;
    case 'cauldron': {
      ctx.fillStyle = `rgba(255,${120 + Math.sin(S.time * 8) * 40},40,.9)`; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 18 + i * 12, b - 2); ctx.lineTo(x - 12 + i * 12, b - 16 - Math.sin(S.time * 9 + i) * 4); ctx.lineTo(x - 6 + i * 12, b - 2); ctx.fill(); }
      ctx.fillStyle = '#1a1a20'; ctx.beginPath(); ctx.ellipse(x, b - 26, 34, 24, 0, 0, Math.PI); ctx.fill(); ctx.fillRect(x - 34, b - 32, 68, 8);
      ctx.fillStyle = S.flags.potion ? '#b28dff' : '#5fd068'; ctx.beginPath(); ctx.ellipse(x, b - 32, 30, 8, 0, 0, 7); ctx.fill();
      for (let i = 0; i < 4; i++) { const t2 = (S.time * 0.9 + i / 4) % 1; ctx.fillStyle = `rgba(200,255,200,${0.7 - t2 * 0.7})`; ctx.beginPath(); circ(x - 18 + i * 12, b - 34 - t2 * 30, 3 + t2 * 4); ctx.fill(); }
      if (S.smoke) { ctx.fillStyle = `rgba(255,150,200,${0.7 - S.smoke.t * 0.45})`; ctx.beginPath(); circ(x, b - 50 - S.smoke.t * 40, 20 + S.smoke.t * 30); ctx.fill(); }
      break;
    }
    case 'cemile': if (!F.lanterns.cemile && !gone('cemile')) { drawWitch(x, b, S.cemileFly > 0); if (!S.cemileFly) { ctx.strokeStyle = '#7a5a36'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x + 22, b - 2); ctx.lineTo(x + 30, b - 50); ctx.stroke(); ctx.fillStyle = '#9a8a5a'; ctx.beginPath(); ctx.moveTo(x + 18, b - 2); ctx.lineTo(x + 26, b - 2); ctx.lineTo(x + 24, b - 14); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#3a2a1b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 24, b - 30); ctx.lineTo(x + 34, b - 36); ctx.stroke(); } } break;
    // Balkabağı Tarlası
    case 'scarecrow':
      ctx.fillStyle = '#5a3a22'; ctx.fillRect(x - 3, b - 60, 6, 60); ctx.fillRect(x - 26, b - 50, 52, 5);
      ctx.fillStyle = '#7a5a9a'; rr(ctx, x - 12, b - 52, 24, 28, 4); ctx.fill(); ctx.fillStyle = '#e8c040'; for (const sx of [-26, 22]) { ctx.beginPath(); ctx.moveTo(x + sx, b - 50); ctx.lineTo(x + sx + 4, b - 40); ctx.lineTo(x + sx + 2, b - 50); ctx.fill(); }
      drawJack(x, b - 52, 0.9, false, true); ctx.fillStyle = '#3a2a1b'; ctx.beginPath(); ctx.ellipse(x, b - 74, 18, 4, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 9, b - 74); ctx.lineTo(x - 2, b - 94); ctx.lineTo(x + 9, b - 74); ctx.fill();
      break;
    case 'straw': if (nehir && !F.straw) { ctx.strokeStyle = '#ffd84d'; ctx.lineWidth = 2; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x + i * 2, b - 2); ctx.lineTo(x + i * 4, b - 16); ctx.stroke(); } ctx.fillStyle = '#c0302a'; ctx.fillRect(x - 6, b - 8, 12, 3); glint(x + 10, b - 18); } break;
    // Mezarlık
    case 'selo': if (!F.lanterns.selo && !gone('selo') && (bade || S.leaving)) drawGhostDog(x, b, F.bone); break;
    case 'prints': if (nehir && !F.bone) { ctx.fillStyle = 'rgba(215,196,255,.7)'; for (let i = 0; i < 4; i++) { const px = x + 16 - i * 22, py = b - 6 + (i % 2) * 7; ctx.beginPath(); ctx.ellipse(px, py, 3.5, 3, 0, 0, 7); ctx.fill(); for (const [dx2, dy2] of [[-3, -4], [0, -5.5], [3, -4]]) { ctx.beginPath(); circ(px + dx2, py + dy2, 1.4); ctx.fill(); } } if (!F.printsSeen) glint(x, b - 16); } break;
    case 'kemik': {
      ctx.fillStyle = '#c0302a'; ctx.beginPath(); ctx.moveTo(x - 22, b - 2); ctx.lineTo(x - 14, b - 30); ctx.lineTo(x + 18, b - 26); ctx.lineTo(x + 22, b - 2); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; for (let i = 0; i < 3; i++) ctx.fillRect(x - 18 + i * 13, b - 24 + i, 6, 22);
      ctx.save(); ctx.translate(x, b - 4); ctx.rotate(-0.25); drawSkeleton(0, 0, { coat: false, s: 0.85 }); ctx.restore();
      if (Math.floor(S.time * 1.2) % 2 === 0) { ctx.fillStyle = '#e8e0f0'; ctx.font = 'bold 15px Georgia'; ctx.textAlign = 'center'; ctx.fillText('z', x + 18, b - 66 - (S.time * 10) % 10); ctx.font = 'bold 11px Georgia'; ctx.fillText('z', x + 26, b - 78 - (S.time * 10) % 10); }
      break;
    }
    case 'dig': if (nehir && !F.bone) { ctx.fillStyle = '#4a3020'; ctx.beginPath(); ctx.ellipse(x, b - 4, 14, 6, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#6a4a30'; ctx.beginPath(); ctx.ellipse(x - 3, b - 6, 7, 3, 0, 0, 7); ctx.fill(); glint(x + 8, b - 12); } break;
    // Mahzen
    case 'hulya': if (!F.lanterns.hulya && !gone('hulya')) drawGhost(x, b, { bow: true, sad: !F.musicBox }); break;
    case 'musicBox':
      if (!F.musicBox) { const bx = x, by = b - 40; ctx.strokeStyle = '#d8c8a0'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(bx, b - 58); ctx.lineTo(bx, by - 8); ctx.stroke(); ctx.fillStyle = '#8a2a4a'; rr(ctx, bx - 12, by - 10, 24, 18, 3); ctx.fill(); ctx.fillStyle = '#e0b84a'; ctx.fillRect(bx - 12, by - 10, 24, 4); ctx.fillStyle = '#fff3c4'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('♪', bx + 16 + Math.sin(S.time * 3) * 3, by - 12 - (S.time * 8) % 10); glint(bx + 12, by - 12); }
      break;
    default: break;
  }
}
/* --- room furniture and outdoor decor (y-sorted) --- */
function roundTableSmall(x, b) { ctx.fillStyle = '#4a3020'; ctx.fillRect(x - 2, b - 22, 4, 22); ctx.fillRect(x - 10, b - 3, 20, 3); ctx.fillStyle = '#6a2a8a'; ctx.beginPath(); ctx.ellipse(x, b - 24, 16, 6, 0, 0, 7); ctx.fill(); }
function plant(x, b) { ctx.fillStyle = '#5a3a2a'; ctx.beginPath(); ctx.moveTo(x - 10, b - 18); ctx.lineTo(x + 10, b - 18); ctx.lineTo(x + 7, b); ctx.lineTo(x - 7, b); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#3a6a3a'; ctx.beginPath(); circ(x, b - 30, 11); circ(x - 9, b - 24, 8); circ(x + 9, b - 24, 8); ctx.fill(); }
function candle(x, b, h) { ctx.fillStyle = '#5a4a3a'; ctx.fillRect(x - 3, b - h, 6, h); ctx.fillRect(x - 10, b - 3, 20, 3); ctx.fillStyle = '#f4ead0'; ctx.fillRect(x - 3, b - h - 12, 6, 12); ctx.fillStyle = `rgba(255,${200 + Math.sin(S.time * 11 + x) * 40},80,1)`; ctx.beginPath(); ctx.ellipse(x, b - h - 16, 3, 5, 0, 0, 7); ctx.fill(); }
function lampPost(x, b) { ctx.fillStyle = '#2a2a34'; ctx.fillRect(x - 3, b - 78, 6, 78); ctx.fillRect(x - 9, b - 4, 18, 4); ctx.fillStyle = '#ffcf6a'; ctx.beginPath(); circ(x, b - 84, 8); ctx.fill(); ctx.fillStyle = '#2a2a34'; ctx.fillRect(x - 9, b - 94, 18, 4); }
function addFurniture(L, ox, oy, c0, c1, r0, r1) {
  const vis = (x, y) => x > c0 - 3 && x < c1 + 3 && y > r0 - 3 && y < r1 + 5;
  const add = (tx, ty, fn) => { if (vis(tx, ty)) L.push([ty, () => fn(ox + tx * TS, oy + ty * TS)]); };
  const F = S.flags;
  // home: kitchen, sofa, a pumpkin
  for (let c = 77; c <= 79; c++) add(c, 3.98, (x, b) => { ctx.fillStyle = '#f4f4ee'; ctx.fillRect(x, b - 40, TS, 40); ctx.fillStyle = '#a06a3a'; ctx.fillRect(x, b - 44, TS, 6); if (c === 77) { ctx.fillStyle = '#3a3a3a'; for (const k of [12, 34]) { ctx.beginPath(); circ(x + k, b - 47, 6); ctx.fill(); } } if (c === 79) drawJack(x + 24, b - 42, 0.7, true); });
  add(83.9, 6.98, (x, b) => { ctx.fillStyle = '#7a3a5a'; rr(ctx, x - TS, b - 40, TS * 2, 34, 8); ctx.fill(); ctx.fillStyle = '#9a5a7a'; rr(ctx, x - TS + 6, b - 30, TS * 2 - 12, 18, 5); ctx.fill(); ctx.fillStyle = '#ffb347'; ctx.beginPath(); circ(x - 26, b - 32, 7); ctx.fill(); });
  add(85.4, 7.9, (x, b) => plant(x, b)); add(77.4, 7.9, (x, b) => drawJack(x, b, 0.9, true));
  // mummy house: jar shelf, sarcophagus, torches
  for (let c = 77; c <= 85; c++) add(c, 12.98, (x, b) => { ctx.fillStyle = '#8a6a3a'; ctx.fillRect(x, b - 40, TS, 6); ctx.fillStyle = '#6a4a2a'; ctx.fillRect(x + 4, b - 34, 6, 34); ctx.fillRect(x + TS - 10, b - 34, 6, 34); });
  add(77.5, 16.98, (x, b) => { ctx.fillStyle = '#c9a050'; rr(ctx, x - 20, b - 92, 40, 90, 16); ctx.fill(); ctx.fillStyle = '#3a6aa0'; rr(ctx, x - 14, b - 84, 28, 26, 10); ctx.fill(); ctx.fillStyle = '#d9c08a'; ctx.beginPath(); circ(x, b - 72, 9); ctx.fill(); ctx.fillStyle = '#2a2018'; ctx.fillRect(x - 6, b - 74, 4, 2); ctx.fillRect(x + 2, b - 74, 4, 2); ctx.strokeStyle = '#8a6a30'; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 14, b - 50 + i * 10); ctx.lineTo(x + 14, b - 50 + i * 10); ctx.stroke(); } });
  for (const tx of [79.6, 86.0]) add(tx, 16.9, (x, b) => candle(x, b, 30));
  // witch hut: potion shelf, broom rack, herbs
  for (let c = 83; c <= 86; c++) add(c, 21.98, (x, b) => { ctx.fillStyle = '#4a3020'; ctx.fillRect(x, b - 60, TS, 60); ctx.fillStyle = '#2a1a10'; ctx.fillRect(x + 2, b - 40, TS - 4, 3); ctx.fillRect(x + 2, b - 20, TS - 4, 3); for (let i = 0; i < 3; i++) { ctx.fillStyle = ['#b28dff', '#7fe0a0', '#ff8fc4', '#ffe066'][(c + i) % 4]; rr(ctx, x + 5 + i * 14, b - 56 + (i % 2) * 4, 9, 14, 3); ctx.fill(); ctx.fillStyle = ['#7fe0a0', '#ffb347', '#9fd6ff'][(c + i) % 3]; ctx.beginPath(); circ(x + 9 + i * 14, b - 28, 5); ctx.fill(); } });

  add(86.3, 25.9, (x, b) => drawJack(x, b, 0.9, true));
  // crypt: candle stands, an old chest, cobwebs
  for (const tx of [91.5, 101.5]) add(tx, 3.98, (x, b) => candle(x, b, 44));
  add(92, 7.98, (x, b) => { ctx.fillStyle = '#5a3a22'; rr(ctx, x - TS + 4, b - 34, TS * 2 - 8, 32, 5); ctx.fill(); ctx.fillStyle = '#e0b84a'; ctx.fillRect(x - TS + 4, b - 22, TS * 2 - 8, 4); ctx.beginPath(); circ(x, b - 18, 4); ctx.fill(); });
  // --- more decoration for the monster houses
  // Mumya Evi: scrolls, a palm, a golden cat statue, canopic jars
  add(77.7, 13.8, (x, b) => { for (let i = 0; i < 3; i++) { ctx.fillStyle = '#efe0b8'; rr(ctx, x - 14 + i * 4, b - 10 - i * 6, 26, 7, 3); ctx.fill(); ctx.fillStyle = '#c0302a'; ctx.fillRect(x - 2 + i * 4, b - 10 - i * 6, 2, 7); } });
  add(85.4, 13.8, (x, b) => { ctx.fillStyle = '#8a6a3a'; ctx.beginPath(); ctx.moveTo(x - 9, b - 16); ctx.lineTo(x + 9, b - 16); ctx.lineTo(x + 6, b); ctx.lineTo(x - 6, b); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, b - 16); ctx.lineTo(x + 2, b - 52); ctx.stroke(); ctx.fillStyle = '#3a7a3a'; for (let i = 0; i < 6; i++) { ctx.save(); ctx.translate(x + 2, b - 52); ctx.rotate(i * 1.05); ctx.beginPath(); ctx.ellipse(13, 0, 14, 4, 0, 0, 7); ctx.fill(); ctx.restore(); } });
  add(83.2, 16.8, (x, b) => { ctx.fillStyle = '#8a6a3a'; ctx.fillRect(x - 12, b - 8, 24, 8); ctx.fillStyle = '#e0b84a'; ctx.beginPath(); ctx.ellipse(x, b - 18, 8, 11, 0, 0, 7); ctx.fill(); ctx.beginPath(); circ(x, b - 32, 6); ctx.fill(); for (const sg of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + sg * 2, b - 36); ctx.lineTo(x + sg * 6, b - 44); ctx.lineTo(x + sg * 7, b - 33); ctx.fill(); } ctx.fillStyle = '#3a6aa0'; ctx.fillRect(x - 5, b - 26, 10, 3); ctx.fillStyle = '#2a2018'; ctx.fillRect(x - 3.5, b - 33, 2, 1.5); ctx.fillRect(x + 1.5, b - 33, 2, 1.5); });
  add(85.5, 16.8, (x, b) => { for (const [dx, col, top] of [[-10, '#c9a070', '#3a6aa0'], [0, '#d8b080', '#e0b84a'], [10, '#c09060', '#3a8a6a']]) { ctx.fillStyle = col; rr(ctx, x + dx - 4, b - 18, 8, 16, 3); ctx.fill(); ctx.fillStyle = top; ctx.beginPath(); circ(x + dx, b - 20, 3.5); ctx.fill(); } });
  // Cadı Kulübesi: crystal ball, spellbooks, a kitten asleep in a basket
  add(77.7, 23.6, (x, b) => { roundTableSmall(x, b); ctx.fillStyle = 'rgba(178,141,255,.85)'; ctx.beginPath(); circ(x, b - 34, 9); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); circ(x - 3, b - 37, 2.5); ctx.fill(); ctx.fillStyle = `rgba(215,196,255,${0.25 + 0.15 * Math.sin(S.time * 3)})`; ctx.beginPath(); circ(x, b - 34, 16); ctx.fill(); });
  add(79.4, 25.7, (x, b) => { for (let i = 0; i < 4; i++) { ctx.fillStyle = ['#5a2a7a', '#2a5a4a', '#8a2a3a', '#3a3a6a'][i]; ctx.fillRect(x - 12 + (i % 2) * 3, b - 6 - i * 6, 24, 6); ctx.fillStyle = '#e0b84a'; ctx.fillRect(x - 10 + (i % 2) * 3, b - 4 - i * 6, 3, 2); } });
  add(77.6, 25.6, (x, b) => { ctx.fillStyle = '#a07a4a'; ctx.beginPath(); ctx.ellipse(x, b - 6, 15, 7, 0, 0, Math.PI); ctx.fill(); ctx.fillRect(x - 15, b - 8, 30, 3); ctx.fillStyle = '#18141e'; ctx.beginPath(); ctx.ellipse(x, b - 10, 10, 5, 0, 0, 7); ctx.fill(); ctx.beginPath(); circ(x + 8, b - 12, 4.5); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + 5, b - 15); ctx.lineTo(x + 7, b - 19); ctx.lineTo(x + 9, b - 15); ctx.moveTo(x + 9, b - 15); ctx.lineTo(x + 12, b - 19); ctx.lineTo(x + 12, b - 13); ctx.fill(); if (Math.floor(S.time * 1.2) % 2 === 0) { ctx.fillStyle = '#d7c4ff'; ctx.font = 'bold 10px Georgia'; ctx.textAlign = 'center'; ctx.fillText('z', x + 16, b - 22); } });
  // Mahzen: an old organ, a dusty armchair, barrels, a pile of bones
  add(96.5, 3.95, (x, b) => { ctx.fillStyle = '#3a2418'; rr(ctx, x - 40, b - 60, 80, 58, 4); ctx.fill(); ctx.fillStyle = '#5a3a26'; for (let i = 0; i < 7; i++) ctx.fillRect(x - 34 + i * 10, b - 76 + Math.abs(3 - i) * 4, 6, 20 - Math.abs(3 - i) * 4); ctx.fillStyle = '#f4f0e8'; ctx.fillRect(x - 34, b - 28, 68, 9); ctx.fillStyle = '#1a1a1e'; for (let i = 0; i < 9; i++) ctx.fillRect(x - 31 + i * 7.5, b - 28, 3, 5); });
  add(100.2, 7.6, (x, b) => { ctx.fillStyle = '#6a2a3a'; rr(ctx, x - 16, b - 34, 32, 32, 8); ctx.fill(); ctx.fillStyle = '#8a3a4a'; rr(ctx, x - 12, b - 18, 24, 12, 4); ctx.fill(); ctx.fillStyle = '#4a1a2a'; ctx.fillRect(x - 18, b - 22, 6, 18); ctx.fillRect(x + 12, b - 22, 6, 18); cobweb(x - 16, b - 34, 14); });
  add(100.6, 8.6, (x, b) => { for (const [dx, dy] of [[-14, 0], [6, 0], [-4, -22]]) { ctx.fillStyle = '#7a5232'; rr(ctx, x + dx - 9, b - 22 + dy, 18, 22, 4); ctx.fill(); ctx.fillStyle = '#4a4a50'; ctx.fillRect(x + dx - 9, b - 17 + dy, 18, 2); ctx.fillRect(x + dx - 9, b - 7 + dy, 18, 2); } });
  add(94.2, 8.4, (x, b) => { ctx.strokeStyle = '#efe8d8'; ctx.lineWidth = 3; ctx.lineCap = 'round'; for (const [a, l] of [[0.3, 14], [-0.5, 12], [1.2, 10]]) { ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * l, b - 4 - Math.sin(a) * l * 0.4); ctx.lineTo(x + Math.cos(a) * l, b - 4 + Math.sin(a) * l * 0.4); ctx.stroke(); } ctx.lineCap = 'butt'; ctx.fillStyle = '#efe8d8'; ctx.beginPath(); circ(x + 12, b - 8, 6); ctx.fill(); ctx.fillStyle = '#1a1420'; ctx.beginPath(); circ(x + 10, b - 9, 1.4); circ(x + 14, b - 9, 1.4); ctx.fill(); });
  // outdoor decor: pumpkins, square lamps, street lamps
  for (const [tx, ty] of DECOR_PUMPKINS) add(tx, ty, (x, b) => drawJack(x, b, 0.75, true));
  for (const [tx, ty] of SQUARE_LAMPS) add(tx, ty, (x, b) => lampPost(x, b));
  for (const [tx, ty] of STREET_LAMPS) add(tx, ty, (x, b) => lampPost(x, b));
  void F;
}
function drawRoomDecor(ox, oy) {
  const F = S.flags;
  // helipad letter
  { const x = ox + 37 * TS, y = oy + 40 * TS; ctx.strokeStyle = '#e8c040'; ctx.lineWidth = 6; ctx.beginPath(); circ(x, y, 2.2 * TS); ctx.stroke(); ctx.fillStyle = '#e8e0d0'; ctx.font = 'bold 90px "Trebuchet MS",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('H', x, y); ctx.textBaseline = 'alphabetic'; }
  // carpets and cobwebs inside
  { const x = ox + 81 * TS, y = oy + 5.6 * TS; ctx.fillStyle = 'rgba(122,58,90,.35)'; ctx.beginPath(); ctx.ellipse(x, y, TS * 2.6, TS * 1.1, 0, 0, 7); ctx.fill(); }
  { const x = ox + 81.5 * TS, y = oy + 24.4 * TS; ctx.strokeStyle = 'rgba(178,141,255,.35)'; ctx.lineWidth = 3; ctx.beginPath(); circ(x, y - 18, TS * 1.6); ctx.stroke(); star(ctx, x, y - 18, 22, 9, 5); }
  cobweb(ox + 91 * TS, oy + 3 * TS, 40); cobweb(ox + 77 * TS, oy + 12 * TS, 34); cobweb(ox + 77 * TS, oy + 21 * TS, 30);
  // Mumya Evi: a woven rug and a hieroglyph frieze on the wall
  { const x = ox + 79.2 * TS, y = oy + 14.1 * TS, w = TS * 4.6, h = TS * 1.8; ctx.fillStyle = 'rgba(176,120,60,.45)'; rr(ctx, x, y, w, h, 6); ctx.fill(); ctx.strokeStyle = 'rgba(58,106,160,.55)'; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 12; i++) { const px = x + 8 + i * (w - 16) / 12; ctx.lineTo(px, y + 10 + (i % 2) * 8); } ctx.stroke(); ctx.beginPath(); for (let i = 0; i <= 12; i++) { const px = x + 8 + i * (w - 16) / 12; ctx.lineTo(px, y + h - 10 - (i % 2) * 8); } ctx.stroke(); }
  { ctx.font = '15px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(90,60,20,.7)'; ['𓂀', '𓃭', '𓆣', '𓅓', '𓋹', '𓁹', '𓆏', '𓂀'].forEach((g, i) => ctx.fillText(g, ox + (77.3 + i * 1.1) * TS, oy + 11.62 * TS)); }
  // Cadı Kulübesi: strings of herbs and garlic hanging along the wall
  for (let i = 0; i < 5; i++) { const x = ox + (77.2 + i * 1.15) * TS, y = oy + 20.2 * TS; ctx.strokeStyle = '#6a5a3a'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 26); ctx.stroke(); ctx.fillStyle = i % 2 ? '#f0ead8' : '#5a8a4a'; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(x, y + 12 + k * 7, i % 2 ? 4 : 5, 3.4, 0, 0, 7); ctx.fill(); } }
  // Mahzen: a dusty rug and old portraits of ghost ancestors
  { const x = ox + 94 * TS, y = oy + 5.4 * TS; ctx.fillStyle = 'rgba(106,42,58,.4)'; rr(ctx, x, y, TS * 4, TS * 1.8, 8); ctx.fill(); ctx.strokeStyle = 'rgba(224,184,74,.35)'; ctx.lineWidth = 2; rr(ctx, x + 6, y + 6, TS * 4 - 12, TS * 1.8 - 12, 6); ctx.stroke(); }
  for (const px of [92.6, 100.4]) { const x = ox + px * TS, y = oy + 2.18 * TS; ctx.fillStyle = '#c9a050'; ctx.fillRect(x - 14, y, 28, 30); ctx.fillStyle = '#3a3448'; ctx.fillRect(x - 11, y + 3, 22, 24); ctx.globalAlpha = 0.85; ctx.fillStyle = '#f4f2ff'; ctx.beginPath(); ctx.arc(x, y + 16, 7, Math.PI, 0); ctx.lineTo(x + 7, y + 25); ctx.lineTo(x - 7, y + 25); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#2a2040'; ctx.beginPath(); circ(x - 2.5, y + 15, 1.3); circ(x + 2.5, y + 15, 1.3); ctx.fill(); ctx.globalAlpha = 1; }
  // the crypt's ceiling beam
  { const x1 = ox + 91.6 * TS, x2 = ox + 101.4 * TS, y = oy + 4.6 * TS - 66; ctx.fillStyle = '#4a3020'; ctx.fillRect(x1, y, x2 - x1, 14); ctx.fillStyle = '#3a2418'; ctx.fillRect(x1, y + 12, x2 - x1, 4); }
  // the candy thrown to the slimes
  if (S.candyAt && S.slimeBusy > 0) { const x = ox + S.candyAt.x * TS, y = oy + S.candyAt.y * TS; ctx.fillStyle = '#ff6fae'; ctx.beginPath(); ctx.ellipse(x, y, 7, 4, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(x - 7, y); ctx.lineTo(x - 12, y - 4); ctx.lineTo(x - 12, y + 4); ctx.closePath(); ctx.moveTo(x + 7, y); ctx.lineTo(x + 12, y - 4); ctx.lineTo(x + 12, y + 4); ctx.closePath(); ctx.fill(); }
  // festival bunting over the square
  if (F.skyDone) {
    for (const [a, b] of [[SQUARE_LAMPS[0], SQUARE_LAMPS[1]], [SQUARE_LAMPS[2], SQUARE_LAMPS[3]]]) {
      const x1 = ox + a[0] * TS, y1 = oy + a[1] * TS - 90, x2 = ox + b[0] * TS, y2 = oy + b[1] * TS - 90, n = 16;
      ctx.strokeStyle = '#3a2a1b'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 + 30, x2, y2); ctx.stroke();
      for (let i = 1; i < n; i++) { const k = i / n, px = x1 + (x2 - x1) * k, py = y1 + (y2 - y1) * k + Math.sin(k * Math.PI) * 15; ctx.fillStyle = ['#ffb347', '#b28dff', '#7fe0a0', '#ff6fae'][i % 4]; ctx.beginPath(); ctx.moveTo(px - 6, py); ctx.lineTo(px + 6, py); ctx.lineTo(px, py + 12); ctx.closePath(); ctx.fill(); }
    }
  }
}
/* --- darkness, lights and the moon --- */
let nightC = null, nightG = null;
function lightAt(g, x, y, r, k = 1) { const gr = g.createRadialGradient(x, y, r * 0.15, x, y, r); gr.addColorStop(0, `rgba(0,0,0,${k})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
function drawNight(ox, oy) {
  if (!nightC || nightC.width !== VW * DPR) { nightC = document.createElement('canvas'); nightC.width = VW * DPR; nightC.height = VH * DPR; nightG = nightC.getContext('2d'); }
  const g = nightG, F = S.flags, c = P(), inside = S.cam.x / TS >= 72;
  g.setTransform(DPR, 0, 0, DPR, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, VW, VH);
  let base = inside ? 0.14 : F.skyDone ? 0.1 : c.y < 12.5 ? 0.3 : 0.4;
  if (areaAt(c.x, c.y) === 'Mahzen') base = 0.32;
  g.fillStyle = `rgba(10,8,34,${base})`; g.fillRect(0, 0, VW, VH);
  if (!inside && !streetLit()) {
    const x1 = ox + 45.6 * TS, y1 = oy + 14.6 * TS, w = 24.6 * TS, h = 7.6 * TS;
    if (c.who === 'Bade') { g.fillStyle = 'rgba(40,10,60,.28)'; g.fillRect(x1, y1, w, h); }
    else { g.fillStyle = 'rgba(4,2,12,.62)'; g.fillRect(x1, y1, w, h); }
  }
  g.globalCompositeOperation = 'destination-out';
  const L = (tx, ty, r, k) => lightAt(g, ox + tx * TS, oy + ty * TS, r * TS, k);
  const dark = inDarkStreet(c.x, c.y) && !streetLit() && c.who === 'Nehir';
  L(c.x, c.y - 0.7, dark ? 1.3 : 2.8, dark ? 0.6 : 0.9);
  const o = other(); L(o.x, o.y - 0.7, 1.6, 0.6);
  if (!inside) {
    for (const [tx, ty] of DECOR_PUMPKINS) L(tx, ty - 0.3, 1.5, 0.75);
    for (const [tx, ty] of SQUARE_LAMPS.concat(STREET_LAMPS)) L(tx, ty - 1.6, 3, 0.85);
    for (const e of ENTS) if (e.type === 'lamp' && F.lamps[e.n]) L(e.x, e.y - 1.8, 3.6, 0.95);
    if (F.arrived) L(29.6, 26.6, 2.2, 0.8);
    if (F.towerLit) L(39.5, 19.5, 5, 0.9);
    if (S.flags.skyDone) L(35.5, 30, 8, 0.6);
  } else {
    for (const [tx, ty] of [[79.6, 15.6], [86, 15.6], [91.5, 2.6], [101.5, 2.6]]) L(tx, ty, 2.6, 0.8);
  }
  g.globalCompositeOperation = 'source-over';
  ctx.drawImage(nightC, 0, 0, VW, VH);
}
function drawMoonCorner() {
  const F = S.flags; if (S.cam.x / TS >= 72) return;
  const x = HOLE.cx + HOLE.rx - 70, y = HOLE.cy - HOLE.ry + 62;
  ctx.save();
  if (F.skyDone) {
    const gr = ctx.createRadialGradient(x, y, 10, x, y, 80); gr.addColorStop(0, 'rgba(255,250,220,.55)'); gr.addColorStop(1, 'rgba(255,250,220,0)'); ctx.fillStyle = gr; ctx.beginPath(); circ(x, y, 80); ctx.fill();
    ctx.fillStyle = '#fff6d0'; ctx.beginPath(); circ(x, y, 30); ctx.fill(); ctx.fillStyle = 'rgba(200,190,150,.4)'; ctx.beginPath(); circ(x - 8, y - 6, 6); circ(x + 9, y + 8, 4); ctx.fill();
    cloudShape(x - 50, y + 26, 0.55, '#dfe3ee');
  } else {
    ctx.fillStyle = 'rgba(255,246,208,.18)'; ctx.beginPath(); circ(x, y, 30); ctx.fill();
    ctx.globalAlpha = 0.92; cloudShape(x - 26 + Math.sin(S.time * 0.4) * 6, y + 4, 0.75, '#3b3550'); cloudShape(x - 4, y - 18, 0.5, '#4a4362'); ctx.globalAlpha = 1;
  }
  ctx.restore();
}
function cloudShape(x, y, s, col) { ctx.fillStyle = col; ctx.beginPath(); circ(x, y, 26 * s); circ(x + 28 * s, y - 10 * s, 30 * s); circ(x + 58 * s, y, 24 * s); circ(x + 30 * s, y + 10 * s, 26 * s); ctx.fill(); }
/* --- full-screen scenes inside the peek hole: the train ride, the sky --- */
function drawRideScene() {
  if (!S.ride.back) { drawRideCore(); return; }                                                    // to Monster Town: left to right
  ctx.save(); ctx.translate(VW, 0); ctx.scale(-1, 1); drawRideCore(); ctx.restore();               // back home: right to left
  const t = S.ride.t;
  ctx.globalAlpha = 0.92;
  for (const [cx, cy, s2, sp] of [[60, 170, 0.9, 10], [330, 145, 1.2, 7], [620, 200, 0.8, 12], [860, 160, 1.0, 9]]) cloudShape(((cx + t * sp) % (VW + 200)) - 120, cy, s2, '#eef0f8');
  ctx.globalAlpha = 1;
}
function drawRideCore() {
  const t = S.ride.t;
  const gr = ctx.createLinearGradient(0, 0, 0, VH); gr.addColorStop(0, '#120a24'); gr.addColorStop(1, '#2e1c44'); ctx.fillStyle = gr; ctx.fillRect(0, 0, VW, VH);
  for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(255,255,255,${0.3 + hash(i, 9) * 0.6})`; ctx.fillRect(hash(i, 1) * VW, hash(i, 2) * 300, 2, 2); }
  if (S.flags.skyDone) { const mg = ctx.createRadialGradient(700, 150, 10, 700, 150, 120); mg.addColorStop(0, 'rgba(255,250,220,.6)'); mg.addColorStop(1, 'rgba(255,250,220,0)'); ctx.fillStyle = mg; ctx.beginPath(); circ(700, 150, 120); ctx.fill(); ctx.fillStyle = '#fff6d0'; ctx.beginPath(); circ(700, 150, 40); ctx.fill(); }
  else { ctx.fillStyle = 'rgba(255,246,208,.15)'; ctx.beginPath(); circ(700, 150, 34); ctx.fill(); cloudShape(660, 150, 1, '#1a1426'); }
  for (const [sp, col, yb, hh] of [[40, '#1c1430', 400, 140], [110, '#140e22', 450, 90]]) {
    ctx.fillStyle = col; const off = (t * sp) % 120;
    for (let i = -1; i < 11; i++) { const x = i * 120 - off; ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(x + 40, yb - hh - hash(i + Math.floor(t * sp / 120), 3) * 50); ctx.lineTo(x + 80, yb); ctx.fill(); }
  }
  ctx.fillStyle = '#0e0a16'; ctx.fillRect(0, 440, VW, 160);
  ctx.fillStyle = '#4a4038'; ctx.fillRect(0, 446, VW, 18); ctx.fillStyle = '#a8a8b4'; ctx.fillRect(0, 444, VW, 3);
  const jx = 300, jy = 440 + Math.abs(Math.sin(t * 9)) * 2;
  // wagon with the cousins
  ctx.save(); ctx.translate(jx - 30, jy);
  const kN = { who: 'Nehir', dir: 'down', moving: false }, kB = { who: 'Bade', dir: 'down', moving: false };
  drawKid(kN, 20, -26); drawKid(kB, 64, -26);
  ctx.fillStyle = '#5a2a7a'; rr(ctx, -20, -54, 120, 50, 8); ctx.fill(); ctx.fillStyle = '#ffb347'; ctx.fillRect(-20, -30, 120, 5);
  ctx.fillStyle = '#1a1424'; for (const wx of [0, 80]) { ctx.beginPath(); circ(wx, -4, 11); ctx.fill(); }
  ctx.restore();
  // the engine with the conductor
  ctx.save(); ctx.translate(jx + 120, jy);
  drawSkeleton(36, -40, { cap: true, s: 0.8 });
  ctx.fillStyle = '#2a2240'; rr(ctx, 0, -70, 110, 66, 8); ctx.fill(); ctx.fillStyle = '#1a1424'; ctx.fillRect(10, -66, 48, 30);
  ctx.fillStyle = '#3e2c50'; rr(ctx, 50, -54, 90, 50, 10); ctx.fill(); ctx.fillStyle = '#1a1424'; ctx.fillRect(110, -84, 18, 30);
  for (let i = 0; i < 3; i++) { const k = (t * 1.2 + i / 3) % 1; ctx.fillStyle = `rgba(200,190,230,${0.5 - k * 0.5})`; ctx.beginPath(); circ(119 - k * 120, -92 - k * 40, 10 + k * 16); ctx.fill(); }
  drawJack(146, -12, 0.8, true);
  ctx.fillStyle = '#1a1424'; for (const wx of [24, 74, 116]) { ctx.beginPath(); circ(wx, -4, 13); ctx.fill(); ctx.strokeStyle = '#a8a8b4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(wx, -4); ctx.lineTo(wx + Math.cos(t * 12) * 10, -4 + Math.sin(t * 12) * 10); ctx.stroke(); }
  ctx.restore();
  for (let i = 0; i < 3; i++) { const gx = (t * 60 + i * 330) % (VW + 100) - 50; drawGhost(VW - gx, 300 + Math.sin(t * 2 + i) * 20, { alpha: 0.5 }); }
}
function drawSkyScene() {
  const K = S.sky, sil = K.silver, t = S.time;
  const top = `rgb(${18 + sil * 40},${12 + sil * 40},${36 + sil * 60})`, bot = `rgb(${46 + sil * 60},${30 + sil * 60},${70 + sil * 70})`;
  const gr = ctx.createLinearGradient(0, 0, 0, VH); gr.addColorStop(0, top); gr.addColorStop(1, bot); ctx.fillStyle = gr; ctx.fillRect(0, 0, VW, VH);
  for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(255,255,255,${(0.2 + hash(i, 9) * 0.6) * (0.4 + sil * 0.6)})`; ctx.fillRect(hash(i, 1) * VW, hash(i, 2) * VH, 2, 2); }
  if (K.moon > 0) { ctx.globalAlpha = K.moon; const mx = 690, my = 150 - K.moon * 30; const g2 = ctx.createRadialGradient(mx, my, 20, mx, my, 160); g2.addColorStop(0, 'rgba(255,250,220,.7)'); g2.addColorStop(1, 'rgba(255,250,220,0)'); ctx.fillStyle = g2; ctx.beginPath(); circ(mx, my, 160); ctx.fill(); ctx.fillStyle = '#fff6d0'; ctx.beginPath(); circ(mx, my, 62); ctx.fill(); ctx.fillStyle = 'rgba(200,190,150,.4)'; ctx.beginPath(); circ(mx - 18, my - 10, 12); circ(mx + 20, my + 16, 9); circ(mx + 6, my - 26, 6); ctx.fill(); ctx.globalAlpha = 1; }
  const mix = (a, b) => `rgb(${Math.round(a[0] + (b[0] - a[0]) * sil)},${Math.round(a[1] + (b[1] - a[1]) * sil)},${Math.round(a[2] + (b[2] - a[2]) * sil)})`;
  const cdark = mix([34, 30, 44], [214, 218, 232]), clight = mix([48, 42, 60], [236, 240, 250]);
  for (const [cx, cy, s] of [[150, 200, 1.2], [800, 380, 1.4], [120, 470, 1.0], [880, 140, 0.9]]) cloudShape(cx + Math.sin(t * 0.3 + cx) * 10, cy, s, cdark);
  // Gürgür the cloud giant
  const gx = 480, gy = 270 + Math.sin(t * 0.8) * 6;
  const giant = (dx, dy) => { ctx.beginPath(); circ(gx - 150 + dx, gy + 30 + dy, 80); circ(gx - 70 + dx, gy - 50 + dy, 100); circ(gx + 50 + dx, gy - 70 + dy, 110); circ(gx + 150 + dx, gy + 10 + dy, 90); circ(gx + dx, gy + 50 + dy, 110); ctx.fill(); };
  if (K.moon < 1) {   // the moon is hiding right behind him: its light spills around his edges
    const hide = 1 - K.moon, mg = ctx.createRadialGradient(gx + 30, gy - 40, 80, gx + 30, gy - 40, 340);
    mg.addColorStop(0, `rgba(255,250,225,${0.75 * hide})`); mg.addColorStop(0.55, `rgba(230,225,255,${0.35 * hide})`); mg.addColorStop(1, 'rgba(230,225,255,0)');
    ctx.fillStyle = mg; ctx.beginPath(); circ(gx + 30, gy - 40, 340); ctx.fill();
    ctx.save(); ctx.shadowColor = `rgba(255,250,230,${0.95 * hide})`; ctx.shadowBlur = 45; ctx.fillStyle = cdark; giant(0, 0); ctx.restore();
    ctx.fillStyle = `rgba(245,240,255,${0.85 * hide})`; giant(0, -7);
  }
  ctx.fillStyle = cdark; giant(0, 0);
  ctx.fillStyle = clight; ctx.beginPath(); circ(gx - 60, gy - 70, 50); circ(gx + 40, gy - 90, 46); ctx.fill();
  const mood = K.mood;
  ctx.fillStyle = '#1a1424';
  const ey = gy - 10, blink = (t % 4) < 0.15;
  if (blink) { ctx.fillRect(gx - 64, ey, 30, 5); ctx.fillRect(gx + 34, ey, 30, 5); }
  else if (mood === 'happy') { ctx.lineWidth = 7; ctx.strokeStyle = '#1a1424'; ctx.beginPath(); ctx.arc(gx - 49, ey + 8, 16, Math.PI * 1.15, Math.PI * 1.85); ctx.moveTo(gx + 65, ey + 8); ctx.arc(gx + 49, ey + 8, 16, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
  else { const r = mood === 'surprised' ? 14 : 11; ctx.beginPath(); circ(gx - 49, ey, r); circ(gx + 49, ey, r); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); circ(gx - 45, ey - 4, 3.5); circ(gx + 53, ey - 4, 3.5); ctx.fill(); }
  ctx.strokeStyle = '#1a1424'; ctx.lineWidth = 7; ctx.beginPath();
  if (mood === 'grumpy') { ctx.moveTo(gx - 72, ey - 26); ctx.lineTo(gx - 30, ey - 16); ctx.moveTo(gx + 72, ey - 26); ctx.lineTo(gx + 30, ey - 16); ctx.moveTo(gx - 30, ey + 58); ctx.quadraticCurveTo(gx, ey + 40, gx + 30, ey + 58); }
  else if (mood === 'sad') { ctx.moveTo(gx - 30, ey + 60); ctx.quadraticCurveTo(gx, ey + 44, gx + 30, ey + 60); }
  else if (mood === 'surprised') { ctx.ellipse(gx, ey + 52, 14, 18, 0, 0, 7); }
  else { ctx.moveTo(gx - 40, ey + 40); ctx.quadraticCurveTo(gx, ey + 80, gx + 40, ey + 40); }
  ctx.stroke();
  if (mood === 'sad') { ctx.fillStyle = '#9fd6ff'; ctx.beginPath(); ctx.ellipse(gx - 60, ey + 30 + (t * 30) % 40, 5, 8, 0, 0, 7); ctx.fill(); }
  if (mood === 'happy' || mood === 'surprised') { ctx.fillStyle = 'rgba(255,140,180,.35)'; ctx.beginPath(); circ(gx - 82, ey + 30, 16); circ(gx + 82, ey + 30, 16); ctx.fill(); }
  // the helicopter with the cousins
  const hx = 400 + Math.sin(t * 1.3) * 14, hy = 445 + Math.sin(t * 2.1) * 8;
  ctx.save(); ctx.translate(hx, hy); ctx.scale(1.5, 1.5);
  drawHelicopter(0, 0, t * 30, true);
  ctx.restore();
}
function drawPopupsAndUI(ox, oy) {
  for (const pu of S.popups) {
    const k = pu.life / pu.max, rise = (1 - k) * 30;
    outlinedText(pu.text, ox + pu.x * TS, oy + pu.y * TS - rise, pu.size * (k > 0.85 ? 1 + (k - 0.85) * 2 : 1), pu.color, Math.min(1, k * 2.5));
  }
  if (S.dance) {
    const D = S.dance, x = ox + D.ax * TS, y = oy + D.ay * TS - 60;
    outlinedText(`${D.round}. TUR / ${D.rounds}`, x, y - 44, 17, '#fff3c4');
    if (D.phase === 'show' && D.shown >= 0) { outlinedText(ARROW[D.seq[D.shown]], x, y, 72, '#d7c4ff'); outlinedText(`${D.shown + 1}. nota ♪`, x, y + 46, 16, '#fff3c4'); }
    else if (D.phase === 'show') outlinedText('👀', x, y, 40, '#ffffff');
    else {
      const n = D.seq.length, w = 46;
      for (let i = 0; i < n; i++) {
        const sx = x + (i - (n - 1) / 2) * w, g = D.got[i], wrong = g && g !== D.seq[i];
        ctx.fillStyle = wrong ? 'rgba(224,90,74,.9)' : g ? 'rgba(127,224,160,.9)' : 'rgba(255,250,235,.9)'; rr(ctx, sx - 19, y - 22, 38, 44, 8); ctx.fill();
        ctx.strokeStyle = '#3a2a1b'; ctx.lineWidth = 2; ctx.stroke();
        const txt = D.phase === 'answer' ? ARROW[D.seq[i]] : g ? ARROW[g] : '?';
        ctx.fillStyle = '#3a2a1b'; ctx.font = 'bold 26px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, sx, y); ctx.textBaseline = 'alphabetic';
      }
      if (D.phase === 'input') outlinedText('Klavyedeki ok tuşlarına bas!', x, y + 42, 16, '#fff3c4');
    }
  }
  if (S.mode === 'play' && !S.locked && !S.dialog) {
    const e = nearestInteractable(), ca = e ? null : contextAction();
    if (e || ca) {
      const c = P(), bx = ox + c.x * TS, by = oy + c.y * TS - (c.who === 'Bade' ? 94 : 76);
      const label = '✦ ' + (e ? verbOf(e) : ca.label);
      ctx.font = 'bold 15px "Trebuchet MS", sans-serif'; const w = ctx.measureText(label).width + 18;
      ctx.fillStyle = 'rgba(255,248,232,0.95)'; rr(ctx, bx - w / 2, by - 13, w, 24, 12); ctx.fill();
      ctx.strokeStyle = e && ((e.high && c.who === 'Nehir' && e.type !== 'jar') || (e.hang && c.who === 'Bade')) ? '#b3122e' : '#5a2a7a'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#3a2a1b'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, bx, by); ctx.textBaseline = 'alphabetic';
    }
  }
  if (S.areaT > 0 && S.mode === 'play' && !S.camTarget) {
    const a = Math.min(1, S.areaT / 0.6, (2.6 - S.areaT) / 0.4 + 0.01);
    outlinedText('~ ' + S.areaName + ' ~', HOLE.cx, HOLE.cy - HOLE.ry + 34, 22, '#f6e6bf', Math.max(0, a));
  }
}
function outlinedText(text, x, y, size, color, alpha = 1) {
  ctx.globalAlpha = alpha;
  ctx.font = `bold ${size}px Georgia, "Times New Roman", serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(4, size / 6); ctx.strokeStyle = 'rgba(20,14,30,0.85)'; ctx.strokeText(text, x, y);
  ctx.fillStyle = color; ctx.fillText(text, x, y);
  ctx.globalAlpha = 1; ctx.textBaseline = 'alphabetic';
}

/* ---------------------------------------------------------------------
   21. RENDER
   --------------------------------------------------------------------- */
const FRIEND_DRAW = {
  mimi: (x, b) => drawMummy(x, b, true, 0), kurtul: (x, b) => drawWerewolf(x, b, false), frenk: (x, b) => drawFrank(x, b, true),
  cemile: (x, b) => drawWitch(x, b, false), hulya: (x, b) => drawGhost(x, b, { bow: true }), selo: (x, b) => drawGhostDog(x, b, true), pitir: (x, b) => drawCat(x, b, true),
};
function render() {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  if (S.ride || S.sky) {
    if (S.ride) drawRideScene(); else drawSkyScene();
    drawPopupsAndUI(0, 0);
    if (S.fade > 0) { ctx.fillStyle = `rgba(${S.fadeCol},${S.fade})`; ctx.fillRect(0, 0, VW, VH); }
    ctx.drawImage(paperC, 0, 0, VW, VH);
    return;
  }
  const sh = S.shake > 0 ? S.shake * 12 : 0;
  const ox = Math.round(HOLE.cx - S.cam.x + (Math.random() - 0.5) * sh);
  const oy = Math.round(HOLE.cy - S.cam.y + (Math.random() - 0.5) * sh);
  const c0 = Math.max(0, Math.floor((HOLE.cx - HOLE.rx - 40 - ox) / TS)), c1 = Math.min(MAP_W - 1, Math.floor((HOLE.cx + HOLE.rx + 40 - ox) / TS));
  const r0 = Math.max(0, Math.floor((HOLE.cy - HOLE.ry - 40 - oy) / TS)), r1 = Math.min(MAP_H - 1, Math.floor((HOLE.cy + HOLE.ry + 160 - oy) / TS));
  const F = S.flags;
  OX = ox; OY = oy;
  ctx.fillStyle = '#0e0a14'; ctx.fillRect(0, 0, VW, VH);
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) drawGround(c, r, ox + c * TS, oy + r * TS);
  drawRoomDecor(ox, oy);
  const L = [];
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
    const t = tileAt(c, r), x = ox + c * TS, y = oy + r * TS;
    if (t === 'T') { const h = hash(c, r); L.push([r + 0.9, () => drawTree(x + TS / 2, y + TS - 2, h)]); }
    else if (t === 'h') L.push([r + 0.7, () => drawHedge(x, y)]);
    else if (isFenceT(t)) L.push([r + 0.75, () => drawFenceTile(c, r, x, y)]);
    else if (t === 'Y') { const h = hash(c, r); L.push([r + 0.85, () => drawGrave(x + TS / 2, y + TS - 4, h)]); }
    else if (t === 'J') { const h = hash(c, r); L.push([r + 0.85, () => drawJunk(x + TS / 2, y + TS - 4, h)]); }
  }
  addFurniture(L, ox, oy, c0, c1, r0, r1);
  for (const B of BUILDINGS) if (B.x2 >= c0 - 1 && B.x1 <= c1 + 1 && B.y2 >= r0 - 1 && B.y1 <= r1 + 4) L.push([B.y2 + 1, () => drawBuilding(B, ox, oy)]);
  const WALLY = { mirror: 0.5, jar: 0.5, recipe: 0.3, musicBox: 0.5 };
  for (const e of ENTS) {
    const p = entPos(e);
    if (p.x < c0 - 3 || p.x > c1 + 3 || p.y < r0 - 3 || p.y > r1 + 5) continue;
    const yy = e.type === 'heavy' && F.moved[e.id] ? e.to[1] : e.type === 'bowl3' ? 6.1 : e.type === 'kurtul' ? 18.05 : p.y + (WALLY[e.type] || 0);
    L.push([yy, () => drawEntity(e, ox + p.x * TS, oy + p.y * TS)]);
  }
  // friends who already gave their lantern wait (or dance) at the square
  for (const f of FRIENDS) if (F.lanterns[f.key] && !(S.leaving && S.leaving.key === f.key)) {
    const [fx, fy] = FRIEND_SQUARE[f.key];
    if (fx < c0 - 3 || fx > c1 + 3 || fy < r0 - 3 || fy > r1 + 5) continue;
    const dance = F.skyDone ? Math.sin(S.time * 6 + fx) * 0.25 : 0, hop = F.skyDone ? Math.abs(Math.sin(S.time * 5 + fx)) * 10 : 0;
    L.push([fy, () => FRIEND_DRAW[f.key](ox + (fx + dance) * TS, oy + fy * TS - hop)]);
  }
  if (F.skyDone) {
    L.push([30.2, () => drawDrakos(ox + 35.6 * TS, oy + 29.2 * TS, false)]);
    L.push([27.2, () => drawBora(ox + 29.6 * TS, oy + 27.6 * TS)]);
  }
  if (S.leaving) { const lv = S.leaving; L.push([lv.y + 0.4, () => { ctx.globalAlpha = 1 - lv.k; FRIEND_DRAW[lv.key](ox + lv.x * TS, oy + lv.y * TS - lv.k * 30); ctx.globalAlpha = 1; }]); }
  for (const p of S.pumpkins) if (p.y > r0 - 2 && p.y < r1 + 2 && p.x > c0 - 2 && p.x < c1 + 2) L.push([p.y, () => drawRollingPumpkin(p, ox + p.x * TS, oy + p.y * TS)]);
  for (const s of S.slimes) if (s.x > c0 - 2 && s.x < c1 + 2 && s.y > r0 - 2 && s.y < r1 + 2) L.push([s.y, () => drawSlime(s, ox + s.x * TS, oy + s.y * TS)]);
  // the cousins
  const N = S.chars.Nehir, Bd = S.chars.Bade;
  if (S.lift > 0) {
    L.push([Bd.y, () => { drawKid(Bd, ox + Bd.x * TS, oy + Bd.y * TS); const nx = ox + Bd.x * TS, nb = oy + Bd.y * TS - 56 * S.lift; drawKid({ ...N, dir: 'up', moving: false, hurtT: 0 }, nx + (N.x - Bd.x) * TS * (1 - S.lift), nb); }]);
  } else if (S.hang) {
    const H = S.hang, k = H.k;
    L.push([Bd.y, () => drawKid(Bd, ox + Bd.x * TS, oy + Bd.y * TS)]);
    L.push([9.5, () => {
      const sx = ox + N.x * TS, sy = oy + N.y * TS, tx = ox + (H.x - 0.6) * TS, ty = oy + H.y * TS - 58;
      if (k > 0.6) { ctx.save(); ctx.translate(tx, ty); ctx.scale(1, -1); drawKid({ ...N, dir: 'down', moving: false, hurtT: 0 }, 0, 0); ctx.restore(); }
      else { const kk = k / 0.6; drawKid({ ...N, dir: 'up', moving: true, walkT: S.time, hurtT: 0 }, sx + (tx - sx) * kk, sy + (ty + 50 - sy) * kk); }
    }]);
  } else for (const c of [N, Bd]) L.push([c.y, () => {
    drawKid(c, ox + c.x * TS, oy + c.y * TS);
    if (c.who === S.active && !S.camTarget) { ctx.fillStyle = c.who === 'Bade' ? 'rgba(255,170,190,.9)' : 'rgba(215,196,255,.9)'; ctx.beginPath(); const hy = oy + c.y * TS - (c.who === 'Bade' ? 84 : 68) - Math.abs(Math.sin(S.time * 3)) * 4; ctx.moveTo(ox + c.x * TS - 5, hy - 6); ctx.lineTo(ox + c.x * TS + 5, hy - 6); ctx.lineTo(ox + c.x * TS, hy); ctx.closePath(); ctx.fill(); }
  }]);
  L.sort((a, b) => a[0] - b[0]);
  for (const [, fn] of L) fn();
  // flying things: the bat swarm, puffs of bats, the lantern gift
  const B = S.bats;
  if (B && B.x > c0 - 3 && B.x < c1 + 3 && B.y > r0 - 3 && B.y < r1 + 3) for (let i = 0; i < 7; i++) { const a = S.time * 3 + i * 0.9, rr2 = 18 + (i % 3) * 8; drawBat(ox + B.x * TS + Math.cos(a) * rr2, oy + B.y * TS - 30 + Math.sin(a * 1.3) * rr2 * 0.6, 0.7); }
  if (S.batPuff) { const P2 = S.batPuff; for (let i = 0; i < 5; i++) drawBat(ox + P2.x * TS + Math.cos(i * 1.3) * P2.t * 80, oy + P2.y * TS - 60 - P2.t * 60 + Math.sin(i * 2) * 20, 0.6); }
  if (S.gift) { const g = S.gift, c = P(), x = ox + (g.x + (c.x - g.x) * g.k) * TS, y = oy + (g.y + (c.y - g.y) * g.k) * TS - 50 - Math.sin(g.k * Math.PI) * 50; drawJack(x, y, 1.1, true); }
  if (S.ring) { const R = S.ring; ctx.strokeStyle = `rgba(215,196,255,${1 - R.t})`; ctx.lineWidth = 3; for (let i = 0; i < 3; i++) { ctx.beginPath(); circ(ox + R.x * TS, oy + R.y * TS - 56, 10 + R.t * 50 + i * 12); ctx.stroke(); } }
  for (const R of S.rings || []) { const k = R.t / 1.4; ctx.strokeStyle = R.found ? `rgba(215,196,255,${0.75 * (1 - k)})` : `rgba(215,196,255,${0.25 * (1 - k)})`; ctx.lineWidth = R.found ? 3 : 2; ctx.beginPath(); ctx.ellipse(ox + R.x * TS, oy + R.y * TS, 20 + k * 4.5 * TS, (20 + k * 4.5 * TS) * 0.6, 0, 0, 7); ctx.stroke(); }
  // particles
  for (const q of S.particles) {
    const a = Math.max(0, Math.min(1, q.life / q.max * 1.5)); ctx.globalAlpha = a; ctx.fillStyle = q.color;
    const x = ox + q.x * TS, y = oy + q.y * TS;
    if (q.kind === 'spark') star(ctx, x, y, q.size, q.size * 0.4, 4);
    else if (q.kind === 'conf') { ctx.save(); ctx.translate(x, y); ctx.rotate(q.life * 4); ctx.fillRect(-q.size / 2, -q.size / 4, q.size, q.size / 2); ctx.restore(); }
    else { ctx.beginPath(); circ(x, y, q.size / 2); ctx.fill(); }
  }
  ctx.globalAlpha = 1;
  drawNight(ox, oy);
  drawPopupsAndUI(ox, oy);
  if (S.fade > 0) { ctx.fillStyle = `rgba(${S.fadeCol},${S.fade})`; ctx.fillRect(0, 0, VW, VH); }
  ctx.drawImage(paperC, 0, 0, VW, VH);
}

/* ---------------------------------------------------------------------
   22. START
   --------------------------------------------------------------------- */
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
  if (!S.manual) step(dt);
  render();
  if (S.mapOpen && Math.floor(now / 100) % 3 === 0) drawTownMap();
  requestAnimationFrame(loop);
}
resize();
resetHazards();
placeStart(81.5, 6.4, OWNER === 'Bade' ? 'Bade' : 'Nehir');
saveCheckpoint(true);
updateHUD();
requestAnimationFrame(loop);

// Small hook so the game can be tested automatically (harmless for players)
window.__cadi = { renderDialog, S, step, input, press, release, closeDialog, nearestInteractable, interact, resetGame, loadCheckpoint, render, ENTS, map, solidFor, blockedAt, tileAt, areaAt, DOORS, OWNER, toggleMap, swapCousin, contextAction, entVisibleFor, entPos, drawPortraits };
})();
