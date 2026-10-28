# Poké Bastion — Version 22

A browser tower-defense roguelike with nine regional campaigns and **Classic / Endless** modes. Choose a region when the game opens, choose Classic or Random starters, then select one of three partners. Defend a central bastion, bank three-card rewards, evolve your party, conquer the region's League and defeat its legendary finale.

## Regional stories

| Region | Regional Pokédex | Campaign basis | Champion | Finale | Ends at |
| --- | ---: | --- | --- | --- | ---: |
| Kanto | 151 | Red / Blue | Blue | Mew (Mewtwo at 150) | 151 |
| Johto | 251 | Gold / Silver | Lance | Ho-Oh | 150 |
| Hoenn | 202 | Ruby / Sapphire | Steven | Mega Rayquaza | 150 |
| Sinnoh | 264 | Platinum + Hisui | Cynthia | Arceus | 150 |
| Unova | 301 | Black 2 / White 2 | Iris | Kyurem | 150 |
| Kalos | 457 | X / Y, combined Central/Coastal/Mountain dexes | Diantha | Mega Zygarde | 150 |
| Alola | 403 | Ultra Sun / Ultra Moon | Totems / Ultra Beasts | Ultra Necrozma | 150 |
| Galar | 400 | Sword, adapted Champion Cup bracket | Leon | Eternamax Eternatus | 150 |
| Paldea | 400 | Scarlet / Violet | Geeta | Stellar Terapagos | 150 |

Alola features Totem and Ultra Beast encounters in the Ultra Wormhole. Regional Pokédexes contain overlapping species, including Pokémon originally introduced in other regions. These are actual regional dex lists from PokéAPI, not national-generation ID slices. Required finale exceptions are added: Arceus for Sinnoh; base and Stellar Terapagos for Paldea; Eternamax Eternatus for Galar. Relevant Galarian and Paldean forms are included alongside base species. The displayed dex count refers to the official regional species list, excluding additional forms/finale exceptions.

The complete pack contains **1198 distinct Pokémon/form records with local sprites**, including per-region evolution paths and legendary/mythical flags. Kanto retains its original three Eevee branches; later regions gain additional branches when those evolutions belong to their dex. Regional forms have their own evolution connections, such as Galarian Meowth → Perrserker and Paldean Wooper → Clodsire.

The REGIONS button opens the selector again. Cancel returns to the current story; choosing another region starts a fresh run. New story at an ending restarts the same region; Choose a region returns to the selector. Best rounds are saved separately for each region and Classic/Endless mode on this device. Active runs are not saved across reloads. Legacy Kanto best scores are still recognized.

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

Trainer species rosters follow the selected game's initial battles, rather than postgame rematches. Species, stats and available signature effects are modeled; Held items, ordinary Dynamax and exact move learnsets are not simulated. Mega Evolution is available only in Hoenn/Kalos, and Terastallization only in Paldea, with the explicit tower-defense adaptations documented below. The explicitly requested Eternamax Eternatus (`10190`) and Stellar Terapagos (`10277`) are separate forms with their real PokéAPI stats and sprites. Those two battle-only transformations cannot appear as ordinary enemies, recruits or premium trades. Their base forms remain available as rare regional partners.

Boss Pokémon have a gold aura and a trainer-team banner. They remain near the bastion and attack every 1.6 game seconds until defeated; a boss wave clears only when its entire team is defeated. HP, physical/special defense and impact damage multiply the normal same-round stats by 1.25 for gyms, 1.45 for League battles, 1.6 for champions, 4 for Kanto's Mewtwo, and 8 for the final regional encounter.

Defeating the final boss opens the regional Hall of Fame screen, showing the champion party, final HP, enemies defeated, upgrades kept, and exact round total. Auto stops. The wave-start guard prevents any additional round beyond that region's story limit, even with banked rewards present.

## Wave pacing and tower growth

- Enemy count: `3 + 2 * wave` through round 5; then `13 + 3 * (wave - 5)`.
- Rounds 1–3 use groups of up to three, with 0.36 seconds between group members and 3.2 seconds between group starts. Rounds 4–50 use 2.4 seconds between starts. Random jitter is up to 0.2 seconds.
- From round 51 onward, levels arrive in five balanced batches of about **20%**, with each next group waiting until at most one living enemy remains (single-enemy groups must be defeated first). Thus 150 enemies arrive in five groups of 30. Uneven totals preserve all enemies; small boss teams use fewer groups. Solo finales spawn once at time zero.
- Early waves limit enemy base-stat totals, soften HP/defense/impact and reduce movement speed. Stage 2 enemies unlock at round 4 and stage 3 at round 9.
- After every tenth cleared round, range and max HP multiply by 1.05; current HP gains the new capacity. Effective defense also grows: `(1 + armor) *= 1.05`, so growth works even from zero armor. Each milestone applies only once.

## Upgrades, damage and final forms

