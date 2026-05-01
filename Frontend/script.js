const API = "http://127.0.0.1:5000/tasks";

function loadTasks() {
    fetch(API)
    .then(res => res.json())
    .then(data => {

        const search = document.getElementById("search").value.toLowerCase();
        const list = document.getElementById("taskList");
        list.innerHTML = "";

        let completed = 0;

        data.forEach(task => {

            if (!task.title.toLowerCase().includes(search)) return;

            if (task.completed) completed++;

            const div = document.createElement("div");
            div.className = "task" + (task.completed ? " completed" : "");

            div.innerHTML = `
                <div onclick="editTask(${task.id}, '${task.title}', '${task.due_date}')">
                    <strong>${task.title}</strong><br>
                    <small>${task.due_date || ""}</small>
                </div>
                <div>
                    <button onclick="toggle(${task.id}, '${task.title}', ${task.completed}, '${task.due_date}')">✔</button>
                    <button onclick="removeTask(${task.id})">🗑</button>
                </div>
            `;

            list.appendChild(div);
        });

        updateProgress(data.length, completed);
    });
}

function addTask() {
    const title = document.getElementById("taskInput").value;
    const due_date = document.getElementById("dueDate").value;

    fetch(API, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title, due_date})
    }).then(() => {
        document.getElementById("taskInput").value = "";
        loadTasks();
    });
}

function toggle(id, title, completed, due_date) {
    fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            title,
            completed: completed ? 0 : 1,
            due_date
        })
    }).then(loadTasks);
}

function removeTask(id) {
    fetch(`${API}/${id}`, {method: "DELETE"})
    .then(loadTasks);
}

function editTask(id, title, due_date) {
    const newTitle = prompt("Edit task:", title);
    if (!newTitle) return;

    fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            title: newTitle,
            completed: 0,
            due_date
        })
    }).then(loadTasks);
}

function updateProgress(total, completed) {
    const percent = total ? (completed / total) * 100 : 0;
    document.getElementById("progressBar").style.width = percent + "%";
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}

loadTasks();