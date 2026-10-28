import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {targetsInRange,nextBounce,damage,newRun,applyUpgrade} from '../public/engine.js';import {attackFor} from '../public/attacks.js';import {harness} from './flow-harness.mjs';
const roster=JSON.parse(readFileSync('public/assets/all-pokemon.json')),mon=id=>roster.find(p=>p.id===id);
async function setup(id){const h=await harness('hoenn');h.choose(0);h.run.team[0].pokemon=mon(id);h.startWave();const ally=h.run.team[0];ally.cooldown=100;h.tick(.001);const targets=[...h.enemies];assert.equal(targets.length,3);for(const [i,e]of targets.entries()){e.pokemon=mon([35,303,282][i]);e.x=620+i*20;e.y=345;e.hp=e.maxHp=1e6;e.defense=e.specialDefense=0;e.speed=0}return {h,ally,targets}}

for(const [id,label]of [[373,'Salamence'],[10089,'Mega Salamence'],[10309,'Mega Garchomp Z']])test(`${label} immediately selects and damages Fairy enemies with its Dragon signature`,async()=>{
 const {h,ally,targets}=await setup(id),move=attackFor(ally.pokemon);assert.equal(move.type,'dragon');ally.cooldown=0;h.tick(.001);assert.equal(ally.focusTarget,targets[0]);assert.ok(targets[0].hp<1e6);assert.ok(ally.totalDamage>0);assert.ok(ally.volleys>0);assert.equal(h.run.phase,'battle');
});

test('Salamence Split Volley can select two Fairy primary targets',async()=>{
 const {h,ally,targets}=await setup(373);applyUpgrade(h.run,{kind:'split',title:'Split Volley'});ally.cooldown=0;h.tick(.001);assert.ok(targets.slice(0,2).every(e=>e.hp<1e6));assert.ok(ally.damageHits>=2);
});

test('an unevolved Dragon projectile selects and hits a Fairy without needing another enemy type',async()=>{
 const {h,ally,targets}=await setup(371);assert.equal(attackFor(ally.pokemon).signature,false);for(const e of targets.slice(1))e.x=950;ally.cooldown=0;h.tick(.001);assert.equal(ally.focusTarget,targets[0]);for(let i=0;i<100;i++){ally.cooldown=100;h.tick(.01)}assert.ok(targets[0].hp<1e6);assert.ok(ally.totalDamage>0);
});

test('primary and bounce eligibility never inspect Pokémon records, stats, types, or damage',()=>{
 const enemy=(x,hp=10)=>({x,y:345,hp,get pokemon(){throw Error('Targeting read a Pokémon record')},get defense(){throw Error('Targeting calculated damage')}});
 const near=enemy(530),far=enemy(610),outside=enemy(900),dead=enemy(520,0),visited=enemy(510);assert.deepEqual(targetsInRange([far,outside,dead,near],335),[near,far]);assert.equal(nextBounce({x:500,y:345},[far,outside,dead,near,visited],[visited]),near);assert.equal(nextBounce({x:500,y:345},[outside,dead,visited],[visited]),undefined);
});

test('the damage formula does not read defender typing or use the supplied move type',()=>{
 const run=newRun(),physical={pokemon:mon(373)},special={pokemon:mon(65)},enemy={defense:100,specialDefense:100,get pokemon(){throw Error('Damage read defender typing')}};
 for(const ally of [physical,special]){const base=damage(ally,enemy,run,'dragon');assert.ok(base>0);for(const type of ['fairy','ground','ghost','steel','normal','stellar'])assert.equal(damage(ally,enemy,run,type),base)}
});
