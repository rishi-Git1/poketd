import {attackFor} from './attacks.js';
// Pokémon Masters EX's two boosting weather effects, three terrains and 13 zones.
// Tower-defense adaptation: one permanent field per expedition, then one EX upgrade.
export const WTZ=[
 ['sunny','Sunny','fire','weather','#f1ae49','#d78035'],
 ['rain','Rain','water','weather','#78bfe9','#386d9e'],
 ['electric-terrain','Electric Terrain','electric','terrain','#e5d46a','#8e9745'],
 ['grassy-terrain','Grassy Terrain','grass','terrain','#8ac86c','#477c49'],
 ['psychic-terrain','Psychic Terrain','psychic','terrain','#df8dc8','#8d5b9f'],
 ...[
  ['normal','#dfd7b3','#9c9685'],['fighting','#e6a075','#9e604a'],
  ['flying','#b5e2e8','#6b9db4'],['poison','#c58bd5','#725178'],
  ['ground','#dbb378','#a07a45'],['rock','#bdae94','#756b61'],
  ['bug','#c7d374','#7b914f'],['ghost','#ae95d9','#554578'],
  ['steel','#b4d0d7','#657d8c'],['ice','#bdedf2','#70b5cb'],
  ['dragon','#ab9ee8','#6d5f9f'],['dark','#a09ab7','#3c3b58'],
  ['fairy','#f1afd4','#b276aa']
 ].map(([type,color,shade])=>[type+'-zone',type[0].toUpperCase()+type.slice(1)+' Zone',type,'zone',color,shade])
].map(([key,name,type,category,color,shade])=>Object.freeze({key,name,type,category,color,shade}));
const byKey=new Map(WTZ.map(w=>[w.key,w]));
const regions=new Set(['hoenn','sinnoh','unova','kalos','alola','galar','paldea','origin']);
export const isWtz=card=>card?.kind==='wtz';
export const wtzDefinition=key=>byKey.get(key)||null;
export const activeWtz=run=>byKey.get(run.wtz?.key)||null;
export const wtzPower=run=>activeWtz(run)?run.wtz.ex?3:1.5:1;
export const wtzName=run=>activeWtz(run)?`${run.wtz.ex?'EX ':''}${activeWtz(run).name}`:'';
export const wtzSummary=run=>activeWtz(run)?`${wtzName(run)} · ${activeWtz(run).type.toUpperCase()} attacks ×${wtzPower(run).toFixed(2)}`:'No WTZ installed';
// This checks the ally's current attack only. Defender typing is never consulted.
export function wtzMultiplier(p,run,moveType){const field=activeWtz(run);return field&&(moveType??attackFor(p).type)===field.type?wtzPower(run):1}
export function wtzAvailable(run,card){
 if(!isWtz(card))return true;
 const field=byKey.get(card.wtz);if(!field||!regions.has(run.region)||run.wave<(card.ex?100:25))return false;
 const chosen=run.wtzChoice||run.wtz?.key;
 if(chosen)return card.ex===true&&chosen===field.key&&!run.wtz?.ex;
 return run.team.some(a=>attackFor(a.pokemon).type===field.type);
}
export function wtzCard(key,ex=false){
 const f=byKey.get(key);if(!f)return null;
 return {kind:'wtz',wtz:key,type:f.type,ex,title:`${ex?'EX ':''}${f.name}`,label:ex?'EX WTZ UPGRADE':`${f.category.toUpperCase()} UPGRADE`,badge:`${f.type.toUpperCase()} ATTACKS ×${ex?'3.00':'1.50'}`,symbol:'✧',accent:f.color,
  description:ex?`Permanently set EX ${f.name}: ${f.type}-type attacks deal ×3 damage. Replaces the normal ×1.5 effect. Keeps this expedition's chosen WTZ; no further WTZ rewards after EX. No field damage.`:`Permanently set ${f.name}: ${f.type}-type attacks deal ×1.5 damage. Changes the entire battlefield's appearance. Choose one WTZ for the expedition; only its matching EX can appear afterward, from round 100. No field damage.`};
}
export function wtzCards(run,{exOnly=false}={}){
 if(!regions.has(run.region)||run.wave<25||run.wtz?.ex)return [];
 return WTZ.flatMap(f=>[...(!exOnly?[wtzCard(f.key)]:[]),wtzCard(f.key,true)]).filter(c=>wtzAvailable(run,c));
}
// A whole tier has one reward's weight: normal = a Memory card; EX = a Mega card.
export function wtzWeight(card,run){return 1/Math.max(1,wtzCards(run,{exOnly:!!card.ex}).filter(c=>!!c.ex===!!card.ex).length)}
export function installWtz(run,card){
 if(!isWtz(card)||!wtzAvailable(run,card))return false;
 run.wtzChoice??=card.wtz;run.wtz={key:card.wtz,ex:card.ex===true};return true;
}

