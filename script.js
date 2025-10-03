// ---------- Utilities ----------
function rollDie(sides){ return Math.floor(Math.random() * sides) + 1; }
function rollDice(count, sides){
  const rolls = [];
  for(let i=0;i<count;i++) rolls.push( rollDie(sides) );
  const total = rolls.reduce((s,v)=>s+v,0);
  return { total, rolls };
}
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

// Replace placeholders [element] and [Attribute]
function applyPlaceholders(trait){
  const elements = ["Fire","Cold","Lightning"];
  const attributes = ["STR","DEX","WIL"];
  return trait
    .replace(/\[element\]/g, elements[rollDie(elements.length)-1])
    .replace(/\[Attribute\]/g, attributes[rollDie(attributes.length)-1]);
}

// ---------- Data ----------
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
    {name:"Bow", note:"", dmg:"d6"},
    {name:"Recurve bow", note:"Exploding", dmg:"d6"},
    {name:"Crossbow", note:"", dmg:"d8"},
    {name:"Heavy crossbow", note:"Shoot or run", dmg:"d10"},
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

// ---------- Traits ----------
const weaponTraits = [
  {name:"+damage", desc:"The weapon deals an extra +1 damage. Stacks."},
  {name:"+elemental damage", desc:"The weapon adds an extra +1 elemental damage. Stacks."},
  {name:"Elemental", desc:"The weapon damage type changes to elemental."},
  {name:"Improve elemental", desc:"You deal an extra +1 specific elemental damage. Stacks."},
  {name:"Pierce", desc:"The weapon ignores 1 armor. Stacks."},
  {name:"Breach", desc:"You ignore resistance to [element]."},
  {name:"+attribute", desc:"The weapon increases an Attribute by 1. Stacks."},
  {name:"Keen", desc:"Roll weapon damage twice and choose the better result."}
];

const armorTraits = [
  {name:"+armor", desc:"The item grants an extra +1 armor. Stacks."},
  {name:"Elemental resistance", desc:"The item grants resistance to [element]."},
  {name:"Emit light", desc:"The item sheds light around you."},
  {name:"Improve elemental", desc:"You deal an extra +1 specific elemental damage. Stacks."},
  {name:"Reflect", desc:"Enemies take 1 damage when they hit you. Stacks."},
  {name:"Save Recovery", desc:"You have an advantage on [Attribute] saves."},
  {name:"+attribute", desc:"The item increases [Attribute] by 1. Stacks."},
  {name:"Chaos Resistance", desc:"The item grants resistance to Chaos."}
];

const offhandTraits = [
  {name:"+energy shield", desc:"The item grants an extra +1 energy shield. Stacks."},
  {name:"Elemental resistance", desc:"The item grants resistance to [element]."},
  {name:"Emit light", desc:"The item sheds light around you."},
  {name:"Improve elemental", desc:"You deal an extra +1 specific elemental damage. Stacks."},
  {name:"Energy Shield Regen", desc:"You regain 1 energy shield at the start of your turn. Stacks."},
  {name:"Breach", desc:"You ignore resistance to [element]."},
  {name:"+attribute", desc:"The item increases [Attribute] by 1. Stacks."},
  {name:"Attribute Regen", desc:"You regain 1 [Attribute] at the start of every watch."}
];

const jewelleryTraits = [
  {name:"+energy shield", desc:"The item grants an extra +1 energy shield. Stacks."},
  {name:"Elemental resistance", desc:"The item grants resistance to [element]."},
  {name:"Emit light", desc:"The item sheds light around you."},
  {name:"Improve elemental", desc:"You deal an extra +1 specific elemental damage. Stacks."},
  {name:"Energy Shield Regen", desc:"You regain 1 energy shield at the start of your turn. Stacks."},
  {name:"Treasure Hunter", desc:"When rolling for treasure, roll twice."},
  {name:"+attribute", desc:"The item increases [Attribute] by 1. Stacks."},
  {name:"Chaos Resistance", desc:"The item grants resistance to Chaos."}
];

// ---------- Subtables ----------
function shieldOutcome(r){ if(r<=3)return "Armor +1"; if(r<=6)return "Armor +1, Block"; if(r===7)return "Armor +1, Energy Shield +1"; return "Armor +1, Energy Shield +1, Block"; }
function offhandOutcome(r){ if(r<=3)return "Spirit Shield +1"; if(r<=5)return "Spirit Shield +1, +Trait"; if(r<=7)return "Spirit Shield +1, +Socket"; return "Spirit Shield +1, +Trait, +Socket"; }
function headOutcome(r){ if(r<=2)return "Armor +1"; if(r===3)return "Armor +1, +Trait"; if(r<=5)return "Spirit Shield +1"; if(r===6)return "Spirit Shield +1, +Trait"; return "Armor +1, Spirit Shield +1"; }
function jewelleryType(r){ return r<=5 ? "Ring" : "Amulet"; }

