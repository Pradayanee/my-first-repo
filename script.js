// ── Load tasks from localStorage on page load ──
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

window.onload = function () {
  renderTasks();
};

// ── Add a new task ──
function addTask() {
  const input     = document.getElementById('taskInput');
  const dateInput = document.getElementById('taskDate');
  const priority  = document.getElementById('taskPriority').value;

  const text = input.value.trim();
  if (text === '') {
    alert('Please enter a task!');
    return;
  }

  const task = {
    id       : Date.now(),
    text     : text,
    date     : dateInput.value || 'No due date',
    priority : priority,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  input.value     = '';
  dateInput.value = '';
}

// ── Toggle complete/incomplete ──
function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

// ── Delete a single task ──
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// ── Clear all tasks ──
function clearAll() {
  if (tasks.length === 0) return;
  if (confirm('Delete all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// ── Filter tasks ──
function filterTasks(filter) {
  currentFilter = filter;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  renderTasks();
}

// ── Render tasks to the page ──
function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  let filtered = tasks;
  if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);
  if (currentFilter === 'pending')   filtered = tasks.filter(t => !t.completed);

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state">🎉 No tasks here!</div>';
  } else {
    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''}
               onchange="toggleTask(${task.id})" />
        <div class="task-info">
          <div class="task-text">${task.text}</div>
          <div class="task-meta">📅 ${task.date} &nbsp;|&nbsp; Priority: ${task.priority}</div>
        </div>
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑 Delete</button>
      `;
      list.appendChild(li);
    });
  }

  updateCounter();
}

// ── Update task counters ──
function updateCounter() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;

  document.getElementById('totalCount').textContent     = `Total: ${total}`;
  document.getElementById('completedCount').textContent = `Completed: ${completed}`;
  document.getElementById('pendingCount').textContent   = `Pending: ${pending}`;
}

// ── Save to localStorage ──
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ── Allow pressing Enter to add task ──
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
  });
});