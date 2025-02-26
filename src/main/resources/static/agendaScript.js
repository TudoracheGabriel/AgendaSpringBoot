const container = document.querySelector(".container");
const screen = document.querySelector(".screen");
const time = document.querySelector(".time");
const green = document.querySelector(".green_button");
const red = document.querySelector(".red_button");
const buttons = document.querySelectorAll(".numbers button");
const menuButton = document.getElementById("menu-text");
const menuContainer = document.getElementById("menu-container");
const agendaButton = document.getElementById("agenda");
const calculatorButton = document.getElementById("calculator");
const deleteCharButton = document.getElementById("delete-char-button");
const locationInfo = document.getElementById("location-info");

// HOURS AND WEATHER //
import { updateTime, getLocationAndTemperature } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
  updateTime();
  getLocationAndTemperature();
});

// AGENDA
class AgendaTelefonica {
  constructor() {
    this.contacts = [];
  }

  async addContact(name, number) {
    try {
      const response = await fetch('http://localhost:8087/contacts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phoneNumber: number }),
      });

      if (response.ok) {
        alert(`Contact salvat: ${name} - ${number}`);
        this.getContacts(); 
      } else {
        alert("A apărut o problemă la salvarea contactului.");
      }
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  }

  async getContacts() {
    try {
      const response = await fetch('http://localhost:8087/contacts/all');
      if (response.ok) {
        const contacts = await response.json();
        this.contacts = contacts;
        console.log(contacts);
      } else {
        console.log("Nu s-au găsit contacte.");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }

  async deleteContact(index) {
      const contact = this.contacts[index];
      console.log("Contact name:", contact.name);

      try {
          const response = await fetch('http://localhost:8087/contacts/delete/' + contact.name, {
              method: 'DELETE',
          });

          if (response.ok) {
              alert("Contact șters!");
              this.getContacts();  // Actualizează lista după ștergere
              viewAgendaButton.click();
          } else {
              const errorMessage = await response.text();
              alert("A apărut o problemă la ștergerea contactului: " + errorMessage);
          }
      } catch (error) {
          console.error("Error deleting contact:", error);
          alert("A apărut o eroare la ștergerea contactului.");
      }
  }

}

const agenda = new AgendaTelefonica();
const viewAgendaButton = document.getElementById('view-agenda');
const addContactButton = document.getElementById('add-contact');
let currentNumber = "";
let currentName = "";
let callHistory = [];
let nameInput;
let numberInput;

// SAVING CALLS IN CALL HISTORY
async function saveCallHistory(name, number) {
  try {
    const response = await fetch('http://localhost:8087/calls/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contactName: name, phoneNumber: number }),
    });

    if (response.ok) {
      console.log("Apel salvat în istoricul apelurilor!");
    } else {
      console.error("A apărut o problemă la salvarea apelului.");
    }
  } catch (error) {
    console.error("Error saving call:", error);
  }
}

// METHOD FOR RECEIVING THE CALL HISTORY
async function getCallHistory() {
  try {
    const response = await fetch('http://localhost:8087/calls/recent');
    if (response.ok) {
      callHistory = await response.json();
      console.log("Apeluri recente:", callHistory);
    } else {
      console.error("Eroare la obținerea istoricului apelurilor.");
    }
  } catch (error) {
    console.error("Eroare la conectarea cu backend-ul:", error);
  }
}

// ADDING CALLS IN CALL HISTORY
function addToCallHistory(name, number) {
  callHistory.unshift({ name, number });
  if (callHistory.length > 10) {
    callHistory.pop();
  }
  saveCallHistory(name, number);
  console.log(callHistory);
}

// ADDING CONTACT
addContactButton.addEventListener('click', () => {
  screen.innerHTML = `
    <div class="agenda-show">
      <div>
        <label for="name">Nume:</label>
        <input type="text" id="name" placeholder="Introdu numele" />
      </div>
      <div>
        <label for="number">Numar:</label>
        <input type="text" id="number" placeholder="Introdu numarul"  />
        <div id="error-message" style="color: red; font-size: 12px; display: none;">
            Numărul trebuie să înceapă cu 0 și să aibă exact 10 caractere.
        </div>
      </div>
      <button id="save-contact">Salveaza Contact</button>
    </div>
  `;


  nameInput = document.getElementById("name");
  numberInput = document.getElementById("number");
  const errorMessage = document.getElementById("error-message");
  const saveButton = document.getElementById("save-contact");

  nameInput.addEventListener("input", () => {
    currentName = nameInput.value;
  });

  numberInput.addEventListener("input", () => {
    currentNumber = numberInput.value;
  });

  // TO DISPLAY RED WHEN WRONG NUMBER IS ENTERED 
  function validateNumber() {
    let number = numberInput.value;
    if (number.length === 0) {
        numberInput.style.background = ''; 
        numberInput.style.border = ''; 
        errorMessage.style.display = 'none'; 
    } else if (number.length === 10 && number[0] === '0') {
        numberInput.style.background = ''; 
        numberInput.style.border = ''; 
        errorMessage.style.display = 'none'; 
    } else {
        if (number[0] !== '0') {
            numberInput.style.background = "linear-gradient(to right, #ff7a7a, #ffb3b3)";
            numberInput.style.border = "2px solid #ff0000";
            errorMessage.style.display = 'block';
        } else {
            numberInput.style.background = ''; 
            numberInput.style.border = ''; 
            errorMessage.style.display = 'none';
        }
    }
    numberInput.value = number;
  }

  numberInput.addEventListener("keydown", function(event) {
    event.preventDefault();
  });

  numberInput.addEventListener("input", function() {
    let number = numberInput.value;
    number = number.replace(/\D/g, '');
    validateNumber();
    numberInput.value = number;

  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonValue = button.textContent;
      if (currentNumber.length < 10) {
        currentNumber += buttonValue;
        numberInput.value = currentNumber;
      }
    });
  });

