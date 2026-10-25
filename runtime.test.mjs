import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRuntime} from './runtime.mjs';
const turn=()=>new Promise(r=>setImmediate(r));
const online=()=>({Nehir:{online:true,keys:{},pressed:{}},Bade:{online:true,keys:{},pressed:{}}});
function fresh(){const r=createRuntime(),e=r.engine,S=e.S;for(const n of ['Nehir','Bade'])S.pl[n].hints.opening=true;S.presence={Nehir:true,Bade:true};return {r,e,S};}
async function tick(e,players,n=1){for(let i=0;i<n;i++)await e.tickRoom(.05,players,turn);}
const pick=(...words)=>{let i=0;return d=>{const w=words[Math.min(i++,words.length-1)];const k=d.choices.findIndex(c=>c.includes(w));return k<0?0:k;};};
async function settle(e,S,players=online()){for(let i=0;i<60;i++){for(const n of ['Nehir','Bade']){S.active=n;if(S.dialog)e.closeDialog(S.dialog.choices?0:0);}await tick(e,players);}}
// run one girl's interaction to the end, answering her dialogs (and any of the cousin's)
async function action(r,id,who='Nehir',choose=()=>0){
  const e=r.engine,S=e.S,players=online();S.active=who;S.pl[who].talkQ=[];
  let done=false,error;Promise.resolve(e.interact(e.ent(id))).then(()=>done=true,x=>{error=x;done=true;});
  for(let i=0;i<4000&&!done;i++){
    for(const n of ['Nehir','Bade']){S.active=n;if(S.dialog)e.closeDialog(n===who&&S.dialog.choices?choose(S.dialog):0);}
    S.active=who;if(S.awaitDir){const d=S.dance.seq[S.dance.got.length];players[who].pressed[d]=true;}
    await tick(e,players);await turn();
  }
  await settle(e,S,players);
  if(error)throw error;assert.ok(done,`interaction ${id} completed`);assert.equal(r.errors.length,0,String(r.errors[0]));
}
const at=(S,who,x,y)=>Object.assign(S.chars[who],{x,y});
test('the whole Halloween story can be finished by the two girls, together',async()=>{
  const {r,e,S}=fresh();
  try{
    await action(r,'knock1','Nehir');assert.ok(S.flags.candyBag);
    await action(r,'knock2','Nehir',pick('Kedi'));assert.ok(!S.flags.tickets);
    await action(r,'knock2','Nehir',pick('Yarasa'));assert.ok(S.flags.tickets);
    // the train only leaves with both girls on board
    at(S,'Nehir',37,8.6);at(S,'Bade',6.5,8.6);
    await action(r,'kond','Nehir',pick('Binelim'));assert.ok(!S.flags.arrived,'train left without Bade');assert.ok(S.pl.Bade.call,'Bade was called');
    at(S,'Bade',36,8.6);
    await action(r,'kond','Nehir',pick('Binelim'));assert.ok(S.flags.arrived,'arrived');
    assert.ok(Math.hypot(S.chars.Nehir.x-S.chars.Bade.x,S.chars.Nehir.y-S.chars.Bade.y)<3,'both arrived at the station');
    assert.ok(S.chars.Bade.y>14&&S.chars.Bade.y<18,'Bade is at the station');
    assert.equal(S.shared,null);assert.equal(S.pl.Bade.locked,0);
    // Mimi: Nehir listens, Bade takes
    const right=S.flags.jarRight;
    await action(r,'jar'+(right+1),'Bade');assert.ok(!S.flags.bandage,'Bade took the jar without Nehir');
    await action(r,'jar'+(right+1),'Nehir');await action(r,'jar'+(right+1),'Bade');assert.ok(S.flags.bandage);
    await action(r,'mimi','Nehir');assert.ok(S.flags.lanterns.mimi);assert.equal(S.pl.Bade.hearts,3);
    // Kurtul: Bade lights the lamps, Nehir goes into the alley
    for(const l of ['lamp1','lamp2','lamp3'])await action(r,l,'Bade');
    await action(r,'kurtul','Bade');assert.ok(!S.flags.lanterns.kurtul);
    at(S,'Nehir',53.5,16.7);await action(r,'kurtul','Nehir');assert.ok(S.flags.lanterns.kurtul);
    // Frenk
    await action(r,'junk','Nehir');assert.ok(!S.flags.moved.junk);
    await action(r,'junk','Bade');await action(r,'bolt','Nehir');await action(r,'frenk','Bade');assert.ok(S.flags.lanterns.frenk);
    // Cemile
    await action(r,'cemile','Nehir');await action(r,'moonDrop','Bade');let k=0;await action(r,'cauldron','Bade',()=>[1,2,0][k++]);assert.ok(S.flags.potion);
    await action(r,'straw','Nehir');await action(r,'cemile','Nehir');assert.ok(S.flags.lanterns.cemile);
    // Hülya
    await action(r,'stone','Bade');await action(r,'musicBox','Bade');assert.ok(!S.flags.musicBox);
    await action(r,'musicBox','Nehir');await action(r,'hulya','Nehir');assert.ok(S.flags.lanterns.hulya);
    // Selo
    await action(r,'prints','Nehir');await action(r,'dig','Nehir');await action(r,'selo','Bade');assert.ok(S.flags.lanterns.selo);
    // Pıtırcık and the song
    await action(r,'pitir','Bade');await action(r,'bells','Bade');await action(r,'notes','Nehir');
    await action(r,'pitir','Nehir',pick('Çalalım'));assert.ok(S.flags.lanterns.pitir);assert.equal(S.flags.lanternCount,7);
    // the tower needs both girls side by side
    at(S,'Nehir',39.5,27.2);at(S,'Bade',20,20);
    await action(r,'bigLantern','Nehir');assert.ok(!S.flags.towerLit);
    at(S,'Bade',40.3,27.2);await action(r,'bigLantern','Nehir');assert.ok(S.flags.towerLit);
    // up to the cloud giant and back for the festival
    at(S,'Nehir',36.6,40.6);at(S,'Bade',37.6,40.6);
    await action(r,'heli','Bade',pick('Uçalım','Ayı hemen','Bizimle'));assert.ok(S.flags.skyDone);
    // the last train home
    at(S,'Nehir',38.4,17.6);at(S,'Bade',37.4,17.6);
    await action(r,'kond2','Bade',pick('Eve dönelim'));assert.ok(S.flags.homeBack);
    assert.equal(e.areaAt(S.chars.Nehir.x,S.chars.Nehir.y),'Mahalle');assert.equal(e.areaAt(S.chars.Bade.x,S.chars.Bade.y),'Mahalle');
    // Nehir arrives home first and waits for Bade
    at(S,'Nehir',81.5,6.6);S.pl.Nehir.area='';
    await settle(e,S);assert.notEqual(S.mode,'ending');assert.ok(S.pl.Bade.call,'Bade called home');
    at(S,'Bade',82.5,6.6);S.pl.Bade.area='';
    for(let i=0;i<3000&&S.mode!=='ending';i++){for(const n of ['Nehir','Bade']){S.active=n;if(S.dialog)e.closeDialog(0);}await tick(e,online());}
    assert.equal(S.mode,'ending');assert.ok(S.flags.finished);
    await settle(e,S);
    assert.match(e.packFor('Nehir').endingHtml,/AY GERİ DÖNDÜ|CANAVAR KASABASI/);
    assert.equal(r.errors.length,0,String(r.errors[0]));
  }finally{r.dispose();}
});
test('the cousin reads along during a shared scene and cannot walk away',async()=>{
  const {r,e,S}=fresh();
  try{
    S.flags.tickets=true;S.flags.candyBag=true;at(S,'Nehir',37,8.6);at(S,'Bade',36,8.6);
    S.active='Nehir';let done=false;Promise.resolve(e.interact(e.ent('kond'))).then(()=>done=true);
    let saw=false,lockedSeen=false;
    for(let i=0;i<3000&&!done;i++){
      const pk=e.packFor('Bade');if(pk.dialog&&pk.dialog.spectator)saw=true;if(pk.me.locked)lockedSeen=true;
      S.active='Nehir';if(S.dialog)e.closeDialog(0);
      await tick(e,online());await turn();
    }
    assert.ok(saw,'Bade saw the dialog as a spectator');assert.equal(e.commandRoom('Bade','dialog',0),false,'spectator cannot advance');assert.ok(lockedSeen,'Bade was held during the scene');
    await settle(e,S);assert.equal(S.pl.Bade.locked,0);
  }finally{r.dispose();}
});
test('hazards hurt only the girl who touches them; bats leave the bat alone',async()=>{
  const {r,e,S}=fresh();
  try{
    S.flags.arrived=true;const b=S.bats;
    at(S,'Nehir',b.x,b.y+0.6);for(let i=0;i<20;i++)await tick(e,online());assert.equal(S.pl.Nehir.hearts,3);
    at(S,'Bade',S.bats.x,S.bats.y+0.6);await tick(e,online());await settle(e,S);assert.ok(S.pl.Bade.hearts<3,'Bade pinched');assert.equal(S.pl.Nehir.hearts,3);
  }finally{r.dispose();}
});
