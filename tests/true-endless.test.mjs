import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
import {newRun,enemyStats,lateUpgrades,masterUpgrades,rollMasterCards,selectRewardCards,drawDistinct,distinctRoll,cardKey,applyUpgrade,damageMultiplier} from '../public/engine.js';
import {nextBoss,campaignPlan,canAutoAdvance} from '../public/campaign.js';import {getRegion,REGIONS} from '../public/regions.js';import {MAPS,drawMap,drawBastion} from '../public/maps.js';
import {regionalCards,transformationOptions,applyTransformation,canEvolve} from '../public/transformations.js';import {harness} from './flow-harness.mjs';
const roster=JSON.parse(readFileSync('public/assets/regions/origin.json')),data=id=>JSON.parse(readFileSync(`public/assets/regions/${id}.json`));const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(b)),`${a} != ${b}`);
const baseCards=[{kind:'offense',title:'Rally'},{kind:'armor',title:'Armor'},{kind:'health',title:'HP'}];
function rng(seed){return()=>((seed=(seed*1664525+1013904223)>>>0)/2**32)}

test('National Dex includes all 1025 species, correct evolution stages, DLC evolutions and valid sprite/evolution references',()=>{
 assert.equal(new Set(roster.map(p=>p.speciesId)).size,1025);for(let id=1;id<=1025;id++)assert.ok(roster.some(p=>p.id===id),'missing '+id);
 for(const p of roster){assert.ok(existsSync('public/'+p.sprite));assert.ok(p.stage>=1&&p.stage<=3);for(const id of p.nextOptions)assert.ok(roster.some(p=>p.id===id))}
 for(const [id,stage,child]of [[1,1,2],[2,2,3],[3,3,null],[1011,2,1019],[1019,3,null],[1012,1,1013],[1013,2,null],[884,1,1018],[1018,2,null]]){const p=roster.find(p=>p.id===id);assert.equal(p.stage,stage);if(child)assert.ok(p.nextOptions.includes(child))}
 assert.equal(REGIONS.length,9);assert.equal(getRegion('origin').rounds,Infinity);assert.equal(MAPS.origin.name,'Hall of Origin');const ctx=new Proxy({}, {get:()=>()=>{},set:()=>true});assert.doesNotThrow(()=>{drawMap(ctx,'origin');drawBastion(ctx,'origin')});
});

test('True Endless bosses occur only every 10 rounds and are always Legendary, Mythical or Ultra Beast',()=>{
 const run=newRun('origin');assert.equal(run.mode,'true-endless');for(let wave=1;wave<=500;wave++){
  const plan=campaignPlan(wave,roster,1,'origin',run,rng(wave));if(wave%10){assert.equal(plan,null);continue}assert.equal(plan.length,1);const p=plan[0].pokemon;assert.ok(p.legendary||p.mythical||p.ultraBeast);assert.equal(plan[0].boss.final,false);assert.equal(plan[0].boss.tier,'TRUE ENDLESS BOSS');assert.equal(plan[0].pokemon.id,campaignPlan(wave,roster,1,'origin',run,()=>.99)[0].pokemon.id)
 }assert.equal(nextBoss(0,'origin','true-endless').wave,10);assert.equal(nextBoss(151,'origin','true-endless').wave,160);assert.ok(roster.some(p=>p.ultraBeast&&!p.legendary&&!p.mythical));assert.ok(roster.some(p=>p.mythical&&!p.legendary));
});

test('True Endless adds exactly 5% compounded from round 1 to all enemy stats',()=>{
 const p=roster[0];for(const wave of [1,2,10,50,151,152]){const classic=enemyStats(p,wave),trueStats=enemyStats(p,wave,null,'true-endless'),factor=1.05**wave;for(const key of ['maxHp','defense','specialDefense','speed'])near(trueStats[key],classic[key]*factor);assert.ok(Math.abs(trueStats.impact-classic.impact*factor)<=factor)}
});

