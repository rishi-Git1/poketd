import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {FORM_SIGNATURES,formAttackFor,drawFormAttack} from '../public/form-signatures.js';
const roster=JSON.parse(readFileSync('public/assets/all-pokemon.json')),forms=roster.filter(p=>p.mega||p.gigantamax),shapes=new Set(['beam','cone','volley','vortex','slash','blast','quake','chain']);
function recording(){const calls=[];let saves=0;const ctx=new Proxy({}, {get:(_,key)=>(...args)=>{if(key==='save')saves++;if(key==='restore')saves--;for(const n of args)if(typeof n==='number')assert.ok(Number.isFinite(n),key+' received nonfinite geometry');calls.push([key,...args.map(v=>typeof v==='number'?Math.round(v*1000)/1000:v)])},set:(_,key,value)=>{if(!['fillStyle','strokeStyle'].includes(key))calls.push(['set',key,value]);return true}});return {ctx,calls,get saves(){return saves}}}
const frame=(move,life=.24)=>({move,origin:{x:100,y:90},target:{x:350,y:160},points:[{x:350,y:160},{x:395,y:145}],life,duration:.48});

test('every bundled Mega and all34 Gigantamax forms have named signatures and unique visual keys',()=>{
 assert.equal(forms.filter(p=>p.gigantamax).length,34);assert.equal(Object.keys(FORM_SIGNATURES).length,forms.length);
 const keys=new Set();for(const p of forms){const move=formAttackFor(p);assert.ok(move,p.name);assert.ok(move.name.length>0);assert.ok(shapes.has(move.shape),p.name);assert.ok(move.signature);assert.match(move.color,/^#[a-f0-9]{6}$/i);assert.ok(move.power>=3.6&&move.power<=4.32);assert.ok(move.visualDescription.length>20);assert.ok(!keys.has(move.visualKey));keys.add(move.visualKey);if(p.gigantamax)assert.match(move.name,/^G-Max /)}
 assert.equal(formAttackFor({id:10033}),null);assert.equal(formAttackFor({id:6}),null);assert.equal(formAttackFor({id:999999,mega:true}),null);assert.equal(formAttackFor(null),null);
});

test('every form has distinct canvas composition even with exactly the same color and animation frame',()=>{
 const seen=new Map();for(const p of forms){const r=recording();assert.equal(drawFormAttack(r.ctx,frame({...formAttackFor(p),color:'#cccccc'})),true);assert.equal(r.saves,0);const signature=JSON.stringify(r.calls);assert.ok(!seen.has(signature),`${p.name} repeats ${seen.get(signature)}`);seen.set(signature,p.name)}assert.equal(seen.size,forms.length);
});

test('every form renderer handles animation endpoints and restores canvas state',()=>{
 for(const p of forms)for(const life of [0,.01,.24,.47,.48]){const r=recording();assert.doesNotThrow(()=>drawFormAttack(r.ctx,frame(formAttackFor(p),life)),p.name);assert.equal(r.saves,0,p.name);assert.ok(r.calls.length>50)}
 const r=recording();assert.equal(drawFormAttack(r.ctx,frame({type:'fire',shape:'beam',color:'#ff7700'})),false);assert.equal(r.calls.length,0);assert.equal(drawFormAttack(r.ctx,frame({visualKey:'form:999999'})),false);
});

test('alternate forms have distinct names or motifs while retaining their recognizable species moves',()=>{
 for(const [left,right] of [[10034,10035],[10043,10044],[10062,10063],[10304,10305],[10057,10307],[10058,10309],[10059,10310],[10314,10326],[10317,10318],[10219,10228]]){assert.notEqual(FORM_SIGNATURES[left].visualKey,FORM_SIGNATURES[right].visualKey);assert.notEqual(FORM_SIGNATURES[left].visualDescription,FORM_SIGNATURES[right].visualDescription)}
 assert.equal(FORM_SIGNATURES[10301].name,'Nihil Light');assert.equal(FORM_SIGNATURES[10199].name,'G-Max Volt Crash');assert.equal(FORM_SIGNATURES[10223].name,'G-Max Finale');assert.equal(FORM_SIGNATURES[10219].name,'G-Max Stun Shock');assert.equal(FORM_SIGNATURES[10228].name,'G-Max Stun Shock');
});

test('the real move and rendering dispatch use every form signature, including Tera overlays',async()=>{
 const {attackFor,drawAttack,attackTargets}=await import('../public/attacks.js');
 for(const p of forms){const move=attackFor(p);assert.equal(move.visualKey,formAttackFor(p).visualKey,p.name);assert.equal(move.power,formAttackFor(p).power);const f=frame(move),direct=recording(),through=recording();drawFormAttack(direct.ctx,f);drawAttack(through.ctx,f);assert.deepEqual(through.calls,direct.calls);const primary={x:350,y:160,hp:100};assert.ok(attackTargets(move,f.origin,primary,[primary]).some(h=>h.enemy===primary));const tera=attackFor({...p,teraType:'water'});assert.equal(tera.visualKey,move.visualKey);assert.equal(tera.type,'water');assert.equal(tera.name,'Tera '+move.name)}
});
