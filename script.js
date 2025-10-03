// ---------- Utilities ----------
function rollDie(sides){ return Math.floor(Math.random() * sides) + 1; }
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
function applyPlaceholders(trait){
  const elements = ["Fire","Cold","Lightning"];
  const attributes = ["STR","DEX","WIL"];
  return trait.replace(/\[element\]/g, elements[rollDie(elements.length)-1])
              .replace(/\[Attribute\]/g, attributes[rollDie(attributes.length)-1]);
}

// ---------- Tables ----------

// Weapons by subtype
const weapons = {
  "Light Melee": [
    {name:"Dagger", dmg:"d6", note:"Exploding"},
    {name:"Claw", dmg:"d6", note:"Regain 1 STR"},
    {name:"Sabre", dmg:"d6", note:"+1 dmg"},
    {name:"Hatchet", dmg:"d6", note:"+1 piercing"},
    {name:"Club", dmg:"d6", note:"Stun disadvantage"},
    {name:"Rapier", dmg:"d6", note:"Exploding"}
  ],
  "Medium Melee": [
    {name:"Long sword", dmg:"d6 (1h)/d8 (2h)", note:"+1 dmg"},
    {name:"Spear", dmg:"d6 (1h)/d8 (2h)", note:"Reach"},
    {name:"War hammer", dmg:"d6 (1h)/d8 (2h)", note:"Stun disadvantage"},
    {name:"Mace", dmg:"d6 (1h)/d8 (2h)", note:"+1 dmg adjacent"},
    {name:"Scepter", dmg:"d6 (1h)/d8 (2h)", note:"+1 elemental dmg"},
    {name:"Battle axe", dmg:"d6 (1h)/d8 (2h)", note:"+1 piercing"}
  ],
  "Heavy Melee": [
    {name:"Staff", dmg:"d10", note:"+1 armor"},
    {name:"Great sword", dmg:"d10", note:"+1 dmg"},
    {name:"Double axe", dmg:"d10", note:"+1 piercing"},
    {name:"Maul", dmg:"d10", note:"Stun disadvantage"},
    {name:"Morningstar", dmg:"d10", note:"+1 dmg adjacent"},
    {name:"Poleaxe", dmg:"d10", note:"+1 piercing"}
  ],
  "Ranged": [
    {name:"Bow", dmg:"d6", note:""},
    {name:"Recurve bow", dmg:"d6", note:"Exploding"},
    {name:"Crossbow", dmg:"d8", note:""},
    {name:"Heavy crossbow", dmg:"d10", note:"Shoot or run"},
    {name:"Wand", dmg:"d6", note:"One hand, elemental"},
    {name:"Rod", dmg:"d8", note:"+1 summon dmg"}
  ],
  "Thrown": [
    {name:"Light spear", dmg:"d6", note:"Thrown"},
    {name:"Throwing axe", dmg:"d6", note:"Thrown"},
    {name:"Throwing knife", dmg:"d6", note:"Thrown"}
  ],
  "Ammo": [
    {name:"Ammo pack", dmg:"Varies", note:"Uses rolled (1d4)"}
  ]
};

// Armor
const armorTable = [
  "Coat (1 armor)","Vestment (1 energy shield)","Brigandine (2 armor)",
  "Robe (2 energy shield)","Garb (1 armor + 1 energy shield)","Garb (1 armor + 1 energy shield)",
  "Chainmail (2 armor + 1 energy shield)","Raiment (1 armor + 2 energy shield)"
];

// Traits
const weaponTraits = [
  "+damage: The weapon deals an extra +1 damage. Stacks.",
  "+elemental damage: The weapon adds an extra +1 elemental damage. Stacks.",
  "Elemental: The weapon damage type changes to elemental.",
  "Improve elemental: You deal an extra +1 specific elemental damage. Stacks.",
  "Pierce: The weapon ignores 1 armor. Stacks.",
  "Breach: You ignore resistance to [element].",
  "+attribute: The weapon increases an Attribute by 1. Stacks.",
  "Keen: Roll weapon damage twice and choose the better result."
];

const armorTraits = [
  "+armor: The item grants an extra +1 armor. Stacks.",
  "Elemental resistance: The item grants resistance to [element].",
  "Emit light: The item sheds light around you.",
  "Improve elemental: You deal an extra +1 specific elemental damage. Stacks.",
  "Reflect: Enemies take 1 damage when they hit you. Stacks.",
  "Save Recovery: You have an advantage on [Attribute] saves.",
  "+attribute: The item increases [Attribute] by 1. Stacks.",
  "Chaos Resistance: The item grants resistance to Chaos."
];

const offhandTraits = [
  "+energy shield: The item grants an extra +1 energy shield. Stacks.",
  "Elemental resistance: The item grants resistance to [element].",
  "Emit light: The item sheds light around you.",
  "Improve elemental: You deal an extra +1 specific elemental damage. Stacks.",
  "Energy Shield Regen: You regain 1 energy shield at the start of your turn. Stacks.",
  "Breach: You ignore resistance to [element].",
  "+attribute: The item increases [Attribute] by 1. Stacks.",
  "Attribute Regen: You regain 1 [Attribute] at the start of every watch."
];

