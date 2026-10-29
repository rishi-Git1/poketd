// Permanent tower installations: generation gates, finite picks, and type-neutral effects.
const GENERATIONS={kanto:1,johto:2,hoenn:3,sinnoh:4,unova:5,kalos:6,alola:7,galar:8,paldea:9,origin:9};
export const HAZARDS=[
 {kind:'stealth-rock',title:'Stealth Rock',generation:4,cap:1,accent:'#ad936a',description:'Regular enemies have 12.5% less HP. Combines multiplicatively with Spikes. One permanent installation; never affects boss encounters.'},
 {kind:'spikes',title:'Spikes',generation:2,cap:3,accent:'#889fa8',description:'Regular enemies have 6.25% / 12.5% / 25% less HP at 1 / 2 / 3 stacks. Three permanent installations maximum; never affects boss encounters.'},
 {kind:'toxic-spikes',title:'Toxic Spikes',generation:4,cap:2,accent:'#b276c4',description:'Regular enemies lose 0.25% / 0.50% of maximum HP per game second at 1 / 2 stacks. Two permanent installations maximum. Ignores types and defenses; never affects boss encounters.'}
].map(c=>({...c,label:'FIELD HAZARD',badge:'ROUND 100+',symbol:'◆'}));
export const isHazard=card=>HAZARDS.some(c=>c.kind===card?.kind);
export const hazardStacks=(run,kind)=>run.hazards?.[kind]||0;
export function hazardAvailable(run,card){
 const spec=HAZARDS.find(c=>c.kind===card?.kind);
 return !spec||run.wave>=100&&(GENERATIONS[run.region]||1)>=spec.generation&&hazardStacks(run,spec.kind)<spec.cap;
}
export function hazardUpgrades(run){return HAZARDS.filter(c=>hazardAvailable(run,c)).map(c=>({...c,description:`${c.description} Owned: ${hazardStacks(run,c.kind)} / ${c.cap}.`}))}
export function addHazard(run,card){if(!isHazard(card)||!hazardAvailable(run,card))return false;run.hazards??={};run.hazards[card.kind]=hazardStacks(run,card.kind)+1;return true}
export function hazardHealthFactor(run){return (hazardStacks(run,'stealth-rock') ? .875 : 1)*[1,.9375,.875,.75][Math.min(3,hazardStacks(run,'spikes'))]}
// A late, banked reward also applies to regular enemies already on the field.
// Preserve their current HP percentage; reapplying never repeatedly shaves HP.
export function applyEntryHazards(enemy,run){
 if(enemy.boss||enemy.hp<=0)return;
 const factor=hazardHealthFactor(run),ratio=factor/(enemy.hazardHealthFactor??1),before=enemy.hp;
 enemy.maxHp*=ratio;enemy.hp*=ratio;enemy.hazardHealthFactor=factor;
 run.hazardDamage=(run.hazardDamage||0)+Math.max(0,before-enemy.hp);
}
export function advanceHazards(enemy,dt,run){
 const stacks=hazardStacks(run,'toxic-spikes');
 if(!stacks||enemy.boss||enemy.hp<=0||dt<=0)return 0;
 const removed=Math.min(enemy.hp,enemy.maxHp*.0025*Math.min(2,stacks)*dt);
 enemy.hp-=removed;run.hazardDamage=(run.hazardDamage||0)+removed;
 // Hazard kills count toward the run and global healing, with no partner credit.
 if(enemy.hp<=0){run.kills++;run.hp=Math.min(run.maxHp,run.hp+(run.tactics?.siphon||0))}
 return removed;
}
export function hazardSummary(run,kind){
 const n=hazardStacks(run,kind);
 return ({'stealth-rock':`${n} / 1 installed · regular enemies: −12.5% HP`,spikes:`${n} / 3 installed · regular enemies: −${[0,6.25,12.5,25][Math.min(3,n)]}% HP`,'toxic-spikes':`${n} / 2 installed · regular enemies: −${(.25*n).toFixed(2)}% max HP per second`})[kind];
}

