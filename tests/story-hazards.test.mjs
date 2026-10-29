import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REGIONS} from '../public/regions.js';
import {newRun,applyUpgrade,enemyStats,storyScaling,drawDistinct,distinctRoll,rollMasterCards,repeatPower} from '../public/engine.js';
import {bossFor,campaignPlan,isBuff} from '../public/campaign.js';
import {HAZARDS,hazardUpgrades,hazardStacks,hazardHealthFactor,applyEntryHazards,advanceHazards,hazardPlacements,drawHazards,hazardArt} from '../public/hazards.js';
import {relevantUpgrades} from '../public/party-details.js';
import {harness} from './flow-harness.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9*Math.max(1,Math.abs(b)),`${a} != ${b}`),dex=region=>JSON.parse(readFileSync(`public/assets/regions/${region}.json`));
const install=(run,kind)=>applyUpgrade(run,{...HAZARDS.find(c=>c.kind===kind)});

test('every scripted boss in every region retains the doubled story health, with additional finale boosts in both regional modes',()=>{
 for(const r of REGIONS)for(const original of r.bosses)for(const mode of ['classic','endless']){
  const b=bossFor(original.wave,r.starters[0],r.id);assert.equal(b.story,true);
  for(const id of b.team){const p=dex(r.id).find(p=>p.id===id),stats=enemyStats(p,b.wave,b,mode,r.id),withoutExtraHealth=enemyStats(p,b.wave,{...b,story:false},mode,r.id);near(stats.maxHp,withoutExtraHealth.maxHp*(b.final?6:2));near(stats.speed,withoutExtraHealth.speed*(b.final?2:1));for(const key of ['defense','specialDefense','impact'])assert.equal(stats[key],withoutExtraHealth[key]);}
 }
});
test('story scaling starts strictly after 100, increases both defenses/HP/impact by 2% and speed by a linear 0.5%, then stops at the finale',()=>{
 const p=dex('sinnoh')[0];
 for(const region of REGIONS.map(r=>r.id))for(const mode of ['classic','endless'])for(const wave of [1,99,100,101,125,150,151,152,200]){
  const r=REGIONS.find(r=>r.id===region),n=Math.max(0,Math.min(wave,r.rounds)-100),story=storyScaling(wave,mode,region);near(story.power,1.02**n);near(story.speed,1+.005*n);
 }
 for(const wave of [100,101,125,150]){const s=enemyStats(p,wave),power=1.02**Math.max(0,wave-100);near(s.maxHp,(p.stats.hp*.53+9)*1.115**(wave-1)*power);near(s.defense,p.stats.defense*(1+.025*wave)*power);near(s.specialDefense,p.stats['special-defense']*(1+.025*wave)*power);near(s.speed,(10+p.stats.speed*.115+wave*.35)*(1+.005*Math.max(0,wave-100)));assert.equal(s.impact,Math.ceil(Math.max(p.stats.attack,p.stats['special-attack'])*.12*(1+.07*wave)*power))}
});
test('True Endless gets no story ramp or scripted boss health multiplier; random regional bosses get no extra boss HP factor',()=>{
 for(const wave of [1,100,101,150,500])assert.deepEqual(storyScaling(wave,'true-endless','origin'),{power:1,speed:1});
 const p=dex('origin').find(p=>p.id===150),run=newRun('origin'),boss=campaignPlan(150,[p],1,'origin',run,()=>0)[0].boss;assert.equal(boss.story,undefined);const a=enemyStats(p,150,boss,'true-endless','origin');near(a.maxHp,(p.stats.hp*.53+9)*1.115**149*1.5*1.2*2*1.05**150);
 const regional=newRun('kanto',{mode:'endless'});assert.equal(campaignPlan(161,dex('kanto'),1,'kanto',regional,()=>0)[0].boss.story,undefined);
});
test('round-100 hazard cards respect generation gates across all regions and True Endless',()=>{
 for(const region of [...REGIONS.map(r=>r.id),'origin']){const run=newRun(region);run.wave=99;assert.deepEqual(hazardUpgrades(run),[]);run.wave=100;assert.deepEqual(hazardUpgrades(run).map(c=>c.kind),region==='kanto'?[]:['johto','hoenn'].includes(region)?['spikes']:HAZARDS.map(c=>c.kind))}
});
test('hazards have strict finite picks, stay out of master conversion and trades, and cannot reappear in banked/distinct rolls',()=>{
 const run=newRun('sinnoh');run.wave=100;
 for(const c of HAZARDS){assert.equal(isBuff(c),false);for(let i=0;i<c.cap;i++){assert.ok(hazardUpgrades(run).some(x=>x.kind===c.kind));assert.notEqual(install(run,c.kind),false)}const history=run.upgradeHistory.length;assert.equal(install(run,c.kind),false);assert.equal(run.upgradeHistory.length,history);assert.equal(hazardStacks(run,c.kind),c.cap);assert.ok(!hazardUpgrades(run).some(x=>x.kind===c.kind))}
 const fallback=[{kind:'offense'},{kind:'health'},{kind:'armor'}];assert.deepEqual(drawDistinct(HAZARDS,3,run,()=>0),[]);assert.deepEqual(distinctRoll(HAZARDS,fallback,run,()=>0),fallback);
 const fresh=newRun('sinnoh');fresh.wave=100;assert.deepEqual(rollMasterCards(HAZARDS,fresh,()=>0),HAZARDS);near(repeatPower(run),1.1**3);
});
test('Stealth Rock and all three Spikes tiers compound correctly, including immediate proportional HP cuts and no repeated shaving',()=>{
 const run=newRun('sinnoh');run.wave=100;const enemy={hp:800,maxHp:1000},boss={hp:800,maxHp:1000,boss:{tier:'GYM LEADER'}};
 install(run,'stealth-rock');applyEntryHazards(enemy,run);near(enemy.maxHp,875);near(enemy.hp,700);
 for(const [i,factor] of [.9375,.875,.75].entries()){install(run,'spikes');near(hazardHealthFactor(run),.875*factor);applyEntryHazards(enemy,run);near(enemy.maxHp,1000*.875*factor);near(enemy.hp,800*.875*factor);for(let j=0;j<10;j++)applyEntryHazards(enemy,run);near(enemy.hp,800*.875*factor);assert.equal(hazardPlacements(run).filter(p=>p.kind==='spikes').length,6*(i+1))}
 applyEntryHazards(boss,run);assert.deepEqual(boss,{hp:800,maxHp:1000,boss:{tier:'GYM LEADER'}});near(run.hazardDamage,800-enemy.hp);
});
test('Toxic Spikes damage is type-neutral, defense-neutral and separate from attack tactics and partner credit; all bosses are exempt',()=>{
 const run=newRun('sinnoh');run.wave=100;run.hp=100;run.tactics={finish:10,wounds:10,chill:10,execute:10,siphon:2};install(run,'toxic-spikes');
 for(const types of [['poison'],['steel'],['flying'],['ghost','poison'],['normal']]){const e={pokemon:{types},hp:100,maxHp:100,defense:1e9,specialDefense:1e9};near(advanceHazards(e,2,run),.5);near(e.hp,99.5);assert.equal(e.marks,undefined);assert.equal(e.stunTime,undefined)}
 install(run,'toxic-spikes');const e={hp:100,maxHp:100};near(advanceHazards(e,2,run),1);near(e.hp,99);for(const tier of ['GYM LEADER','FINAL ENCOUNTER','ENDLESS BOSS','TRUE ENDLESS BOSS']){const b={hp:100,maxHp:100,boss:{tier}};assert.equal(advanceHazards(b,100,run),0);assert.equal(b.hp,100)}
 const dying={hp:.1,maxHp:100};near(advanceHazards(dying,1,run),.1);assert.equal(dying.hp,0);assert.equal(run.kills,1);assert.equal(run.hp,102);advanceHazards(dying,1,run);assert.equal(run.kills,1);assert.equal(run.totalDamage,undefined);
});
test('selecting hazards midwave preserves Auto/combat, updates live enemies, repairs stale banked cards, and shows shared support',async()=>{
 const h=await harness('sinnoh');h.choose(0);h.run.wave=99;h.startWave();h.tick(.025);h.el('auto').click();const run=h.run,enemy=h.enemies[0],before=enemy.hp;
 run.rewardQueue=[{wave:100,cards:[HAZARDS[0],{kind:'health',title:'Repair'},{kind:'armor',title:'Walls'}]},{wave:100,cards:[HAZARDS[0],HAZARDS[1],HAZARDS[2]]}];h.renderPendingRewards();h.choose(0);assert.equal(run.phase,'battle');assert.equal(h.autoMode,true);near(enemy.hp,before*.875);assert.equal(run.rewardQueue.length,1);assert.equal(h.offers.length,3);assert.ok(h.offers.every(c=>c.kind!=='stealth-rock'));assert.equal(new Set(h.offers.map(c=>c.kind)).size,3);
 const firstSpikes=h.offers.findIndex(c=>c.kind==='spikes');h.choose(firstSpikes);assert.equal(hazardStacks(run,'spikes'),1);run.rewardQueue=[{wave:101,cards:[HAZARDS[1],{kind:'health',title:'HP'},{kind:'armor',title:'Walls'}]}];h.renderPendingRewards();assert.match(h.offers.find(c=>c.kind==='spikes').description,/Owned: 1 \/ 3/);
 const profile=relevantUpgrades(run.team[0],run);assert.ok(profile.support.some(c=>c.title==='Stealth Rock'&&c.effect.includes('12.5%')));assert.ok(!profile.active.some(c=>c.kind==='stealth-rock'));
 for(let i=0;i<3;i++)install(run,'spikes');for(let i=0;i<2;i++)install(run,'toxic-spikes');for(let i=0;i<100;i++)assert.ok(h.generateRewards().every(c=>!HAZARDS.some(s=>s.kind===c.kind)));
});
test('hazard art adds six stable ground instances per installation with distinct, balanced canvas geometry and accessible card art',()=>{
 const run=newRun('sinnoh');run.wave=100;assert.equal(hazardPlacements(run).length,0);const traces=[];
 for(const card of HAZARDS){install(run,card.kind);let depth=0,trace=[];const ctx=new Proxy({}, {set:()=>true,get:(_,name)=>(...args)=>{if(name==='save')depth++;if(name==='restore')depth--;for(const n of args.filter(x=>typeof x==='number'))assert.ok(Number.isFinite(n));trace.push([name,...args])}});drawHazards(ctx,run);assert.equal(depth,0);traces.push(JSON.stringify(trace));assert.match(hazardArt(card),/role="img"/);assert.ok(hazardArt(card).includes(card.title))}
 assert.equal(new Set(traces).size,3);assert.equal(hazardPlacements(run).length,18);const first=hazardPlacements(run);install(run,'spikes');install(run,'toxic-spikes');const more=hazardPlacements(run);assert.equal(more.length,30);assert.ok(first.every(p=>more.some(q=>JSON.stringify(q)===JSON.stringify(p))));
});
