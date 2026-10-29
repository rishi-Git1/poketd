import {FORM_CATALOG} from './form-catalog.js';
import {TYPE_FORMS} from './type-forms.js';
export {FORM_CATALOG};
export const FORM_DAMAGE_BONUS=1.25;
export const formIdentity=p=>p.formKey||String(p.id);
const FORM_NAMES={10001:'Deoxys (Attack Forme)',10002:'Deoxys (Defense Forme)',10003:'Deoxys (Speed Forme)',10006:'Shaymin (Sky Forme)',10007:'Giratina (Origin Forme)',10008:'Heat Rotom',10009:'Wash Rotom',10010:'Frost Rotom',10011:'Fan Rotom',10012:'Mow Rotom',10013:'Castform (Sunny Form)',10014:'Castform (Rainy Form)',10015:'Castform (Snowy Form)',10017:'Darmanitan (Zen Mode)',10018:'Meloetta (Pirouette Forme)',10019:'Tornadus (Therian Forme)',10020:'Thundurus (Therian Forme)',10021:'Landorus (Therian Forme)',10022:'Black Kyurem',10023:'White Kyurem',10024:'Keldeo (Resolute Form)',10026:'Aegislash (Blade Forme)',10077:'Primal Kyogre',10078:'Primal Groudon',10086:'Hoopa Unbound',10117:'Ash-Greninja',10120:'Zygarde (Complete Forme)',10123:'Oricorio (Pom-Pom Style)',10124:"Oricorio (Pa’u Style)",10125:'Oricorio (Sensu Style)',10127:'Wishiwashi (School Form)',10136:'Minior (Core)',10155:'Dusk Mane Necrozma',10156:'Dawn Wings Necrozma',10157:'Ultra Necrozma',10178:'Galarian Darmanitan (Zen Mode)',10182:'Cramorant (Gulping Form)',10183:'Cramorant (Gorging Form)',10185:'Eiscue (Noice Face)',10187:'Morpeko (Hangry Mode)',10188:'Zacian (Crowned Sword)',10189:'Zamazenta (Crowned Shield)',10193:'Ice Rider Calyrex',10194:'Shadow Rider Calyrex',10245:'Dialga (Origin Forme)',10246:'Palkia (Origin Forme)',10249:'Enamorus (Therian Forme)',10256:'Palafin (Hero Form)'};
const typedName=p=>p.formKey==='cherrim-sunshine'?'Cherrim (Sunshine Form)':p.formName.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
export const formChangeAllowed=ally=>!ally.everstone&&!ally.evolutionLocked&&!ally.pokemon.everstone&&!ally.pokemon.evolutionLocked&&!ally.megaCount&&!ally.pokemon.mega&&!ally.gmaxCount&&!ally.pokemon.gigantamax;
export function alternateOptions(card,run,roster){
 const family=FORM_CATALOG.find(f=>f.key===card.formItem);if(!family)return [];
 const result=[];
 for(let slot=0;slot<run.team.length;slot++){
  const ally=run.team[slot],base=ally.nativePokemon||ally.pokemon;if(!formChangeAllowed(ally))continue;
  const visited=new Set([formIdentity(base),...(ally.formVisits||[])]);
  const ids=family.routes.filter(r=>r.source.includes(base.id)).flatMap(r=>r.targets);
  const typed=TYPE_FORMS.filter(p=>p.formItem===family.key&&p.speciesId===(base.speciesId||base.id)).map(p=>({...base,...p,name:typedName(p),types:p.types||base.types,next:null,nextOptions:[],alternateForm:true}));
  const forms=[...roster.filter(p=>ids.includes(p.id)&&!p.formKey).map(p=>({...p,name:FORM_NAMES[p.id]||p.name})),...typed];
  for(const form of forms){if(visited.has(formIdentity(form)))continue;
   result.push({key:`${slot}:${formIdentity(form)}`,slot,ally,form,title:form.name,description:`Keep stage ${ally.pokemon.stage} and battle contributions. Gain ×1.25 personal damage, this form's base stats and its move. Each destination can be used once per partner.${family.key==='ultranecrozium-z'?' Ultra Burst requires Dawn Wings or Dusk Mane.':''}`});
  }
 }return result;
}
export function alternateCards(run,roster){
 if(run.wave<1)return [];
 return FORM_CATALOG.map(f=>({kind:'form-change',formItem:f.key,title:f.title,label:f.ability?'ABILITY FORM':'FORM-CHANGING ITEM',badge:'PARTNER FORM',symbol:f.ability?'✧':'◈',accent:'#9374aa',itemIcon:f.icon,description:`Choose an eligible partner and its new form. Preserve its stage and contributions; gain ×1.25 personal damage. Each destination is available once per partner. ${f.key==='ultranecrozium-z'?'Requires Dawn Wings or Dusk Mane Necrozma.':f.key==='n-solarizer'?'Necrozma → Dusk Mane.':f.key==='n-lunarizer'?'Necrozma → Dawn Wings.':''}`})).filter(c=>alternateOptions(c,run,roster).length);
}
export const EVERSTONE={kind:'everstone',title:'Everstone',label:'HELD ITEM',badge:'KEEP THIS FORM',symbol:'◆',accent:'#8d9690',itemIcon:'everstone',description:'Choose one partner to keep its current evolution and form for this run. Blocks future evolution, alternate-form, Mega, Gigantamax and Tera choices for that partner. Other partners remain eligible. Cancel keeps this reward roll.'};
export function itemArt(card){return card.itemIcon?`<img class="form-item-art" src="assets/items/${card.itemIcon}.png" alt="${card.title}">`:''}