Damage cards compound with repeated copies and every matching category. Global cards multiply damage by 1.18; each type/stage card multiplies its category by 1.35. All active Pokémon types count, including the added Tera type (up to three). Two stage cards plus a matching type card give `1.35^3 × 1.10 = 2.7064125×` damage, including the repeated-stage resonance bonus. A stage bonus applies to the Pokémon's current stage; collected bonuses remain stored after evolution.

All regional final forms have signature attacks based on type or species overrides, including beams, flame/water cones, chaining lightning, explosions, shockwaves, slashes, volleys and vortices. Generic profiles cover the 18 ordinary types plus Stellar. Regional finales have named profiles: Sacred Fire, Dragon Ascent, Judgment, Glaciate, Nihil Light, Eternabeam and Tera Starstorm. These are tower-defense adaptations, not canonical battle animations or learnset rules.

Final-form move power is typically 2.16–3.42× base attack damage, with larger overrides for some regional finales. Final forms have 20% shorter attack cooldowns. Visual effects retain real-time duration for readability at 5× speed; combat calculations follow game speed. All attacks deal neutral damage to every enemy type, including dual types and Terastallized targets. There are no type weaknesses, resistances or immunities; collected type upgrades still buff matching partners. The attacker uses its larger attacking stat and the corresponding enemy defense.

Core formulas are in public/engine.js and public/attacks.js. Enemy HP scales as `(base HP * 0.53 + 9) * 1.115^(wave - 1)`, with the opening ease and boss factors applied. Normal tower armor reduces impact by division through `1 + armor`.

## Premium trades

At every 25th cleared non-final round, an independent premium opportunity is banked with one Pokémon exchange AND one passive-upgrade exchange, plus a separate one-time reroll per category. Choose the slot/card to replace, then a replacement. Later/Escape preserves remaining rights, offers and used rerolls. Skipping forfeits remaining rights without undoing completed exchanges. Combat and Auto continue during the trade. Regional form cards are transformations rather than tradable passive buffs; exchanging a Pokémon replaces its transformations with the new partner.

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

Run `npm test` for **152 checks**. They cover all nine regional starters/endings, exact round caps, all 127 boss encounters, requested special-form IDs and stats, all 1198 local sprite files, regional roster isolation, evolution links, regional forms, region switching and best-record isolation, reward stacking, Auto flow, premium swaps, batch sizes, attack rendering and story completion with banked choices. Controller tests use an in-memory DOM; they do not constitute nine complete 150-round playthroughs. Long-run balance remains an iterative playtesting task.

The project uses a bundled VT323 pixel font with its SIL Open Font License in assets. Pokémon and character names are trademarks of Nintendo, Game Freak and Creatures. This is an unofficial fan prototype, unaffiliated with those companies.

## Version 0.8.0 patch

Apply Poke_Bastion_V8_Patch.zip over the Version 0.7.0 project root, preserving its public/, tests/, and dist/ paths; allow file replacements. No sprite or regional data download is needed. Render rebuilds dist from public with npm run build. For direct static uploads, updated dist files are included. Reload the browser after deploying.

Every reward earned after round 50 guarantees at least one advanced tactic. Previously banked rewards retain their original choices. Split Volley adds one target per copy, dividing each attack's damage by the total target capacity even if fewer targets exist. Signature attacks retain their normal geometry for each selected target; overlapping areas can hit the same enemy. Other tactics grant shorter cooldowns, longer range, temporary movement slows (bosses resist half), defense penetration, bonus damage below 35% HP, and capped tower healing on defeats. Repeated copies stack, inventory displays their combined effects, and premium trades can replace or grant tactics. Premium tactic cards grant two stacks, excluding Split Volley. Slows refresh, rather than extending or multiplying themselves on each hit; slow copies multiply their movement reduction.

All bosses in all regions gain 20% HP, physical defense, special defense, movement speed, and impact damage relative to Version 0.7.0. Existing wave scaling and tier boosts remain. These separate increases together raise combat difficulty by more than 20% overall; full campaign balance still needs playtesting.

## Version 0.9.0 animation patch

Apply after Version 0.8.0 by merging the patch contents into the project root. All 18 move types have distinct canvas geometry, rather than a shared recolored beam or burst. Fire and electric keep their recognizable flame and lightning effects. Other types now have water streams and splashes, grass vines and leaves (petals for Petal Blizzard), normal impact stars, poison sludge, bug blades or needle swarms, flying gusts and feathers, ground fissures, falling rocks, psychic rings, ghost wisps, dragon helices and jaws, ice crystals, fighting fists, fairy moons and glints, steel plates and sparks, and dark eclipse effects. Applies to all regions, battle signatures and the move preview. Basic pre-evolution projectile orbs remain. Damage, cooldown, targeting geometry and Version 0.8.0 tactics are unchanged. Canvas animation is procedural; no new image downloads are required.

## Version 0.10.0 pacing and loss patch

Apply after Version 0.9.0. The pause shade no longer blocks battle controls; clicking Pause again resumes. Its accessible name changes to Resume battle while paused.

From round 51, keep the five balanced 20% groups, but release the next group only when at most one living enemy remains. A single-Pokémon group must be defeated before the next is released, so small boss teams do not all arrive immediately. Time and 5x speed cannot bypass this condition. Early-round staggered spawns and Auto reward banking stay unchanged.

