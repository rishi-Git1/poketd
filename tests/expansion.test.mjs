import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {REGIONS} from '../public/regions.js';import {MAPS,drawMap} from '../public/maps.js';
import {newRun,applyUpgrade,damageMultiplier,formUpgrades,starterChoices,enemyStats,openingEase,batchSpawnTime,masterUpgrades} from '../public/engine.js';
import {campaignPlan,bossFor,nextBoss,canAutoAdvance,removeBuff} from '../public/campaign.js';
import {regionalCards,applyTransformation} from '../public/transformations.js';import {relevantUpgrades,partyProfile} from '../public/party-details.js';import {harness} from './flow-harness.mjs';
const data=id=>JSON.parse(readFileSync(`public/assets/regions/${id}.json`));const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(b)),`${a} != ${b}`);

test('form rallies unlock strictly after 100, require transformed partners and compound independently',()=>{
 const run=newRun('alola'),roster=data('alola'),mega=roster.find(p=>p.mega);run.team=[{pokemon:mega}];run.wave=100;assert.deepEqual(formUpgrades(run),[]);run.wave=101;assert.deepEqual(formUpgrades(run).map(c=>c.form),['mega']);const p=mega,base=damageMultiplier(p,run);
 applyUpgrade(run,formUpgrades(run)[0]);near(damageMultiplier(p,run),base*1.35);applyUpgrade(run,formUpgrades(run)[0]);near(damageMultiplier(p,run),base*1.35**2*1.1);assert.ok(relevantUpgrades(run.team[0],run).active.some(c=>c.scope==='Matching form'));near(partyProfile(run.team[0],run,roster).factors.reduce((n,f)=>n*f.value,1),damageMultiplier(p,run));removeBuff(run,0);near(damageMultiplier(p,run),base*1.35);
 const g=data('galar').find(p=>p.gigantamax);run.team.push({pokemon:g});assert.deepEqual(formUpgrades(run).map(c=>c.form),['mega','gmax']);const before=damageMultiplier(g,run);applyUpgrade(run,{kind:'form',form:'mega',title:'Mega',amount:.35});near(damageMultiplier(g,run),before*1.1);assert.ok(masterUpgrades(run).some(c=>c.kind==='form'&&c.form==='gmax'&&c.amount===.8));
});

test('banked form rallies are repaired after the final matching partner leaves',async()=>{
 const h=await harness('galar');h.choose(0);h.run.wave=101;const entry={wave:101,cards:[{kind:'form',form:'gmax',title:'Gmax'},{kind:'armor',title:'Armor'},{kind:'health',title:'Health'}]};h.refreshRewardCards(entry);assert.ok(entry.cards.every(c=>c.kind!=='form'));applyUpgrade(h.run,{kind:'health',title:'Repair'});h.run.tradeQueue=[{wave:100,cache:{upgrade:[{kind:'form',form:'gmax',title:'Master Gmax',amount:.8},{kind:'offense',title:'Rally',amount:.5},{kind:'armor',title:'Armor',amount:.4}]}}];h.openSwap();h.setSwapKind('upgrade');assert.ok(h.swapCache.upgrade.every(c=>c.kind!=='form'));
});

test('all nine regions can roll three unique first-stage starters without transformations',()=>{
 for(const r of REGIONS){const roster=data(r.id);assert.deepEqual(starterChoices(roster,r.id).map(p=>p.id),r.starters);for(const rng of [()=>0,()=>.999999,()=>.45]){const cards=starterChoices(roster,r.id,'random',rng);assert.equal(cards.length,3);assert.equal(new Set(cards.map(p=>p.speciesId||p.id)).size,3);assert.ok(cards.every(p=>p.stage===1&&!p.bossOnly&&!p.transformOnly&&r.pokemonIds.includes(p.id)))}}
});

test('region select applies random starters and Endless while Classic defaults still work',async()=>{
 const h=await harness(null);h.el('starter-mode').value='random';h.el('campaign-mode').value='endless';await h.selectRegion('sinnoh');assert.equal(h.run.mode,'endless');assert.equal(h.run.starterMode,'random');assert.ok(h.offers.every(c=>c.pokemon.stage===1));h.choose(0);h.startWave();assert.equal(h.run.wave,1);assert.match(h.el('mode-label').textContent,/ENDLESS/);h.el('campaign-mode').value='classic';h.el('starter-mode').value='classic';await h.selectRegion('alola');assert.deepEqual(h.offers.map(c=>c.pokemon.id),[722,725,728]);assert.equal(h.run.mode,'classic');
});

test('early battles send batches and wait for the last enemy, with a smaller opening stat nerf',async()=>{
 near(openingEase(1),.8);near(openingEase(6),1);const h=await harness();h.choose(1);h.startWave();h.run.team[0].cooldown=1e6;h.tick(.025);assert.equal(h.spawned,3);for(const e of h.enemies)e.speed=0;h.tick(20);assert.equal(h.spawned,3);h.enemies[0].hp=0;h.enemies[1].hp=0;h.tick(.025);assert.equal(h.spawned,5);h.el('party-stat-toggle').click();assert.match(h.el('field-hint').textContent,/2 \/ 2/);assert.equal(batchSpawnTime(0,5,1),0);assert.equal(batchSpawnTime(3,5,1),3);
});

