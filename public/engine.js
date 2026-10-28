import {evolveAlly,maskDamage,canEvolve,isTransformation} from './transformations.js';
import {getRegion} from './regions.js';
export const TYPES={grass:'#78a857',poison:'#a970b3',fire:'#e9824e',water:'#61a6d4',bug:'#9baa4e',normal:'#afa58c',flying:'#9aafe0',electric:'#d4ad34',ground:'#ba9363',psychic:'#dc81a5',rock:'#a59569',ghost:'#8876ac',dragon:'#8379d3',ice:'#69c4d2',fighting:'#b76045',fairy:'#db91bb',steel:'#8c9fa7',dark:'#6c6084',stellar:'#86cfdf'};
// Attack and defender types never change damage. Collected type upgrades still apply.
export function effectiveness(){return 1}
export function waveCount(wave){return wave<=5?3+wave*2:13+(wave-5)*3}
export function openingEase(wave){return Math.min(1,.8+Math.max(0,wave-1)*.04)}
export function batchSpawnTime(index,total,wave=51){const groups=wave<=50?Math.min(5,Math.ceil(total/3)):Math.min(5,total);return Math.floor(index*groups/total)*3}
export function wavePlan(wave,roster,rng=Math.random){
 const maxStage=wave>=9?3:wave>=4?2:1;
 const eligible=roster.filter(p=>!p.bossOnly&&p.stage<=maxStage);
 const limit=wave===1?280:wave===2?330:wave===3?420:wave===4?470:wave===5?500:wave<9?550:wave<15?600:680;
 const gentle=eligible.filter(p=>Object.values(p.stats).reduce((a,b)=>a+b,0)<=limit);
 const pool=gentle.length?gentle:eligible;
 return Array.from({length:waveCount(wave)},(_,i)=>({at:batchSpawnTime(i,waveCount(wave),wave),pokemon:pool[Math.floor(rng()*pool.length)],angle:rng()*Math.PI*2}));
}
export function enemyStats(p,wave,boss=null,mode='classic'){
 const ease=openingEase(wave),endless=mode==='true-endless'?1.05**wave:mode==='endless'?1.05**Math.max(0,wave-151):1;
 const difficulty=boss&&!boss.final&&boss.tier!=='FINAL ENCOUNTER'&&boss.tier!=='LEGENDARY'?2:1,boost=(boss?.boost||1)*(boss?1.2:1)*difficulty;
 return {specialDefense:p.stats['special-defense']*(1+.025*wave)*ease*boost*endless,maxHp:(p.stats.hp*.53+9)*Math.pow(1.115,wave-1)*ease*boost*endless,defense:p.stats.defense*(1+.025*wave)*ease*boost*endless,speed:(10+p.stats.speed*.115+wave*.35)*Math.min(1,.86+Math.max(0,wave-1)*.028)*(boss?1.2:1)*difficulty*endless,impact:Math.ceil(Math.max(p.stats.attack,p.stats['special-attack'])*.12*(1+.07*wave)*Math.min(1,.7+Math.max(0,wave-1)*.06)*boost*endless)}
}
export function damageMultiplier(p,buffs){return (p.mega?1+(buffs.forms?.mega||0):1)*(p.gigantamax?1+(buffs.forms?.gmax||0):1)*repeatPower(buffs)*(p.personalPower||1)*maskDamage(p)*(1+buffs.offense)*p.types.reduce((n,t)=>n*(1+(buffs.types[t]||0)),1)*(1+(buffs.stages[p.stage]||0))}
export function recruitmentPool(roster,run){return roster.filter(p=>!p.bossOnly&&p.stage===1&&!run.team.some(a=>a.pokemon.id===p.id)&&Object.values(p.stats).reduce((a,b)=>a+b,0)<=Math.min(680,350+run.wave*30))}
export const TACTICS=[
 {kind:'split',title:'Split Volley',description:'Target one additional enemy per attack; divide damage only among targets actually available. A lone enemy takes full damage.'},
 {kind:'haste',title:'Quick Claw Relay',description:'15% shorter attack cooldown for the whole party. Each copy multiplies cooldown by 0.85.'},
 {kind:'chill',title:'Icy Pressure',description:'Damaging hits slow movement by 15% for 2 seconds. Copies compound the slow; hits refresh duration. Bosses resist half the slow.'},
 {kind:'pierce',title:'Armor Breaker',description:'Attacks ignore 20% of remaining physical or special defense. Copies compound. All enemy types take neutral damage.'},
 {kind:'finish',title:'Finishing Instinct',description:'Deal 30% more damage to enemies below 35% HP. Each copy multiplies finishing damage by 1.30.'},
 {kind:'siphon',title:'Victory Bloom',description:'Restore 1 tower HP per defeated enemy, per copy. Cannot exceed maximum HP.'}
].map(c=>({...c,label:'ADVANCED TACTIC',badge:'ROUND 51+',symbol:'★',accent:'#a17e40'}));
export const ELITE_TACTICS=[
 {kind:'ricochet',title:'Ricochet Volley',description:'Each primary attack bounces to one extra enemy within 160 range per stack. Each bounce retains 60% damage; no target is visited twice. Works with signature attacks too.'},
 {kind:'focus',title:'Lock-On Link',description:'Stay attached to one target: +20% primary-target damage per second per stack, up to +200% per stack. Resets when the target dies or leaves range.'},
 {kind:'cadence',title:'Critical Cadence',description:'Every fourth attack volley deals ×1.50 damage per stack. Applies to the whole volley, including split attacks and ricochets.'},
 {kind:'wounds',title:'Marked Wounds',description:'Hits mark enemies for 3 seconds: the party deals +5% damage per mark per stack, up to 8 marks. Hits refresh the duration.'},
 {kind:'nova',title:'Victory Nova',description:'Defeats explode for 60% of the killing hit per stack within 80 range. Explosions cannot trigger more explosions. All enemy types can be hit.'},
 {kind:'shield',title:'Guardian Shell',description:'Gain a shield worth 10% of max HP per stack now and at each round start. Shields absorb tower damage before HP.'},
 {kind:'surge',title:'Last Stand Relay',description:'While the tower is below 40% HP, the party has 20% shorter attack cooldown per stack. Compounds with Quick Claw Relay.'}
].map(c=>({...c,label:'ELITE TACTIC',badge:'ROUND 80+',symbol:'✦',accent:'#8862ac'}));
export const EXECUTE={kind:'execute',title:'Master Execute',amount:1,master:true,label:'MASTER TACTIC',badge:'ROUND 80+',symbol:'★',accent:'#d3a42b',description:'Damaging hits stun surviving enemies below 35% HP for 0.6 seconds per stack, stopping movement and attacks. After each stun, 2 seconds of recovery prevent repeated stun locks. Works on bosses and with Finishing Instinct.'};
export const LEGACY_REACH={kind:'reach',title:'Long Reach',description:'Legacy range upgrade'};
export const ALL_TACTICS=[...TACTICS,...ELITE_TACTICS,EXECUTE];
export const tacticStacks=(run,kind)=>run.tactics?.[kind]||0;
export const advancedUnlocked=run=>run.mode==='true-endless'?run.wave>=25:run.wave>50;
export const eliteUnlocked=run=>run.wave>=(run.mode==='true-endless'?50:80);
export const lateUpgrades=run=>advancedUnlocked(run)?[...TACTICS,...(eliteUnlocked(run)?ELITE_TACTICS:[])].map(c=>({...c,badge:run.mode==='true-endless'?(ELITE_TACTICS.some(t=>t.kind===c.kind)?'ROUND 50+':'ROUND 25+'):c.badge})):[];
export const targetCapacity=run=>1+tacticStacks(run,'split');
export const cooldownFactor=run=>.85**tacticStacks(run,'haste')*(run.hp<run.maxHp*.4?.8**tacticStacks(run,'surge'):1);
export function movementFactor(enemy,run){const slow=1-.85**tacticStacks(run,'chill');return enemy.slowTime>0?1-slow*(enemy.boss ? .5 : 1):1}
export function resolveHit(enemy,power,run,source=null){
 if(enemy.hp<=0||power<=0)return 0;
 const dealt=power*(enemy.hp<enemy.maxHp*.35?1.3**tacticStacks(run,'finish'):1)*(1+.05*tacticStacks(run,'wounds')*(enemy.marks||0));
 const removed=Math.min(enemy.hp,dealt);if(source){source.totalDamage=(source.totalDamage||0)+removed;source.damageHits=(source.damageHits||0)+1;source.strongestHit=Math.max(source.strongestHit||0,removed);run.totalDamage=(run.totalDamage||0)+removed}enemy.hp-=dealt;
 if(tacticStacks(run,'chill'))enemy.slowTime=2;
 if(tacticStacks(run,'wounds')){enemy.marks=Math.min(8,(enemy.marks||0)+1);enemy.markTime=3}
 if(enemy.hp>0&&enemy.hp<enemy.maxHp*.35&&tacticStacks(run,'execute')&&!(enemy.stunRecovery>0)){enemy.stunTime=.6*tacticStacks(run,'execute');enemy.stunRecovery=enemy.stunTime+2;}
 if(enemy.hp<=0){run.kills++;const before=run.hp;run.hp=Math.min(run.maxHp,run.hp+tacticStacks(run,'siphon'));if(source){source.defeats=(source.defeats||0)+1;if(enemy.boss)source.bossDefeats=(source.bossDefeats||0)+1;source.healing=(source.healing||0)+run.hp-before}}return dealt;
}

