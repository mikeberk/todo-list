import { Task } from "./constructors";
import { format } from "date-fns";
import { domRender } from "./domRender";
import { domStuff } from "./domContoller";
import globalVars from './globals';

const newTaskForm = document.querySelector('.new-task-form');
const newTaskDiv = document.querySelector('.new-task');
const powerball = document.querySelector('.power-ball');
const cancelBtn = document.querySelector('.close');

powerball.addEventListener('click', toggleForm);
cancelBtn.addEventListener('click', toggleForm);

// initialize projects and tasks arrays. when moving to local store, update to seed with existing tasks/projects
//let globalVars.projectsArr = [];
//let globalVars.tasksArr = [];
// create a global reference to current project/page
//let globalVars.currentDisplay = 'default';

// static test
let taskOne = new Task('Go To Gym', '1 hour exercise', '', 'high', 'exercise', false);
globalVars.tasksArr.push(taskOne);
globalVars.projectsArr.push('exercise');
domRender.displayProjects(globalVars.projectsArr);
domRender.displayTasks(globalVars.tasksArr);
const deleteBtns = document.querySelectorAll(".delete-btn");
deleteBtns.forEach(btn => btn.addEventListener('click', domStuff.deleteTask));

const editBtns = document.querySelectorAll(".edit-btn");
editBtns.forEach(btn => btn.addEventListener('click', domStuff.editTask));

const createTask = (e) => {
    e.preventDefault();

    //const isCompleted = document.querySelector("[name='completed']:checked");
    //let completed = isCompleted ? true : false;
    let completed = false;
    let title = document.getElementById('title').value;
    let description = document.getElementById('desc').value;
    let dueDate = document.getElementById('due').value === '' ? '' : format(new Date(document.getElementById('due').value), 'yyyy-MM-dd');
    let priority = document.getElementById('priority').value;
    let project = document.getElementById('project').value;

    let newTask = new Task(title, description, dueDate, priority, project, completed);
    if (project) {
        if (!globalVars.projectsArr.includes(project)) {
            globalVars.projectsArr.push(project);
        }
        domRender.displayProjects(globalVars.projectsArr);
    } 
    globalVars.tasksArr.push(newTask);

    if (project) {
        let currentProjectTasks = globalVars.tasksArr.filter(task => task.project == project);
        domRender.displayTasks(currentProjectTasks);
        globalVars.currentDisplay = project;
    } else {
        globalVars.tasksArr.sort((a, b) => a.taskAdded - b.taskAdded);
        domRender.displayTasks(globalVars.tasksArr);
        globalVars.currentDisplay = 'default';
    }
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach(btn => btn.addEventListener('click', domStuff.deleteTask));

    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach(btn => btn.addEventListener('click', domStuff.editTask));
    
    newTaskForm.reset();
    toggleForm();
    const projects = document.querySelectorAll('.project-name')
    projects.forEach(proj => proj.addEventListener('click', switchProject));
    //window.localStorage.setItem('tasks', JSON.stringify(globalVars.tasksArr));
    //console.log(JSON.parse(window.localStorage.getItem('tasks')));
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
// +delete projects
//  |__delete btn that shows up on hover. if tasks are in project, remove the project name?
//  |__this might be easier to build local storage so arrs can be accessed. create fn + event listener in domRender.js
// add icons to project list
// delete btn should be red
// local storage functionality
// the backgrounds don't extend when tasks go off page (change 100vh to 100%?)