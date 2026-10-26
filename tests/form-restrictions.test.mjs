import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newRun,applyUpgrade,damageMultiplier} from '../public/engine.js';
import {applyTransformation,transformationOptions,regionalCards} from '../public/transformations.js';
import {attackFor,attackCooldown} from '../public/attacks.js';
import {harness} from './flow-harness.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(b)),`${a} != ${b}`);
function setup(region,ids){const data=JSON.parse(readFileSync(`public/assets/regions/${region}.json`)),run=newRun(region);run.wave=25;for(const id of ids)applyUpgrade(run,{kind:'recruit',pokemon:data.find(p=>p.id===id),title:'Partner'});return {run,data}}
const tera=(f,slot,type)=>applyTransformation(f.run,{kind:'tera',type,title:type},`${slot}:${type}`,f.data,applyUpgrade);
test('ordinary Stellar keeps native types, move and cooldown; its 20% damage bonus leaves no permanent stack',()=>{
 const f=setup('paldea',[887]),a=f.run.team[0],baseMove=attackFor(a.pokemon),baseCooldown=attackCooldown(a.pokemon);applyUpgrade(f.run,{kind:'type',type:'dragon',title:'Dragon'});
 tera(f,0,'stellar');assert.deepEqual(a.pokemon.types,['dragon','ghost']);assert.deepEqual(attackFor(a.pokemon),baseMove);near(attackCooldown(a.pokemon),baseCooldown);near(damageMultiplier(a.pokemon,f.run),1.35*1.2);assert.equal(a.pokemon.teraPowerCount,0);assert.equal(a.pokemon.stellarBoost,1.2);
 tera(f,0,'water');assert.deepEqual(a.pokemon.types,['dragon','ghost','water']);near(a.pokemon.personalPower,1.2);assert.equal(a.pokemon.stellarBoost,1);assert.equal(a.pokemon.teraPowerCount,1);near(attackCooldown(a.pokemon),baseCooldown*.97);
});
test('switching Fire to Stellar removes the old added type; Stellar cycling cannot farm permanent power or speed',()=>{
 const f=setup('paldea',[887]),a=f.run.team[0],baseCooldown=attackCooldown(a.pokemon);applyUpgrade(f.run,{kind:'type',type:'fire',title:'Fire'});tera(f,0,'fire');near(damageMultiplier(a.pokemon,f.run),1.35*1.2);tera(f,0,'stellar');assert.deepEqual(a.pokemon.types,['dragon','ghost']);near(damageMultiplier(a.pokemon,f.run),1.2*1.2);assert.equal(a.teraPowerCount,1);near(attackCooldown(a.pokemon),baseCooldown*.97);tera(f,0,'water');assert.equal(a.teraPowerCount,2);assert.equal(a.pokemon.stellarBoost,1);tera(f,0,'stellar');assert.equal(a.teraPowerCount,2);near(a.pokemon.personalPower,1.2**2*1.2);near(attackCooldown(a.pokemon),baseCooldown*.97**2);
});
test('all current Tera types are rejected without mutations, including ordinary Stellar and Terapagos',()=>{
 for(const [id,type]of [[887,'water'],[887,'stellar'],[1017,'fire'],[1024,'stellar']]){const f=setup('paldea',[id]);tera(f,0,type);const before=JSON.stringify(f.run);assert.deepEqual(transformationOptions({kind:'tera',type},f.run,f.data),[]);assert.throws(()=>tera(f,0,type));assert.equal(JSON.stringify(f.run),before);if(id===1024){assert.equal(f.run.team[0].pokemon.id,10277);assert.deepEqual(f.run.team[0].pokemon.types,['normal','stellar']);assert.equal(attackFor(f.run.team[0].pokemon).type,'stellar')}}
});
test('already-Mega partners are omitted while another eligible partner can still Mega Evolve once',()=>{
 const f=setup('hoenn',[214,308]),card={kind:'mega',title:'Mega Evolution'};applyTransformation(f.run,card,'0:10047',f.data,applyUpgrade);assert.ok(transformationOptions(card,f.run,f.data).every(c=>c.slot===1));assert.ok(regionalCards(f.run,f.data).some(c=>c.kind==='mega'));const before=JSON.stringify(f.run);assert.throws(()=>applyTransformation(f.run,card,'0:10047',f.data,applyUpgrade));assert.equal(JSON.stringify(f.run),before);applyTransformation(f.run,card,'1:10054',f.data,applyUpgrade);assert.ok(!regionalCards(f.run,f.data).some(c=>c.kind==='mega'));
});
test('ordinary Stellar remains temporary through normal evolution without changing evolution stages or damage totals',()=>{
 const f=setup('paldea',[909]),a=f.run.team[0];tera(f,0,'stellar');a.totalDamage=123;applyUpgrade(f.run,{kind:'evolve',from:909,pokemon:f.data.find(p=>p.id===910),title:'Evolution'});assert.equal(a.pokemon.stage,2);assert.deepEqual(a.pokemon.types,['fire']);near(a.pokemon.personalPower,1.2);assert.equal(a.pokemon.teraPowerCount,0);assert.equal(a.totalDamage,123);tera(f,0,'water');near(a.pokemon.personalPower,1.2);assert.equal(a.pokemon.stellarBoost,1);assert.equal(a.totalDamage,123);
});
test('the live reward picker removes an already-active Tera choice but still offers another partner',async()=>{
 const h=await harness('paldea');h.choose(1);h.run.wave=25;h.run.rewardQueue=[{wave:25,cards:[{kind:'tera',type:'stellar',title:'Stellar'},{kind:'offense',title:'Rally'},{kind:'armor',title:'Armor'}]}];h.renderPendingRewards();h.choose(0);h.chooseTransformation('0:stellar');const a=h.run.team[0];assert.deepEqual(a.pokemon.types,['fire']);near(a.pokemon.personalPower,1.2);const q={wave:26,cards:[{kind:'tera',type:'stellar',title:'Stellar'},{kind:'offense',title:'Rally'},{kind:'armor',title:'Armor'}]};h.refreshRewardCards(q);assert.ok(q.cards.every(c=>c.kind!=='tera'));const data=JSON.parse(readFileSync('public/assets/regions/paldea.json'));applyUpgrade(h.run,{kind:'recruit',pokemon:data.find(p=>p.id===912),title:'Quaxly'});assert.deepEqual(transformationOptions({kind:'tera',type:'stellar'},h.run,data).map(c=>c.slot),[1]);
});