export function tacticSummary(run,kind){const n=tacticStacks(run,kind);return ({split:`Up to ${1+n} targets; divides damage among actual targets`,haste:`${(100*(1-.85**n)).toFixed(1)}% shorter cooldown`,reach:`${Math.round(run.range)} total range`,chill:`${(100*(1-.85**n)).toFixed(1)}% movement slow for 2s; bosses resist half`,pierce:`${(100*(1-.8**n)).toFixed(1)}% defense ignored`,finish:`${(1.3**n).toFixed(2)}× damage below 35% HP`,siphon:`Restore ${n} HP per defeat`,ricochet:`Up to ${n} bounces at 60% retained damage`,focus:`+${20*n}% per second; up to +${200*n}% on the locked target`,execute:`${(.6*n).toFixed(1)}s stun below 35% HP; 2s recovery`,cadence:`Every fourth volley: ×${(1.5**n).toFixed(2)}`,wounds:`+${5*n}% per mark; up to +${40*n}% for 3s`,nova:`${60*n}% killing-hit splash within 80 range`,shield:`${Math.ceil(run.shield||0)} shield remaining; ${10*n}% max HP each round`,surge:`${(100*(1-.8**n)).toFixed(1)}% shorter cooldown below 40% tower HP`})[kind]}
export function damage(ally,enemy,buffs){const p=ally.pokemon;const special=p.stats['special-attack']>p.stats.attack;const atk=Math.max(p.stats.attack,p.stats['special-attack']);const defense=special?enemy.specialDefense??enemy.pokemon.stats['special-defense']*(1+.025*buffs.wave)*openingEase(buffs.wave):enemy.defense;const mult=damageMultiplier(p,buffs);return Math.max(0,(8+atk*.23)*mult*100/(100+defense*.8**tacticStacks(buffs,'pierce')))}
export function newRun(region="kanto",options={}){const cfg=getRegion(region);return {region,mode:region==='origin'?'true-endless':options.mode==='endless'?'endless':'classic',originSetupLeft:0,starterMode:options.starters==='random'?'random':'classic',forms:{},endlessBosses:{},rounds:cfg.rounds,wave:0,rewardQueue:[],tradeQueue:[],range:335,growthWaves:[],swapWaves:[],starter:1,hp:250,maxHp:250,shield:0,armor:0,offense:0,types:{},stages:{},tactics:{},team:[],kills:0,upgrades:[],upgradeHistory:[],phase:'starter'}}
export function applyUpgrade(run,card){
 if(card.kind==='evolve'&&!run.team.some(a=>a.pokemon.id===card.from&&canEvolve(a)))return false;
 if(card.kind==='reach'||ALL_TACTICS.some(c=>c.kind===card.kind)){const amount=card.amount??1;run.tactics[card.kind]=(run.tactics[card.kind]||0)+amount;if(card.kind==='reach')run.range*=1.12**amount;if(card.kind==='shield')run.shield=(run.shield||0)+run.maxHp*.1*amount;}
 if(card.kind==='recruit')run.team.push({pokemon:card.pokemon,cooldown:0,totalDamage:0});
 if(card.kind==='evolve'){const ally=run.team.find(a=>a.pokemon.id===card.from);if(ally)evolveAlly(ally,card.pokemon);}
 if(card.kind==='form'){run.forms??={};run.forms[card.form]=(1+(run.forms[card.form]||0))*(1+(card.amount??.35))-1}
 if(card.kind==='offense')run.offense=(1+run.offense)*(1+(card.amount??.18))-1;
 if(card.kind==='armor')run.armor+=card.amount??.12;
 if(card.kind==='health'){run.maxHp+=card.amount??65;run.hp=Math.min(run.maxHp,run.hp+(card.heal??105))}
 if(card.kind==='type')run.types[card.type]=(1+(run.types[card.type]||0))*(1+(card.amount??.35))-1;
 if(card.kind==='stage')run.stages[card.stage]=(1+(run.stages[card.stage]||0))*(1+(card.amount??.35))-1;
 run.upgradeRevision=(run.upgradeRevision||0)+1;run.upgrades.push(card.title);run.upgradeHistory.push({...card,growthAt:run.growthWaves.length});
}