On tower defeat, combat stops and region selection opens immediately with You Whited Out! and the lost round. It cannot return to the defeated story; choosing any region starts a fresh run. Regional best records remain.

## Version 0.11.0 party damage tracker

Apply after Version 10. SHOW TOTAL DAMAGE by the party changes all six party rows from buff multipliers to live cumulative damage; SHOW MULTIPLIERS switches back. Damage is tracked in both views, over the entire current expedition, and updates without rebuilding the party on every hit. Large values use compact notation; hover a value for the full rounded total.

Totals count actual enemy HP removed after defenses, finishing bonuses, split damage and area/chain falloff; overkill is excluded. Basic projectiles and every signature hit credit the attacker. Evolution retains a partner's total. A swapped-in partner begins at zero; projectiles already in flight remain credited to the original partner. New expeditions reset all totals. No damage or balance formulas are changed.

## Version 0.12.0 — Round-80 builds and dual premium trades

Apply this patch after Version 11. Round-80 rewards unlock seven elite tactics. Each non-Pokémon upgrade slot independently has a 10% chance to become a master upgrade. Recruit/evolution slots keep their purpose, and the guaranteed tactic slot remains a tactic. Older banked reward sets retain their original choices. Master cards use the premium values (50% universal power, 80% matching type/stage, 40 armor points, 200 max HP plus 250 healing, or two tactic stacks). Master Execute is a special one-stack master option available from round 80.

| Upgrade | Effect per stack |
| --- | --- |
| Ricochet Volley | One additional bounce to a fresh enemy within 160 range; each bounce retains 60% damage. Primary basic and signature attacks can bounce. No enemy is revisited by the same bounce chain. |
| Lock-On Link | Retain one target while alive, in range, and vulnerable to the move. Gain +20% primary-target damage per second, capped at +200%. Retargeting or a new round resets the ramp; a visible tether shows the lock. Area victims do not inherit the primary-target ramp. |
| Master Execute | Damaging hits stun surviving enemies below 35% HP for 0.6 seconds. Includes bosses; stops movement and tower attacks. After the stun ends there are 2 seconds of recovery before the next stun. Works with Finishing Instinct. |
| Critical Cadence | Every fourth attack volley gains a 1.50x damage multiplier. Repeated copies multiply. The volley includes split and ricochet attacks. |
| Marked Wounds | Hits add marks lasting 3 seconds, refreshed on hit. The party deals +5% damage per mark, up to 8 marks. Copies increase damage per mark. |
| Victory Nova | Defeats splash 60% of the killing hit's damage within 80 range. Copies increase the fraction. Splash is credited to the attacker and can hit every enemy type; secondary explosions cannot chain. |
| Guardian Shell | Gain a shield equal to 10% of max HP immediately and at every round start. Copies add shield capacity. Absorbs impacts before HP and appears beside tower HP. |
| Last Stand Relay | Below 40% tower HP, multiply cooldown by 0.80. Copies compound with Quick Claw Relay. |

All eight mechanics are tracked in the upgrades popup and can be exchanged as upgrades. Damage tracking credits ricochets, ramping, criticals, marked targets and defeat splash, while still excluding overkill.

Each 25-round premium opportunity now grants **one Pokémon exchange AND one upgrade exchange**, in either order. Each category has a separate single reroll of its three options. Completing one exchange leaves the other available. Later/Escape preserves choices, spent rerolls and completed exchanges. The category buttons show completed exchanges; Skip remaining exchange forfeits only unused rights and never reverses a completed swap. The opportunity leaves the bank after both exchanges or when skipped. Auto and combat continue as before. Rerolls prefer entirely new choices; tiny regional pools may require repeats. Eligibility and available tiers follow the current round when offers are generated, including for previously banked trades.

Automated validation covers unlock boundaries, the exact 10% threshold, stacking/removal, shields, target locks, ricochets, stuns and recovery, damage attribution, dual exchanges, reroll limits and bank persistence. Full-length campaign balance still requires playtesting.

## Version 0.13.0 — Rally frequency and unique rolls

Apply after Version 12. Starting with rewards earned after round 80 (round 81 onward), Rallying Power has **four times the selection weight** of other eligible ordinary upgrades. Master Rally receives the same relative weight in master selections and premium offers. This is a weighted chance, not a guaranteed card or a flat fourfold probability; party size, evolution options and reserved tactic slots affect the final frequency. The 10% per-upgrade-card master conversion chance is unchanged.

All three-card rolls are sampled without replacement using upgrade identity: kind plus matching type or stage. Base/master versions of the same effect share one identity; different types or stages remain distinct choices. Pokémon recruit/evolution cards use their destination Pokémon ID. This prevents duplicate evolution choices, repeated ordinary upgrades, and ordinary/master duplicates in one roll. Applies to normal rewards, master conversions, premium offers, rerolls and stale banked-card repairs. The guaranteed round-51+ tactic and recruit/evolution opportunities remain. Acquiring the same upgrade on different rounds is still allowed and stacks.

