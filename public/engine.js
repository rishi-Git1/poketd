import {getRegion} from './regions.js';
export const TYPES={grass:'#78a857',poison:'#a970b3',fire:'#e9824e',water:'#61a6d4',bug:'#9baa4e',normal:'#afa58c',flying:'#9aafe0',electric:'#d4ad34',ground:'#ba9363',psychic:'#dc81a5',rock:'#a59569',ghost:'#8876ac',dragon:'#8379d3',ice:'#69c4d2',fighting:'#b76045',fairy:'#db91bb',steel:'#8c9fa7',dark:'#6c6084'};
// Standard type chart, keyed by attacking type. Dual typing multiplies both factors.
const chart={dark:{fighting:.5,psychic:2,ghost:2,dark:.5,fairy:.5},ice:{fire:.5,water:.5,grass:2,ice:.5,ground:2,flying:2,dragon:2,steel:.5},fighting:{normal:2,ice:2,poison:.5,flying:.5,psychic:.5,bug:.5,rock:2,ghost:0,dark:2,steel:2,fairy:.5},fairy:{fire:.5,fighting:2,poison:.5,dragon:2,dark:2,steel:.5},steel:{fire:.5,water:.5,electric:.5,ice:2,rock:2,fairy:2,steel:.5},normal:{rock:.5,ghost:0,steel:.5},fire:{fire:.5,water:.5,grass:2,ice:2,bug:2,rock:.5,dragon:.5,steel:2},water:{fire:2,water:.5,grass:.5,ground:2,rock:2,dragon:.5},grass:{fire:.5,water:2,grass:.5,poison:.5,ground:2,flying:.5,bug:.5,rock:2,dragon:.5,steel:.5},electric:{water:2,electric:.5,grass:.5,ground:0,flying:2,dragon:.5},bug:{fire:.5,grass:2,fighting:.5,poison:.5,flying:.5,psychic:2,ghost:.5,dark:2,steel:.5,fairy:.5},poison:{grass:2,poison:.5,ground:.5,rock:.5,ghost:.5,steel:0,fairy:2},flying:{electric:.5,grass:2,fighting:2,bug:2,rock:.5,steel:.5},ground:{fire:2,electric:2,grass:.5,poison:2,flying:0,bug:.5,rock:2,steel:2},rock:{fire:2,ice:2,fighting:.5,ground:.5,flying:2,bug:2,steel:.5},psychic:{fighting:2,poison:2,psychic:.5,dark:0,steel:.5},ghost:{normal:0,psychic:2,ghost:2,dark:.5},dragon:{dragon:2,steel:.5,fairy:0}};
export function effectiveness(type,types){return types.reduce((n,t)=>n*(chart[type]?.[t]??1),1)}
export function waveCount(wave){return wave<=5?3+wave*2:13+(wave-5)*3}
export function openingEase(wave){return Math.min(1,.65+Math.max(0,wave-1)*.07)}
export function batchSpawnTime(index,total){return Math.floor(index*Math.min(5,total)/total)*3}
export function wavePlan(wave,roster,rng=Math.random){
 const maxStage=wave>=9?3:wave>=4?2:1;
 const eligible=roster.filter(p=>!p.bossOnly&&p.stage<=maxStage);
 const limit=wave===1?280:wave===2?330:wave===3?420:wave===4?470:wave===5?500:wave<9?550:wave<15?600:680;
 const gentle=eligible.filter(p=>Object.values(p.stats).reduce((a,b)=>a+b,0)<=limit);
 const pool=gentle.length?gentle:eligible;
 const spacing=wave<=3?3.2:2.4;
 return Array.from({length:waveCount(wave)},(_,i)=>({at:wave>50?batchSpawnTime(i,waveCount(wave)):Math.floor(i/3)*spacing+(i%3)*.36+rng()*.2,pokemon:pool[Math.floor(rng()*pool.length)],angle:rng()*Math.PI*2}));
}
export function enemyStats(p,wave,boss=null){const ease=openingEase(wave),boost=(boss?.boost||1)*(boss?1.2:1);return {specialDefense:p.stats['special-defense']*(1+.025*wave)*ease*boost,maxHp:(p.stats.hp*.53+9)*Math.pow(1.115,wave-1)*ease*boost,defense:p.stats.defense*(1+.025*wave)*ease*boost,speed:(10+p.stats.speed*.115+wave*.35)*Math.min(1,.78+Math.max(0,wave-1)*.044)*(boss?1.2:1),impact:Math.ceil(Math.max(p.stats.attack,p.stats['special-attack'])*.12*(1+.07*wave)*Math.min(1,.55+Math.max(0,wave-1)*.09)*boost)}}
export function damageMultiplier(p,buffs){return (1+buffs.offense)*p.types.reduce((n,t)=>n*(1+(buffs.types[t]||0)),1)*(1+(buffs.stages[p.stage]||0))}
export function recruitmentPool(roster,run){return roster.filter(p=>!p.bossOnly&&p.stage===1&&!run.team.some(a=>a.pokemon.id===p.id)&&Object.values(p.stats).reduce((a,b)=>a+b,0)<=Math.min(680,350+run.wave*30))}
export const TACTICS=[
 {kind:'split',title:'Split Volley',description:'Target one additional enemy per attack; divide damage equally by your target capacity (2 targets = half damage).'},
 {kind:'haste',title:'Quick Claw Relay',description:'15% shorter attack cooldown for the whole party. Each copy multiplies cooldown by 0.85.'},
 {kind:'reach',title:'Long Reach',description:'12% more tower targeting range. Compounds with copies and tower milestones.'},
 {kind:'chill',title:'Icy Pressure',description:'Damaging hits slow movement by 15% for 2 seconds. Copies compound the slow; hits refresh duration. Bosses resist half the slow.'},
 {kind:'pierce',title:'Armor Breaker',description:'Attacks ignore 20% of remaining physical or special defense. Copies compound; type immunities still apply.'},
 {kind:'finish',title:'Finishing Instinct',description:'Deal 30% more damage to enemies below 35% HP. Each copy multiplies finishing damage by 1.30.'},
 {kind:'siphon',title:'Victory Bloom',description:'Restore 1 tower HP per defeated enemy, per copy. Cannot exceed maximum HP.'}
].map(c=>({...c,label:'ADVANCED TACTIC',badge:'ROUND 51+',symbol:'★',accent:'#a17e40'}));
export const ELITE_TACTICS=[
 {kind:'ricochet',title:'Ricochet Volley',description:'Each primary attack bounces to one extra enemy within 160 range per stack. Each bounce retains 60% damage; no target is visited twice. Works with signature attacks too.'},
 {kind:'focus',title:'Lock-On Link',description:'Stay attached to one target: +20% primary-target damage per second per stack, up to +200% per stack. Resets when the target dies or leaves range.'},
 {kind:'cadence',title:'Critical Cadence',description:'Every fourth attack volley deals ×1.50 damage per stack. Applies to the whole volley, including split attacks and ricochets.'},
 {kind:'wounds',title:'Marked Wounds',description:'Hits mark enemies for 3 seconds: the party deals +5% damage per mark per stack, up to 8 marks. Hits refresh the duration.'},
 {kind:'nova',title:'Victory Nova',description:'Defeats explode for 60% of the killing hit per stack within 80 range. Explosions cannot trigger more explosions and respect type immunities.'},
 {kind:'shield',title:'Guardian Shell',description:'Gain a shield worth 10% of max HP per stack now and at each round start. Shields absorb tower damage before HP.'},
 {kind:'surge',title:'Last Stand Relay',description:'While the tower is below 40% HP, the party has 20% shorter attack cooldown per stack. Compounds with Quick Claw Relay.'}
].map(c=>({...c,label:'ELITE TACTIC',badge:'ROUND 80+',symbol:'✦',accent:'#8862ac'}));
export const EXECUTE={kind:'execute',title:'Master Execute',amount:1,master:true,label:'MASTER TACTIC',badge:'ROUND 80+',symbol:'★',accent:'#d3a42b',description:'Damaging hits stun surviving enemies below 35% HP for 0.6 seconds per stack, stopping movement and attacks. After each stun, 2 seconds of recovery prevent repeated stun locks. Works on bosses and with Finishing Instinct.'};
export const ALL_TACTICS=[...TACTICS,...ELITE_TACTICS,EXECUTE];
export const tacticStacks=(run,kind)=>run.tactics?.[kind]||0;
export const lateUpgrades=run=>run.wave>50?[...TACTICS,...(run.wave>=80?ELITE_TACTICS:[])].map(c=>({...c})):[];
export const targetCapacity=run=>1+tacticStacks(run,'split');
export const cooldownFactor=run=>.85**tacticStacks(run,'haste')*(run.hp<run.maxHp*.4?.8**tacticStacks(run,'surge'):1);
export function movementFactor(enemy,run){const slow=1-.85**tacticStacks(run,'chill');return enemy.slowTime>0?1-slow*(enemy.boss ? .5 : 1):1}
export function resolveHit(enemy,power,run,source=null){
 if(enemy.hp<=0||power<=0)return 0;
 const dealt=power*(enemy.hp<enemy.maxHp*.35?1.3**tacticStacks(run,'finish'):1)*(1+.05*tacticStacks(run,'wounds')*(enemy.marks||0));
 const removed=Math.min(enemy.hp,dealt);if(source)source.totalDamage=(source.totalDamage||0)+removed;enemy.hp-=dealt;
 if(tacticStacks(run,'chill'))enemy.slowTime=2;
 if(tacticStacks(run,'wounds')){enemy.marks=Math.min(8,(enemy.marks||0)+1);enemy.markTime=3}
 if(enemy.hp>0&&enemy.hp<enemy.maxHp*.35&&tacticStacks(run,'execute')&&!(enemy.stunRecovery>0)){enemy.stunTime=.6*tacticStacks(run,'execute');enemy.stunRecovery=enemy.stunTime+2;}
 if(enemy.hp<=0){run.kills++;run.hp=Math.min(run.maxHp,run.hp+tacticStacks(run,'siphon'))}return dealt;
}

