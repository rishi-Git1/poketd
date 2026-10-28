// Species-specific tower-defense adaptations. G-Max names are the official move names.
// Every form has an authored silhouette/motion recipe; type colors are only the palette.
const colors={grass:'#82de63',fire:'#ff8648',water:'#63d7ff',bug:'#cced68',normal:'#ffe39b',electric:'#ffe560',ground:'#d9a45d',psychic:'#fc98e5',rock:'#c9b082',fighting:'#ffac7d',ice:'#bcefff',fairy:'#ffc3ed',steel:'#d1e9f2',ghost:'#c09bff',poison:'#d992f7',dragon:'#9b91ff',flying:'#e0f8ff',dark:'#b9a0dc'};
// [name, move type, collision shape, power, visual description, emblem recipe]
// Each emblem layer: [motif, radius, count, angle, x offset, y offset].
const definitions={
10033:['Verdant Crown','grass','beam',3.8,'A blooming solar flower crowns braided vines.',[['flower',44,8,0],['vines',70,3,.2]]],
10034:['Obsidian Dragonfire','fire','cone',4,'Black dragon wings surround a twin flame spiral.',[['wings',63,2,.1],['flames',38,6,.3],['spiral',28,2,0]]],
10035:['Solar Inferno','fire','blast',4,'A blazing sun throws feather-shaped fire rays.',[['sun',51,12,0],['feathers',72,7,.5]]],
10036:['Tri-Cannon Deluge','water','beam',3.9,'Three cannon mouths fire concentric pressure blasts.',[['cannons',42,3,0],['rings',76,3,.2]]],
10037:['Five-Spoon Convergence','psychic','vortex',3.9,'Five silver spoons orbit a psychic eye.',[['spoons',62,5,0],['eye',29,1,0]]],
10038:['Phantom Maw','ghost','vortex',3.9,'A grinning shadow mouth opens inside a haunted portal.',[['portal',67,3,.2],['grin',42,7,0]]],
10039:['Parental Impact','normal','slash',3.7,'One large fist and one small fist strike in succession.',[['fists',40,1,-.4,-17,-5],['fists',22,1,.5,32,20],['star',76,9,.1]]],
10040:['Skyhorn Guillotine','bug','slash',3.8,'Twin horn blades dive between insect wings.',[['horns',55,2,0],['wings',72,4,.5]]],
10041:['Abyssal Dragon Maw','water','cone',4,'Six huge fangs close over a dark whirlpool.',[['jaws',61,6,0],['spiral',43,3,.3]]],
10042:['Fossil Meteor Dive','rock','volley',3.8,'A fossil-wing silhouette dives through jagged meteor fragments.',[['wings',69,2,-.4],['rocks',56,7,.2]]],
10043:['Psybreaker Barrage','fighting','slash',4.1,'Alternating psychic fists break a six-sided barrier.',[['fists',34,3,.3],['hexes',69,6,0]]],
10044:['Mindstar Singularity','psychic','beam',4.1,'A floating psychic eye concentrates three star rings.',[['eye',40,1,0],['star',70,6,.2],['rings',52,3,.5]]],
10045:['Eon Thunder Halo','electric','chain',3.8,'Electric dragon orbs arc around a flowing mane halo.',[['orbs',55,7,.2],['bolts',74,4,0],['ribbons',39,3,.4]]],
10046:['Crimson Pincer Cross','steel','slash',3.8,'Armored pincers close across a double steel cross.',[['pincers',57,2,0],['blades',63,4,.7]]],
10047:['Megahorn Gatling','bug','volley',3.9,'A central horn drill leads a ring of seed shells.',[['drill',64,1,0],['seeds',61,8,.3]]],
10048:['Doomhorn Pyre','dark','blast',3.9,'Hellfire coils inside a horned dark crest.',[['horns',67,2,.2],['flames',52,5,0],['eclipse',27,1,0]]],
10049:['Obsidian Sandfall','rock','quake',4,'A spiked obsidian crown erupts through a sand ring.',[['spikes',60,9,.1],['rocks',77,5,.4],['rings',35,2,0]]],
10050:['Blazing Heel Cyclone','fire','slash',3.9,'Flaming heel arcs cross over a spinning kick star.',[['heels',57,4,.5],['flames',73,6,.2]]],
10051:['Radiant Gown Requiem','fairy','vortex',3.9,'A luminous gown fans out into heart-shaped petals.',[['gown',63,7,0],['hearts',58,5,.4]]],
10052:['Twin-Jaw Cataclysm','steel','slash',3.8,'Two huge iron jaws snap in opposite directions.',[['jaws',44,5,.4,-30,-3],['jaws',34,4,-.5,34,20]]],
10053:['Iron Bastion Crash','steel','quake',4,'Layered armored walls collapse into a steel impact.',[['bastion',65,4,0],['star',42,8,.4]]],
10054:['Six-Palm Lotus','fighting','slash',3.8,'Six spectral palms blossom around a lotus seal.',[['palms',66,6,.2],['flower',32,8,.4]]],
10055:['Volt Fang Circuit','electric','chain',3.8,'A jagged lightning fence frames an electric fang.',[['fence',70,5,0],['fangs',39,4,.3]]],
10056:['Unsealed Phantom Stitch','ghost','blast',3.8,'A zipper tears open while spectral stitches scatter.',[['zipper',61,9,0],['needles',78,6,.5]]],
10057:['Disaster Wing Crescent','dark','slash',3.8,'White wings sweep past a dark crescent blade.',[['crescent',62,1,.3],['wings',74,2,-.2]]],
10058:['Dune Scythe Reaper','dragon','slash',4,'Twin scythes shear through a rising dune spiral.',[['scythes',65,2,.5],['spiral',52,3,.2]]],
10059:['Aura Nova Fist','fighting','blast',3.9,'A giant aura fist compresses a glowing sphere.',[['fists',48,1,.1],['orbs',76,4,.4],['rings',60,2,0]]],
10060:['Frostwood Avalanche','ice','vortex',3.8,'A frozen fir tree sheds jagged snow crystals.',[['tree',65,3,0],['snow',76,6,.1]]],
10062:['Scarlet Eon Weave','dragon','cone',3.9,'Red delta wings weave around a soft psychic ribbon.',[['delta',66,3,.2],['ribbons',48,4,.3],['hearts',29,3,.2]]],
10063:['Azure Eon Lance','dragon','beam',4,'Sleek delta lances pierce rotating psychic diamonds.',[['delta',73,2,0],['diamonds',52,5,.5],['beam',35,3,0]]],
10064:['Tidal Hammerfall','water','quake',3.9,'Two muddy fists crash into a broad tidal crown.',[['fists',40,2,.2],['splash',76,8,0]]],
10065:['Dragonwood Railshot','grass','beam',3.9,'A pine-tail spear launches a spiral of cutting leaves.',[['tree',56,1,1.57],['leaves',76,9,.4],['rail',42,3,0]]],
10066:['Prismatic Ruin Mirror','dark','beam',3.8,'A giant ruby hexagon reflects a cross-shaped dark beam.',[['gem',62,6,.2],['beam',76,2,.8]]],
10067:['Cloudsong Majesty','fairy','vortex',3.8,'Pearled clouds surround a crescent and musical glints.',[['clouds',63,7,.2],['notes',73,5,.4],['crescent',27,1,0]]],
10068:['Twin-Saber Oath','fighting','slash',3.9,'Two long sabers cross beneath a psychic crest.',[['blades',77,2,.8],['crest',48,3,0]]],
10069:['Seraphic Healing Chime','fairy','vortex',3.6,'Winged chimes pulse through gentle heart rings.',[['bells',56,4,.3],['hearts',75,6,.2],['rings',41,2,0]]],
10070:['Abyss Torpedo Rush','dark','cone',3.9,'A shark torpedo rushes behind rows of dark teeth.',[['torpedo',74,1,0],['fangs',50,7,.2]]],
10071:['Spiral Shell Cannon','water','beam',3.7,'A spiral shell opens a circular water cannon.',[['shell',64,5,.1],['cannons',35,1,0],['splash',78,5,.3]]],
10072:['Diamond Spine Rupture','steel','quake',4,'Diamond vertebrae rise through iron earth fissures.',[['diamonds',77,6,.3],['spikes',46,7,.2],['fissures',67,5,.1]]],
10073:['Gale-Crest Comet','flying','vortex',3.8,'A flowing feather crest rides a spiraling comet gust.',[['feathers',72,9,.2],['comet',49,3,.4]]],
10074:['Frozen Maw Rupture','ice','blast',3.8,'An icy grin splits a six-pointed frozen core.',[['grin',48,6,0],['snow',77,6,.4],['gem',31,4,.1]]],
10075:['Royal Diamond Coronation','fairy','blast',3.9,'A jewel crown unfolds over a brilliant ruby heart.',[['crown',64,7,0],['gem',44,4,.3],['hearts',77,5,.2]]],
10076:['Meteor Pincer Array','steel','volley',4,'Four armored claws orbit a meteor hammer.',[['pincers',75,4,.5],['meteor',43,1,.2]]],
10079:['Emerald Sky Ascent','flying','cone',4.3,'A coiling emerald dragon ascends through three sky gates.',[['serpent',78,9,.1],['portal',56,3,.4],['delta',42,2,.2]]],
10087:['Caldera Overflow','fire','quake',3.8,'Three caldera chimneys erupt with molten rocks.',[['volcano',66,3,.1],['rocks',78,6,.5]]],
10088:['Ribbon Heel Encore','fighting','slash',3.8,'Ribbon loops follow alternating crescent heel kicks.',[['heels',65,3,.2],['ribbons',75,5,.4]]],
10089:['Crescent-Wing Cataclysm','dragon','cone',4,'A great crescent wing cleaves a dragon energy trail.',[['crescent',77,1,-.3],['serpent',55,6,.3],['blades',38,2,.8]]],
10090:['Triple-Stinger Blitz','bug','volley',3.8,'Three drill stingers fire behind an insect-wing halo.',[['drill',69,3,.2],['wings',54,4,.1]]],
10278:['Lunar Wing Wish','fairy','vortex',3.8,'A winged moon showers seven small wishing stars.',[['crescent',55,1,-.1],['wings',71,2,.3],['star',77,7,.4]]],
10279:['Carnivore Vine Choir','grass','cone',3.8,'Leaf-lined pitcher mouths snap along twisting vines.',[['pitcher',57,3,.3],['vines',76,4,.1]]],
10280:['Cosmic Starwheel','psychic','vortex',3.9,'A spinning jeweled star turns within an orbital wheel.',[['star',66,10,.2],['gem',30,6,.3],['rings',78,4,.1]]],
10281:['Tempest Dragon Courier','dragon','cone',4,'Winged dragon orbs travel in a curling tailwind.',[['wings',70,2,.6],['orbs',52,5,.2],['ribbons',76,3,.3]]],
10284:['Razor Feather Citadel','steel','volley',3.8,'Steel feather blades fan from an armored crest.',[['feathers',76,8,.4],['bastion',41,3,.1]]],
10285:['Wraith Kimono Blizzard','ice','vortex',3.8,'A ghostly gown spins through hanging snow charms.',[['gown',56,5,.2],['snow',78,8,.4],['runes',37,4,.1]]],
10288:['Venom Roller Stampede','bug','quake',3.8,'Segmented wheels fling needle-tipped poison trails.',[['wheels',67,5,.1],['needles',77,9,.4]]],
10289:['Hooded Riot Uppercut','dark','slash',3.8,'A hooded crest breaks apart under upward street-fight fists.',[['crest',65,4,.2],['fists',43,2,-.4],['star',78,11,.1]]],
10291:['Funeral Lantern Waltz','ghost','vortex',3.9,'Seven spirit flames hang from a turning chandelier.',[['chandelier',66,7,.2],['flames',41,5,.4]]],
10292:['Fortress Thorn Barrage','grass','volley',3.9,'A spiked shield launches armored thorn seeds.',[['shield',62,6,.1],['seeds',78,10,.3]]],
10293:['Witchfire Constellation','fire','beam',3.9,'A long witch staff draws a flaming star constellation.',[['staff',70,1,.4],['constellation',75,7,.2],['flames',36,4,.1]]],
10294:['Abyss Shuriken Mirage','water','volley',4,'Three giant shuriken split around a dark afterimage.',[['shuriken',75,3,.3],['eclipse',35,1,.2]]],
10295:['Solar Mane Dominion','fire','cone',3.9,'A roaring lion crest unfurls a broad burning mane.',[['mane',73,12,.1],['jaws',35,5,.2]]],
10296:['Eternal Flower Requiem','fairy','blast',3.9,'A long-stemmed eternal flower opens in layered rings.',[['flower',62,5,.3],['staff',66,1,-.5],['rings',78,2,.1]]],
10297:['Inversion Tentacle Gate','dark','vortex',3.9,'Tentacles curl inward around an inverted psychic gate.',[['tentacles',74,8,.4],['portal',41,2,.5],['eye',25,1,.1]]],
10298:['Seven-Claw Rockbreak','fighting','quake',3.9,'Seven stone claws clamp around a cracked star.',[['claws',77,7,.3],['fissures',53,6,.1]]],
10299:['Drowned Kelp Dragon','poison','cone',3.9,'A kelp dragon winds between drifting toxic bubbles.',[['serpent',72,8,.4],['vines',60,5,.1],['bubbles',43,7,.3]]],
10300:['Sky-Mask Press','fighting','slash',3.9,'A winged wrestler mask descends through a four-point impact.',[['mask',58,1,.1],['wings',77,4,.2],['star',35,4,.3]]],
10301:['Nihil Light','dragon','beam',4.32,'A vast cellular hex lattice focuses a six-winged annihilation ray.',[['hexes',78,9,.1],['wings',68,6,.2],['beam',42,4,.3]]],
10302:['Grandfather Dragon Tale','dragon','vortex',3.8,'Cloud beards curl around three storybook dragon orbs.',[['clouds',73,9,.3],['serpent',50,5,.1],['orbs',36,3,.4]]],
10304:['Thunder Tail Spiral','electric','chain',3.8,'A lightning-tail corkscrew races through three electric wheels.',[['bolts',74,3,.2],['wheels',48,3,.4],['spiral',67,2,.1]]],
10305:['Skybolt Star Halo','electric','beam',3.9,'A broad star halo carries floating electric crescents.',[['star',76,8,.3],['crescent',47,3,.5],['orbs',61,5,.1]]],
10306:['Iron Wind Chime','psychic','vortex',3.8,'Metal bells hang from a psychic wind ribbon.',[['bells',69,5,.2],['ribbons',57,4,.1],['hexes',34,3,.4]]],
10307:['Phantom Disaster Reprise','ghost','slash',4,'A ragged spectral wing traces three eclipse crescents.',[['wings',76,3,-.3],['crescent',58,3,.4],['zipper',32,5,.2]]],
10308:['Valor Talon Tempest','fighting','cone',3.9,'Three armored talons strike beneath a swept feather crest.',[['claws',67,3,.2],['feathers',78,6,.4]]],
10309:['Zero-Point Dragon Scythe','dragon','beam',4.1,'Four narrow dragon scythes close over a razor delta ray.',[['scythes',77,4,.2],['delta',59,3,.4],['eye',25,1,0]]],
10310:['Zenith Aura Lance','steel','beam',4.1,'A pointed aura lance passes through four armored seals.',[['rail',78,4,.1],['shield',50,4,.3],['orbs',33,6,.2]]],
10313:['Ancient Rocket Colossus','ground','quake',3.9,'A rune-covered rocket fist breaks ancient stone rings.',[['rocket',71,1,.2],['runes',76,8,.3],['fissures',51,4,.1]]],
10314:['Sovereign Psychic Eyes','psychic','beam',3.9,'Twin psychic eyes focus a fan of outward mind blades.',[['eye',29,2,.1],['blades',77,5,.4],['runes',54,6,.2]]],
10315:['Glacial Crab Hammer','ice','slash',3.9,'Two furry ice pincers crash into a frozen hammer star.',[['pincers',65,2,.3],['snow',77,5,.1],['star',39,8,.4]]],
10316:['Armored Ocean Execution','steel','slash',3.9,'Six serrated armored claws surge from a shell shield.',[['claws',77,6,.2],['shell',49,4,.3]]],
10317:['Clockwork Fleur Cannon','fairy','beam',4,'Clockwork petals open around a prism cannon.',[['gears',70,6,.1],['flower',47,6,.3],['cannons',28,1,.2]]],
10318:['Royal Clockwork Finale','fairy','vortex',4,'A royal gear crown releases a ring of jeweled blossoms.',[['crown',75,8,.2],['gears',51,4,.4],['flower',32,8,.1]]],
10319:['Plasma Thunderclaw','electric','slash',4,'Five lightning claws tear through a pulsing plasma orb.',[['claws',74,5,.4],['bolts',56,6,.1],['orbs',29,1,0]]],
10326:['Empress Mindstorm','psychic','vortex',3.9,'Three inward-facing eyes orbit a psychic constellation.',[['eye',24,3,.4],['constellation',77,9,.1],['rings',55,3,.2]]],
10195:['G-Max Vine Lash','grass','vortex',3.6,'Gigantic vines burst beneath a canopy of seven leaves.',[['vines',79,7,.2],['leaves',61,7,.4],['flower',29,5,.1]]],
10196:['G-Max Wildfire','fire','cone',3.6,'A winged wildfire crest spreads twelve flame tongues.',[['wings',77,2,.3],['flames',74,12,.1],['sun',35,5,.2]]],
10197:['G-Max Cannonade','water','volley',3.6,'Five broad cannon barrels launch a water-shell barrage.',[['cannons',76,5,.2],['shell',44,6,.1],['splash',65,9,.4]]],
10198:['G-Max Befuddle','bug','vortex',3.6,'Four enormous butterfly wings scatter hexagonal dream dust.',[['butterfly',77,4,.1],['hexes',59,7,.3],['orbs',32,6,.4]]],
10199:['G-Max Volt Crash','electric','chain',3.6,'A long lightning tail crashes through a thundercloud.',[['bolts',81,1,-.2],['clouds',60,5,.3],['star',45,9,.1]]],
10200:['G-Max Gold Rush','normal','volley',3.6,'A shower of stamped coins rains around three lucky claws.',[['coins',79,11,.2],['claws',50,3,.4]]],
10201:['G-Max Chi Strike','fighting','slash',3.6,'Four colossal fists converge on a martial crest.',[['fists',67,4,.3],['crest',35,6,.1]]],
10202:['G-Max Terror','ghost','vortex',3.6,'An immense haunted mouth opens behind a spiral gate.',[['grin',68,9,.1],['portal',80,4,.3],['tentacles',44,5,.2]]],
10203:['G-Max Foam Burst','water','cone',3.6,'A giant crab pincer explodes into a foaming bubble crown.',[['pincers',70,1,.2],['bubbles',78,12,.4],['splash',39,7,.1]]],
10204:['G-Max Resonance','ice','vortex',3.6,'A musical shell carries a circular ice stave.',[['shell',63,7,.3],['notes',80,8,.2],['snow',41,6,.1]]],
10205:['G-Max Cuddle','normal','blast',3.6,'A fluffy ruff blooms into large embracing hearts.',[['clouds',66,10,.2],['hearts',76,8,.4],['ribbons',41,2,.1]]],
10206:['G-Max Replenish','normal','quake',3.6,'A small tree rises above a berry-strewn earthen belly.',[['tree',65,1,0],['fruit',77,8,.3],['rings',49,3,.2]]],
10207:['G-Max Malodor','poison','blast',3.6,'A skyline of scrap erupts into lobbed toxic bubbles.',[['scrap',69,7,.2],['bubbles',80,9,.4],['fissures',33,3,.1]]],
10208:['G-Max Meltdown','steel','beam',3.6,'Molten hexagonal nuts lock around a liquid-metal beam.',[['gears',79,5,.3],['hexes',51,6,.1],['beam',36,2,.4]]],
10209:['G-Max Drum Solo','grass','quake',3.6,'A full drum kit strikes a ring of flying leaf beats.',[['drums',77,5,.2],['leaves',79,12,.4],['notes',35,4,.1]]],
10210:['G-Max Fireball','fire','blast',3.6,'A single giant kicked fireball carries a heel-shaped comet tail.',[['sun',78,16,.2],['heels',45,1,-.4],['comet',70,2,.3]]],
10211:['G-Max Hydrosnipe','water','beam',3.6,'A water sniper rail focuses through three crosshair scopes.',[['rail',83,1,0],['crosshair',77,3,.1],['splash',34,4,.3]]],
10212:['G-Max Wind Rage','flying','vortex',3.6,'Four armored storm birds circle in a wind wheel.',[['feathers',81,4,.3],['wheels',66,4,.2],['shield',34,4,.1]]],
10213:['G-Max Gravitas','psychic','vortex',3.6,'A hovering saucer bends concentric gravity rays.',[['saucer',75,1,.1],['rings',82,5,.4],['beam',31,5,.2]]],
10214:['G-Max Stonesurge','water','quake',3.6,'A fortress turtle shell throws water-lifted stone slabs.',[['shell',76,4,.2],['rocks',81,8,.3],['splash',46,6,.1]]],
10215:['G-Max Volcalith','rock','quake',3.6,'A coal mountain opens five volcanic vents beneath falling cinders.',[['volcano',79,5,.2],['rocks',82,11,.1],['flames',40,7,.4]]],
10216:['G-Max Tartness','grass','cone',3.6,'A sliced apple dragon rains sharp acidic leaf wedges.',[['apple',76,1,.1],['blades',78,6,.4],['bubbles',34,5,.2]]],
10217:['G-Max Sweetness','grass','vortex',3.6,'An apple pie shell releases soft syrup rings and fruit stars.',[['pie',76,1,.2],['fruit',80,7,.4],['rings',42,4,.1]]],
10218:['G-Max Sandblast','ground','vortex',3.6,'A coiling sand serpent draws five nested dust spirals.',[['serpent',80,12,.3],['spiral',77,5,.1],['rocks',36,6,.2]]],
10219:['G-Max Stun Shock','electric','chain',3.6,'An amped electric guitar sends tall sawtooth shock waves.',[['guitar',77,1,.3],['fence',81,8,.1],['bolts',43,5,.2]]],
10220:['G-Max Centiferno','fire','cone',3.6,'A long segmented furnace serpent coils into a burning cage.',[['serpent',84,15,.1],['fence',69,6,.2],['flames',47,8,.4]]],
10221:['G-Max Smite','fairy','blast',3.6,'A witch spire unfurls long ribbons and sparkling heart seals.',[['staff',83,3,.2],['ribbons',78,8,.4],['hearts',44,4,.1]]],
10222:['G-Max Snooze','dark','blast',3.6,'A giant nightmare mask closes over ragged sleep crescents.',[['mask',73,1,.2],['crescent',81,5,.4],['ribbons',45,3,.1]]],
10223:['G-Max Finale','fairy','vortex',3.6,'A tiered cream cake showers berries and bright confection stars.',[['cake',79,4,.1],['fruit',82,9,.3],['star',36,5,.2]]],
10224:['G-Max Steelsurge','steel','volley',3.6,'A colossal iron trunk scatters a field of metal spikes.',[['trunk',81,1,.1],['spikes',82,11,.3],['gears',37,3,.2]]],
10225:['G-Max Depletion','dragon','beam',3.6,'A skyscraper cannon projects a ladder of dragon-energy floors.',[['building',82,5,.1],['rail',77,4,.3],['beam',35,1,.2]]],
10226:['G-Max One Blow','dark','slash',3.6,'One enormous dark fist fractures a circular martial seal.',[['fists',76,1,-.25],['fissures',83,8,.1],['crest',48,5,.3]]],
10227:['G-Max Rapid Flow','water','cone',3.6,'Five flowing water fists sweep across a rolling wave fan.',[['fists',58,5,.2],['splash',83,12,.4],['ribbons',45,6,.1]]],
10228:['G-Max Stun Shock','electric','chain',3.6,'A low-key bass guitar sends broad circular tremor chords.',[['guitar',64,2,-.3],['rings',83,7,.1],['notes',78,6,.4]]]
};

