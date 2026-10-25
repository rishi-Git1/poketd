# Poké Bastion

A playable browser roguelike tower defense prototype. Choose Bulbasaur, Charmander, or Squirtle, then defend a central bastion against endless waves of approaching Pokémon. After every cleared wave, choose exactly one of three rewards.

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
- Space pauses; 1× / 2× changes simulation speed. Leaving the browser tab pauses battle.
- After a wave, choose a new Pokémon, evolution, universal buff, type buff, evolution-stage buff, or tower upgrade.
- Team limit: six. When full, reward slots can offer evolutions or buffs instead of new partners.
- Tower damage persists. Repair & Reinforce is the healing option.
- Local best-wave record persists; an active run intentionally resets on reload.

## Initial roster and PokéAPI

This prototype uses a curated Kanto roster. Canonical base stats, types, names, and front sprites are fetched from https://pokeapi.co/api/v2/pokemon/{id}/ and bundled in public/assets. The browser refreshes roster stats and types in the background with three concurrent requests and a seven-day local cache. Failed requests keep the bundled snapshot usable. No server backend or authentication is needed. PokéAPI is the data service; the simulation runs in the browser.

Evolution stages and successor choices are curated for this first-version roster, rather than dynamically importing the full evolution graph. Pikachu starts at stage 1 within this Kanto-only roster. Eevee currently evolves only into Vaporeon. Branching evolutions and other generations can be added later.

Regenerate the snapshot and sprites from the project root with `python3 scripts/fetch-data.py` (Python and curl required). The game uses local sprite files, so gameplay does not depend on a live image host.

## Combat / balance

These are game-specific formulas using official base stats, not the main-series Pokémon damage formula.

- Enemies per wave: 7 + 3 × wave.
- Three enemies per group; 0.36 seconds between group members; 2.4 seconds between group starts, plus up to 0.2 seconds jitter.
- Stage 1 enemies from wave 1; stage 2 joins at wave 4; stage 3 joins at wave 9. Earlier stages remain in the pool.
- Enemy HP: (base HP × 0.53 + 9) × 1.115^(wave − 1).
- Enemy defense: base defense × (1 + 0.025 × wave).
- Move speed: 10 + base speed × 0.115 + wave × 0.35 arena units/second.
- Tower impact: ceil(max(attack, special attack) × 0.12 × (1 + 0.07 × wave)).
- Armor reduces incoming damage by dividing impact by (1 + armor), rounded up, minimum 1.
- Allies use their larger attacking stat; special attacks use enemy special defense. Primary Pokémon type determines projectile type. Both defender types affect effectiveness, including immunities.
- Ally attack damage: (8 + attack × 0.23) × (1 + universal buff + primary-type buff + stage buff) × 100 / (100 + enemy defense) × type effectiveness.
- Faster allies attack more often: max(0.38, 1.45 − base speed × 0.006) seconds.
- Allies prioritize the nearest non-immune enemy within 335 units of the center.
- Universal power: +18%; type and stage power: +35%; all stack additively. Armor cards add 0.12 armor. Health cards add 65 maximum HP and restore 105 current HP.
- Buffs apply according to a Pokémon's current type/stage after evolution.

## Files

- public/engine.js — stat scaling, type chart, wave scheduling, upgrade application.
- public/app.js — game loop, canvas rendering, UI, data refresh and local record.
- public/style.css and index.html — responsive interface.
- tests/engine.test.mjs — meaningful rule and progression checks; run `npm test`.
- scripts/build.mjs — dependency-free static build.

The prototype includes pause, speed toggle, keyboard choices, instructions, responsive layout, and a game-over/restart loop. Difficulty tuning remains an iterative design task; no claim of long-run balance testing is made.

Pokémon and Pokémon character names are trademarks of Nintendo, Game Freak, and Creatures. This is an unofficial fan prototype, not affiliated with those companies. Data and sprites are sourced through PokéAPI. UI fonts are optionally loaded from Google Fonts; local font fallbacks work without them.
