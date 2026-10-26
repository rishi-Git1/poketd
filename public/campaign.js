// Red/Blue trainer rosters. Blue's party follows the player's original starter.
export const BOSSES=[
 {wave:15,name:'Brock',tier:'GYM 1',team:[74,95]},
 {wave:30,name:'Misty',tier:'GYM 2',team:[120,121]},
 {wave:45,name:'Lt. Surge',tier:'GYM 3',team:[100,25,26]},
 {wave:60,name:'Erika',tier:'GYM 4',team:[71,114,45]},
 {wave:75,name:'Koga',tier:'GYM 5',team:[109,109,89,110]},
 {wave:90,name:'Sabrina',tier:'GYM 6',team:[64,122,49,65]},
 {wave:105,name:'Blaine',tier:'GYM 7',team:[58,77,78,59]},
 {wave:120,name:'Giovanni',tier:'GYM 8',team:[111,51,31,34,112]},
 {wave:125,name:'Lorelei',tier:'ELITE FOUR 1',team:[87,91,80,124,131],boost:1.45},
 {wave:130,name:'Bruno',tier:'ELITE FOUR 2',team:[95,107,106,95,68],boost:1.45},
 {wave:135,name:'Agatha',tier:'ELITE FOUR 3',team:[94,42,93,24,94],boost:1.45},
 {wave:140,name:'Lance',tier:'ELITE FOUR 4',team:[130,148,148,142,149],boost:1.45},
 {wave:145,name:'Blue',tier:'CHAMPION',team:[18,65,112,103,130,6],boost:1.6},
 {wave:150,name:'Mewtwo',tier:'LEGENDARY',team:[150],boost:4},
 {wave:151,name:'Mew',tier:'FINAL ENCOUNTER',team:[151],boost:8}
];
export function bossFor(wave,starter=1){const b=BOSSES.find(b=>b.wave===wave);if(!b)return null;const team=b.name==='Blue'?(starter===4?[18,65,112,59,103,9]:starter===7?[18,65,112,130,59,3]:b.team):b.team;return {...b,team:[...team],boost:b.boost||1.25}}
export function nextBoss(wave,starter){return BOSSES.find(b=>b.wave>wave)||null}
export function campaignPlan(wave,roster,starter){const b=bossFor(wave,starter);return b?b.team.map((id,i)=>({pokemon:roster.find(p=>p.id===id),at:wave>50?0:i*.85,angle:i*Math.PI*2/b.team.length,boss:b})):null}
export function applyTowerGrowth(run){if(run.wave===0||run.wave%10||run.growthWaves.includes(run.wave))return false;run.growthWaves.push(run.wave);run.range*=1.05;run.armor=(1+run.armor)*1.05-1;const increase=run.maxHp*.05;run.maxHp+=increase;run.hp+=increase;return true}
export function canAutoAdvance(run,{enabled,paused,dialogOpen,hidden}){return enabled&&run.phase==='ready'&&!paused&&!dialogOpen&&!hidden&&run.wave<151}
export const isBuff=c=>['offense','type','stage','health','armor'].includes(c.kind);
export function premiumOffers(kind,run,roster,rng=Math.random){
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 if(kind==='pokemon'){const eligible=roster.filter(p=>!p.next&&!run.team.some(a=>a.pokemon.id===p.id));const legends=eligible.filter(p=>[144,145,146,150,151].includes(p.id));const chosen=shuffle(eligible.filter(p=>!legends.includes(p))).slice(0,2);if(legends.length)chosen.push(shuffle(legends)[0]);else chosen.push(...shuffle(eligible.filter(p=>!chosen.includes(p))).slice(0,1));return shuffle(chosen).map(p=>({kind:'recruit',pokemon:p,title:p.name,label:'PREMIUM PARTNER',description:'Fully evolved partner. Replaces the selected party slot.'}))}
 const pool=[{kind:'offense',title:'Master Rally',amount:.5,description:'×1.50 universal damage'},{kind:'armor',title:'Master Fortification',amount:.4,description:'+40 armor points'},{kind:'health',title:'Master Restoration',amount:200,heal:250,description:'+200 max HP; restore 250 HP'}];
 for(const type of new Set(run.team.flatMap(a=>a.pokemon.types)))pool.push({kind:'type',type,title:`Master ${type}`,amount:.8,description:`×1.80 damage for ${type} partners`});
 for(const stage of new Set(run.team.map(a=>a.pokemon.stage)))pool.push({kind:'stage',stage,title:`Master Stage ${stage}`,amount:.8,description:`×1.80 damage for stage ${stage} partners`});
 return shuffle(pool).slice(0,3).map(c=>({...c,label:'PREMIUM UPGRADE'}))
}
export function removeBuff(run,index){const c=run.upgradeHistory[index];if(!c||!isBuff(c))throw Error('Choose an existing upgrade');const amount=c.amount??(c.kind==='offense'?.18:c.kind==='armor'?.12:c.kind==='health'?65:.35),growth=Math.pow(1.05,run.growthWaves.length-(c.growthAt||0));if(c.kind==='offense')run.offense=(1+run.offense)/(1+amount)-1;if(c.kind==='type')run.types[c.type]=(1+run.types[c.type])/(1+amount)-1;if(c.kind==='stage')run.stages[c.stage]=(1+run.stages[c.stage])/(1+amount)-1;if(c.kind==='armor')run.armor=Math.max(0,run.armor-amount*growth);if(c.kind==='health'){run.maxHp-=amount*growth;run.hp=Math.min(run.hp,run.maxHp)}run.upgradeHistory.splice(index,1);run.upgrades.splice(index,1)}
export function commitSwap(run,kind,index,card,apply){if(kind==='pokemon'){if(!run.team[index]||card.kind!=='recruit'||run.team.some(a=>a.pokemon.id===card.pokemon.id))throw Error('Invalid party swap');run.team[index]={pokemon:card.pokemon,cooldown:0};run.upgrades.push(card.title);run.upgradeHistory.push({...card,kind:'swap-pokemon',growthAt:run.growthWaves.length})}else{if(!isBuff(card))throw Error('Invalid upgrade swap');removeBuff(run,index);apply(run,card)}}