test('every non-finale boss doubles HP, defenses, speed and impact while finales stay at baseline',()=>{
 for(const r of REGIONS)for(const original of r.bosses){const b=bossFor(original.wave,r.starters[0],r.id),p=data(r.id).find(p=>p.id===b.team[0]),stats=enemyStats(p,b.wave,b),baseline=enemyStats(p,b.wave,{...b,final:true}),factor=b.final?1:2;for(const k of ['maxHp','defense','specialDefense','speed'])near(stats[k],baseline[k]*factor);assert.ok(Math.abs(stats.impact-baseline.impact*factor)<=1)}
});

test('Endless preserves story encounters then caches random bosses every ten rounds beyond the cap',()=>{
 for(const r of REGIONS){const roster=data(r.id),run=newRun(r.id,{mode:'endless'});for(const b of r.bosses)assert.deepEqual(campaignPlan(b.wave,roster,r.starters[0],r.id,run).map(s=>s.pokemon.id),bossFor(b.wave,r.starters[0],r.id).team);assert.equal(campaignPlan(r.rounds+1,roster,0,r.id,run),null);const first=campaignPlan(r.rounds+10,roster,0,r.id,run,()=>0),again=campaignPlan(r.rounds+10,roster,0,r.id,run,()=>.99);assert.equal(first[0].pokemon.id,again[0].pokemon.id);assert.equal(first[0].boss.tier,'ENDLESS BOSS');assert.equal(campaignPlan(r.rounds+20,roster,0,r.id,run)[0].boss.wave,r.rounds+20);assert.equal(nextBoss(r.rounds,r.id,'endless').wave,r.rounds+10);assert.equal(nextBoss(r.rounds,r.id),null)}
});

test('additional endless scaling compounds combat stats at 5% and increases speed linearly after 151',()=>{
 const p=data('kanto')[0];for(const wave of [151,152,170,220]){const classic=enemyStats(p,wave),endless=enemyStats(p,wave,null,'endless'),factor=1.05**Math.max(0,wave-151);for(const k of ['maxHp','defense','specialDefense'])near(endless[k]/classic[k],factor);near(endless.speed,enemyStats(p,Math.min(wave,151)).speed*(1+.02*Math.max(0,wave-151)));assert.ok(Math.abs(endless.impact-classic.impact*factor)<=factor)}
});

for(const region of ['kanto','alola'])test(`${region}: Endless auto continues past its story finale without an end screen`,async()=>{
 const h=await harness(null);h.el('campaign-mode').value='endless';await h.selectRegion(region);h.el('auto').click();h.choose(0);h.run.phase='ready';h.run.wave=h.run.rounds-1;h.startWave();h.tick(.025);for(const e of h.enemies)e.hp=0;h.tick(.025);assert.equal(h.run.phase,'battle');assert.equal(h.run.wave,h.run.rounds+1);assert.equal(h.el('story-end').open,false);assert.ok(h.run.rewardQueue.length);h.run.phase='ready';assert.equal(canAutoAdvance(h.run,{enabled:true,paused:false,dialogOpen:false,hidden:false}),true);
});

test('Sinnoh includes Hisui forms/evolutions and Alola offers Megas with a Totem/Ultra Beast finale route',()=>{
 const sinnoh=data('sinnoh');assert.ok(sinnoh.filter(p=>p.name.includes('-hisui')).length>=16);for(const id of [899,900,901,902,903,904])assert.ok(sinnoh.some(p=>p.id===id));assert.equal(REGIONS.length,9);const a=REGIONS.find(r=>r.id==='alola');assert.ok(a.bosses.slice(0,8).every(b=>b.tier.startsWith('TOTEM')));assert.ok(a.bosses.slice(8,-1).every(b=>b.tier.startsWith('ULTRA')));assert.equal(a.finale,10157);assert.equal(MAPS.alola.name,'Ultra Wormhole');const roster=data('alola'),mega=roster.find(p=>p.mega),run=newRun('alola');run.wave=25;run.team=[{pokemon:roster.find(p=>p.id===mega.megaFrom)}];assert.ok(regionalCards(run,roster).some(c=>c.kind==='mega'));applyTransformation(run,{kind:'mega',title:'Mega'},'0:'+mega.id,roster,applyUpgrade);assert.equal(run.team[0].pokemon.stage,run.team[0].nativePokemon.stage);const ctx=new Proxy({}, {get:()=>()=>{},set:()=>true});assert.doesNotThrow(()=>drawMap(ctx,'alola'));
});

test('simulation-only view preserves active combat, choices and Auto without exposing a different run',async()=>{
 const h=await harness('alola');h.el('auto').click();h.choose(0);h.tick(.025);const enemies=h.enemies,run=h.run;await h.toggleSimulationView();assert.equal(h.simulationOnly,true);assert.equal(h.paused,false);assert.equal(h.enemies,enemies);assert.equal(h.run,run);assert.match(h.el('fullscreen').textContent,/EXIT/);h.run.rewardQueue=[{wave:1,cards:[{kind:'offense',title:'Rally'},{kind:'health',title:'HP'},{kind:'armor',title:'Armor'}]}];h.renderPendingRewards();h.choose(0);assert.ok(h.run.offense>0);assert.equal(h.run.phase,'battle');await h.toggleSimulationView();assert.equal(h.simulationOnly,false);assert.equal(h.run,run);
});


test('Classic and Endless records stay isolated and Endless records are not capped at the story limit',async()=>{
 const h=await harness(null,{'bastion-best-alola':'30','bastion-best-alola-endless':'240'});h.el('campaign-mode').value='endless';await h.selectRegion('alola');assert.equal(h.el('best').textContent,'240');h.el('campaign-mode').value='classic';await h.selectRegion('alola');assert.equal(h.el('best').textContent,'30');
});
