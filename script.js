function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollDice(count, sides) {
  let total = 0;
  let rolls = [];
  for (let i = 0; i < count; i++) {
    let r = rollDie(sides);
    total += r;
    rolls.push(r);
  }
  return { total, rolls };
}

function generateLoot() {
  let output = "";
  const types = ["Weapon", "Shield", "Off-hand", "Armor", "Head", "Jewellery", "Treasure"];
  const type = types[rollDie(types.length) - 1];
  output += `Type: ${type}\n`;

  // rarity
  let rarityRoll = rollDie(8);
  let rarity = "Common";
  let traits = 0;
  if (rarityRoll >= 6 && rarityRoll <= 7) {
    rarity = "Rare";
    traits = 1;
  } else if (rarityRoll === 8) {
    rarity = "Epic";
    traits = 2;
  }
  if (type !== "Treasure") {
    output += `Rarity: ${rarity}\n`;
  }

  // sockets (for equipment except Jewellery & Treasure)
  if (["Weapon", "Shield", "Off-hand", "Armor", "Head"].includes(type)) {
    let sockets = rollDie(3) - 1; // 0–2 sockets
    output += `Sockets: ${sockets}\n`;
  }

  // weapon subtype
  if (type === "Weapon") {
    let weaponRoll = rollDie(6);
    let weaponType;
    switch (weaponRoll) {
      case 1: weaponType = "Light Melee"; break;
      case 2: weaponType = "Medium Melee"; break;
      case 3: weaponType = "Heavy Melee"; break;
      case 4: weaponType = "Ranged"; break;
      case 5: weaponType = "Thrown (1d4)"; break;
      case 6: weaponType = "Ammo (1d4)"; break;
    }
    output += `Subtype: ${weaponType}\n`;
    if (weaponType.includes("1d4")) {
      let extra = rollDie(4);
      output += `Rolled: ${extra}\n`;
    }
  }
  // shields
  if (type === "Shield") {
    let r = rollDie(8);
    if (r <= 3) output += "Shield: Armor +1\n";
    else if (r <= 6) output += "Shield: Armor +1, Block\n";
    else if (r === 7) output += "Shield: Armor +1, Energy Shield +1\n";
    else output += "Shield: Armor +1, Energy Shield +1, Block\n";
  }

  // off-hand
  if (type === "Off-hand") {
    let r = rollDie(8);
    let desc = "Off-hand: Spirit Shield +1";
    if (r >= 4 && r <= 5) desc += ", +Trait";
    if (r >= 6 && r <= 7) desc += ", +Socket";
    if (r === 8) desc += ", +Trait, +Socket";
    output += desc + "\n";
  }

  // head
  if (type === "Head") {
    let r = rollDie(8);
    if (r <= 2) output += "Head: Armor +1\n";
    else if (r === 3) output += "Head: Armor +1, +Trait\n";
    else if (r <= 5) output += "Head: Spirit Shield +1\n";
    else if (r === 6) output += "Head: Spirit Shield +1, +Trait\n";
    else output += "Head: Armor +1, Spirit Shield +1\n";
  }

  // jewellery
  if (type === "Jewellery") {
    let r = rollDie(8);
    if (r === 1) output += "Jewellery: 1 Trait\n";
    else if (r === 2) output += "Jewellery: 2 Traits\n";
    else if (r === 3) output += "Jewellery: 3 Traits\n";
    else if (r >= 4 && r <= 6) output += "Jewellery: Socket\n";
    else if (r === 7) output += "Jewellery: Trait + Socket\n";
    else if (r === 8) output += "Jewellery: Trait + Socket\n";
  }

  // treasure
  if (type === "Treasure") {
    let r = rollDie(8);
    if (r === 1) {
      let coins = rollDie(6);
      output += `Treasure: Trinket + ${coins} coins\n`;
    } else if (r === 2) {
      let trinkets = rollDie(4);
      let coins = rollDie(8);
      output += `Treasure: ${trinkets} trinkets + ${coins} coins\n`;
    } else if (r === 3) {
      let trinkets = rollDie(6);
      let coins = rollDice(2,6);
      output += `Treasure: ${trinkets} trinkets + ${coins.total} coins (rolled ${coins.rolls})\n`;
    } else if (r === 4) {
      let trinkets = rollDice(2,4);
      let coins = rollDice(2,8);
      output += `Treasure: ${trinkets.total} trinkets (rolled ${trinkets.rolls}) + ${coins.total} coins (rolled ${coins.rolls})\n`;
    } else if (r === 5) {
      output += "Treasure: Scroll\n";
    } else if (r === 6) {
      output += "Treasure: Add Socket\n";
    } else if (r === 7) {
      output += "Treasure: Reroll Trait\n";
    } else if (r === 8) {
      output += "Treasure: Improve Rarity\n";
    }
  }

  // add traits count
  if (traits > 0) {
    output += `Traits: ${traits}\n`;
  }

  document.getElementById("output").innerText = output;
}
