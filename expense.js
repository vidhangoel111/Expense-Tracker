let container = document.querySelector("#container")
let titleInput = document.querySelector("#titleInput")
let amountInput = document.querySelector("#amountInput")
let categoryInput = document.querySelector("#categoryInput")
let dateInput = document.querySelector("#dateInput")
let btn = document.querySelector("#btn")
let total = document.querySelector("#Total")
let lists = document.querySelector("#lists")
let clearBtn = document.querySelector("#clearBtn")
let expenses = JSON.parse(localStorage.getItem("expenses"))||[];


let updateTotal = () =>{
    let sum = 0
    for(let exp of expenses){
        sum +=exp.amount
    }
    total.textContent = `Total: ₹${sum}`
}
function addExpense(expense, amount, category, date){
    expenses.push({
        title : expense, 
        amount : Number(amount),
        category : category,
        date : date
    })
    localStorage.setItem("expenses", JSON.stringify(expenses))
    let li = document.createElement("li")
    li.textContent = `${expense} : ${amount} : ${category} : ${date}`
    lists.appendChild(li)
    console.log(expenses)
    updateTotal()

    let remove = document.createElement("button")
    remove.textContent = `Delete`
    li.appendChild(remove)
    remove.onclick = () =>{
    let index = expenses.findIndex(exp => exp.title===expense && exp.amount===Number(amount) && exp.category===category && exp.date===date)
    if(index!==-1){
        expenses.splice(index,1)
    }
    localStorage.setItem("expenses", JSON.stringify(expenses))
    li.remove()
    updateTotal()
}
}
btn.addEventListener("click", () =>{
    let expense = titleInput.value
    let amount = amountInput.value
    let category = categoryInput.value
    let date = dateInput.value
    addExpense(expense, amount, category, date)
})

window.onload = () =>{
    for(let exp of expenses){
        let li = document.createElement("li")
        li.textContent = `${exp.title} : ${exp.amount} : ${exp.category} : ${exp.date}`
        lists.appendChild(li)
        let remove = document.createElement("button")
        remove.textContent = `Delete`
        li.appendChild(remove)
        remove.onclick = () =>{
    let index = expenses.findIndex(e => e.title===exp.title && e.amount===exp.amount && e.category===exp.category && e.date===exp.date)
    if(index!==-1){
        expenses.splice(index,1)
    }
    localStorage.setItem("expenses", JSON.stringify(expenses))
    li.remove()
    updateTotal()
}
    }
    updateTotal()
}
clearBtn.addEventListener("click", () =>{
    expenses = []
    localStorage.setItem("expenses", JSON.stringify(expenses))
    lists.innerHTML = ""
    updateTotal()
})
// btn.onclick = () =>{
//     let expense = titleInput.value
//     let amount = amountInput.value
//     let category = categoryInput.value
//     let date = dateInput.value
//     expenses.push({
//         title : expense, 
//         amount : Number(amount),
//         category : category,
//         date : date
//     })
//     let li = document.createElement("li")
//     li.textContent = `${expense} : ${amount} : ${category} : ${date}`
//     lists.appendChild(li)
//     console.log(expenses)
//     updateTotal()

//     let remove = document.createElement("button")
//     remove.textContent = `Delete`
//     li.appendChild(remove)
//     remove.onclick = () =>{
//     let index = expenses.findIndex(exp => exp.title===expense && exp.amount===Number(amount) && exp.category===category && exp.date===date)
//     if(index!==-1){
//         expenses.splice(index,1)
//     }
//     li.remove()
//     updateTotal()
// }
// }