test('True Endless unlocks advanced tactics at25 and elite/master at50 without changing regional gates',()=>{
 const run=newRun('origin');run.team=[{pokemon:roster[0]}];run.wave=24;assert.equal(lateUpgrades(run).length,0);run.wave=25;assert.ok(lateUpgrades(run).some(c=>c.kind==='split'));assert.ok(!lateUpgrades(run).some(c=>c.kind==='focus'));run.wave=49;assert.ok(!masterUpgrades(run).some(c=>c.kind==='execute'));run.wave=50;assert.ok(lateUpgrades(run).some(c=>c.kind==='focus'));assert.ok(masterUpgrades(run).some(c=>c.kind==='execute'));assert.ok(rollMasterCards(baseCards,run,()=>0).every(c=>c.master));const normal=newRun();normal.wave=50;assert.equal(lateUpgrades(normal).length,0);normal.wave=79;assert.ok(!masterUpgrades(normal).some(c=>c.kind==='execute'));
});

test('Tera cards never occupy all three slots, including adversarial RNG, full-party drafts and banked repairs',async()=>{
 const h=await harness('paldea');h.choose(0);h.run.wave=101;h.run.team=Array.from({length:6},(_,i)=>({pokemon:data('paldea').find(p=>p.id===[906,909,912,887,25,1024][i])}));const pool=[...regionalCards(h.run,data('paldea')),...baseCards];
 for(let seed=0;seed<200;seed++)for(const random of [rng(seed),()=>0,()=>.999999]){const cards=selectRewardCards(h.run,pool,[],[],random);assert.equal(cards.length,3);assert.ok(cards.filter(c=>c.kind==='tera').length<=2);assert.equal(new Set(cards.map(cardKey)).size,3)}
 assert.equal(drawDistinct(pool,3,h.run,()=>0).length,3);const entry={wave:25,cards:pool.filter(c=>c.kind==='tera').slice(0,3)};h.refreshRewardCards(entry);assert.equal(entry.cards.length,3);assert.ok(entry.cards.some(c=>c.kind!=='tera'));assert.equal(distinctRoll(entry.cards,pool,h.run).length,3);
});

for(const [region,id,kind,type] of [['hoenn',214,'mega'],['galar',25,'gmax'],['paldea',909,'tera','water']])test(`${kind}: cancel button preserves the exact roll and later rewards, then allows a different card`,async()=>{
 const h=await harness(region);h.choose(0);h.run.team[0].pokemon=data(region).find(p=>p.id===id);h.run.wave=25;h.run.phase='ready';h.startWave();h.tick(.025);const entry={wave:25,cards:[{kind,type,title:'Form power'},...baseCards.slice(0,2)]},later={wave:26,cards:structuredClone(baseCards)};h.run.rewardQueue=[entry,later];h.renderPendingRewards();const before=JSON.stringify(h.run.rewardQueue),history=h.run.upgradeHistory.length,team=JSON.stringify(h.run.team);h.choose(0);assert.equal(h.el('transform-dialog').open,true);h.el('transform-cancel').click();assert.equal(h.el('transform-dialog').open,false);assert.equal(JSON.stringify(h.run.rewardQueue),before);assert.equal(h.run.upgradeHistory.length,history);assert.equal(JSON.stringify(h.run.team),team);assert.equal(h.run.phase,'battle');h.choose(1);assert.equal(h.run.rewardQueue[0],later);assert.equal(h.run.rewardQueue.length,1);assert.ok(h.run.offense>0);
});

