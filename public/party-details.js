import {isHazard,hazardSummary} from './hazards.js';
import {ALL_TACTICS,damageMultiplier,repeatPower,cardKey,tacticSummary,cooldownFactor,targetCapacity,tacticStacks} from './engine.js?v=28';
import {attackFor,attackCooldown} from './attacks.js';
import {canEvolve,maskDamage,ordinaryStellar} from './transformations.js';
const tactics=new Set(ALL_TACTICS.map(c=>c.kind)),towerKinds=new Set(['health','armor','shield','reach']);
const statNames=[['hp','HP'],['attack','Attack'],['defense','Defense'],['special-attack','Sp. Atk'],['special-defense','Sp. Def'],['speed','Speed']];
const factor=n=>`×${n.toFixed(3)}`;

export function relevantUpgrades(ally,run){
 const p=ally.pokemon,groups=new Map(),active=[],support=[];
 for(const card of run.upgradeHistory||[]){
  if(!isHazard(card)&&!['offense','type','stage','form',...towerKinds].includes(card.kind)&&!tactics.has(card.kind))continue;
  if(card.transformation)continue;const key=cardKey(card);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(card);
 }
 for(const cards of groups.values()){
  const c=cards[0],count=cards.length,matching=c.kind==='type'?p.types.includes(c.type):c.kind==='stage'?p.stage===c.stage:c.kind==='form'?(c.form==='mega'?p.mega:p.gigantamax):true;
  // Repeated off-type/stage cards still affect everyone through repeat resonance.
  if(!matching&&count<2)continue;
  const row={kind:c.kind,title:c.title+(cards.some(c=>c.master)&&cards.some(c=>!c.master)?' + Master':''),count,stacks:cards.reduce((n,c)=>n+(c.amount??1),0),scope:'Party tactic',effect:tacticSummary(run,c.kind)||''};
  if(!matching){row.scope='Repeat bonus only';row.effect=`${factor(1.1**(count-1))} party damage; ${c.kind==='type'?c.type+' typing':c.kind==='form'?c.form+' form':'stage '+c.stage} does not match this partner`}
  else if(c.kind==='offense'){row.scope='Universal';row.effect=`${factor(1+run.offense)} damage for every partner`}
  else if(c.kind==='type'){row.scope='Matching type';row.effect=`${factor(1+(run.types[c.type]||0))} ${c.type} damage`}
  else if(c.kind==='stage'){row.scope='Matching stage';row.effect=`${factor(1+(run.stages[c.stage]||0))} stage ${c.stage} damage`}
  if(c.kind==='form'&&matching){row.scope='Matching form';row.effect=`${factor(1+(run.forms?.[c.form]||0))} damage for ${c.form==='mega'?'Mega-Evolved':'Gigantamax'} partners`}
  if(isHazard(c)){row.scope='Shared battlefield support';row.effect=hazardSummary(run,c.kind)+' · bosses unaffected';support.push(row)}else if(towerKinds.has(c.kind)){row.scope='Shared tower support';if(c.kind==='health')row.effect=`${Math.ceil(run.maxHp)} total tower max HP`;if(c.kind==='armor')row.effect=`${Math.round(run.armor/(1+run.armor)*100)}% total tower damage reduction`;if(c.kind==='shield')row.effect=`Shield worth ${10*tacticStacks(run,'shield')}% max HP at each round start`;support.push(row)}else active.push(row);
 }
 for(const c of ally.formHistory||[]){
  if(c.kind==='tera'&&c.type==='stellar'&&p.teraType!=='stellar'&&(p.speciesId||p.id)!==1024)continue;
  const activeTera=c.kind==='tera'&&c.type===p.teraType;
  active.push({kind:c.kind,title:c.title,count:1,stacks:1,scope:'Personal transformation',effect:c.kind==='everstone'?'Everstone held: evolution and all form changes blocked':c.kind==='form-change'?`${c.targetName}: ×1.25 personal form power acquired`:c.kind==='mega'?'One-time Mega form; ×2 personal damage':c.kind==='gmax'?'Gigantamax form; ×2 personal damage; evolution locked':activeTera?(ordinaryStellar(p)?'Stellar active: temporary ×1.20 damage; native types retained':`${c.type} Tera active; power level ${p.teraPowerCount||0}`):`Earlier ${c.type} Tera: permanent power retained; previous added type removed`});
 }
 return {active,support};
}

export function partyProfile(ally,run,roster=[]){
 const p=ally.pokemon,move=attackFor(p),multiplier=damageMultiplier(p,run),total=run.totalDamage??run.team.reduce((n,a)=>n+(a.totalDamage||0),0),stats=statNames.map(([key,name])=>({key,name,value:p.stats[key]}));
 return {pokemon:p,move,stats,statTotal:stats.reduce((n,s)=>n+s.value,0),multiplier,
  cooldown:attackCooldown(p)*cooldownFactor(run),targets:targetCapacity(run),bounces:tacticStacks(run,'ricochet'),range:Math.round(run.range),
  neutralHit:(8+Math.max(p.stats.attack,p.stats['special-attack'])*.23)*multiplier*move.power,
  attackClass:p.stats['special-attack']>p.stats.attack?'Special':'Physical',
  evolution:ally.everstone?'Everstone: evolution and forms locked':!canEvolve(ally)?'Evolution locked':p.next?'Next: '+(p.nextOptions||[p.next]).map(id=>roster.find(q=>q.id===id)?.name||`#${id}`).join(' / '):'Final form',
  form:p.gigantamax?'Gigantamax':p.mega?'Mega evolved':p.teraType?ordinaryStellar(p)?'Stellar · +20% active':`${p.teraType} Tera · power ${p.teraPowerCount||0}`:p.alternateForm?'Alternate form':'Standard form',
  factors:[{label:'Universal',value:1+run.offense},...p.types.map(type=>({label:type+' type',value:1+(run.types[type]||0)})),{label:`Stage ${p.stage}`,value:1+(run.stages[p.stage]||0)},{label:'Personal form',value:(p.personalPower||1)*maskDamage(p)},{label:'Form rally',value:p.mega?1+(run.forms?.mega||0):p.gigantamax?1+(run.forms?.gmax||0):1},{label:'Repeat resonance',value:repeatPower(run)}],
  contributions:{damage:ally.totalDamage||0,share:total>0?(ally.totalDamage||0)/total*100:0,defeats:ally.defeats||0,bosses:ally.bossDefeats||0,hits:ally.damageHits||0,volleys:ally.volleys||0,strongest:ally.strongestHit||0,healing:ally.healing||0},
  upgrades:relevantUpgrades(ally,run)};
}