The upgrade audit verifies all tactic stack counters with repeated normal/master copies; multiplicative universal, dual-type and stage buffs; grown health/armor/range and removing one instance; actual cooldowns, movement slows, defense penetration, focus ramp, critical cadence, finishing damage, wound marks, healing and stun duration. Existing per-effect rules remain: wounds cap at 8 marks, focus ramps for up to 10 seconds per target, stuns have recovery, and Split Volley divides attack power across target capacity. Copies strengthen these effects according to each card rather than bypassing those rules. No additional stacking balance changes were needed.

Validation includes repeated regional controller drafts for all eight regions and both growing/full parties, deterministic reward/master/premium/reroll uniqueness checks (including fixed RNG edge cases), frequency checks and upgrade stack/removal checks.

## Version 0.14.0 — Repeat resonance, Mega Evolution and Terastallization

Apply after Version 13 by merging the patch into the existing project. This patch includes new form sprites and regional data, in addition to changed source and dist files. No external image request is needed at runtime. All forms use the bundled official PokéAPI CSV stats/types; sprites come from the PokéAPI sprite repository.

### Repeats always strengthen your team

Every repeat acquisition of the same passive upgrade grants another **1.10x party damage**, in addition to that card's existing effect. Normal/master versions share a repeat identity; master amounts still apply their full listed effects. The multiplier is shown in the upgrades inventory and included in party damage multipliers. Repeated cards display a repeat-bonus notice. Removing a passive upgrade through a trade recomputes repeat resonance correctly. This guarantees that extra targets, bounces, healing or conditional bonuses remain useful even when their primary effect currently cannot help. Caps on focus time, wound count and stun recovery remain, while repeats still increase their listed strength and resonance.

Split Volley now divides damage by the number of actual targets fired on, rather than unused capacity. A single boss therefore takes full damage. Master Split Volley is available and grants two target-capacity stacks. Long Reach and Master Long Reach have been removed from all reward/premium pools. Old banked range cards are replaced with valid alternatives. Automatic tower milestones remain. Banked type/stage cards that no longer help the current party are replaced before selection.

### Hoenn and Kalos: Mega Evolution

From round 25, the Mega Evolution card is available if the team has an eligible regional Pokémon. Choosing it opens a partner/form picker. Cancel retains the banked reward. Mega forms use their PokéAPI stats/types and retain their base partner's exact regional evolution stage: Mega Heracross is stage 1 and Mega Medicham stage 2. Damage totals remain with the same partner. Each partner can Mega Evolve exactly once and gains 2x personal damage. Choose X/Y or another available variant at that first evolution; the form cannot be switched or powered up with another Mega card afterward. More than one party member can Mega Evolve in this custom game. Mega forms cannot be recruited directly or appear in ordinary waves.

All Mega forms in the bundled PokéAPI snapshot whose base species belongs to that region are included, including the newer Kalos starter forms. Other regions do not offer Megas. Hoenn round 150 is now **Mega Rayquaza (10079)**; Kalos round 150 is **Mega Zygarde (10301)**. Kanto remains 151 rounds and other regions remain 150.

### Paldea: Tera Crystals

From round 25, typed Tera Crystal cards appear for eligible partners. Select the crystal, then select its target. Combat and Auto continue during the picker, and cancel retains the reward. The partner keeps its original current-form types and adds the selected Tera type, up to three unique types. Both original type buffs continue applying. Re-Terastallizing replaces the old added type and its matching-buff influence; old Tera types do not accumulate. Duplicate original/added types count only once. A crystal cannot target a partner already using that Tera type, including Stellar Terapagos. Non-Stellar type changes retain the existing cumulative 1.20x personal damage and 3% shorter-cooldown rules. Ordinary Stellar instead preserves native types and moves and adds only a temporary 20% damage bonus, removed on switching away; it adds no permanent power or speed stack. Normal evolution preserves the Tera type/power and uses the newly evolved form's native types and stage. Party stats show the active types and Tera power level; battlefield partners have crystal markers.

Non-Stellar Tera attacks take the active Tera type and use that type's distinct animation. Ordinary Stellar preserves the native move type and animation; Terapagos's special Stellar move is the exception. Stellar damage is neutral against ordinary enemies and doubled against Terastallized enemies. Stellar has its own rainbow star animation.

**Ogerpon** is available as a rare Paldea partner, with its four mask transformations. Grass/Teal grants 20% faster attacks. Water/Wellspring reduces incoming special tower impacts by 10% per Tera power level. Fire/Hearthflame grants 1.50x personal damage. Rock/Cornerstone reduces physical tower impacts by 10% per power level. Ivy Cudgel takes the active mask type. Replacing a mask removes the old mask/type bonuses. Ogerpon accepts only Grass, Water, Fire and Rock crystals.

