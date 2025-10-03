/* Loot generator
   - Type roll (d8)
   - For Weapon/Shield/Off-hand/Armor/Head/Jewellery -> roll rarity (d8: 1-5 common (0 traits), 6-7 rare (1 trait), 8 epic (2 traits))
   - For Weapon/Shield/Off-hand/Armor/Head -> roll sockets (0-2)
   - Implements the sub-tables the user supplied; dice expressions (1d4, 2d6 etc.) are rolled and shown.
*/

// ---------- Utilities ----------
function rollDie(sides){ return Math.floor(Math.random() * sides) + 1; }

function rollDice(count, sides){
  const rolls = [];
  for(let i=0;i<count;i++) rolls.push( rollDie(sides) );
  const total = rolls.reduce((s,v)=>s+v,0);
  return { total, rolls };
}

// Parse "XdY" strings and return {total, rolls, text}
function rollDiceExpr(expr){
  const m = expr.match(/^(\d+)d(\d+)$/i);
  if(!m) return { total: null, rolls: null, text: expr };
  const count = parseInt(m[1],10), sides = parseInt(m[2],10);
  const res = rollDice(count, sides);
  return { total: res.total, rolls: res.rolls, text: `${expr} → [${res.rolls.join(", ")}] = ${res.total}` };
}

// Unique random picks from an array
function pickRandomUnique(arr, count){
  if(count <= 0) return [];
  const out = [];
  const copy = arr.slice();
  for(let i=0;i<count && copy.length>0;i++){
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx,1)[0]);
  }
  return out;
}

// ---------- Data pools ----------
const traitPool = [
  "Glows faintly in the dark",
  "Whispers when nobody holds it",
  "Lighter than it should be",
  "Unnaturally sharp",
  "+1 fire damage on hit",
  "Vampiric (heal small amount on hit)",
  "Ethereal (passes through non-living matter occasionally)",
  "Bound to first wielder",
  "Shocks target on hit",
  "+2 to skill with this item",
  "Regenerates wearer slowly",
  "Etched with unreadable runes"
];

// Weapon subtype item lists (items include damage/notes exactly as you provided)
const weapons = {
  "Light Melee": [
    {name:"Dagger", note:"Exploding", dmg:"d6"},
    {name:"Claw", note:"Regain 1 STR", dmg:"d6"},
    {name:"Sabre", note:"+1 dmg", dmg:"d6"},
    {name:"Hatchet", note:"+1 piercing", dmg:"d6"},
    {name:"Club", note:"Stun disadvantage", dmg:"d6"},
    {name:"Rapier", note:"Exploding", dmg:"d6"}
  ],
  "Medium Melee": [
    {name:"Long sword", note:"+1 dmg", dmg:"d6 (1h) / d8 (2h)"},
    {name:"Spear", note:"Reach", dmg:"d6 (1h) / d8 (2h)"},
    {name:"War hammer", note:"Stun disadvantage", dmg:"d6 (1h) / d8 (2h)"},
    {name:"Mace", note:"+1 dmg adjacent", dmg:"d6 (1h) / d8 (2h)"},
    {name:"Scepter", note:"+1 elemental dmg", dmg:"d6 (1h) / d8 (2h)"},
    {name:"Battle axe", note:"+1 piercing", dmg:"d6 (1h) / d8 (2h)"}
  ],
  "Heavy Melee": [
    {name:"Staff", note:"+1 armor", dmg:"d10 (bulky)"},
    {name:"Great sword", note:"+1 dmg", dmg:"d10 (bulky)"},
    {name:"Double axe", note:"+1 piercing", dmg:"d10 (bulky)"},
    {name:"Maul", note:"Stun disadvantage", dmg:"d10 (bulky)"},
    {name:"Morningstar", note:"+1 dmg adjacent", dmg:"d10 (bulky)"},
    {name:"Poleaxe", note:"+1 piercing", dmg:"d10 (bulky)"}
  ],
  "Ranged": [
    {name:"Bow", note:"", dmg:"d6 (varied, bulky)"},
    {name:"Recurve bow", note:"Exploding", dmg:"d6 (varied, bulky)"},
    {name:"Crossbow", note:"", dmg:"d8 (varied, bulky)"},
    {name:"Heavy crossbow", note:"Shoot or run", dmg:"d10 (varied, bulky)"},
    {name:"Wand", note:"One hand, elemental", dmg:"d6"},
    {name:"Rod", note:"+1 summon dmg", dmg:"d8"}
  ],
  "Thrown": [
    {name:"Light spear", note:"Thrown", dmg:"d6"},
    {name:"Throwing axe", note:"Thrown", dmg:"d6"},
    {name:"Throwing knife", note:"Thrown", dmg:"d6"}
  ],
  "Ammo": [
    {name:"Ammo pack", note:"Uses rolled (1d4)", dmg:"varies"}
  ]
};

