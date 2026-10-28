import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {damage,applyUpgrade} from '../public/engine.js';import {attackFor} from '../public/attacks.js';import {harness} from './flow-harness.mjs';
const roster=JSON.parse(readFileSync('public/assets/pokemon.json')),mon=id=>roster.find(p=>p.id===id),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7*Math.max(1,Math.abs(b)),`${a} != ${b}`);
async function fixture(id){const h=await harness();h.choose(0);h.startWave();const ally=h.run.team[0];ally.pokemon=mon(id);ally.cooldown=100;h.tick(.025);const targets=[...h.enemies];assert.equal(targets.length,3);for(const [i,e]of targets.entries()){e.hp=e.maxHp=1e6;e.defense=e.specialDefense=0;e.speed=0;e.x=i?950:650;e.y=345}return {h,ally,targets}}

test('a real Electric projectile targets a Ground enemy and credits its full neutral damage',async()=>{
 const {h,ally,targets}=await fixture(25),ground=targets[0];ground.pokemon=mon(27);const expected=damage(ally,ground,h.run,attackFor(ally.pokemon).type);assert.ok(expected>0);ally.cooldown=0;h.tick(.001);for(let i=0;i<100;i++){ally.cooldown=100;h.tick(.01)}near(1e6-ground.hp,expected);near(ally.totalDamage,expected);near(h.run.totalDamage,expected);
});

test('a Normal signature defeats a Ghost and its Victory Nova also damages a nearby Ghost',async()=>{
 const {h,ally,targets}=await fixture(137),[primary,splash]=targets;primary.pokemon=splash.pokemon=mon(92);primary.hp=1;splash.x=650;splash.y=400;applyUpgrade(h.run,{kind:'nova',title:'Victory Nova'});const move=attackFor(ally.pokemon);assert.equal(move.type,'normal');const power=damage(ally,primary,h.run,move.type)*move.power;assert.ok(power>0);ally.cooldown=0;h.tick(.001);assert.ok(primary.hp<=0);near(1e6-splash.hp,power*.6);near(ally.totalDamage,1+power*.6);assert.equal(ally.defeats,1);
});
