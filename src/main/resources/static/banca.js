const sold = document.getElementById("sold");
const amountWith = document.getElementById("withdraw_amount");
const withdrawBtn = document.getElementById("withdraw_button");
const transactionBtn = document.getElementById("view_transactions_button");
const loanBtn = document.getElementById("loan_button");
const transactionsList = document.getElementById("transactions_list");
const screen=document.getElementById("screen");
// GET BALANCE
const getBalance = async () => {
    const userId = 1; 
    try {
        const response = await fetch(`http://localhost:8087/bank/balance/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch balance');
        const balance = await response.json();
        sold.textContent = `Sold bancar: ${balance} RON`;
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
};

// WITHDRAW
const withdraw = async () => {
    const amount = parseFloat(amountWith.value);
    const userId = 1; 
    
    if (isNaN(amount) || amount <= 0) {
        alert("Introdu o sumă validă");
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8087/bank/withdraw/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(amount)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        
        const result = await response.text();
        alert(result); 
        getBalance();
    } catch (error) {
        alert(`Eroare: ${error.message}`);
    }
};

// VIEW TRANSACTION
const viewTransactions = async () => {
    const userId = 1; 
    try {
        const response = await fetch(`http://localhost:8087/bank/transactions/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch transactions');

        const transactions = await response.json();

        const transactionList = transactions.map(transaction => {
            return `<li class="transactions_li">${transaction.transactionType} - ${transaction.amount} RON - ${transaction.formattedTimestamp}</li>`;
        }).join('');

        document.getElementById("screen").innerHTML = `<ul>${transactionList}</ul>`;
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
};

// LOAN
const loan = async () => {
    const amount = parseFloat(amountWith.value);
    const userId = 1; 
    
    if (isNaN(amount) || amount <= 0) {
        alert("Introdu o sumă validă");
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:8087/bank/loan/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(amount)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        
        const result = await response.text();
        alert(result); 
        getBalance(); 
    } catch (error) {
        alert(`Eroare: ${error.message}`);
    }
};


withdrawBtn.addEventListener("click", withdraw);

transactionBtn.addEventListener("click", viewTransactions);

loanBtn.addEventListener("click", loan);

window.onload = getBalance;