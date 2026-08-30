const balance = document.querySelector("#balance");
const income = document.querySelector("#income");
const expense = document.querySelector("#expense");
const form = document.querySelector("#transaction-form");
const amount = document.querySelector("#amount");
const categoryDropdown = document.querySelector("#category");
const date = document.querySelector("#date");
const transactionList = document.querySelector("#transaction-list");
const descriptionInput = document.querySelector("#description");

let transactions = [];

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const descriptionInputValue = descriptionInput.value;
  const amountValue = Number(amount.value);
  const categoryValue = categoryDropdown.value;
  const dateValue = date.value;
  const typeValue = document.querySelector('input[name="type"]:checked').value; 

  const newTransaction = {
    id : Date.now(),
    description : descriptionInputValue,
    amount : amountValue,
    category : categoryValue,
    type : typeValue,
    date : dateValue
  };
  transactions.push(newTransaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  showTransactions();
  updateSummary();
  form.reset();
});

const showTransactions = () => {
  transactionList.innerHTML = "";
  transactions.forEach((transaction) => {
    const li = document.createElement("li");
    let sign;
    if (transaction.type === "income") {
      li.classList.add('income-item');
      sign = "+";
    } else {
      li.classList.add('expense-item');
      sign = "-";
    }
    
    li.innerHTML = `
      <div class="left">
        <span class="desc">${transaction.description}</span>
        <small class="meta">${transaction.category} • ${transaction.date}</small>
      </div>

      <div class="right">
        <span class="amount">${sign}₹${transaction.amount}</span>
        <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">
          🗑
        </button>
      </div>
    `;

    transactionList.append(li);
  });
};

const updateSummary = () => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  });

  const totalBalance = totalIncome - totalExpense;

  income.textContent = `₹${totalIncome}`;
  expense.textContent = `₹${totalExpense}`;
  balance.textContent = `₹${totalBalance}`;
};

function deleteTransaction(id) {
  transactions = transactions.filter(
    (transaction) => transaction.id !== id
  );

  localStorage.setItem("transactions", JSON.stringify(transactions));

  showTransactions();
  updateSummary();
}

const savedData = localStorage.getItem("transactions");

if (savedData) {
  transactions = JSON.parse(savedData);
  showTransactions();
  updateSummary();
}
