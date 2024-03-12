//Variables
const form = document.querySelector('#agregar-gasto');
const expenseList = document.querySelector('#gastos ul');


//Events
document.addEventListener('DOMContentLoaded', askBudget);
form.addEventListener('submit', addExpense);

expenseList.addEventListener('click', deleteExpense);

//Classes
class Budget{
    constructor(budget) {
        this.budget = Number(budget);
        this.remainder = Number(budget);
        this.expenses = [];
    }

    newExpense(expense){
        this.expenses = [...this.expenses, expense];
    }

    deleteExpense(id){
        this.expenses = this.expenses.filter(expense => expense.id !== id);
    }
}

class UI{
    addBudget(incomingBudget){
        const{budget, remainder} = incomingBudget;

        document.querySelector('#total').textContent = budget;
        document.querySelector('#restante').textContent = remainder;

    }

    showAlert(message, type){
        //Create div
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('text-center', 'alert');

        if(type === 'error'){
            messageDiv.classList.add('alert-danger');
        } else{
           messageDiv.classList.add('alert-success');
        }

        //Show alert message
        messageDiv.textContent = message;

        document.querySelector('.primario').insertBefore(messageDiv, form);

        //Deleting the alert
        setTimeout(() =>{
            messageDiv.remove();
        }, 3000);
    }

    addExpenses(expenses){
        this.clearHtml();
        if(expenses.length > 0){
            expenses.forEach(expense => {
                const {name, quantity, id} = expense;

                const newExpense = document.createElement('li');
                newExpense.className = 'list-group-item d-flex justify-content-between align-items-center';
                newExpense.dataset.id = id;

                newExpense.innerHTML = `${name} 
            <span class="badge badge-primary badge-pill">${quantity}</span>`;

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn', 'btn-danger', 'delete-expense');
                deleteButton.innerHTML = 'Borrar &times';
                newExpense.appendChild(deleteButton);

                expenseList.appendChild(newExpense);
            });
        }

    }
    clearHtml(){
        console.log('Pasando por aqui');
        while(expenseList.firstChild){
            expenseList.firstChild.remove();
        }
    }
}

let budget;
const ui = new UI;

//Funciones
function askBudget(){
    let userBudget = prompt('Cual es su presupuesto?');

    if(userBudget.trim() === '' || isNaN(userBudget) || userBudget <= 0){
        window.location.reload();
    }

    budget = new Budget(userBudget);
    // console.log(budget);
    ui.addBudget(budget);
}

function addExpense(e){
    e.preventDefault();

    //Read data from the form
    const name = document.querySelector('#gasto').value;
    const quantity = document.querySelector('#cantidad').value;
    const remainderSpan = document.querySelector('#restante');

    if(name === '' || quantity === ''){
        ui.showAlert('Los datos son obligatorios', 'error');
        return;
    } else if(quantity <= 0 || isNaN(quantity)){
        ui.showAlert('Cantidad no valida', 'error');
        return;
    }
    else if(!isNaN(name)){
        ui.showAlert('El nombre no puede ser un numero', 'error');
        return;
    }

    //Adding Expenses
    //Generating an object with the expenses
    const expense = {name, quantity, id: Date.now()};

    budget.remainder -= quantity;
    changeRemainderColor();
    remainderSpan.textContent = budget.remainder;


    budget.newExpense(expense);
    ui.showAlert('Agregado correctamente!!!');

    //Showing the added expenses
    const {expenses} = budget;
    ui.addExpenses(expenses);


    form.reset();
}

function changeRemainderColor(){
    const remainderDiv = document.querySelector('.restante');

    if(budget.remainder < 0)
    {
        if(checkSuccess(remainderDiv)){
            remainderDiv.classList.remove('alert-success');
        }
        else if(checkWarning(remainderDiv)){
            remainderDiv.classList.remove('alert-warning');
        }
        remainderDiv.classList.add('alert-danger');
    } else if(budget.remainder <= budget.budget * 0.3)
    {
        if(checkSuccess(remainderDiv)){
            remainderDiv.classList.remove('alert-success');
        }
        else if(checkDanger(remainderDiv)){
            remainderDiv.classList.remove('alert-danger');
        }
        remainderDiv.classList.add('alert-warning');
    } else{
        if(checkWarning(remainderDiv)){
            remainderDiv.classList.remove('alert-warning');
        }
        else if(checkDanger(remainderDiv)){
            remainderDiv.classList.remove('alert-danger');
        }
        remainderDiv.classList.add('alert-success');
    }
}

function checkSuccess(remainderDiv){
    return remainderDiv.classList.contains('alert-success');
}

function checkWarning(remainderDiv){
    return remainderDiv.classList.contains('alert-warning');
}

function checkDanger(remainderDiv){
    return remainderDiv.classList.contains('alert-danger');
}

function deleteExpense(e){
    e.preventDefault();

    if(e.target.classList.contains('delete-expense')){

        const remainderSpan = document.querySelector('#restante');
        const id= parseInt(e.target.parentElement.getAttribute('data-id'));
        const expenseToRemove = budget.expenses.find(expense => expense.id === id);

        if(expenseToRemove !== null) {
            budget.remainder += parseInt(expenseToRemove.quantity);
            remainderSpan.textContent = budget.remainder;
            changeRemainderColor();
        }
        budget.deleteExpense(id);

        console.log(budget.expenses);
        ui.addExpenses(budget.expenses);
    }
}
