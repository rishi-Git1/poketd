import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {enemyStats} from '../public/engine.js';
const dex=JSON.parse(readFileSync('public/assets/all-pokemon.json')),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9*Math.max(1,Math.abs(b)),`${a} != ${b}`);

test('Endless movement gains the same fixed speed each scaling round for slow, fast and boss Pokémon',()=>{
 for(const id of [1,213,373,894])for(const boss of [null,{tier:'ENDLESS BOSS',boost:1.5,final:false},{tier:'FINAL ENCOUNTER',boost:8,final:true}])for(const mode of ['endless','true-endless']){
  const p=dex.find(p=>p.id===id),start=mode==='true-endless'?1:151,offset=mode==='true-endless'?0:151,baseline=enemyStats(p,start,boss).speed,speed=n=>enemyStats(p,offset+n,boss,mode).speed;
  near(speed(10),baseline*1.2);near(speed(50),baseline*2);near(speed(100),baseline*3);
  for(const n of [1,2,10,49,100,200])near(speed(n+1)-speed(n),baseline*.02);
 }
});

test('regional Endless retains the complete Classic speed curve until its extra scaling phase begins',()=>{
 const p=dex.find(p=>p.id===373);for(const wave of [1,2,5,10,50,100,150,151])assert.deepEqual(enemyStats(p,wave,null,'endless'),enemyStats(p,wave));near(enemyStats(p,152,null,'endless').speed,enemyStats(p,151).speed*1.02);
});