const glyphs={
 fire:'<path d="m36 8 6 12 13-3-5 13 12 7-14 3 1 14-12-9-10 8 1-14-13-4 12-7-4-12 12 4Z"/>',
 water:'<path d="m20 12-7 18m24-22-7 18m24-13-7 18M27 32l-5 13m26-12-4 11" fill="none" stroke="currentColor" stroke-width="4"/>',
 electric:'<path d="m40 7-21 24h15l-4 19 23-27H38Z"/>',
 grass:'<path d="M35 47V25M35 35 18 29 13 14l17 4 5 10m0 9 19-10 4-16-18 7-5 10" fill="none" stroke="currentColor" stroke-width="4"/>',
 psychic:'<path d="m36 6 18 22-18 22-18-22Zm-25 5 5 8-5 8-5-8Zm49 20 6 9-6 9-6-9Z"/>',
 normal:'<path d="m36 7 5 16 16 5-16 5-5 16-5-16-16-5 16-5Z"/>',
 fighting:'<path d="m9 39 20-26 11 8-16 22Zm24 2L50 16l13 9-19 22Z"/>',
 flying:'<path d="M7 21q24-20 54-1M12 33q24-19 46-2M24 43q16-12 35-8" fill="none" stroke="currentColor" stroke-width="4"/>',
 poison:'<path d="m15 42-6-8 10-17 7 14-4 11Zm24-5-8-10 11-20 10 18-3 12Zm14 12-3-8 8-14 7 15-3 7Z"/>',
 ground:'<path d="m12 8 17 13-7 8 20 7-7 13M60 10 43 21l6 7-7 8" fill="none" stroke="currentColor" stroke-width="5"/>',
 rock:'<path d="m14 39 5-22 21-7 17 14 2 22-31 4Zm5-22 16 14 22-7M35 31l-7 19" fill="none" stroke="currentColor" stroke-width="4"/>',
 bug:'<path d="m36 25-18-13-8 11 16 15Zm0 0 18-13 8 11-16 15ZM32 18h8v28h-8Z"/>',
 ghost:'<path d="m12 44 5-17 8 10 4-23 9 17 7-25 7 25 10 13-25 5Z"/>',
 steel:'<path d="M13 12h46v32H13Zm0 0 13 13h20l13-13M26 25v19m20-19v19" fill="none" stroke="currentColor" stroke-width="4"/>',
 ice:'<path d="M36 7v42M18 17l36 22M18 39l36-22m-25-5 7 6 7-6m-14 32 7-6 7 6M19 25l8 1-1-8m20 20-1-8 8 1" fill="none" stroke="currentColor" stroke-width="3"/>',
 dragon:'<path d="m36 44-20-20 2-15 14 11 4-12 4 12 14-11 2 15Zm-9-16 9 8 9-8" fill="none" stroke="currentColor" stroke-width="4"/>',
 dark:'<path d="m8 14 50-5-11 10-33 7Zm6 20 47-11-12 13-34 11Z"/>',
 fairy:'<path d="m35 8 5 14 15 5-15 5-5 15-5-15-14-5 14-5Zm24 27 3 6 7 2-7 2-3 7-2-7-7-2 7-2Z"/>'
};
export function wtzArt(card){
 if(!isWtz(card))return '';
 const f=byKey.get(card.wtz);if(!f)return '';
 return `<svg class="wtz-card-art" viewBox="0 0 72 56" role="img" aria-label="${card.ex?'EX ':''}${f.name}" style="color:${f.color}"><rect x="2" y="2" width="68" height="52" fill="${f.shade}" stroke="${card.ex?'#e5c46d':f.color}" stroke-width="3"/><g fill="currentColor">${glyphs[f.type]}</g>${card.ex?'<path d="M4 15V4h13m38 0h13v11M4 41v11h13m38 0h13V41" fill="none" stroke="#fff2b0" stroke-width="3"/>':''}</svg>`;
}
