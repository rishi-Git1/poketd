export const TYPES={grass:'#78a857',poison:'#a970b3',fire:'#e9824e',water:'#61a6d4',bug:'#9baa4e',normal:'#afa58c',flying:'#9aafe0',electric:'#d4ad34',ground:'#ba9363',psychic:'#dc81a5',rock:'#a59569',ghost:'#8876ac',dragon:'#8379d3'};
// Standard type chart, keyed by attacking type. Dual typing multiplies both factors.
const chart={normal:{rock:.5,ghost:0,steel:.5},fire:{fire:.5,water:.5,grass:2,ice:2,bug:2,rock:.5,dragon:.5,steel:2},water:{fire:2,water:.5,grass:.5,ground:2,rock:2,dragon:.5},grass:{fire:.5,water:2,grass:.5,poison:.5,ground:2,flying:.5,bug:.5,rock:2,dragon:.5,steel:.5},electric:{water:2,electric:.5,grass:.5,ground:0,flying:2,dragon:.5},bug:{fire:.5,grass:2,fighting:.5,poison:.5,flying:.5,psychic:2,ghost:.5,dark:2,steel:.5,fairy:.5},poison:{grass:2,poison:.5,ground:.5,rock:.5,ghost:.5,steel:0,fairy:2},flying:{electric:.5,grass:2,fighting:2,bug:2,rock:.5,steel:.5},ground:{fire:2,electric:2,grass:.5,poison:2,flying:0,bug:.5,rock:2,steel:2},rock:{fire:2,ice:2,fighting:.5,ground:.5,flying:2,bug:2,steel:.5},psychic:{fighting:2,poison:2,psychic:.5,dark:0,steel:.5},ghost:{normal:0,psychic:2,ghost:2,dark:.5},dragon:{dragon:2,steel:.5,fairy:0}};
export function effectiveness(type,types){return types.reduce((n,t)=>n*(chart[type]?.[t]??1),1)}
export function wavePlan(wave,roster,rng=Math.random){
 const maxStage=wave>=9?3:wave>=4?2:1;
 const pool=roster.filter(p=>p.stage<=maxStage && (wave>3||p.stats.hp+p.stats.attack+p.stats['special-attack']<230));
 const count=7+wave*3;
 return Array.from({length:count},(_,i)=>({at:Math.floor(i/3)*2.4+(i%3)*.36+rng()*.2,pokemon:pool[Math.floor(rng()*pool.length)],angle:rng()*Math.PI*2}));
}
export function enemyStats(p,wave){return {maxHp:(p.stats.hp*.53+9)*Math.pow(1.115,wave-1),defense:p.stats.defense*(1+.025*wave),speed:10+p.stats.speed*.115+wave*.35,impact:Math.ceil(Math.max(p.stats.attack,p.stats['special-attack'])*.12*(1+.07*wave))}}
export function damage(ally,enemy,buffs){const p=ally.pokemon;const special=p.stats['special-attack']>p.stats.attack;const atk=Math.max(p.stats.attack,p.stats['special-attack']);const defense=special?enemy.pokemon.stats['special-defense']*(1+.025*buffs.wave):enemy.defense;const mult=1+buffs.offense+(buffs.types[p.types[0]]||0)+(buffs.stages[p.stage]||0);return Math.max(0,(8+atk*.23)*mult*100/(100+defense)*effectiveness(p.types[0],enemy.pokemon.types))}
export function newRun(){return {wave:0,hp:250,maxHp:250,armor:0,offense:0,types:{},stages:{},team:[],kills:0,upgrades:[],phase:'starter'}}
export function applyUpgrade(run,card){
 if(card.kind==='recruit')run.team.push({pokemon:card.pokemon,cooldown:0});
 if(card.kind==='evolve'){const ally=run.team.find(a=>a.pokemon.id===card.from);if(ally)ally.pokemon=card.pokemon;}
 if(card.kind==='offense')run.offense+=.18;
 if(card.kind==='armor')run.armor+=.12;
 if(card.kind==='health'){run.maxHp+=65;run.hp=Math.min(run.maxHp,run.hp+105)}
 if(card.kind==='type')run.types[card.type]=(run.types[card.type]||0)+.35;
 if(card.kind==='stage')run.stages[card.stage]=(run.stages[card.stage]||0)+.35;
 run.upgrades.push(card.title);
}
