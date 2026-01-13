let container = document.querySelector("#container")
let titleInput = document.querySelector("#titleInput")
let amountInput = document.querySelector("#amountInput")
let categoryInput = document.querySelector("#categoryInput")
let dateInput = document.querySelector("#dateInput")
let btn = document.querySelector("#btn")
let total = document.querySelector("#Total")
let monthTotal = document.querySelector("#monthTotal")
let weekTotal = document.querySelector("#weekTotal")
let lists = document.querySelector("#lists")
let clearBtn = document.querySelector("#clearBtn")
let searchInput = document.querySelector("#searchInput")
let filterCategory = document.querySelector("#filterCategory")
let sortBy = document.querySelector("#sortBy")
let categoryBreakdown = document.querySelector("#categoryBreakdown")
let emptyMessage = document.querySelector("#emptyMessage")

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Set today's date as default
dateInput.valueAsDate = new Date();

// Update all totals
let updateTotal = () => {
    let sum = 0
    let monthSum = 0
    let weekSum = 0
    let now = new Date()
    let currentMonth = now.getMonth()
    let currentYear = now.getFullYear()
    let weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    for (let exp of expenses) {
        sum += exp.amount
        let expDate = new Date(exp.date)
        
        // Month total
        if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
            monthSum += exp.amount
        }
        
        // Week total
        if (expDate >= weekAgo) {
            weekSum += exp.amount
        }
    }
    
    total.textContent = `₹${sum.toFixed(2)}`
    monthTotal.textContent = `₹${monthSum.toFixed(2)}`
    weekTotal.textContent = `₹${weekSum.toFixed(2)}`
    
    updateCategoryBreakdown()
}

// Update category breakdown
function updateCategoryBreakdown() {
    let categoryTotals = {}
    
    for (let exp of expenses) {
        if (!categoryTotals[exp.category]) {
            categoryTotals[exp.category] = 0
        }
        categoryTotals[exp.category] += exp.amount
    }
    
    let totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    
    if (totalAmount === 0) {
        categoryBreakdown.innerHTML = ""
        return
    }
    
    let html = '<h3>Category Breakdown</h3><div class="category-bars">'
    
    for (let category in categoryTotals) {
        let percentage = (categoryTotals[category] / totalAmount * 100).toFixed(1)
        html += `
            <div class="category-bar-item">
                <div class="category-info">
                    <span>${category}</span>
                    <span>₹${categoryTotals[category].toFixed(2)} (${percentage}%)</span>
                </div>
                <div class="category-bar">
                    <div class="category-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `
    }
    
    html += '</div>'
    categoryBreakdown.innerHTML = html
}

// Create expense element
function createExpenseElement(expense, amount, category, date) {
    let li = document.createElement("li")
    li.classList.add("expense-item")
    
    let expenseDate = new Date(date)
    let formattedDate = expenseDate.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    })
    
    li.innerHTML = `
        <div class="expense-details">
            <div class="expense-title">${expense}</div>
            <div class="expense-meta">
                <span class="expense-category">${category}</span>
                <span class="expense-date">${formattedDate}</span>
            </div>
        </div>
        <div class="expense-actions">
            <span class="expense-amount">₹${Number(amount).toFixed(2)}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `
    
    // Delete button
    let deleteBtn = li.querySelector(".delete-btn")
    deleteBtn.onclick = () => {
        let index = expenses.findIndex(exp => 
            exp.title === expense && 
            exp.amount === Number(amount) && 
            exp.category === category && 
            exp.date === date
        )
        if (index !== -1) {
            expenses.splice(index, 1)
        }
        localStorage.setItem("expenses", JSON.stringify(expenses))
        li.remove()
        updateTotal()
        checkEmpty()
    }
    
    // Edit button
    let editBtn = li.querySelector(".edit-btn")
    editBtn.onclick = () => {
        titleInput.value = expense
        amountInput.value = amount
        categoryInput.value = category
        dateInput.value = date
        
        let index = expenses.findIndex(exp => 
            exp.title === expense && 
            exp.amount === Number(amount) && 
            exp.category === category && 
            exp.date === date
        )
        if (index !== -1) {
            expenses.splice(index, 1)
        }
        localStorage.setItem("expenses", JSON.stringify(expenses))
        li.remove()
        updateTotal()
        checkEmpty()
        
        titleInput.focus()
    }
    
    return li
}

// Add expense
function addExpense(expense, amount, category, date) {
    if (!expense || !amount || !category || !date) {
        alert("Please fill in all fields!")
        return
    }
    
    if (Number(amount) <= 0) {
        alert("Amount must be greater than 0!")
        return
    }
    
    expenses.push({
        title: expense,
        amount: Number(amount),
        category: category,
        date: date
    })
    
    localStorage.setItem("expenses", JSON.stringify(expenses))
    
    let li = createExpenseElement(expense, amount, category, date)
    lists.appendChild(li)
    
    updateTotal()
    checkEmpty()
    
    // Clear inputs
    titleInput.value = ""
    amountInput.value = ""
    categoryInput.value = ""
    dateInput.valueAsDate = new Date()
}

// Check if list is empty
function checkEmpty() {
    if (expenses.length === 0) {
        emptyMessage.style.display = "block"
    } else {
        emptyMessage.style.display = "none"
    }
}

// Filter and display expenses
function displayFilteredExpenses() {
    let filtered = [...expenses]
    
    // Search filter
    let searchTerm = searchInput.value.toLowerCase()
    if (searchTerm) {
        filtered = filtered.filter(exp => 
            exp.title.toLowerCase().includes(searchTerm) ||
            exp.category.toLowerCase().includes(searchTerm)
        )
    }
    
    // Category filter
    let categoryFilter = filterCategory.value
    if (categoryFilter !== "all") {
        filtered = filtered.filter(exp => exp.category === categoryFilter)
    }
    
    // Sort
    let sortOption = sortBy.value
    if (sortOption === "date-desc") {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortOption === "date-asc") {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortOption === "amount-desc") {
        filtered.sort((a, b) => b.amount - a.amount)
    } else if (sortOption === "amount-asc") {
        filtered.sort((a, b) => a.amount - b.amount)
    }
    
    // Display
    lists.innerHTML = ""
    for (let exp of filtered) {
        let li = createExpenseElement(exp.title, exp.amount, exp.category, exp.date)
        lists.appendChild(li)
    }
}

// Event listeners
btn.addEventListener("click", () => {
    let expense = titleInput.value.trim()
    let amount = amountInput.value
    let category = categoryInput.value
    let date = dateInput.value
    addExpense(expense, amount, category, date)
    displayFilteredExpenses()
})

// Enter key to add expense
titleInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") btn.click()
})
amountInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") btn.click()
})

searchInput.addEventListener("input", displayFilteredExpenses)
filterCategory.addEventListener("change", displayFilteredExpenses)
sortBy.addEventListener("change", displayFilteredExpenses)

clearBtn.addEventListener("click", () => {
    if (expenses.length === 0) return
    
    if (confirm("Are you sure you want to clear all expenses?")) {
        expenses = []
        localStorage.setItem("expenses", JSON.stringify(expenses))
        lists.innerHTML = ""
        updateTotal()
        checkEmpty()
    }
})

// Load expenses on page load
window.onload = () => {
    displayFilteredExpenses()
    updateTotal()
    checkEmpty()
}