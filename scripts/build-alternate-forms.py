"""Add alternate upgrade forms using bundled PokéAPI CSVs and official sprites.
Run after regional/origin builders. Existing regional species lists stay intact.
"""
import csv,json,pathlib,subprocess,concurrent.futures
root=pathlib.Path(__file__).resolve().parents[1];assets=root/'public/assets';db=root/'scripts/pokeapi-csv'
def rows(name):return list(csv.DictReader((db/(name+'.csv')).open()))
pokemon={int(p['id']):p for p in rows('pokemon')};species={int(p['id']):p for p in rows('pokemon_species')}
names={p['id']:p['identifier'] for p in rows('stats')};tnames={p['id']:p['identifier'] for p in rows('types')};stats={};types={}
for s in rows('pokemon_stats'):stats.setdefault(int(s['pokemon_id']),{})[names[s['stat_id']]]=int(s['base_stat'])
for t in rows('pokemon_types'):types.setdefault(int(t['pokemon_id']),[]).append((int(t['slot']),tnames[t['type_id']]))
catalog=json.loads((assets/'form-catalog.json').read_text())
(root/'public/form-catalog.js').write_text('// Canonical item/ability names and one-way roguelike upgrade routes.\nexport const FORM_CATALOG='+json.dumps(catalog,separators=(',',':'))+';\n')
ids={id for family in catalog for route in family['routes'] for id in route['source']+route['targets']}
alternate_ids={id for id in ids if id>=10000 and id!=10177}
sprites=set()
for path in sorted((assets/'regions').glob('*.json')):
    data=json.loads(path.read_text());byid={p['id']:p for p in data};species_ids={p['speciesId'] for p in data}
    for id in sorted(ids):
        raw=pokemon[id];sid=int(raw['species_id'])
        if sid not in species_ids:continue
        if id not in byid:
            sp=species[sid];base=byid.get(sid) or next(p for p in data if p['speciesId']==sid)
            p=dict(id=id,speciesId=sid,name=raw['identifier'],types=[t for _,t in sorted(types[id])],stats=stats[id],parentSpecies=int(sp['evolves_from_species_id'] or 0),legendary=sp['is_legendary']=='1',mythical=sp['is_mythical']=='1',ultraBeast=False,bossOnly=id>=10000,sprite=f'assets/{id}.png',stage=base['stage'],next=None,nextOptions=[])
            byid[id]=p
        if id==10177:
            # Galarian Standard Mode is the ordinary regional evolution target.
            for flag in ['alternateForm','transformOnly']:byid[id].pop(flag,None)
            byid[id]['bossOnly']=False
        if id in alternate_ids:
            base=byid.get(sid) or next(p for p in byid.values() if p['speciesId']==sid)
            byid[id].update(alternateForm=True,transformOnly=True,bossOnly=True,stage=base['stage'])
        sprites.add((f'{id}.png',f'pokemon/{id}.png'))
    path.write_text(json.dumps(sorted(byid.values(),key=lambda p:p['id']),separators=(',',':')))
    print(path.stem,len(byid),'records',flush=True)
# Actual Pokémon-form IDs are separate from Pokémon-variety IDs. Typed forms
# retain their species ID and live outside the ordinary recruitment/enemy pools.
variants=[]
for f in rows('pokemon_forms'):
    sid=int(f['pokemon_id']);kind=f['form_identifier'];name=f['identifier']
    family='plates' if sid==493 else 'memories' if sid==773 else 'drives' if sid==649 else 'flower-gift' if name=='cherrim-sunshine' else None
    if not family or f['is_default']=='1' or kind=='unknown':continue
    if family in ['plates','memories'] and kind not in tnames.values():continue
    v=dict(speciesId=sid,formKey=name,formName=name,formItem=family,sprite=f'assets/forms/{name}.png')
    if family in ['plates','memories']:v['types']=[kind];v['moveType']=kind
    if family=='drives':v['moveType']={'douse':'water','shock':'electric','burn':'fire','chill':'ice'}[kind]
    variants.append(v);sprites.add((f'forms/{name}.png',f'pokemon/{sid}-{kind}.png'))
(root/'public/type-forms.js').write_text('// PokéAPI Pokémon-form variants; species IDs remain unchanged.\nexport const TYPE_FORMS='+json.dumps(variants,separators=(',',':'))+';\n')
regions=json.loads((assets/'regions.json').read_text())
for r in regions:r['pokemonIds']=[p['id'] for p in json.loads((assets/'regions'/f"{r['id']}.json").read_text())]
(assets/'regions.json').write_text(json.dumps(regions,separators=(',',':')))
p=root/'public/regions.js';s=p.read_text();tail=s[s.index('export const TRUE_ENDLESS'):];p.write_text('export const REGIONS = '+json.dumps(regions,separators=(',',':'))+';\n'+tail)
(assets/'all-pokemon.json').write_bytes((assets/'regions/origin.json').read_bytes())
for family in catalog:
    if family['icon']:sprites.add((f"items/{family['icon']}.png",f"items/{family['icon']}.png"))
sprites.add(('items/everstone.png','items/everstone.png'))
def sprite(pair):
    name,remote=pair;remote={'items/n-solarizer.png':'items/n-solarizer--merge.png','items/n-lunarizer.png':'items/n-lunarizer--merge.png'}.get(remote,remote);path=assets/name;path.parent.mkdir(exist_ok=True)
    if path.exists() and path.read_bytes().startswith(b'\x89PNG'):return
    subprocess.run(['curl','-fsSL','--retry','2','--max-time','25',f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/{remote}','-o',str(path)],capture_output=True,check=True)
    if not path.read_bytes().startswith(b'\x89PNG'):raise ValueError(name)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
    for i,_ in enumerate(ex.map(sprite,sorted(sprites)),1):
        if i%20==0:print('Sprites checked',i,'/',len(sprites),flush=True)
print('Alternate forms and item art ready:',len(alternate_ids),'alternate IDs;',len(variants),'typed/appearance forms.',flush=True)
