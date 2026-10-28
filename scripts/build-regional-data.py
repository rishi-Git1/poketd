import csv,json,pathlib,subprocess,concurrent.futures,time
root=pathlib.Path(__file__).resolve().parents[1];assets=root/'public/assets';db=root/'scripts/pokeapi-csv'
def rows(name):return list(csv.DictReader((db/(name+'.csv')).open()))
pokemon={int(p['id']):p for p in rows('pokemon')};species={int(p['id']):p for p in rows('pokemon_species')};types={p['id']:p['identifier'] for p in rows('types')};statsnames={p['id']:p['identifier'] for p in rows('stats')};stats={};ptypes={}
for s in rows('pokemon_stats'):stats.setdefault(int(s['pokemon_id']),{})[statsnames[s['stat_id']]]=int(s['base_stat'])
for t in rows('pokemon_types'):ptypes.setdefault(int(t['pokemon_id']),[]).append((int(t['slot']),types[t['type_id']]))
dex={}
for d in rows('pokemon_dex_numbers'):dex.setdefault(int(d['pokedex_id']),set()).add(int(d['species_id']))
regions=json.loads((assets/'regions.json').read_text());allids=set();regionalids={}
galarforms=[10161,10162,10163,10166,10167,10168,10173,10174,10175,10176,10177,10179,10180]
hisuiforms=[int(p['id']) for p in pokemon.values() if p['identifier'].endswith('-hisui')]+[10245,10246,10247,10248,10249]
alolaforms=[int(p['id']) for p in pokemon.values() if p['identifier'].endswith('-alola') and '-totem-' not in p['identifier']]
totemforms=[int(p['id']) for p in pokemon.values() if 'totem' in p['identifier']]
gmaxbases={int(p['id']):int(p['species_id']) for p in pokemon.values() if p['identifier'].endswith('-gmax')}
# Match alternate forms exactly: Galarian Meowth has no Gigantamax form.
gmaxbases.update({10228:10184,10227:10191})
for r in regions:
 ids=set().union(*(dex[d] for d in r['dexIds']));r['dexCount']=len(ids)
 if r['id']=='sinnoh':ids.update(hisuiforms)
 if r['id']=='alola':ids.update(alolaforms);ids.update(totemforms);ids.update([803,804,805,806,800])
 if r['id']=='galar':
  ids.update(galarforms);ids.update(gmaxbases);ids.update(gmaxbases.values())
  # Include DLC/transfer partners and their normal evolution lines so every G-Max is reachable.
  for base in list(gmaxbases.values()):
   parent=int(species[int(pokemon[base]['species_id'])]['evolves_from_species_id'] or 0)
   while parent:
    ids.add(parent);parent=int(species[parent]['evolves_from_species_id'] or 0)
 if r['id']=='paldea':ids.update([10250,10251,10252,10253,1017,10273,10274,10275,10276])
 if r['id'] in ['hoenn','kalos','alola']:
  ids.update(int(p['id']) for p in pokemon.values() if '-mega' in p['identifier'] and int(p['species_id']) in ids)
 ids.update(r['starters']);ids.add(r['finale'])
 for b in r['bosses']:ids.update(b['team'])
 # Include base species for special-form finales, available as rare premium partners.
 if r['id']=='galar':ids.add(890)
 if r['id']=='paldea':ids.add(1024)
 if r['id']=='hoenn':ids.add(384)
 if r['id']=='kalos':ids.add(718)
 r['pokemonIds']=sorted(ids);allids.update(ids);regionalids[r['id']]=ids
records={}
for id in sorted(allids):
 p=pokemon[id];sp=species[int(p['species_id'])]
 records[id]={'id':id,'speciesId':int(p['species_id']),'name':p['identifier'],'types':[v for _,v in sorted(ptypes[id])],'stats':stats[id],'parentSpecies':int(sp['evolves_from_species_id'] or 0),'legendary':sp['is_legendary']=='1' or sp['is_mythical']=='1','bossOnly':id in [10157,10190,10273,10274,10275,10276,10277] or id in totemforms or id in gmaxbases or '-mega' in p['identifier'],'sprite':f'assets/{id}.png','stage':1,'next':None,'nextOptions':[]}
for id,p in records.items():
 if '-mega' in p['name']:
  p['mega']=True;p['megaFrom']=p['speciesId'];p['moveBaseId']=p['speciesId']
 if id in [10273,10274,10275,10276,10277]:p['transformOnly']=True
 if id in gmaxbases:
  p.update(gigantamax=True,gmaxFrom=gmaxbases[id],moveBaseId=gmaxbases[id],transformOnly=True,evolutionLocked=True)
 if id in totemforms:p.update(totem=True,moveBaseId=p['speciesId'])
