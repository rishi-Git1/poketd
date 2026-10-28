import {batchSpawnTime,ALL_TACTICS,masterUpgrades,cardKey,drawDistinct} from './engine.js?v=24';
import {getRegion} from './regions.js';
export const BOSSES=getRegion('kanto').bosses;
export function bossFor(wave,starter=1,region='kanto'){const b=getRegion(region).bosses.find(b=>b.wave===wave);if(!b)return null;let team=[...b.team];if(region==='kanto'&&b.name==='Blue')team=starter===4?[18,65,112,59,103,9]:starter===7?[18,65,112,130,59,3]:team;if(region==='galar'&&b.name==='Hop')team=[832,143,823,871,starter===813?812:starter===816?815:818];if(region==='galar'&&b.name==='Leon')team=[681,887,612,...(starter===813?[866,818]:starter===816?[464,812]:[537,815]),6];return {...b,team,boost:b.boost||1.25,final:wave===getRegion(region).rounds||b.tier==='LEGENDARY'}}
export function nextBoss(wave,region='kanto',mode='classic'){const r=getRegion(region);if(mode==='true-endless')return {wave:(Math.floor(wave/10)+1)*10,name:'Random Legendary / Mythical / Ultra Beast',tier:'TRUE ENDLESS BOSS'};return r.bosses.find(b=>b.wave>wave)||(mode==='endless'?{wave:r.rounds+Math.max(1,Math.floor((wave-r.rounds)/10)+1)*10,name:'Random Pokémon boss',tier:'ENDLESS BOSS'}:null)}
export function campaignPlan(wave,roster,starter,region='kanto',run=null,rng=Math.random){
 let b=run?.mode==='true-endless'?null:bossFor(wave,starter,region);const cap=getRegion(region).rounds;
 if(run?.mode==='true-endless'&&wave%10===0){
  run.endlessBosses??={};let id=run.endlessBosses[wave];if(!id){const pool=roster.filter(p=>!p.bossOnly&&!p.transformOnly&&(p.legendary||p.mythical||p.ultraBeast));if(!pool.length)throw Error('Missing True Endless boss pool');id=pool[Math.floor(rng()*pool.length)].id;run.endlessBosses[wave]=id}
  const p=roster.find(p=>p.id===id);b={wave,name:p.name,team:[id],tier:'TRUE ENDLESS BOSS',boost:1.5,final:false};
 }
 if(!b&&run?.mode==='endless'&&wave>cap&&(wave-cap)%10===0){
  run.endlessBosses??={};let id=run.endlessBosses[wave];if(!id){const pool=roster.filter(p=>!p.bossOnly&&!p.transformOnly);id=pool[Math.floor(rng()*pool.length)].id;run.endlessBosses[wave]=id}
  const p=roster.find(p=>p.id===id);b={wave,name:p.name,team:[id],tier:'ENDLESS BOSS',boost:4*1.15**((wave-cap)/10-1),final:false};
 }
 return b?b.team.map((id,i)=>{const pokemon=roster.find(p=>p.id===id);if(!pokemon)throw Error(`Missing ${region} boss Pokémon ${id}`);return {pokemon,at:batchSpawnTime(i,b.team.length,wave),angle:i*Math.PI*2/b.team.length,boss:b}}):null;
}
export function applyTowerGrowth(run){if(run.wave===0||run.wave%10||run.growthWaves.includes(run.wave))return false;run.growthWaves.push(run.wave);run.range*=1.05;run.armor=(1+run.armor)*1.05-1;const increase=run.maxHp*.05;run.maxHp+=increase;run.hp+=increase;return true}
export function canAutoAdvance(run,{enabled,paused,dialogOpen,hidden}){return enabled&&run.phase==='ready'&&!paused&&!dialogOpen&&!hidden&&!run.originSetupLeft&&(run.mode!=='classic'||run.wave<(run.rounds??151))}
export const isBuff=c=>['offense','type','stage','form','health','armor','reach',...ALL_TACTICS.map(c=>c.kind)].includes(c.kind);
export function premiumOffers(kind,run,roster,rng=Math.random,excluded=[]){
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 if(kind==='pokemon'){const available=roster.filter(p=>!p.bossOnly&&!p.next&&!run.team.some(a=>a.pokemon.id===p.id)),fresh=available.filter(p=>!excluded.some(c=>c.pokemon?.id===p.id)),eligible=fresh.length>=3?fresh:available;const legends=eligible.filter(p=>p.legendary||p.mythical||[144,145,146,150,151].includes(p.id));const chosen=shuffle(eligible.filter(p=>!legends.includes(p))).slice(0,2);if(legends.length)chosen.push(shuffle(legends)[0]);else chosen.push(...shuffle(eligible.filter(p=>!chosen.includes(p))).slice(0,1));return shuffle(chosen).map(p=>({kind:'recruit',pokemon:p,title:p.name,label:'PREMIUM PARTNER',description:'Fully evolved partner. Replaces the selected party slot.'}))}
 const pool=masterUpgrades(run),fresh=pool.filter(c=>!excluded.some(old=>cardKey(c)===cardKey(old)));
 const chosen=drawDistinct(fresh,3,run,rng);return [...chosen,...drawDistinct(pool,3-chosen.length,run,rng,chosen)].map(c=>({...c,label:'PREMIUM UPGRADE'}))
}
export function removeBuff(run,index){const c=run.upgradeHistory[index];if(!c||!isBuff(c))throw Error('Choose an existing upgrade');if(c.kind==='reach'||ALL_TACTICS.some(t=>t.kind===c.kind)){const stacks=c.amount??1;run.tactics[c.kind]=Math.max(0,(run.tactics[c.kind]||0)-stacks);if(c.kind==='reach')run.range/=1.12**stacks;if(c.kind==='shield')run.shield=Math.min(run.shield||0,run.maxHp*.1*(run.tactics.shield||0));}const amount=c.amount??(c.kind==='offense'?.18:c.kind==='armor'?.12:c.kind==='health'?65:.35),growth=Math.pow(1.05,run.growthWaves.length-(c.growthAt||0));if(c.kind==='offense')run.offense=(1+run.offense)/(1+amount)-1;if(c.kind==='type')run.types[c.type]=(1+run.types[c.type])/(1+amount)-1;if(c.kind==='stage')run.stages[c.stage]=(1+run.stages[c.stage])/(1+amount)-1;if(c.kind==='form')run.forms[c.form]=(1+(run.forms[c.form]||0))/(1+amount)-1;if(c.kind==='armor')run.armor=Math.max(0,run.armor-amount*growth);if(c.kind==='health'){run.maxHp-=amount*growth;run.hp=Math.min(run.hp,run.maxHp)}run.upgradeRevision=(run.upgradeRevision||0)+1;run.upgradeHistory.splice(index,1);run.upgrades.splice(index,1)}
export function commitSwap(run,kind,index,card,apply){if(kind==='pokemon'){if(!run.team[index]||card.kind!=='recruit'||run.team.some(a=>a.pokemon.id===card.pokemon.id))throw Error('Invalid party swap');run.team[index]={pokemon:card.pokemon,cooldown:0,totalDamage:0};run.upgrades.push(card.title);run.upgradeHistory.push({...card,kind:'swap-pokemon',growthAt:run.growthWaves.length})}else{if(!isBuff(card))throw Error('Invalid upgrade swap');removeBuff(run,index);apply(run,card)}}

export function initTrade(trade){trade.cache??={};trade.used??={pokemon:false,upgrade:false};trade.rerolled??={pokemon:false,upgrade:false};return trade}
export function rerollTrade(trade,kind,run,roster,rng=Math.random){
 initTrade(trade);if(!['pokemon','upgrade'].includes(kind)||trade.used[kind]||trade.rerolled[kind])return false;
 trade.cache[kind]=premiumOffers(kind,run,roster,rng,trade.cache[kind]||[]);trade.rerolled[kind]=true;return true;
}
export function commitTradeChoice(trade,kind,index,card,run,apply){
 initTrade(trade);if(!['pokemon','upgrade'].includes(kind)||trade.used[kind]||!trade.cache[kind]?.includes(card))return false;
 commitSwap(run,kind,index,card,apply);trade.used[kind]=true;return true;
}
