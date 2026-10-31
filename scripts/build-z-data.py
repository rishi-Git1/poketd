"""Rebuild the Alola Z-Crystal catalog and official PokéAPI item sprites.
Developer-only: normal Render builds use the bundled catalog and PNGs.
Names/types come from https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv
"""
import csv,json,pathlib,subprocess,concurrent.futures
root=pathlib.Path(__file__).resolve().parents[1]
cache=root/'scripts/pokeapi-csv'
def table(name):
    path=cache/(name+'.csv')
    if not path.exists():
        subprocess.run(['curl','-fsSL','--retry','2','--max-time','45',f'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/{name}.csv','-o',str(path)],check=True)
    return list(csv.DictReader(path.open()))
moves={int(r['id']):r for r in table('moves')}
names={int(r['move_id']):r['name'] for r in table('move_names') if r['local_language_id']=='9'}
items={r['identifier']:r for r in table('items')}
item_names={int(r['item_id']):r['name'] for r in table('item_names') if r['local_language_id']=='9'}
types={r['id']:r['identifier'] for r in table('types')}
colors={'normal':'#ffe499','fire':'#ff8235','water':'#48c8ff','grass':'#87e841','electric':'#ffe73b','ice':'#b8efff','fighting':'#ffac7d','poison':'#cc6fea','ground':'#ce9b4b','flying':'#d9f4ff','psychic':'#fb80d5','bug':'#cfdf6a','rock':'#bda474','ghost':'#ad68ee','dragon':'#a181ff','dark':'#b48bdf','steel':'#d2e8f0','fairy':'#ffc4ef'}
# crystal, canonical move ID, collision shape, authored visual description
generic=[
 ('normalium',622,'cone','A rushing golden comet leaves chevron shockwaves.'),
 ('fightinium',624,'blast','Ten giant fists converge inside an impact ring.'),
 ('flyinium',626,'beam','Feather lances plunge through a skyward dive crest.'),
 ('poisonium',628,'vortex','Acid droplets rain into a bubbling toxic pool.'),
 ('groundium',630,'quake','Six deep fissures split the ground and erupt upward.'),
 ('rockium',632,'blast','A colossal faceted monolith collapses into rubble.'),
 ('buginium',634,'volley','Silken threads wrap the target in a giant cocoon.'),
 ('ghostium',636,'vortex','Seven spectral hands reach from a black portal.'),
 ('steelium',638,'beam','Metal rings spiral along a giant corkscrew charge.'),
 ('firium',640,'blast','A blazing miniature sun erupts with flame tongues.'),
 ('waterium',642,'vortex','A towering waterspout carries foam and spinning spray.'),
 ('grassium',644,'vortex','A field of full-color flowers blooms around the target.'),
 ('electrium',646,'chain','Six branching lightning pillars converge on a white core.'),
 ('psychium',648,'blast','Nine psychic panes shatter in a rotating glass sphere.'),
 ('icium',650,'blast','A huge ice prison cracks into jagged frozen shards.'),
 ('dragonium',652,'beam','A spectral dragon rushes along a serpentine energy trail.'),
 ('darkinium',654,'vortex','An expanding black hole eclipses orbiting dark rings.'),
 ('fairium',656,'blast','A pink heart explodes into a shower of fairy stars.')]
signature=[
 ('pikanium',658,'blast',dict(forms=[25],holder='Pikachu'),'A Pikachu-shaped electric charge crashes into lightning.'),
 ('pikashunium',719,'chain',dict(forms=[10094,10095,10096,10097,10098,10099,10148,10160],cap=True,holder='Pikachu in a cap'),'Seven rainbow bolts erupt from a red cap crest.'),
 ('aloraichium',700,'beam',dict(forms=[10100],holder='Alolan Raichu'),'An electric surfboard rides a wave of lightning.'),
 ('eevium',702,'beam',dict(forms=[133],holder='Eevee',boost=True,status=True),'Nine evolution-colored lights orbit and empower Eevee.'),
 ('snorlium',701,'quake',dict(species=[143],holder='Snorlax'),'A huge sleeping-belly silhouette falls onto a wide shockwave.'),
 ('mewnium',703,'vortex',dict(species=[151],holder='Mew'),'A psychic supernova opens in four brilliant star rings.'),
 ('decidium',695,'volley',dict(forms=[724],holder='Alolan Decidueye'),'Fifteen spectral arrows converge from a ghostly firing circle.'),
 ('incinium',696,'blast',dict(species=[727],holder='Incineroar'),'A wrestling ring frames a diving fiery moonsault impact.'),
 ('primarium',697,'blast',dict(species=[730],holder='Primarina'),'A giant water aria orb releases bubbles and musical notes.'),
 ('lycanium',727,'quake',dict(species=[745],holder='Lycanroc'),'Eleven stone lances erupt into a splintered storm.'),
 ('mimikium',726,'blast',dict(species=[778],holder='Mimikyu'),'A giant ragged disguise folds around the target with spectral arms.'),
 ('kommonium',728,'vortex',dict(species=[784],holder='Kommo-o',boost=True),'Clanging golden scales orbit pulsing dragon-aura rings.'),
 ('tapunium',698,'blast',dict(species=[785,786,787,788],holder='a Tapu guardian'),'A colossal golden guardian rises and strikes the battlefield.'),
 ('solganium',724,'beam',dict(forms=[791,10155],holder='Solgaleo or Dusk Mane Necrozma'),'A white-hot solar charge erupts into twelve armored sun rays.'),
 ('lunalium',725,'vortex',dict(forms=[792,10156],holder='Lunala or Dawn Wings Necrozma'),'Lunar wings cross a spinning eclipse of violet moon crescents.'),
 ('ultranecrozium',723,'beam',dict(forms=[10155,10156,10157],holder='Dawn Wings, Dusk Mane or Ultra Necrozma'),'Five columns of prismatic sky light converge on a golden eight-point sun.'),
 ('marshadium',699,'blast',dict(species=[802],holder='Marshadow'),'Seven spectral stars and a shadow fist converge on the target.')]
