// --- Utility dice roller ---
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// --- Main type table (d8) ---
const typeTable = {
  1: "Weapon",
  2: "Shield",
  3: "Off-hand",
  4: "Armor",
  5: "Head",
  6: "Jewellery",
  7: "Potion",
  8: "Treasure"
};

// --- Rarity table ---
const rarityTable = {
  1: "Common",
  2: "Uncommon",
  3: "Rare",
  4: "Epic",
  5: "Legendary",
  6: "Mythic"
};

// --- Weapon subtypes with examples ---
const weaponSubtypes = {
  "Light Melee": [
    {name: "Dagger", note: "Exploding", dmg: "d6"},
    {name: "Claw", note: "Regain 1 STR", dmg: "d6"},
    {name: "Sabre", note: "+1 dmg", dmg: "d6"},
    {name: "Hatchet", note: "+1 piercing", dmg: "d6"},
    {name: "Club", note: "Stun disadvantage", dmg: "d6"},
    {name: "Rapier", note: "Exploding", dmg: "d6"}
  ],
  "Medium Melee": [
    {name: "Long sword", note: "+1 dmg", dmg: "d6 (1h) / d8 (2h)"},
    {name: "Spear", note: "Reach", dmg: "d6 (1h) / d8 (2h)"},
    {name: "War hammer", note: "Stun disadvantage", dmg: "d6 (1h) / d8 (2h)"},
    {name: "Mace", note: "+1 dmg adjacent", dmg: "d6 (1h) / d8 (2h)"},
    {name: "Scepter", note: "+1 elemental dmg", dmg: "d6 (1h) / d8 (2h)"},
    {name: "Battle axe", note: "+1 piercing", dmg: "d6 (1h) / d8 (2h)"}
  ],
  "Heavy Melee": [
    {name: "Staff", note: "+1 armor", dmg: "d10"},
    {name: "Great sword", note: "+1 dmg", dmg: "d10"},
    {name: "Double axe", note: "+1 piercing", dmg: "d10"},
    {name: "Maul", note: "Stun disadvantage", dmg: "d10"},
    {name: "Morningstar", note: "+1 dmg adjacent", dmg: "d10"},
    {name: "Poleaxe", note: "+1 piercing", dmg: "d10"}
  ],
  "Ranged": [
    {name: "Bow", note: "", dmg: "d6"},
    {name: "Recurve bow", note: "Exploding", dmg: "d6"},
    {name: "Crossbow", note: "", dmg: "d8"},
    {name: "Heavy crossbow", note: "Shoot or run", dmg: "d10"},
    {name: "Wand", note: "One hand, elemental", dmg: "d6"},
    {name: "Rod", note: "+1 summon dmg", dmg: "d8"}
  ],
  "Thrown": [
    {name: "Light spear", note: "", dmg: "d6"},
    {name: "Throwing axe", note: "", dmg: "d6"},
    {name: "Throwing knife", note: "", dmg: "d6"}
  ]
};

// --- Armor table ---
const armorTable = [
  {name: "Coat", defense: "1 armor"},
  {name: "Vestment", defense: "1 energy shield"},
  {name: "Brigandine", defense: "2 armor"},
  {name: "Robe", defense: "2 energy shield"},
  {name: "Garb", defense: "1 armor + 1 energy shield"},
  {name: "Garb", defense: "1 armor + 1 energy shield"},
  {name: "Chainmail", defense: "2 armor + 1 energy shield"},
  {name: "Raiment", defense: "1 armor + 2 energy shield"}
];

// --- Main Loot Generator ---
function generateLoot() {
  const typeRoll = rollDie(8);
  const type = typeTable[typeRoll];

  let result = `Rolled Type (${typeRoll}): ${type}`;

  // Rarity
  if (["Weapon","Shield","Off-hand","Armor","Head","Jewellery"].includes(type)) {
    const rarityRoll = rollDie(6);
    const rarity = rarityTable[rarityRoll];
    result += `\nRarity: ${rarity}`;
  }

  // Sockets
  if (["Weapon","Shield","Off-hand","Armor","Head"].includes(type)) {
    const sockets = rollDie(3) - 1; // 0–2
    result += `\nSockets: ${sockets}`;
  }

  // Weapon subtype
  if (type === "Weapon") {
    const subtypeRoll = rollDie(5); // Light, Medium, Heavy, Ranged, Thrown
    const subtypeNames = ["Light Melee","Medium Melee","Heavy Melee","Ranged","Thrown"];
    const subtype = subtypeNames[subtypeRoll-1];

    const options = weaponSubtypes[subtype];
    const item = options[rollDie(options.length)-1];

    result += `\nSubtype: ${subtype}`;
    result += `\nItem: ${item.name} (Damage: ${item.dmg}${item.note ? ", " + item.note : ""})`;
  }

  // Armor items
  if (type === "Armor") {
    const item = armorTable[rollDie(armorTable.length)-1];
    result += `\nItem: ${item.name} (${item.defense})`;
  }

  document.getElementById("loot-output").textContent = result;
}
