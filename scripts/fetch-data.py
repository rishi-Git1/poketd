import json,subprocess,concurrent.futures,pathlib,time
root=pathlib.Path('public/assets')
# Stage and successor for this first-version roster; canonical stats/types/sprites come from PokéAPI.
lines=[[1,2,3],[4,5,6],[7,8,9],[10,11,12],[13,14,15],[16,17,18],[19,20],[25,26],[27,28],[37,38],[41,42],[43,44,45],[63,64,65],[74,75,76],[92,93,94],[133,134],[147,148,149]]
def fetch(item):
 id,stage,nxt=item
 path=root/f'{id}.json'
 for attempt in range(3):
  try:
   d=json.loads(subprocess.check_output(['curl','-fsSL','--max-time','25',f'https://pokeapi.co/api/v2/pokemon/{id}/']))
   sprite=d['sprites']['front_default']
   (root/f'{id}.png').write_bytes(subprocess.check_output(['curl','-fsSL','--max-time','25',sprite]))
   return {'id':id,'name':d['name'],'types':[t['type']['name'] for t in d['types']],'stats':{s['stat']['name']:s['base_stat'] for s in d['stats']},'stage':stage,'next':nxt,'sprite':f'assets/{id}.png'}
  except Exception as e:
   if attempt==2:raise
items=[(id,i+1,line[i+1] if i+1<len(line) else None) for line in lines for i,id in enumerate(line)]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:data=list(pool.map(fetch,items))
(root/'pokemon.json').write_text(json.dumps(data,separators=(',',':')))
print(f'Fetched {len(data)} Pokémon with real stats and sprites.')
