import { Task } from "./constructors";
import { format } from "date-fns";
import { domRender } from "./domRender"

const newTaskForm = document.querySelector('.new-task-form');

// initialize projects and tasks arrays. when moving to local store, update to seed with existing tasks/projects
let projectsArr = [];
let tasksArr = [];

// static test
let taskOne = new Task('Go To Gym', '1 hour exercise', '8/24/2022', 'high', 'exercise', false);
tasksArr.push(taskOne);
projectsArr.push('exercise');
domRender.displayProjects(projectsArr);
domRender.displayTasks(tasksArr);
const deleteBtns = document.querySelectorAll(".delete-btn");
deleteBtns.forEach(btn => btn.addEventListener('click', deleteTask));

const editBtns = document.querySelectorAll(".edit-btn");
editBtns.forEach(btn => btn.addEventListener('click', editTask));

const createTask = (e) => {
    e.preventDefault();

    const isCompleted = document.querySelector("[name='completed']:checked");
    let completed = isCompleted ? true : false;
    let title = document.getElementById('title').value;
    let description = document.getElementById('desc').value;
    let dueDate = format(new Date(document.getElementById('due').value), 'yyyy-MM-dd');
    let priority = document.getElementById('priority').value;
    let project = document.getElementById('project').value;

    let newTask = new Task(title, description, dueDate, priority, project, completed);
    if (project) {
        if (!projectsArr.includes(project)) {
            projectsArr.push(project);
        }
        domRender.displayProjects(projectsArr);
    } 
    tasksArr.push(newTask);

    if (project) {
        let currentProjectTasks = tasksArr.filter(task => task.project == project);
        domRender.displayTasks(currentProjectTasks);
    } else {
        tasksArr.sort((a, b) => a.taskAdded - b.taskAdded);
        domRender.displayTasks(tasksArr);
    }
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach(btn => btn.addEventListener('click', deleteTask));
    
    newTaskForm.reset();
}

newTaskForm.addEventListener('submit', createTask);

function deleteTask(e) {
    let taskName = e.target.dataset.delete;
    let taskIndex = tasksArr.map(e => e.title).indexOf(taskName);
    tasksArr.splice(taskIndex, 1);

    // sort the array of all tasks by the timestamp they were added
    tasksArr.sort((a, b) => a.taskAdded - b.taskAdded);
    domRender.displayTasks(tasksArr);
}

function editTask(e) {
    let taskName = e.target.dataset.edit;
    let taskIndex = tasksArr.map(e => e.title).indexOf(taskName);
    let task = tasksArr[taskIndex];
    e.target.textContent = 'Save'
    e.target.removeEventListener('click', editTask);

    const itemDiv = e.target.parentElement;
    itemDiv.focus();
    console.log(itemDiv);

    const titleInput = itemDiv.querySelector('input[name=title]');
    const descInput = itemDiv.querySelector('input[name=desc]');
    const dueInput = itemDiv.querySelector('input[name=due]');
    const select = itemDiv.querySelector('select');
    const deleteButton = itemDiv.querySelector('.delete-btn');

    titleInput.removeAttribute('readonly');
    descInput.removeAttribute('readonly');
    dueInput.removeAttribute('readonly');
    select.removeAttribute('disabled');

    e.target.addEventListener('click', (e) => {
        e.preventDefault();
        task._title = titleInput.value;
        task.description = descInput.value;
        task.dueDate = dueInput.value;
        task.priority = select.value;
        console.log(tasksArr);

        titleInput.readOnly = true;
        descInput.readOnly = true;
        dueInput.readOnly = true;
        select.disabled = true;

        e.target.textContent = 'Edit';
        e.target.dataset.edit = task.title;
        deleteButton.dataset.delete = task.title;
        e.target.addEventListener('click', editTask);
        // need to add the project input
        // re-render tasks on save or just make all attributes readonly and swap the event listener on the save/edit btn?
        
    })
}


/*
+ Need to add data attribute to each task and project that corresponds to the index in the respective array
+ Think about separating display function from DOM element creation
+ Think through selectively displaying project option based on existance in projects array

*/