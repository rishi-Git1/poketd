import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {damage,newRun,TYPES} from '../public/engine.js';
const dex=JSON.parse(readFileSync('public/assets/all-pokemon.json')),attackers=[373,65].map(id=>({pokemon:dex.find(p=>p.id===id)}));

test('every bundled defender has identical neutral damage when defenses are held constant',()=>{
 const run=newRun();for(const ally of attackers){const enemy={pokemon:dex[0],defense:100,specialDefense:100},baseline=damage(ally,enemy,run);assert.ok(baseline>0);for(const pokemon of dex){assert.equal(damage(ally,{...enemy,pokemon},run),baseline,pokemon.name);assert.equal(damage(ally,{...enemy,pokemon:{...pokemon,teraType:'stellar'}},run,'stellar'),baseline,pokemon.name+' Stellar')}}
});

test('actual damage is unchanged across all attack types and all single/dual defender types',()=>{
 const run=newRun(),types=Object.keys(TYPES);for(const ally of attackers){const enemy={pokemon:dex[0],defense:120,specialDefense:120},baseline=damage(ally,enemy,run);for(const attackType of types)for(const first of types){assert.equal(damage(ally,{...enemy,pokemon:{...enemy.pokemon,types:[first]}},run,attackType),baseline);for(const second of types)assert.equal(damage(ally,{...enemy,pokemon:{...enemy.pokemon,types:[first,second]}},run,attackType),baseline)}}
});
