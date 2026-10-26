# Poké Bastion — Version 09

A browser tower-defense roguelike with eight **Story-based** regional campaigns. Choose a region when the game opens, then select one of its three starters. Defend a central bastion, bank three-card rewards, evolve your party, conquer the region's League and defeat its legendary finale.

## Regional stories

| Region | Regional Pokédex | Campaign basis | Champion | Finale | Ends at |
| --- | ---: | --- | --- | --- | ---: |
| Kanto | 151 | Red / Blue | Blue | Mew (Mewtwo at 150) | 151 |
| Johto | 251 | Gold / Silver | Lance | Ho-Oh | 150 |
| Hoenn | 202 | Ruby / Sapphire | Steven | Rayquaza | 150 |
| Sinnoh | 210 | Platinum | Cynthia | Arceus | 150 |
| Unova | 301 | Black 2 / White 2 | Iris | Kyurem | 150 |
| Kalos | 457 | X / Y, combined Central/Coastal/Mountain dexes | Diantha | Yveltal | 150 |
| Galar | 400 | Sword, adapted Champion Cup bracket | Leon | Eternamax Eternatus | 150 |
| Paldea | 400 | Scarlet / Violet | Geeta | Stellar Terapagos | 150 |

Alola has no selectable campaign yet. Regional Pokédexes contain overlapping species, including Pokémon originally introduced in other regions. These are actual regional dex lists from PokéAPI, not national-generation ID slices. Required finale exceptions are added: Arceus for Sinnoh; base and Stellar Terapagos for Paldea; Eternamax Eternatus for Galar. Relevant Galarian and Paldean forms are included alongside base species. The displayed dex count refers to the official regional species list, excluding additional forms/finale exceptions.

The complete pack contains **968 distinct Pokémon/form records with local sprites**, including per-region evolution paths and legendary/mythical flags. Kanto retains its original three Eevee branches; later regions gain additional branches when those evolutions belong to their dex. Regional forms have their own evolution connections, such as Galarian Meowth → Perrserker and Paldean Wooper → Clodsire.

The REGIONS button opens the selector again. Cancel returns to the current story; choosing another region starts a fresh run. New story at an ending restarts the same region; Choose a region returns to the selector. Best rounds are saved separately for each region on this device. Active runs are not saved across reloads. Legacy Kanto best scores are still recognized.

## Run locally

Requires Node.js 20+ and Python for the example local server. No npm dependencies.

