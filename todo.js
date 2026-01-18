// --- 1. Logika danych (LocalStorage) ---

const todoService = {
    // Pobierz wszystkie zadania z pamięci przeglądarki
    getTasks() {
        return JSON.parse(localStorage.getItem('todos') || '[]');
    },

    // Zapisz całą tablicę do pamięci
    saveTasks(todos) {
        localStorage.setItem('todos', JSON.stringify(todos));
    },

    addTask(taskText) {
        const todos = this.getTasks();
        const newTask = { id: Date.now(), text: taskText, completed: false };
        todos.push(newTask);
        this.saveTasks(todos);
    },

    toggleTask(id) {
        const todos = this.getTasks();
        const task = todos.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks(todos);
        }
    },

    deleteTask(id) {
        let todos = this.getTasks();
        todos = todos.filter(t => t.id !== id);
        this.saveTasks(todos);
    }
};

// --- 2. Warstwa Interfejsu (UI) ---

const listElement = document.getElementById('todo-list');
const inputElement = document.getElementById('task-input');
let currentFilter = 'all'; // Domyślny filtr

function render() {
    const todos = todoService.getTasks();
    listElement.innerHTML = '';

    // Filtrowanie
    const filteredTodos = todos.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    // Rysowanie listy
    filteredTodos.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');
        
        // Zmieniamy ikonę przycisku zależnie od stanu (✓ lub ↺)
        const checkIcon = task.completed ? '↺' : '✓';
        
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="actions">
                <button class="check-btn" onclick="toggleTask(${task.id})">${checkIcon}</button>
                <button class="delete-btn" onclick="removeTask(${task.id})">🗑️</button>
            </div>
        `;
        listElement.appendChild(li);
    });
}

// --- Obsługa zdarzeń ---

// Dodawanie zadania
document.getElementById('add-btn').addEventListener('click', () => {
    const text = inputElement.value;
    if (!text) return;

    todoService.addTask(text);
    inputElement.value = '';
    render();
});

// Zmiana filtra (wywoływana z HTML)
window.setFilter = (filterType) => {
    currentFilter = filterType;
    
    // Zmiana aktywnego przycisku (wygląd)
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`button[onclick="setFilter('${filterType}')"]`);
    if(activeBtn) activeBtn.classList.add('active');

    render();
};

// Akcje na zadaniach (wywoływane z HTML)
window.toggleTask = (id) => {
    todoService.toggleTask(id);
    render();
};

window.removeTask = (id) => {
    todoService.deleteTask(id);
    render();
};

// Start aplikacji
render();