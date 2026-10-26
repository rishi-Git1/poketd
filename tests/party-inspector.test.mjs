import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {newRun,applyUpgrade,resolveHit,damageMultiplier,volleyFactor} from '../public/engine.js';
import {partyProfile,relevantUpgrades} from '../public/party-details.js';
import {applyTransformation} from '../public/transformations.js';import {commitSwap,removeBuff} from '../public/campaign.js';
import {harness} from './flow-harness.mjs';
const roster=region=>JSON.parse(readFileSync(`public/assets/regions/${region}.json`));
function fixture(region='kanto',ids=[4,7]){const data=roster(region),run=newRun(region);for(const id of ids)applyUpgrade(run,{kind:'recruit',pokemon:data.find(p=>p.id===id),title:'Partner'});return {run,data,ally:run.team[0]}}

test('profile exposes all six base stats, current move, cooldown and exact compound damage factors',()=>{
 const f=fixture();for(const card of [{kind:'offense',title:'Rally'},{kind:'type',type:'fire',title:'Fire'},{kind:'stage',stage:1,title:'Stage'},{kind:'haste',title:'Haste'}])applyUpgrade(f.run,card);
 const p=partyProfile(f.ally,f.run,f.data);assert.deepEqual(p.stats.map(s=>s.key),['hp','attack','defense','special-attack','special-defense','speed']);assert.equal(p.move.name,'Ember');assert.equal(p.evolution,'Next: charmeleon');assert.equal(p.attackClass,'Special');assert.equal(p.multiplier,damageMultiplier(f.ally.pokemon,f.run));assert.ok(Math.abs(p.factors.reduce((n,f)=>n*f.value,1)-p.multiplier)<1e-9);assert.ok(p.cooldown>0);assert.equal(p.range,335);
});

test('relevance filters unmatched buffs but retains their repeat resonance and separates shared tower support',()=>{
 const f=fixture();for(const c of [{kind:'type',type:'water',title:'Water'},{kind:'stage',stage:3,title:'Stage 3'},{kind:'type',type:'fire',title:'Fire'},{kind:'health',title:'Repair'},{kind:'armor',title:'Walls'},{kind:'shield',title:'Shell'}])applyUpgrade(f.run,c);
 let u=relevantUpgrades(f.ally,f.run);assert.deepEqual(u.active.map(c=>c.title),['Fire']);assert.deepEqual(u.support.map(c=>c.title),['Repair','Walls','Shell']);
 applyUpgrade(f.run,{kind:'type',type:'water',title:'Master Water',amount:.8,master:true});u=relevantUpgrades(f.ally,f.run);const water=u.active.find(c=>c.kind==='type'&&c.title.includes('Water'));assert.equal(water.count,2);assert.equal(water.scope,'Repeat bonus only');assert.match(water.effect,/×1.100/);assert.match(water.title,/Master/);
 removeBuff(f.run,f.run.upgradeHistory.findIndex(c=>c.title==='Master Water'));assert.ok(!relevantUpgrades(f.ally,f.run).active.some(c=>c.title.includes('Water')));
});

test('damage, hits, boss defeats, strongest hit and actual healing credit the owner exactly once',()=>{
 const f=fixture();f.run.hp=248;applyUpgrade(f.run,{kind:'siphon',title:'Bloom',amount:5});const e={hp:10,maxHp:10,boss:{name:'Leader'}};volleyFactor(f.ally,f.run);resolveHit(e,7,f.run,f.ally);resolveHit(e,50,f.run,f.ally);resolveHit(e,50,f.run,f.ally);
 let c=partyProfile(f.ally,f.run,f.data).contributions;assert.deepEqual(c,{damage:10,share:100,defeats:1,bosses:1,hits:2,volleys:1,strongest:7,healing:2});assert.equal(f.run.totalDamage,10);
 resolveHit({hp:6,maxHp:6},10,f.run,f.run.team[1]);c=partyProfile(f.ally,f.run,f.data).contributions;assert.equal(c.share,62.5);assert.equal(f.run.team[1].healing,0);
 const old=f.ally;commitSwap(f.run,'pokemon',0,{kind:'recruit',pokemon:f.data.find(p=>p.id===1),title:'Swap'},applyUpgrade);resolveHit({hp:4,maxHp:4},10,f.run,old);assert.equal(f.run.totalDamage,20);assert.equal(f.run.team[0].totalDamage,0);assert.equal(partyProfile(f.run.team[1],f.run,f.data).contributions.share,30);
});

