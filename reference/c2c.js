
/* ---------------------------------------------------------------------
   16. THE FINALE: the big lantern, the helicopter, the cloud giant
   --------------------------------------------------------------------- */
async function towerScene() {
  const F = S.flags, N = S.chars.Nehir, B = S.chars.Bade;
  if (F.lanternCount < N_L) {
    await say(`Saat kulesinin önündeki Büyük Fener sönük. Onu yakmak için yedi balkabağı feneri lazım. (${F.lanternCount}/${N_L})`);
    if (once('towerTip')) await say('Kasabadaki canavar arkadaşlara yardım edin. Her biri size bir fener verecek!', { speaker: SAY.drakos });
    return;
  }
  if (Math.hypot(N.x - B.x, N.y - B.y) > 3.2) {
    await say('Büyük Fener kulenin tepesinde, çok yüksekte! Bade bile yetişemiyor.');
    await say("İkiniz yan yana olursanız Bade, Nehir'i omzuna alabilir. Kuzenini yanına çağır: biraz yürü, o peşinden gelir!");
    return;
  }
  await say('Yedi balkabağı fenerini kulenin basamaklarına dizdiler. 🎃🎃🎃🎃🎃🎃🎃');
  await say("Şimdi Büyük Fener'i yakalım! Gel Nehir, omzuma çık!", { speaker: SAY.Bade });
  S.camTarget = { x: 39.5, y: 22.5 };
  S.lift = 0; await tween(0.6, (k) => { S.lift = k; });
  await say("Nehir kanatlarını açtı, uzandı ve Büyük Fener'in fitilini yaktı… Fışşş!", { speaker: SAY.Nehir });
  Sound.play('win'); F.towerLit = true; S.beam = 0;
  await tween(1.2, (k) => { S.beam = k; });
  await tween(0.4, (k) => { S.lift = 1 - k; }); S.lift = 0;
  await say('Saat kulesinden kocaman bir ışık gökyüzüne yükseldi!', { loud: true });
  S.camTarget = { x: 39.5, y: 20 };
  await say('Işık bulutlara ulaştı… Ama bulutlar hiç kımıldamıyor. Sanki orada biri var!', { speaker: SAY.drakos });
  Sound.play('heli');
  S.heliIn = 0; S.camTarget = { x: 36.8, y: 37.6 };
  await tween(2.2, (k) => { S.heliIn = k; });
  S.heliIn = 1;
  await say('Pırpır pırpır! Ben Pilot Pırpır! Işığınızı gördüm, hemen geldim.', { speaker: SAY.pirpir });
  await say('Bulutların yanına uçup ne olduğuna bakalım mı? Helikopter pistinde sizi bekliyorum!', { speaker: SAY.pirpir });
  S.camTarget = null;
  saveCheckpoint();
}
async function skyScene() {
  const ch = await say('Helikoptere binip bulutların yanına uçalım mı?', { speaker: SAY.pirpir, choices: ['Uçalım!', 'Biraz sonra'] });
  if (ch !== 0) return;
  Sound.play('heli'); await fadeOut(0.5, '8,5,18');
  S.sky = { silver: 0, moon: 0, mood: 'grumpy' };
  await fadeIn(0.5);
  await say('Helikopter pır pır pır yükseldi… Kara bulutların arasına girdiler.');
  await say('Bak Bade! Bu bulutun bir yüzü var!', { speaker: SAY.Nehir });
  Sound.play('rumble'); shake(0.3);
  await say('GÜRRR! Kim o? Gidin buradan!', { speaker: SAY.gurgur, loud: true });
  await say('Merhaba! Biz Nehir ile Bade. Neden ayı sakladın?', { speaker: SAY.Bade });
  S.sky.mood = 'sad';
  await say('Her yıl aşağıda bir festival oluyor. Herkes dans ediyor, kakao içiyor… Ama beni hiç kimse çağırmıyor. Ben de ayı sakladım. Hıh!', { speaker: SAY.gurgur });
  await say('Demek çok yalnızsın…', { speaker: SAY.Nehir });
  for (;;) {
    const c = await say("Gürgür'e ne diyelim?", { choices: ['Bizimle festivale gel, Gürgür!', 'Ayı hemen geri ver!'] });
    if (c === 0) break;
    S.sky.mood = 'grumpy'; Sound.play('rumble'); shake(0.25);
    await say('GÜRRR! Bana bağırırsanız hiç vermem!', { speaker: SAY.gurgur, loud: true });
    await say('Hımm, bağırmak işe yaramadı. Gürgür aslında kızgın değil, yalnız. Belki ona başka bir şey söylemeliyiz…', { speaker: SAY.Bade });
    S.sky.mood = 'sad';
  }
  S.sky.mood = 'surprised';
  await say('Ben mi? Festivale mi? … Gerçekten mi?', { speaker: SAY.gurgur });
  await say('Tabii ki! Gökyüzünün en büyük misafiri sen olursun!', { speaker: SAY.Nehir });
  await say('Hem bulut devi olmadan festival olur mu hiç?', { speaker: SAY.Bade });
  S.sky.mood = 'happy'; Sound.play('win');
  await tween(2.0, (k) => { S.sky.silver = k; });
  await say('Gürgür kocaman gülümsedi. Kara bulutlar yavaş yavaş gümüş rengine döndü…');
  await tween(2.0, (k) => { S.sky.moon = k; });
  await say('Ve bulutların arkasından kocaman, parlak ay çıktı! 🌕', { loud: true });
  await say('Gürrr… Teşekkürler kızlar. Hemen geliyorum!', { speaker: SAY.gurgur });
  await fadeOut(0.6, '235,235,250');
  S.sky = null; S.flags.skyDone = true; S.festT = 0;
  placeBoth(35.5, 30.6); P().dir = 'down';
  S.area = ''; checkAreaTitle();
  await fadeIn(0.8);
  await festivalEnding();
}
async function festivalEnding() {
  const F = S.flags;
  S.camTarget = { x: 35.8, y: 29.6 };
  Sound.play('ghost');
  await say('Ay geri döndü! AY FESTİVALİ BAŞLASIN!', { speaker: SAY.drakos, loud: true });
  Sound.play('howl');
  await say('AUUUUUU!', { speaker: SAY.kurtul, loud: true });
  [0, 1, 2, 3, 2, 1, 0].forEach((n, i) => setTimeout(() => Sound.note(n), i * 260));
  await say('Hülya müzik kutusuyla şarkısını çaldı. Frenk dimdik boynuyla dans etti. Cemile süpürgesiyle meydanın üstünde uçtu.');
  await say('Mimi hiç çözülmeden fır fır döndü, Selo kemiğiyle zıpladı. Gürgür de gökyüzünde gümüş gibi parladı.');
  await say('Ve şimdi… bu yılın en güzel kostüm ödülü… Vampir Bade ile Yarasa Nehir\'e!', { speaker: SAY.drakos, loud: true });
  F.badges = true; Sound.play('win');
  for (const c of Object.values(S.chars)) sparkle(c.x, c.y - 1.2, '#ffe066', 26);
  await say('Yaşasııın!', { speaker: 'NEHİR VE BADE', loud: true });
  await say('Takır takır! Kutlarım kızlar! Son tren istasyonda. Hazır olunca gelin, sizi mahallenize götüreyim.', { speaker: SAY.kond });
  S.camTarget = null;
  saveCheckpoint(true);
  showToast("Festivalin tadını çıkar! Hazır olunca istasyondaki Kondüktör Takırtı'ya git.", 6);
}
// back home: the mums and Duru are waiting
async function homeEnding() {
  const F = S.flags;
  S.camTarget = { x: 80.5, y: 5.4 };
  await say('Geldiniz! Nasıldı Korku Treni?', { speaker: SAY.funda });
  await say('Anne! Korku Treni bizi gerçek bir Canavar Kasabası\'na götürdü!', { speaker: SAY.Nehir, loud: true });
  await say('Yedi canavar arkadaşa yardım ettik. Bir de kayıp ayı bulduk! Bir bulut devi saklamıştı, onu da festivale davet ettik.', { speaker: SAY.Bade });
  await say('Pencereden bakın: ay hiç bu kadar parlak olmamıştı. Demek bunu siz yaptınız!', { speaker: SAY.basak });
  await say("Sizinle çok gurur duyuyorum kızlar! Birbirinize yardım ettiniz, kimseyi yalnız bırakmadınız. Aferin size!", { speaker: SAY.funda });
  await say('En güzel kostüm ödülünü de almışsınız! Tebrikler, benim cesur vampirim ve tatlı yarasam!', { speaker: SAY.basak });
  Sound.play('win'); for (const c of Object.values(S.chars)) sparkle(c.x, c.y - 1.2, '#ffe066', 20);
  await say('Söz verdiğim gibi, Duru! Şeker çantasının yarısı senin.', { speaker: SAY.Bade });
  Sound.play('pickup'); sparkle(81.7, 4.2, '#ff8fc4', 22);
  await say('Yaşasııın! Ben de büyüyünce dev bulut olacağım!', { speaker: SAY.duru, loud: true });
  await say('Ama ben ayı saklamayacağım… Şekerleri saklayacağım! Hem de hepsini! Hi hi hi!', { speaker: SAY.duru, loud: true });
  F.finished = true;
  S.mode = 'ending'; S.ending = 1;
  const card = $('ending-card'); card.innerHTML = '';
  showOverlay('ending');
  const add = (html, cls) => { const el = document.createElement(cls === 'h2' ? 'h2' : 'p'); if (cls && cls !== 'h2') el.className = cls; el.innerHTML = html; card.appendChild(el); return el; };
  add('AY GERİ DÖNDÜ!', 'h2');
  await wait(1.4); add('Gürgür artık yalnız değil. Festivalin en büyük misafiri o oldu. ☁️');
  await wait(1.8); add('Yedi canavar arkadaş bütün gece dans etti. 🎃🎃🎃🎃🎃🎃🎃');
  await wait(1.8); add('Nehir ile Bade Korku Treni\'yle eve döndü. Funda, Başak ve Duru onları kapıda bekliyordu. 🚂');
  await wait(3.0);
  card.innerHTML = '';
  add('CANAVAR KASABASI', 'son'); add('SON', 'son');
  const mins = Math.max(1, Math.round(S.playTime / 60));
  add(`<span class="hand">Macera süresi: ${mins} dakika · Kalan kalpler: ${'❤️'.repeat(S.hearts) || '0'}</span>`);
  const row = document.createElement('div');
  const again = document.createElement('button'); again.id = 'btn-again'; again.className = 'big'; again.type = 'button'; again.textContent = 'TEKRAR OYNA';
  again.addEventListener('click', () => { Sound.init(); resetGame(); });
  const menu = document.createElement('button'); menu.className = 'big alt'; menu.type = 'button'; menu.textContent = 'ANA MENÜ';
  menu.addEventListener('click', () => { toTitle(); });
  row.appendChild(again); row.appendChild(menu); card.appendChild(row);
  again.focus({ preventScroll: true });
}

