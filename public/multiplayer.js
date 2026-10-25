// Browser side of the shared adventure: sends this girl's keys, draws what the server says.
const E = window.__multiplayer, S = E.S, $ = (id) => document.getElementById(id);
let session = null, pack = null, seq = 0, inFlight = false, lastSound = 0, dialogSignature = '', restartRequest = null, generation = 0, lastFrame = performance.now();
const held = {}, pressed = new Set();
let saved; try { saved = JSON.parse(sessionStorage.getItem('canavar-session')); } catch { /* ignore */ }
if (saved) { $('player-name').value = saved.name; $('room-code').value = saved.code; }
$('connection').textContent = 'Aynı oda koduyla iki kahraman birlikte oynar.';
S.manual = true;
let localToastUntil = 0;
function localToast(text, secs) { const t = $('toast'); t.textContent = text; t.classList.add('show'); localToastUntil = performance.now() + secs * 1000; }
const AREA_TR = (a) => a || 'kasabada';
function clearKeys() { for (const k of Object.keys(held)) held[k] = false; pressed.clear(); }
async function api(path, extra = {}) {
  const response = await fetch(`/api/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...session, ...extra }), signal: AbortSignal.timeout(5000) });
  const result = await response.json(); if (!response.ok) throw Object.assign(new Error(result.error), { status: response.status }); return result;
}
let introVisible = false;
function introOpen() { return introVisible; }
function closeIntro() { introVisible = false; $('intro').hidden = true; }
function showIntro() {
  const key = `intro-${session.code}-${session.name}`;
  try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch { /* ignore */ }
  introVisible = true; $('intro').hidden = false; E.drawPortraits();
}
function apply(next) {
  pack = next; restartRequest = next.restartRequest;
  if (generation !== (next.generation || 0)) { generation = next.generation || 0; dialogSignature = ''; lastSound = 0; }
  const me = session.name;
  S.active = me;
  Object.assign(S, next.state); S.manual = true;
  Object.assign(S.pl[me], next.me, { hints: S.pl[me].hints });
  const signature = JSON.stringify(next.dialog);
  if (signature !== dialogSignature) {
    dialogSignature = signature; S.dialog = next.dialog ? { ...next.dialog, resolve() {} } : null; E.renderDialog();
    $('dlg-next').textContent = next.dialog?.spectator ? '⏳ Kuzenin okuyor, birlikte izliyorsunuz…' : '▶ Devam (Boşluk / dokun)';
    if (next.dialog?.spectator) $('dlg-choices').replaceChildren();
    $('dlg-next').hidden = !!(next.dialog?.choices && !next.dialog.spectator);
  }
  S.overlayInput = false;
  E.showOverlay(S.mode === 'ending' ? 'ending' : null);
  if (introOpen()) $('intro').hidden = false;
  if (S.mode === 'ending' && $('ending-card').innerHTML !== next.endingHtml) $('ending-card').innerHTML = next.endingHtml;
  const t = $('toast');
  if (performance.now() < localToastUntil) { /* a local note is showing */ }
  else if (next.toast.t > 0 && !next.dialog) { if (t.textContent !== next.toast.text) t.textContent = next.toast.text; t.classList.add('show'); } else t.classList.remove('show');
  for (const v of next.entities) { const entity = E.ENTS.find((e) => e.id === v.id); if (entity) Object.assign(entity, v); }
  E.updateHUD();
  const cz = next.cousin, online = next.players[cz.name]?.online;
  $('connection').textContent = `Oda: ${session.code} · Sen: ${me} · ` + (online ? `${cz.name}: ${AREA_TR(cz.area)}${cz.busy ? ' (konuşuyor)' : ''}` : `${cz.name} bekleniyor… Oda kodunu ona söyle: ${session.code}`) + (next.saveError ? ' · Kayıt hatası' : '');
  $('scene-note').textContent = restartRequest ? `${restartRequest} ortak oyunu sıfırlamak istiyor. ${restartRequest === me ? 'Kuzeninin onayı bekleniyor.' : 'Onaylamak için aşağıdaki düğmeye bas.'}` : '';
  $('btn-restart').textContent = restartRequest && restartRequest !== me ? '↺ SIFIRLAMAYI ONAYLA' : '↺ ORTAK OYUNU SIFIRLA';
  for (const event of next.sounds) { if (event.id > lastSound) { if (event.name.startsWith('note')) E.Sound.note(Number(event.name.slice(4))); else E.Sound.play(event.name); } lastSound = Math.max(lastSound, event.id); }
  if (S.mapOpen) E.drawTownMap();
}
$('join').addEventListener('submit', async (e) => {
  e.preventDefault(); const button = e.submitter; if (button) button.disabled = true;
  try {
    const name = $('player-name').value, code = $('room-code').value.trim().toUpperCase();
    session = { name, code, token: saved?.name === name && saved?.code === code ? saved.token : undefined };
    const result = await api('join'); session = { name: result.name, code: result.code, token: result.token };
    try { sessionStorage.setItem('canavar-session', JSON.stringify(session)); } catch { /* ignore */ }
    E.Sound.init(); lastSound = result.state.sounds.at(-1)?.id || 0; apply(result.state); E.snapCamera(); $('lobby').hidden = true; $('join-error').textContent = '';
    showIntro();
  } catch (err) { session = null; $('join-error').textContent = err.message; } finally { if (button) button.disabled = false; }
});
async function command(cmd, payload) {
  if (!session) return;
  try { apply(await api('command', { command: cmd, payload })); } catch (e) { localToast(e.message, 3); }
}
const keymap = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', Space: 'act', Enter: 'act', KeyE: 'act', NumpadEnter: 'act' };
function press(k) { if (!held[k]) pressed.add(k); held[k] = true; }
function release(k) { if (['left', 'right', 'up', 'down', 'act'].includes(k)) held[k] = false; }
// Our handlers run first; the single-player keyboard handlers never see the keys.
document.addEventListener('keydown', (e) => {
  if (!session || !$('lobby').hidden) { e.stopPropagation(); return; }
  if (introOpen()) { if (['Space', 'Enter', 'NumpadEnter', 'Escape'].includes(e.code)) { e.preventDefault(); closeIntro(); } e.stopImmediatePropagation(); return; }
  if (pack?.dialog?.choices && !pack.dialog.spectator && /^(Digit|Numpad)[1-9]$/.test(e.code)) { e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) { const i = Number(e.code.at(-1)) - 1; if (i < pack.dialog.choices.length) command('dialog', i); } return; }
  const k = keymap[e.code];
  if (!k && !['KeyM', 'Escape', 'KeyQ', 'Tab'].includes(e.code)) return;
  if (e.code === 'Tab') { e.stopPropagation(); return; }
  e.preventDefault(); e.stopImmediatePropagation(); E.Sound.init();
  if (e.repeat) return;
  if (S.mapOpen) { if (['KeyM', 'Escape', 'Space', 'Enter'].includes(e.code)) E.toggleMap(false); return; }
  if (e.code === 'KeyM') { clearKeys(); E.toggleMap(true); return; }
  if (e.code === 'KeyQ') { localToast('Her kahramanı kendi oyuncusu yönetir. Uzaktaki kuzeninle telsizden konuşursun!', 3); return; }
  if (k) press(k);
}, true);
document.addEventListener('keyup', (e) => { const k = keymap[e.code]; if (k) { release(k); if (session) e.stopImmediatePropagation(); } }, true);
addEventListener('blur', clearKeys); document.addEventListener('visibilitychange', () => { if (document.hidden) clearKeys(); });
document.addEventListener('click', (e) => {
  const b = e.target.closest('button'), dialog = e.target.closest('#dialog');
  if (!session) return;
  if (b?.id === 'btn-sound') return;
  if (b?.closest('#join')) return;
  if (b?.id === 'btn-intro') { e.stopImmediatePropagation(); closeIntro(); return; }
  if (b || dialog) e.stopImmediatePropagation();
  if (dialog) { if (pack.dialog?.spectator) return; if (pack.dialog?.choices) { const choices = [...$('dlg-choices').children]; const i = choices.indexOf(b); if (i >= 0) command('dialog', i); } else command('dialog'); return; }
  if (['btn-restart', 'btn-again'].includes(b?.id) || b?.closest('#ending-card')) {
    api(restartRequest && restartRequest !== session.name ? 'restart-confirm' : 'restart-request').then(apply).catch((err) => localToast(err.message, 3));
  }
}, true);
$('mapov').addEventListener('click', () => E.toggleMap(false));
setInterval(async () => {
  if (!session || !$('lobby').hidden || inFlight) return; inFlight = true;
  const edges = introOpen() ? [] : [...pressed]; pressed.clear();
  const keys = introOpen() ? {} : { ...held };
  try { apply(await api('input', { seq: ++seq, keys, pressed: edges })); }
  catch (e) {
    clearKeys(); $('connection').textContent = 'Bağlantı kesildi. Yeniden bağlanılıyor…';
    if (e.status === 401) { try { const result = await api('join'); seq = 0; apply(result.state); } catch { $('connection').textContent = 'Odaya yeniden katılmak için sayfayı yenile.'; } }
  } finally { inFlight = false; }
}, 70);
function cosmetic(now) { const dt = Math.min(0.05, (now - lastFrame) / 1000); lastFrame = now; if (session) E.cosmetic(dt); requestAnimationFrame(cosmetic); }
requestAnimationFrame(cosmetic);
window.__mpClient = { get pack() { return pack; }, get session() { return session; }, command, press, release, held, pressed };