test('searchable starter is one explicit choice, gives 3 upgrade-only rolls and prevents Auto or manual combat until finished',async()=>{
 const h=await harness('origin');assert.equal(h.run.mode,'true-endless');assert.equal(h.run.phase,'starter');assert.equal(h.offers.length,0);assert.equal(h.el('true-starter-dialog').open,true);h.el('true-starter-search').value='pecharunt';h.renderTrueStarterSearch();assert.match(h.el('true-starter-results').innerHTML,/1025/);h.chooseTrueStarter(1025);assert.deepEqual(h.run.team.map(a=>a.pokemon.id),[1025]);assert.equal(h.run.rewardQueue.length,3);assert.equal(h.run.originSetupLeft,3);assert.ok(h.run.rewardQueue.every(q=>q.cards.length===3&&q.cards.every(c=>!['recruit','evolve'].includes(c.kind))));h.el('auto').click();h.startWave();assert.equal(h.run.wave,0);h.choose(0);assert.equal(h.run.originSetupLeft,2);h.choose(1);assert.equal(h.run.originSetupLeft,1);assert.equal(h.run.wave,0);h.choose(2);assert.equal(h.run.originSetupLeft,0);assert.equal(h.run.wave,1);assert.equal(h.run.phase,'battle');assert.equal(h.run.team.length,1);h.chooseTrueStarter(493);assert.equal(h.run.team.length,1);
});

test('True Endless auto continues across151 and has an isolated uncapped record',async()=>{
 const h=await harness(null,{'bastion-best-origin-true-endless':'321','bastion-best-kanto-endless':'234'});await h.selectRegion('origin');assert.equal(h.el('best').textContent,'321');h.chooseTrueStarter(493);for(let i=0;i<3;i++)h.choose(0);h.el('auto').click();h.run.phase='ready';h.run.wave=150;h.startWave();h.tick(.025);for(const e of h.enemies){e.hp=0;e.speed=0}for(let i=0;i<1000&&h.run.wave===151;i++){for(const e of h.enemies)e.hp=0;h.tick(.025)}assert.equal(h.run.wave,152);assert.equal(h.el('story-end').open,false);assert.ok(canAutoAdvance({...h.run,phase:'ready'},{enabled:true,paused:false,dialogOpen:false,hidden:false}));
});

test('all three regional powers are eligible in True Endless, with ×2 one-time Mega/Gmax damage and preserved Tera overlay',()=>{
 const run=newRun('origin');run.wave=25;run.team=[{pokemon:roster.find(p=>p.id===6)},{pokemon:roster.find(p=>p.id===25)}];assert.ok(['mega','gmax','tera'].every(k=>regionalCards(run,roster).some(c=>c.kind===k)));applyTransformation(run,{kind:'mega',title:'Mega'},'0:10034',roster,applyUpgrade);assert.equal(run.team[0].pokemon.personalPower,2);assert.equal(run.team[0].pokemon.stage,3);assert.ok(!transformationOptions({kind:'gmax'},run,roster).some(c=>c.slot===0));applyTransformation(run,{kind:'tera',type:'water',title:'Water'},'0:water',roster,applyUpgrade);near(run.team[0].pokemon.personalPower,2*1.2);assert.ok(run.team[0].pokemon.mega);assert.deepEqual(run.team[0].pokemon.types,['fire','dragon','water']);applyTransformation(run,{kind:'gmax',title:'Max'},'1:10199',roster,applyUpgrade);assert.equal(run.team[1].pokemon.personalPower,2);assert.equal(canEvolve(run.team[1]),false);assert.equal(transformationOptions({kind:'mega'},run,roster).length,0);
});

test('a starter may be a chosen special form, with its one-time form power and evolution lock already applied',async()=>{
 for(const id of [10034,10199]){const h=await harness('origin');h.chooseTrueStarter(id);const a=h.run.team[0];assert.equal(a.pokemon.id,id);assert.equal(a.pokemon.personalPower,2);assert.equal(a.pokemon.stage,id===10034?3:2);if(id===10199)assert.equal(canEvolve(a),false);assert.ok(!transformationOptions({kind:'mega'},h.run,roster).length);assert.ok(!transformationOptions({kind:'gmax'},h.run,roster).length)}
});
