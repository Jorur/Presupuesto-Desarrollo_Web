//Variables
const form = document.querySelector('#agregar-gasto');
const expenseList = document.querySelector('#gastos ul');

//Events
document.addEventListener('DOMContentLoaded', askBudget);
form.addEventListener('submit', addExpense);

//Classes
class Budget{
    constructor(budget) {
        this.budget = Number(budget);
        this.remainder = Number(budget);
        this.expenses = [];
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
    const expense = document.querySelector('#gasto').value;
    const quantity = document.querySelector('#cantidad').value;

    if(expense === '' || quantity === ''){
        ui.showAlert('Los datos son obligatorios', 'error');
    } else if(quantity <= 0 || isNaN(quantity)){
        ui.showAlert('Cantidad no valida', 'error');
    }
}