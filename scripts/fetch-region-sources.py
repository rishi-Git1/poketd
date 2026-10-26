import pathlib,concurrent.futures,subprocess
root=pathlib.Path('scripts/pokeapi-csv');root.mkdir(exist_ok=True)
files=['pokemon_stats','stats','pokemon_types','types','pokemon_species','pokemon_dex_numbers','pokedexes','pokemon','pokemon_evolution']
def get(name):
 p=root/(name+'.csv')
 if not p.exists():subprocess.run(['curl','-fsSL','--retry','2','--max-time','40',f'https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/{name}.csv','-o',str(p)],check=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:list(ex.map(get,files))
print('Official PokéAPI CSV snapshots ready.')
