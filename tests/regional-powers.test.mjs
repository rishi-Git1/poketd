import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newRun,applyUpgrade,ALL_TACTICS,lateUpgrades,masterUpgrades,damageMultiplier,damage,repeatPower,repeatCount} from '../public/engine.js';
import {removeBuff,premiumOffers,campaignPlan,commitSwap} from '../public/campaign.js';
import {regionalCards,transformationOptions,applyTransformation,regionalImpact,TERA_TYPES} from '../public/transformations.js';
import {attackFor,attackCooldown} from '../public/attacks.js';
import {harness} from './flow-harness.mjs';
const roster=id=>JSON.parse(readFileSync(`public/assets/regions/${id}.json`));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(b)),`${a} != ${b}`);
function fixture(region,ids){const data=roster(region),run=newRun(region);run.wave=80;for(const id of ids)applyUpgrade(run,{kind:'recruit',pokemon:data.find(p=>p.id===id),title:'Partner'});return {run,data}}
const transform=(f,card,key)=>applyTransformation(f.run,card,key,f.data,applyUpgrade);
test('every repeated passive upgrade guarantees more party damage even if its conditional effect cannot help',()=>{
 const f=fixture('kanto',[1]),p=f.run.team[0].pokemon;
 for(const card of [...ALL_TACTICS,{kind:'offense',title:'Rally'},{kind:'health',title:'Health'},{kind:'armor',title:'Armor'},{kind:'type',type:'grass',title:'Grass'},{kind:'stage',stage:1,title:'Stage 1'}]){
  const r=newRun();applyUpgrade(r,card);const first=damageMultiplier(p,r);applyUpgrade(r,card);assert.ok(damageMultiplier(p,r)>=first*1.1-1e-9,card.kind);near(repeatPower(r),1.1);applyUpgrade(r,{...card,master:true,amount:card.kind==='health'?200:card.kind==='armor'?.4:card.kind==='offense'?.5:['type','stage'].includes(card.kind)?.8:2});near(repeatPower(r),1.21);removeBuff(r,2);near(repeatPower(r),1.1);removeBuff(r,1);near(repeatPower(r),1);
 }
});
test('range cards are absent from every reward tier and banked inactive buffs are replaced',async()=>{
 const {run,data}=fixture('paldea',[909]);for(const wave of [1,25,51,80,81,150]){run.wave=wave;assert.ok(!lateUpgrades(run).some(c=>c.kind==='reach'));assert.ok(!masterUpgrades(run).some(c=>c.kind==='reach'));for(let i=0;i<30;i++)assert.ok(!premiumOffers('upgrade',run,data).some(c=>c.kind==='reach'))}
 const h=await harness();h.choose(1);const q={wave:50,cards:[{kind:'reach',title:'Long Reach'},{kind:'type',type:'water',title:'Water'},{kind:'stage',stage:3,title:'Stage 3'}]};h.refreshRewardCards(q);assert.ok(q.cards.every(c=>['offense','health','armor'].includes(c.kind)));
});
test('all bundled Mega forms are restricted to Hoenn and Kalos and preserve their regional base stage',()=>{
 for(const region of ['kanto','johto','hoenn','sinnoh','unova','kalos','galar','paldea']){
  const data=roster(region),megas=data.filter(p=>p.mega);if(!['hoenn','kalos'].includes(region)){assert.equal(megas.length,0);continue}assert.ok(megas.length>20);for(const p of megas){assert.equal(p.stage,data.find(base=>base.id===p.megaFrom).stage);assert.equal(p.next,null);assert.ok(p.bossOnly)}
 }
});
test('Mega Heracross stays stage 1, Mega Medicham stays stage 2, and repeated Mega use is rejected',()=>{
 const f=fixture('hoenn',[214,308]);f.run.team[0].totalDamage=1234;const card={kind:'mega',title:'Mega Evolution'};
 for(const [slot,id,stage]of [[0,10047,1],[1,10054,2]]){const choice=transformationOptions(card,f.run,f.data).find(c=>c.slot===slot&&c.form.id===id);transform(f,card,choice.key);assert.equal(f.run.team[slot].pokemon.stage,stage);assert.equal(f.run.team[slot].pokemon.id,id)}
 const first=damageMultiplier(f.run.team[0].pokemon,f.run);assert.throws(()=>transform(f,card,'0:10047'));near(damageMultiplier(f.run.team[0].pokemon,f.run),first);assert.deepEqual(transformationOptions(card,f.run,f.data),[]);assert.equal(f.run.team[0].totalDamage,1234);assert.equal(f.run.team[0].pokemon.stage,1);assert.equal(repeatPower(f.run),1);
});
test('Mega X/Y choice locks after one use without adding an evolution stage or changing native data',()=>{
 const f=fixture('kalos',[6]),card={kind:'mega',title:'Mega Evolution'};transform(f,card,'0:10034');assert.deepEqual(f.run.team[0].pokemon.types,['fire','dragon']);assert.throws(()=>transform(f,card,'0:10035'));assert.deepEqual(f.run.team[0].pokemon.types,['fire','dragon']);near(f.run.team[0].pokemon.personalPower,1.25);assert.equal(f.run.team[0].pokemon.stage,3);assert.deepEqual(f.data.find(p=>p.id===6).types,['fire','flying']);
});
test('Hoenn and Kalos round-150 bosses use actual Mega Rayquaza and Mega Zygarde forms',()=>{
 for(const [region,id,name,hp] of [['hoenn',10079,'rayquaza-mega',105],['kalos',10301,'zygarde-mega',216]]){const data=roster(region),plan=campaignPlan(150,data,0,region);assert.equal(plan[0].pokemon.id,id);assert.equal(plan[0].pokemon.name,name);assert.equal(plan[0].pokemon.stats.hp,hp);assert.ok(plan[0].pokemon.mega);assert.equal(plan[0].pokemon.stage,1)}
});
test('Tera keeps both original types and their buffs; changing its added type removes only the previous Tera influence',()=>{
 const f=fixture('paldea',[887]),ally=f.run.team[0];for(const type of ['dragon','ghost','fire','water'])applyUpgrade(f.run,{kind:'type',type,title:type});
 transform(f,{kind:'tera',type:'fire',title:'Fire Crystal'},'0:fire');assert.deepEqual(ally.pokemon.types,['dragon','ghost','fire']);near(damageMultiplier(ally.pokemon,f.run),1.35**3*1.2);
 transform(f,{kind:'tera',type:'water',title:'Water Crystal'},'0:water');assert.deepEqual(ally.pokemon.types,['dragon','ghost','water']);near(damageMultiplier(ally.pokemon,f.run),1.35**3*1.2**2);assert.equal(ally.pokemon.stage,3);near(f.run.types.fire,.35);assert.equal(attackFor(ally.pokemon).type,'water');assert.equal(ally.pokemon.types.length,3);
});
test('same active Tera type is rejected, a different Tera is allowed, and power persists through normal evolution',()=>{
 const f=fixture('paldea',[909]),ally=f.run.team[0],card={kind:'tera',type:'fire',title:'Fire Crystal'};applyUpgrade(f.run,{kind:'type',type:'fire',title:'Fire'});transform(f,card,'0:fire');const first=damageMultiplier(ally.pokemon,f.run);assert.throws(()=>transform(f,card,'0:fire'));near(damageMultiplier(ally.pokemon,f.run),first);transform(f,{kind:'tera',type:'water',title:'Water Crystal'},'0:water');assert.deepEqual(ally.pokemon.types,['fire','water']);near(damageMultiplier(ally.pokemon,f.run),1.35*1.2**2);ally.totalDamage=900;applyUpgrade(f.run,{kind:'evolve',from:909,pokemon:f.data.find(p=>p.id===910),title:'Evolve'});assert.equal(ally.pokemon.id,910);assert.equal(ally.pokemon.teraType,'water');assert.equal(ally.pokemon.teraCount,2);assert.equal(ally.pokemon.stage,2);assert.equal(ally.totalDamage,900);
});
test('Ogerpon offers only its four masks, changes Ivy Cudgel type, and replaces its prior mask aura',()=>{
 const f=fixture('paldea',[1017]),ally=f.run.team[0];assert.deepEqual(regionalCards(f.run,f.data).map(c=>c.type).sort(),['fire','grass','rock','water']);
 const enemy=special=>({pokemon:{stats:{attack:special?50:100,'special-attack':special?100:50}}});
 for(const [type,id]of [['water',10273],['fire',10274],['grass',1017],['rock',10275]]){transform(f,{kind:'tera',type,title:'Crystal'},`0:${type}`);assert.equal(ally.pokemon.id,id);assert.equal(attackFor(ally.pokemon).name,'Ivy Cudgel');assert.equal(attackFor(ally.pokemon).type,type);assert.equal(ally.pokemon.stage,1);if(type==='water'){assert.ok(regionalImpact(f.run,enemy(true),100)<100);assert.equal(regionalImpact(f.run,enemy(false),100),100)}if(type==='fire'){near(damageMultiplier(ally.pokemon,f.run),1.2**2*1.5);assert.equal(regionalImpact(f.run,enemy(true),100),100)}if(type==='grass')assert.ok(attackCooldown(ally.pokemon)<attackCooldown(f.data.find(p=>p.id===1017)));if(type==='rock'){assert.equal(regionalImpact(f.run,enemy(true),100),100);assert.ok(regionalImpact(f.run,enemy(false),100)<100)}}
});
test('Terapagos keeps special Stellar typing and Tera Starstorm but cannot repeat its active Tera type',()=>{
 const f=fixture('paldea',[1024]),ally=f.run.team[0];assert.equal(regionalCards(f.run,f.data).length,1);assert.equal(regionalCards(f.run,f.data)[0].type,'stellar');const card={kind:'tera',type:'stellar',title:'Stellar Crystal'},enemy={pokemon:{stats:{attack:100,'special-attack':50}}};transform(f,card,'0:stellar');assert.equal(ally.pokemon.id,10277);assert.deepEqual(ally.pokemon.types,['normal','stellar']);assert.equal(attackFor(ally.pokemon).name,'Tera Starstorm');assert.equal(attackFor(ally.pokemon).type,'stellar');assert.equal(regionalImpact(f.run,enemy,100),0);assert.equal(regionalImpact(f.run,enemy,100),100);assert.throws(()=>transform(f,card,'0:stellar'));assert.equal(ally.zeroCharges,0);assert.deepEqual(regionalCards(f.run,f.data),[]);near(ally.pokemon.personalPower,1.2);
});
test('Stellar attacks are neutral against normal targets and stronger against Terastallized targets',()=>{
 const f=fixture('paldea',[1024]);transform(f,{kind:'tera',type:'stellar',title:'Stellar'},'0:stellar');const p=f.run.team[0],enemy={pokemon:f.data.find(p=>p.id===19)||f.data.find(p=>!p.bossOnly),defense:100,specialDefense:100};const normal=damage(p,enemy,f.run,'stellar');near(damage(p,{...enemy,pokemon:{...enemy.pokemon,teraType:'fire'}},f.run,'stellar'),normal*2);
});
test('regional card selection is two-step, cancel preserves the reward, and choosing a target applies during combat without pausing',async()=>{
 const h=await harness('paldea');h.choose(1);h.run.wave=25;h.startWave();h.tick(.25);const enemies=h.enemies;h.run.rewardQueue=[{wave:25,cards:[{kind:'tera',type:'water',title:'Water Tera Crystal'},{kind:'offense',title:'Rally'},{kind:'armor',title:'Armor'}]}];h.renderPendingRewards();h.choose(0);assert.equal(h.el('transform-dialog').open,true);assert.equal(h.run.team[0].teraCount,undefined);assert.equal(h.run.rewardQueue.length,1);h.closeTransformation();assert.equal(h.run.rewardQueue.length,1);h.choose(0);h.chooseTransformation('0:water');assert.equal(h.el('transform-dialog').open,false);assert.equal(h.run.rewardQueue.length,0);assert.equal(h.run.team[0].teraCount,1);assert.equal(h.run.phase,'battle');assert.equal(h.paused,false);assert.equal(h.enemies,enemies);assert.deepEqual(h.run.team[0].pokemon.types,['fire','water']);
});
test('Mega controller targeting is one-time, retains stage and totals, and changing regions clears transformations',async()=>{
 const h=await harness('hoenn'),data=roster('hoenn');h.choose(0);h.run.team[0].pokemon=data.find(p=>p.id===214);h.run.team[0].totalDamage=123;h.run.wave=25;h.run.rewardQueue=[{wave:25,cards:[{kind:'mega',title:'Mega Evolution'},{kind:'offense',title:'Rally'},{kind:'armor',title:'Armor'}]}];h.renderPendingRewards();h.choose(0);assert.equal(h.el('transform-dialog').open,true);h.chooseTransformation('0:10047');assert.equal(h.run.team[0].megaCount,1);assert.equal(h.run.team[0].pokemon.stage,1);assert.equal(h.run.team[0].totalDamage,123);
 const stale={wave:26,cards:[{kind:'mega',title:'Mega Evolution'},{kind:'offense',title:'Rally'},{kind:'armor',title:'Armor'}]};h.refreshRewardCards(stale);assert.ok(stale.cards.every(c=>c.kind!=='mega'));await h.selectRegion('johto');assert.equal(h.run.team.length,0);assert.equal(h.el('transform-dialog').open,false);assert.equal(h.run.phase,'starter');
});
test('one available enemy takes full Split Volley damage; repeated split still gains repeat resonance',async()=>{
 const h=await harness();h.choose(1);h.startWave();const ally=h.run.team[0];ally.cooldown=100;h.tick(.7);for(const e of h.enemies){e.x=950;e.y=345;e.speed=0;e.hp=e.maxHp=1e6}const target=h.enemies[0];target.x=650;applyUpgrade(h.run,{kind:'split',title:'Split'});applyUpgrade(h.run,{kind:'split',title:'Split'});const expected=damage(ally,target,h.run,'fire');ally.cooldown=0;h.tick(.001);for(let i=0;i<100;i++){ally.cooldown=100;h.tick(.01)}near(1e6-target.hp,expected);near(repeatPower(h.run),1.1);
});
test('Stellar Terapagos refreshes its single Teraform Zero charge each round in the real controller',async()=>{
 const h=await harness('paldea'),data=roster('paldea');h.choose(1);h.run.team[0].pokemon=data.find(p=>p.id===1024);h.run.wave=25;
 for(let i=0;i<1;i++){h.run.rewardQueue=[{wave:25+i,cards:[{kind:'tera',type:'stellar',title:'Stellar Tera Crystal'},{kind:'offense',title:'Rally'},{kind:'armor',title:'Armor'}]}];h.renderPendingRewards();h.choose(0);h.chooseTransformation('0:stellar')}
 const enemy={pokemon:{stats:{attack:100,'special-attack':50}}};regionalImpact(h.run,enemy,100);regionalImpact(h.run,enemy,100);assert.equal(h.run.team[0].zeroCharges,0);h.run.phase='ready';h.startWave();assert.equal(h.run.team[0].zeroCharges,1);
});
test('regional card gates reject transformations outside the supported regions without mutating the team',()=>{
 const f=fixture('johto',[214]),before=JSON.stringify(f.run);assert.deepEqual(regionalCards(f.run,f.data),[]);assert.throws(()=>transform(f,{kind:'mega',title:'Mega'},'0:10047'));assert.throws(()=>transform(f,{kind:'tera',type:'fire',title:'Tera'},'0:fire'));assert.equal(JSON.stringify(f.run),before);
});
