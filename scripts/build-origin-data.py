"""Build the complete National Dex for True Endless using bundled PokéAPI CSVs.
Regional snapshots remain unchanged. Run after build-regional-data.py.
"""
import csv,json,pathlib,subprocess,concurrent.futures
root=pathlib.Path(__file__).resolve().parents[1];assets=root/'public/assets';db=root/'scripts/pokeapi-csv'
def rows(name):return list(csv.DictReader((db/(name+'.csv')).open()))
ps={int(p['id']):p for p in rows('pokemon')};species={int(p['id']):p for p in rows('pokemon_species')};stats={};types={};names={p['id']:p['identifier'] for p in rows('stats')};tnames={p['id']:p['identifier'] for p in rows('types')}
for s in rows('pokemon_stats'):stats.setdefault(int(s['pokemon_id']),{})[names[s['stat_id']]]=int(s['base_stat'])
for t in rows('pokemon_types'):types.setdefault(int(t['pokemon_id']),[]).append((int(t['slot']),tnames[t['type_id']]))
records={}
for path in sorted((assets/'regions').glob('*.json')):
 if path.stem=='origin':continue
 for p in json.loads(path.read_text()):
  if p['id'] in records:p={**p,'nextOptions':sorted(set(p['nextOptions'])|set(records[p['id']]['nextOptions']))}
  records[p['id']]=p
for sid,s in species.items():
 if sid in records:continue
 p=ps[sid]
 records[sid]={'id':sid,'speciesId':sid,'name':p['identifier'],'types':[t for _,t in sorted(types[sid])],'stats':stats[sid],'parentSpecies':int(s['evolves_from_species_id'] or 0),'bossOnly':False,'sprite':f'assets/{sid}.png','stage':1,'next':None,'nextOptions':[]}
for p in records.values():
 sp=species[p['speciesId']];p['legendary']=sp['is_legendary']=='1';p['mythical']=sp['is_mythical']=='1';p['ultraBeast']=p['speciesId'] in [793,794,795,796,797,798,799,803,804,805,806]
 # Missing DLC evolutions join the same ordinary evolution lines.
 if p['id']<10000:
  p['nextOptions']=sorted(set(p['nextOptions'])|{q['id'] for q in records.values() if q['id']<10000 and q.get('parentSpecies')==p['speciesId'] and q['id'] in [1011,1013,1018,1019]})
 p['nextOptions']=[i for i in p['nextOptions'] if i in records and not records[i]['bossOnly']];p['next']=next(iter(p['nextOptions']),None)
parents={}
for p in records.values():
 for child in p['nextOptions']:parents.setdefault(child,[]).append(p['id'])
def stage(id,path=()):
 if id in path:raise ValueError('Evolution cycle')
 return min(3,1+max((stage(i,path+(id,)) for i in parents.get(id,[])),default=0))
for p in records.values():p['stage']=stage(p['id'])
for p in records.values():
 base=p.get('megaFrom') or p.get('gmaxFrom') or (p['speciesId'] if p.get('totem') else None)
 if base in records:p['stage']=records[base]['stage']
 if p.get('mega') or p.get('gigantamax'):p['personalPower']=2
out=sorted(records.values(),key=lambda p:p['id'])
for path in [assets/'regions/origin.json',assets/'all-pokemon.json']:path.write_text(json.dumps(out,separators=(',',':')))
def sprite(p):
 path=assets/f"{p['id']}.png"
 if path.exists() and path.read_bytes().startswith(b'\x89PNG'):return
 subprocess.run(['curl','-fsSL','--retry','2','--max-time','25',f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{p['id']}.png",'-o',str(path)],check=True,capture_output=True)
 if not path.read_bytes().startswith(b'\x89PNG'):raise ValueError('Invalid sprite')
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:list(ex.map(sprite,out))
print(f"True Endless: {len({p['speciesId'] for p in out})} species, {len(out)} records, {sum(p['legendary'] or p['mythical'] or p['ultraBeast'] for p in out)} boss candidates (before form filtering).")
