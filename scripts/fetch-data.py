import json,subprocess,concurrent.futures,pathlib,time
root=pathlib.Path('public/assets')
# Stage and successor for this first-version roster; canonical stats/types/sprites come from PokéAPI.
lines=[[1,2,3],[4,5,6],[7,8,9],[10,11,12],[13,14,15],[16,17,18],[19,20],[21,22],[23,24],[25,26],[27,28],[29,30,31],[32,33,34],[35,36],[37,38],[39,40],[41,42],[43,44,45],[46,47],[48,49],[50,51],[52,53],[54,55],[56,57],[58,59],[60,61,62],[63,64,65],[66,67,68],[69,70,71],[72,73],[74,75,76],[77,78],[79,80],[81,82],[83],[84,85],[86,87],[88,89],[90,91],[92,93,94],[95],[96,97],[98,99],[100,101],[102,103],[104,105],[106],[107],[108],[109,110],[111,112],[113],[114],[115],[116,117],[118,119],[120,121],[122],[123],[124],[125],[126],[127],[128],[129,130],[131],[132],[133,134],[133,135],[133,136],[137],[138,139],[140,141],[142],[143],[144],[145],[146],[147,148,149],[150],[151]]
existing={p['id']:p for p in json.loads((root/'pokemon.json').read_text())}
metadata={}
for line in lines:
 for i,id in enumerate(line):
  meta=metadata.setdefault(id,{'stage':i+1,'nextOptions':[]})
  if i+1<len(line):meta['nextOptions'].append(line[i+1])
def fetch(item):
 id,meta=item
 if id in existing and (root/f'{id}.png').exists():
  return {**existing[id],**meta,'next':next(iter(meta['nextOptions']),None)}
 path=root/f'{id}.json'
 for attempt in range(3):
  try:
   d=json.loads(subprocess.check_output(['curl','-fsSL','--max-time','25',f'https://pokeapi.co/api/v2/pokemon/{id}/']))
   sprite=d['sprites']['front_default']
   (root/f'{id}.png').write_bytes(subprocess.check_output(['curl','-fsSL','--max-time','25',sprite]))
   return {'id':id,'name':d['name'],'types':[t['type']['name'] for t in d['types']],'stats':{s['stat']['name']:s['base_stat'] for s in d['stats']},**meta,'next':next(iter(meta['nextOptions']),None),'sprite':f'assets/{id}.png'}
  except Exception as e:
   if attempt==2:raise
items=sorted(metadata.items())
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:data=list(pool.map(fetch,items))
(root/'pokemon.json').write_text(json.dumps(data,separators=(',',':')))
print(f'Fetched {len(data)} Pokémon with real stats and sprites.')
