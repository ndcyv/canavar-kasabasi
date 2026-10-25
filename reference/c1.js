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
const OWNER = '__OWNER__';                       // 'Nehir' or 'Bade' (set at build time)

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
