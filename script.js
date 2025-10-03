// Example loot list
const lootTable = [
  "Rusty Sword",
  "Healing Potion",
  "Ancient Coin",
  "Magic Scroll",
  "Cursed Amulet",
  "Bag of Gold",
  "Mysterious Key"
];

// Save character
function saveCharacter() {
  const name = document.getElementById("char-name").value;
  const str = document.getElementById("char-str").value;
  const dex = document.getElementById("char-dex").value;
  const will = document.getElementById("char-will").value;

  const output = `Saved Character: ${name} | STR: ${str}, DEX: ${dex}, WIL: ${will}`;
  document.getElementById("char-output").textContent = output;
}

// Generate random loot
function generateLoot() {
  const randomItem = lootTable[Math.floor(Math.random() * lootTable.length)];
  document.getElementById("loot-output").textContent = "You found: " + randomItem;
}
