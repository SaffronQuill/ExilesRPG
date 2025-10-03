// --- Utility functions ---
function roll(n) {
  return Math.floor(Math.random() * n) + 1;
}

function rollDice(expr) {
  const match = expr.match(/(\d+)d(\d+)/);
  if (!match) return expr;
  let [ , count, sides ] = match;
  count = parseInt(count); sides = parseInt(sides);
  let total = 0, rolls = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * sides) + 1;
    rolls.push(r); total += r;
  }
  return `${expr} → [${rolls.join(", ")}] = ${total}`;
}

// --- Rarity system ---
function rollRarity() {
  const r = roll(8);
  if (r <= 5) return { rarity: "Common", traits: 0 };
  if (r <= 7) return { rarity: "Rare", traits: 1 };
  return { rarity: "Epic", traits: 2 };
}

// --- Weapon tables ---
const weaponTables = {
  lightMelee: [
    "Dagger (d6, exploding)",
    "Claw (d6, regain 1 STR)",
    "Sabre (d6, +1 dmg)",
    "Hatchet (d6, +1 piercing)",
    "Club (d6, stun disadvantage)",
    "Rapier (d6, exploding)"
  ],
  mediumMelee: [
    "Long sword (d6/1h, d8/2h, +1 dmg)",
    "Spear (d6/1h, d8/2h, reach)",
    "War hammer (d6/1h, d8/2h, stun disadvantage)",
    "Mace (d6/1h, d8/2h, +1 dmg adjacent)",
    "Scepter (d6/1h, d8/2h, +1 elemental dmg)",
    "Battle axe (d6/1h, d8/2h, +1 piercing)"
  ],
  heavyMelee: [
    "Staff (d10, bulky, +1 armor)",
    "Great sword (d10, bulky, +1 dmg)",
    "Double axe (d10, bulky, +1 piercing)",
    "Maul (d10, bulky, stun disadvantage)",
    "Morningstar (d10, bulky, +1 dmg adjacent)",
    "Poleaxe (d10, bulky, +1 piercing)"
  ],
  ranged: [
    "Bow (d6, bulky)",
    "Recurve bow (d6, bulky, exploding)",
    "Crossbow (d8, bulky)",
    "Heavy crossbow (d10, bulky, shoot or run)",
    "Wand (d6, one hand, elemental)",
    "Rod (d8, +1 summon dmg)"
  ],
  thrown: [
    "Light spear (d6, thrown)",
    "Throwing axe (d6, thrown)",
    "Throwing knife (d6, thrown)"
  ]
};

// --- Other tables ---
const armorTable = [
  "Coat (1 armor)",
  "Vestment (1 energy shield)",
  "Brigandine (2 armor)",
  "Robe (2 energy shield)",
  "Garb (1 armor + 1 energy shield)",
  "Garb (1 armor + 1 energy shield)",
  "Chainmail (2 armor + 1 energy shield)",
  "Raiment (1 armor + 2 energy shield)"
];

const shieldTable = [
  "Armor +1",
  "Armor +1",
  "Armor +1",
  "Armor +1, Block",
  "Armor +1, Block",
  "Armor +1, Block",
  "Armor +1, Energy Shield +1",
  "Armor +1, Energy Shield +1, Block"
];

const offhandTable = [
  "Spirit Shield +1",
  "Spirit Shield +1",
  "Spirit Shield +1",
  "Spirit Shield +1, +Trait",
  "Spirit Shield +1, +Trait",
  "Spirit Shield +1, +Socket",
  "Spirit Shield +1, +Socket",
  "Spirit Shield +1, +Trait, +Socket"
];

const headTable = [
  "Armor +1",
  "Armor +1",
  "Armor +1, +Trait",
  "Spirit Shield +1",
  "Spirit Shield +1",
  "Spirit Shield +1, +Trait",
  "Armor +1, Spirit Shield +1",
  "Armor +1, Spirit Shield +1"
];

const jewelleryTable = [
  "Trait",
  "Trait",
  "Trait",
  "Socket",
  "Socket",
  "Socket",
  "Trait, Socket",
  "Trait, Socket"
];

const treasureTable = [
  "Trinket / " + rollDice("1d6") + " coins",
  rollDice("1d4") + " trinkets / " + rollDice("1d8") + " coins",
  rollDice("1d6") + " trinkets / " + rollDice("2d6") + " coins",
  rollDice("2d4") + " trinkets / " + rollDice("2d8") + " coins",
  "Scroll",
  "Add socket",
  "Reroll trait",
  "Improve rarity"
];

// --- Main generator ---
function generateLoot() {
  const typeRoll = roll(8);
  let output = `You rolled a ${typeRoll}\n`;

  switch (typeRoll) {
    case 1: { // Weapon
      output += "Type: Weapon\n";
      const rarityW = rollRarity();
      output += `Rarity: ${rarityW.rarity}\n`;
      const weaponTypeRoll = roll(6);
      let weaponList;
      if (weaponTypeRoll === 1) weaponList = weaponTables.lightMelee;
      else if (weaponTypeRoll === 2) weaponList = weaponTables.mediumMelee;
      else if (weaponTypeRoll === 3) weaponList = weaponTables.heavyMelee;
      else if (weaponTypeRoll === 4) weaponList = weaponTables.ranged;
      else weaponList = weaponTables.thrown;
      const weapon = weaponList[roll(weaponList.length)-1];
      output += `Weapon: ${weapon}\n`;
      break;
    }

    case 2: { // Shield
      output += "Type: Shield\n";
      const rarityS = rollRarity();
      output += `Rarity: ${rarityS.rarity}\n`;
      output += `Result: ${shieldTable[roll(8)-1]}\n`;
      break;
    }
