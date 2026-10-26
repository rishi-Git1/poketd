# Poké Bastion — Version 06

A playable browser roguelike tower defense prototype. Choose Bulbasaur, Charmander, or Squirtle, then defend a central bastion against a 151-round campaign of approaching Pokémon. After every cleared wave, choose exactly one of three rewards.

## Run locally

Requires Node.js 20+ to build/test; no npm dependencies.

```sh
npm run build
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. Opening index.html directly with file:// will not load the roster.

## Deploy on Render

1. Unzip this project and push its contents to a GitHub repository. package.json and render.yaml should be at the repository root.
2. In Render, select **New > Static Site** and connect the repository.
3. Set **Build Command** to `npm run build`.
4. Set **Publish Directory** to `dist`.
5. Deploy. No environment variables or API keys are required.

Alternatively, create a Render Blueprint from the repository using the included render.yaml. If placing this project within a larger repository, set Render's Root Directory to this project folder.

## Playing

- Choose a starter (click or keys 1–3).
- Click Start wave (or press Enter with page focus).
- Allies attack automatically; enemies spawn in overlapping groups of three around the arena.
- Space pauses; 1× / 2× / 5× changes simulation speed. Leaving the browser tab pauses battle.
- After a wave, choose a new Pokémon, evolution, universal buff, type buff, evolution-stage buff, or tower upgrade.
- Team limit: six. When full, reward slots can offer evolutions or buffs instead of new partners.
- Tower damage persists. Repair & Reinforce is the healing option.
- Local best-wave record persists; an active run intentionally resets on reload.

## Initial roster and PokéAPI

This prototype uses all 151 Kanto Pokémon. Canonical base stats, types, names, and front sprites are fetched from https://pokeapi.co/api/v2/pokemon/{id}/ and bundled in public/assets. The browser refreshes roster stats and types in the background with three concurrent requests and a seven-day local cache. Failed requests keep the bundled snapshot usable. No server backend or authentication is needed. PokéAPI is the data service; the simulation runs in the browser.

Evolution paths cover all Kanto-only chains, including all three Eevee branches. Later-generation babies and evolutions are excluded: Pikachu starts at stage 1, and Pokémon such as Golbat, Onix and Scyther count as final forms within Kanto. All 151 are reachable through recruitment/evolution. Stronger recruits are gated by base stat total (350 + 30 × cleared wave, capped at 680); Mewtwo becomes eligible after wave 11. Enemy stat-total limits increase across waves so powerful single-stage Pokémon do not appear in the opening.

Regenerate the snapshot and sprites from the project root with `python3 scripts/fetch-data.py` (Python and curl required). The game uses local sprite files, so gameplay does not depend on a live image host.

## Combat / balance

These are game-specific formulas using official base stats, not the main-series Pokémon damage formula.

- Enemies per wave: 3 + 2 × wave through wave 5 (5, 7, 9, 11, 13); then 13 + 3 × (wave − 5).
- Three enemies per group; 0.36 seconds between group members; 3.2 seconds between group starts in waves 1–3, then 2.4 seconds, plus up to 0.2 seconds jitter.
- Stage 1 enemies from wave 1; stage 2 joins at wave 4; stage 3 joins at wave 9. Earlier stages remain in the pool.
- Opening ease factor E = min(1, 0.65 + max(0, wave − 1) × 0.07).
- Wave 1 enemy roster is capped at base stat total 280; wave 2 at 330. Normal stage-based roster begins at wave 3.
- Enemy HP: (base HP × 0.53 + 9) × 1.115^(wave − 1) × E.
- Enemy defense and special defense: base stat × (1 + 0.025 × wave) × E.
- Move speed: (10 + base speed × 0.115 + wave × 0.35) × min(1, 0.78 + max(0, wave − 1) × 0.044) arena units/second.
- Tower impact: ceil(max(attack, special attack) × 0.12 × (1 + 0.07 × wave) × min(1, 0.55 + max(0, wave − 1) × 0.09)).
- Armor reduces incoming damage by dividing impact by (1 + armor), rounded up, minimum 1.
- Allies use their larger attacking stat; special attacks use enemy special defense. Unevolved Pokémon use primary-type projectiles. Fully evolved partners use their signature move type. Both defender types affect effectiveness, including immunities.
- Ally attack damage: (8 + attack × 0.23) × (universal multiplier × each matching type multiplier × current-stage multiplier) × 100 / (100 + enemy defense) × type effectiveness.
- Attack cooldown: max(0.28, (1.45 − base speed × 0.006) × (0.8 for final forms, otherwise 1)) seconds.
- Allies prioritize the nearest non-immune enemy within 335 units of the center. Signature attacks can also strike enemies near the selected target; immunity is evaluated separately for each victim.
- Universal power cards multiply by 1.18. Each type and stage card multiplies its category by 1.35. Repeated copies compound, and all applicable categories multiply together. Both types on dual-type Pokémon count. Two stage cards and one matching type card yield 1.35³ = 2.460375× buff damage. Armor cards add 12 displayed armor points (0.12 in the reduction formula). Health cards add 65 maximum HP and restore 105 current HP.
- Buffs apply according to a Pokémon's current type/stage after evolution.

## Files

- public/attacks.js — move profiles, area/chain targeting, speed cycle, and signature renderers.
- public/engine.js — stat scaling, type chart, wave scheduling, upgrade application.
- public/app.js — game loop, canvas rendering, UI, data refresh and local record.
- public/style.css and index.html — responsive interface.
- tests/engine.test.mjs — meaningful rule and progression checks; run `npm test`.
- scripts/build.mjs — dependency-free static build.

The prototype includes pause, speed toggle, keyboard choices, instructions, responsive layout, and a game-over/restart loop. Difficulty tuning remains an iterative design task; no claim of long-run balance testing is made.

Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, and Creatures. This is an unofficial fan prototype, not affiliated with those companies. Data and sprites are sourced through PokéAPI. The VT323 pixel font is bundled locally with its SIL Open Font License in public/assets; no font network request is needed.


## Signature moves

All 81 Kanto-final forms in the complete roster have a custom tower-defense signature move. These are game adaptations with custom mechanics, not an implementation of main-series move rules or learnsets. Earlier stages keep small type-colored projectiles.

| Final form | Move | Behavior |
| --- | --- | --- |
| Venusaur | Solar Beam | Piercing grass beam |
| Charizard | Flamethrower | Expanding flame cone |
| Blastoise | Hydro Pump | Piercing water beam |
| Butterfree | Silver Wind | Area vortex |
| Beedrill | Pin Missile | Up to three nearby targets |
| Pidgeot | Hurricane | Flying-type area vortex |
| Raticate | Hyper Fang | Powerful single-target slash |
| Raichu | Thunderbolt | Up to three chained targets |
| Sandslash | Earthquake | Ground shockwave area |
| Ninetales | Fire Blast | Fire explosion area |
| Golbat | Poison Fang | Powerful poison slash |
| Vileplume | Petal Blizzard | Grass petal vortex |
| Alakazam | Psychic | Piercing psychic beam |
| Golem | Rock Slide | Rock impact area |
| Gengar | Shadow Ball | Ghost explosion area |
| Vaporeon | Muddy Water | Water cone |
| Dragonite | Dragon Pulse | Piercing dragon beam |

Primary targets receive the move's power multiplier (2.16–3.42× depending on move). Beam/cone collateral gets 70% of that damage, blast/vortex/quake collateral 65%, and volley secondary targets 65%. Chain lightning jumps within 140 units, at 100%, 80%, and 64% damage. Blast radius is 75 units, vortex 95, quake 115, and volley secondary target radius 120. Beam half-width is 23; cones expand with distance. Signature visual effects retain their real-time duration at 5× speed for readability, while damage, cooldowns, projectiles and movement all follow game speed.

Open **? > Final evolution move guide** to preview all 81 final-form attacks without changing your current team or run.


## Version 03 — stacking, full Kanto, and stronger evolutions

- The party's UPGRADES button opens a popup of every collected reward grouped by stack count, category totals, and effective damage multipliers for each current partner. Opening it pauses active combat; resume using the pause control.
- Each party slot displays its buff damage multiplier. GLOBAL in the tower bar refers only to universal damage; type/stage multipliers are shown per partner and in the popup.
- Repeated damage cards and different applicable damage cards multiply. A stage bonus applies only to the current evolution stage; type bonuses apply to both current Pokémon types. Evolving does not reset any collected upgrade.
- Every one of the 81 Kanto-final Pokémon has a signature profile, including single-stage Pokémon. Existing signature damage is 80% higher than version 02, and final forms have 20% shorter attack cooldowns (25% faster attack rate). This is roughly 2.25× previous signature DPS before buffs and stats. Minimum cooldown is 0.28 seconds.
- New type coverage includes fighting, ice, fairy, and steel, using PokéAPI's current types. Generic final-form move profiles are adapted by primary type, with species overrides for starters, Eeveelutions, legendaries and others.
- 18 tests cover repeated buff copies, dual typing, evolution preservation, all 151 IDs and sprites, reachability of every species, branch choices, stronger final forms, progression gates and attack geometry/rendering.


## Version 04 — campaign, Auto, growth, and premium trades

AUTO ON starts the next wave immediately, with no countdown and no requirement to spend rewards. Each cleared round banks its own three-card reward set. Choices can be claimed during combat and apply immediately without resetting the current wave, enemies, or attack timers. Rewards are presented oldest first, one choice per earned set. Auto never picks cards on the player's behalf. Manual pause, help/inventory pause, hidden tabs, game over, and victory are still respected. Auto preference stays enabled between expeditions; speed resets to 1×.

After each cleared round divisible by 10, attack range and maximum tower HP multiply by 1.05. Current HP gains the new maximum-HP capacity (no full heal). Effective armor multiplies by 1.05: `1 + armor` becomes `(1 + armor) * 1.05`, so this works even at zero initial armor. Growth occurs once per milestone, compounds, and appears in the sidebar and upgrade inventory. Attack range has no gameplay cap; its illustrated ring is clipped to the battlefield.

Boss rounds replace the normal enemy wave. Their teams arrive 0.85 seconds apart through round 50, then in balanced groups of approximately 20% from round 51 onward around the tower, have a gold aura and trainer banner, and remain near the tower to attack every 1.6 seconds until defeated. Clearing a boss requires defeating the entire roster. Teams use Pokémon Red/Blue rosters (https://pokemondb.net/red-blue/gymleaders-elitefour); Blue's party counters the player's original starter even if that starter was evolved or traded.

| Round | Encounter |
| --- | --- |
| 15 | Brock — Geodude, Onix |
| 30 | Misty — Staryu, Starmie |
| 45 | Lt. Surge — Voltorb, Pikachu, Raichu |
| 60 | Erika — Victreebel, Tangela, Vileplume |
| 75 | Koga — Koffing, Koffing, Muk, Weezing |
| 90 | Sabrina — Kadabra, Mr. Mime, Venomoth, Alakazam |
| 105 | Blaine — Growlithe, Ponyta, Rapidash, Arcanine |
| 120 | Giovanni — Rhyhorn, Dugtrio, Nidoqueen, Nidoking, Rhydon |
| 125 | Lorelei |
| 130 | Bruno |
| 135 | Agatha |
| 140 | Lance |
| 145 | Champion Blue |
| 150 | Mewtwo |
| 151 | Mew — final encounter and campaign victory |

Boss HP, physical/special defense, and tower impact multiply the ordinary same-round stats by 1.25 for gyms, 1.45 for Elite Four, 1.6 for Blue, 4 for Mewtwo, and 8 for Mew. Mew's resulting HP, defenses, and damage exceed Mewtwo's. Boss speed uses the ordinary base-stat formula. The boss schedule is viewable in the field guide.

At rounds 25, 50, 75, 100, 125 and 150, an optional premium trade is banked independently of the normal reward. Choose a category, select the exact party slot or collected upgrade instance to replace, then choose one of three generated replacements. The PREMIUM TRADES button opens the oldest banked trade. Opening it does not pause combat or prevent Auto from starting another wave. Later or Escape closes the dialog and keeps that opportunity banked; Cancel skips that opportunity and keeps the party/upgrades unchanged. Offers are generated once per category at that trading post; switching targets does not reroll them. A Pokémon offer that has become owned while banked is replaced with an eligible choice.

- Pokémon trades offer three distinct Kanto-final partners not already in the party, including one randomly selected available legendary (Articuno, Zapdos, Moltres, Mewtwo, or Mew). If every legendary is already owned, the third slot falls back to another eligible final form. Party size and all collected type/stage/global buffs are preserved.
- Upgrade trades offer only premium buffs: +50% universal damage, +80% matching type/stage damage, +40 armor points, or +200 maximum HP and a 250 HP restoration. Replace exactly one existing buff instance, including one copy out of a repeated stack. Recruits and evolutions are not eligible upgrade targets.
- Removing a health or armor card reverses its accumulated growth contribution while preserving unrelated tower growth. Historical healing is not reversed; current HP is capped at the reduced maximum before applying the replacement.
- The round-150 trade is earned after defeating Mewtwo; in Auto mode Mew begins immediately, and the trade can be used during that encounter. Round 151 ends at the Hall of Fame, with no round 152.

`tests/campaign.test.mjs` checks the exact schedule, all boss rosters, relative boss stats, growth, Auto guards, premium pools, one-for-one swaps and reversal of grown bonuses. `tests/flow.test.mjs` runs the actual app controller against an in-memory DOM stub to check Auto transitions, the banked round-25 trade/cancel, bosses attacking repeatedly, and round-151 victory. This validates flow and calculations; full 151-round balance still requires playtesting.


## Version 05 — uninterrupted Auto and banked decisions

- Auto has no inter-wave timer. Starter selection begins round 1 immediately; clearing a round banks its reward and starts the next round within the same game update.
- The reward bank displays how many three-card sets remain. Select a card with a click or keys 1/2/3 whenever ready, including during a boss fight. Only that reward set is consumed; the next set appears and keeps its original choices.
- Banked cards are revalidated after party changes. If an evolution target no longer exists, or recruitment would duplicate a partner or exceed six slots, that invalid choice is replaced by a standard universal/health/armor buff. Other saved choices are preserved.
- Premium trades accumulate separately and can be used mid-wave. Resolving, skipping, or deferring one does not reset the wave, pause combat, or discard other saved opportunities. Later/Escape preserves the trade; Cancel skips only that one opportunity.
- Switching Auto off mid-wave lets that wave finish, then waits for outstanding normal rewards in manual mode. Switching Auto on at a reward screen starts the next wave immediately while keeping all banked sets.
- A new expedition clears the queues. As before, browser reload does not preserve the active run.

37 tests pass, including consecutive queued rewards, mid-combat application without enemy resets, instant Auto advancement, queued premium trades while their dialog is open, deferred/canceled trades, stale card recovery, and manual/Auto switching.


## Version 05.1 — instant late-wave spawning

Superseded by Version 06: rounds 51 onward now spawn in 20% batches rather than all at once.


## Version 06 — Story-based mode, 20% batches, and a dedicated ending

The mode is explicitly named **Story-based** in the header and completion screen. It is a finite 151-round story. Defeating Mew opens a Hall of Fame ending screen with rounds cleared, Pokémon defeated, upgrades kept, final tower HP, and the champion party. New story resets the run and reward/trade queues; Review expedition closes the ending while keeping the completed run. Auto stops, and startWave explicitly blocks any attempt to create round 152, even if a ready-state control is activated. The ending takes priority over banked choices, so saved rewards cannot hide the completion screen.

From round 51 onward, regular levels and boss teams arrive in five balanced groups, roughly 20% each. Each group's members spawn together; groups start at 0, 3, 6, 9, and 12 game seconds. Thus 150 Pokémon arrive as five groups of 30. Uneven totals are divided as evenly as possible with no missing Pokémon. Teams with fewer than five members use fewer groups: a three-Pokémon boss sends one at 0, 3, and 6 seconds, while Mewtwo and Mew remain solo encounters. The group indicator is shown on the battlefield. Earlier rounds retain their existing timing. Auto and its reward/trade bank remain uninterrupted.

41 tests pass, including batch sizes across totals 1–500, the round-50/51 boundary, grouped boss spawning, and completion with banked choices. The real ending handler's layout and Review action were additionally checked in-browser using a temporary visual QA scenario, not a full 151-round playthrough. Temporary QA pages/scripts are excluded from the deliverable.
