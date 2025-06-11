
class BudgetTracker {
  constructor() {
    this.transactions = this.loadTransactions();
    this.form = document.getElementById("transactionForm");
    this.transactionList = document.getElementById("transactionList");
    this.balanceElement = document.getElementById("balance");

    this.initEventListeners();
    this.renderTransactions();
    this.updateBalance();
  }

  loadTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  }

  saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  initEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTransaction();
    });

    
    const toggle = document.getElementById("darkModeToggle");
    if (toggle) {
      
      if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggle.checked = true;
      }

      toggle.addEventListener("change", () => {
        if (toggle.checked) {
          document.body.classList.add("dark-mode");
          localStorage.setItem("darkMode", "enabled");
        } else {
          document.body.classList.remove("dark-mode");
          localStorage.setItem("darkMode", "disabled");
        }
      });
    }
  }

  clearForm() {
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("type").value = "income";
    const categoryInput = document.getElementById("category");
    if (categoryInput) {
      categoryInput.value = "General";
    }
  }

  addTransaction() {
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const categoryInput = document.getElementById("category");
    const category = categoryInput ? categoryInput.value : "General";

    if (!description || isNaN(amount)) {
      alert("Please provide a valid description and amount.");
      return;
    }

    const transaction = {
      id: Date.now(),
      description,
      amount: type === "expense" ? -amount : amount,
      type,
      category,
      date: new Date().toLocaleDateString(),
    };

    this.transactions.push(transaction);
    this.saveTransactions();
    this.renderTransactions();
    this.updateBalance();
    this.clearForm();
  }

  renderTransactions() {
    this.transactionList.innerHTML = "";
    this.transactions
      .slice()
      .sort((a, b) => b.id - a.id)
      .forEach((transaction) => {
        const transactionDiv = document.createElement("div");
        transactionDiv.classList.add("transaction", transaction.type);
        transactionDiv.innerHTML = `
          <span>
            <strong>${transaction.description}</strong><br />
            <small>${transaction.category} - ${transaction.date}</small>
          </span>
          <span class="transaction-amount-container">
            $${Math.abs(transaction.amount).toFixed(2)}
            <button class="delete-btn" data-id="${transaction.id}">Delete</button>
          </span>
        `;
        this.transactionList.appendChild(transactionDiv);
      });
    this.attachDeleteEventListeners();
  }

  attachDeleteEventListeners() {
    this.transactionList.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", () => {
        this.deleteTransaction(Number(button.dataset.id));
      });
    });
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter(
      (transaction) => transaction.id !== id
    );
    this.saveTransactions();
    this.renderTransactions();
    this.updateBalance();
  }

  updateBalance() {
    const balance = this.transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    this.balanceElement.textContent = `Balance: $${balance.toFixed(2)}`;
    this.balanceElement.style.color = balance >= 0 ? "#2ecc71" : "#e74c3c";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  
  const categorySelect = document.createElement("select");
  categorySelect.id = "category";
  categorySelect.innerHTML = `
    <option value="General">📁 General</option>
    <option value="Food">🍔 Food</option>
    <option value="Rent">🏠 Rent</option>
    <option value="Salary">💼 Salary</option>
    <option value="Travel">✈️ Travel</option>
  `;
  document.getElementById("type").after(categorySelect);

  
  new BudgetTracker();
});