const jewelleryTraits = [
  "+energy shield: The item grants an extra +1 energy shield. Stacks.",
  "Elemental resistance: The item grants resistance to [element].",
  "Emit light: The item sheds light around you.",
  "Improve elemental: You deal an extra +1 specific elemental damage. Stacks.",
  "Energy Shield Regen: You regain 1 energy shield at the start of your turn. Stacks.",
  "Treasure Hunter: When rolling for treasure, roll twice.",
  "+attribute: The item increases [Attribute] by 1. Stacks.",
  "Chaos Resistance: The item grants resistance to Chaos."
];

// Loot tables
function shieldOutcome(r){ if(r<=3)return "Armor +1"; if(r<=6)return "Armor +1, Block"; if(r===7)return "Armor +1, Energy Shield +1"; return "Armor +1, Energy Shield +1, Block"; }
function offhandOutcome(r){ if(r<=3)return "Spirit Shield +1"; if(r<=5)return "Spirit Shield +1, +Trait"; if(r<=7)return "Spirit Shield +1, +Socket"; return "Spirit Shield +1, +Trait, +Socket"; }
function headOutcome(r){ if(r<=2)return "Armor +1"; if(r===3)return "Armor +1, +Trait"; if(r<=5)return "Spirit Shield +1"; if(r===6)return "Spirit Shield +1, +Trait"; return "Armor +1, Spirit Shield +1"; }
function jewelleryType(r){ return r<=5 ? "Ring" : "Amulet"; }
function treasureOutcome(r){
  switch(r){
    case 1:{const coins=rollDie(6);return `Trinket + ${coins} coins`; }
    case 2:{const t=rollDie(4),c=rollDie(8);return `${t} trinkets + ${c} coins`; }
    case 3:{const t=rollDie(6),c=rollDie(6)+rollDie(6); return `${t} trinkets + ${c} coins`; }
    case 4:{const t=rollDie(4)+rollDie(4),c=rollDie(8)+rollDie(8); return `${t} trinkets + ${c} coins`; }
    case 5:return "Scroll";
    case 6:return "Add socket";
    case 7:return "Reroll trait";
    case 8:return "Improve rarity";
  }
}

// Rarity
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

  let itemName="", traits=[], socketCount = sockets;

  if(type==="Weapon"){
    const subtypeMap={1:"Light Melee",2:"Medium Melee",3:"Heavy Melee",4:"Ranged",5:"Thrown",6:"Ammo"};
    const subtype=subtypeMap[rollDie(6)];
    const item = weapons[subtype][Math.floor(Math.random()*weapons[subtype].length)];
    itemName = item.name;
    if(rarity.traits>0){
      traits = pickRandomUnique(weaponTraits, rarity.traits).map(applyPlaceholders);
    }
  }
  if(type==="Shield"){ itemName = shieldOutcome(rollDie(8)); if(rarity.traits>0) traits = pickRandomUnique(armorTraits, rarity.traits).map(applyPlaceholders); }
  if(type==="Off-hand"){ const t=offhandOutcome(rollDie(8)); itemName=t.replace("+Trait","").replace("+Socket",""); if(t.includes("+Trait") && rarity.traits>0) traits=pickRandomUnique(offhandTraits, rarity.traits).map(applyPlaceholders); if(t.includes("+Socket")) socketCount++; }
  if(type==="Armor"){ itemName = armorTable[rollDie(armorTable.length)-1]; if(rarity.traits>0) traits = pickRandomUnique(armorTraits, rarity.traits).map(applyPlaceholders); }
  if(type==="Head"){ const t=headOutcome(rollDie(8)); itemName=t.replace("+Trait",""); if(t.includes("+Trait") && rarity.traits>0) traits=pickRandomUnique(armorTraits, rarity.traits).map(applyPlaceholders); }
  if(type==="Jewellery"){ itemName=jewelleryType(rollDie(8)); if(rarity.traits>0) traits=pickRandomUnique(jewelleryTraits, rarity.traits).map(applyPlaceholders); }
  if(type==="Potion"){ const potions=["Minor Healing","Minor Mana","Antitoxin","Elixir of Swiftness"]; itemName=potions[Math.floor(Math.random()*potions.length)]; }
  if(type==="Treasure"){ itemName=treasureOutcome(rollDie(8)); }

  const socketDisplay = socketCount>0 ? `<span class="sockets">${"●".repeat(socketCount)}</span>` : "";
  const color = rarity ? rarity.color : "white";
  const traitText = traits.length>0 ? "Traits:\n  - " + traits.join("\n  - ") : "";
  out.push(`<span style="color:${color}; font-weight:bold">${itemName}</span>`);
  if(socketDisplay) out.push(socketDisplay);
  if(traitText) out.push(traitText);

  document.querySelector("#output pre").innerHTML = out.join("\n");
}

document.addEventListener("DOMContentLoaded",()=> {
  document.getElementById("generate-btn").addEventListener("click",generateLoot);
  document.getElementById("clear-btn").addEventListener("click",()=>document.querySelector("#output pre").innerText="");
});
