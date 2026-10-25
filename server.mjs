import http from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, sep } from 'node:path';
import { createRuntime } from './runtime.mjs';

const TTL = 30 * 60 * 1000;
const flush = () => new Promise(r => setImmediate(r));
const randomToken = () => randomBytes(24).toString('hex');
function fail(message, status = 400) { throw Object.assign(new Error(message), { status }); }
export function createServer({ saveDir = null } = {}) {
  const rooms = new Map();
  let lastTick = performance.now(), saving = false;
  function publicState(room, name) {
    const pack = room.runtime.engine.packFor(name), now = Date.now();
    const chars = room.runtime.engine.S.chars;
    const players = Object.fromEntries(['Nehir','Bade'].map(n => [n, { x: chars[n].x, y: chars[n].y, online: !!room.players[n] && now - room.players[n].seen < 5000 }]));
    return { ...pack, players, revision: room.revision, saveError:room.saveError || false };
  }
  async function persist() {
    if (!saveDir || saving) return; saving = true;
    try {
      await mkdir(saveDir, { recursive:true });
      for (const [code,room] of rooms) {
        const { S, storyBusy, savedState } = room.runtime.engine;
        // Never persist half a puzzle or a consumed item before its scene completes.
        if ((storyBusy('Nehir') || storyBusy('Bade')) && !(S.mode === 'ending' && S.flags.finished)) continue;
        const data = { ...savedState(), players:Object.fromEntries(Object.entries(room.players).map(([name,p]) => [name,{ token:p.token }])) };
        try { await writeFile(new URL(`${code}.tmp`,saveDir),JSON.stringify(data), { mode:0o600 }); await rename(new URL(`${code}.tmp`,saveDir),new URL(`${code}.json`,saveDir)); room.saveError = false; }
        catch(e) { room.saveError = true; console.error('Room save failed:',e.message); }
      }
    } finally { saving = false; }
  }
  const server = http.createServer(async (req,res) => {
    const reply = (status,body) => { if(res.headersSent)return; res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(body)); };
    try {
      const url = new URL(req.url,'http://localhost');
      if (req.method === 'POST' && url.pathname.startsWith('/api/')) {
        if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}` && req.headers.origin !== `https://${req.headers.host}`) fail('Geçersiz kaynak.',403);
        let raw = ''; for await(const chunk of req) { raw += chunk; if(raw.length > 4096) fail('İstek çok büyük.',413); }
        let data; try { data=JSON.parse(raw); } catch { fail('Geçersiz istek.'); }
        if(!data || typeof data !== 'object') fail('Geçersiz istek.');
        const now=Date.now();
        if(url.pathname === '/api/join') {
          if(!['Nehir','Bade'].includes(data.name)) fail('Bir kahraman seç.');
          let code=typeof data.code === 'string' ? data.code.trim().toUpperCase() : '', room;
          if(code && !/^[0-9A-F]{8}$/.test(code)) fail('Oda kodu sekiz harf veya rakam olmalı.');
          if(!code) {
            if(rooms.size>=100) fail('Sunucu dolu.',503);
            do { code=randomBytes(4).toString('hex').toUpperCase(); } while(rooms.has(code));
            room={ players:{}, updated:now, revision:0, runtime:createRuntime() }; rooms.set(code,room);
          } else {
            room=rooms.get(code);
            if(!room && saveDir) {
              try {
                const saved=JSON.parse(await readFile(new URL(`${code}.json`,saveDir),'utf8'));
                if(rooms.size>=100) fail('Sunucu dolu.',503);
                room={ players:{},updated:now,revision:0,runtime:createRuntime(saved) };
                for(const [name,p] of Object.entries(saved.players || {})) room.players[name]={ token:p.token,seen:0,seq:-1,keys:{},pressed:{} };
                rooms.set(code,room);
              } catch(e) { if(e.status)throw e; if(e.code !== 'ENOENT') console.error('Could not restore room:',e.message); }
            }
            if(!room) fail('Oda bulunamadı. Kodu kontrol et.',404);
          }
          const prior=room.players[data.name];
          if(prior && prior.token !== data.token) fail('Bu kahraman seçilmiş. Diğer kahramanı seç.',409);
          const p=prior || { token:randomToken() };
          Object.assign(p,{ seen:now, inputAt:now, seq:-1, keys:{},pressed:{} }); room.players[data.name]=p; room.updated=now;
          return reply(200,{ code,token:p.token,name:data.name,state:publicState(room,data.name) });
        }
        const room=rooms.get(data.code),p=room?.players[data.name];
        if(!p || p.token !== data.token) fail('Oturum bulunamadı. Oda koduyla tekrar katıl.',401);
        p.seen=now;room.updated=now;
        if(url.pathname === '/api/input') {
          if(!Number.isSafeInteger(data.seq) || !data.keys || typeof data.keys !== 'object' || !Array.isArray(data.pressed) || data.pressed.length>5) fail('Geçersiz hareket.');
          const allowed=['left','right','up','down','act'];
          if(Object.keys(data.keys).some(k=>!allowed.includes(k) || typeof data.keys[k] !== 'boolean') || data.pressed.some(k=>!allowed.includes(k))) fail('Geçersiz hareket.');
          if(data.seq>p.seq) { p.seq=data.seq; p.keys=data.keys; p.inputAt=now; for(const k of data.pressed)p.pressed[k]=true; }
        } else if(url.pathname === '/api/command') {
          if(!room.runtime.engine.commandRoom(data.name,data.command,data.payload)) fail('Bu işlem artık geçerli değil.',409);
        } else if(url.pathname === '/api/restart-request') {
          room.restartRequest={ name:data.name,at:now };
        } else if(url.pathname === '/api/restart-confirm') {
          const r=room.restartRequest;
          if(!r || r.name === data.name || now-r.at>30000) fail('İki oyuncunun da sıfırlamayı onaylaması gerekiyor.',409);
          room.runtime.dispose();room.runtime=createRuntime();room.restartRequest=null;room.generation=(room.generation || 0)+1;
        } else if(url.pathname !== '/api/state') fail('Bulunamadı.',404);
        room.revision++;
        const pack=publicState(room,data.name);
        pack.restartRequest=room.restartRequest && now-room.restartRequest.at<30000 ? room.restartRequest.name : null;
        pack.generation=room.generation || 0;
        return reply(200,pack);
      }
      if(req.method !== 'GET') fail('Bulunamadı.',404);
      if(url.pathname === '/healthz') return reply(200,{status:'ok'});
      const files={'/':['index.html','text/html'],'/engine.js':['engine.js','text/javascript'],'/multiplayer.js':['multiplayer.js','text/javascript']};
      const file=files[url.pathname]; if(!file)fail('Bulunamadı.',404);
      res.writeHead(200,{'Content-Type':`${file[1]}; charset=utf-8`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'"});
      res.end(await readFile(new URL(`./public/${file[0]}`,import.meta.url)));
    } catch(e) { if(!e.status)console.error(e); reply(e.status || 500,{error:e.status ? e.message : 'Sunucu hatası.'}); }
  });
  const tick=setInterval(()=>{
    const now=Date.now(),mono=performance.now(),dt=Math.min(.05,(mono-lastTick)/1000);lastTick=mono;
    for(const [code,room] of rooms) {
      if(now-room.updated>TTL){ room.runtime.dispose();rooms.delete(code);continue; }
      for(const p of Object.values(room.players)){ p.online=now-p.seen<5000;if(now-p.inputAt>350)p.keys={};if(!p.online)p.pressed={}; }
      room.runtime.engine.tickRoom(dt,room.players,flush).catch(e=>console.error('Game tick:',e));
    }
  },25);tick.unref();
  const saves=setInterval(()=>persist().catch(e=>console.error('Saving:',e)),2000);saves.unref();
  server.on('close',()=>{clearInterval(tick);clearInterval(saves);for(const room of rooms.values())room.runtime.dispose();});
  return server;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const port=Number(process.env.PORT || 3000);
  const saveDir=process.env.SAVE_DIR ? pathToFileURL(resolve(process.env.SAVE_DIR)+sep) : new URL('../../work/room-saves/',import.meta.url);
  createServer({ saveDir }).listen(port,process.env.HOST || '127.0.0.1',()=>console.log(`Game running on port ${port}`));
}