function treasureOutcome(r){
  switch(r){
    case 1:{const coins=rollDie(6);return `Trinket + ${coins} coins`; }
    case 2:{const t=rollDie(4),c=rollDie(8);return `${t} trinkets + ${c} coins`; }
    case 3:{const t=rollDie(6),c=rollDice(2,6); return `${t} trinkets + ${c.total} coins`; }
    case 4:{const t=rollDice(2,4),c=rollDice(2,8); return `${t.total} trinkets + ${c.total} coins`; }
    case 5:return "Scroll";
    case 6:return "Add socket";
    case 7:return "Reroll trait";
    case 8:return "Improve rarity";
  }
}

// ---------- Rarity ----------
function rollRarity(){
  const r=rollDie(8);
  if(r<=5) return { name:"Common", traits:0, color:"white" };
  if(r<=7) return { name:"Rare", traits:1, color:"blue" };
  return { name:"Epic", traits:2, color:"yellow" };
}

// ---------- Main Loot Generator ----------
function generateLoot(){
  const out = [];
  const typeRoll = rollDie(8);
  const typeMap = {1:"Weapon",2:"Shield",3:"Off-hand",4:"Armor",5:"Head",6:"Jewellery",7:"Potion",8:"Treasure"};
  const type = typeMap[typeRoll];
  const rarity = ["Weapon","Shield","Off-hand","Armor","Head","Jewellery"].includes(type) ? rollRarity() : null;

  let sockets = ["Weapon","Shield","Off-hand","Armor","Head"].includes(type) ? rollDie(3)-1 : 0;

  // --- Type-specific ---
  let itemName="", traits=[], socketCount = sockets;

  if(type==="Weapon"){
    const subtypeMap={1:"Light Melee",2:"Medium Melee",3:"Heavy Melee",4:"Ranged",5:"Thrown",6:"Ammo"};
    const subtype=subtypeMap[rollDie(6)];
    const item = weapons[subtype][Math.floor(Math.random()*weapons[subtype].length)];
    itemName = item.name;
    if(rarity.traits>0){
      traits = pickRandomUnique(weaponTraits, rarity.traits).map(t=>applyPlaceholders(`${t.name}: ${t.desc}`));
    }
  }

  if(type==="Shield"){
    itemName = shieldOutcome(rollDie(8));
    if(rarity.traits>0){
      traits = pickRandomUnique(armorTraits, rarity.traits).map(t=>applyPlaceholders(`${t.name}: ${t.desc}`));
    }
  }

  if(type==="Off-hand"){
    const text=offhandOutcome(rollDie(8));
    itemName = text.replace("+Trait","").replace("+Socket","");
    if(text.includes("+Trait") && rarity.traits>0){
      traits = pickRandomUnique(offhandTraits, rarity.traits).map(t=>applyPlaceholders(`${t.name}: ${t.desc}`));
    }
    if(text.includes("+Socket")) socketCount++;
  }

  if(type==="Armor"){
    itemName = armorTable[rollDie(armorTable.length)-1];
    if(rarity.traits>0){
      traits = pickRandomUnique(armorTraits, rarity.traits).map(t=>applyPlaceholders(`${t.name}: ${t.desc}`));
    }
  }

  if(type==="Head"){
    const text=headOutcome(rollDie(8));
    itemName = text.replace("+Trait","");
    if(text.includes("+Trait") && rarity.traits>0){
      traits = pickRandomUnique(armorTraits, rarity.traits).map(t=>applyPlaceholders(`${t.name}: ${t.desc}`));
    }
  }

  if(type==="Jewellery"){
    itemName = jewelleryType(rollDie(8));
    if(rarity.traits>0){
      traits = pickRandomUnique(jewelleryTraits, rarity.traits).map(t=>applyPlaceholders(`${t.name}: ${t.desc}`));
    }
  }

  if(type==="Potion"){
    const simplePotions=["Minor Healing","Minor Mana","Antitoxin","Elixir of Swiftness"];
    itemName = simplePotions[Math.floor(Math.random()*simplePotions.length)];
  }

  if(type==="Treasure"){
    itemName = treasureOutcome(rollDie(8));
  }

  // --- Display ---
  const socketDisplay = socketCount>0 ? "Sockets: " + "●".repeat(socketCount) : "";
  const color = rarity ? rarity.color : "white";
  const traitText = traits.length>0 ? "Traits:\n  - " + traits.join("\n  - ") : "";
  out.push(`<span style="color:${color}; font-weight:bold">${itemName}</span>`);
  if(socketDisplay) out.push(socketDisplay);
  if(traitText) out.push(traitText);

  document.querySelector("#output pre").innerHTML = out.join("\n");
}

// Event listeners
document.addEventListener("DOMContentLoaded",()=> {
  document.getElementById("generate-btn").addEventListener("click",generateLoot);
  document.getElementById("clear-btn").addEventListener("click",()=>document.querySelector("#output pre").innerText="");
});
