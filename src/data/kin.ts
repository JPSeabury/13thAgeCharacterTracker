export type KinId =
  | 'human' | 'dwarf' | 'high-elf' | 'silver-elf' | 'wood-elf' | 'gnome'
  | 'half-elf' | 'halfling' | 'troll-kin' | 'dragonic' | 'forgeborn'
  | 'holy-one' | 'tiefling';

export type FeatTier = 'adventurer' | 'champion' | 'epic';

export interface KinPowerFeat {
  tier: FeatTier;
  description: string;
}

export interface KinPowerDef {
  id: string;
  name: string;
  /** Short UI blurb */
  summary?: string;
  /** Rules-facing metadata (optional) */
  usage?: 'once-per-battle' | 'passive';
  trigger?: string;
  requirements?: string;      // e.g., "Escalation Die 2+, non-crit hit"
  effect?: string;
  missEffect?: string;
  critEffect?: string;
  notes?: string;
  feats?: KinPowerFeat[];

  /**
   * Optional hook for rules engine effects that aren’t a simple combat button.
   * e.g., “human-resourceful” grants an extra highest-tier feat during feat allocation.
   */
  rulesHookId?: string;
}

export interface KinDef {
  id: KinId;
  name: string;
  // how many powers the player must pick for this kin
  requiredPicks: number;
  powers: KinPowerDef[];
}