/* ---------------------------------------------------------------------
   17. THE TOWN MAP (M)
   --------------------------------------------------------------------- */
function toggleMap(on) {
  S.mapOpen = on === undefined ? !S.mapOpen : on;
  $('mapov').hidden = !S.mapOpen;
  if (S.mapOpen) drawTownMap();
}
$('mapov').addEventListener('click', () => toggleMap(false));
const MAP_LABELS = [['Evimiz', 6, 4], ['Komşular', 20, 4], ['Korku Treni', 34.5, 4], ['İstasyon', 35, 16.3], ['Meydan', 34, 31], ['Saat Kulesi', 39.5, 23.5], ['Mumya Evi', 9.5, 19.5], ['Cadı\nKulübesi', 8.5, 37], ['Balkabağı\nTarlası', 23.5, 41], ['Helikopter\nPisti', 36.5, 39.8], ['Karanlık Sokak', 57, 19.6], ['Hurdalık', 59, 30], ['Mezarlık', 57, 42.6], ["Kemik'in\nBahçesi", 44, 45.3], ['Çalgı\nSahnesi', 19.5, 16.6]];
const FRIEND_SPOT = { mimi: [9.5, 22.5], kurtul: [53.5, 16.5], frenk: [55.5, 28.5], cemile: [8.5, 39.5], hulya: [63, 40.5], selo: [65.5, 45], pitir: [20.5, 21] };
function drawTownMap() {
  const mc = $('map-canvas'), g = mc.getContext('2d'), s = 10, F = S.flags;
  g.fillStyle = '#f4e8ca'; g.fillRect(0, 0, mc.width, mc.height);
  const col = { g: '#a9c98a', p: '#d8cbb0', T: '#4f7d52', h: '#4a7a45', f: '#7a6a5a', B: '#b68d74', d: '#6a4a2a', n: '#7a6a5a', R: '#8a8070', v: '#b08a5a', j: '#b5a590', J: '#8a7a64', q: '#93b08a', Y: '#9a9a96', H: '#c8c8c0' };
  for (let y = 0; y < 50; y++) for (let x = 0; x < 72; x++) { const t = map[y][x]; g.fillStyle = col[t] || '#a9c98a'; g.fillRect(x * s, y * s, s, s); }
  if (!streetLit()) { g.fillStyle = 'rgba(30,20,50,.45)'; g.fillRect(45.6 * s, 15 * s, 24.4 * s, 7 * s); }
  // the train ride
  g.strokeStyle = '#6a4a8a'; g.setLineDash([6, 5]); g.lineWidth = 2.5; g.beginPath(); g.moveTo(34.5 * s, 7.5 * s); g.quadraticCurveTo(42 * s, 11 * s, 36 * s, 15.5 * s); g.stroke(); g.setLineDash([]);
  g.strokeStyle = 'rgba(60,40,20,.35)'; g.lineWidth = 2; g.strokeRect(1, 1, mc.width - 2, mc.height - 2);
  g.font = 'bold 15px "Trebuchet MS", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const [t, x, y] of MAP_LABELS) {
    t.split('\n').forEach((line, i, arr) => {
      const yy = (y + (i - (arr.length - 1) / 2) * 1.6) * s;
      g.lineWidth = 4; g.strokeStyle = 'rgba(255,250,235,.95)'; g.strokeText(line, x * s, yy); g.fillStyle = '#3a2a1b'; g.fillText(line, x * s, yy);
    });
  }
  g.font = '20px sans-serif';
  g.fillText('🚂', 42 * s, 11 * s);
  if (F.arrived) for (const f of FRIENDS) if (!F.lanterns[f.key]) { const [x, y] = FRIEND_SPOT[f.key]; g.fillText('❓', x * s + 14, y * s - 10); }
  if (F.skyDone && !F.homeBack) g.fillText('🚂', 38.6 * s, 16.4 * s);
  if (F.homeBack && !F.finished) g.fillText('🏠', 6 * s, 6.5 * s);
  if (F.lanternCount >= N_L && !F.towerLit) g.fillText('🎃', 39.5 * s, 26 * s);
  if (F.towerLit && !F.skyDone) g.fillText('🚁', 36.5 * s, 38 * s);
  if (!F.arrived) { if (!F.candyBag) g.fillText('❓', 15 * s, 6 * s); if (!F.tickets) g.fillText('❓', 21 * s, 6 * s); }
  const c = P(); let mx = c.x, my = c.y;
  if (c.x >= 72) { const ar = areaAt(c.x, c.y), d = DOORS.find((q) => q.name === ar); if (d) { mx = d.out[0]; my = d.out[1]; } }
  const pulse = 1 + 0.15 * Math.sin(performance.now() / 200);
  g.font = `${Math.round(26 * pulse)}px sans-serif`; g.fillText('⭐', mx * s, my * s - 6);
}