export function tacticSummary(run,kind){const n=tacticStacks(run,kind);return ({split:`${1+n} targets; ${(100/(1+n)).toFixed(1)}% damage per target`,haste:`${(100*(1-.85**n)).toFixed(1)}% shorter cooldown`,reach:`${Math.round(run.range)} total range`,chill:`${(100*(1-.85**n)).toFixed(1)}% movement slow for 2s; bosses resist half`,pierce:`${(100*(1-.8**n)).toFixed(1)}% defense ignored`,finish:`${(1.3**n).toFixed(2)}× damage below 35% HP`,siphon:`Restore ${n} HP per defeat`,ricochet:`Up to ${n} bounces at 60% retained damage`,focus:`+${20*n}% per second; up to +${200*n}% on the locked target`,execute:`${(.6*n).toFixed(1)}s stun below 35% HP; 2s recovery`,cadence:`Every fourth volley: ×${(1.5**n).toFixed(2)}`,wounds:`+${5*n}% per mark; up to +${40*n}% for 3s`,nova:`${60*n}% killing-hit splash within 80 range`,shield:`${Math.ceil(run.shield||0)} shield remaining; ${10*n}% max HP each round`,surge:`${(100*(1-.8**n)).toFixed(1)}% shorter cooldown below 40% tower HP`})[kind]}
export function damage(ally,enemy,buffs,attackType=ally.pokemon.types[0]){const p=ally.pokemon;const special=p.stats['special-attack']>p.stats.attack;const atk=Math.max(p.stats.attack,p.stats['special-attack']);const defense=special?enemy.specialDefense??enemy.pokemon.stats['special-defense']*(1+.025*buffs.wave)*openingEase(buffs.wave):enemy.defense;const mult=damageMultiplier(p,buffs);return Math.max(0,(8+atk*.23)*mult*100/(100+defense*.8**tacticStacks(buffs,'pierce'))*effectiveness(attackType,enemy.pokemon.types))}
export function newRun(region="kanto"){const cfg=getRegion(region);return {region,rounds:cfg.rounds,wave:0,rewardQueue:[],tradeQueue:[],range:335,growthWaves:[],swapWaves:[],starter:1,hp:250,maxHp:250,shield:0,armor:0,offense:0,types:{},stages:{},tactics:{},team:[],kills:0,upgrades:[],upgradeHistory:[],phase:'starter'}}
export function applyUpgrade(run,card){
 if(ALL_TACTICS.some(c=>c.kind===card.kind)){const amount=card.amount??1;run.tactics[card.kind]=(run.tactics[card.kind]||0)+amount;if(card.kind==='reach')run.range*=1.12**amount;if(card.kind==='shield')run.shield=(run.shield||0)+run.maxHp*.1*amount;}
 if(card.kind==='recruit')run.team.push({pokemon:card.pokemon,cooldown:0,totalDamage:0});
 if(card.kind==='evolve'){const ally=run.team.find(a=>a.pokemon.id===card.from);if(ally)ally.pokemon=card.pokemon;}
 if(card.kind==='offense')run.offense=(1+run.offense)*(1+(card.amount??.18))-1;
 if(card.kind==='armor')run.armor+=card.amount??.12;
 if(card.kind==='health'){run.maxHp+=card.amount??65;run.hp=Math.min(run.maxHp,run.hp+(card.heal??105))}
 if(card.kind==='type')run.types[card.type]=(1+(run.types[card.type]||0))*(1+(card.amount??.35))-1;
 if(card.kind==='stage')run.stages[card.stage]=(1+(run.stages[card.stage]||0))*(1+(card.amount??.35))-1;
 run.upgrades.push(card.title);run.upgradeHistory.push({...card,growthAt:run.growthWaves.length});
}