const formColors={10034:'#5ad4ff',10079:'#7be4b7',10301:'#99f56e'};
export const FORM_SIGNATURES=Object.freeze(Object.fromEntries(Object.entries(definitions).map(([id,d])=>[id,Object.freeze({name:d[0],type:d[1],shape:d[2],power:d[3],color:formColors[id]||colors[d[1]],signature:true,visualKey:`form:${id}`,visualDescription:d[4]})])));
export function formAttackFor(p){return p&&(p.mega||p.gigantamax)?FORM_SIGNATURES[p.id]||null:null}

export function drawFormAttack(ctx,f){
 const key=f.move?.visualKey;if(!key?.startsWith('form:'))return false;
 const id=Number(key.slice(5)),d=definitions[id];if(!d)return false;
 const duration=f.duration>0?f.duration:1,p=Math.max(0,Math.min(1,1-(f.life||0)/duration)),alpha=Math.min(1,Math.max(0,f.life||0)*7),x=f.target.x,y=f.target.y,ox=f.origin.x,oy=f.origin.y,c=f.move.color||colors[d[1]],L=Math.hypot(x-ox,y-oy),angle=Math.atan2(y-oy,x-ox);
 const poly=(pts,color=c)=>{ctx.fillStyle=color;ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()};
 const line=(pts,w=3,color=c)=>{ctx.strokeStyle=color;ctx.lineWidth=w;ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()};
 const dot=(x,y,r,color=c)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,Math.max(.1,r),0,Math.PI*2);ctx.fill()};
 const ring=(x,y,r,ry=r,color=c,w=3)=>{ctx.strokeStyle=color;ctx.lineWidth=w;ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,r),Math.max(.1,ry),0,0,Math.PI*2);ctx.stroke()};
 const star=(x,y,r,n,color=c)=>poly(Array.from({length:n*2},(_,i)=>{const a=i*Math.PI/n-Math.PI/2,R=i%2?r*.38:r;return [x+Math.cos(a)*R,y+Math.sin(a)*R]}),color);
 const hex=(x,y,r,n=6,color=c)=>poly(Array.from({length:n},(_,i)=>[x+Math.cos(i*Math.PI*2/n)*r,y+Math.sin(i*Math.PI*2/n)*r]),color);
 const scatter=(r,n,fn)=>{for(let i=0;i<n;i++){const a=i*Math.PI*2/n+p*.7;fn(Math.cos(a)*r,Math.sin(a)*r*.66,a,i)}};
 const spike=(x,y,a,r,width=8)=>{const ux=Math.cos(a),uy=Math.sin(a),vx=-uy,vy=ux;poly([[x+vx*width,y+vy*width],[x+ux*r,y+uy*r],[x-vx*width,y-vy*width]],c);line([[x,y],[x+ux*r*.8,y+uy*r*.8]],1,'#fffbe5')};
 ctx.save();ctx.globalAlpha=alpha;ctx.lineCap='round';ctx.lineJoin='round';
 // The travelling part follows the move's collision shape; the authored crest is form-specific.
 ctx.save();ctx.translate(ox,oy);ctx.rotate(angle);
 if(d[2]==='beam'){line([[0,0],[L,0]],13,c+'60');line([[0,0],[L,0]],4,c);for(let i=0;i<4;i++)ring(((i/4+p)%1)*L,0,4,12,c,2)}
 else if(d[2]==='cone'){for(let k=-1;k<=1;k++)line(Array.from({length:16},(_,i)=>[L*i/15,k*i*2+Math.sin(i*.65-p*11)*7]),5,c)}
 else if(d[2]==='volley'){for(let k=-1;k<=1;k++){const t=(p+k*.13+1)%1;spike(L*t-13,k*17,0,24,5)}}
 else if(d[2]==='chain'){line(Array.from({length:15},(_,i)=>[L*i/14,Math.sin(i*8+p*12)*12]),5,c)}
 else{for(let i=0;i<5;i++){const t=(p+i/5)%1;dot(t*L,Math.sin(i*5+p*8)*14,3,c)}}ctx.restore();
 ctx.translate(x,y);
 const motif=(name,r,n)=>{
  if(name==='rings'||name==='portal'){for(let i=0;i<n;i++){const rr=r*(.35+.65*((p+i/n)%1));ring(0,0,rr,name==='portal'?rr*.68:rr,c,i%2?2:4)}if(name==='portal')scatter(r,n,(x,y,a)=>line([[x,y],[x+Math.cos(a)*10,y+Math.sin(a)*10]],3,'#fffbe5'))}
  else if(name==='star'||name==='sun'){star(0,0,r,n,c);star(0,0,r*.55,n,'#fff0be');if(name==='sun')ring(0,0,r*.33,r*.33,'#ffffff',3)}
  else if(name==='flower'||name==='gown'){scatter(r*.52,n,(x,y,a)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a);poly([[-r*.4,0],[0,-r*.2],[r*.36,0],[0,r*.2]],c);line([[-r*.28,0],[r*.2,0]],2,'#fffce5');ctx.restore()});dot(0,0,r*.2,'#fff1b3');if(name==='gown')poly([[-r*.25,-r*.7],[r*.25,-r*.7],[r*.8,r*.65],[0,r*.35],[-r*.8,r*.65]],c+'90')}
  else if(name==='wings'||name==='butterfly'){for(let i=0;i<n;i++){const side=i%2?1:-1,yy=(Math.floor(i/2)-.5)*r*.25;poly([[0,yy],[side*r*.34,yy-r*.72],[side*r,yy-r*.4],[side*r*.57,yy+r*.14],[side*r*.2,yy+r*.3]],id===10034?(i%2?c:'#263742'):i%2?c:'#eefcff');line([[0,yy],[side*r*.88,yy-r*.37]],2,c)}if(name==='butterfly'){line([[0,-r*.7],[0,r*.6]],5,'#47536d');line([[0,-r*.5],[-r*.2,-r*.9]],2,c);line([[0,-r*.5],[r*.2,-r*.9]],2,c)}}
  else if(name==='spoons'){scatter(r*.68,n,(x,y,a)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a);ring(0,-10,7,11,'#f2f4ff',3);line([[0,1],[0,27]],4,'#bccde3');ctx.restore()})}
  else if(name==='eye'){scatter(n===1?0:r*.8,n,(x,y,a)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a*.3);poly([[-r*.7,0],[0,-r*.4],[r*.7,0],[0,r*.4]],'#f8edff');ring(0,0,r*.22,r*.28,c,5);dot(0,0,r*.09,'#26304b');ctx.restore()})}
  else if(name==='jaws'||name==='grin'||name==='fangs'){const spread=name==='jaws'?r*.45:r*.2;line([[-r,-spread],[0,-spread-r*.13],[r,-spread]],5,c);line([[-r,spread],[0,spread+r*.2],[r,spread]],5,c);for(let i=0;i<n;i++){const xx=-r+(i+.5)*r*2/n;poly([[xx-r/n*.7,-spread],[xx+r/n*.7,-spread],[xx,-spread+r*.4]],'#fff7df');poly([[xx-r/n*.6,spread],[xx+r/n*.6,spread],[xx,spread-r*.28]],c)}if(name==='grin'){dot(-r*.5,-r*.63,r*.12,'#fff3ff');dot(r*.5,-r*.63,r*.12,'#fff3ff')}}
  else if(name==='fists'||name==='palms'){scatter(n===1?0:r*.55,n,(x,y,a)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a*.4+p*.25);const z=r/(n===1?1.7:2.8);poly([[-z,-z*.5],[-z*.7,-z],[z*.6,-z],[z,-z*.25],[z*.7,z],[-z*.6,z],[-z,z*.3]],c);for(let k=0;k<3;k++)line([[-z*.5+k*z*.45,-z*.8],[-z*.5+k*z*.45,-z*.15]],2,'#fff1db');if(name==='palms')for(let k=0;k<4;k++)line([[-z*.6+k*z*.4,-z*.5],[-z*.6+k*z*.4,-z*1.6]],3,c);ctx.restore()})}
  else if(name==='horns'||name==='pincers'||name==='claws'||name==='scythes'){scatter(n===1?0:r*.36,n,(x,y,a)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a+(name==='scythes'?.6:0));poly([[-r*.18,r*.26],[-r*.3,-r*.3],[r*.1,-r*.66],[r*.52,-r*.7],[r*.1,-r*.3],[r*.05,r*.25]],c);if(name==='pincers')poly([[r*.05,r*.2],[r*.43,-r*.1],[r*.5,-r*.5],[r*.19,-r*.28]],'#eef5ff');line([[-r*.18,r*.1],[-r*.12,-r*.24],[r*.17,-r*.51]],2,'#fffbe0');ctx.restore()})}
  else if(['blades','feathers','leaves','delta','heels','shuriken'].includes(name)){scatter(r*.5,n,(x,y,a)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a+p*.7);if(name==='shuriken')star(0,0,r*.48,4,c);else if(name==='heels')poly([[-r*.35,-r*.18],[r*.1,-r*.24],[r*.46,r*.2],[r*.22,r*.37],[-r*.4,r*.05]],c);else if(name==='delta')poly([[-r*.2,-r*.35],[r*.65,0],[-r*.2,r*.35],[0,0]],c);else poly([[-r*.45,0],[0,-r*(name==='feathers'?.13:.28)],[r*.45,0],[0,r*.16]],c);line([[-r*.3,0],[r*.32,0]],2,'#fffbe4');ctx.restore()})}
  else if(name==='bolts'||name==='fence'){for(let i=0;i<n;i++){const xx=(i-(n-1)/2)*r*1.5/Math.max(1,n-1);line([[xx-r*.2,-r*.8],[xx+r*.08,-r*.2],[xx-r*.08,r*.12],[xx+r*.2,r*.75]],name==='fence'?3:5,c);if(name==='fence')line([[xx-r*.3,0],[xx+r*.3,0]],2,'#fff9da')}}
  else if(name==='spiral'||name==='serpent'||name==='shell'||name==='wheels'){for(let k=0;k<(name==='wheels'?n:1);k++){const offset=name==='wheels'?(k-(n-1)/2)*r*.6:0;line(Array.from({length:36},(_,i)=>{const a=i/35*Math.PI*(name==='serpent'?3:n*.8)+p*2,rr=r*(.1+i/40);return [offset+Math.cos(a)*rr,Math.sin(a)*rr*.62]}),name==='serpent'?9:4,c);if(name==='shell')for(let i=0;i<n;i++)spike(0,0,i*Math.PI*2/n,r,3)}if(name==='serpent'){dot(r*.85,0,10,c);dot(r*.9,-3,2,'#fff8de')}}
  else if(name==='ribbons'||name==='vines'||name==='tentacles'){for(let k=0;k<n;k++){const a=k*Math.PI*2/n;line(Array.from({length:18},(_,i)=>{const t=i/17,rr=t*r;return [Math.cos(a)*rr+Math.sin(t*7+p*5+k)*12,Math.sin(a)*rr*.7+Math.cos(t*7+p*4+k)*8]}),name==='vines'?5:3,c);if(name==='tentacles')dot(Math.cos(a)*r,Math.sin(a)*r*.7,5,'#fff0df')}}
  else if(['hexes','diamonds','gem','gears','shield','crown','crest','runes'].includes(name)){if(name==='gem'||name==='shield'){hex(0,0,r,name==='gem'?n:6,c);hex(0,0,r*.7,name==='gem'?n:6,'#f5f6ff');hex(0,0,r*.48,name==='gem'?n:6,c)}else if(name==='crown'){poly([[-r,r*.35],[-r,-r*.5],[-r*.5,0],[0,-r*.8],[r*.5,0],[r,-r*.5],[r,r*.35]],c);for(let i=0;i<n;i++)dot(-r+(i+.5)*r*2/n,r*.15,3,'#fff5b8')}else if(name==='crest'){poly([[0,-r],[r*.65,-r*.25],[r*.4,r*.65],[0,r],[ -r*.4,r*.65],[-r*.65,-r*.25]],c);star(0,0,r*.4,n,'#fffbe5')}else scatter(r*.68,n,(x,y,a)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a+p);if(name==='gears'){star(0,0,r*.25,10,c);ring(0,0,r*.1,r*.1,'#fff7e4',2)}else if(name==='diamonds')poly([[0,-r*.24],[r*.18,0],[0,r*.24],[-r*.18,0]],c);else if(name==='runes'){line([[-8,-10],[8,-10],[8,10],[-8,10],[-8,0],[3,0]],2,c)}else{hex(0,0,r*.21,6,c);hex(0,0,r*.12,6,'#f2ffff')}ctx.restore()})}
  else if(['rocks','seeds','fruit','bubbles','orbs','coins','scrap'].includes(name)){scatter(r*.74,n,(x,y,a,i)=>{const z=7+(i%3)*3;if(name==='rocks'||name==='scrap')hex(x,y,z,5+i%3,c);else if(name==='seeds')poly([[x-z,y],[x,y-z],[x+z,y],[x,y+z*.4]],c);else{dot(x,y,z,c);ring(x-2,y-2,z*.55,z*.55,'#fff6db',2);if(name==='coins')line([[x,y-z*.4],[x,y+z*.4]],2,'#86633e');if(name==='fruit')line([[x,y-z],[x+5,y-z-6]],3,'#9cda79')}})}
  else if(name==='flames'||name==='spikes'||name==='needles'||name==='splash'){scatter(r*.4,n,(x,y,a,i)=>{spike(x,y,a-Math.PI/2,r*(.35+(i%3)*.1),name==='needles'?3:8);if(name==='flames')spike(x,y,a-Math.PI/2,r*.25,4)})}
  else if(name==='notes'){scatter(r*.65,n,(x,y,a)=>{dot(x,y,7,c);line([[x+5,y],[x+5,y-24],[x+17,y-30]],3,c);line([[x+5,y-19],[x+17,y-25]],2,'#fff4e3')})}
  else if(name==='volcano'){for(let i=0;i<n;i++){const xx=(i-(n-1)/2)*r*.7;poly([[xx-r*.35,r*.55],[xx-r*.12,-r*.3],[xx+r*.12,-r*.3],[xx+r*.35,r*.55]],c);ring(xx,-r*.3,r*.14,r*.06,'#fff0c8',3);for(let k=0;k<3;k++)spike(xx,-r*.35,-Math.PI/2+(k-1)*.5,r*.65,5)}}
  else if(name==='snow'){scatter(r*.6,n,(x,y,a)=>{for(let j=0;j<6;j++){const b=j*Math.PI/3;line([[x,y],[x+Math.cos(b)*13,y+Math.sin(b)*13]],2,c)}dot(x,y,3,'#fffaff')})}
  else if(name==='zipper'){line([[-r,-r*.2],[r,r*.2]],6,'#2e254b');for(let i=0;i<n;i++){const xx=-r+i*r*2/Math.max(1,n-1);line([[xx-4,-r*.15-7],[xx+4,r*.15+7]],3,c)}ring(0,0,9,15,'#fff4d4',3)}
  else if(name==='eclipse'||name==='crescent'){if(name==='eclipse'){dot(0,0,r*.7,'#251e39');ring(0,0,r*.73,r*.73,c,4)}else for(let i=0;i<n;i++){ctx.beginPath();ctx.strokeStyle=c;ctx.lineWidth=9;ctx.arc(0,0,r*(.6+i*.13),-.6+i*.7,Math.PI+i*.7);ctx.stroke()}}
  else if(name==='fissures'){scatter(r*.15,n,(x,y,a)=>line(Array.from({length:6},(_,i)=>[x+Math.cos(a)*i*r/5+Math.sin(i*8)*7,y+Math.sin(a)*i*r/5*.7]),iSafe(n),c))}
  else if(name==='drill'||name==='torpedo'||name==='rocket'||name==='comet'){for(let i=0;i<n;i++){const yy=(i-(n-1)/2)*r*.5;poly([[-r,yy-r*.14],[r,yy],[-r,yy+r*.14],[-r*.6,yy]],c);for(let k=0;k<4;k++)line([[-r*.7+k*r*.3,yy-r*.12],[-r*.55+k*r*.3,yy+r*.12]],2,'#fff8d5');if(name==='rocket')poly([[-r,yy-r*.3],[-r*.4,yy],[-r,yy+r*.3]],'#ffb15c');if(name==='comet')line([[-r*1.3,yy],[0,yy]],3,'#fff3dc')}}
  else if(name==='beam'||name==='rail'){for(let i=0;i<n;i++){const yy=(i-(n-1)/2)*10;line([[-r,yy],[r,yy]],i%2?2:5,c);if(name==='rail')for(let j=0;j<6;j++)line([[-r+j*r*.4,yy-7],[-r+j*r*.4,yy+7]],2,'#f5ffff')}}
  else if(['cannons','bells','drums','chandelier','staff','trunk','building','bastion','saucer','guitar','mask','apple','pie','cake','pitcher','mane','constellation','crosshair','hearts','clouds','tree'].includes(name)){
   if(name==='cannons')scatter(r*.6,n,(x,y,a)=>{line([[x*.4,y*.4],[x,y]],10,c);ring(x,y,12,16,c,4);dot(x,y,6,'#fff9df')});
   else if(name==='bells'||name==='chandelier'){line([[-r,-r*.3],[r,-r*.3]],3,c);for(let i=0;i<n;i++){const xx=-r+(i+.5)*r*2/n,yy=Math.sin(p*6+i)*8;line([[xx,-r*.3],[xx,yy]],2,c);poly([[xx-8,yy+12],[xx-6,yy-9],[xx+6,yy-9],[xx+8,yy+12]],c);dot(xx,yy+15,3,'#fff4cc')}}
   else if(name==='drums')scatter(r*.5,n,(x,y,a)=>{poly([[x-14,y-7],[x+14,y-7],[x+14,y+12],[x-14,y+12]],c);ring(x,y-7,14,7,'#fff4cf',3);line([[x-16,y-28],[x+8,y-3]],3,c);line([[x+16,y-28],[x-8,y-3]],3,c)});
   else if(name==='staff'){for(let i=0;i<n;i++){const xx=(i-(n-1)/2)*r*.7;line([[xx,-r],[xx,r]],5,c);star(xx,-r*.75,r*.22,5,'#fff1b7')}}
   else if(name==='building'||name==='bastion'){for(let i=0;i<n;i++){const xx=(i-(n-1)/2)*r*.45,h=r*(.65+(i%3)*.18);poly([[xx-11,r*.5],[xx-11,-h],[xx+11,-h],[xx+11,r*.5]],c);for(let j=0;j<4;j++)line([[xx-7,-h+j*h*.28],[xx+7,-h+j*h*.28]],2,'#fff5d5')}}
   else if(name==='saucer'){ring(0,0,r,r*.3,c,7);poly([[-r*.6,0],[-r*.3,-r*.45],[r*.3,-r*.45],[r*.6,0]],c);for(let i=0;i<5;i++)dot(-r*.7+i*r*.35,r*.05,4,'#fff3bd')}
   else if(name==='trunk'){line([[-r*.6,-r*.8],[-r*.6,r*.45],[r*.2,r*.7],[r*.7,r*.3]],18,c);ring(r*.7,r*.3,14,18,'#f4ffff',3)}
   else if(name==='guitar'){for(let i=0;i<n;i++){const xx=(i-(n-1)/2)*r*.7;dot(xx,r*.2,r*.3,c);dot(xx,-r*.13,r*.23,c);line([[xx,-r*.9],[xx,r*.25]],9,c);for(let k=-1;k<=1;k++)line([[xx+k*3,-r*.9],[xx+k*3,r*.38]],1,'#fff6ce')}}
   else if(name==='mask'){poly([[0,-r],[r*.7,-r*.5],[r*.55,r*.6],[0,r],[-r*.55,r*.6],[-r*.7,-r*.5]],c);poly([[-r*.5,-r*.2],[-r*.12,-r*.05],[-r*.3,r*.18]],'#fff2dd');poly([[r*.5,-r*.2],[r*.12,-r*.05],[r*.3,r*.18]],'#fff2dd')}
   else if(name==='apple'||name==='pitcher'){dot(-r*.25,0,r*.48,c);dot(r*.25,0,r*.48,c);poly([[-r*.67,0],[r*.67,0],[r*.35,r*.7],[-r*.35,r*.7]],c);line([[0,-r*.35],[r*.15,-r*.8]],5,'#c9e879');if(name==='pitcher')ring(0,-r*.18,r*.5,r*.23,'#fff4d0',4)}
   else if(name==='pie'){poly([[-r,-r*.15],[r,-r*.15],[r*.7,r*.55],[-r*.7,r*.55]],c);for(let i=0;i<6;i++){const xx=-r*.8+i*r*.32;line([[xx,-r*.4],[xx+r*.3,r*.3]],4,'#fff0bd');line([[xx,r*.3],[xx+r*.3,-r*.4]],3,'#ffdab0')}}
   else if(name==='cake'){for(let i=0;i<n;i++){const ww=r*(1-i*.16),yy=r*.6-i*r*.38;poly([[-ww,yy],[-ww,yy-r*.28],[ww,yy-r*.28],[ww,yy]],c);for(let j=0;j<5;j++)dot(-ww+(j+.5)*ww*2/5,yy-r*.27,5,'#fff5df')}star(0,-r*.9,11,5,'#fff1b3')}
   else if(name==='mane'){star(0,0,r,n,c);poly([[-r*.35,-r*.3],[r*.35,-r*.3],[r*.25,r*.3],[0,r*.5],[-r*.25,r*.3]],'#fff3c4');line([[-r*.2,0],[r*.2,0]],3,c)}
   else if(name==='constellation'){const pts=Array.from({length:n},(_,i)=>{const a=i*Math.PI*2/n;return [Math.cos(a)*r,Math.sin(a)*r*.65]});line([...pts,pts[0]],2,c);pts.forEach(([x,y])=>star(x,y,8,4,'#fff9df'))}
   else if(name==='crosshair'){scatter(n===1?0:r*.45,n,(x,y,a)=>{ring(x,y,r*.35,r*.35,c,3);line([[x-r*.5,y],[x+r*.5,y]],2,c);line([[x,y-r*.5],[x,y+r*.5]],2,c)})}
   else if(name==='hearts')scatter(r*.65,n,(x,y,a)=>{poly([[x,y+13],[x-15,y-1],[x-11,y-12],[x,y-5],[x+11,y-12],[x+15,y-1]],c)});
   else if(name==='clouds')scatter(r*.6,n,(x,y,a)=>{dot(x,y,12,c);dot(x-8,y+3,9,'#eff9ff');dot(x+8,y+3,9,c)});
   else if(name==='tree'){for(let i=0;i<n;i++){const xx=(i-(n-1)/2)*r*.65;line([[xx,r*.7],[xx,-r*.65]],7,c);for(let k=0;k<3;k++){const yy=-r*.6+k*r*.35,rr=r*(.25+k*.1);poly([[xx,yy-r*.28],[xx-rr,yy+r*.24],[xx+rr,yy+r*.24]],c)}}}
  }
 };
 for(const [name,r,n,a=0,dx=0,dy=0] of d[5]){ctx.save();ctx.translate(dx,dy);ctx.rotate(a+(name==='rings'||name==='portal'?p*.25:0));motif(name,r*(.82+.18*Math.sin(p*Math.PI)),n);ctx.restore()}
 ctx.restore();return true;
}
const iSafe=n=>Math.max(2,6-n*.4);
