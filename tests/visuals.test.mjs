import test from 'node:test';
import assert from 'node:assert/strict';
import {TYPE_VISUALS} from '../public/type-visuals.js';
import {drawAttack} from '../public/attacks.js';
import {TYPES} from '../public/engine.js';
test('all 18 types produce distinct geometry even with the same color and beam shape',()=>{
 assert.deepEqual(Object.keys(TYPE_VISUALS).sort(),Object.keys(TYPES).sort());
 const traces=new Set();
 for(const type of Object.keys(TYPES)){
  const trace=[];let balance=0;
  const ctx=new Proxy({}, {set:()=>true,get:(_,name)=>(...args)=>{for(const n of args.filter(n=>typeof n==='number'))assert.ok(Number.isFinite(n));if(name==='save')balance++;if(name==='restore')balance--;trace.push([name,...args])}});
  drawAttack(ctx,{origin:{x:0,y:0},target:{x:250,y:50},move:{type,name:'Test',shape:'beam',color:'#ffffff'},points:[{x:250,y:50}],duration:.48,life:.24});
  assert.equal(balance,0,type);traces.add(JSON.stringify(trace));
 }
 assert.equal(traces.size,18);
});
test('type renderers handle all gameplay shapes and animation endpoints without leaking canvas state',()=>{
 for(const type of Object.keys(TYPE_VISUALS))for(const shape of ['beam','blast','cone','chain','slash','volley','vortex','quake'])for(const life of [0,.01,.24,.48]){
  let balance=0;const ctx=new Proxy({}, {set:()=>true,get:(_,name)=>(...args)=>{if(name==='save')balance++;if(name==='restore')balance--;for(const n of args.filter(n=>typeof n==='number'))assert.ok(Number.isFinite(n))}});
  drawAttack(ctx,{origin:{x:100,y:100},target:{x:100,y:100},move:{type,shape,name:type==='grass'?'Petal Blizzard':'Test',color:'#ffffff'},points:[],duration:.48,life});assert.equal(balance,0);
 }
});
