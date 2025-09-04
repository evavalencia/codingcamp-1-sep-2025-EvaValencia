const todoInput = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const addButton = document.getElementById('addButton');
const filterButton = document.getElementById('filterButton');
const deleteAllButton = document.getElementById('deleteAllButton');
const todoList = document.getElementById('todoList');
const noTasksRow = document.getElementById('noTasks');
const errorMsg = document.getElementById('errorMsg');

let todos = [];

document.addEventListener('DOMContentLoaded', () => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        renderTodoList();
    }
});

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}

function clearError() {
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
}

function validateInput(todoText, dueDate) {
    if (todoText.trim() === "") {
        showError("Please enter a to-do item.");
        return false;
    }
    if (dueDate === "") {
        showError("Please select a due date.");
        return false;
    }
    clearError();
    return true;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
}

function addTodo() {
    const todoText = todoInput.value.trim();
    const dueDate = dateInput.value;

    if (!validateInput(todoText, dueDate)) {
        return;
    }

    const newTodo = {
        text: todoText,
        dueDate: dueDate,
        status: 'pending',
        id: Date.now()
    };

    todos.push(newTodo);
    saveTodosToLocalStorage();
    renderTodoList();

    todoInput.value = '';
    dateInput.value = '';
}

function filterTodos() {
    const filterText = todoInput.value.trim();
    const filterDate = dateInput.value;

    if (filterText === "" && filterDate === "") {
        alert("Please fill in either the to-do or the date to filter!");
        return;
    }

    let filteredTodos = todos.filter(todo => {
        let matchText = filterText ? todo.text.toLowerCase().includes(filterText.toLowerCase()) : true;
        let matchDate = filterDate ? todo.dueDate === filterDate : true;
        return matchText && matchDate;
    });

    renderTodoList(filteredTodos);
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodosToLocalStorage();
    renderTodoList();
}

function deleteAllTodos() {
    if (todos.length === 0) {
        alert("There are no tasks to delete!");
        return;
    }
    if (confirm("Are you sure you want to delete all to-do items?")) {
        todos = [];
        saveTodosToLocalStorage();
        renderTodoList();
    }
}

function finishTodo(id) {
    todos = todos.map(todo =>
        todo.id === id && todo.status !== 'done'
            ? { ...todo, status: 'done' }
            : todo
    );
    saveTodosToLocalStorage();
    renderTodoList();
}

function renderTodoList(todosToRender = todos) {
    todoList.innerHTML = '';

    if (todosToRender.length === 0) {
        noTasksRow.style.display = '';
        todoList.appendChild(noTasksRow);
        return;
    } else {
        noTasksRow.style.display = 'none';
    }

    todosToRender.forEach(todo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${todo.text}</td>
            <td>${formatDate(todo.dueDate)}</td>
            <td class="${todo.status === 'done' ? 'status-done' : ''}">${todo.status}</td>
            <td>
                <button class="delete-button" data-id="${todo.id}" aria-label="Delete to-do">Delete</button>
                ${todo.status === 'pending' ? `<button class="finish-button" data-id="${todo.id}" aria-label="Finish to-do">Finish</button>` : ''}
            </td>
        `;
        todoList.appendChild(row);

        row.querySelector('.delete-button').addEventListener('click', () => deleteTodo(todo.id));
        if (todo.status === 'pending') {
            row.querySelector('.finish-button').addEventListener('click', () => finishTodo(todo.id));
        }
    });
}

function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

addButton.addEventListener('click', addTodo);
filterButton.addEventListener('click', filterTodos);
deleteAllButton.addEventListener('click', deleteAllTodos);

