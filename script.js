// ---------- Utilities ----------
function rollDie(sides){ return Math.floor(Math.random() * sides) + 1; }
function pickRandomUnique(arr, count){
  const copy = arr.slice();
  const out = [];
  for(let i=0;i<count && copy.length>0;i++){
    const idx = rollDie(copy.length)-1;
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
const weapons = {
  "Light Melee":["Dagger, Exploding","Claw, regain 1 STR","Sabre, +1 dmg","Hatchet, +1 piercing","Club, stun disadvantage","Rapier, Exploding"],
  "Medium Melee":["Long sword, +1 dmg","Spear, reach","War hammer, stun disadvantage","Mace, +1 dmg adjacent","Scepter, +1 elemental dmg","Battle axe, +1 piercing"],
  "Heavy Melee":["Staff, +1 armor","Great sword, +1 dmg","Double axe, +1 piercing","Maul, stun disadvantage","Morningstar, +1 dmg adjacent","Poleaxe, +1 piercing"],
  "Ranged":["Bow, d6","Recurve bow, d6, exploding","Crossbow, d8","Heavy crossbow, d10, shoot or run","Wand, d6, one hand, elemental","Rod, d8, +1 summon dmg"],
  "Thrown":["Light spear","Throwing axe","Throwing knife"],
  "Ammo":["Ammo pack"]
};

const armorTable=["Coat, 1 armor","Vestment, 1 energy shield","Brigandine, 2 armor","Robe, 2 energy shield","Garb, 1 armor and 1 energy shield","Garb, 1 armor and 1 energy shield","Chainmail, 2 armor and 1 energy shield","Raiment, 1 armor and 2 energy shield"];

const weaponTraits=[
"+damage: The weapon deals an extra +1 damage. Stacks.",
"+elemental damage: The weapon adds an extra +1 elemental damage. Stacks.",
"Elemental: The weapon damage type changes to elemental.",
"Improve elemental: You deal an extra +1 specific elemental damage. Stacks.",
"Pierce: The weapon ignores 1 armor. Stacks.",
"Breach: You ignore resistance to [element].",
"+attribute: The weapon increases an Attribute by 1. Stacks.",
"Keen: Roll weapon damage twice and choose the better result."
];

const armorTraits=[
"+armor: The item grants an extra +1 armor. Stacks.",
"Elemental resistance: The item grants resistance to [element].",
"Emit light: The item sheds light around you.",
"Improve elemental: You deal an extra +1 specific elemental damage. Stacks.",
"Reflect: Enemies take 1 damage when they hit you. Stacks.",
"Save Recovery: You have an advantage on [Attribute] saves.",
"+attribute: The item increases [Attribute] by 1. Stacks.",
"Chaos Resistance: The item grants resistance to Chaos."
];

const offhandTraits=[
"+energy shield: The item grants an extra +1 energy shield. Stacks.",
"Elemental resistance: The item grants resistance to [element].",
"Emit light: The item sheds light around you.",
"Improve elemental: You deal an extra +1 specific elemental damage. Stacks.",
"Energy Shield Regen: You regain 1 energy shield at the start of your turn. Stacks.",
"Breach: You ignore resistance to [element].",
"+attribute: The item increases [Attribute] by 1. Stacks.",
"Attribute Regen: You regain 1 [Attribute] at the start of every watch."
];

const jewelleryTraits=[
"+energy shield: The item grants an extra +1 energy shield. Stacks.",
"Elemental resistance: The item grants resistance to [element].",
"Emit light: The item sheds light around you.",
"Improve elemental: You deal an extra +1 specific elemental damage. Stacks.",
"Energy Shield Regen: You regain 1 energy shield at the start of your turn. Stacks.",
"Treasure Hunter: When rolling for treasure, roll twice.",
"+attribute: The item increases [Attribute] by 1. Stacks.",
"Chaos Resistance: The item grants resistance to Chaos."
];

// ---------- Loot helper functions ----------
function shieldOutcome(r){ if(r<=3) return "Armor +1"; if(r<=6) return "Armor +1, Block"; if(r===7) return "Armor +1, Energy Shield +1"; return "Armor +1, Energy Shield +1, Block"; }
function offhandOutcome(r){ if(r<=3) return "Spirit Shield +1"; if(r<=5) return "Spirit Shield +1, +Trait"; if(r<=7) return "Spirit Shield +1, +Socket"; return "Spirit Shield +1, +Trait, +Socket"; }
function headOutcome(r){ if(r<=2) return "Armor +1"; if(r===3) return "Armor +1, +Trait"; if(r<=5) return "Spirit Shield +1"; if(r===6) return "Spirit Shield +1, +Trait"; return "Armor +1, Spirit Shield +1"; }
function jewelleryType(r){ return r<=5 ? "Ring" : "Amulet"; }
function treasureOutcome(r){ switch(r){ case 1: return `Trinket / ${rollDie(6)} coins`; case 2: return `${rollDie(4)} trinkets / ${rollDie(8)} coins`; case 3: return `${rollDie(6)} trinkets / ${rollDie(6)+rollDie(6)} coins`; case 4: return `${rollDie(4)+rollDie(4)} trinkets / ${rollDie(8)+rollDie(8)} coins`; case 5: return "Scroll"; case 6: return "Add socket"; case 7: return "Reroll trait"; case 8: return "Improve rarity"; } }
function rollRarity(){ const r=rollDie(8); if(r<=5) return {name:"Common",traits:0,color:"white"}; if(r<=7) return {name:"Rare",traits:1,color:"blue"}; return {name:"Epic",traits:2,color:"yellow"}; }

// ---------- Main generator ----------
function generateLoot(){
  const typeMap={1:"Weapon",2:"Shield",3:"Off-hand",4:"Armor",5:"Head",6:"Jewellery",7:"Potion",8:"Treasure"};
  const type = typeMap[rollDie(8)];
  const rarity = ["Weapon","Shield","Off-hand","Armor","Head","Jewellery"].includes(type)? rollRarity(): null;
  let socketCount = ["Weapon","Shield","Off-hand","Armor","Head"].includes(type)? rollDie(3)-1:0;
  let itemName="", traits=[], detailLine="";

  if(type==="Weapon"){
    const subMap={1:"Light Melee",2:"Medium Melee",3:"Heavy Melee",4:"Ranged",5:"Thrown",6:"Ammo"};
    const subtype = subMap[rollDie(6)];
    const arr = weapons[subtype];
    itemName = arr[rollDie(arr.length)-1];

    switch(subtype){
      case "Light Melee": detailLine="Damage: d6, 1 hand (dual wield: best of two dice)"; break;
      case "Medium Melee": detailLine="Damage: d6 one hand / d8 both hands"; break;
      case "Heavy Melee": detailLine="Damage: d10, bulky"; break;
      case "Ranged": detailLine="Damage: varies, bulky"; break;
      case "Thrown": detailLine="Damage: d6"; break;
      case "Ammo": detailLine="Ammo pack"; break;
    }

    if(rarity.traits>0) traits = pickRandomUnique(weaponTraits, rarity.traits).map(applyPlaceholders);
  }

  if(type==="Shield"){ 
    itemName=shieldOutcome(rollDie(8)); 
    detailLine="Armor + Shield"; 
    if(rarity.traits>0) traits=pickRandomUnique(armorTraits, rarity.traits).map(applyPlaceholders); 
  }

  if(type==="Off-hand"){ 
    let t=offhandOutcome(rollDie(8)); 
    itemName=t.replace("+Trait","").replace("+Socket",""); 
    detailLine="Off-hand (Energy Shield + Armor)"; 
    if(t.includes("+Trait") && rarity.traits>0) traits=pickRandomUnique(offhandTraits, rarity.traits).map(applyPlaceholders); 
    if(t.includes("+Socket")) socketCount++; 
  }

  if(type==="Armor"){ 
    itemName=armorTable[rollDie(armorTable.length)-1]; 
    detailLine="Armor / Energy Shield"; 
    if(rarity.traits>0) traits=pickRandomUnique(armorTraits, rarity.traits).map(applyPlaceholders); 
  }

  if(type==="Head"){ 
    let t=headOutcome(rollDie(8)); 
    itemName=t.replace("+Trait",""); 
    detailLine="Headgear (Armor / Energy Shield)"; 
    if(t.includes("+Trait") && rarity.traits>0) traits=pickRandomUnique(armorTraits, rarity.traits).map(applyPlaceholders); 
  }

  if(type==="Jewellery"){ 
    itemName=jewelleryType(rollDie(8)); 
    detailLine="Jewellery (Ring/Amulet)"; 
    if(rarity.traits>0) traits=pickRandomUnique(jewelleryTraits, rarity.traits).map(applyPlaceholders); 
  }

  if(type==="Potion"){ 
    const pots=["Minor Healing","Minor Mana","Antitoxin","Elixir of Swiftness"]; 
    itemName=pots[rollDie(pots.length)-1]; 
    detailLine="Potion"; 
  }

  if(type==="Treasure"){ 
    itemName=treasureOutcome(rollDie(8)); 
    detailLine="Treasure"; 
  }

  const socketDisplay = socketCount>0? `<span class="sockets">${"●".repeat(socketCount)}</span>` : "";
  const color = rarity? rarity.color : "white";

  // Create card div
  const container = document.getElementById("output");
  const div = document.createElement("div");
  div.classList.add("item-card");
  let traitsHTML = traits.map(t=>`<div class="item-trait">${t}</div>`).join("");
  div.innerHTML = `
    <small>${type}</small>
    <div class="item-name" style="color:${color}">${itemName} ${socketDisplay}</div>
    <div class="item-detail">${detailLine}</div>
    ${traitsHTML}
  `;
  container.appendChild(div);
}

// ---------- Event listeners ----------
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("generate-btn").addEventListener("click", generateLoot);
  document.getElementById("clear-btn").addEventListener("click", ()=>document.getElementById("output").innerHTML="");
});
