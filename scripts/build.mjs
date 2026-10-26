import {cp,rm,mkdir,readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,parse} from 'node:path';
import {fileURLToPath} from 'node:url';

// Hash dependency contents first so a changed map also changes the entry script URL.
export async function fingerprintAssets(directory){
 const files=(await readdir(directory)).filter(name=>/\.(js|css)$/.test(name)&&!/[.][a-f0-9]{12}[.](js|css)$/.test(name)).sort();
 const source=new Map(await Promise.all(files.map(async name=>[name,await readFile(resolve(directory,name),'utf8')]))),names=new Map(),visiting=new Set();
 async function emit(name){
  if(names.has(name))return names.get(name);
  if(visiting.has(name))throw Error(`Circular asset dependency: ${name}`);
  if(!source.has(name))throw Error(`Missing local asset: ${name}`);
  visiting.add(name);let content=source.get(name);
  if(name.endsWith('.js'))for(const match of [...content.matchAll(/(\bfrom\s*['"]|\bimport\s*['"])(\.\/[^'"]+\.js(?:\?[^'"]*)?)(['"])/g)]){
   const dependency=match[2].slice(2).split('?')[0];
   content=content.replaceAll(match[0],match[1]+'./'+await emit(dependency)+match[3]);
  }
  const hash=createHash('sha256').update(content).digest('hex').slice(0,12),{name:stem,ext}=parse(name),output=`${stem}.${hash}${ext}`;
  await writeFile(resolve(directory,output),content);names.set(name,output);visiting.delete(name);return output;
 }
 for(const name of files)await emit(name);
 const indexPath=resolve(directory,'index.html'),html=await readFile(indexPath,'utf8');
 await writeFile(indexPath,html.replace(/\b(src|href)=(['"])([^'"]+\.(?:js|css)(?:\?[^'"]*)?)\2/g,(match,attribute,quote,url)=>{
  const name=url.replace(/^\.\//,'').split('?')[0];return names.has(name)?`${attribute}=${quote}${names.get(name)}${quote}`:match;
 }));
 return Object.fromEntries(names);
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 await rm('dist',{recursive:true,force:true,maxRetries:3,retryDelay:100});await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});
 const assets=await fingerprintAssets('dist');
 await writeFile('dist/build-assets.json',JSON.stringify({version:JSON.parse(await readFile('package.json','utf8')).version,assets},null,2)+'\n');
 console.log(`Built static game in dist/ with ${Object.keys(assets).length} fingerprinted scripts/styles.`);
}
