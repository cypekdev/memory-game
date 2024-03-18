import MemoryGame from "./game.js";

const container    = document.getElementById("main_content");
const start_button = document.getElementById("start_button");
const dsa_checkbox = document.getElementById("dont_show_again");


function start() {
  container.textContent = "";
  new MemoryGame(container);
}

if (MemoryGame.isStorageEnabled()) {
  const dont_show_rules = localStorage.getItem("dont_show_rules");
  if (dont_show_rules === "true") {
    start();
  }
}

start_button.addEventListener("click", () => {
  if (MemoryGame.isStorageEnabled() && dsa_checkbox.checked) {
    localStorage.setItem("dont_show_rules", true);
  }
  start();
});
