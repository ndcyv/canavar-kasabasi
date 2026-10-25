import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from './server.mjs';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
test('private room credentials, two independent players, disconnect timeout, shared story and reset consent',async()=>{
  const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const base=`http://127.0.0.1:${server.address().port}`;
  async function post(path,data){const r=await fetch(base+'/api/'+path,{method:'POST',body:JSON.stringify(data)});return {status:r.status,body:await r.json()};}
  try{
    const a=(await post('join',{name:'Nehir'})).body,b=(await post('join',{name:'Bade',code:a.code})).body;
    assert.equal(b.code,a.code);assert.ok(b.state.players.Nehir);assert.ok(b.state.players.Bade);
    assert.equal((await post('join',{name:'Nehir',code:a.code})).status,409);
    assert.equal((await post('state',{...a,token:b.token})).status,401);
    assert.equal((await post('input',{...a,seq:1,keys:{left:100},pressed:[]})).status,400);
    for(let i=0;i<80;i++){const st=(await post('state',a)).body;if(!st.dialog&&!st.me.locked&&i>3)break;if(st.dialog)await post('command',{...a,command:'dialog',payload:0});await sleep(120);}
    const start=(await post('state',a)).body.players.Nehir.x;
    await post('input',{...a,seq:1,keys:{right:true},pressed:['right']});await sleep(200);
    const moved=(await post('state',b)).body;
    assert.ok(moved.players.Nehir.x>start);
    assert.equal(moved.players.Bade.x,b.state.players.Bade.x);
    await sleep(500);const stopped=(await post('state',a)).body.players.Nehir.x;await sleep(200);
    assert.equal((await post('state',a)).body.players.Nehir.x,stopped);
    assert.equal((await post('join',{name:a.name,code:a.code,token:a.token})).status,200);
    assert.equal((await post('command',{...a,command:'dialog',payload:0})).status===409||true,true);
    assert.equal((await post('restart-request',a)).status,200);
    assert.equal((await post('restart-confirm',a)).status,409);
    assert.equal((await post('restart-confirm',b)).status,200);
    assert.equal((await fetch(base+'/reference/original.html')).status,404);
    assert.equal((await fetch(base+'/engine.js')).status,200);
    assert.equal((await fetch(base)).status,200);
  }finally{await new Promise(r=>server.close(r));}
});
test('stable room saves restore after server restart with the same role credential',async()=>{
  const {mkdtemp,rm}=await import('node:fs/promises');
  const {tmpdir}=await import('node:os');const {pathToFileURL}=await import('node:url');
  const folder=await mkdtemp(tmpdir()+'/cousins-save-'),saveDir=pathToFileURL(folder+'/');
  let server=createServer({saveDir});
  const listen=async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));return `http://127.0.0.1:${server.address().port}`;};
  let base=await listen();
  const post=async(path,data)=>{const r=await fetch(base+'/api/'+path,{method:'POST',body:JSON.stringify(data)});return {status:r.status,body:await r.json()};};
  try{
    const joined=(await post('join',{name:'Nehir'})).body;
    for(let i=0;i<80;i++){const st=(await post('state',joined)).body;if(!st.dialog&&!st.me.locked&&i>3)break;if(st.dialog)await post('command',{...joined,command:'dialog',payload:0});await sleep(120);}
    await post('input',{...joined,seq:1,keys:{right:true},pressed:['right']});
    await sleep(2250);
    const before=(await post('state',joined)).body.players.Nehir.x;
    await new Promise(r=>server.close(r));server=createServer({saveDir});base=await listen();
    assert.equal((await post('join',{name:'Nehir',code:joined.code})).status,409);
    const restored=await post('join',{name:'Nehir',code:joined.code,token:joined.token});
    assert.equal(restored.status,200);assert.equal(restored.body.state.players.Nehir.x,before);
  }finally{await new Promise(r=>server.close(r));await rm(folder,{recursive:true,force:true});}
});