export function formatDamageTotal(value){const total=Math.max(0,value||0);return total>=1e6?new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(total):Math.round(total).toLocaleString('en-US')}

export const cardKey=c=>[c.kind,c.type||'',c.stage||''].join(':');
export function masterUpgrades(run){
 const cards=[{kind:'offense',title:'Master Rally',amount:.5,description:'×1.50 universal damage'},{kind:'armor',title:'Master Fortification',amount:.4,description:'+40 armor points'},{kind:'health',title:'Master Restoration',amount:200,heal:250,description:'+200 max HP; restore 250 HP'}];
 for(const type of new Set(run.team.flatMap(a=>a.pokemon.types)))cards.push({kind:'type',type,title:`Master ${type}`,amount:.8,description:`×1.80 damage for ${type} partners`});
 for(const stage of new Set(run.team.map(a=>a.pokemon.stage)))cards.push({kind:'stage',stage,title:`Master Stage ${stage}`,amount:.8,description:`×1.80 damage for stage ${stage} partners`});
 for(const c of lateUpgrades(run).filter(c=>c.kind!=='split'))cards.push({...c,title:`Master ${c.title}`,amount:2,description:`Two stacks: ${c.description}`});
 if(run.wave>=80)cards.push({...EXECUTE});
 return cards.map(c=>({...c,master:true,label:'MASTER UPGRADE',badge:'MASTER',symbol:'★',accent:'#d3a42b'}));
}
export function rollMasterCards(cards,run,rng=Math.random){
 if(run.wave<80)return cards;
 const result=[...cards];for(let i=0;i<result.length;i++){
  const c=result[i];if(['recruit','evolve'].includes(c.kind)||rng()>=.1)continue;
  const candidates=masterUpgrades(run).filter(m=>!result.some((other,j)=>j!==i&&cardKey(m)===cardKey(other))&&(i!==1||!ALL_TACTICS.some(t=>t.kind===c.kind)||ALL_TACTICS.some(t=>t.kind===m.kind)));
  if(candidates.length)result[i]=candidates[Math.floor(rng()*candidates.length)];
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
export function nextBounce(origin,enemies,visited,source,run,type){return enemies.filter(e=>e.hp>0&&!visited.includes(e)&&Math.hypot(e.x-origin.x,e.y-origin.y)<=160&&damage(source,e,run,type)>0).sort((a,b)=>Math.hypot(a.x-origin.x,a.y-origin.y)-Math.hypot(b.x-origin.x,b.y-origin.y))[0]}
