import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {fingerprintAssets} from '../scripts/build.mjs';

test('changed scenery gets a fresh URL and propagates through cached imports to the HTML entry',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'bastion-cache-'));
 try{
  await writeFile(join(dir,'maps.js'),"export const crystals='old';\n");
  await writeFile(join(dir,'app.js'),"import {crystals} from './maps.js?v=19';\nconsole.log(crystals);\n");
  await writeFile(join(dir,'style.css'),'body{color:teal}');
  const html='<link rel="stylesheet" href="style.css?v=19"><script type="module" src="app.js?v=19"></script>';
  await writeFile(join(dir,'index.html'),html);const first=await fingerprintAssets(dir);
  assert.match(first['maps.js'],/^maps\.[a-f0-9]{12}\.js$/);assert.match(await readFile(join(dir,first['app.js']),'utf8'),new RegExp(first['maps.js'].replaceAll('.','\\.')));
  const firstHtml=await readFile(join(dir,'index.html'),'utf8');assert.ok(firstHtml.includes(first['app.js']));assert.ok(firstHtml.includes(first['style.css']));assert.ok(!firstHtml.includes('?v='));
  await writeFile(join(dir,'maps.js'),"export const crystals='rainbow shell facets';\n");await writeFile(join(dir,'index.html'),html);const next=await fingerprintAssets(dir);
  assert.notEqual(first['maps.js'],next['maps.js']);assert.notEqual(first['app.js'],next['app.js']);assert.equal(first['style.css'],next['style.css']);assert.ok((await readFile(join(dir,'index.html'),'utf8')).includes(next['app.js']));assert.ok((await readFile(join(dir,next['app.js']),'utf8')).includes(next['maps.js']));
  const unchanged=await fingerprintAssets(dir);assert.deepEqual(unchanged,next);
 }finally{await rm(dir,{recursive:true,force:true})}
});

test('missing imported build assets fail instead of shipping an incomplete game',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'bastion-missing-'));
 try{await writeFile(join(dir,'app.js'),"import './maps.js';");await writeFile(join(dir,'index.html'),'<script src="app.js"></script>');await assert.rejects(fingerprintAssets(dir),/Missing local asset: maps.js/)}finally{await rm(dir,{recursive:true,force:true})}
});