catalog=[]
for base,id,shape,art in generic:
    catalog.append(dict(key=base+'-z',moveId=id,shape=shape,art=art,power=7.2))
for base,id,shape,rules,art in signature:
    catalog.append(dict(key=base+'-z',moveId=id,shape=shape,art=art,power=8.8,signature=True,**rules))
for c in catalog:
    m=moves[c['moveId']];icon=c['key']+'--held';item=items[icon]
    c.update(move=names[c['moveId']],type=types[m['type_id']],color=colors[types[m['type_id']]],icon=icon,title=item_names[int(item['id'])],itemId=int(item['id']))
(root/'public/z-catalog.js').write_text('// Official names/types from PokéAPI. Generated by scripts/build-z-data.py.\nexport const Z_CRYSTALS='+json.dumps(catalog,ensure_ascii=False,separators=(',',':'))+';\n')
# Include the two signature holders absent from Alola's original regional list.
# Dex count still describes the official 403-species regional list.
alola_path=root/'public/assets/regions/alola.json'
origin_path=root/'public/assets/regions/origin.json'
alola=json.loads(alola_path.read_text());origin=json.loads(origin_path.read_text())
national={p['id']:p for p in origin};base=next(p for p in alola if p['id']==25)
raw=next(p for p in table('pokemon') if p['id']=='10148')
stat_names={p['id']:p['identifier'] for p in table('stats')}
cap_stats={stat_names[p['stat_id']]:int(p['base_stat']) for p in table('pokemon_stats') if p['pokemon_id']=='10148'}
cap={**base,'id':10148,'name':raw['identifier'],'stats':cap_stats,'sprite':'assets/10148.png','next':None,'nextOptions':[],'cap':True}
for path,data,extra in [(alola_path,alola,[national[151],cap]),(origin_path,origin,[cap])]:
    records={p['id']:p for p in data}
    for p in extra:records[p['id']]=p
    path.write_text(json.dumps(sorted(records.values(),key=lambda p:p['id']),separators=(',',':')))
(root/'public/assets/all-pokemon.json').write_text(origin_path.read_text())
regions_path=root/'public/assets/regions.json';regions=json.loads(regions_path.read_text())
next(r for r in regions if r['id']=='alola')['pokemonIds']=sorted({p['id'] for p in alola}|{151,10148})
regions_path.write_text(json.dumps(regions,separators=(',',':')))
js=root/'public/regions.js';text=js.read_text();suffix=text[text.index('\nexport const TRUE_ENDLESS'):]
js.write_text('export const REGIONS='+json.dumps(regions,separators=(',',':'))+';'+suffix)
cap_sprite=root/'public/assets/10148.png'
if not cap_sprite.exists():subprocess.run(['curl','-fsSL','--retry','2','--max-time','30','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10148.png','-o',str(cap_sprite)],check=True)
assert cap_sprite.read_bytes().startswith(b'\x89PNG\r\n\x1a\n')
def download(c):
    path=root/'public/assets/items'/(c['icon']+'.png')
    if not path.exists():subprocess.run(['curl','-fsSL','--retry','2','--max-time','30',f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/{c["icon"]}.png','-o',str(path)],check=True)
    assert path.read_bytes().startswith(b'\x89PNG\r\n\x1a\n'),path
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:list(pool.map(download,catalog))
print(f'Built {len(catalog)} Z-Crystals and official item sprites.')