// Armor table
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

// Shield subtable (user-specified)
function shieldOutcomeFromRoll(r){
  if(r <= 3) return "Armor +1";
  if(r <= 6) return "Armor +1, Block";
  if(r === 7) return "Armor +1, Energy Shield +1";
  return "Armor +1, Energy Shield +1, Block";
}

// Off-hand subtable
function offhandOutcomeFromRoll(r){
  if(r <= 3) return "Spirit Shield +1";
  if(r <= 5) return "Spirit Shield +1, +Trait";
  if(r <= 7) return "Spirit Shield +1, +Socket";
  return "Spirit Shield +1, +Trait, +Socket";
}

// Head subtable
function headOutcomeFromRoll(r){
  if(r <= 2) return "Armor +1";
  if(r === 3) return "Armor +1, +Trait";
  if(r <= 5) return "Spirit Shield +1";
  if(r === 6) return "Spirit Shield +1, +Trait";
  return "Armor +1, Spirit Shield +1";
}

// Jewellery
function jewelleryOutcomeFromRoll(r){
  if(r <= 3) return "Trait";
  if(r <= 6) return "Socket";
  return "Trait, Socket";
}

// Treasure handling (rolls dice where required)
function treasureOutcomeFromRoll(r){
  switch(r){
    case 1: {
      const coins = rollDie(6);
      return `Trinket + ${coins} coins (rolled 1d6 → ${coins})`;
    }
    case 2: {
      const trinkets = rollDie(4);
      const coins = rollDie(8);
      return `${trinkets} trinkets + ${coins} coins (rolled 1d4 → ${trinkets}, 1d8 → ${coins})`;
    }
    case 3: {
      const trinkets = rollDie(6);
      const coins = rollDice(2,6);
      return `${trinkets} trinkets + ${coins.total} coins (rolled 1d6 → ${trinkets}; 2d6 → [${coins.rolls.join(", ")}] = ${coins.total})`;
    }
    case 4: {
      const trinkets = rollDice(2,4);
      const coins = rollDice(2,8);
      return `${trinkets.total} trinkets (2d4 → [${trinkets.rolls.join(", ")}] = ${trinkets.total}) + ${coins.total} coins (2d8 → [${coins.rolls.join(", ")}] = ${coins.total})`;
    }
    case 5:
      return "Scroll";
    case 6:
      return "Add socket";
    case 7:
      return "Reroll trait";
    case 8:
      return "Improve rarity";
    default:
      return "Unknown treasure";
  }
}

// ---------- Rarity (d8 -> 1-5 common, 6-7 rare, 8 epic) ----------
function rollRarity(){
  const r = rollDie(8);
  if(r <= 5) return { name: "Common", traits: 0, roll: r };
  if(r <= 7) return { name: "Rare", traits: 1, roll: r };
  return { name: "Epic", traits: 2, roll: r };
}