// Real moves commonly associated with these forms, using the existing type art.
const MOVES={
 10001:['Psycho Boost','psychic','blast'],10002:['Psycho Boost','psychic','blast'],10003:['Psycho Boost','psychic','beam'],10006:['Seed Flare','grass','blast'],10007:['Shadow Force','ghost','vortex'],
 10008:['Overheat','fire','cone'],10009:['Hydro Pump','water','beam'],10010:['Blizzard','ice','vortex'],10011:['Air Slash','flying','slash'],10012:['Leaf Storm','grass','vortex'],
 10013:['Weather Ball','fire','blast'],10014:['Weather Ball','water','blast'],10015:['Weather Ball','ice','blast'],10017:['Psychic','psychic','beam'],10178:['Flare Blitz','fire','cone'],
 10018:['Close Combat','fighting','slash'],10019:['Bleakwind Storm','flying','vortex'],10020:['Wildbolt Storm','electric','chain'],10021:['Sandsear Storm','ground','vortex'],10249:['Springtide Storm','fairy','vortex'],
 10022:['Freeze Shock','ice','beam'],10023:['Ice Burn','ice','blast'],10024:['Secret Sword','fighting','slash'],10026:['Sacred Sword','fighting','slash'],
 10077:['Origin Pulse','water','beam',3.6],10078:['Precipice Blades','ground','quake',3.6],10086:['Hyperspace Fury','dark','vortex',3.6],10117:['Water Shuriken','water','volley'],10120:['Thousand Arrows','ground','volley',3.6],
 741:['Revelation Dance','fire','vortex'],10123:['Revelation Dance','electric','vortex'],10124:['Revelation Dance','psychic','vortex'],10125:['Revelation Dance','ghost','vortex'],
 10127:['Hydro Pump','water','cone'],10136:['Power Gem','rock','volley'],10155:['Sunsteel Strike','steel','slash',3.6],10156:['Moongeist Beam','ghost','beam',3.6],10157:['Light That Burns the Sky','psychic','beam',4.68],
 10182:['Surf','water','cone'],10183:['Surf','water','cone'],10185:['Ice Spinner','ice','vortex'],10187:['Aura Wheel','dark','vortex'],10188:['Behemoth Blade','steel','slash',3.6],10189:['Behemoth Bash','steel','quake',3.6],
 10193:['Glacial Lance','ice','volley',3.6],10194:['Astral Barrage','ghost','volley',3.6],10245:['Roar of Time','dragon','beam',3.6],10246:['Spacial Rend','dragon','slash',3.6],10256:['Jet Punch','water','slash']
};
const colors={normal:'#ffe499',fire:'#ff8235',water:'#48c8ff',grass:'#87e841',electric:'#ffe73b',ice:'#b8efff',poison:'#cc6fea',flying:'#d9f4ff',ground:'#ce9b4b',rock:'#bda474',bug:'#cfdf6a',psychic:'#fb80d5',ghost:'#ad68ee',dragon:'#a181ff',fighting:'#fba866',dark:'#b48bdf',steel:'#d2e8f0',fairy:'#ffc4ef'};
export function alternateAttackFor(p){
 let move=MOVES[p.id];
 if(p.formKey){if(p.formItem==='plates')move=['Judgment',p.moveType,'beam',3.6];else if(p.formItem==='memories')move=['Multi-Attack',p.moveType,'slash',3.2];else if(p.formItem==='drives')move=['Techno Blast',p.moveType,'beam',3.2];else if(p.formItem==='flower-gift')move=['Solar Beam','grass','beam',2.7];}
 if(!move)return null;
 return {name:move[0],type:move[1],shape:move[2],power:move[3]||3,color:colors[move[1]],signature:true};
}
