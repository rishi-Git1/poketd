import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REGIONS} from '../public/regions.js';
import {newRun,applyUpgrade,damageMultiplier,rollMasterCards,repeatPower,recruitmentPool,wavePlan} from '../public/engine.js';
import {regionalCards,transformationOptions,applyTransformation,canEvolve,evolveAlly,isTransformation} from '../public/transformations.js';
import {attackFor,attackCooldown} from '../public/attacks.js';
import {premiumOffers,isBuff,commitSwap} from '../public/campaign.js';
import {harness} from './flow-harness.mjs';
const roster=id=>JSON.parse(readFileSync(`public/assets/regions/${id}.json`));
const card={kind:'gmax',title:'Max Mushrooms'};
function fixture(ids,region='galar'){const data=roster(region),run=newRun(region);run.wave=25;for(const id of ids)applyUpgrade(run,{kind:'recruit',pokemon:data.find(p=>p.id===id),title:'Partner'});return {data,run}}
const apply=(f,key)=>applyTransformation(f.run,card,key,f.data,applyUpgrade);

test('all 34 genuine G-Max forms are Galar-only, have sprites and exact regional base stages',()=>{
 const data=roster('galar'),forms=data.filter(p=>p.gigantamax);
 assert.deepEqual(forms.map(p=>p.id),Array.from({length:34},(_,i)=>10195+i));
 for(const form of forms){const base=data.find(p=>p.id===form.gmaxFrom);assert.ok(base);assert.equal(form.stage,base.stage);assert.equal(form.next,null);assert.deepEqual(form.nextOptions,[]);assert.ok(form.bossOnly&&form.transformOnly&&form.evolutionLocked);assert.notEqual(form.speciesId,890);assert.ok(readFileSync('public/'+form.sprite).subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))}
 for(const region of REGIONS.filter(r=>r.id!=='galar'))assert.equal(roster(region.id).filter(p=>p.gigantamax).length,0);
});

test('Max Mushrooms unlock at 25 only for exact eligible forms, excluding Eternatus and unevolved preforms',()=>{
 const f=fixture([25,133,52,10161,890,10190]);f.run.wave=24;assert.deepEqual(regionalCards(f.run,f.data),[]);f.run.wave=25;assert.deepEqual(regionalCards(f.run,f.data).map(c=>c.kind),['gmax']);
 assert.deepEqual(transformationOptions(card,f.run,f.data).map(c=>[c.slot,c.form.id]),[[0,10199],[1,10205],[2,10200]]);
 const before=JSON.stringify(f.run);for(const key of ['3:10200','4:10190','5:10190'])assert.throws(()=>apply(f,key));assert.equal(JSON.stringify(f.run),before);
 const no=fixture([4,831,10161,890,10190]);assert.deepEqual(regionalCards(no.run,no.data),[]);
 for(const region of ['kanto','johto','hoenn','sinnoh','unova','kalos','paldea']){f.run.region=region;assert.deepEqual(transformationOptions(card,f.run,f.data),[])}
});

test('every G-Max transforms once, preserves damage/types/stage/buffs and unlocks its G-Max signature',()=>{
 for(const form of roster('galar').filter(p=>p.gigantamax)){
  const f=fixture([form.gmaxFrom]),ally=f.run.team[0],base=ally.pokemon;ally.totalDamage=98765;
  applyUpgrade(f.run,{kind:'type',type:base.types[0],title:'Type'});applyUpgrade(f.run,{kind:'stage',stage:base.stage,title:'Stage'});
  const initial=damageMultiplier(base,f.run);apply(f,`0:${form.id}`);
  assert.equal(ally.pokemon.id,form.id);assert.equal(ally.pokemon.stage,base.stage);assert.deepEqual(ally.pokemon.types,base.types);assert.equal(ally.totalDamage,98765);assert.equal(ally.gmaxCount,1);assert.ok(ally.evolutionLocked);assert.equal(canEvolve(ally),false);assert.ok(Math.abs(damageMultiplier(ally.pokemon,f.run)-initial*2)<1e-9);assert.equal(repeatPower(f.run),1);
  const move=attackFor(ally.pokemon);assert.match(move.name,/^G-Max /);assert.equal(move.signature,true);assert.ok(move.power>=attackFor(base).power);assert.ok(attackCooldown(ally.pokemon)<=attackCooldown(base));
  const before=JSON.stringify(f.run);assert.throws(()=>apply(f,`0:${form.id}`));assert.equal(JSON.stringify(f.run),before);assert.deepEqual(regionalCards(f.run,f.data),[]);
 }
});

