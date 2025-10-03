// Utility dice rollers
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// Step 1: Main type table (d8)
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

// Step 2: Rarity table
const rarityTable = {
  1: "Common",
  2: "Uncommon",
  3: "Rare",
  4: "Epic",
  5: "Legendary",
  6: "Mythic"
};

// Step 3: Sockets roll (d3 for simplicity, adjust if you want more)
function rollSockets() {
  return rollDie(3) - 1; // gives 0–2 sockets
}

// Step 4: Weapon subtype table (d6)
const weaponSubtypes = {
  1: "Light Melee",
  2: "Medium Melee",
  3: "Heavy Melee",
  4: "Ranged",
  5: "Thrown (d4 uses)",
  6: "Ammo (d4 uses)"
};

// Main loot generator
function generateLoot() {
  // Roll for Type
  const typeRoll = rollDie(8);
  const type = typeTable[typeRoll];

  let result = `Rolled Type (${typeRoll}): ${type}`;

  // If Type requires Rarity
  if (["Weapon", "Shield", "Off-hand", "Armor", "Head", "Jewellery"].includes(type)) {
    const rarityRoll = rollDie(6);
    const rarity = rarityTable[rarityRoll];
    result += ` | Rarity: ${rarity}`;
  }

  // If Type requires Sockets
  if (["Weapon", "Shield", "Off-hand", "Armor", "Head"].includes(type)) {
    const sockets = rollSockets();
    result += ` | Sockets: ${sockets}`;
  }

  // If Type is Weapon, roll subtype
  if (type === "Weapon") {
    const subtypeRoll = rollDie(6);
    const subtype = weaponSubtypes[subtypeRoll];
    result += ` | Subtype: ${subtype}`;
  }

  document.getElementById("loot-output").textContent = result;
}
