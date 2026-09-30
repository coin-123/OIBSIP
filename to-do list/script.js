// Get the HTML elements we need

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");


// Get saved tasks from localStorage

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Add a new task

addTaskBtn.addEventListener("click", () => {

    const taskText = taskInput.value.trim();

    // Don't allow an empty task

    if (taskText === "") {
        return;
    }


    // Create a task object

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString()
    };


    // Add the task to our tasks array

    tasks.push(newTask);


    // Save tasks

    saveTasks();


    // Display tasks

    displayTasks();


    // Clear input

    taskInput.value = "";

});


// Allow Enter key to add a task

taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addTaskBtn.click();
    }

});


// Display tasks

function displayTasks() {

    // Clear the lists first

    pendingList.innerHTML = "";
    completedList.innerHTML = "";


    // Go through every task

    tasks.forEach((task) => {

        // Create the task container

        const li = document.createElement("li");

        li.classList.add("task-item");


        // Create checkbox

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed;


        // Create task text

        const taskText = document.createElement("span");

        taskText.classList.add("task-text");

        taskText.textContent = task.text;


        // Create timestamp

        const taskTime = document.createElement("small");

        taskTime.classList.add("task-time");

        taskTime.textContent = task.createdAt;


        // Create Edit button

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.classList.add("edit-btn");


        // Create Delete button

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add("delete-btn");


        // Add everything to the task

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(taskTime);
        li.appendChild(editButton);
        li.appendChild(deleteButton);


        // If task is completed

        if (task.completed) {

            li.classList.add("completed");

            completedList.appendChild(li);

        } else {

            pendingList.appendChild(li);

        }


        // Checkbox functionality

        checkbox.addEventListener("change", () => {

            task.completed = checkbox.checked;

            saveTasks();

            displayTasks();

        });


        // Edit functionality

        editButton.addEventListener("click", () => {

            const newText = prompt("Edit your task:", task.text);

            if (newText !== null && newText.trim() !== "") {

                task.text = newText.trim();

                saveTasks();

                displayTasks();

            }

        });


        // Delete functionality

        deleteButton.addEventListener("click", () => {

            tasks = tasks.filter((item) => {
                return item.id !== task.id;
            });

            saveTasks();

            displayTasks();

        });

    });


    // Update counts

    const pendingTasks = tasks.filter((task) => {
        return task.completed === false;
    });

    const completedTasks = tasks.filter((task) => {
        return task.completed === true;
    });


    pendingCount.textContent =
        `${pendingTasks.length} pending`;

    completedCount.textContent =
        `${completedTasks.length} completed`;


    // Show/hide empty messages

    if (pendingTasks.length === 0) {
        pendingEmpty.style.display = "block";
    } else {
        pendingEmpty.style.display = "none";
    }


    if (completedTasks.length === 0) {
        completedEmpty.style.display = "block";
    } else {
        completedEmpty.style.display = "none";
    }

}


// Save tasks to localStorage

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// Display saved tasks when page loads

displayTasks();