export function formatDamageTotal(value){const total=Math.max(0,value||0);return total>=1e6?new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(total):Math.round(total).toLocaleString('en-US')}

// Normal and master versions share one identity; Pokémon use their destination ID.
export const cardKey=c=>c.pokemon?`pokemon:${c.pokemon.id}`:[c.kind,c.type||c.form||'',c.stage||''].join(':');
export const upgradeWeight=(card,run)=>(run.mode==='true-endless'?run.wave>50:run.wave>80)&&card.kind==='offense'?4:1;
export function drawDistinct(pool,count,run,rng=Math.random,excluded=[]){
 const seen=new Set(excluded.map(cardKey)),available=[];
 for(const card of pool){if(!card||seen.has(cardKey(card)))continue;seen.add(cardKey(card));available.push(card)}
 const result=[];
 while(result.length<count&&available.length){
  const total=available.reduce((n,c)=>n+upgradeWeight(c,run),0);let roll=rng()*total,index=available.length-1;
  for(let i=0;i<available.length;i++){roll-=upgradeWeight(available[i],run);if(roll<0){index=i;break}}
  const card=available.splice(index,1)[0];if(card.kind==='tera'&&[...excluded,...result].filter(c=>c.kind==='tera').length>=2)continue;result.push(card);
 }return result;
}
export function distinctRoll(cards,fallback,run,rng=Math.random){
 const seen=new Set(),result=[];
 for(const card of cards){if(card&&!seen.has(cardKey(card))&&!(card.kind==='tera'&&result.filter(c=>c.kind==='tera').length>=2)){seen.add(cardKey(card));result.push(card)}}
 return [...result,...drawDistinct(fallback,3-result.length,run,rng,result)].slice(0,3);
}
export function selectRewardCards(run,pool,partners,evolutions,rng=Math.random){
 const special=drawDistinct(partners.length?partners:evolutions,1,run,rng)[0];
 const tactic=advancedUnlocked(run)?drawDistinct(lateUpgrades(run),1,run,rng)[0]:null;
 const fixed=[special,tactic].filter(Boolean);
 let first=drawDistinct(pool,1,run,rng,fixed)[0];
 if(evolutions.length&&rng()<.6)first=drawDistinct(evolutions,1,run,rng,fixed)[0]||first;
 const cards=[first,tactic||drawDistinct(pool,1,run,rng,[first,special].filter(Boolean))[0],special];
 const unique=distinctRoll(cards,pool,run,rng);
 // The guaranteed tactic stays in slot 1 during master conversion.
 return distinctRoll(rollMasterCards(unique,run,rng),pool,run,rng);
}
export function masterUpgrades(run){
 const cards=[{kind:'offense',title:'Master Rally',amount:.5,description:'×1.50 universal damage'},{kind:'armor',title:'Master Fortification',amount:.4,description:'+40 armor points'},{kind:'health',title:'Master Restoration',amount:200,heal:250,description:'+200 max HP; restore 250 HP'}];
 for(const type of new Set(run.team.flatMap(a=>a.pokemon.types)))cards.push({kind:'type',type,title:`Master ${type}`,amount:.8,description:`×1.80 damage for ${type} partners`});
 for(const stage of new Set(run.team.map(a=>a.pokemon.stage)))cards.push({kind:'stage',stage,title:`Master Stage ${stage}`,amount:.8,description:`×1.80 damage for stage ${stage} partners`});
 for(const c of lateUpgrades(run))cards.push({...c,title:`Master ${c.title}`,amount:2,description:`Two stacks: ${c.description}`});
 if(eliteUnlocked(run))cards.push({...EXECUTE});
 cards.push(...formUpgrades(run).map(c=>({...c,amount:.8,description:'+80% damage for matching transformed partners'})));
 return cards.map(c=>({...c,master:true,label:'MASTER UPGRADE',badge:'MASTER',symbol:'★',accent:'#d3a42b'}));
}
export function rollMasterCards(cards,run,rng=Math.random){
 if(!eliteUnlocked(run))return cards;
 const result=[...cards];for(let i=0;i<result.length;i++){
  const c=result[i];if(['recruit','evolve'].includes(c.kind)||isTransformation(c)||rng()>=.1)continue;
  const candidates=masterUpgrades(run).filter(m=>!result.some((other,j)=>j!==i&&cardKey(m)===cardKey(other))&&(i!==1||!ALL_TACTICS.some(t=>t.kind===c.kind)||ALL_TACTICS.some(t=>t.kind===m.kind)));
  if(candidates.length)result[i]=drawDistinct(candidates,1,run,rng)[0];
 }return result;
}
export function updateFocus(ally,candidates,dt,run){
 const enabled=tacticStacks(run,'focus')>0;
 if(!enabled||!candidates.includes(ally.focusTarget)){ally.focusTarget=candidates[0]||null;ally.focusTime=0}
 else ally.focusTime=Math.min(10,(ally.focusTime||0)+dt);
 return ally.focusTarget;
}
export const focusFactor=(ally,run)=>1+.2*tacticStacks(run,'focus')*(ally.focusTime||0);
export function volleyFactor(ally,run){ally.volleys=(ally.volleys||0)+1;return ally.volleys%4===0?1.5**tacticStacks(run,'cadence'):1}
export function advanceStatus(enemy,dt){enemy.slowTime=Math.max(0,(enemy.slowTime||0)-dt);enemy.stunTime=Math.max(0,(enemy.stunTime||0)-dt);enemy.stunRecovery=Math.max(0,(enemy.stunRecovery||0)-dt);enemy.markTime=Math.max(0,(enemy.markTime||0)-dt);if(!enemy.markTime)enemy.marks=0;}
export function absorbTowerHit(run,impact){const blocked=Math.min(run.shield||0,impact);run.shield=Math.max(0,(run.shield||0)-blocked);const hpDamage=impact-blocked;run.hp=Math.max(0,run.hp-hpDamage);return hpDamage}
export function nextBounce(origin,enemies,visited){return enemies.filter(e=>e.hp>0&&!visited.includes(e)&&Math.hypot(e.x-origin.x,e.y-origin.y)<=160).sort((a,b)=>Math.hypot(a.x-origin.x,a.y-origin.y)-Math.hypot(b.x-origin.x,b.y-origin.y))[0]}

