import {Z_CRYSTALS} from './z-catalog.js';
export {Z_CRYSTALS};
const catalog=new Map(Z_CRYSTALS.map(c=>[c.key,c]));
export const crystalFor=p=>catalog.get(p?.zCrystal)||null;
const species=p=>p.speciesId||p.id;
// Generic crystals use the holder's types, never the enemy's types.
export function crystalCompatible(c,p){
 if(!c||!p||p.mega||p.megaCount)return false;
 if(c.forms)return c.forms.includes(p.id)||(!!c.cap&&species(p)===25&&/cap/.test(p.formKey||p.name));
 if(c.species)return c.species.includes(species(p));
 return p.types.includes(c.type);
}
export const activeCrystal=p=>{const c=crystalFor(p);return crystalCompatible(c,p)?c:null};
export const zBoost=p=>activeCrystal(p)?.boost?300:1;
export function zCrystalOptions(card,run){
 if(run.region!=='alola'||run.wave<25)return [];
 const c=catalog.get(card.zCrystal);if(!c)return [];
 return run.team.flatMap((ally,slot)=>{
  const p=ally.pokemon;
  if(ally.megaCount||p.mega||p.megaCount||p.zCrystal===c.key||ally.zCrystal===c.key||!crystalCompatible(c,p))return [];
  const old=crystalFor(p),effect=c.key==='ultranecrozium-z'&&p.id!==10157?'Unlock Ultra Burst for Dawn Wings / Dusk Mane. Light That Burns the Sky activates in Ultra form.':c.boost?`${c.move}: ×300 personal damage while compatible and held. ${c.status?'Empowers the partner’s regular attack.':'Also unleashes a stronger area attack.'}`:`Replace attacks with ${c.move}: at least ×2.4 native move power and a larger attack area. Base stats and collected multipliers stay unchanged.`;
  return [{key:`${slot}:z:${c.key}`,slot,ally,form:p,title:c.title,description:`${effect} ${old?`Replaces ${old.title}; its move and any boost end. `:''}One crystal per partner. Cannot Mega Evolve while holding it.`}];
 });
}
export function zCrystalCards(run){
 if(run.region!=='alola'||run.wave<25||!run.team.length)return [];
 return Z_CRYSTALS.map(c=>({kind:'z-crystal',zCrystal:c.key,type:c.type,title:c.title,label:c.signature?'SIGNATURE Z-CRYSTAL':'Z-CRYSTAL',badge:'ALOLA Z-POWER',symbol:'◆',accent:c.color,itemIcon:c.icon,description:c.key==='ultranecrozium-z'?'Give Dawn Wings or Dusk Mane Necrozma its signature crystal to unlock Ultra Burst. Ultra Necrozma then uses Light That Burns the Sky. No stat boost.':c.boost?`${c.move}: give an eligible ${c.holder} ×300 personal damage while holding this crystal. ${c.status?'Its regular attack is empowered.':'Its Z-Move also deals area damage.'} Cannot Mega Evolve.`:`${c.move}: ${c.signature?c.holder+' only':'choose a '+c.type+'-type partner'}. Replace its attack with a larger Z-Move at least ×2.4 as powerful. No stat boost. Cannot Mega Evolve.`})).filter(c=>zCrystalOptions(c,run).length);
}
// A whole crystal family has the same reward weight as one Mega / G-Max card.
export const zCrystalWeight=run=>1/Math.max(1,zCrystalCards(run).length);
// The help guide previews a compatible holder without equipping a real partner.
export function zPreviewPokemon(key,roster){
 const c=catalog.get(key);if(!c)return null;
 const p=roster.find(p=>crystalCompatible(c,p)&&(key!=='ultranecrozium-z'||p.id===10157));
 return p?{...p,zCrystal:key}:null;
}
export function carryCrystal(ally,p){const key=ally.zCrystal||ally.pokemon.zCrystal;return key?{...p,zCrystal:key}:p}
export function attachCrystal(ally,key){
 ally.zCrystal=key;ally.pokemon={...ally.pokemon,zCrystal:key};
 if(ally.nativePokemon)ally.nativePokemon={...ally.nativePokemon,zCrystal:key};
}
export function zAttackFor(p,native){
 const c=activeCrystal(p);
 if(!c||c.key==='ultranecrozium-z'&&p.id!==10157)return null;
 return {...native,name:c.move,type:c.type,shape:c.status?native.shape:c.shape,power:c.status?native.power:Math.max(c.power,native.power*2.4),color:c.color,signature:true,zMove:true,zCrystal:c.key,boosting:!!c.boost,statusZ:!!c.status,nativeName:native.name,visualKey:`z:${c.key}`,visualDescription:c.art,radius:c.status?undefined:145,chainCount:6,chainRange:190,volleyCount:5,beamWidth:42,coneSpread:.34,duration:.72};
}
export function crystalSummary(p){
 const c=crystalFor(p);if(!c)return '';
 return `${c.title} · ${!activeCrystal(p)?'dormant: holder no longer compatible':c.key==='ultranecrozium-z'&&p.id!==10157?'Ultra Burst ready':c.move+(c.boost?' · ×300 damage':' · enhanced move')}`;
}
