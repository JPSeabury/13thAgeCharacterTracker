# 13th Age (2nd Edition) Character Tracker

## Overall Goal
A modern web app to create, edit, and manage 13th Age Characters. Includes a step-by-step character creation wizard, rules validation and interactive character sheet with counters for powers, HP, recoveries, etc. 

End Vision: A tool where my players can create their 13th Age Characters, and during game play we have a "shared window" into their stats, abilities, spells/powers available in the current battle/arc, and dice roller. The struggle we have today using Roll20 Character Sheets is the driver for this initiative.

If it grows to become particularly useful, maybe other gaming tables can make use of it.

## Tech Stack
* React + TypeScript + Vite (scaffolded together)
* State management: Zustand
* Styling: TailwindCSS
* Routing: React Router
* Persistence: LocalStorage first: JSON import/export later
* Testing: Vitest + React Testing Library

DISCLAIMER: I don't know ANY of these languages/tools. My progress on this project will be EXTREMELY slow. I am using my passion for gaming (and the 13th Age game system) as a driver to teach myself these languages. 

## User Flows
To-Do: (Diagram this out to make it more clear!)

Home:
“Create New Character” or “Open Existing Character” 

Character list with search/sort/delete 

Character Creation Wizard: 
* Step 1: Basics (name, level, alignment, notes) 
* Step 2: Ability Scores → assign default array [17, 15, 14, 13, 12, 10]; then apply +2 to any two abilities only 

WORKING ON THIS NOW!
* Step 3: Kin (race) → choose from [Human, Dwarf, High Elf, Silver Elf, Wood Elf, Gnome, Half-elf, Halfling, Troll-kin, Dragonic, Forgeborn, Holy One, Tiefling], then select Kin power(s) 
* Step 4: Class → choose from [Barbarian, Bard, Cleric, Fighter, Paladin, Ranger, Rogue, Sorcerer, Wizard] 
* Step 5: Talents/Powers/Spells/Maneuvers → enforce class rules for picks, show usage type (At-Will, Battle, Encounter, Daily, Arc, Recharge) 
* Step 6: Feats → choose Adventurer/Champion/Epic feats, tied to features if applicable 
* Step 7: Equipment → weapons, armor, implements, shield, items 
* Step 8: Review & Create → summary + validation 

Character Sheet (Editor/Play): 
* Track HP, recoveries, defenses, conditions 
* Powers/spells/feats with interactive usage counters and reset buttons: 
“End of Battle” resets Battle/Encounter 
“End of Arc” resets Daily/Arc 

* Recharge powers → show a roll button to mark success/fail 
* Session log: timestamped notes 
* Print View: Clean sheet layout, auto page breaks, usage checkboxes 

## Data Model 
Use TypeScript types/interfaces for: 
* Character (name, level, kin, class, ability scores, modifiers, defenses, hp/recoveries, features, equipment, notes, usage counters) 
* PowerLike (id, name, usage, action, trigger, effect, feats, bookRef) 
* Talent, Spell, Maneuver, Feat, KinPower (extend base) 
* Equipment (weapons, armor, shield, implements, items) 

## Validation rules: 
* Ability array assigned exactly once; exactly two +2 boosts 
* Enforce per-class talent/power counts (config-driven) 
* Derived stats auto-calculated (AC, PD, MD, Initiative, HP)

## How to run
1. Clone this project
2. From your VS Code Terminal, type "npm run dev"
3. Set your browser URL to the local website (e.g., http://localhost:1234/, whatever displays from your npm run dev command
4. Click the "New Character" button (top right corner) to start building a 13th Age Character

## Found a Bug? Want to Teach Me New Things?
If you found an issue or would like to submit an improvement to this project, please submit an issue using the issues tab above. If you would like to submit a PR with a fix / enhancement, reference the issue you created!

## Known Issues (Work in progress)
This whole thing is a work in progress. I'm learning as I build. Right now, I have the ability to create a character and assign stats. Currently working on selecting kin (racial selection).

## Like this project?
If you're feeling generous, buy me a coffee! I can't say that I'll publish / produce faster after drinking a coffee, but I'll sure be appreciative!

https://buymeacoffee.com/jpseabury
