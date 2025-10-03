// ---------- Utilities ----------
function rollDie(sides){ return Math.floor(Math.random() * sides) + 1; }

function rollDice(count, sides){
  const rolls = [];
  for(let i=0;i<count;i++) rolls.push( rollDie(sides) );
  const total = rolls.reduce((s,v)=>s+v,0);
  return { total, rolls };
}

function rollDiceExpr(expr){
  const m = expr.match(/^(\d+)d(\d+)$/i);
  if(!m) return { total: null, rolls: null, text: expr };
  const count = parseInt(m[1],10), sides = parseInt(m[2],10);
  const res = rollDice(count, sides);
  return { total: res.total, rolls: res.rolls, text: `${expr} → [${res.rolls.join(", ")}] = ${res.total}` };
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

// ---------- Data pools ----------
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

const weaponTraits = [
  "+damage",
  "+elemental damage",
  "Elemental",
  "Improve elemental",
  "Pierce",
  "Breach",
  "+attribute",
  "Keen"
];

const armorTraits = [
  "+armor",
  "Elemental resistance",
  "Emit light",
  "Improve elemental",
  "Reflect",
  "Save Recovery",
  "+attribute",
  "Chaos Resistance"
];

const offhandTraits = [
  "+energy shield",
  "Elemental resistance",
  "Emit light",
  "Improve elemental",
  "Energy Shield Regen",
  "Breach",
  "+attribute",
  "Attribute Regen"
];

const jewelleryTraits = [
  "+energy shield",
  "Elemental resistance",
  "Emit light",
  "Improve elemental",
  "Energy Shield Regen",
  "Treasure Hunter",
  "+attribute",
  "Chaos Resistance"
];

// ---------- Subtables ----------
function shieldOutcomeFromRoll(r){ if(r<=3)return "Armor +1"; if(r<=6)return "Armor +1, Block"; if(r===7)return "Armor +1, Energy Shield +1"; return "Armor +1, Energy Shield +1, Block"; }
function offhandOutcomeFromRoll(r){ if(r<=3)return "Spirit Shield +1"; if(r<=5)return "Spirit Shield +1, +Trait"; if(r<=7)return "Spirit Shield +1, +Socket"; return "Spirit Shield +1, +Trait, +Socket"; }
function headOutcomeFromRoll(r){ if(r<=2)return "Armor +1"; if(r===3)return "Armor +1, +Trait"; if(r<=5)return "Spirit Shield +1"; if(r===6)return "Spirit Shield +1, +Trait"; return "Armor +1, Spirit Shield +1"; }
function jewelleryOutcomeFromRoll(r){ if(r<=5)return "Ring"; return "Amulet"; }

function treasureOutcomeFromRoll(r){
  switch(r){
    case 1:{const coins=rollDie(6);return `Trinket + ${coins} coins (1d6 → ${coins})`;}
    case 2:{const t=rollDie(4),c=rollDie(8);return `${t} trinkets + ${c} coins (1d4 → ${t}, 1d8 → ${c})`;}
    case 3:{const t=rollDie(6),c=rollDice(2,6);return `${t} trinkets + ${c.total} coins (1d6 → ${t}, 2d6 → [${c.rolls.join(",")}] = ${c.total})`;}
    case 4:{const t=rollDice(2,4),c=rollDice(2,8);return `${t.total} trinkets (2d4 → [${t.rolls.join(",")}] = ${t.total}) + ${c.total} coins (2d8 → [${c.rolls.join(",")}] = ${c.total})`;}
    case 5:return "Scroll";
    case 6:return "Add socket";
    case 7:return "Reroll trait";
    case 8:return "Improve rarity";
    default:return "Unknown treasure";
  }
}

// ---------- Rarity ----------
function rollRarity(){
  const r=rollDie(8);
  if(r<=5)return { name:"Common", traits:0, roll:r };
  if(r<=7)return { name:"Rare", traits:1, roll:r };
  return { name:"Epic", traits:2, roll:r };
}

// ---------- Main Generator ----------
function generateLoot(){
  const out = [];
  const typeRoll = rollDie(8);
  const typeMap = {1:"Weapon",2:"Shield",3:"Off-hand",4:"Armor",5:"Head",6:"Jewellery",7:"Potion",8:"Treasure"};
  const type = typeMap[typeRoll] || "Unknown";
  out.push(`Type roll: ${typeRoll} → ${type}`);

  let rarity=null;
  if(["Weapon","Shield","Off-hand","Armor","Head","Jewellery"].includes(type)){
    rarity = rollRarity();
    out.push(`Rarity roll: ${rarity.roll} → ${rarity.name} (traits: ${rarity.traits})`);
  }

  let sockets = null;
  if(["Weapon","Shield","Off-hand","Armor","Head"].includes(type)){
    sockets = rollDie(3)-1;
    out.push(`Sockets: ${sockets}`);
  }

  // Type-specific
  if(type==="Weapon"){
    const subtypeRoll=rollDie(6);
    const subtypeMap={1:"Light Melee",2:"Medium Melee",3:"Heavy Melee",4:"Ranged",5:"Thrown",6:"Ammo"};
    const subtype=subtypeMap[subtypeRoll];
    out.push(`Weapon subtype roll: ${subtypeRoll} → ${subtype}`);
    const list = weapons[subtype] || [];
    const item = list[Math.floor(Math.random()*list.length)];
    if(item) out.push(`Item: ${item.name} — Damage: ${item.dmg}${item.note?` — ${item.note}`:""}`);
    if(subtype==="Thrown"||subtype==="Ammo"){
      const uses = rollDiceExpr("1d4");
      out.push(`Uses roll: ${uses.text}`);
    }
    if(rarity && rarity.traits>0){
      const traits = pickRandomUnique(weaponTraits, rarity.traits);
      out.push(`Weapon traits: ${traits.join(", ")}`);
    }
  }

  if(type==="Shield"){ const r=rollDie(8); out.push(`Shield roll: ${r} → ${shieldOutcomeFromRoll(r)}`); if(rarity&&rarity.traits>0){const t=pickRandomUnique(armorTraits, rarity.traits); out.push(`Shield traits: ${t.join(", ")}`);} }
  if(type==="Off-hand"){ const r=rollDie(8); const text=offhandOutcomeFromRoll(r); out.push(`Off-hand roll: ${r} → ${text}`); if(text.includes("+Trait") && rarity&&rarity.traits>0){const t=pickRandomUnique(offhandTraits, rarity.traits); out.push(`Off-hand traits: ${t.join(", ")}`);} if(text.includes("+Socket")) out.push(" - Added: +Socket"); }
  if(type==="Armor"){ const idx=rollDie(armorTable.length)-1; out.push(`Armor roll: ${idx+1} → ${armorTable[idx]}`); if(rarity&&rarity.traits>0){const t=pickRandomUnique(armorTraits, rarity.traits); out.push(`Armor traits: ${t.join(", ")}`);} }
  if(type==="Head"){ const r=rollDie(8); const text=headOutcomeFromRoll(r); out.push(`Head roll: ${r} → ${text}`); if(text.includes("+Trait") && rarity&&rarity.traits>0){const t=pickRandomUnique(armorTraits, rarity.traits); out.push(`Head traits: ${t.join(", ")}`);} }
  if(type==="Jewellery"){ const r=rollDie(8); const subtype=jewelleryOutcomeFromRoll(r); out.push(`Jewellery roll: ${r} → ${subtype}`); if(rarity&&rarity.traits>0){const t=pickRandomUnique(jewelleryTraits, rarity.traits); out.push(`Jewellery traits: ${t.join(", ")}`);} }
  if(type==="Potion"){ const simplePotions=["Minor Healing (restores HP)","Minor Mana (restores MP)","Antitoxin (cures poison)","Elixir of Swiftness (+movement)"]; const p=simplePotions[Math.floor(Math.random()*simplePotions.length)]; out.push(`Potion: ${p}`); }
  if(type==="Treasure"){ const r=rollDie(8); out.push(`Treasure roll: ${r} → ${treasureOutcomeFromRoll(r)}`); }

  document.querySelector("#output pre").innerText=out.join("\n");
}

document.addEventListener("DOMContentLoaded",()=> {
  document.getElementById("generate-btn").addEventListener("click",generateLoot);
  document.getElementById("clear-btn").addEventListener("click",()=>document.querySelector("#output pre").innerText="");
});
