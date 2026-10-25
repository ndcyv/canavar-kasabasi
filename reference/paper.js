function rr(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
function star(g, x, y, R, r, n) {
  g.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2, d = i % 2 ? r : R; g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); }
  g.closePath(); g.fill();
}
function circ(x, y, r) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2); }
function holePath(g) {
  const N = 120; g.beginPath();
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a), n = 3.2;
    const ex = Math.sign(ca) * Math.pow(Math.abs(ca), 2 / n), ey = Math.sign(sa) * Math.pow(Math.abs(sa), 2 / n);
    const j = 1 + 0.018 * Math.sin(a * 9 + 1) + 0.012 * Math.sin(a * 23 + 2) + (hash(i, 7) - 0.5) * 0.022;
    const x = HOLE.cx + ex * HOLE.rx * j, y = HOLE.cy + ey * HOLE.ry * j;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath();
}
function buildPaper() {
  const c = document.createElement('canvas'); c.width = VW * DPR; c.height = VH * DPR;
  const g = c.getContext('2d'); g.scale(DPR, DPR);
  g.fillStyle = '#f4e8ca'; g.fillRect(0, 0, VW, VH);
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = hash(i, 1) < 0.5 ? 'rgba(150,120,80,0.10)' : 'rgba(255,255,255,0.35)';
    g.fillRect(hash(i, 2) * VW, hash(i, 3) * VH, 1 + hash(i, 4) * 2, 1);
  }
  g.strokeStyle = 'rgba(90,140,200,0.22)'; g.lineWidth = 1;
  for (let y = 70; y < VH; y += 28) { g.beginPath(); g.moveTo(0, y); g.lineTo(VW, y); g.stroke(); }
  g.strokeStyle = 'rgba(205,80,80,0.30)'; g.beginPath(); g.moveTo(58, 0); g.lineTo(58, VH); g.stroke();
  const pencil = 'rgba(52,70,48,0.55)';
  g.fillStyle = pencil; g.strokeStyle = pencil; g.lineWidth = 1.4;
  g.font = 'italic 22px "Segoe Print","Bradley Hand","Chalkboard SE","Comic Sans MS",cursive';
  g.textAlign = 'center'; g.fillText('Canavar Kasabası', VW / 2, 42);
  g.beginPath(); g.moveTo(VW / 2 - 150, 52); g.quadraticCurveTo(VW / 2, 58, VW / 2 + 150, 50); g.stroke();
  g.font = '28px "Segoe Print","Bradley Hand","Chalkboard SE","Comic Sans MS",cursive';
  [[180, 200, -0.2], [790, 190, 0.25], [770, 420, 0.1], [170, 440, -0.15]].forEach(([x, y, a]) => { g.save(); g.translate(x, y); g.rotate(a); g.fillText('?', 0, 0); g.restore(); });
  // pencil doodles: little bats and pumpkins in the corners
  const bat = (x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 1.4 / s; g.beginPath(); g.moveTo(-18, -2); g.quadraticCurveTo(-10, -12, -4, -3); g.quadraticCurveTo(0, -8, 4, -3); g.quadraticCurveTo(10, -12, 18, -2); g.quadraticCurveTo(10, 0, 8, 5); g.quadraticCurveTo(4, 1, 0, 6); g.quadraticCurveTo(-4, 1, -8, 5); g.quadraticCurveTo(-10, 0, -18, -2); g.stroke(); g.restore(); };
  const pump = (x, y) => { g.save(); g.translate(x, y); g.lineWidth = 1.3; g.beginPath(); g.ellipse(0, 0, 14, 11, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(0, 0, 6, 11, 0, 0, 7); g.stroke(); g.beginPath(); g.moveTo(0, -11); g.lineTo(2, -17); g.stroke(); g.restore(); };
  bat(90, 548, 1); bat(130, 515, 0.7); bat(870, 540, 0.9); pump(905, 505); pump(60, 500);
  g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000'; holePath(g); g.fill();
  g.globalCompositeOperation = 'source-over';
  g.strokeStyle = 'rgba(140,110,70,0.75)'; g.lineWidth = 2.2; holePath(g); g.stroke();
  g.strokeStyle = 'rgba(255,250,235,0.9)'; g.lineWidth = 1; g.save(); g.translate(-1.5, -1.5); holePath(g); g.stroke(); g.restore();
  const c2 = document.createElement('canvas'); c2.width = c.width; c2.height = c.height;
  const g2 = c2.getContext('2d');
  g2.shadowColor = 'rgba(0,0,0,0.7)'; g2.shadowBlur = 26 * DPR; g2.drawImage(c, 0, 0);
  paperC = c2;
}
function resize() {
  const d = Math.min(2, window.devicePixelRatio || 1);
  if (d === DPR && paperC) return;
  DPR = d; cv.width = VW * DPR; cv.height = VH * DPR; buildPaper();
}
window.addEventListener('resize', resize);

