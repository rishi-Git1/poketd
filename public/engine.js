export const TYPES={grass:'#78a857',poison:'#a970b3',fire:'#e9824e',water:'#61a6d4',bug:'#9baa4e',normal:'#afa58c',flying:'#9aafe0',electric:'#d4ad34',ground:'#ba9363',psychic:'#dc81a5',rock:'#a59569',ghost:'#8876ac',dragon:'#8379d3',ice:'#69c4d2',fighting:'#b76045',fairy:'#db91bb',steel:'#8c9fa7'};
// Standard type chart, keyed by attacking type. Dual typing multiplies both factors.
const chart={ice:{fire:.5,water:.5,grass:2,ice:.5,ground:2,flying:2,dragon:2,steel:.5},fighting:{normal:2,ice:2,poison:.5,flying:.5,psychic:.5,bug:.5,rock:2,ghost:0,dark:2,steel:2,fairy:.5},fairy:{fire:.5,fighting:2,poison:.5,dragon:2,dark:2,steel:.5},steel:{fire:.5,water:.5,electric:.5,ice:2,rock:2,fairy:2,steel:.5},normal:{rock:.5,ghost:0,steel:.5},fire:{fire:.5,water:.5,grass:2,ice:2,bug:2,rock:.5,dragon:.5,steel:2},water:{fire:2,water:.5,grass:.5,ground:2,rock:2,dragon:.5},grass:{fire:.5,water:2,grass:.5,poison:.5,ground:2,flying:.5,bug:.5,rock:2,dragon:.5,steel:.5},electric:{water:2,electric:.5,grass:.5,ground:0,flying:2,dragon:.5},bug:{fire:.5,grass:2,fighting:.5,poison:.5,flying:.5,psychic:2,ghost:.5,dark:2,steel:.5,fairy:.5},poison:{grass:2,poison:.5,ground:.5,rock:.5,ghost:.5,steel:0,fairy:2},flying:{electric:.5,grass:2,fighting:2,bug:2,rock:.5,steel:.5},ground:{fire:2,electric:2,grass:.5,poison:2,flying:0,bug:.5,rock:2,steel:2},rock:{fire:2,ice:2,fighting:.5,ground:.5,flying:2,bug:2,steel:.5},psychic:{fighting:2,poison:2,psychic:.5,dark:0,steel:.5},ghost:{normal:0,psychic:2,ghost:2,dark:.5},dragon:{dragon:2,steel:.5,fairy:0}};
export function effectiveness(type,types){return types.reduce((n,t)=>n*(chart[type]?.[t]??1),1)}
export function waveCount(wave){return wave<=5?3+wave*2:13+(wave-5)*3}
export function openingEase(wave){return Math.min(1,.65+Math.max(0,wave-1)*.07)}
export function wavePlan(wave,roster,rng=Math.random){
 const maxStage=wave>=9?3:wave>=4?2:1;
 const eligible=roster.filter(p=>p.stage<=maxStage);
 const limit=wave===1?280:wave===2?330:wave===3?420:wave===4?470:wave===5?500:wave<9?550:wave<15?600:680;
 const gentle=eligible.filter(p=>Object.values(p.stats).reduce((a,b)=>a+b,0)<=limit);
 const pool=gentle.length?gentle:eligible;
 const spacing=wave<=3?3.2:2.4;
 return Array.from({length:waveCount(wave)},(_,i)=>({at:Math.floor(i/3)*spacing+(i%3)*.36+rng()*.2,pokemon:pool[Math.floor(rng()*pool.length)],angle:rng()*Math.PI*2}));
}
export function enemyStats(p,wave){const ease=openingEase(wave);return {maxHp:(p.stats.hp*.53+9)*Math.pow(1.115,wave-1)*ease,defense:p.stats.defense*(1+.025*wave)*ease,speed:(10+p.stats.speed*.115+wave*.35)*Math.min(1,.78+Math.max(0,wave-1)*.044),impact:Math.ceil(Math.max(p.stats.attack,p.stats['special-attack'])*.12*(1+.07*wave)*Math.min(1,.55+Math.max(0,wave-1)*.09))}}
export function damageMultiplier(p,buffs){return (1+buffs.offense)*p.types.reduce((n,t)=>n*(1+(buffs.types[t]||0)),1)*(1+(buffs.stages[p.stage]||0))}
export function recruitmentPool(roster,run){return roster.filter(p=>p.stage===1&&!run.team.some(a=>a.pokemon.id===p.id)&&Object.values(p.stats).reduce((a,b)=>a+b,0)<=Math.min(680,350+run.wave*30))}
export function damage(ally,enemy,buffs,attackType=ally.pokemon.types[0]){const p=ally.pokemon;const special=p.stats['special-attack']>p.stats.attack;const atk=Math.max(p.stats.attack,p.stats['special-attack']);const defense=special?enemy.pokemon.stats['special-defense']*(1+.025*buffs.wave)*openingEase(buffs.wave):enemy.defense;const mult=damageMultiplier(p,buffs);return Math.max(0,(8+atk*.23)*mult*100/(100+defense)*effectiveness(attackType,enemy.pokemon.types))}
export function newRun(){return {wave:0,hp:250,maxHp:250,armor:0,offense:0,types:{},stages:{},team:[],kills:0,upgrades:[],upgradeHistory:[],phase:'starter'}}
export function applyUpgrade(run,card){
 if(card.kind==='recruit')run.team.push({pokemon:card.pokemon,cooldown:0});
 if(card.kind==='evolve'){const ally=run.team.find(a=>a.pokemon.id===card.from);if(ally)ally.pokemon=card.pokemon;}
 if(card.kind==='offense')run.offense=(1+run.offense)*1.18-1;
 if(card.kind==='armor')run.armor+=.12;
 if(card.kind==='health'){run.maxHp+=65;run.hp=Math.min(run.maxHp,run.hp+105)}
 if(card.kind==='type')run.types[card.type]=(1+(run.types[card.type]||0))*1.35-1;
 if(card.kind==='stage')run.stages[card.stage]=(1+(run.stages[card.stage]||0))*1.35-1;
 run.upgrades.push(card.title);run.upgradeHistory.push({...card});
}