export function repeatCount(run,card){return (run.upgradeHistory||[]).filter(c=>cardKey(c)===cardKey(card)&&!c.transformation).length}
const repeatCache=new WeakMap();
const passiveKinds=new Set(['offense','armor','health','type','stage','form',...ALL_TACTICS.map(c=>c.kind)]);
export function repeatPower(run){
 const history=run.upgradeHistory||[],cached=repeatCache.get(run),revision=run.upgradeRevision||0;
 if(cached&&cached.history===history&&cached.revision===revision&&cached.length===history.length)return cached.power;
 const counts=new Map();for(const c of history){if(!passiveKinds.has(c.kind)||c.transformation)continue;const key=cardKey(c);counts.set(key,(counts.get(key)||0)+1)}
 const power=1.1**[...counts.values()].reduce((sum,n)=>sum+Math.max(0,n-1),0);repeatCache.set(run,{history,revision,length:history.length,power});return power;
}

export function formUpgrades(run){
 if(run.wave<=100)return [];
 return [['mega','Mega Rally','Mega-Evolved'],['gmax','Gigantamax Rally','Gigantamax']].filter(([form])=>run.team.some(a=>form==='mega'?a.pokemon.mega:a.pokemon.gigantamax)).map(([form,title,label])=>({kind:'form',form,title,label:'FORM SPECIALIST',badge:label.toUpperCase(),symbol:'◈',accent:'#b56fbe',description:`+35% damage for every ${label} partner. Copies multiply.`,amount:.35}));
}
export function starterChoices(roster,region,mode='classic',rng=Math.random){
 const cfg=getRegion(region);if(mode!=='random')return cfg.starters.map(id=>roster.find(p=>p.id===id));
 const seen=new Set(),pool=roster.filter(p=>{const species=p.speciesId||p.id;if(p.stage!==1||p.bossOnly||p.transformOnly||seen.has(species))return false;seen.add(species);return true});
 const result=[];while(result.length<3&&pool.length)result.push(pool.splice(Math.floor(rng()*pool.length),1)[0]);if(result.length!==3)throw Error('Not enough first-stage starters');return result;
}

// Target eligibility is independent of Pokémon, move types and damage calculations.
export function targetsInRange(enemies,range,origin={x:500,y:345}){
 const distance=e=>Math.hypot(e.x-origin.x,e.y-origin.y);
 return enemies.filter(e=>e.hp>0&&distance(e)<range).sort((a,b)=>distance(a)-distance(b));
}