**Terapagos** accepts Stellar crystals, becomes its actual Stellar Form (10277), and uses Stellar Tera Starstorm. Teraform Zero is adapted to this tower-defense game: it blocks one incoming tower impact each round. Terapagos cannot take another Stellar crystal while already Stellar. The single charge refreshes each round. Paldea's finale remains Stellar Terapagos. These mask/ability effects are explicit game adaptations; ordinary Pokémon battle rules such as weather and terrain are not otherwise simulated.

Form/source references: https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon.csv ; https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_stats.csv ; https://scarletviolet.pokemon.com/en-au/pokemon/ogerpon/ ; https://scarletviolet.pokemon.com/en-gb/pokemon/terapagos_stellar_form/ .

Validation covers repeat benefits for every passive card, removal, absent range offers, actual-target split damage, form restrictions/stages, both Mega finales, one-time Mega Evolution and valid Tera type changes, changing Tera types without old-type leakage, original type buffs, evolution and damage-total preservation, Ogerpon masks, Stellar damage, Teraform Zero, and two-step/cancel behavior during combat. Full-campaign balance remains to be playtested.

## Version 0.15.0 — One-time Mega and temporary Stellar rules

Apply after Version 14. Each Pokémon can Mega Evolve once. Already-Mega partners are removed from all Mega target lists, including alternate forms, and the card disappears when no eligible partners remain. Unused/banked impossible Mega choices turn into valid alternatives.

Ordinary Stellar Tera keeps the partner's native types and move and grants exactly a temporary 1.20x damage modifier. It does not add Stellar typing, grant Stellar-type attacks, add permanent Tera power, or add a cooldown stack. Changing to another Tera type removes that modifier. Cycling away and back reapplies one temporary modifier without accumulating Stellar stacks. Existing power from non-Stellar Tera changes remains under the previous rules. Normal evolution preserves the active Stellar effect and uses the evolved form's native typing.

Terapagos is exempt from those ordinary Stellar type/move rules: it still becomes its special Stellar Form, has Normal/Stellar typing, uses Tera Starstorm and receives Teraform Zero's single charge each round. The prohibition on choosing an already-active Tera type applies to every partner, including Terapagos and Ogerpon. Other eligible partners can still be selected with that crystal; if none exist, that crystal is not offered. A Pokémon may return to a previously used type after changing to a different type first, unless its species-specific restrictions prevent it.

Validation: 120 automated checks, including state-preserving rejection, stale banked-card repair, ordinary Stellar native moves/types, temporary-bonus removal, evolution, Stellar cycling without permanent damage/speed gains, independent eligible Mega partners, and Terapagos's exception. Full campaign balance is not rerun for this rules patch.


## Version 0.16.0 — Galar Max Mushrooms

Apply after Version 15 by merging this incremental patch into the project, replacing matching files. The archive contains changed source/dist files, updated regional data and new local sprites; keep all existing files not included in the patch. Redeploy on Render and hard-refresh the browser.

From round 25 in Galar, **Max Mushrooms** can appear in the regular three-card rewards when at least one partner has an eligible Gigantamax form. Choose the card, then its partner. Cancel keeps the reward banked, and combat/Auto continue through the picker. Each partner can Gigantamax **once**, permanently, like this game's Mega Evolution. The card disappears when no eligible partners remain, and stale banked choices are repaired.

All **34 Gigantamax forms (32 species)** from the bundled PokéAPI snapshot are supported, including the Galar starters, both Toxtricity forms and both Urshifu styles. Galar also gains the missing DLC/transfer base partners and their evolution lines so these forms can be reached. Match the exact base form: Galarian Meowth cannot become ordinary Gigantamax Meowth. Only genuine Gigantamax forms are eligible. **Eternatus and Eternamax Eternatus are never eligible.** Gigantamax forms are transformation-only and cannot be recruited directly, offered in premium Pokémon trades or appear in ordinary waves. Other regions do not gain Max Mushrooms or Gigantamax forms. Galar's Eternamax finale and 150-round limit are unchanged.

Gigantamax retains the partner's evolution stage, native type buffs and accumulated damage total. It grants **2x personal damage**, its species-specific **G-Max signature move** (3.60x move power in this tower-defense adaptation), and the usual signature attack cooldown. Battlefield sprites are larger with a magenta Max aura; party rows show **GIGANTAMAX · EVOLUTION LOCKED**. All subsequent evolution is permanently blocked for that partner, including Pikachu, Eevee and ordinary Meowth. Previously banked evolution cards become valid replacement rewards; direct engine evolution attempts cannot bypass the lock or consume an upgrade. Swapping out a partner recruits a new individual normally.

Validation: **128 automated checks passed**, plus a production build and browser picker checks for eligible targets, Pikachu/Eevee transformation, one-time use, signature move names, retained stages and the visible evolution-lock labels. New coverage checks all 34 local form sprites, exact alternate-form mapping, Galar-only reward gates, Eternatus exclusion, no raw-form recruitment, master-roll preservation, direct/stale evolution rejection, and mid-combat application without resetting damage or pausing Auto. Long-run balance remains subject to playtesting.