test('personal transformation history follows its individual owner and changing Tera removes inactive Stellar entries',()=>{
 const f=fixture('paldea',[909,912]);f.run.wave=25;
 for(const type of ['fire','stellar','water'])applyTransformation(f.run,{kind:'tera',type,title:type+' Crystal'},'0:'+type,f.data,applyUpgrade);
 const u=relevantUpgrades(f.ally,f.run).active;assert.ok(u.some(c=>c.title==='fire Crystal'&&c.effect.includes('permanent power retained')));assert.ok(u.some(c=>c.title==='water Crystal'&&c.effect.includes('water Tera active')));assert.ok(!u.some(c=>c.title==='stellar Crystal'));assert.ok(!relevantUpgrades(f.run.team[1],f.run).active.some(c=>c.scope==='Personal transformation'));
 commitSwap(f.run,'pokemon',0,{kind:'recruit',pokemon:f.data.find(p=>p.id===910),title:'Swap'},applyUpgrade);assert.equal(f.run.team[0].formHistory,undefined);assert.ok(!relevantUpgrades(f.run.team[0],f.run).active.some(c=>c.scope==='Personal transformation'));
});

test('three-type Tera partners retain native type upgrades and lose the previous added-type influence',()=>{
 const f=fixture('paldea',[887]);f.run.wave=25;
 for(const type of ['dragon','ghost','fire','water'])applyUpgrade(f.run,{kind:'type',type,title:type+' Instinct'});
 applyTransformation(f.run,{kind:'tera',type:'fire',title:'Fire Crystal'},'0:fire',f.data,applyUpgrade);applyTransformation(f.run,{kind:'tera',type:'water',title:'Water Crystal'},'0:water',f.data,applyUpgrade);
 const profile=partyProfile(f.ally,f.run,f.data);assert.deepEqual(profile.pokemon.types,['dragon','ghost','water']);assert.deepEqual(profile.upgrades.active.filter(c=>c.kind==='type').map(c=>c.title),['dragon Instinct','ghost Instinct','water Instinct']);assert.ok(Math.abs(profile.factors.reduce((n,f)=>n*f.value,1)-profile.multiplier)<1e-9);
});

test('selecting a party member during Auto updates its dossier without pausing, resetting enemies or rebuilding live rows',async()=>{
 const h=await harness('paldea'),data=roster('paldea');h.el('auto').click();h.choose(1);applyUpgrade(h.run,{kind:'recruit',pokemon:data.find(p=>p.id===912),title:'Quaxly'});h.el('party-stat-toggle').click();const enemies=h.enemies;
 assert.match(h.el('party').innerHTML,/data-party-slot="1"/);assert.match(h.el('party-inspector').innerHTML,/Fuecoco/);h.selectPartySlot(1);assert.match(h.el('party-inspector').innerHTML,/Quaxly/);assert.equal(h.paused,false);assert.equal(h.run.phase,'battle');assert.equal(h.enemies,enemies);
 const html=h.el('party-inspector').innerHTML,revision=h.el('party-inspector').dataset.revision;
 resolveHit({hp:20,maxHp:20},10,h.run,h.run.team[1]);h.el('party-stat-toggle').click();assert.equal(h.el('inspector-damage').textContent,'10');assert.equal(h.el('inspector-hits').textContent,'1');assert.equal(h.el('party-inspector').innerHTML,html);assert.equal(h.el('party-inspector').dataset.revision,revision);
});

test('selection survives evolution, follows a swapped slot with fresh totals, and clears for a new region',async()=>{
 const h=await harness(),data=roster('kanto');h.choose(1);const ally=h.run.team[0];ally.totalDamage=200;applyUpgrade(h.run,{kind:'evolve',from:4,pokemon:data.find(p=>p.id===5),title:'Evolution'});h.el('party-stat-toggle').click();assert.match(h.el('party-inspector').innerHTML,/Charmeleon/);assert.equal(h.el('inspector-damage').textContent,'200');assert.equal(h.run.team[0],ally);
 commitSwap(h.run,'pokemon',0,{kind:'recruit',pokemon:data.find(p=>p.id===9),title:'Swap'},applyUpgrade);h.el('party-stat-toggle').click();assert.match(h.el('party-inspector').innerHTML,/Blastoise/);assert.equal(h.el('inspector-damage').textContent,'0');await h.selectRegion('johto');assert.match(h.el('party-inspector').innerHTML,/Your team, up close/);assert.ok(!h.el('party-inspector').innerHTML.includes('Blastoise'));
});