# Form-specific evolution connections; never evolve a normal form into a regional-only child.
formchildren={10161:[863],10162:[10163],10163:[],10166:[865],10167:[],10168:[866],10173:[864],10174:[10175],10175:[862],10176:[10177],10177:[],10179:[867],10180:[],10250:[],10251:[],10252:[],10253:[980],848:[849,10184],891:[892,10191],10184:[],10191:[],10229:[10230],10231:[10232],10234:[904],10235:[903],10238:[10239],10241:[10242],10247:[902,10248],10091:[10092],10101:[10102],10103:[10104],10105:[10106],10107:[10108],10109:[10110],10110:[10111],10112:[10113]}
regionalchildren={863,865,866,864,862,867,980,902,903,904}
formbranches={25:[10100],102:[10114],104:[10115],156:[10233],502:[10236],548:[10237],627:[10240],704:[10241],712:[10243],723:[10244]}
for id,p in records.items():
 if id in formchildren:p['nextOptions']=[n for n in formchildren[id] if n in records]
 elif id>=10000:p['nextOptions']=[]
 else:p['nextOptions']=[n for n,q in records.items() if n<10000 and q['parentSpecies']==p['speciesId'] and n not in regionalchildren]
 if id==109 and 10167 in records:p['nextOptions'].append(10167)
 if id==439 and 10168 in records:p['nextOptions'].append(10168)
 p['nextOptions'].extend(n for n in formbranches.get(id,[]) if n in records)
 p['next']=next(iter(p['nextOptions']),None)
# Preserve the original Kanto snapshot for compatibility; app will load per-region files.
(assets/'regions.json').write_text(json.dumps(regions,separators=(',',':')))
(root/'public/regions.js').write_text('export const REGIONS = '+json.dumps(regions,separators=(',',':'))+';\n'+'export const TRUE_ENDLESS={id:\'origin\',name:\'Hall of Origin\',edition:\'National Pokédex\',dexCount:1025,starters:[1,4,7],rounds:Infinity,finale:493,finaleName:\'Arceus\',color:\'#c0a050\',bosses:[]};\nexport function getRegion(id="kanto"){const r=id===\'origin\'?TRUE_ENDLESS:REGIONS.find(r=>r.id===id);if(!r)throw Error("Unknown region: "+id);return r}\n')
(assets/'all-pokemon.json').write_text(json.dumps(list(records.values()),separators=(',',':')))
(assets/'regions').mkdir(exist_ok=True)
for r in regions:
 ids=regionalids[r['id']];data=[]
 for id in sorted(ids):
  p={**records[id]};p['nextOptions']=[n for n in p['nextOptions'] if n in ids and not records[n]['bossOnly']];p['next']=next(iter(p['nextOptions']),None);data.append(p)
 byid={p['id']:p for p in data};parents={}
 for p in data:
  for child in p['nextOptions']:parents.setdefault(child,[]).append(p['id'])
 def stage(id,path=()):
  if id in path:raise ValueError('Evolution cycle')
  return min(3,1+max((stage(parent,path+(id,)) for parent in parents.get(id,[])),default=0))
 for p in data:p['stage']=stage(p['id'])
 for p in data:
  if p.get('mega') and p['megaFrom'] in byid:p['stage']=byid[p['megaFrom']]['stage']
  if p.get('gigantamax') and p['gmaxFrom'] in byid:p['stage']=byid[p['gmaxFrom']]['stage']
  if p.get('totem') and p['speciesId'] in byid:p['stage']=byid[p['speciesId']]['stage']
  if p['id'] in [10273,10274,10275,10276,10277]:p['stage']=1
  if p['id']==10277:p['teraType']='stellar'
 (assets/'regions'/f"{r['id']}.json").write_text(json.dumps(data,separators=(',',':')))
def sprite(id):
 path=assets/f'{id}.png'
 if path.exists() and path.stat().st_size>50:return True
 urls=[f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png',f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png']
 for url in urls:
  for attempt in range(2):
   result=subprocess.run(['curl','-fsSL','--max-time','25',url,'-o',str(path)],capture_output=True)
   if result.returncode==0 and path.read_bytes().startswith(b'\x89PNG'):return True
 raise RuntimeError(f'Missing sprite {id}')
print(f'Built {len(records)} unique Pokémon/form records. Downloading sprites...',flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
 for i,result in enumerate(ex.map(sprite,sorted(records)),1):
  if i%100==0:print(f'Sprites checked: {i}/{len(records)}',flush=True)
print('All regional sprites ready.',flush=True)

subprocess.run(['python3',str(root/'scripts/build-origin-data.py')],check=True)