Form and sprite data: https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon.csv ; https://github.com/PokeAPI/sprites . Gigantamax and G-Max move reference: https://swordshield.pokemon.com/en-us/gameplay/gigantamax/ . Form-specific move areas and damage are custom game adaptations; Max Mushrooms also work on Melmetal in this game.


## Version 0.17.0 — Named regional battlefields

Apply this changed-files patch over Version 16, merge its folders, replace matching files, redeploy on Render, then hard-refresh. No new sprites or dependencies are required.

| Region | Battlefield | Palette and scenery |
| --- | --- | --- |
| Kanto | Indigo Plateau | Indigo stone, pale gold paths, a ceremonial ring and blue-green trees |
| Johto | Mt. Silver | Snowy blue-gray terrain, white drifts and frosted trees |
| Hoenn | Sky Pillar | Jade tiles, turquoise surroundings, pale columns and terrace markings |
| Sinnoh | Spear Pillar | Violet-gray ruins, broken columns and pale pink sigils |
| Unova | Dragonspiral Tower | Moss green and weathered gold stone, spiral markings and ruined columns |
| Kalos | Lumiose City | Warm cream paving, slate streets, a roundabout, lamps and planters |
| Galar | Wild Area | Muted green grass, ochre trails, blue water and woodland |
| Paldea | Area Zero | Teal terrain, pale luminous paths and lavender/cyan crystal formations |

Names appear on the battlefield header and each region-selection card. Terrain, paths, stonework, foliage, tower and flag use regional palettes. Page background, header, battlefield title strip, party panels, reward panels and dialogs follow the selected region. The move-guide canvas uses the current map's colors too. Scenery remains decorative; spawn positions, range, targeting, wave timing, bosses and balance retain their existing rules.

Validation: all 128 automated checks passed; production build passed; all eight names, selector labels and canvas renderers were checked in a smoke run; every regional map was inspected in the browser. Clean installation over Version 16 was checked before delivery.


## Version 0.18.0 — Stellar shell crystals

Apply this changed-files patch over Version 17, merge folders and replace matching files, redeploy on Render, then hard-refresh.

Area Zero scenery now takes its colors and faceting from the bundled Stellar Terapagos sprite: bright blue lattice, rainbow hexagonal gem plates, pale glass faces and small etched markings. Eleven individually arranged formations use five silhouettes: crowned shell-like geodes, tall leaning prisms, blade fans, gem rosettes and broad honeycomb outcrops. Scales, angles, gem colors and heights vary without randomizing between frames. Formations sit around the perimeter to keep the central team readable. These are procedural canvas decorations; no new images or dependencies are needed.

Validation: renderer smoke checks, production build and browser visual review. No gameplay rules were changed.


## Version 0.19.0 — Crystal delivery and asset-cache repair

Apply this cumulative repair patch over Version 17 or Version 18, merging folders and replacing matching files. It includes the full Stellar crystal renderer and prebuilt assets. Keep all other existing assets. Redeploy the updated project with `npm run build` and publish `dist`. The page header should read **VERSION 19**; a lower version means the new page has not loaded.

The earlier screenshot showed the Version 17 crystal renderer. Its exact deployment/cache cause could not be established from the image alone. The build now names each JavaScript/CSS file with a content hash, rewrites local module dependencies to their matching hashed filenames, then points the HTML to the new assets. A change to map contents changes both the map URL and its importing entry script URL. Unchanged assets retain their hashes. A build-assets.json file records the version and mapping. Stable source filenames remain in public for editing; the source HTML and map import also carry a version query for direct-public hosting. Missing imported assets fail the build.

Area Zero retains the Version 18 rainbow hexagonal shell facets and eleven diverse crystal formations. No additional gameplay rules were changed.

Validation: **130 automated checks passed**, including dependency-hash propagation, unchanged-build stability and missing-asset rejection; production build passed. The shipped HTML-to-entry-to-map chain was inspected for the actual Stellar renderer, then the production output was checked in the browser. This patch was applied and rebuilt independently over both Version 17 and Version 18 before delivery.


## Version 0.20.0 — Wave button state

Apply over Version 19, merge folders, replace matching files and redeploy. The start button now derives its text and enabled state from the current run phase whenever the UI refreshes. While combat is active (including paused combat), it reads Wave in progress and is disabled. Between waves it reads Start wave with the correct next-wave number. It becomes enabled when the team is ready after choosing the pending reward. The adjacent message also returns to Your team is ready. Story-ending New story behavior is preserved.

Validation: 131 automated checks, including actual wave clears, reward claims, the next wave start, paused combat, mid-battle reward claims and Auto toggles. Production build and browser review completed.


## Version 0.21.0 — Selectable party dossiers

Apply over Version 20, merging folders and replacing matching files, then redeploy on Render (`npm run build`, publish `dist`). Changed/new files only; existing Pokémon assets are retained.

The left column now places a Partner Dossier beneath the battlefield, filling the former gap above rewards. Select a Pokémon using its party button (mouse, Enter or Space); the selected starter appears automatically. The panel follows that individual through normal evolution and regional transformations, and shows a newly swapped partner with fresh contribution totals. A new region clears selection and the dossier. Combat and Auto continue while selecting partners.