// ---------- Main generator ----------
function generateLoot(){
  try {
    const out = [];
    const typeRoll = rollDie(8);
    const typeMap = {
      1: "Weapon",
      2: "Shield",
      3: "Off-hand",
      4: "Armor",
      5: "Head",
      6: "Jewellery",
      7: "Potion",
      8: "Treasure"
    };
    const type = typeMap[typeRoll] || "Unknown";

    out.push(`Type roll: ${typeRoll} → ${type}`);

    // Rarity (only for specific types)
    let rarity = null;
    if(["Weapon","Shield","Off-hand","Armor","Head","Jewellery"].includes(type)){
      rarity = rollRarity();
      out.push(`Rarity roll: ${rarity.roll} → ${rarity.name} (traits: ${rarity.traits})`);
    }

    // Sockets (for these types)
    let sockets = null;
    if(["Weapon","Shield","Off-hand","Armor","Head"].includes(type)){
      sockets = rollDie(3) - 1; // 0-2
      out.push(`Sockets: ${sockets}`);
    }

    // Now handle type-specific details
    if(type === "Weapon"){
      const subtypeRoll = rollDie(6); // user requested a d6 for weapon subtype
      const subtypeMap = {
        1: "Light Melee",
        2: "Medium Melee",
        3: "Heavy Melee",
        4: "Ranged",
        5: "Thrown",
        6: "Ammo"
      };
      const subtype = subtypeMap[subtypeRoll];
      out.push(`Weapon subtype roll: ${subtypeRoll} → ${subtype}`);

      // pick a random entry from that subtype list
      const list = weapons[subtype] || [];
      const item = list[ Math.floor(Math.random() * list.length) ];
      if(item){
        out.push(`Item: ${item.name} — Damage: ${item.dmg}${item.note ? ` — ${item.note}` : ""}`);
      } else {
        out.push("Item: (no item configured for this subtype)");
      }

      // if thrown or ammo, show uses (1d4)
      if(subtype === "Thrown" || subtype === "Ammo"){
        const uses = rollDiceExpr("1d4");
        out.push(`Uses roll: ${uses.text}`);
      }
    }

    if(type === "Shield"){
      const r = rollDie(8);
      out.push(`Shield roll: ${r} → ${shieldOutcomeFromRoll(r)}`);
    }

    if(type === "Off-hand"){
      const r = rollDie(8);
      const text = offhandOutcomeFromRoll(r);
      out.push(`Off-hand roll: ${r} → ${text}`);
      // if text includes +Trait/ +Socket, expand them:
      if(text.includes("+Trait")){
        const t = pickRandomUnique(traitPool, 1);
        out.push(` - Added trait: ${t[0]}`);
      }
      if(text.includes("+Socket")){
        out.push(" - Added: +Socket");
      }
    }

    if(type === "Armor"){
      const idx = rollDie(armorTable.length) - 1;
      out.push(`Armor roll: ${idx+1} → ${armorTable[idx]}`);
    }

    if(type === "Head"){
      const r = rollDie(8);
      const text = headOutcomeFromRoll(r);
      out.push(`Head roll: ${r} → ${text}`);
      if(text.includes("+Trait")){
        const t = pickRandomUnique(traitPool, 1);
        out.push(` - Added trait: ${t[0]}`);
      }
    }

    if(type === "Jewellery"){
      const r = rollDie(8);
      const text = jewelleryOutcomeFromRoll(r);
      out.push(`Jewellery roll: ${r} → ${text}`);
      if(text.includes("Trait")){
        const t = pickRandomUnique(traitPool, 1);
        out.push(` - Trait: ${t[0]}`);
      }
      if(text.includes("Socket")){
        out.push(" - Added: +Socket");
      }
    }

    if(type === "Potion"){
      // user left potion details TBD — present a placeholder and a simple randomized effect
      const simplePotions = [
        "Minor Healing (restores small HP)",
        "Minor Mana (restores small MP)",
        "Antitoxin (cures poisons briefly)",
        "Elixir of Swiftness (+movement briefly)"
      ];
      const p = simplePotions[ Math.floor(Math.random() * simplePotions.length) ];
      out.push(`Potion: ${p}`);
    }

    if(type === "Treasure"){
      const r = rollDie(8);
      out.push(`Treasure roll: ${r} → ${treasureOutcomeFromRoll(r)}`);
    }

    // If rarity requested traits (from the d8 rarity roll), pick them now and show
    if(rarity && rarity.traits > 0){
      const t = pickRandomUnique(traitPool, rarity.traits);
      out.push(`Rarity traits: ${t.join("; ")}`);
    }

    // Final output
    document.querySelector("#output pre").innerText = out.join("\n");
  } catch(err){
    document.querySelector("#output pre").innerText = `Error generating loot: ${err.message}`;
    console.error(err);
  }
}

// ---------- Wire buttons (safe: after DOM loaded) ----------
document.addEventListener("DOMContentLoaded", ()=> {
  const btn = document.getElementById("generate-btn");
  const clear = document.getElementById("clear-btn");
  btn.addEventListener("click", generateLoot);
  clear.addEventListener("click", ()=> document.querySelector("#output pre").innerText = "");
});
