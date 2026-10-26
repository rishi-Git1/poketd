import test from 'node:test';import assert from 'node:assert/strict';import {harness} from './flow-harness.mjs';

test('wave button follows real combat and reward transitions instead of keeping its old battle label',async()=>{
 const h=await harness('paldea');h.choose(1);
 assert.equal(h.el('start').textContent,'Start wave 01 →');assert.equal(h.el('start').disabled,false);
 h.el('start').click();assert.equal(h.run.phase,'battle');assert.equal(h.el('start').textContent,'Wave in progress');assert.equal(h.el('start').disabled,true);
 for(let i=0;i<100&&h.run.phase==='battle';i++){h.tick(.25);for(const enemy of h.enemies)enemy.hp=0}
 assert.equal(h.run.phase,'draft');assert.equal(h.el('start').textContent,'Start wave 02 →');assert.equal(h.el('start').disabled,true);
 h.choose(0);assert.equal(h.run.phase,'ready');assert.equal(h.el('start').textContent,'Start wave 02 →');assert.equal(h.el('start').disabled,false);assert.equal(h.el('action-message').textContent,'Your team is ready.');assert.equal(h.el('wave-action').hidden,false);
 h.el('start').click();assert.equal(h.run.wave,2);assert.equal(h.el('start').textContent,'Wave in progress');assert.equal(h.el('start').disabled,true);
 h.el('pause').click();assert.equal(h.el('start').textContent,'Wave in progress');h.el('pause').click();
 h.run.rewardQueue=[{wave:1,cards:[{kind:'offense',title:'Rally'},{kind:'armor',title:'Armor'},{kind:'health',title:'Health'}]}];h.renderPendingRewards();h.choose(0);assert.equal(h.run.phase,'battle');assert.equal(h.el('start').textContent,'Wave in progress');assert.equal(h.el('start').disabled,true);
 h.el('auto').click();h.el('auto').click();assert.equal(h.run.phase,'battle');assert.equal(h.el('start').textContent,'Wave in progress');
 for(let i=0;i<100&&h.run.phase==='battle';i++){h.tick(.25);for(const enemy of h.enemies)enemy.hp=0}
 assert.equal(h.run.phase,'draft');h.choose(0);assert.equal(h.el('start').textContent,'Start wave 03 →');assert.equal(h.el('start').disabled,false);
});