The dossier shows all six PokéAPI base stats and their total, current types/stage/form and evolution path, current move/type/shape/physical-or-special attack class, signature power, neutral single-target hit before enemy defense/conditional effects, actual attack interval in game seconds, target capacity, ricochets and tower range. Damage factors separately show universal, matching types, matching evolution stage, personal forms/masks and repeat resonance. Base HP and defense are clearly labeled as species stats; partners do not take damage.

Live contributions show actual damage, share of run damage (including former partners), defeats, boss defeats, damaging hits, attack volleys, strongest actual hit and actual tower HP restored by Victory Bloom. Overkill, zero-damage/dead-target hits and overhealing do not inflate these counters. Splash and ricochets credit their originating partner; old projectiles remain attributed to their former owner after a swap. Counters stay with an evolving/transformed ally; a replacement starts fresh. The run damage denominator includes all credited partners, including former ones.

Relevant owned cards are grouped with copy counts and master tactic stack counts. Matching type/stage cards, party tactics and that individual's personal transformations appear with their effects. Unmatched type/stage cards appear only when their repeated copies still grant shared repeat resonance. Shared tower health, armor and shields are listed separately. Inactive ordinary Stellar bonuses are excluded after changing Tera, while power retained from earlier non-Stellar Tera applications is explained. Removed/traded upgrades disappear immediately. Live counters update text without rebuilding or resetting a scrolled upgrade list.

The panel follows each region's palette. On smaller screens it moves below the party section, with responsive stat and contribution grids.

Validation: **138 automated checks**, production build and browser checks. New coverage verifies stat/damage-factor math, repeat-only relevance, shared tower support, actual hit/heal/defeat credit, former-partner damage share, individual form-history ownership, Tera type replacement, selection during Auto, evolution/swap/reset behavior and stable live rendering. Browser review included actual wave clears, two-party selection, live counters and upgrade display.


## Version 0.22.0 — Regional expansion, Endless and simulation view

This cumulative changed-files patch installs over **Version 20 or Version 21**. It includes the party dossier, all new regional assets and prebuilt dist files. Merge its folders into the existing project, replace matching files, keep all other assets, then redeploy on Render with npm run build / dist. Confirm VERSION 22 in the header. The original full-game ZIP is not regenerated.

### Starters and modes

The region selector is a 3×3 grid, with **Classic / Random starters** and **Classic / Endless** campaign controls. Classic starters retain each region's traditional three. Random offers three distinct regional species with this game's stage 1 classification, including single-stage Pokémon; battle-only/Totem/Mega/Gigantamax forms are excluded. Random choices are freshly drawn for each new run. Closing the selector preserves the current run; selecting a region starts fresh with the selected controls.

Classic remains Story-based with a 150-round ending (151 in Kanto). Endless follows exactly the same story boss route, then continues with normal banked rewards, trades and tower growth. A cached random regional boss arrives every ten rounds after the story cap: 160, 170, etc. outside Kanto; 161, 171, etc. in Kanto. Boss-only transformations are excluded from the random pool. Each additional endless boss gains 15% tier power over its predecessor. In addition to ordinary wave growth, every enemy's HP, both defenses, movement speed and impact are multiplied by 1.05^(wave−151) starting on round 152. This compounds aggressively. Classic and Endless best records are separate; active runs still do not survive a reload.

### Upgrades and waves

From rewards earned on **round 101**, Mega Rally and Gigantamax Rally can appear only while matching transformed partners exist in the party. They grant **35% damage** to all matching partners and compound with type, stage, universal, personal-form and repeat-resonance buffs. Master versions follow existing master rules and grant 80%. They can be exchanged in premium trades; invalid banked/premium form offers refresh after the last matching partner leaves. Party dossiers display these buffs and their factors.

Early levels now use last-enemy-gated batches too. Early groups contain roughly three Pokémon until five groups are appropriate; later groups remain balanced 20% batches. The next group arrives when the prior group has one survivor, with singleton groups requiring defeat. Opening HP/defense easing starts at 80% rather than 65%, with lighter movement/impact nerfs as well; the full early curve reaches normal stats at round 6. Starter rosters and opening enemy base-stat caps still apply.

Non-finale bosses now have **double HP, physical/special defense, movement speed and impact**, on top of their previous boss multipliers. Story finales keep their previous boss multipliers; Kanto's Mewtwo/Mew end sequence is exempt. Endless scaling still applies after round 151.

### Sinnoh and Alola

Sinnoh combines Platinum and the complete Hisui species lists: **264 unique dex species / 285 Pokémon-form records**. Hisuian forms and their evolution routes are included alongside Sinnoh originals, including Wyrdeer, Kleavor, Ursaluna, Basculegion, Sneasler and Overqwil. Sinnoh retains its existing boss route and Arceus finale.