  // SAVING CONTACT
  saveButton.addEventListener("click", async function () {
    const name = nameInput.value.trim();
    const number = numberInput.value.trim();

    if (name && number) {
      if (number.length === 10 && number[0] === '0') {
        await agenda.addContact(name, number);
        currentNumber = "";
        currentName = "";
      } else {
        alert("Numărul de telefon nu respectă regulile.");
      }
    } else {
      alert("Completează toate câmpurile!");
    }
  });
});

// VIEW AGENDA
viewAgendaButton.addEventListener("click", async function () {
  await agenda.getContacts(); // GET ALL THE CONTACTS

  if (agenda.contacts.length === 0) {
    screen.innerHTML = "<p>Agenda este goală!</p>";
  } else {
    screen.innerHTML = `
    <ul>
        ${agenda.contacts.map((contact, index) => `
            <li>
                ${contact.name} - ${contact.phoneNumber}
                <button class="call-contact" data-index="${index}">Apel</button>
                <button class="delete-contact" data-index="${index}">Șterge</button>
                <button class="update-contact" data-index="${index}">Update</button>
            </li>
        `).join("")}
    </ul>
  `;

    const callButtons = document.querySelectorAll(".call-contact");
    callButtons.forEach(button => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"), 10);
        const contact = agenda.contacts[index];
        addToCallHistory(contact.name, contact.phoneNumber);
        alert("Apel efectuat către: " + contact.name);
      });
    });

    const deleteButtons = document.querySelectorAll(".delete-contact");
    deleteButtons.forEach(button => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"), 10);
        agenda.deleteContact(index);
        viewAgendaButton.click();
      });
    });
  }

  const updateButtons = document.querySelectorAll(".update-contact");
updateButtons.forEach(button => {
  button.addEventListener("click", function () {
    const index = parseInt(this.getAttribute("data-index"), 10);
    const contact = agenda.contacts[index];
    

    screen.innerHTML = `
      <div class="update-contact-screen">
        <h3>Actualizare contact: ${contact.name}</h3>
        <label for="new-number">Introduceți noul număr:</label>
        <input type="text" id="new-number" placeholder="Introdu noul număr" />
        <button id="save-updated-contact">Salvează</button>
      </div>
    `;

    const newNumberInput = document.getElementById("new-number");
    const saveUpdatedButton = document.getElementById("save-updated-contact");


    saveUpdatedButton.addEventListener("click", async () => {
      const newPhoneNumber = newNumberInput.value.trim();
      if (newPhoneNumber.length === 10 && newPhoneNumber[0] === '0') {
        try {
          const response = await fetch(`http://localhost:8087/contacts/update/${contact.name}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPhoneNumber),
          });

          if (response.ok) {
            alert(`Numărul contactului ${contact.name} a fost actualizat cu succes!`);
            agenda.getContacts();
            viewAgendaButton.click();
          } else {
            alert("A apărut o problemă la actualizarea contactului.");
          }
        } catch (error) {
          console.error("Error updating contact:", error);
          alert("A apărut o eroare la actualizarea contactului.");
        }
      } else {
        alert("Numărul de telefon trebuie să înceapă cu 0 și să aibă exact 10 cifre.");
      }
    });
  });
});

});

// GREEN BUTTON
green.addEventListener("click", async function () {
  await getCallHistory(); // Getting calls before displaying page

  if (callHistory.length > 0) {
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
  } else {
    screen.innerHTML = "<p>Nu există apeluri recente.</p>";
  }
});

// MAKING SURE THE CALL HISTORY IS READ BEFORE DISPLAYING PAGE
document.addEventListener("DOMContentLoaded", () => {
  getCallHistory();
});



let activeField = null; // SAVING ACTIVE FIELD(NAME OR PHONE NUMBER)

// SET FOCUS ON NAME AND PHONE TO KNOW WHICH FIELD IS ACTIVE
document.addEventListener("click", () => {
  if (nameInput && document.activeElement === nameInput) {
    activeField = "name";
  } else if (numberInput && document.activeElement === numberInput) {
    activeField = "number";
  }
});

// DELETE LAST CHARACTER
deleteCharButton.addEventListener("click", () => {
  if (!nameInput || !numberInput) {
    alert("Câmpurile nu sunt definite! Asigură-te că ai apăsat pe 'Adaugă Contact'.");
    return;
  }

  if (activeField === "name") {
    currentName = currentName.slice(0, -1);
    nameInput.value = currentName;
  } else if (activeField === "number") {
    currentNumber = currentNumber.slice(0, -1);
    numberInput.value = currentNumber;
  } else {
    alert("Nu există câmp activ pentru ștergere!");
  }
});