// Original miniature pixel art shared by reward cards and the battlefield.
export function hazardArt(card){
 const kind=typeof card==='string'?card:card.kind;
 if(!isHazard({kind}))return '';
 const rocks='<path d="M8 44 13 26 23 18 31 35 27 48Z" fill="#9a815e"/><path d="m13 26 10-8 2 23-17 3Z" fill="#dac499"/><path d="m34 46 1-21 13-12 9 21-7 15Z" fill="#947856"/><path d="m35 25 13-12-2 25-12 8Z" fill="#ddc79d"/>';
 const steel='<path d="m6 49 10-24 7 17 9-29 10 29 7-17 10 24Z" fill="#7c96a4"/><path d="m16 25 1 21-11 3Zm16-12 1 34-10-5Zm17 12 1 21-8-4Z" fill="#e5f2eb"/>';
 const toxic='<path d="m7 48 8-21 9 15 8-29 10 29 8-15 8 21Z" fill="#9a59ae"/><path d="m15 27 2 19-10 2Zm17-14 1 33-9-4Zm18 14 1 19-9-4Z" fill="#e9b0ed"/><path d="M10 51h44" stroke="#873b9c" stroke-width="4"/><rect x="12" y="15" width="4" height="4" fill="#d69be8"/><rect x="49" y="17" width="3" height="3" fill="#d69be8"/>';
 return `<svg class="hazard-card-art" viewBox="0 0 64 64" role="img" aria-label="${HAZARDS.find(c=>c.kind===kind).title} field art" shape-rendering="crispEdges"><ellipse cx="32" cy="51" rx="27" ry="5" fill="#28334333"/>${kind==='stealth-rock'?rocks:kind==='spikes'?steel:toxic}</svg>`;
}
export function hazardPlacements(run){
 const placements=[];
 for(const [index,spec] of HAZARDS.entries())for(let stack=0;stack<hazardStacks(run,spec.kind);stack++)for(let i=0;i<6;i++){
  const angle=i*Math.PI/3+index*.37+stack*.19,radius=205+stack*46+index*17;
  placements.push({kind:spec.kind,stack,x:Math.round(500+Math.cos(angle)*radius),y:Math.round(345+Math.sin(angle)*radius*.7)});
 }
 return placements.sort((a,b)=>a.y-b.y);
}
function polygon(ctx,points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()}
export function drawHazards(ctx,run){
 for(const p of hazardPlacements(run)){
  ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle='#242b383d';ctx.beginPath();ctx.ellipse(0,5,18,5,0,0,Math.PI*2);ctx.fill();
  if(p.kind==='stealth-rock'){
   polygon(ctx,[[-14,3],[-12,-12],[-5,-20],[2,-7],[-2,6]],'#977d59');polygon(ctx,[[-12,-12],[-5,-20],[-4,-3],[-14,3]],'#e4cea2');
   polygon(ctx,[[2,5],[4,-10],[11,-15],[17,-3],[13,7]],'#9f845e');polygon(ctx,[[4,-10],[11,-15],[10,0],[2,5]],'#dfc69a');
  }else{
   const toxic=p.kind==='toxic-spikes',dark=toxic?'#8e459e':'#6c8692',light=toxic?'#e8abea':'#e0eee8';
   for(const [x,y,h] of [[-11,4,14],[0,1,23],[11,5,15]]){polygon(ctx,[[x-6,y],[x,y-h],[x+7,y]],dark);polygon(ctx,[[x-6,y],[x,y-h],[x+1,y-1]],light)}
   if(toxic){ctx.fillStyle='#c486d3';ctx.fillRect(-15,6,29,2);ctx.fillRect(-10,-18,2,2);ctx.fillRect(12,-17,3,3)}
  }
  ctx.restore();
 }
}
