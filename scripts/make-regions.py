import json,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
trainers=json.loads((root/'scripts/trainer-rosters.json').read_text())
kanto=[('Brock',[74,95]),('Misty',[120,121]),('Lt. Surge',[100,25,26]),('Erika',[71,114,45]),('Koga',[109,109,89,110]),('Sabrina',[64,122,49,65]),('Blaine',[58,77,78,59]),('Giovanni',[111,51,31,34,112]),('Lorelei',[87,91,80,124,131]),('Bruno',[95,107,106,95,68]),('Agatha',[94,42,93,24,94]),('Lance',[130,148,148,142,149]),('Blue',[18,65,112,103,130,6])]
base=[
 ('kanto','Kanto','Red / Blue',[2],[1,4,7],151,151,'Mew','#cf3f47',kanto),
 ('johto','Johto','Gold / Silver',[3],[152,155,158],150,250,'Ho-Oh','#ba8a3c',None),
 ('hoenn','Hoenn','Ruby / Sapphire',[4],[252,255,258],150,10079,'Mega Rayquaza','#319975',None),
 ('sinnoh','Sinnoh','Platinum / Hisui',[6,30],[387,390,393],150,493,'Arceus','#6582b9',None),
 ('unova','Unova','Black 2 / White 2',[9],[495,498,501],150,646,'Kyurem','#647b8b',None),
 ('kalos','Kalos','X / Y',[12,13,14],[650,653,656],150,10301,'Mega Zygarde','#a44b71',None),
 ('alola','Alola','Ultra Sun / Ultra Moon',[21],[722,725,728],150,10157,'Ultra Necrozma','#7655a5',None),
 ('galar','Galar','Sword • Champion Cup',[27],[810,813,816],150,10190,'Eternamax Eternatus','#745b9d',None),
 ('paldea','Paldea','Scarlet / Violet',[31],[906,909,912],150,10277,'Stellar Terapagos','#3c9dba',None)]
games={'johto':'gold-silver','hoenn':'ruby-sapphire','sinnoh':'platinum','unova':'black-white-2','kalos':'x-y','paldea':'scarlet-violet'}
regions=[]
for id,name,edition,dex,starters,rounds,final,finalName,color,teams in base:
 if id in games:
  rows=trainers[games[id]]
  rows=[t for t in rows if any(f'id="gym-{i}"' in t['title'] for i in range(1,9)) or 'id="elite4-' in t['title'] or 'id="champion-' in t['title']]
  teams=[]
  for i,t in enumerate(rows):
   count= len(t['ids'])
   if id=='sinnoh':count=[3,3,3,3,3,3,4,4,5,5,5,5,6][i]
   if id=='unova' and i>=8:count=4 if i<12 else 6
   if id=='paldea':count=[3,3,4,3,3,4,4,4,5,5,5,5,6][i]
   teams.append((t['name'],t['ids'][:count]))
 if id=='galar':
  teams=[('Milo',[829,830]),('Nessa',[118,846,834]),('Kabu',[38,59,851]),('Bea',[237,675,865,68]),('Opal',[10167,303,468,869]),('Gordie',[689,213,874,839]),('Piers',[560,687,435,862]),('Raihan',[526,330,844,884]),('Marnie',[510,560,454,877,861]),('Hop',[832,143,823,871,818]),('Bede',[303,282,10163,858]),('Raihan',[324,706,776,330,884]),('Leon',[681,887,612,537,815,6])]
 if id=='alola':
  # Eight USUM trial Totems, followed by custom Ultra Beast gauntlets.
  teams=[('Totem Gumshoos',[10121]),('Totem Araquanid',[10153]),('Totem Marowak',[10149]),('Totem Lurantis',[10128]),('Totem Togedemaru',[10154]),('Totem Mimikyu',[10144]),('Totem Kommo-o',[10146]),('Totem Ribombee',[10150]),('Nihilego',[793]),('Buzzwole & Pheromosa',[794,795]),('Xurkitree & Kartana',[796,798]),('Celesteela & Guzzlord',[797,799]),('Ultra Beast Gauntlet',[804,805,806])]
 bosses=[]
 for i,(trainer,team) in enumerate(teams):
  wave=(i+1)*15 if i<8 else 125+(i-8)*5
  tier=f'GYM {i+1}' if i<8 else 'CHAMPION' if i==12 else f'CHAMPION CUP {i-7}' if id=='galar' else f'ELITE FOUR {i-7}'
  if id=='alola':tier=f'TOTEM {i+1}' if i<8 else 'ULTRA GAUNTLET' if i==12 else f'ULTRA BEAST {i-7}'
  bosses.append({'wave':wave,'name':trainer,'team':team,'tier':tier,'boost':1.25 if i<8 else 1.6 if i==12 else 1.45})
 if id=='kanto':bosses.append({'wave':150,'name':'Mewtwo','team':[150],'tier':'LEGENDARY','boost':4})
 bosses.append({'wave':rounds,'name':finalName,'team':[final],'tier':'FINAL ENCOUNTER','boost':8})
 regions.append({'id':id,'name':name,'edition':edition,'dexIds':dex,'starters':starters,'rounds':rounds,'finale':final,'finaleName':finalName,'color':color,'bosses':bosses})
(root/'public/assets/regions.json').write_text(json.dumps(regions,separators=(',',':')))
print('Defined',len(regions),'regions,',sum(len(r['bosses']) for r in regions),'boss battles.')
