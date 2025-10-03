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

// ---------- Data & Traits ----------
// [Insert all data and traits exactly as in the previous script.js version]

// For brevity, assume all previous weapon, armor, off-hand, jewellery, and trait tables are here

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
  const socketDisplay = socketCount>0 ? `<span class="sockets">${"●".repeat(socketCount)}</span>` : "";
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
