const container = document.querySelector(".container")
const screen = document.querySelector(".screen")
const time=document.querySelector(".time")
const green = document.querySelector(".green_button")
const moveButtons = document.querySelector(".move_buttons")
const up = document.querySelector(".up_button")
const right = document.querySelector(".right_button")
const down = document.querySelector(".down_button")
const left = document.querySelector(".left_button")
const red = document.querySelector(".red_button")
const buttons = document.querySelectorAll(".numbers button");
const menuButton = document.getElementById("menu-text"); 
const menuContainer = document.getElementById("menu-container");
const agendaButton = document.getElementById("agenda");
const calculatorButton = document.getElementById("calculator");
const locationInfo = document.getElementById("location-info");


// HOURS AND WEATHER //

import { updateTime, getLocationAndTemperature } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
  updateTime(); 
  getLocationAndTemperature(); 
});


/////////////////////////////////////////////////////////////////////////

let inMenu = false; 
let currentScreen = "main"; 

menuButton.addEventListener("click", function () {
    if (!inMenu) {
        menuButton.style.display = "none"; 
        menuContainer.style.display = "flex";
        inMenu = true;
        currentScreen = "menu";
    }
});

agendaButton.addEventListener("click", function () {
    screen.textContent = "Agenda"; 
    menuContainer.style.display = "none";
    currentScreen = "agenda"; 
});

calculatorButton.addEventListener("click", function () {
    screen.textContent = "Calculator"; 
    menuContainer.style.display = "none"; 
    currentScreen = "calculator"; 
});

// Variabilă pentru istoricul apelurilor
let callHistory = [];

// Funcție pentru a prelua istoricul apelurilor din baza de date
async function getCallHistory() {
  try {
    const response = await fetch('http://localhost:8087/calls/recent');
    if (response.ok) {
      callHistory = await response.json();
    } else {
      console.error("Eroare la obținerea istoricului apelurilor.");
    }
  } catch (error) {
    console.error("Eroare la conectarea cu backend-ul:", error);
  }
}

// Afișarea istoricului apelurilor pe ecran când se apasă pe green_button
green.addEventListener("click", async function () {
  await getCallHistory(); // Preluăm istoricul actualizat

  if (callHistory.length === 0) {
    screen.innerHTML = "<p>Nu există apeluri recente.</p>";
  } else {
    screen.innerHTML = `
      <div class="call-history">
        <h3>Istoric Apeluri</h3>
        <ul>
          ${callHistory.map(call => `
            <li>${call.contactName} - ${call.phoneNumber}</li>
          `).join("")}
        </ul>
      </div>
    `;
  }
});