/* ---------------------------------------------------------------------
   18. CHECKPOINTS, GAME OVER, RESTART
   --------------------------------------------------------------------- */
function saveCheckpoint(quiet) {
  const a = P();
  S.checkpoint = { flags: clone(S.flags), active: S.active, x: a.x, y: a.y };
  if (!quiet) { Sound.play('checkpoint'); popup('💾 Kaydedildi', a.x, a.y - 2, '#bff0c4', 20, 1.8); setTimeout(() => { if (S.mode === 'play' && !S.dialog) showToast('✨ Kontrol noktası: oyun kaydedildi', 2.2); }, 50); }
}
function clearScenes() {
  S.epoch++; waiters.length = 0; tweens.length = 0; S.locked = 0;
  S.dialog = null; renderDialog(); hideToast();
  S.particles = []; S.popups = []; S.shake = 0; S.cool = {}; S.fade = 0; S.camTarget = null;
  S.drakPos = null; S.leaving = null; S.gift = null; S.dance = null; S.awaitDir = null; S.lift = 0; S.hang = null; S.spin = null;
  S.ride = null; S.sky = null; S.beam = 0; S.heliIn = null; S.howl = 0; S.cemileFly = 0; S.smoke = null; S.batPuff = null; S.ring = null; S.rings = [];
  S.ending = 0; S.talkQ = []; S.frenkFixed = false;
  for (const e of ENTS) if (e.type === 'heavy') { e.dx = 0; e.dy = 0; }
  S.overlayInput = false; S.overlayClose = null;
  if (S.mapOpen) toggleMap(false);
  resetHazards();
  ['left', 'right', 'up', 'down', 'act', 'swap', 'map'].forEach(release);
}
function snapCamera() { const c = P(); S.cam.x = c.x * TS; S.cam.y = (c.y - 0.6) * TS; }
function placeStart(x, y, active) {
  S.active = active || 'Nehir';
  S.chars = { Nehir: makeChar('Nehir', x, y), Bade: makeChar('Bade', x, y) };
  placeBoth(x, y);
}
function loadCheckpoint() {
  const c = S.checkpoint;
  clearScenes();
  S.flags = clone(c.flags); S.hearts = 3;
  placeStart(c.x, c.y, c.active);
  S.mode = 'play'; S.area = ''; showOverlay(null); updateHUD();
}
function resetGame() {
  clearScenes();
  S.flags = freshFlags(); S.hearts = 3; S.hints = {}; S.playTime = 0; S.area = '';
  placeStart(81.5, 6.4, OWNER === 'Bade' ? 'Bade' : 'Nehir');
  saveCheckpoint(true);
  S.mode = 'intro'; showOverlay('intro'); updateHUD(); drawPortraits();
}
function startAfterIntro() { if (S.mode !== 'intro') return; S.mode = 'play'; showOverlay(null); opening(); }
function drawPortraits() {
  for (const who of ['Nehir', 'Bade']) {
    const pc = $('pt-' + who.toLowerCase()); if (!pc) continue;
    const g = pc.getContext('2d'), keep = ctx;
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, pc.width, pc.height);
    g.fillStyle = who === 'Nehir' ? '#e6dcf7' : '#f7dce2'; g.beginPath(); g.arc(pc.width / 2, pc.height / 2, pc.width / 2 - 4, 0, 7); g.fill();
    const sc = who === 'Nehir' ? 2.25 : 1.85;
    g.setTransform(sc, 0, 0, sc, pc.width / 2, pc.height - 12);
    ctx = g;
    try { drawKid({ who, dir: 'down', moving: false, walkT: 0, hurtT: 0 }, 0, 0, true); } finally { ctx = keep; }
  }
}
function toTitle() {
  clearScenes();
  S.flags = freshFlags(); S.hearts = 3; S.mode = 'title';
  placeStart(81.5, 6.4, OWNER === 'Bade' ? 'Bade' : 'Nehir');
  updateHUD(); showOverlay('title');
}
function gameOver() {
  S.mode = 'gameover'; S.dialog = null; renderDialog(); hideToast();
  showOverlay('over'); $('btn-checkpoint').focus({ preventScroll: true });
}
function showOverlay(id) { ['title', 'over', 'ending', 'intro'].forEach((o) => { $(o).hidden = o !== id; }); }
$('btn-intro').addEventListener('click', (e) => { e.currentTarget.blur(); Sound.init(); startAfterIntro(); });
$('owner-line').textContent = OWNER === 'Bade' ? "Bu oyun Bade'nin 🧛" : "Bu oyun Nehir'in 🦇";
$('btn-start').addEventListener('click', (e) => { e.currentTarget.blur(); Sound.init(); resetGame(); });
$('btn-howto').addEventListener('click', (e) => { const h = $('howto'); h.hidden = !h.hidden; e.currentTarget.textContent = h.hidden ? 'NASIL OYNANIR?' : 'KAPAT'; });
$('btn-checkpoint').addEventListener('click', (e) => { e.currentTarget.blur(); loadCheckpoint(); });
$('btn-over-restart').addEventListener('click', (e) => { e.currentTarget.blur(); resetGame(); });
let restartArmed = 0;
$('btn-restart').addEventListener('click', (e) => {
  const b = e.currentTarget; b.blur();
  if (S.mode === 'title') return;
  if (performance.now() - restartArmed < 3000) { restartArmed = 0; b.textContent = '↺ BAŞTAN BAŞLA'; resetGame(); return; }
  restartArmed = performance.now(); b.textContent = 'Emin misin? Bir daha bas';
  setTimeout(() => { if (performance.now() - restartArmed >= 2900) b.textContent = '↺ BAŞTAN BAŞLA'; }, 3000);
});
$('btn-sound').addEventListener('click', (e) => {
  const b = e.currentTarget; b.blur(); Sound.init();
  Sound.muted = !Sound.muted; b.textContent = Sound.muted ? '🔇 SES KAPALI' : '🔊 SES';
});

