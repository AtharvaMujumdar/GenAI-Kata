document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

const taskForm = document.getElementById('taskForm');
const taskTableBody = document.querySelector('#taskTable tbody');

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskInput = document.getElementById('task');
    const descriptionInput = document.getElementById('description');
    const deadlineDateInput = document.getElementById('deadlineDate');
    const deadlineTimeInput = document.getElementById('deadlineTime');
    const priorityInput = document.getElementById('priority');

    addTask(
        taskInput.value,
        descriptionInput.value,
        `${deadlineDateInput.value} ${deadlineTimeInput.value}`.trim(),
        priorityInput.value
    );

    taskInput.value = '';
    descriptionInput.value = '';
    deadlineDateInput.value = '';
    deadlineTimeInput.value = '';
    priorityInput.selectedIndex = 0;
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(taskData => {
        insertRow(taskData);
    });
}

function addTask(task, description, deadline, priority) {
    const taskData = {
        task,
        description,
        deadline,
        priority,
        completed: false
    };
    insertRow(taskData);
    updateLocalStorage();
}

function insertRow({ task, description, deadline, priority, completed }) {
    const row = taskTableBody.insertRow();
    row.style.backgroundColor = '#fff'; // Set background color to white

    const taskCell = row.insertCell(0);
    taskCell.innerHTML = `<strong>${task}</strong> <span style="color:${priority === 'high' ? 'red' : priority === 'moderate' ? 'yellow' : 'orange'}">(${priority})</span>`;
    row.insertCell(1).textContent = description;

    const countdownCell = row.insertCell(2);
    countdownCell.className = 'countdown';
    if (deadline) {
        initializeCountdown(countdownCell, deadline);
    } else {
        countdownCell.innerHTML = '&#8734;'; // Infinity symbol
    }

    const actionCell = row.insertCell(3);
    actionButtonsSetup(actionCell, row);
}

function initializeCountdown(countdownCell, deadline) {
    const targetDate = new Date(deadline);
    const updateTimer = () => {
        const now = new Date();
        const distance = targetDate - now;
        if (distance < 0) {
            countdownCell.textContent = 'Time up!';
            clearInterval(countdownCell.interval);
            return;
        }
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownCell.textContent = `${hours}h ${minutes}m ${seconds}s remaining`;
    };
    updateTimer();
    countdownCell.interval = setInterval(updateTimer, 1000);
}

function actionButtonsSetup(actionCell, row) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editDescription(row.cells[1]);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
        row.remove();
        if (row.querySelector('.countdown').interval) {
            clearInterval(row.querySelector('.countdown').interval);
        }
        updateLocalStorage();
    };

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Mark as Complete';
    completeButton.onclick = () => {
        row.className += ' completed';
        row.cells[2].textContent = 'Done';
        if (row.querySelector('.countdown').interval) {
            clearInterval(row.querySelector('.countdown').interval);
        }
        updateLocalStorage();
    };

    actionCell.append(editButton, deleteButton, completeButton);
}

function editDescription(descriptionCell) {
    const description = prompt('Edit description:', descriptionCell.textContent);
    if (description !== null) {
        descriptionCell.textContent = description;
        updateLocalStorage();
    }
}

function updateLocalStorage() {
    const tasks = Array.from(taskTableBody.rows).map(row => ({
        task: row.cells[0].textContent,
        description: row.cells[1].textContent,
        deadline: row.cells[2].textContent.endsWith('remaining') ? row.cells[2].textContent : '',
        priority: row.cells[0].innerHTML.match(/\((.*?)\)/)[1], 
        completed: row.cells[2].textContent === 'Done'
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}