test('Gigantamax Pikachu, Eevee and Meowth reject direct and stale evolution attempts without consuming upgrades',async()=>{
 for(const [id,gmax,next] of [[25,10199,26],[133,10205,134],[52,10200,53]]){
  const f=fixture([id]),ally=f.run.team[0];assert.equal(canEvolve(ally),true);apply(f,`0:${gmax}`);const before=JSON.stringify(f.run);
  for(const from of [id,gmax])assert.equal(applyUpgrade(f.run,{kind:'evolve',from,pokemon:f.data.find(p=>p.id===next),title:'Evolve'}),false);
  assert.equal(evolveAlly(ally,f.data.find(p=>p.id===next)),false);assert.equal(JSON.stringify(f.run),before);
  const h=await harness('galar');h.choose(0);h.run.team=[structuredClone(ally)];const entry={wave:25,cards:[{kind:'evolve',from:id,pokemon:f.data.find(p=>p.id===next),title:'Evolve'},{kind:'evolve',from:gmax,pokemon:f.data.find(p=>p.id===next),title:'Evolve'},{...card}]};h.refreshRewardCards(entry);assert.ok(entry.cards.every(c=>!['evolve','gmax'].includes(c.kind)));
 }
});

test('normal partners still evolve and both Toxtricity/Urshifu forms have exact G-Max paths',()=>{
 const f=fixture([25,848,891]);applyUpgrade(f.run,{kind:'evolve',from:25,pokemon:f.data.find(p=>p.id===26),title:'Evolve'});assert.equal(f.run.team[0].pokemon.id,26);
 assert.deepEqual(f.data.find(p=>p.id===848).nextOptions,[849,10184]);assert.deepEqual(f.data.find(p=>p.id===891).nextOptions,[892,10191]);
 for(const [base,id] of [[849,10219],[10184,10228],[892,10226],[10191,10227]]){const g=fixture([base]);assert.deepEqual(transformationOptions(card,g.run,g.data).map(c=>c.form.id),[id]);apply(g,`0:${id}`);assert.equal(g.run.team[0].pokemon.stage,2)}
});

test('G-Max forms cannot appear in normal recruits, premium trades, waves or master conversions',()=>{
 const f=fixture([6]);f.run.wave=100;
 assert.ok(recruitmentPool(f.data,f.run).every(p=>!p.gigantamax));for(let i=0;i<10;i++)assert.ok(premiumOffers('pokemon',f.run,f.data).every(c=>!c.pokemon.gigantamax));assert.ok(wavePlan(100,f.data).every(s=>!s.pokemon.gigantamax));
 const cards=[{...card},{kind:'offense',title:'Rally'},{kind:'health',title:'Health'}];assert.equal(rollMasterCards(cards,f.run,()=>0)[0].kind,'gmax');assert.ok(isTransformation(card));assert.equal(isBuff(card),false);
});

test('Max Mushrooms picker cancels freely and applies during combat without pausing or resetting damage',async()=>{
 const h=await harness('galar'),data=roster('galar');h.el('auto').click();h.choose(0);h.run.team[0].pokemon=data.find(p=>p.id===25);h.run.team[0].totalDamage=1234;
 const enemies=h.enemies;h.run.wave=25;h.run.rewardQueue=[{wave:25,cards:[{...card},{kind:'offense',title:'Rally'},{kind:'armor',title:'Armor'}]}];h.renderPendingRewards();h.choose(0);
 assert.equal(h.el('transform-dialog').open,true);assert.match(h.el('transform-options').innerHTML,/Permanent: this partner can never evolve/);assert.match(h.el('transform-options').innerHTML,/pikachu-gmax/);assert.equal(h.run.rewardQueue.length,1);h.closeTransformation();assert.equal(h.run.rewardQueue.length,1);
 h.choose(0);h.chooseTransformation('0:10199');assert.equal(h.el('transform-dialog').open,false);assert.equal(h.run.rewardQueue.length,0);assert.equal(h.run.team[0].pokemon.id,10199);assert.equal(h.run.team[0].totalDamage,1234);assert.equal(h.run.phase,'battle');assert.equal(h.paused,false);assert.equal(h.enemies,enemies);assert.match(h.el('party').innerHTML,/GIGANTAMAX · EVOLUTION LOCKED/);
});

test('used partners disappear from later Mushroom pickers while other eligible partners remain',()=>{
 const f=fixture([25,133]);apply(f,'0:10199');assert.deepEqual(transformationOptions(card,f.run,f.data).map(c=>c.slot),[1]);assert.equal(regionalCards(f.run,f.data).length,1);apply(f,'1:10205');assert.deepEqual(regionalCards(f.run,f.data),[]);
 commitSwap(f.run,'pokemon',0,{kind:'recruit',pokemon:f.data.find(p=>p.id===52),title:'Meowth'},applyUpgrade);assert.equal(f.run.team[0].gmaxCount,undefined);assert.equal(canEvolve(f.run.team[0]),true);assert.deepEqual(transformationOptions(card,f.run,f.data).map(c=>c.form.id),[10200]);
});
