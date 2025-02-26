const time = document.querySelector(".time");
const container = document.querySelector(".container");
const screen = document.querySelector(".screen");
const green = document.querySelector(".green_button");
const red = document.querySelector(".red_button");
const buttons = document.querySelectorAll(".numbers button");
const butoane = document.getElementById('butoane');
const sterge = document.getElementById('sterge');
const plus = document.getElementById('plus');
const minus = document.getElementById('minus');
const multiple = document.getElementById('multiple');
const divide = document.getElementById('divide');
const equal = document.getElementById('equal');
const display = document.getElementById('display');
const deleteLast = document.getElementById("delete-last"); 
const locationInfo = document.getElementById("location-info");



// HOURS AND WEATHER //

import { updateTime, getLocationAndTemperature } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
  updateTime(); 
  getLocationAndTemperature(); 
});


//////////////////////////////////////////////////////////////////////////////////////////
// NUMBERS

let currentExpression = ""; 
let lastOperator = ""; 


function updateDisplay() {
    display.value = currentExpression;
  }
  
  buttons.forEach(function(button) {
    button.addEventListener("click", function() {
      currentExpression += button.textContent;  
      updateDisplay();  
    });
  });


//MATH
plus.addEventListener("click", function() {
    currentExpression += "+";  
    updateDisplay();
  });
  
  
  minus.addEventListener("click", function() {
    currentExpression += "-";  
    updateDisplay();
  });
  
  
  multiple.addEventListener("click", function() {
    currentExpression += "*";  
    updateDisplay();
  });
  
  
  divide.addEventListener("click", function() {
    currentExpression += "/";  
    updateDisplay();
  });
  
  
  equal.addEventListener("click", function() {
    let result = calculate(); 
    currentExpression = result.toString(); 
    updateDisplay();
});

  sterge.addEventListener("click", function() {
    currentExpression = ""; 
    updateDisplay();
});

// DELETE LAST CHARACTER
deleteLast.addEventListener("click", function () {
  if (currentExpression.length > 0) {
      currentExpression = currentExpression.slice(0, -1); 
      updateDisplay();
  } else {
      alert("Nu există nimic de șters!");
  }
});
  
  function calculate() {
    try {
      let result = eval(currentExpression); 
      return parseFloat(result.toFixed(3));
  } catch (error) {
      alert("Expresia este invalidă!");
      return 0;
  }
}