```sh
npm run build
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. The game must be served over HTTP rather than opening index.html with file://.

## Deploy on Render

1. Unzip the project and push its contents to a GitHub repository, with package.json and render.yaml at its root.
2. Create a Render **Static Site**, connect the repository, and select the branch.
3. Build Command: `npm run build`.
4. Publish Directory: `dist`.
5. Deploy. No API keys or environment variables are required.

Alternatively create a Render Blueprint using render.yaml. If placing this folder inside a larger repository, set Render's Root Directory to this folder.

## Playing and controls

- Choose a region, then a starter. Your party attacks automatically.
- Click a card or press 1 / 2 / 3 to select one reward from the oldest banked set.
- Space pauses, Enter starts a ready wave, and the speed button cycles 1× / 2× / 5×.
- AUTO ON starts the next wave immediately with no timer. Every cleared wave banks its three-card reward set; rewards and optional premium trades never force an inter-wave pause.
- Cards apply immediately, including during combat. Unused sets remain banked. If a saved evolution/recruit option becomes impossible after party changes, only that option is replaced with a valid tower buff.
- Up to six party members. Evolution and new recruits are drawn only from the selected region's playable roster.
- Damage persists between waves. Repair cards heal the bastion.
- UPGRADES beside the party shows current reward stacks and each partner's combined damage multiplier.
- Opening help or inventory pauses active combat. Opening a premium trade does not. Leaving the tab pauses battle.
- The field guide shows the current regional boss schedule and animated previews of all regional final-form moves, including the requested finale forms.

## Campaign and bosses

Every region has eight gyms at rounds 15, 30, 45, 60, 75, 90, 105 and 120. League battles follow at 125, 130, 135 and 140, the champion at 145, and the requested regional finale at 150. Kanto uniquely continues to Mew at 151 after Mewtwo at 150.

Galar does not have an Elite Four. Its four late League slots are an adapted Champion Cup bracket: Marnie, Hop, Bede and Raihan, followed by Leon. Its eight gym leaders use the Sword lineup (Bea and Gordie). Blue and Leon's parties counter the original player starter; Hop uses the weaker starter. These choices preserve the requested round formula while labeling Galar's structure accurately.

Trainer species rosters follow the selected game's initial battles, rather than postgame rematches. Species, stats and available signature effects are modeled; main-series mechanics such as held items, abilities, Terastallization, Mega Evolution, ordinary Dynamax, and exact move learnsets are not simulated. The explicitly requested Eternamax Eternatus (`10190`) and Stellar Terapagos (`10277`) are separate forms with their real PokéAPI stats and sprites. Those two battle-only transformations cannot appear as ordinary enemies, recruits or premium trades. Their base forms remain available as rare regional partners.

Boss Pokémon have a gold aura and a trainer-team banner. They remain near the bastion and attack every 1.6 game seconds until defeated; a boss wave clears only when its entire team is defeated. HP, physical/special defense and impact damage multiply the normal same-round stats by 1.25 for gyms, 1.45 for League battles, 1.6 for champions, 4 for Kanto's Mewtwo, and 8 for the final regional encounter.

Defeating the final boss opens the regional Hall of Fame screen, showing the champion party, final HP, enemies defeated, upgrades kept, and exact round total. Auto stops. The wave-start guard prevents any additional round beyond that region's story limit, even with banked rewards present.

## Wave pacing and tower growth

- Enemy count: `3 + 2 * wave` through round 5; then `13 + 3 * (wave - 5)`.
- Rounds 1–3 use groups of up to three, with 0.36 seconds between group members and 3.2 seconds between group starts. Rounds 4–50 use 2.4 seconds between starts. Random jitter is up to 0.2 seconds.
- From round 51 onward, levels arrive in five balanced batches of about **20%**, at 0 / 3 / 6 / 9 / 12 game seconds. Thus 150 enemies arrive in five groups of 30. Uneven totals preserve all enemies; small boss teams use fewer groups. Solo finales spawn once at time zero.
- Early waves limit enemy base-stat totals, soften HP/defense/impact and reduce movement speed. Stage 2 enemies unlock at round 4 and stage 3 at round 9.
- After every tenth cleared round, range and max HP multiply by 1.05; current HP gains the new capacity. Effective defense also grows: `(1 + armor) *= 1.05`, so growth works even from zero armor. Each milestone applies only once.

## Upgrades, damage and final forms

Damage cards compound with repeated copies and every matching category. Global cards multiply damage by 1.18; each type/stage card multiplies its category by 1.35. Both Pokémon types count. Two stage cards plus a matching type card give `1.35^3 = 2.460375×` damage. A stage bonus applies to the Pokémon's current stage; collected bonuses remain stored after evolution.

All regional final forms have signature attacks based on type or species overrides, including beams, flame/water cones, chaining lightning, explosions, shockwaves, slashes, volleys and vortices. Generic profiles cover all 18 types. Regional finales have named profiles: Sacred Fire, Dragon Ascent, Judgment, Glaciate, Oblivion Wing, Eternabeam and Tera Starstorm. These are tower-defense adaptations, not canonical battle animations or learnset rules.

Final-form move power is typically 2.16–3.42× base attack damage, with larger overrides for some regional finales. Final forms have 20% shorter attack cooldowns. Visual effects retain real-time duration for readability at 5× speed; combat calculations follow game speed. Move type determines effectiveness against both enemy types, including immunities. The attacker uses its larger attacking stat and the corresponding enemy defense.

Core formulas are in public/engine.js and public/attacks.js. Enemy HP scales as `(base HP * 0.53 + 9) * 1.115^(wave - 1)`, with the opening ease and boss factors applied. Normal tower armor reduces impact by division through `1 + armor`.

## Premium trades

At every 25th cleared non-final round, an independent premium opportunity is banked. Click PREMIUM TRADES, choose Pokémon or upgrade, select the exact existing slot/card to replace, and choose one of three stronger replacements. Later/Escape preserves the trade; Cancel skips only that opportunity without changing the party or upgrades. Combat and Auto continue during the trade.

Pokémon replacements are fully evolved regional partners and include a randomly selected available legendary/mythical when possible. Duplicate party members and battle-only finale transformations are excluded. Buff replacements are +50% global damage, +80% matching type/stage damage, +40 armor points, or +200 max HP with 250 HP healing. An upgrade trade removes exactly one existing buff copy. Removing health/armor reverses that card's accumulated tower-growth contribution while preserving other milestones.

## Data and regeneration

Bundled data comes from the official PokéAPI repository's CSV snapshots and sprite repository. Selecting a region loads its local JSON immediately; the browser refreshes stats/types through PokéAPI with a seven-day local cache and three concurrent requests. Failed requests preserve bundled data. No custom backend or account is required.

To regenerate the source snapshot (Python 3 and curl required):

```sh
python3 scripts/fetch-region-sources.py
python3 scripts/make-regions.py
python3 scripts/build-regional-data.py
npm run build
```

- public/regions.js and assets/regions.json: region settings, regional dex membership, starters and boss schedules.
- assets/regions/*.json: per-region stats, types, evolution graphs and form metadata.
- assets/all-pokemon.json: shared data reference used by automated checks.
- scripts/pokeapi-csv/: official PokéAPI metadata snapshots.
- scripts/trainer-rosters.json and make-regions.py: chosen trainer-roster facts and campaign definitions.
- scripts/fetch-data.py: retained legacy Kanto-only fetcher; use the regional commands above for this version.

Sources:
- https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv
- https://github.com/PokeAPI/sprites
- https://pokeapi.co/docs/v2
- https://pokemondb.net/red-blue/gymleaders-elitefour
- https://pokemondb.net/gold-silver/gymleaders-elitefour
- https://pokemondb.net/ruby-sapphire/gymleaders-elitefour
- https://pokemondb.net/platinum/gymleaders-elitefour
- https://pokemondb.net/black-white-2/gymleaders-elitefour
- https://pokemondb.net/x-y/gymleaders-elitefour
- https://pokemondb.net/scarlet-violet/gymleaders-elitefour
- https://www.serebii.net/swordshield/gyms.shtml
- https://www.serebii.net/swordshield/championcup.shtml

## Validation

Run `npm test` for **59 checks**. They cover all eight regional starters/endings, exact round caps, all 113 boss encounters, requested special-form IDs and stats, all 968 local sprite files, regional roster isolation, evolution links, regional forms, region switching and best-record isolation, reward stacking, Auto flow, premium swaps, batch sizes, attack rendering and story completion with banked choices. Controller tests use an in-memory DOM; they do not constitute eight complete 150-round playthroughs. Long-run balance remains an iterative playtesting task.

The project uses a bundled VT323 pixel font with its SIL Open Font License in assets. Pokémon and character names are trademarks of Nintendo, Game Freak and Creatures. This is an unofficial fan prototype, unaffiliated with those companies.

## Version 0.8.0 patch

Apply Poke_Bastion_V8_Patch.zip over the Version 0.7.0 project root, preserving its public/, tests/, and dist/ paths; allow file replacements. No sprite or regional data download is needed. Render rebuilds dist from public with npm run build. For direct static uploads, updated dist files are included. Reload the browser after deploying.

Every reward earned after round 50 guarantees at least one advanced tactic. Previously banked rewards retain their original choices. Split Volley adds one target per copy, dividing each attack's damage by the total target capacity even if fewer targets exist. Signature attacks retain their normal geometry for each selected target; overlapping areas can hit the same enemy. Other tactics grant shorter cooldowns, longer range, temporary movement slows (bosses resist half), defense penetration, bonus damage below 35% HP, and capped tower healing on defeats. Repeated copies stack, inventory displays their combined effects, and premium trades can replace or grant tactics. Premium tactic cards grant two stacks, excluding Split Volley. Slows refresh, rather than extending or multiplying themselves on each hit; slow copies multiply their movement reduction.

All bosses in all regions gain 20% HP, physical defense, special defense, movement speed, and impact damage relative to Version 0.7.0. Existing wave scaling and tier boosts remain. These separate increases together raise combat difficulty by more than 20% overall; full campaign balance still needs playtesting.

## Version 0.9.0 animation patch

Apply after Version 0.8.0 by merging the patch contents into the project root. All 18 move types have distinct canvas geometry, rather than a shared recolored beam or burst. Fire and electric keep their recognizable flame and lightning effects. Other types now have water streams and splashes, grass vines and leaves (petals for Petal Blizzard), normal impact stars, poison sludge, bug blades or needle swarms, flying gusts and feathers, ground fissures, falling rocks, psychic rings, ghost wisps, dragon helices and jaws, ice crystals, fighting fists, fairy moons and glints, steel plates and sparks, and dark eclipse effects. Applies to all regions, battle signatures and the move preview. Basic pre-evolution projectile orbs remain. Damage, cooldown, targeting geometry and Version 0.8.0 tactics are unchanged. Canvas animation is procedural; no new image downloads are required.