/* ---------------------------------------------------------------------
   19. THE MAIN UPDATE
   --------------------------------------------------------------------- */
function stopWalking() { for (const c of Object.values(S.chars)) c.moving = false; }
function checkAreaTitle() {
  const c = P(), a = areaAt(c.x, c.y);
  if (a && a !== S.area) { S.area = a; if (S.time - S.areaShownAt > 1.2) { S.areaT = 2.6; S.areaShownAt = S.time; S.areaName = a; } onEnterArea(a); }
}
function queueTalk(key, fn) { if (S.hints[key]) return; S.hints[key] = true; S.talkQ.push(fn); }
function onEnterArea(a) {
  const F = S.flags, me = P().who;
  if (a === 'Evimiz' && F.homeBack && !F.finished) queueTalk('homecoming', homeEnding);
  if (a === 'Karanlık Sokak' && !streetLit()) queueTalk('talkDark', async () => {
    await say('Burası zifiri karanlık! Hiçbir şey göremiyorum.', { speaker: SAY.Nehir });
    await say('Ben vampirim, karanlıkta görürüm! Sönük sokak lambaları var… Bir de sokağın sonunda biri saklanıyor!', { speaker: SAY.Bade });
    if (S.active === 'Nehir') await say("Q tuşuna bas, Bade'ye geç. Karanlıkta ne varsa Bade görür!");
    else await say('Sönük lambaların yanına gidip Boşluk tuşuna basalım. Lambaları yakalım!', { speaker: SAY.Bade });
  });
  if (a === 'Hurdalık') queueTalk('talkSlime', async () => {
    Sound.play('slime');
    await say('Şu yeşil şeyler de ne? Bize doğru kayıyorlar!', { speaker: SAY.Bade });
    await say('Balçık! Dokunursak yapış yapış oluruz.', { speaker: SAY.Nehir });
    if (F.candyBag) await say('Şeker çantamız var! Balçıklar yaklaşınca Boşluk tuşuna basıp şeker atalım. Şekerin peşinden giderler!', { speaker: SAY.Bade });
  });
  if (a === 'Balkabağı Tarlası') queueTalk('talkPumpkins', async () => {
    Sound.play('roll');
    await say('Balkabakları yuvarlanıyor! Çarparlarsa bizi devirirler.', { speaker: SAY.Nehir });
    await say('Sıralarını izleyelim. Kabak önümüzden geçince hızlıca karşıya koşalım!', { speaker: SAY.Bade });
  });
  if (a === 'Mezarlık') queueTalk('talkBats', async () => {
    Sound.play('bats');
    await say('Dikkat! Bir yarasa sürüsü! Benim arkadaşlarım ama vampirleri hiç sevmezler.', { speaker: SAY.Nehir });
    await say('Beni çimdiklerler mi? Ay!', { speaker: SAY.Bade });
    await say("Yarasaların yanından geçerken Q ile Nehir'e geç. Yarasalar Nehir'e hiç dokunmaz!");
  });
  const inside = P().x >= 72;
  const AREA_TIPS = {
    'Mahalle': "Komşuların kapısının önüne git ve Boşluk'a bas: “Şeker mi, şaka mı?”\nEn sağda da Korku Treni var!",
    'Meydan': "Canavar Kasabası'nın meydanı! Kont Drakoş burada.\nKabak Kafa Bora'nın kakaosu kalplerini doldurur.",
    'Mumya Evi': 'Mumya Evi! Mumya Mimi\'yle konuş.\nRafta üç kavanoz var: hangisinde sargı var?',
    'Cadı Kulübesi': 'Cadı Kulübesi! Cadı Cemile ile konuş.\nDuvarda tarif kitabı, ortada fokur fokur bir kazan var.',
    'Mahzen': 'Mahzen! Hayalet Hülya burada.\nTavandaki kirişe bir şey takılmış…',
    "Kemik'in Bahçesi": "Kemik'in bahçesi! Kemik uyuyor, sessiz ol.\nToprağın altında gizli bir şey var mı?",
    'Çalgı Sahnesi': 'Çalgı Sahnesi! Kara Kedi Pıtırcık burada.\nSahnenin altında minik bir delik, yanında da kocaman bir ağaç var.',
    'Helikopter Pisti': F.towerLit ? 'Helikopter pisti! Pilot Pırpır seni bekliyor.' : 'Helikopter pisti. Şimdilik bomboş…',
  };
  const key = a;
  if (AREA_TIPS[key] && once('area_' + key) && (inside || a !== 'Mahalle' || F.introDone)) setTimeout(() => { if (!S.dialog) showToast(AREA_TIPS[key], 5.5); }, 400);
  void me;
}
// Bade cannot find hidden things; Nehir cannot see in the dark. They tell each other.
function checkHiddenNearby() {
  const c = P();
  for (const e of ENTS) {
    if (!entActive(e)) continue;
    const near = Math.hypot(e.x - c.x, e.y - (c.y - 0.3)) < 2.6;
    if (!near) continue;
    if (e.hidden && c.who === 'Bade') {
      if (S.hints['hid_' + e.id] || !cooldown('hidTalk', 40)) return;
      queueTalk('hid_' + e.id, async () => {
        await say('Dur Bade! Bi-bip… Ses dalgalarım bir şey duydu. Burada gizli bir şey var!', { speaker: SAY.Nehir });
        await say('Ben bir şey göremiyorum. Senin ses dalgaların benim gözlerimden iyi!', { speaker: SAY.Bade });
        await say("Q tuşuna bas, Nehir'e geç. Nehir gizli şeyleri bulur.");
      });
      return;
    }
    if (darkHidden(e) && c.who === 'Nehir') {
      if (S.hints.darkNear || !cooldown('hidTalk', 40)) return;
      queueTalk('darkNear', async () => {
        await say('Nehir, şurada karanlıkta bir şey var. Ben görüyorum ama sen göremezsin!', { speaker: SAY.Bade });
        await say("Q tuşuna bas, Bade'ye geç. Vampirler karanlıkta görür.");
      });
      return;
    }
  }
}
function updateSonar(dt) {
  const c = P();
  if (!S.rings) S.rings = [];
  for (let i = S.rings.length - 1; i >= 0; i--) { S.rings[i].t += dt; if (S.rings[i].t > 1.4) S.rings.splice(i, 1); }
  if (c.who !== 'Nehir' || S.sky || S.ride) return;
  S.sonarT += dt;
  if (S.sonarT < 2.8) return;
  S.sonarT = 0;
  const found = ENTS.some((e) => e.hidden && entActive(e) && Math.hypot(e.x - c.x, e.y - c.y) < 4.5);
  S.rings.push({ x: c.x, y: c.y - 0.8, t: 0, found });
  if (found) Sound.play('sonar');
}
function updateEffects(dt) {
  for (let i = S.particles.length - 1; i >= 0; i--) {
    const q = S.particles[i];
    q.vy += q.g * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt; q.life -= dt;
    if (q.life <= 0) S.particles.splice(i, 1);
  }
  for (let i = S.popups.length - 1; i >= 0; i--) { S.popups[i].life -= dt; if (S.popups[i].life <= 0) S.popups.splice(i, 1); }
  S.shake = Math.max(0, S.shake - dt * 1.6);
  if (S.toastT > 0) { S.toastT -= dt; if (S.toastT <= 0) hideToast(); }
  if (S.howl > 0) S.howl -= dt;
  if (S.ride) S.ride.t += dt;
  if (S.flags.skyDone) S.festT = (S.festT || 0) + dt;
  if (S.ring) { S.ring.t += dt; if (S.ring.t > 1) S.ring = null; }
  if (S.batPuff) { S.batPuff.t += dt; if (S.batPuff.t > 1.6) S.batPuff = null; }
  if (S.smoke) { S.smoke.t += dt; if (S.smoke.t > 1.5) S.smoke = null; }
  if (S.flags.skyDone && Math.random() < 0.35) { const c = P(); particle({ x: c.x + (Math.random() - 0.5) * 9, y: c.y - 5, vx: (Math.random() - 0.5), vy: 1.4, g: 0.4, life: 3, max: 3, size: 4, color: pick(['#ffb347', '#d7c4ff', '#7fe0a0', '#fff3c4']), kind: 'conf', vr: 4 }); }
}
function updateCamera(dt, snap) {
  const c = P();
  const tx = S.camTarget ? S.camTarget.x * TS : c.x * TS, ty = S.camTarget ? S.camTarget.y * TS : (c.y - 0.6) * TS;
  const k = snap ? 1 : Math.min(1, dt * (S.camTarget ? 4 : 7));
  S.cam.x += (tx - S.cam.x) * k; S.cam.y += (ty - S.cam.y) * k;
}
function step(dt) {
  S.time += dt;
  for (let i = waiters.length - 1; i >= 0; i--) if (S.time >= waiters[i].t) { const w = waiters[i]; waiters.splice(i, 1); w.r(); }
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i]; tw.t += dt;
    const k = Math.min(1, tw.t / tw.dur); tw.fn(k);
    if (k >= 1) { tweens.splice(i, 1); tw.res(); }
  }
  updateEffects(dt);
  if (S.mode === 'play' && !S.mapOpen && !S.overlayInput) {
    S.playTime += dt;
    for (const c of Object.values(S.chars)) if (c.hurtT > 0) c.hurtT -= dt;
    if (S.awaitDir && !S.dialog) {
      for (const d of ['up', 'down', 'left', 'right']) if (input.pressed[d]) { const r = S.awaitDir; S.awaitDir = null; r(d); break; }
    } else if (S.dialog) handleDialogInput();
    else if (!S.locked) {
      if (input.pressed.map) toggleMap(true);
      else if (input.pressed.swap) swapCousin();
      updateActive(dt);
      updateFollower(dt);
      if (S.talkQ.length && !S.locked && !S.dialog) { const fn = S.talkQ.shift(); stopWalking(); scene(fn); }
      else checkHiddenNearby();
      if (!S.locked && !checkDoors()) {
        updateHazards(dt);
        if (!S.locked && !S.dialog && S.mode === 'play' && input.pressed.act) {
          const e = nearestInteractable(), ca = contextAction();
          if (e) interact(e);
          else if (ca) ca.fn();
          else if (cooldown('nothing', 2.5)) showToast('Burada incelenecek bir şey yok.', 1.8);
        }
      }
    } else { P().moving = false; other().moving = false; }
    updateSonar(dt);
    checkAreaTitle();
    if (S.areaT > 0) S.areaT -= dt;
    S.hintTimer = (S.hintTimer || 0) + dt;
    if (S.hintTimer > 150 && !S.dialog && !S.locked) { S.hintTimer = 0; showToast('💡 İpucu: ' + nextHint() + '\nM tuşu: harita · Q tuşu: kuzen değiştir', 7); }
  }
  updateCamera(dt);
  input.pressed = {};
}
