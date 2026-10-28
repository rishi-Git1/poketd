// Regional forms keep their evolution stage. Data comes from bundled PokéAPI records.
export const MEGA_REGIONS=['hoenn','kalos','alola'];
export const TERA_TYPES=['normal','fire','water','grass','electric','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy','stellar'];
export const isTransformation=card=>['mega','tera','gmax'].includes(card?.kind);
export const canEvolve=ally=>!ally.evolutionLocked&&!ally.gmaxCount&&!ally.pokemon.gigantamax&&!ally.megaCount&&!ally.pokemon.mega&&!ally.pokemon.evolutionLocked;
const species=p=>p.speciesId||p.megaFrom||p.id;
const maskForms={grass:1017,water:10273,fire:10274,rock:10275};
const combine=(base,type)=>[...new Set([...base,type])].slice(0,3);
export const ordinaryStellar=p=>p.teraType==='stellar'&&species(p)!==1024;
function teraPokemon(ally,form){
 const base=ally.nativePokemon,stellar=ally.teraType==='stellar'&&species(base)!==1024,power=ally.teraPowerCount||0;
 return {...form,types:stellar?[...base.types]:combine(base.types,ally.teraType),baseTypes:[...base.types],stage:base.stage,teraType:ally.teraType,teraCount:ally.teraCount,teraPowerCount:power,stellarBoost:stellar?1.2:1,personalPower:(base.personalPower||1)*1.2**power*(stellar?1.2:1)};
}
export function transformationOptions(card,run,roster){
 const result=[];
 for(let slot=0;slot<run.team.length;slot++){
  const ally=run.team[slot],base=ally.nativePokemon||ally.pokemon;
  if(card.kind==='mega'&&(MEGA_REGIONS.includes(run.region)||run.mode==='true-endless')&&!ally.megaCount&&!ally.pokemon.mega&&!ally.gmaxCount&&!ally.pokemon.gigantamax){
   for(const form of roster.filter(p=>p.mega&&p.megaFrom===(base.speciesId||base.id)))result.push({key:`${slot}:${form.id}`,slot,ally,form,title:form.name,description:`Stage ${ally.pokemon.stage} stays unchanged. One-time Mega Evolution with +100% personal damage.`});
  }
  if(card.kind==='gmax'&&(run.region==='galar'||run.mode==='true-endless')&&species(base)!==890&&!ally.gmaxCount&&!ally.pokemon.gigantamax&&!ally.megaCount&&!ally.pokemon.mega){
   for(const form of roster.filter(p=>p.gigantamax&&p.gmaxFrom===base.id&&species(p)!==890))result.push({key:`${slot}:${form.id}`,slot,ally,form,title:form.name,description:`One-time Gigantamax: +100% personal damage and a signature G-Max move. Stage ${ally.pokemon.stage} stays unchanged. Permanent: this partner can never evolve afterward.`});
  }
  if(card.kind==='tera'&&(run.region==='paldea'||run.mode==='true-endless')&&TERA_TYPES.includes(card.type)){
   if(card.type===(ally.teraType||ally.pokemon.teraType))continue;
   const id=species(base);if(id===1017&&!maskForms[card.type]||id===1024&&card.type!=='stellar')continue;
   const form=id===1017?roster.find(p=>p.id===maskForms[card.type]):id===1024?roster.find(p=>p.id===10277):base;
   if(!form)continue;
   const stellar=card.type==='stellar'&&id!==1024,types=stellar?base.types:combine(base.types,card.type),gimmick=id===1017?{grass:'Teal Mask: 20% faster attacks.',water:'Wellspring Mask: protects the tower from special impacts.',fire:'Hearthflame Mask: ×1.50 damage.',rock:'Cornerstone Mask: protects the tower from physical impacts.'}[card.type]:id===1024?'Stellar Form: Tera Starstorm. Teraform Zero blocks one tower impact each round.':'';
   result.push({key:`${slot}:${card.type}`,slot,ally,form,title:form.name,description:stellar?`${types.join(' / ')} stays unchanged. +20% damage only while Stellar; the bonus disappears when changing to another Tera type. No permanent power or speed stack.`:`${types.join(' / ')} · +20% personal damage (power level ${(ally.teraPowerCount||0)+1}). ${gimmick}`});
  }
 }return result;
}
export function regionalCards(run,roster){
 if(run.wave<25||!run.team.length)return [];
 const candidates=[];
 if((MEGA_REGIONS.includes(run.region)||run.mode==='true-endless'))candidates.push({kind:'mega',title:'Mega Evolution',label:'REGIONAL POWER',badge:'REGIONAL MEGA POWER',symbol:'◈',accent:'#ba6fc4',description:'Choose an eligible partner and Mega form once. Preserve its stage and damage total; gain ×2 personal damage. Already Mega-Evolved partners cannot be selected again.'});
 if((run.region==='galar'||run.mode==='true-endless'))candidates.push({kind:'gmax',title:'Max Mushrooms',label:'GIGANTAMAX',badge:'GALAR POWER',symbol:'♣',accent:'#c95181',description:'Choose a partner with a Gigantamax form. Permanently Gigantamax it once: ×2 personal damage and a signature G-Max move. Keeps its stage and damage total. That partner can never evolve afterward. Eternatus is ineligible.'});
 if((run.region==='paldea'||run.mode==='true-endless'))for(const type of TERA_TYPES)candidates.push({kind:'tera',type,title:`${type[0].toUpperCase()+type.slice(1)} Tera Crystal`,label:'TERASTALLIZATION',badge:`${type.toUpperCase()} TERA`,symbol:'◆',accent:'#67bdd0',description:type==='stellar'?'Keep native types and gain +20% damage only while Stellar. The bonus ends on another Tera type. Terapagos instead becomes its special Stellar Form. Cannot target an already Stellar partner.':`Choose a partner to add ${type} typing alongside its original types. Grants another ×1.20 personal damage. Replaces its previous Tera type. Partners already Tera ${type} cannot be selected.`});
 return candidates.filter(c=>transformationOptions(c,run,roster).length);
}
export function applyTransformation(run,card,key,roster,record){
 const choice=transformationOptions(card,run,roster).find(c=>c.key===key);if(!choice)throw Error('Choose an eligible current partner');
 const {ally,form}=choice;ally.nativePokemon??=ally.pokemon;
 if(card.kind==='mega'){
  ally.megaCount=1;
  ally.pokemon={...form,stage:ally.nativePokemon.stage,personalPower:2,megaCount:1};
 }else if(card.kind==='gmax'){
  ally.gmaxCount=1;ally.evolutionLocked=true;
  ally.pokemon={...form,stage:ally.nativePokemon.stage,next:null,nextOptions:[],personalPower:2,gmaxCount:1,evolutionLocked:true};
 }else{
  ally.teraCount=(ally.teraCount||0)+1;ally.teraType=card.type;
  if(card.type!=='stellar'||species(ally.nativePokemon)===1024)ally.teraPowerCount=(ally.teraPowerCount||0)+1;
  ally.pokemon=teraPokemon(ally,form);
  if(species(ally.nativePokemon)===1024)ally.zeroCharges=1;
 }
 if(card.kind==='mega'||card.kind==='gmax'){ally.nativePokemon=ally.pokemon;if(ally.teraType)ally.pokemon=teraPokemon(ally,ally.nativePokemon)}
 ally.focusTarget=null;ally.focusTime=0;
 const entry={...card,targetName:ally.pokemon.name,targetId:ally.nativePokemon.id,transformation:true};
 (ally.formHistory??=[]).push(entry);record(run,entry);return ally;
}
export function evolveAlly(ally,pokemon){
 if(!canEvolve(ally))return false;
 if(!ally.teraType){ally.pokemon=pokemon;return}
 ally.nativePokemon=pokemon;ally.pokemon=teraPokemon(ally,pokemon);
}
export function maskDamage(p){return p.teraType==='fire'&&species(p)===1017?1.5:1}
export function maskCooldown(p){return p.teraType==='grass'&&species(p)===1017?.8:1}
export function regionalImpact(run,enemy,impact){
 for(const ally of run.team){const p=ally.pokemon;if(species(p)===1024&&p.teraType==='stellar'&&ally.zeroCharges>0){ally.zeroCharges--;return 0}}
 const special=enemy.pokemon.stats['special-attack']>enemy.pokemon.stats.attack;
 for(const ally of run.team){const p=ally.pokemon;if(species(p)===1017&&((special&&p.teraType==='water')||(!special&&p.teraType==='rock')))impact*=.9**(ally.teraCount||1)}
 return Math.max(1,Math.ceil(impact));
}
