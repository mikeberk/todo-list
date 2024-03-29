import { Task } from "./constructors";
import { format } from "date-fns";
import { domRender } from "./domRender";
import { domStuff } from "./domContoller";
import { globalVars } from './globals';

const newTaskForm = document.querySelector('.new-task-form');
const newTaskDiv = document.querySelector('.new-task');
const powerball = document.querySelector('.power-ball');
const cancelBtn = document.querySelector('.close');
const projectHeader = document.querySelector('.current-project');

powerball.addEventListener('click', toggleForm);
cancelBtn.addEventListener('click', toggleForm);

// Initialize projects and tasks from local storage
let initTaks = [];
let initProjects = [];
if (localStorage.getItem('tasks')) {
    initTaks.push(...globalVars.getTasks());
}
if (localStorage.getItem('projects')) {
    initProjects.push(...globalVars.getProjects());
}

// Populate DOM with local sotrage takss and projects
domRender.displayTasks(initTaks);
domRender.displayProjects(initProjects);

const deleteBtns = document.querySelectorAll(".delete-btn");
deleteBtns.forEach(btn => btn.addEventListener('click', domStuff.deleteTask));
const editBtns = document.querySelectorAll(".edit-btn");
editBtns.forEach(btn => btn.addEventListener('click', domStuff.editTask));

const projects = document.querySelectorAll('.project-name');
projects.forEach(proj => proj.addEventListener('click', domStuff.switchProject));

// set local storage projects and tasks in the case where the page loads without either initialized
globalVars.setProjects(initProjects);
globalVars.setTasks(initTaks);

const createTask = (e) => {
    e.preventDefault();

    let completed = false;
    let title = document.getElementById('title').value;
    let description = document.getElementById('desc').value;
    let dueDate = document.getElementById('due').value === '' ? '' : format(new Date(document.getElementById('due').value), 'yyyy-MM-dd');
    let priority = document.getElementById('priority').value;
    let project = document.getElementById('project').value;

    let newTask = new Task(title, description, dueDate, priority, project, completed);
    if (project) {
        if (!globalVars.getProjects().includes(project)) {
            let projectsArr = []
            projectsArr.push(...globalVars.getProjects());
            projectsArr.push(project);
            globalVars.setProjects(projectsArr);
        }
        domRender.displayProjects([...globalVars.getProjects()]);
    } 
    let updatedTasks = []
    updatedTasks.push(...globalVars.getTasks())
    updatedTasks.push(newTask);
    globalVars.setTasks(updatedTasks);

    if (project) {
        let tasksArr = [];
        tasksArr.push(...globalVars.getTasks())
        let currentProjectTasks = tasksArr.filter(task => task.project == project);
        domRender.displayTasks(currentProjectTasks);
        globalVars.currentDisplay = project;
        projectHeader.textContent = project;
    } else {
        let tasksArr = [];
        tasksArr.push(...globalVars.getTasks())
        let sortedTasks = tasksArr.sort((a, b) => a.taskAdded - b.taskAdded);
        domRender.displayTasks(sortedTasks);
        globalVars.currentDisplay = 'default';
        projectHeader.textContent = 'All Tasks';
    }
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach(btn => btn.addEventListener('click', domStuff.deleteTask));

    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach(btn => btn.addEventListener('click', domStuff.editTask));
    
    newTaskForm.reset();
    toggleForm();
    const projects = document.querySelectorAll('.project-name');
    projects.forEach(proj => proj.addEventListener('click', domStuff.switchProject));
}

newTaskForm.addEventListener('submit', createTask);

function toggleForm() {
    if (globalVars.currentDisplay !== 'default') {
        document.getElementById('project').value = globalVars.currentDisplay;
    } else {
        document.getElementById('project').value = '';
    }
    domRender.toggleForm(powerball);
    domRender.toggleForm(newTaskDiv);
}

// REMAINING TASKS
// + Replace static test with populating dom with localstorage