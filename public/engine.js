/* =====================================================================
   CANAVAR KASABASI  (Monster Town) — a Halloween peek-hole adventure.
   Bade is a vampire, Nehir is a bat. The player switches between them.
     Bade (vampir):  sees in the dark, tall (reaches high), strong (pushes)
     Nehir (yarasa): sonar finds hidden things, small (fits through gaps),
                     hangs upside down from ceiling beams
     Both:           the shoulder lift for the very highest place
   Code comments are English; everything the player sees is Turkish.
   ===================================================================== */
(() => {
'use strict';
const OWNER = window.MULTIPLAYER_NAME || 'Nehir';                       // 'Nehir' or 'Bade' (set at build time)

/* ---------------------------------------------------------------------
   1. SETTINGS
   --------------------------------------------------------------------- */
const TS = 48;
const VW = 960, VH = 600;
const HOLE = { cx: VW / 2, cy: 300, rx: 6.0 * TS, ry: 4.1 * TS };
const MAP_W = 140, MAP_H = 50;
const SPEED = 3.7;
const FOOT_W = 0.56, FOOT_H = 0.34;

/* ---------------------------------------------------------------------
   2. THE MAP
   'g' grass 'p' cobbles 'T' tree 'h' hedge 'f' fence 'B' building 'd' door
   'n' gap (only Nehir fits) 'R' rails 'v' soil 'j' junkyard ground
   'J' junk heap 'q' graveyard grass 'Y' gravestone 'H' helipad
   'Q' wooden stage 'm' crawl hole (only Nehir fits)
   'F' floor 'X' wall 'K' furniture 'x' nothing 'e' way out
   --------------------------------------------------------------------- */
const map = [];
for (let r = 0; r < MAP_H; r++) map.push(new Array(MAP_W).fill('g'));
const set = (x, y, ch) => { if (x >= 0 && y >= 0 && x < MAP_W && y < MAP_H) map[y][x] = ch; };
const rect = (x1, y1, x2, y2, ch) => { for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) set(x, y, ch); };
const frame = (x1, y1, x2, y2, ch) => { for (let x = x1; x <= x2; x++) { set(x, y1, ch); set(x, y2, ch); } for (let y = y1; y <= y2; y++) { set(x1, y, ch); set(x2, y, ch); } };
rect(72, 0, MAP_W - 1, MAP_H - 1, 'x');
frame(0, 0, 71, MAP_H - 1, 'T');
// --- the neighbourhood (top) and the dark forest beside it
rect(41, 1, 70, 11, 'T');
rect(1, 12, 70, 13, 'T');
rect(1, 8, 40, 9, 'p');                                         // our street
rect(3, 2, 9, 6, 'B'); set(6, 6, 'd'); set(6, 7, 'p');          // home
for (const x0 of [12, 18, 24]) { rect(x0, 2, x0 + 4, 5, 'B'); set(x0 + 2, 6, 'p'); set(x0 + 2, 7, 'p'); }   // three neighbours
set(30, 6, 'h'); set(30, 7, 'h'); set(23, 6, 'h'); set(17, 6, 'h'); set(11, 6, 'h');
rect(31, 2, 38, 6, 'B'); rect(33, 7, 36, 7, 'p');               // the ghost train station
for (const x of [2, 10, 16, 22, 28, 39]) set(x, 11, 'T');
// --- Monster Town
rect(1, 14, 70, 14, 'R');                                       // railway
rect(26, 15, 44, 17, 'p');                                      // platform
rect(34, 18, 35, 25, 'p');                                      // station road
rect(38, 21, 41, 25, 'B');                                      // clock tower
rect(26, 26, 44, 34, 'p');                                      // the square
rect(9, 29, 25, 30, 'p'); rect(9, 23, 10, 28, 'p');             // west road
rect(6, 17, 13, 22, 'B'); set(9, 22, 'd');                      // Mumya Evi
rect(13, 31, 14, 41, 'p'); rect(7, 40, 14, 41, 'p');            // road to the witch
rect(5, 35, 12, 39, 'B'); set(8, 39, 'd');                      // Cadı Kulübesi
// pumpkin field (hedged, one way in)
rect(17, 36, 30, 46, 'v'); frame(16, 35, 31, 47, 'h'); set(24, 35, 'p'); set(25, 35, 'p'); rect(24, 34, 25, 34, 'p');
// helipad
rect(33, 37, 40, 42, 'H'); rect(36, 35, 37, 36, 'p');
// dark street
rect(47, 15, 52, 17, 'B'); rect(54, 15, 59, 17, 'B'); rect(61, 15, 68, 17, 'B');
rect(45, 18, 69, 21, 'p'); rect(46, 22, 70, 23, 'T');
set(53, 15, 'p'); set(53, 16, 'p'); set(53, 17, 'm');           // a narrow alley: only a bat fits
// junkyard
frame(49, 25, 69, 34, 'f'); rect(50, 26, 68, 33, 'j'); set(49, 29, 'p'); set(49, 30, 'p'); rect(45, 29, 48, 30, 'p');
for (const [x, y] of [[53, 27], [54, 27], [52, 32], [58, 26], [59, 26], [67, 32], [61, 29], [50, 26], [51, 26], [50, 33], [51, 33], [56, 33], [62, 26], [63, 26], [68, 26], [57, 29], [66, 33]]) set(x, y, 'J');
// Kemik's garden + the graveyard
frame(41, 42, 47, 48, 'f'); rect(42, 43, 46, 47, 'v');
frame(47, 36, 69, 48, 'f'); rect(48, 37, 68, 47, 'q');
set(47, 38, 'p'); set(47, 39, 'p'); set(47, 45, 'n');
rect(42, 35, 46, 36, 'p'); rect(45, 37, 46, 39, 'p');
rect(48, 38, 59, 39, 'p'); rect(58, 40, 59, 42, 'p'); rect(60, 41, 64, 42, 'p');
rect(60, 37, 66, 40, 'B'); set(63, 40, 'd');                    // Mahzen (the crypt)
for (const [x, y] of [[52, 37], [54, 37], [56, 37], [50, 41], [52, 41], [54, 41], [56, 41], [61, 44], [63, 44], [65, 44], [67, 44], [56, 46], [58, 46], [60, 46], [62, 46], [64, 46], [66, 46], [67, 39], [67, 41]]) set(x, y, 'Y');
// scattered spooky trees
const KEEP_CLEAR = [[14, 15, 26, 23], [24, 14, 46, 19], [25, 19, 46, 35], [4, 15, 15, 31], [3, 30, 16, 43], [15, 33, 32, 48], [32, 34, 41, 43], [44, 14, 70, 24], [44, 24, 70, 35], [40, 35, 70, 49], [8, 22, 26, 31]];
for (let y = 15; y < MAP_H - 1; y++) for (let x = 1; x < 71; x++) {
  if (map[y][x] !== 'g') continue;
  if (KEEP_CLEAR.some(([a, b, c, d]) => x >= a && x <= c && y >= b && y <= d)) continue;
  const v = ((x * 73856093) ^ (y * 19349663)) >>> 0;
  if (v % 6 === 0) set(x, y, 'T');
}
// the music stage (Kara Kedi Pıtırcık) with a crawl hole under it, and the bell tree
rect(17, 18, 21, 19, 'Q'); set(19, 19, 'm'); set(19, 18, 'm'); set(24, 18, 'T');
// --- interiors
function room(x1, y1, x2, y2) { rect(x1, y1, x2, y2, 'X'); rect(x1 + 1, y1 + 1, x2 - 1, y2 - 1, 'F'); }
room(76, 2, 86, 8); set(81, 8, 'e');                             // Evimiz
room(76, 11, 86, 17); set(81, 17, 'e');                          // Mumya Evi
room(76, 20, 87, 26); set(81, 26, 'e');                          // Cadı Kulübesi
room(90, 2, 102, 9); set(96, 9, 'e');                            // Mahzen
rect(77, 3, 79, 3, 'K'); rect(83, 6, 84, 6, 'K');               // home: kitchen, sofa
rect(77, 12, 85, 12, 'K'); set(77, 15, 'K'); set(77, 16, 'K');  // mummy: jar shelf, sarcophagus
rect(81, 22, 82, 22, 'K'); rect(83, 21, 86, 21, 'K');           // witch: cauldron, potion shelf
set(91, 3, 'K'); set(101, 3, 'K'); rect(91, 7, 92, 7, 'K');     // crypt: candle stands, old chest
const DOORS = [
  { name: 'Evimiz', door: [6, 6], out: [6.5, 7.6], exit: [81, 8], inside: [81.5, 7.2] },
  { name: 'Mumya Evi', door: [9, 22], out: [9.5, 23.6], exit: [81, 17], inside: [81.5, 16.2] },
  { name: 'Cadı Kulübesi', door: [8, 39], out: [8.5, 40.6], exit: [81, 26], inside: [81.5, 25.2] },
  { name: 'Mahzen', door: [63, 40], out: [63.5, 41.7], exit: [96, 9], inside: [96.5, 8.2] },
];

/* ---------------------------------------------------------------------
   3. PEOPLE, MONSTERS AND THINGS
   hidden = only Nehir's sonar finds it   dark = only Bade sees it (in the dark)
   high   = only Bade reaches it          hang = only Nehir (hanging upside down)
   --------------------------------------------------------------------- */
const FRIENDS = [
  { key: 'mimi', name: 'Mumya Mimi', icon: '🧻' },
  { key: 'kurtul', name: 'Kurt Adam Kurtul', icon: '🐺' },
  { key: 'frenk', name: 'Frenk', icon: '🔩' },
  { key: 'cemile', name: 'Cadı Cemile', icon: '🧹' },
  { key: 'hulya', name: 'Hayalet Hülya', icon: '🎵' },
  { key: 'selo', name: 'Hayalet Köpek Selo', icon: '🦴' },
  { key: 'pitir', name: 'Kara Kedi Pıtırcık', icon: '🔔' },
];
const ENTS = [
  // home
  { id: 'funda', type: 'mom', who: 'Funda', x: 78.3, y: 4.7, r: 1.3 },
  { id: 'basak', type: 'mom', who: 'Başak', x: 80.2, y: 4.7, r: 1.3 },
  { id: 'duru', type: 'duru', x: 81.7, y: 5.0, r: 1.1 },
  { id: 'mirror', type: 'mirror', x: 84.5, y: 3.55 },
  // the neighbourhood
  { id: 'knock1', type: 'knock', n: 1, x: 14.5, y: 6.75, r: 1.3 },
  { id: 'knock2', type: 'knock', n: 2, x: 20.5, y: 6.75, r: 1.3 },
  { id: 'knock3', type: 'knock', n: 3, x: 26.5, y: 6.75, r: 1.3 },
  { id: 'bowl3', type: 'bowl3', x: 24.9, y: 6.2, high: true, r: 1.3 },
  { id: 'note3', type: 'note3', x: 29.5, y: 7.2, hidden: true, r: 1.3 },
  { id: 'trainGate', type: 'trainGate', x: 34.5, y: 7.35, r: 1.5 },
  { id: 'kond', type: 'kond', x: 37.4, y: 7.4, r: 1.4 },
  { id: 'kond2', type: 'kond', x: 38.6, y: 16.7, r: 1.5 },
  // station + square
  { id: 'stationSign', type: 'stationSign', x: 30.5, y: 15.5, r: 1.3 },
  { id: 'drakos', type: 'drakos', x: 33.5, y: 29.4, r: 1.6 },
  { id: 'bora', type: 'bora', x: 29.6, y: 27.6, r: 1.6 },
  { id: 'bigLantern', type: 'bigLantern', x: 39.5, y: 26.5, r: 1.8 },
  { id: 'heli', type: 'heli', x: 36.6, y: 39.8, r: 2.2 },
  // Mumya Evi
  { id: 'jar1', type: 'jar', n: 0, x: 78.5, y: 12.6, high: true, r: 1.3 },
  { id: 'jar2', type: 'jar', n: 1, x: 81.5, y: 12.6, high: true, r: 1.3 },
  { id: 'jar3', type: 'jar', n: 2, x: 84.5, y: 12.6, high: true, r: 1.3 },
  { id: 'mimi', type: 'mimi', x: 84.2, y: 15.3, r: 1.6 },
  // Karanlık Sokak
  { id: 'lamp1', type: 'lamp', n: 1, x: 50.5, y: 18.25, dark: true, r: 1.4 },
  { id: 'lamp2', type: 'lamp', n: 2, x: 57.5, y: 21.4, dark: true, r: 1.4 },
  { id: 'lamp3', type: 'lamp', n: 3, x: 64.5, y: 18.25, dark: true, r: 1.4 },
  { id: 'kurtul', type: 'kurtul', x: 53.5, y: 16.8, dark: true, r: 2.6 },
  // Hurdalık
  { id: 'frenk', type: 'frenk', x: 55.5, y: 29.6, r: 1.6 },
  { id: 'junk', type: 'heavy', x: 64.5, y: 31.5, r: 1.5, tiles: [[63, 31], [64, 31], [65, 31]], to: [67.0, 28.7], name: 'Bu eski kırmızı araba' },
  { id: 'bolt', type: 'bolt', x: 64.5, y: 31.4, hidden: true, r: 1.3 },
  { id: 'junkInfo', type: 'info', x: 47.6, y: 28.6, r: 1.2, text: 'HURDALIK\n“Dikkat! Balçıklar şekere bayılır.\nYaklaşırlarsa bir şeker atın.”' },
  // Cadı Kulübesi
  { id: 'recipe', type: 'recipe', x: 78.4, y: 21.55 },
  { id: 'cauldron', type: 'cauldron', x: 81.9, y: 23.0, r: 1.5 },
  { id: 'cemile', type: 'cemile', x: 85.2, y: 23.9, r: 1.6 },
  { id: 'moonDrop', type: 'moonDrop', x: 84.5, y: 21.55, high: true, r: 1.3 },
  // Balkabağı Tarlası
  { id: 'scarecrow', type: 'scarecrow', x: 20.5, y: 37.4, r: 1.4 },
  { id: 'straw', type: 'straw', x: 28.5, y: 45.4, hidden: true, r: 1.3 },
  // Mezarlık
  { id: 'graveInfo', type: 'info', x: 46.4, y: 37.4, r: 1.2, text: 'MEZARLIK\n“Dikkat! Yarasa sürüsü!\nYarasalar yarasaları sever ama vampirleri hiç sevmez.”' },
  { id: 'stone', type: 'heavy', x: 63.5, y: 41.5, r: 1.4, tiles: [[63, 41]], to: [65.5, 42.8], name: 'Bu kocaman taş' },
  { id: 'selo', type: 'selo', x: 65.5, y: 45.4, dark: true, r: 1.7 },
  { id: 'prints', type: 'prints', x: 50.2, y: 45.5, hidden: true, r: 1.6 },
  { id: 'kemik', type: 'kemik', x: 45.0, y: 43.8, r: 1.4 },
  { id: 'dig', type: 'dig', x: 43.5, y: 45.7, hidden: true, r: 1.3 },
  // Çalgı Sahnesi
  { id: 'pitir', type: 'pitir', x: 20.5, y: 21.0, r: 1.6 },
  { id: 'bells', type: 'bells', x: 24.5, y: 19.6, high: true, r: 1.4 },
  { id: 'notes', type: 'notes', x: 19.5, y: 18.75, r: 1.0 },
  // Mahzen
  { id: 'hulya', type: 'hulya', x: 93.3, y: 5.6, r: 1.7 },
  { id: 'musicBox', type: 'musicBox', x: 99.5, y: 4.6, hang: true, r: 1.5 },
];
const HEAVY_AT = {};
for (const e of ENTS) if (e.type === 'heavy') for (const [c, r] of e.tiles) HEAVY_AT[c * 100 + r] = e.id;
// where each friend waits at the square once they gave their lantern
const N_L = FRIENDS.length;                                       // how many lanterns the tower needs
const FRIEND_SQUARE = { mimi: [28.6, 31.6], kurtul: [31.2, 32.8], frenk: [43.0, 31.4], cemile: [40.6, 32.9], hulya: [28.4, 29.4], selo: [43.0, 28.9], pitir: [35.6, 33.3] };
const PUMPKIN_LANES = [{ y: 39.65, dir: 1, sp: 3.0, ph: 0 }, { y: 43.65, dir: -1, sp: 3.5, ph: 0.4 }];
const BAT_PATH = [[49.6, 40.3], [59.4, 40.3], [59.4, 44.8], [49.6, 44.8]];
const SLIME_HOMES = [[53.5, 30.4], [60.0, 32.6], [66.0, 30.2]];

/* ---------------------------------------------------------------------
   4. GAME STATE
   --------------------------------------------------------------------- */
function freshFlags() {
  return {
    introDone: false, candyBag: false, tickets: false, ticketsGiven: false, bowl3: false, note3: false, knocked: {},
    arrived: false,
    jarRight: Math.floor(Math.random() * 3), jarPinged: {}, jarsTried: {}, bandage: false, mimiMet: false,
    lamps: {}, kurtulMet: false,
    bolt: false, frenkMet: false,
    straw: false, potion: false, moonDrop: false, cemileMet: false,
    bells: false, notes: false, pitirMet: false, homeBack: false,
    musicBox: false, hulyaMet: false,
    printsSeen: false, bone: false, seloMet: false,
    lanterns: {}, lanternCount: 0,
    towerLit: false, skyDone: false, finished: false,
    moved: {}, hints: {},
  };
}
function makeChar(who, x, y) {
  return { who, x, y, dir: 'down', moving: false, walkT: 0, hurtT: 0, trail: [], lift: 0 };
}
const S = {
  mode: 'title', hearts: 3, flags: freshFlags(),
  chars: { Nehir: makeChar('Nehir', 80.5, 6.6), Bade: makeChar('Bade', 82.5, 6.6) },
  active: 'Nehir',
  checkpoint: null, dialog: null, locked: 0, epoch: 0,
  time: 0, playTime: 0, cam: { x: 0, y: 0 }, camTarget: null, shake: 0, fade: 0, fadeCol: '10,6,20',
  particles: [], popups: [], toastT: 0, hints: {}, cool: {},
  area: '', areaT: 0, areaShownAt: -10, areaName: '',
  pumpkins: [], slimes: [], slimeBusy: 0, candyAt: null, bats: null,
  sky: null, overlayInput: false, manual: false, talkQ: [], sonarT: 0,
};
const clone = (o) => JSON.parse(JSON.stringify(o));
const P = () => S.chars[S.active];
const other = () => S.chars[S.active === 'Nehir' ? 'Bade' : 'Nehir'];

/* ---------------------------------------------------------------------
   5. TILES + COLLISION
   --------------------------------------------------------------------- */
function tileAt(c, r) { if (c < 0 || r < 0 || c >= MAP_W || r >= MAP_H) return 'x'; return map[r][c]; }
const SOLID = new Set(['T', 'h', 'f', 'B', 'X', 'x', 'K', 'R', 'J', 'Y', 'Q']);
function solidFor(who, c, r) {
  const t = tileAt(c, r), F = S.flags;
  if (SOLID.has(t)) return true;
  if (t === 'n' || t === 'm') return who !== 'Nehir';
  const hv = HEAVY_AT[c * 100 + r]; if (hv && !(F.moved && F.moved[hv])) return true;
  return false;
}
function blockedAt(who, x, y) {
  const x0 = Math.floor(x - FOOT_W / 2), x1 = Math.floor(x + FOOT_W / 2 - 1e-4);
  const y0 = Math.floor(y - FOOT_H), y1 = Math.floor(y - 1e-4);
  for (let r = y0; r <= y1; r++) for (let c = x0; c <= x1; c++) if (solidFor(who, c, r)) return true;
  return false;
}
function hash(x, y) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function areaAt(x, y) {
  if (x >= 76 && x <= 87 && y <= 8.5) return 'Evimiz';
  if (x >= 76 && x <= 87 && y >= 11 && y <= 17.5) return 'Mumya Evi';
  if (x >= 76 && x <= 88 && y >= 20 && y <= 26.5) return 'Cadı Kulübesi';
  if (x >= 90 && x <= 103 && y <= 9.5) return 'Mahzen';
  if (x >= 72) return '';
  if (y < 12) return 'Mahalle';
  if (x >= 45.6 && y >= 15 && y < 22) return 'Karanlık Sokak';
  if (x >= 49 && x < 70 && y >= 25 && y < 35) return 'Hurdalık';
  if (x >= 47.5 && y >= 36) return 'Mezarlık';
  if (x >= 41 && x < 47.5 && y >= 42) return "Kemik'in Bahçesi";
  if (x >= 16 && x < 32 && y >= 35) return 'Balkabağı Tarlası';
  if (x >= 33 && x < 41 && y >= 37 && y < 43) return 'Helikopter Pisti';
  if (x >= 14 && x < 26 && y >= 15 && y < 23.5) return 'Çalgı Sahnesi';
  if (y < 18 && x >= 24 && x < 46) return 'İstasyon';
  if (x >= 25 && x < 46 && y >= 18 && y < 35) return 'Meydan';
  return 'Canavar Kasabası';
}
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
  const kk = '<span><kbd>M</kbd> Harita</span><span><kbd>Boşluk</kbd> İncele</span><span>📻 Telsiz açık</span>';
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
    if (c.who === 'Bade') { Sound.play('bats'); hurt("Yarasa sürüsü vampiri çimdikledi! Ay!\nYarasalardan uzak dur. Nehir'i ise hiç ısırmazlar.", B.x, B.y); }
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

/* ---------------------------------------------------------------------
   15. THE STORY
   --------------------------------------------------------------------- */
function nextHint() {
  const F = S.flags;
  if (!F.arrived) {
    if (!F.candyBag) return "Ayşe Teyze'nin kapısını çal. Evimizin sağındaki ilk ev!";
    if (!F.tickets) return 'Hasan Amca\'nın kapısını çal. Bilmecesini bilirsen sana bir hazine verecek!';
    return "Sokağın sonundaki Korku Treni'ne git. Kondüktöre biletleri göster!";
  }
  if (F.homeBack) return 'Eve git! Funda, Başak ve Duru sizi bekliyor.';
  if (F.skyDone) return "İstasyondaki Kondüktör Takırtı'ya git. Eve dönme vakti!";
  const L = F.lanterns;
  if (!L.mimi) return F.bandage ? "Sargıyı Mumya Mimi'ye ver!" : "Mumya Evi, kasabanın sol üstünde. Kavanozları önce Nehir dinlesin, doğru olanı Bade alsın!";
  if (!L.kurtul) return !streetLit() ? 'Karanlık Sokak, kasabanın sağ üstünde. Bade karanlıkta görür: üç lambayı yak!' : "Kurtul evlerin arasındaki dar aralıkta saklanıyor. Oraya sadece Nehir sığar!";
  if (!L.frenk) return !F.moved.junk ? "Hurdalık, meydanın sağında. Bade eski kırmızı arabayı itsin!" : !F.bolt ? 'Cıvata hurdaların arasında kayboldu. Nehir ses dalgalarıyla bulur!' : "Cıvatayı Frenk'e ver!";
  if (!L.cemile) {
    if (!F.cemileMet) return "Cadı Kulübesi, kasabanın sol altında. Cadı Cemile'nin süpürgesi kırık!";
    if (!F.moonDrop) return 'Ay ışığı damlası Cadı Kulübesi\'nde, en üst rafta. Bade uzanabilir!';
    if (!F.potion) return 'Tarif kitabını oku, iksiri kazanda yap!';
    if (!F.straw) return "Balkabağı Tarlası'nda altın saman saklı. Nehir'in ses dalgaları bulur!";
    return "İksiri ve altın samanı Cadı Cemile'ye ver!";
  }
  if (!L.hulya) return !F.moved.stone ? 'Mezarlıktaki mahzenin kapısını kocaman bir taş kapatıyor. Bade itebilir!' : !F.musicBox ? 'Mahzendeki müzik kutusu tavandaki kirişte. Nehir baş aşağı asılabilir!' : "Müzik kutusunu Hayalet Hülya'ya ver!";
  if (!L.selo) return !F.bone ? "Mezarlıkta gölgelerde bir hayalet köpek var, onu Bade görür. Kemiği nerede? Nehir'in ses dalgaları iz bulur!" : "Kemiği Selo'ya ver! Selo'yu Bade görebilir.";
  if (!L.pitir) return !F.bells || !F.notes ? 'Çalgı Sahnesi, Mumya Evi ile meydanın arasında. Çanlar ağacın tepesinde, nota kâğıdı sahnenin altında!' : "Çanları ve notayı Kara Kedi Pıtırcık'a ver!";
  if (!F.towerLit) return "Bütün fenerler tamam! Saat kulesindeki Büyük Fener'e git. Nehir ile Bade yan yana olsun!";
  return 'Helikopter pistine git. Pilot Pırpır sizi bekliyor!';
}
async function opening() {
  await scene(async () => {
    S.camTarget = { x: 80.5, y: 5.2 };
    await wait(0.5);
    await say('Kostümleriniz harika olmuş kızlar!', { speaker: SAY.funda });
    await say("Nehir'ciğim, o parıltılı kanatlarınla çok tatlı bir yarasa oldun!", { speaker: SAY.funda });
    await say("Bade'ciğim, minik dişlerin ve kırmızı astarlı pelerininle tam bir vampirsin!", { speaker: SAY.basak });
    await say('Vampirler karanlıkta görür! Hem de çok uzun boylu ve güçlüdür.', { speaker: SAY.Bade });
    await say('Yarasalar da ses dalgalarıyla gizli şeyleri bulur! Bir de dar yerlerden geçer, tavana baş aşağı asılır.', { speaker: SAY.Nehir });
    await say('Haydi, komşulara “Şeker mi, şaka mı?” demeye gidin. Birbirinizden hiç ayrılmayın, tamam mı?', { speaker: SAY.basak });
    await say('Ben de gelmek istiyorum! Ben de gelmek istiyorum!', { speaker: SAY.duru, loud: true });
    await say("Duru'cuğum, sen daha çok küçüksün. Dört yaşında bir kız gece Korku Treni'ne binmez. Sen bizimle evde kal, olur mu?", { speaker: SAY.basak });
    await say('Üzülme Duru! Sana bol bol şeker getireceğim, söz!', { speaker: SAY.Bade });
    await say("Sokağın sonundaki Korku Treni'ne de binebilirsiniz… biletiniz olursa!", { speaker: SAY.funda });
    S.camTarget = null;
    S.flags.introDone = true;
  });
  showToast('Aşağıdaki ÇIKIŞ kapısından sokağa çık.\nKomşuların kapısının önüne gidip Boşluk tuşuna bas!', 6);
}
function pickupFx(text, x, y) { Sound.play('pickup'); sparkle(x, y - 0.4); popup(text, x, y - 1.2, '#fff3c4', 24); updateHUD(); }
// used inside a scene: the friend hands over the lantern and goes to the square
async function giveLantern(key, x, y) {
  const F = S.flags;
  Sound.play('win'); sparkle(x, y - 0.8, '#ffb347', 26);
  S.gift = { x, y, k: 0 };
  await tween(0.9, (k) => { S.gift.k = k; });
  S.gift = null;
  F.lanterns[key] = true; F.lanternCount++; S.hearts = 3; S.hintTimer = 0; updateHUD();
  await say(`${F_NAME[key]} size balkabağı fenerini verdi! 🎃 (${F.lanternCount}/${N_L})\nKalpleriniz de doldu! ❤️❤️❤️`, { loud: false });
  S.leaving = { key, x, y, k: 0 };
  await tween(1.1, (k) => { S.leaving.k = k; });
  S.leaving = null;
  if (F.lanternCount === N_L) await say('Bütün fenerler tamam! 🎃', { speaker: SAY.Bade, loud: true });
  if (F.lanternCount % 2 === 0) saveCheckpoint();
}

async function interact(e) {
  const F = S.flags, c = P(), me = c.who, p = entPos(e);
  if (e.type === 'jar') { await scene(() => jarScene(e)); updateHUD(); return; }
  if (e.high && me === 'Nehir') {
    if (cooldown('high', 0.6)) { Sound.play('wrong'); showToast("Çok yüksek! Nehir yetişemiyor.\nQ tuşuna bas, Bade'ye geç. O uzun boylu!", 3.6); }
    return;
  }
  if (e.hang && me === 'Bade') {
    await scene(async () => {
      await say('Müzik kutusu tavandaki kirişe takılmış. Çok yüksek! Bade bile yetişemiyor.', { speaker: SAY.Bade });
      await say("Ama yarasalar uçar ve tavana baş aşağı asılır! Q tuşuna bas, Nehir'e geç.");
    });
    return;
  }
  switch (e.type) {
    // ---------------- HOME + NEIGHBOURS
    case 'mom':
      if (e.who === 'Funda') await scene(() => say(F.candyBag && F.tickets ? 'Biletleriniz de var! Korku Treni sokağın sonunda, sağda. İyi eğlenceler!' : 'Komşuların kapısını çalın. Kapının önüne gidip Boşluk tuşuna basın!', { speaker: SAY.funda }));
      else await scene(() => say(F.candyBag ? 'Şeker çantanızı sıkı tutun! Bu gece sokakta şekere bayılan garip yaratıklar varmış.' : "Ayşe Teyze'nin kapısını çalmayı unutmayın, en güzel şekerler onda!", { speaker: SAY.basak }));
      break;
    case 'duru':
      await scene(() => say(F.homeBack ? 'Şekerlerim nerede? Hi hi!' : 'Ben de büyüyünce vampir olacağım! Ya da yarasa! Ya da ikisi birden!', { speaker: SAY.duru }));
      break;
    case 'mirror':
      await scene(async () => {
        await say('Aynada bir vampir ile bir yarasa var… Aaa, bunlar biziz!', { speaker: SAY.Nehir });
        await say('Kırmızı astarlı pelerinim harika duruyor!', { speaker: SAY.Bade });
        await say('Benim kanatlarım da pırıl pırıl parlıyor!', { speaker: SAY.Nehir });
      });
      break;
    case 'knock': await scene(() => knockScene(e)); break;
    case 'bowl3':
      F.bowl3 = true; pickupFx('🍬🍬', p.x, p.y);
      await scene(async () => {
        await say('Bade parmak uçlarında yükseldi ve penceredeki kâseden iki şeker aldı. Mmm, çilekli!', { speaker: SAY.Bade });
        await say('Uzun boylu vampirler yükseğe uzanır! Yüksek bir şey görünce Bade\'yi çağırmayı unutma.');
      });
      break;
    case 'note3':
      F.note3 = true; Sound.play('sonar'); sparkle(p.x, p.y - 0.5, '#d7c4ff');
      await scene(async () => {
        await say('Bi-bip! Nehir\'in ses dalgaları çalının içinde bir şey buldu: katlanmış bir not!', { speaker: SAY.Nehir });
        await say('“Bu gece Canavar Kasabası\'nda Ay Festivali var. Ama ay kayboldu! Yardım edecek cesur çocuklar aranıyor. Korku Treni\'ne binin! — K.D.”');
        await say('Canavar Kasabası mı? K.D. de kim?', { speaker: SAY.Bade });
        await say('Gizli şeyleri ben bulurum! Bir yerde “bi-bip” sesi duyarsan bana geç.', { speaker: SAY.Nehir });
      });
      break;
    case 'kond': case 'trainGate': await scene(conductorScene); break;
    // ---------------- STATION + SQUARE
    case 'stationSign': await scene(() => say('CANAVAR KASABASI İSTASYONU\n“Nüfus: 66 canavar, 1 kara kedi, 0 korkak.”')); break;
    case 'info': await scene(() => say(e.text)); break;
    case 'drakos':
      await scene(async () => {
        if (F.lanternCount >= N_L && !F.towerLit) { await say("Yedi fener! Muhteşem! Şimdi saat kulesinin önündeki Büyük Fener'i yakın. Ama çok yüksekte…", { speaker: SAY.drakos }); await say('Bade, Nehir\'i omzuna alırsa belki yetişir! İkiniz yan yana olun.', { speaker: SAY.drakos }); }
        else if (F.towerLit) await say('Pilot Pırpır helikopter pistinde! Bulutların yanına uçun!', { speaker: SAY.drakos });
        else {
          await say(`Şu ana kadar ${F.lanternCount} fener topladınız. ${N_L - F.lanternCount} fener daha lazım!`, { speaker: SAY.drakos });
          await say('İpucu: ' + nextHint(), { speaker: SAY.drakos });
        }
      });
      break;
    case 'bora':
      S.hearts = 3; updateHUD(); Sound.play('pickup'); sparkle(c.x, c.y - 1, '#ff8fc4', 16);
      await scene(async () => {
        await say('Sıcak kakao! Hüüüp… Mis gibi! Kalpleriniz doldu! ❤️❤️❤️', { speaker: SAY.bora });
        if (once('boraJoke')) await say('Kakaoyu o kadar sıcak yapıyorum ki kabak kafam bile ısınıyor. Hah hah!', { speaker: SAY.bora });
      });
      break;
    case 'bigLantern': await scene(towerScene); break;
    case 'heli': await scene(skyScene); break;
    // ---------------- MUMYA MİMİ
    case 'mimi':
      if (F.bandage) {
        await scene(async () => {
          await say('Sargım! Yedek sargım! Teşekkürler kızlar!', { speaker: SAY.mimi, loud: true });
          S.spin = { x: p.x, y: p.y, k: 0 }; Sound.play('sparkle');
          await tween(1.2, (k) => { S.spin.k = k; });
          S.spin = null;
          await say('Mimi döne döne sarıldı. Şimdi pırıl pırıl, bembeyaz bir mumya!');
          await say('Festivalde dans ederken artık hiç çözülmem!', { speaker: SAY.mimi });
          await giveLantern('mimi', p.x, p.y);
        });
        break;
      }
      await scene(async () => {
        F.mimiMet = true;
        await say('Ah ah ahh! Sargılarım çözüldü… Bütün gece döne döne çözüldüm!', { speaker: SAY.mimi });
        await say('Yedek sargı rulom raftaki kavanozlardan birinde. Ama hangisinde, hatırlamıyorum. Hepsi birbirinin aynısı!', { speaker: SAY.mimi });
        await say('Kavanozlar çok yüksekte ama ben uzanırım!', { speaker: SAY.Bade });
        await say('Ben de ses dalgalarımla içlerini dinlerim. Hangisinden yumuşak ses gelirse sargı odur!', { speaker: SAY.Nehir });
      });
      showToast("Nehir kavanozların önünde Boşluk'a basınca ses dalgası gönderir.\nDoğru kavanozu Bade alır.", 6);
      break;
    // ---------------- KURT ADAM KURTUL
    case 'lamp': {
      F.lamps[e.n] = true; Sound.play('chime'); sparkle(p.x, p.y - 2, '#ffe9a8', 16);
      const n = [1, 2, 3].filter((k) => F.lamps[k]).length;
      if (n < 3) { showToast(`Bade yukarı uzanıp lambanın düğmesini çevirdi. Işık yandı! (${n}/3)\nKaranlıkta başka sönük lamba var mı?`, 4); break; }
      await scene(async () => {
        await say('Üçüncü lamba da yandı! Bütün sokak ışıl ışıl!', { speaker: SAY.Bade, loud: true });
        await say('Işıklar yandı… Ama ben hâlâ bu dar aralıktan çıkmaya korkuyorum. Biri yanıma gelip elimi tutsa…', { speaker: SAY.kurtul });
        await say("Ben o aralığa sığamam. Ama Nehir minicik! Q ile Nehir'e geç.", { speaker: SAY.Bade });
      });
      break;
    }
    case 'kurtul':
      await scene(async () => {
        if (streetLit()) {
          if (me === 'Bade') { await say("Kurtul evlerin arasındaki dar aralıkta büzülmüş. Ben oraya sığamam! Q ile Nehir'e geç.", { speaker: SAY.Bade }); return; }
          if (c.y > 17.4) { await say('Kurtul aralığın en dibinde büzülmüş. Elini tutmak için dar aralıktan içeri gir!', { speaker: SAY.Nehir }); return; }
          await kurtulBrave(); return;
        }
        F.kurtulMet = true;
        await say('Kim o?! Iıı… Lütfen korkutmayın beni!', { speaker: SAY.kurtul });
        await say('Ben Kurtul. Kurt adamım ama… karanlıktan çok korkuyorum. O yüzden bu dar aralığa saklandım.', { speaker: SAY.kurtul });
        await say('Sokağın üç lambası söndü. Onlar yanarsa belki çıkmaya cesaret ederim!', { speaker: SAY.kurtul });
        await say('Merak etme Kurtul! Ben vampirim, karanlıkta lambaları görürüm. Hepsini yakarız!', { speaker: SAY.Bade });
      });
      break;
    // ---------------- FRENK
    case 'frenk':
      await scene(async () => {
        if (F.bolt) {
          await say('Cıvatam! Hemen takayım… Tık!', { speaker: SAY.frenk, loud: true });
          Sound.play('click'); S.frenkFixed = true;
          await say('Başım dimdik oldu! Artık festivalde başım dönmeden dans edebilirim.', { speaker: SAY.frenk });
          await giveLantern('frenk', p.x, p.y);
          return;
        }
        if (F.moved.junk) { await say('Cıvatam o hurdaların arasında bir yerde… Ama minicik, ben bulamıyorum!', { speaker: SAY.frenk }); if (me === 'Bade') await say("Ben de göremiyorum. Q ile Nehir'e geç, onun ses dalgaları minik şeyleri bulur!", { speaker: SAY.Bade }); return; }
        F.frenkMet = true;
        await say('Merhaba… Ben Frenk. Boynumun cıvatası düştü. Başım hep yana kayıyor, bakın!', { speaker: SAY.frenk });
        await say('Cıvata şu eski kırmızı arabanın altına yuvarlandı! Hurdalığın sağ tarafında, görürsünüz. Ama araba çok ağır, ben itemiyorum.', { speaker: SAY.frenk });
        await say('Bir de balçıklara dikkat edin. Her şeye yapışırlar ama şekere bayılırlar!', { speaker: SAY.frenk });
        if (me === 'Nehir') await say("Araba çok ağır. Bade güçlüdür! Q ile Bade'ye geçelim.", { speaker: SAY.Nehir });
        else await say('Ben güçlüyüm! O kırmızı arabayı kenara iterim. 💪', { speaker: SAY.Bade });
      });
      break;
    case 'bolt':
      F.bolt = true; Sound.play('sonar'); pickupFx('🔩', p.x, p.y);
      await scene(() => say("Bi-bip! Ses dalgalarım hurdaların arasında minik bir şey buldu: Frenk'in cıvatası!", { speaker: SAY.Nehir }));
      break;
    case 'heavy':
      if (me === 'Nehir') { Sound.play('wrong'); await scene(() => say(`${e.name} çok ağır! Nehir itemiyor.\nBade güçlüdür. Q tuşuyla Bade'ye geç!`, { speaker: SAY.Nehir })); break; }
      await scene(async () => {
        const x0 = e.x, y0 = e.y; Sound.play('rumble'); shake(0.25);
        await tween(0.9, (k) => { e.dx = (e.to[0] - x0) * k; e.dy = (e.to[1] - y0) * k; });
        F.moved[e.id] = true; dust(e.to[0], e.to[1], 12);
        if (e.id === 'junk') await say("Bade eski kırmızı arabayı kenara itti. 💪\nAma cıvata nerede? Hurdaların arasında minicik bir şey kaybolmuş olmalı…", { speaker: SAY.Bade });
        else await say('Bade kocaman taşı kenara itti. 💪\nMahzenin kapısı açıldı!', { speaker: SAY.Bade });
      });
      break;
    // ---------------- CADI CEMİLE
    case 'cemile': await scene(cemileScene); break;
    case 'recipe':
      await scene(() => say('UÇAN SÜPÜRGE İKSİRİ\n1. 🐸 Kurbağa ayağı (lastik olanından!)\n2. 🦇 Yarasa tozu (yani mor şeker)\n3. 🌙 Ay ışığı damlası\nSonra kazanı üç kere karıştır!'));
      break;
    case 'cauldron': await scene(brewPotion); break;
    case 'moonDrop':
      F.moonDrop = true; pickupFx('🌙', p.x, p.y);
      await scene(() => say('Bade en üst rafa uzandı ve ışıl ışıl parlayan küçük şişeyi aldı: Ay ışığı damlası!', { speaker: SAY.Bade }));
      break;
    case 'scarecrow':
      await scene(async () => {
        await say('Korkuluğun şapkasına bir kâğıt iğnelenmiş:\n“Kabaklar sırayla yuvarlanır. Kabak geçince koş!”');
        await say('Korkuluk göz kırptı! …Yoksa bana mı öyle geldi?', { speaker: SAY.Nehir });
      });
      break;
    case 'straw':
      F.straw = true; Sound.play('sonar'); pickupFx('🌾', p.x, p.y);
      await scene(async () => {
        await say('Bi-bip! Ses dalgalarım kabakların arasında bir şey buldu: altın gibi parlayan bir tutam saman!', { speaker: SAY.Nehir });
      });
      break;
    // ---------------- HAYALET KÖPEK SELO
    case 'selo':
      await scene(async () => {
        if (F.bone) {
          await say('Hav hav hav! Selo kemiğini görünce havaya zıpladı ve üç kere fır döndü!', { speaker: SAY.selo, loud: true });
          await say('Hav! (Teşekkürler, der gibi elinizi yaladı. Hayalet dili gıdıkladı!)', { speaker: SAY.selo });
          await giveLantern('selo', p.x, p.y);
          return;
        }
        F.seloMet = true;
        await say('Mezar taşlarının gölgesinde bir şey kıpırdıyor… Bir hayalet köpek! Gölgelerde görünmez oluyor ama vampir gözleri onu görür.', { speaker: SAY.Bade });
        await say('Selo kuyruğunu sallıyor ama gözleri çok üzgün. Hav… hav…', { speaker: SAY.selo });
        await say('Bir şey mi kaybettin Selo?', { speaker: SAY.Bade });
        await say('Hav! (Kemiğimi kaybettim, der gibi bakıyor.)', { speaker: SAY.selo });
        await say("Yerde iz var mı acaba? Ben göremiyorum. Nehir'in ses dalgaları gizli izleri bulur!", { speaker: SAY.Bade });
      });
      break;
    case 'prints':
      Sound.play('sonar'); F.printsSeen = true;
      await scene(async () => {
        await say('Bi-bip! Minik pati izleri! Hafif hafif parlıyorlar. Çitteki küçük deliğe doğru gidiyorlar.', { speaker: SAY.Nehir });
        await say("Ben o delikten geçemem, çok uzunum. Ama sen küçüksün Nehir!", { speaker: SAY.Bade });
      });
      break;
    case 'kemik':
      await scene(async () => {
        await say('Zzz… Horrr… İskelet Kemik bahçe sandalyesinde mışıl mışıl uyuyor.');
        await say('Zzz… Selo yine bir şeyi… bahçeme gömdü… zzz… takır takır…', { speaker: SAY.kemik });
      });
      break;
    case 'dig':
      F.bone = true; Sound.play('sonar'); dust(p.x, p.y, 14, '#7a5a3a'); pickupFx('🦴', p.x, p.y);
      await scene(() => say("Bi-bip! Toprağın altında bir şey var! Nehir minik pençeleriyle kazdı… Bir kemik! Bu, Selo'nun kemiği olmalı!", { speaker: SAY.Nehir }));
      break;
    // ---------------- KARA KEDİ PITIRCIK
    case 'pitir':
      if (F.bells && F.notes) { await scene(songGame); break; }
      await scene(async () => {
        if (!F.pitirMet) {
          F.pitirMet = true;
          await say('Miyav! Ben Kara Kedi Pıtırcık, kasabanın müzisyeniyim.', { speaker: SAY.pitir });
          await say('Festivalde çanlarımla şarkı çalacaktım. Ama rüzgâr çanlarımı ağacın tepesine, nota kâğıdımı da sahnenin altına uçurdu!', { speaker: SAY.pitir });
          await say('Ağaç çok yüksek, sahnenin altındaki delik de minicik. Miyav…', { speaker: SAY.pitir });
          return;
        }
        const need = [!F.bells ? 'ağaçtaki çanlarım' : null, !F.notes ? 'sahnenin altındaki nota kâğıdım' : null].filter(Boolean);
        await say('Miyav! Hâlâ ' + need.join(' ve ') + ' lazım.', { speaker: SAY.pitir });
      });
      break;
    case 'bells':
      F.bells = true; Sound.play('chime'); pickupFx('🔔', p.x, p.y);
      await scene(() => say('Bade ağacın tepesine uzandı ve çanları dalından çözdü. Çın çın!', { speaker: SAY.Bade }));
      break;
    case 'notes':
      F.notes = true; pickupFx('📜', p.x, p.y);
      await scene(() => say('Nehir sahnenin altındaki minik delikten süründü… İşte nota kâğıdı! Biraz tozlu ama sağlam.', { speaker: SAY.Nehir }));
      break;
    // ---------------- HAYALET HÜLYA
    case 'hulya':
      if (F.musicBox) {
        await scene(async () => {
          await say('Müzik kutum! Teşekkürler kızlar!', { speaker: SAY.hulya, loud: true });
          [0, 2, 1, 3, 2, 0].forEach((n, i) => schedule(() => Sound.note(n), i * 300));
          await say('Kutunun kapağını açınca şarkım geri geldi. La la laaa… Huuuu! Festivalde bunu herkes için çalacağım.', { speaker: SAY.hulya });
          await giveLantern('hulya', p.x, p.y);
        });
        break;
      }
      await scene(async () => {
        F.hulyaMet = true; Sound.play('ghost');
        await say('Huuuu… Korkmayın, ben Hülya. Bu mahzenin hayaletiyim.', { speaker: SAY.hulya });
        await say('Müzik kutum tavandaki kirişe takıldı. Kapının önündeki taş yüzünden kimse yardıma gelemedi…', { speaker: SAY.hulya });
        if (me === 'Bade') await say("Kiriş çok yüksek. Ama Nehir yarasa! Q ile Nehir'e geçelim, o tavana asılabilir.", { speaker: SAY.Bade });
        else await say('Ben yarasayım! Kirişe uçup baş aşağı asılabilirim!', { speaker: SAY.Nehir });
      });
      break;
    case 'musicBox':
      await scene(async () => {
        await say('Ben yarasayım! Tavana uçabilirim!', { speaker: SAY.Nehir });
        S.hang = { k: 0, x: p.x, y: p.y };
        await tween(0.8, (k) => { S.hang.k = k; });
        Sound.play('bats');
        await say('Nehir kirişe uçtu ve yarasa gibi baş aşağı asıldı! Hop, müzik kutusunu kaptı!', { speaker: SAY.Nehir });
        await tween(0.6, (k) => { S.hang.k = 1 - k; });
        S.hang = null;
        F.musicBox = true; pickupFx('🎵', c.x, c.y);
        await say("Müzik kutusunu Hayalet Hülya'ya götürelim!", { speaker: SAY.Bade });
      });
      break;
    default: break;
  }
  updateHUD();
}
async function knockScene(e) {
  const F = S.flags, me = P().who;
  Sound.play('knock');
  if (e.n === 1) {
    if (F.candyBag) { await say('Yine mi geldiniz? Çantanız şekerle dolu ya! Haydi Korku Treni\'ne!', { speaker: SAY.ayse }); return; }
    await say('Tak tak tak!');
    await say('Kim o? Aaa, bir vampir ile bir yarasa! Ne güzel kostümler!', { speaker: SAY.ayse });
    const ch = await say('Haydi söyleyin bakalım…', { speaker: SAY.ayse, choices: ['Şeker mi, şaka mı? Şeker!', 'Şeker mi, şaka mı? Şaka!'] });
    if (ch === 0) await say('Şeker tabii ki! Al bakalım, kocaman bir çanta dolusu!', { speaker: SAY.ayse });
    else await say('Şaka mı? O zaman ben de bir şaka yapayım: Bu çantada hiç şeker yok!… Hah hah, şaka! Ağzına kadar dolu!', { speaker: SAY.ayse });
    F.candyBag = true; pickupFx('🍬', e.x, e.y);
    await say('Bu şekerleri iyi saklayın. Bu gece şekere bayılan garip yaratıklar dolaşıyormuş!', { speaker: SAY.ayse });
    await say('Şeker çantası çantana girdi! Gerekince Boşluk tuşuyla şeker atabilirsin.');
    F.knocked[1] = true; return;
  }
  if (e.n === 2) {
    if (F.tickets) { await say('Hazineyi aldınız! Tren sokağın sonunda, sağda. Yo ho ho!', { speaker: SAY.hasan }); return; }
    await say('Tak tak tak!');
    await say('Yo ho ho! Ben Korsan Hasan! Bilmecemi bilirseniz size bir hazine veririm.', { speaker: SAY.hasan });
    const opts = ['Baykuş', 'Yarasa', 'Kedi'];
    const ch = await say('Gündüz uyur, gece uçar. Baş aşağı asılır, karanlıkta yolunu sesle bulur. Bu ne?', { speaker: SAY.hasan, choices: opts });
    F.knocked[2] = true;
    if (ch !== 1) { Sound.play('wrong'); await say(`${opts[ch]} mı? Hımm, değil! Bir ipucu: Nehir'in kostümüne iyi bakın!`, { speaker: SAY.hasan }); await say('Kapıyı bir daha çalıp tekrar deneyebilirsin.'); return; }
    Sound.play('win');
    await say(me === 'Nehir' ? 'Yarasa! Yani ben!' : 'Yarasa! Tıpkı Nehir gibi!', { speaker: me === 'Nehir' ? SAY.Nehir : SAY.Bade, loud: true });
    F.tickets = true; pickupFx('🎟️', e.x, e.y);
    await say('Bildiniz! İşte hazinem: iki Korku Treni bileti! Ben o trenden çok korkuyorum, siz binin.', { speaker: SAY.hasan });
    await say('Tren sokağın sonunda, sağda. Kondüktöre biletleri gösterin!', { speaker: SAY.hasan });
    return;
  }
  // house 3: nobody home
  F.knocked[3] = true;
  await say('Tak tak tak… Kimse açmadı.');
  await say('Kapıda bir kâğıt var: “Evde yokuz. Şekerler pencerenin önünde, birer tane alın!”');
  if (!F.bowl3) await say(me === 'Nehir' ? 'Pencere çok yüksek… Bade, sen uzunsun! Q ile Bade\'ye geçelim.' : 'Pencere yüksek ama ben uzanırım!', { speaker: me === 'Nehir' ? SAY.Nehir : SAY.Bade });
}
async function conductorScene() {
  const F = S.flags;
  if (F.skyDone) {
    const ch = await say('Takır takır! Son tren kalkmak üzere. Anneleriniz sizi bekliyordur!', { speaker: SAY.kond, choices: ['Eve dönelim!', 'Biraz daha kalalım'] });
    if (ch === 0) await rideHome();
    return;
  }
  if (!F.tickets) {
    await say('Takır takır! Ben Kondüktör Takırtı. Korku Treni\'ne bilet olmadan binilmez!', { speaker: SAY.kond });
    await say('Biletleri kim mi satar? Kimse! Ama bu sokakta hazine dağıtan bir korsan varmış…', { speaker: SAY.kond });
    return;
  }
  if (!F.candyBag) {
    await say('Biletler tamam! Ama yanınızda hiç şeker yok mu? Cadılar Bayramı\'nda şekersiz yola çıkılmaz!', { speaker: SAY.kond });
    await say("Ayşe Teyze'nin kapısını çalın. Evinizin hemen yanındaki ev!", { speaker: SAY.kond });
    return;
  }
  await say('Takır takır! Biletler tamam, şekerler tamam!', { speaker: SAY.kond });
  const ch = await say('Haydi, binin bakalım! Bu tren çok özel bir yere gidiyor…', { speaker: SAY.kond, choices: ['Binelim!', 'Biraz sonra'] });
  if (ch !== 0) return;
  await rideTrain();
}
async function rideTrain() {
  const F = S.flags;
  F.ticketsGiven = true; updateHUD();
  Sound.play('train');
  await fadeOut(0.5, '8,5,18');
  S.ride = { t: 0 };
  await fadeIn(0.5);
  await say('Tren tıkır tıkır karanlık ormana daldı…');
  Sound.play('train');
  await say('Bade… Kondüktörün kostümü çok gerçekçi değil mi?', { speaker: SAY.Nehir });
  await say('Takır takır! Kostüm değil ki! Ben gerçek bir iskeletim. Ama korkmayın, çok iyi bir iskeletim!', { speaker: SAY.kond });
  await say('Vay canına! Demek Canavar Kasabası gerçekmiş!', { speaker: SAY.Bade, loud: true });
  Sound.play('ghost');
  await say('İleride kasabanın ışıkları görünüyor… Ama gökyüzünde ay yok. Eyvah eyvah!', { speaker: SAY.kond });
  await fadeOut(0.5, '8,5,18');
  S.ride = null;
  F.arrived = true;
  placeBoth(35.5, 16.7); P().dir = 'down';
  S.drakPos = { x: 38.2, y: 16.6 };
  S.area = ''; checkAreaTitle();
  await fadeIn(0.6);
  await wait(0.3);
  Sound.play('ghost');
  await say('Hoş geldiniz! Hoş geldiniz! Ben Kont Drakoş, Canavar Kasabası\'nın belediye başkanıyım.', { speaker: SAY.drakos });
  await say('O notu ben yazmıştım. K.D.: Kont Drakoş!', { speaker: SAY.drakos });
  await say('Bu gece Ay Festivali var. Ama bakın gökyüzüne: kara bulutlar ayı sakladı! Ay olmadan festival başlayamaz.', { speaker: SAY.drakos });
  await say('Meydandaki saat kulesinde Büyük Fener var. Onu yedi balkabağı feneriyle yakarsak ışığı bulutlara ulaşır.', { speaker: SAY.drakos });
  await say('Fenerler kasabadaki yedi arkadaşımızda. Ama hepsinin bir derdi var. Onlara yardım ederseniz fenerlerini size verirler!', { speaker: SAY.drakos });
  await say('Bir vampir ile bir yarasa… Bu iş tam bize göre!', { speaker: SAY.Bade });
  await say('Haydi, yedi fener bulalım!', { speaker: SAY.Nehir, loud: true });
  await say("Kasabanın haritasına M tuşuyla bakabilirsiniz. Kalpleriniz azalırsa meydandaki Kabak Kafa Bora'nın sıcak kakaosunu için!", { speaker: SAY.drakos });
  const d0 = { ...S.drakPos };
  await tween(1.6, (k) => { S.drakPos = { x: d0.x + (33.5 - d0.x) * k, y: d0.y + (29.4 - d0.y) * k, walk: true }; });
  S.drakPos = null;
  updateHUD();
  saveCheckpoint();
  schedule(() => { if (S.mode === 'play' && !S.dialog) showToast('Yedi canavar arkadaşı bul! M ile haritaya bak:\n❓ işaretleri yardım bekleyen arkadaşları gösterir.', 6); }, 1200);
}
async function rideHome() {
  const F = S.flags;
  Sound.play('train');
  await fadeOut(0.5, '8,5,18');
  S.ride = { t: 0, back: true };
  await fadeIn(0.5);
  await say('Tren tıkır tıkır ormanın içinden mahalleye geri döndü. Gökyüzünde kocaman ay parlıyor!');
  await say('Bütün canavar arkadaşlar istasyonda el salladı. Gürgür de gökyüzünden göz kırptı!', { speaker: SAY.Nehir });
  await say('Takır takır! Gelecek Cadılar Bayramı\'nda yine bekleriz!', { speaker: SAY.kond });
  await say("Duru'ya anlatacak o kadar çok şeyimiz var ki!", { speaker: SAY.Bade });
  await fadeOut(0.5, '8,5,18');
  S.ride = null;
  F.homeBack = true;
  placeBoth(34.5, 8.8); P().dir = 'left';
  S.area = ''; checkAreaTitle();
  saveCheckpoint(true);
  await fadeIn(0.6);
  showToast('Mahalleye döndünüz! Eve gidin, anneleriniz sizi bekliyor.', 6);
}
async function kurtulBrave() {
  const F = S.flags, k = ent('kurtul');
  if (F.lanterns.kurtul) return;
  await say('Nehir dar aralıktan içeri süzüldü ve Kurtul\'un titreyen elini tuttu. “Gel, ben yanındayım!”', { speaker: SAY.Nehir });
  await say('Işıklar yanıyor, bir de yanımda bir arkadaş var… Artık hiç korkmuyorum!', { speaker: SAY.kurtul, loud: true });
  Sound.play('howl'); S.howl = 2.5;
  await say('AUUUUUUU!', { speaker: SAY.kurtul, loud: true });
  await say('Ne güzel uludun Kurtul! Bütün kasaba duydu.', { speaker: SAY.Nehir });
  await say('Teşekkürler kızlar. Festivalde en güzel şarkıyı ben uluyacağım!', { speaker: SAY.kurtul });
  await giveLantern('kurtul', k.x, k.y);
}
async function jarScene(e) {
  const F = S.flags, me = P().who;
  const CONTENT = ['Fır fır! İçinden minik yarasalar uçtu!', 'İçinde eski, kokmuş bir çorap var. Iyy!', 'İçi kurabiye kırıntısıyla dolu. Bir mumya neden kurabiye saklar ki?'];
  if (me === 'Nehir') {
    Sound.play('sonar'); S.ring = { x: e.x, y: e.y, t: 0 };
    F.jarPinged[e.n] = true;
    if (e.n === F.jarRight) {
      await say('Bi-bip… Pof! Bu kavanozdan yumuşacık, pofuduk bir ses geldi. İçinde sargı var!', { speaker: SAY.Nehir });
      await say("Kavanoz çok yüksek. Q ile Bade'ye geç, bu kavanozu o alsın!");
    } else await say('Bi-bip… Tınnn! Bu kavanozdan boş bir ses geldi. Burada sargı yok.', { speaker: SAY.Nehir });
    return;
  }
  if (!F.jarPinged[F.jarRight]) {
    await say('Kavanozların hepsi birbirinin aynısı! Yanlışını açarsam içinde uyuyan yarasalar uyanır.', { speaker: SAY.Bade });
    await say("Önce Nehir ses dalgalarıyla dinlesin. Q ile Nehir'e geç!");
    return;
  }
  if (e.n !== F.jarRight) { await say(`Nehir'in bulduğu kavanoz bu değil. Onun kavanozu ${F.jarRight + 1} numaralı olan!`, { speaker: SAY.Bade }); return; }
  F.bandage = true; pickupFx('🧻', e.x, e.y);
  await say("Bade kavanoza uzandı ve kapağını açtı… İçinde bembeyaz bir sargı rulosu! Haydi, Mumya Mimi'ye götürelim.", { speaker: SAY.Bade });
}
async function cemileScene() {
  const F = S.flags, e = ent('cemile');
  if (F.potion && F.straw) {
    await say('İksir ve altın saman! İkisi de burada!', { speaker: SAY.cemile, loud: true });
    Sound.play('brew'); sparkle(86, 22, '#b28dff', 26);
    await say('Cemile süpürgesine altın samanı bağladı ve iksiri damlattı… Fışşş!');
    S.cemileFly = 1.6; Sound.play('ghost');
    await say('Vıııınnn! Süpürge yine uçuyor! Hi hi hiii!', { speaker: SAY.cemile, loud: true });
    await say('Teşekkürler kızlar! Festivalde gökyüzünde ilk ben uçacağım.', { speaker: SAY.cemile });
    S.cemileFly = 0;
    await giveLantern('cemile', e.x, e.y);
    return;
  }
  if (!F.cemileMet) {
    F.cemileMet = true;
    await say('Ah ah! Süpürgem kırıldı! Bu gece festivalde uçacaktım…', { speaker: SAY.cemile });
    await say('Onu tamir etmek için iki şey lazım: Balkabağı Tarlası\'ndaki altın saman ve Uçan Süpürge İksiri.', { speaker: SAY.cemile });
    await say('İksirin tarifi duvardaki kitabımda yazıyor. Malzemeleri kazana doğru sırayla atmalısınız.', { speaker: SAY.cemile });
    await say('Ay ışığı damlası da en üst rafta. Ben yetişemiyorum, boyum çok kısa!', { speaker: SAY.cemile });
    await say('Altın saman tarlada bir yerde saklı. Ama dikkat, kabaklarım bu gece çok yaramaz, yuvarlanıp duruyorlar!', { speaker: SAY.cemile });
    return;
  }
  const need = [!F.potion ? 'iksiri kazanda yapın (tarif kitapta)' : null, !F.straw ? 'tarladaki altın samanı bulun' : null].filter(Boolean);
  await say('Süpürgem için ' + need.join(' ve ') + '!', { speaker: SAY.cemile });
}
async function brewPotion() {
  const order = ['🐸 Kurbağa ayağı', '🦇 Yarasa tozu', '🌙 Ay ışığı damlası'];
  const opts = ['🌙 Ay ışığı damlası', '🐸 Kurbağa ayağı', '🦇 Yarasa tozu'];
  if (!S.flags.moonDrop) { await say('Kazan fokur fokur kaynıyor. Ama Ay ışığı damlası yok! Şişesi en üst rafta duruyor.', { speaker: SAY.Nehir }); return; }
  await say('Kazan fokur fokur kaynıyor. Malzemeleri tarifteki sırayla atalım!', { speaker: SAY.Bade });
  for (let i = 0; i < 3; i++) {
    const ch = await say(`Kazana ${i + 1}. olarak ne atalım?`, { choices: opts });
    if (opts[ch] !== order[i]) {
      Sound.play('wrong'); S.smoke = { t: 0 };
      await say('Pof! Kazandan pembe bir duman çıktı. Hapşuu!');
      await say('Sıra yanlış oldu. Duvardaki tarif kitabına bir daha bakalım!', { speaker: SAY.Nehir });
      return;
    }
    Sound.play('brew'); sparkle(81.9, 22.2, ['#7fe0a0', '#b28dff', '#fff3c4'][i], 12);
  }
  await say('Şimdi üç kere karıştır: Bir… iki… üç!');
  await wait(0.4); Sound.play('chime');
  S.flags.potion = true; pickupFx('🧪', 81.9, 22.6);
  await say('İksir oldu! Mor renkli, ışıl ışıl bir Uçan Süpürge İksiri!', { loud: true });
}
// Hülya's song: remember the notes (arrows), then press the same arrows
const ARROW = { up: '↑', down: '↓', left: '←', right: '→' };
const NOTE_OF = { up: 0, right: 1, down: 2, left: 3 };
function waitDir() { return new Promise((r) => { S.awaitDir = r; }); }
async function songGame() {
  const ch = await say('Çanlarım ve notam! Teşekkürler! Şimdi benimle şarkıyı çalar mısınız?', { speaker: SAY.pitir, choices: ['Çalalım!', 'Sonra'] });
  if (ch !== 0) return;
  await say('Bu oyun nasıl oynanır?\n1) Çanların üstünde oklar tek tek görünecek, her ok bir nota çalar. İyi bak ve sırasını aklında tut!\n2) Oklar bitince sıra sende: klavyendeki ok tuşlarına ( ← ↑ ↓ → ) aynı sırayla bas.');
  await say('Üç tur var: önce 3 nota, sonra 4 nota, en son 5 nota. Yanlış basarsan üzülme, tur yeniden başlar!');
  const rounds = [3, 4, 5], k0 = ent('pitir');
  for (let ri = 0; ri < rounds.length; ri++) {
    const len = rounds[ri];
    let ok = false;
    while (!ok) {
      const seq = []; for (let i = 0; i < len; i++) { let d; do { d = pick(['up', 'down', 'left', 'right']); } while (i > 0 && d === seq[i - 1] && Math.random() < 0.6); seq.push(d); }
      S.dance = { seq, shown: -1, phase: 'show', got: [], round: ri + 1, rounds: rounds.length, ax: k0.x + 3.2, ay: k0.y };
      await say(`${ri + 1}. tur: ${len} nota geliyor. Çanlara iyi bak!`, { speaker: SAY.pitir });
      showToast(`İyi bak! ${len} oku sırayla aklında tut… 👀`, len * 1.2 + 0.5);
      await wait(0.5);
      for (let i = 0; i < len; i++) { S.dance.shown = i; Sound.note(NOTE_OF[seq[i]]); await wait(1.0); S.dance.shown = -1; await wait(0.25); }
      S.dance.phase = 'input';
      showToast(`Şimdi sıra sende! Klavyedeki ok tuşlarına aynı sırayla bas.\n(${len} nota: ← ↑ ↓ →)`, 60);
      ok = true;
      for (let i = 0; i < len; i++) {
        const d = await waitDir();
        S.dance.got.push(d);
        if (d !== seq[i]) { ok = false; break; }
        Sound.note(NOTE_OF[d]);
      }
      hideToast();
      S.dance.phase = 'done';
      if (!ok) {
        Sound.play('wrong');
        S.dance.phase = 'answer';
        await say(`Hop! ${S.dance.got.length}. nota yanlış oldu. Doğrusu şuydu: ${seq.map((d) => ARROW[d]).join(' ')}\nÜzülme, bu turu bir daha deneyelim!`, { speaker: SAY.pitir });
      } else { Sound.play('checkpoint'); sparkle(k0.x, k0.y - 1); if (ri < rounds.length - 1) await say(`Harika! ${ri + 1}. turu geçtin! 🎶`, { speaker: SAY.pitir }); }
    }
  }
  S.dance = null;
  await say('Miyavvv! Şarkı tamam! Festivalde bu şarkıyı çanlarımla herkes için çalacağım.', { speaker: SAY.pitir, loud: true });
  await giveLantern('pitir', k0.x, k0.y);
}

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
  [0, 1, 2, 3, 2, 1, 0].forEach((n, i) => schedule(() => Sound.note(n), i * 260));
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
  if (!quiet) { Sound.play('checkpoint'); popup('💾 Kaydedildi', a.x, a.y - 2, '#bff0c4', 20, 1.8); schedule(() => { if (S.mode === 'play' && !S.dialog) showToast('✨ Kontrol noktası: oyun kaydedildi', 2.2); }, 50); }
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
  schedule(() => { if (performance.now() - restartArmed >= 2900) b.textContent = '↺ BAŞTAN BAŞLA'; }, 3000);
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
    await say("Bade, yarasaların yanından dikkatlice geç. Yarasalar Nehir'e hiç dokunmaz!");
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
  if (AREA_TIPS[key] && once('area_' + key) && (inside || a !== 'Mahalle' || F.introDone)) schedule(() => { if (!S.dialog) showToast(AREA_TIPS[key], 5.5); }, 400);
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
    if (S.hintTimer > 150 && !S.dialog && !S.locked) { S.hintTimer = 0; showToast('💡 İpucu: ' + nextHint() + '\nM tuşu: harita', 7); }
  }
  updateCamera(dt);
  input.pressed = {};
}

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

})();