Alola uses the updated Ultra Sun / Ultra Moon dex: **403 species / 482 Pokémon-form records**, including 48 regional Mega forms and 12 boss-only Totem forms. Its classic starters are Rowlet, Litten and Popplio. Mega Evolution is available under the same one-time-per-partner rules as Hoenn/Kalos. The battlefield is **Ultra Wormhole**, with purple cosmic rings, light trails and star scenery.

| Round | Alola boss |
| --- | --- |
| 15 | Totem Gumshoos |
| 30 | Totem Araquanid |
| 45 | Totem Marowak |
| 60 | Totem Lurantis |
| 75 | Totem Togedemaru |
| 90 | Totem Mimikyu |
| 105 | Totem Kommo-o |
| 120 | Totem Ribombee |
| 125 | Nihilego |
| 130 | Buzzwole / Pheromosa |
| 135 | Xurkitree / Kartana |
| 140 | Celesteela / Guzzlord |
| 145 | Naganadel / Stakataka / Blacephalon |
| 150 | Ultra Necrozma (10157) |

### Full screen simulation

Use the ⛶ button beside the speed control. The simulation fills the viewport; party panels, dossiers, tower stats and normal page chrome are hidden. Starters, rewards and the manual start control appear in a tray at the bottom when needed. Auto keeps running, and reward choices continue to bank. Pause, Auto, speed and Exit remain available. Escape or Exit restores the normal view. Browser fullscreen is requested when supported; a viewport-filling fallback works when unavailable. The same run and contribution totals remain active in both views.

### Validation

**152 automated checks passed**, including all regional endings, Hisui/Alola roster and sprite integrity, random starter uniqueness, new buff stacking/removal/relevance, doubled non-finale bosses, early batch gates, endless story transitions for Kanto/Alola, cached endless bosses and compounded scaling. Production build passed. Browser review covered the 3×3 selector, random/endless Alola start, Ultra Wormhole, full-screen rewards during uninterrupted Auto, and restoring the standard view. The cumulative patch was rebuilt and checked over V20 and V21. These checks do not substitute for full long-run balance playthroughs.


## Version 23 — True Endless and form signatures

This is an incremental patch over Version 22. Merge the included files into the project root, allow replacements, then run `npm run build` / redeploy Render. Source and prebuilt `dist` files are included. Version 23 appears in the header.

- A reward roll has at most two Tera Shards, including banked reward repairs. Normal/master identities remain unique within a roll. Cancel or Escape from Mega Stone, Max Mushrooms or Tera target selection returns to the same unspent reward set; choosing a current partner is the only operation that consumes it.
- Mega Evolution and Gigantamax now grant **+100% personal damage (2x)**. Evolution stages, one-use restrictions and Gigantamax evolution locks remain. Post-100 team rallies remain +35%, with +80% master rallies. Every bundled Mega and G-Max form has a named signature and its own animated composition. Mega and G-Max move names are real Pokémon moves. Animations and combat areas/powers are tower-defense adaptations.
- **TRUE ENDLESS** sits below the nine-region grid. It uses the complete **1,025-species National Dex**, including all regional and special forms already bundled, with the missing DLC evolution lines added. Its arena is the Hall of Origin: a floating pale circular platform, blue creation rings, golden clouds and lavender light.
- Search by name (including words in either order), number or type to choose one starter, including a Legendary or special form. Special Mega/G-Max starters already have their doubled form power and one-use restrictions. Choose **one upgrade from each of three initial rolls** before wave 1. Auto and manual start both wait for these choices. Subsequent recruitment works normally.
- There is no story, gym schedule, finale or round cap in True Endless. **Every 10th round** is one random Legendary, Mythical or Ultra Beast boss. Its choice is cached for that round. Ordinary waves draw from the full dex, with the existing opening stage/stat caps. All five enemy stats receive an extra **1.05^round** multiplier, beginning at round 1, on top of the existing wave scaling.
- True Endless advanced tactics start at **round 25**, elite tactics and 10%-chance master selections at **round 50**. Form rallies still start after 100. Mega Stones, Max Mushrooms and Tera Shards are all enabled after their usual round-25 gate. A partner may combine one Mega or G-Max form with a Tera type; the doubled form power is retained through Tera changes. Mega and G-Max are mutually exclusive for an individual. Regional modes retain their region restrictions and upgrade unlock rounds.
- True Endless records are independent of regional Classic and regional Endless records. Restarting asks for a fresh searchable starter; loss returns to region selection.

`python3 scripts/build-origin-data.py` reproducibly rebuilds the National Dex from the bundled regional data and PokéAPI CSV snapshots, then downloads any missing sprites. `build-regional-data.py` invokes it after rebuilding regional data. True Endless uses the bundled full snapshot immediately instead of issuing over a thousand API refresh requests on entering the mode.


## Neutral type damage patch

All attack-versus-defender type interactions are disabled in every mode. Basic projectiles, signatures, chain/splash attacks, ricochets and Victory Nova can damage every type. Weaknesses, resistances, immunities and Stellar's extra damage against Terastallized targets are removed. Enemy physical/special defenses, upgrade bonuses, move power and area falloff still affect damage. Type labels, animations, transformations and collected type-specific upgrades remain active.