export const KIN: KinDef[] = [
  {
    id: 'human',
    name: 'Human',
    requiredPicks: 1,
    powers: [
      {
        id: 'human-push-it',
        name: 'Push It',
        summary: 'After a non-crit hit at Escalation Die 2+, gamble for bigger damage.',
        usage: 'once-per-battle',
        requirements: 'Escalation Die 2+ and you hit (but don’t crit).',
        trigger: 'Immediately after you hit a target with an attack.',
        effect:
          'Choose to “push it” as a free action: your original hit has no effect yet; make a second attack roll against the same target with the same attack bonus. If the second roll hits, deal double damage; if it crits, deal triple damage.',
        missEffect:
          'If the second roll misses, the original attack deals only half damage to that target. On a natural 1, your attack deals no damage and has no effect (fumble).',
        feats: [
          {
            tier: 'champion',
            description:
              'If you miss when you Push It, this power is not expended; you can use it again on a later turn this battle.',
          },
        ],
      },
      {
        id: 'human-quick-to-fight',
        name: 'Quick to Fight',
        summary: 'Roll initiative twice and take the better result.',
        usage: 'passive',
        trigger: 'At the start of each battle.',
        effect: 'Roll initiative twice and choose the result you want.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'If your initiative is higher than all enemies, you gain +2 to all defenses during the first round of battle.',
          },
        ],
      },
      {
        id: 'human-resourceful',
        name: 'Resourceful',
        summary: 'You have a bonus feat of the highest tier you qualify for.',
        usage: 'passive',
        rulesHookId: 'human-resourceful',
        notes:
          'At each level, grant +1 extra feat at the highest tier the character currently qualifies for. UI tip: show the progression table as a tooltip.',
      },
    ],
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    requiredPicks: 1,
    powers: [
      {
        id: 'dwarf-comrade-defender',
        name: 'Comrade Defender',
        summary: 'Intercepting to protect an ally lets you strike first.',
        usage: 'once-per-battle',
        trigger: 'You intercept an enemy moving to attack an ally.',
        effect:
          'Make a melee attack against that enemy before it can take another action.',
        feats: [
          {
            tier: 'adventurer',
            description: 'You gain a +2 attack bonus on this attack.',
          },
        ],
      },
      {
        id: 'dwarf-never-give-in',
        name: 'Never Give In',
        summary: 'Stand your ground—shake off a temporary effect when you heal.',
        usage: 'once-per-battle',
        trigger: 'You heal using a recovery.',
        effect:
          'As a free action, make a save with a +2 bonus against a temporary effect.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'The first time this save fails each battle, the power is not expended (you can still only use it once per turn).',
          },
        ],
      },
      {
        id: 'dwarf-thats-your-best-shot',
        name: 'That’s Your Best Shot?',
        summary: 'Get hit, sneer, and rally.',
        usage: 'once-per-battle',
        trigger: 'You are hit by an enemy attack.',
        effect:
          'As a free action after being hit (but not dropped to 0 hp), you can heal using a recovery. If the escalation die is less than 2, you only regain half the usual healing. You must be on your feet to use this power.',
      },
    ],
  },
  {
    id: 'high-elf',
    name: 'High Elf',
    requiredPicks: 1,
    powers: [
      {
        id: 'high-elf-eminence',
        name: 'Eminence',
        summary: 'Once per battle, reroll your MD attack or force an MD hit against you to be rerolled at -4.',
        usage: 'once-per-battle',
        // Two modes; you choose when the relevant trigger occurs.
        trigger: 'When you make an attack vs Mental Defense, or when a non-crit attack vs your Mental Defense hits you.',
        effect:
          'Choose one: (1) Reroll your attack against Mental Defense; or (2) force the enemy that hit you (non-crit) with an attack vs your Mental Defense to reroll the attack against you with a -4 penalty.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'You can use both elements of Eminence once apiece each battle.',
          },
        ],
      },
      {
        id: 'high-elf-highborn-teleport',
        name: 'Highborn Teleport',
        summary: 'As a move action, blink to a nearby space you can see.',
        usage: 'once-per-battle',
        trigger: 'On your turn, as a move action.',
        effect:
          'Teleport to a nearby location you can see.',
        notes:
          'Use the same “nearby” distance terminology you use elsewhere in the app.',
        feats: [
          {
            tier: 'champion',
            description:
              'Before or after you teleport, deal 15 force damage to one enemy engaged with you (30 at epic tier).',
          },
        ],
      },
      {
        id: 'high-elf-mystic-initiative',
        name: 'Mystic Initiative',
        summary: 'Give an ally +5 init and take -5 yourself; both gain temp HP (scales by level).',
        usage: 'passive',
        trigger: 'Before rolling initiative.',
        effect:
          'Choose one ally: they gain +5 to initiative this battle; you take -5 to initiative. You both gain 4 temporary hit points (8 at 5th level; 16 at 8th level).',
        notes:
          'Temp HP scaling: L1-4: 4; L5-7: 8; L8-10: 16.',
        feats: [
          {
            tier: 'champion',
            description:
              'Once per arc, before rolling initiative, declare you are claiming full mystic prerogatives for this battle. After all combatants roll, swap your final initiative with the enemy that has the highest initiative.',
          },
        ],
      },
    ],
  },
  {
    id: 'silver-elf',
    name: 'Silver Elf',
    requiredPicks: 1,
    powers: [
      {
        id: 'silver-elf-cruel',
        name: 'Cruel',
        summary: 'On a natural even hit (non-crit), inflict tier-scaled ongoing damage.',
        usage: 'once-per-battle',
        trigger: 'After you hit (but don’t crit) with a natural even attack roll.',
        effect:
          'Deal ongoing damage to that target: 15 at adventurer tier, 30 at champion, 50 at epic (save ends 11+).',
        notes:
          'Normal save (11+) ends the ongoing damage.',
        feats: [
          {
            tier: 'champion',
            description:
              'Once per arc, you can instead deal ongoing damage equal to 5 × your level to a target you missed or hit with a natural odd roll (even on a natural 1).',
          },
        ],
      },
      {
        id: 'silver-elf-devious-strike',
        name: 'Devious Strike',
        summary: 'Capitalize on an ally’s miss to strike with advantage.',
        usage: 'once-per-battle',
        trigger:
          'An ally’s melee attack misses a foe you are engaged with.',
        effect:
          'As a free action, make a no-trigger melee attack against that enemy with a +4 bonus to the attack roll.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'If your Devious Strike hits, you gain +2 to all defenses until an enemy attack misses you.',
          },
        ],
      },
      {
        id: 'silver-elf-shadow-step',
        name: 'Shadow-step',
        summary: 'Slip into shadow when enemies move to pin you.',
        usage: 'once-per-battle',
        trigger:
          'When an enemy moves to engage you (interrupt).',
        effect:
          'Roll a normal save (11+). On a success, you vanish from the battle; the enemy may finish its move and attack another target. At the start of your next turn, return to the battle at a nearby spot where you stepped into shadow. You gain no attack advantages when you return.',
        notes:
          'Unlike the rogue’s Shadow Walk, this grants no return-turn attack benefits.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'If your Shadow-step save fails, the power is not expended; you can use it again later this battle.',
          },
        ],
      },
    ],
  },
  {
    id: 'wood-elf',
    name: 'Wood Elf',
    requiredPicks: 1,
    powers: [
      {
        id: 'wood-elf-elven-grace',
        name: 'Elven Grace',
        summary:
          'At start of each turn, roll 1d8; if ≤ escalation die, gain an extra standard action, then stop rolling until a quick rest (you may decline to keep rolling).',
        usage: 'passive',
        trigger: 'At the start of each of your turns.',
        effect:
          'Roll 1d8. If the result is equal to or lower than the escalation die, you gain an extra standard action this turn, then stop rolling for Elven Grace until you take a quick rest. You may choose not to take the extra action; if you decline, you keep rolling on subsequent turns.',
        notes:
          'This is not “once per battle”; it’s a per-turn check that turns off after the first success until a quick rest.',
        feats: [
          {
            tier: 'champion',
            description:
              'Once per arc, roll a d4 for Elven Grace instead of a d8. If you do not gain an extra action, this option is not expended.',
          },
        ],
      },
      {
        id: 'wood-elf-fortunate-fey',
        name: 'Fortunate Fey',
        summary:
          '3×/arc (max 2× per battle/scene) reroll a non-attack, non-initiative d20 that hasn’t already been rerolled; you must keep the reroll.',
        usage: 'passive',
        trigger:
          'When you make a qualifying d20 roll (not an attack roll or initiative, and it hasn’t already been rerolled).',
        effect:
          'Reroll that d20. You must abide by the new result and can’t reroll it again or replace it by any other trick.',
        notes:
          'Uses per arc: 3. Per-battle/scene cap: 2. Track both limits in the UI.',
        feats: [
          {
            tier: 'champion',
            description: 'You can now use Fortunate Fey five times per arc.',
          },
        ],
      },
      {
        id: 'wood-elf-queens-eye',
        name: 'Queen’s Eye',
        summary:
          'ED 2+: once per battle, turn your miss with a ranged attack into a hit.',
        usage: 'once-per-battle',
        requirements: 'Escalation die 2+.',
        trigger: 'When you miss with a ranged attack.',
        effect: 'Turn that miss into a hit.',
        feats: [
          {
            tier: 'champion',
            description:
              'Once per arc, instead of turning a miss into a hit, you can turn a hit with a ranged attack into a critical hit.',
          },
        ],
      },
    ],
  },
  {
    id: 'gnome',
    name: 'Gnome',
    requiredPicks: 1,
    powers: [
      {
        id: 'gnome-confounding',
        name: 'Confounding',
        summary: 'Nat 16+ on an attack lets you also daze the target (EoNT).',
        usage: 'once-per-battle',
        trigger: 'When you roll a natural 16+ with an attack.',
        effect:
          'In addition to the attack’s normal effects, the target is dazed until the end of your next turn.',
        feats: [
          {
            tier: 'champion',
            description:
              'Instead of dazed, the target is weakened until the end of your next turn.',
          },
        ],
      },
      {
        id: 'gnome-fox-friend',
        name: 'Fox Friend',
        summary:
          'Once per battle, choose one fox trick: reroll a save; force an enemy to reroll a natural odd melee vs you; or gain an extra quick action.',
        usage: 'once-per-battle',
        trigger: 'On your turn (choose one of the options below).',
        effect:
          [
            'No no no no: As a free action, reroll a save.',
            'Saw it coming: As a free action, force an enemy to reroll a natural odd melee attack against you.',
            'Yep yep yep: On your turn, gain an extra quick action.',
          ].join(' '),
        notes:
          'You may choose only one of the listed options when you use this power.',
        feats: [
          {
            tier: 'champion',
            description:
              'You can use two different Fox Friend powers per battle.',
          },
        ],
      },
      {
        id: 'gnome-magicker',
        name: 'Magicker',
        summary:
          'Craft minor illusions; also pick either wizard cantrips or the Magic Missile feat (as if you were a wizard).',
        usage: 'passive',
        trigger: 'Illusions: as a standard action, at-will.',
        effect:
          'Illusions: Create a strong smell or a sound nearby. Nearby creatures that fail a normal save (11+) notice it; those that succeed may notice it but recognize it as not exactly real. Also choose one when you take this power: (A) you can cast cantrips as if you were a wizard; or (B) you gain the wizard’s Magic Missile feat as a bonus feat and can cast magic missile as if you were a wizard.',
        notes:
          'If you are already a wizard and take Magicker, either gain Cantrip Mastery as a bonus feat, or cast magic missile as if you were one level higher.',
        // Optional: add a rules hook later to grant the chosen bonus feat automatically
        // rulesHookId: 'gnome-magicker',
      },
    ],
  },
  {
    id: 'half-elf',
    name: 'Half-elf',
    requiredPicks: 1,
    powers: [
      {
        id: 'half-elf-concordance',
        name: 'Concordance',
        summary:
          'Your kin power changes over time—choose any other kin power at creation, then replace it each level-up with a power you’ve never had.',
        usage: 'passive',
        trigger:
          'Character creation; then at each level-up.',
        effect:
          'At creation, choose any kin power from any other PC kin as your kin power. Each time you level up, replace your current kin power with a different kin power you have never had before. You still have only one kin power at a time.',
        notes:
          'Intended for story-driven variety, not min-maxing; randomizing is encouraged. Example random table (1-30): push it; quick to fight; resourceful; comrade defender; never give in; that’s your best shot?; fighting free; killer instinct; lethal; eminence; highborn teleport; mystic initiative; elven grace; fortunate fey; queen’s eye (or a listed alternate); cruel; devious strike; shadow-step; confounding; magicker; evasive; perseverance; skitterfoot; rise above; halo; karmic soul; never say die; rugged; curse of chaos; deadly trickster.',
        // Optional: hook to let the engine swap powers at level-up
        rulesHookId: 'half-elf-concordance',
        feats: [
          {
            tier: 'champion',
            description:
              'You gain a second and different random kin power. Even if you normally choose your kin power, this second one is random and can duplicate a power you’ve had before.',
          },
        ],
      },
      {
        id: 'half-elf-resilient',
        name: 'Resilient',
        summary:
          'Once per battle, reroll a non-attack d20; if the reroll is a natural 11+, you may heal using a recovery as a free action.',
        usage: 'once-per-battle',
        trigger:
          'After you roll a d20 that is not an attack roll (e.g., save, skill check) and before its outcome is finalized.',
        effect:
          'Reroll that d20 and use the new result. If the rerolled die shows a natural 11+, you may heal using a recovery as a free action.',
      },
      {
        id: 'half-elf-surprising',
        name: 'Surprising',
        summary:
          'Once per battle, tweak one of your own natural odd d20 rolls by -1 to make it even (e.g., enabling “even” riders).',
        usage: 'once-per-battle',
        trigger:
          'When you roll a natural odd d20 result on your turn.',
        effect:
          'Subtract 1 from that natural odd result (e.g., 5 → 4), turning it into a natural even result. This can, for example, enable natural-even effects or drop a natural 3 to 2 for a two-weapon fighter to auto-hit.',
        feats: [
          {
            tier: 'champion',
            description:
              'Alternatively, you may add +1 to one of your own natural odd d20 rolls instead of subtracting 1.',
          },
        ],
      },
    ],
  },
  {
    id: 'halfling',
    name: 'Halfling',
    requiredPicks: 1,
    powers: [
      {
        id: 'halfling-evasive',
        name: 'Evasive',
        summary: 'Force a hitter to reroll against you with a penalty; keep the second result.',
        usage: 'once-per-battle',
        trigger: 'When an enemy hits you with an attack.',
        effect:
          'Force that enemy to reroll the attack against you with a -2 penalty and keep the second result.',
        feats: [
          {
            tier: 'champion',
            description:
              'The enemy’s reroll takes a -5 penalty instead of -2.',
          },
        ],
      },
      {
        id: 'halfling-perseverance',
        name: 'Perseverance',
        summary: 'Bank a reroll when you roll a natural 1 or 2 on an attack.',
        usage: 'passive',
        trigger:
          'Whenever you roll a natural 1 or 2 with an attack.',
        effect:
          'Gain an attack reroll that can be used on any later turn during this battle as a free action.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'You don’t have to use the reroll this battle; you can use it any time during this arc.',
          },
        ],
      },
      {
        id: 'halfling-skitterfoot',
        name: 'Skitterfoot',
        summary: 'Turn a failed disengage into a success; gain +2 AC vs opportunity attacks.',
        usage: 'once-per-battle',
        trigger:
          'When you fail a disengage check (free action).',
        effect:
          'Turn the failed disengage check into a success. You also gain a +2 AC bonus against opportunity attacks until the end of the battle.',
        notes:
          'The AC bonus from Skitterfoot doesn’t stack with itself.',
        feats: [
          {
            tier: 'champion',
            description:
              'You can use Skitterfoot twice per battle (the AC bonus vs opportunity attacks still does not stack).',
          },
        ],
      },
    ],
  },
  {
    id: 'troll-kin',
    name: 'Troll-kin',
    requiredPicks: 1,
    powers: [
      {
        id: 'troll-kin-fighting-free',
        name: 'Fighting Free',
        summary:
          'Nat 16+ attack roll can also be used as an immediate save; choose which resolves first.',
        usage: 'once-per-battle',
        trigger:
          'When you make an attack roll that is a natural 16+.',
        effect:
          'Use that same roll as both your attack roll and an immediate save against a condition of your choice. You choose whether the save or the attack resolves first.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'You can use Fighting Free on any roll that is a natural 13+.',
          },
          {
            tier: 'champion',
            description:
              'You gain a second use of Fighting Free in a battle when the escalation die reaches 3+.',
          },
        ],
      },
      {
        id: 'troll-kin-killer-instinct',
        name: 'Killer Instinct',
        summary:
          'After you rally at least once in a battle, your attacks deal +3 damage for the rest of the battle (scales by level).',
        usage: 'passive',
        trigger:
          'After you have rallied at least once this battle.',
        effect:
          'Your attacks deal +3 damage for the rest of the battle (5th level: +6; 8th level: +12). This bonus applies only to hits and crits, not miss damage.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'The damage bonus is cumulative in a battle, stacking each time you rally.',
          },
        ],
      },
      {
        id: 'troll-kin-lethal',
        name: 'Lethal',
        summary:
          'Escalation Die 1+: once per battle, reroll a non-natural 1 attack and keep the result you prefer.',
        usage: 'once-per-battle',
        requirements: 'Escalation die 1+.',
        trigger:
          'When you make an attack roll that is not a natural 1.',
        effect:
          'Reroll the attack and use the roll you prefer as the result.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'If the reroll is with a weapon attack and it hits, deal +7 damage (5th: +15; 8th: +25).',
          },
          {
            tier: 'champion',
            description:
              'If the lethal attack reroll is a natural 16+, you can use Lethal again later in this battle.',
          },
        ],
      },
    ],
  },
  {
    id: 'dragonic',
    name: 'Dragonic',
    requiredPicks: 1,
    powers: [
      {
        id: 'dragonic-breath-weapon',
        name: 'Breath Weapon',
        summary:
          'Quick-action close-quarters breath vs PD; deals tier-scaled energy damage.',
        usage: 'once-per-battle',
        trigger: 'On your turn, as a quick action.',
        effect:
          'Make a close-quarters breath weapon attack using your highest ability score vs one nearby enemy’s Physical Defense. On a hit, deal 10 damage (5th: 20; 8th: 50) of an energy type appropriate to your draconic ancestry.',
        notes:
          'Choose an energy type that fits your character (e.g., fire, cold, lightning, acid).',
        feats: [
          {
            tier: 'champion',
            description:
              'The breath weapon targets 1d3 nearby enemies in a group instead of just one.',
          },
        ],
      },
      {
        id: 'dragonic-energized-attacks',
        name: 'Energized Attacks',
        summary:
          'Escalation Die 2+: boost an attack for +10 dmg (hit or miss); Escalation Die 5+: boost a second attack (tier-scaled).',
        usage: 'once-per-battle',
        requirements: 'Escalation die 2+ for the first boost; 5+ for the second.',
        trigger:
          'When you make an attack and meet the escalation die requirement.',
        effect:
          'Once per battle when the escalation die is 2+, add +10 damage to the attack’s target (hit or miss). If the attack has multiple targets, choose one to take the extra damage. Once per battle when the escalation die is 5+, you can boost a second attack. Damage scales: 5th +20; 8th +40. The bonus damage matches your draconic energy type.',
        feats: [
          {
            tier: 'champion',
            description:
              'When you boost an attack, you may apply the bonus damage to two targets of that attack instead of one.',
          },
        ],
      },
      {
        id: 'dragonic-rise-above',
        name: 'Rise Above',
        summary:
          'Ignore one condition’s effects for your entire turn (ongoing dmg counts as a condition “dose”).',
        usage: 'once-per-battle',
        trigger: 'On your turn, before resolving your actions.',
        effect:
          'For this turn, ignore the effects of one condition affecting you. Ongoing damage counts as a condition, but you ignore only one “dose” if multiple are stacked. You can still attempt saves at end of turn as normal.',
        feats: [
          {
            tier: 'champion',
            description:
              'Ignore the effects of up to three conditions for the turn (each “dose” of ongoing damage counts as one condition).',
          },
        ],
      },
    ],
  },
  {
    id: 'forgeborn',
    name: 'Forgeborn',
    requiredPicks: 1,
    powers: [
      {
        id: 'forgeborn-never-say-die',
        name: 'Never Say Die',
        summary:
          'The first time each battle you drop to 0 hp, roll an easy save (6+) if you have a recovery; on success, stay on your feet and heal.',
        usage: 'once-per-battle',
        trigger:
          'The first time each battle you drop to 0 hp or below and you have a recovery available.',
        effect:
          'Roll an easy save (6+). On a success, instead of falling unconscious, you remain on your feet and heal using a recovery. Add the recovery’s hp to 0 to set your new total. On a failure, you fall unconscious, but this power is not expended and you may use it again the next time you drop.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'You don’t die at five Skulls; you die at six. You also don’t die at -½ your hp; you die at -⅔ your hp.',
          },
          {
            tier: 'champion',
            description:
              'Add the escalation die to your death saves. (Requires the adventurer feat.)',
          },
        ],
      },
      {
        id: 'forgeborn-rugged',
        name: 'Rugged',
        summary:
          'Your recovery dice increase by one size (d4→d6→d8→d10→d12→2d6→2d8).',
        usage: 'passive',
        trigger: 'Always on.',
        effect:
          'Increase your recovery die size by one step. Example: d8 → d10.',
        feats: [
          {
            tier: 'adventurer',
            description: 'Increase your total number of recoveries by +1.',
          },
        ],
      },
    ],
  },
  {
    id: 'holy-one',
    name: 'Holy One',
    requiredPicks: 1,
    powers: [
      {
        id: 'holy-one-halo',
        name: 'Halo',
        summary:
          '+2 to all defenses each battle until you’re hit (or battle ends); can restart once at Escalation Die 2+ (feat).',
        usage: 'passive',
        trigger:
          'As you roll initiative each battle.',
        effect:
          'Gain a +2 bonus to all defenses until you are hit by an attack or until the battle ends.',
        notes:
          'Think of your halo “flicking on” in the presence of danger.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'Once per battle as a free action when the escalation die is 2+, you can restart Halo.',
          },
        ],
      },
      {
        id: 'holy-one-karmic-soul',
        name: 'Karmic Soul',
        summary:
          'Natural 7 on saves/skill rolls is a success; at champion, nat 7 on attacks hits.',
        usage: 'passive',
        trigger:
          'Whenever you roll a save or a skill check (and at champion tier, attacks).',
        effect:
          'Every natural 7 you roll on a save or a skill roll counts as a success.',
        notes:
          'A “better than normal” success—great for a little righteous swagger.',
        feats: [
          {
            tier: 'champion',
            description:
              'Every natural 7 you roll on an attack is a hit.',
          },
        ],
      },
      {
        id: 'holy-one-overworlds-wings',
        name: 'Overworld’s Wings',
        summary:
          'Gain flight until end of turn (scales to end of next turn at 5th; 1/arc full-battle flight at 8th).',
        usage: 'once-per-battle',
        trigger:
          'Once per battle as a free action on your turn.',
        effect:
          'You gain flight until the end of your turn. At 5th level, flight lasts until the end of your next turn. At 8th level, you also gain one per arc use of flight that lasts until the end of the battle.',
        notes:
          'See GMG flight rules; while this is active, you’re flying for movement/engagement purposes.',
        feats: [
          {
            tier: 'adventurer',
            description:
              'While flying, you gain a +4 bonus to disengage checks.',
          },
        ],
      },
    ],
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    requiredPicks: 1,
    powers: [
      {
        id: 'tiefling-curse-of-chaos',
        name: 'Curse of Chaos',
        summary:
          'When a nearby enemy rolls a natural 1-5, turn it into a natural 1 and improvise a backfiring curse.',
        usage: 'once-per-battle',
        trigger:
          'As a free action when a nearby enemy rolls a natural 1-5 on an attack or a save.',
        effect:
          'Change that roll into a natural 1 and apply a fitting curse showing how their attempt backfires (e.g., they deal half damage to themselves and are dazed until the end of your next turn).',
        notes:
          'GM adjudication encouraged: this can go a bit beyond typical 1/battle kin powers, but the GM can scale effects down or call for an unmodified d20 to validate an ambitious suggestion.',
        feats: [
          {
            tier: 'champion',
            description:
              'Whenever a nearby enemy rolls a natural 1 on an attack against you, you gain a bonus immediate use of Curse of Chaos against them (even if you’ve already used the power this battle).',
          },
        ],
      },
      {
        id: 'tiefling-deadly-trickster',
        name: 'Deadly Trickster',
        summary:
          'Your natural initiative roll grants a temporary bonus: odd = a trick die; even = +2 to your first attack.',
        usage: 'passive',
        trigger: 'At the start of each battle, when you roll initiative.',
        effect:
          'If your natural initiative roll is odd: it becomes a trick die. Once per battle as a free action when the escalation die is 2+, give that trick die to a nearby ally or enemy who is about to make an attack roll; the trick die’s natural result becomes the natural result of their roll instead. If your natural initiative roll is even: you gain +2 to the first attack roll you make in this battle.',
        feats: [
          {
            tier: 'champion',
            description:
              'When your initiative roll is even, you also get to use it as a trick die once the escalation die is 3+ (in addition to the +2 on your first attack).',
          },
        ],
      },
    ],
  },
];
