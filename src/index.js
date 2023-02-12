import { Task } from "./constructors";
import { format } from "date-fns";
import { domRender } from "./domRender";
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
deleteBtns.forEach(btn => btn.addEventListener('click', deleteTask));

const editBtns = document.querySelectorAll(".edit-btn");
editBtns.forEach(btn => btn.addEventListener('click', editTask));

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
    deleteBtns.forEach(btn => btn.addEventListener('click', deleteTask));

    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach(btn => btn.addEventListener('click', editTask));
    
    newTaskForm.reset();
    toggleForm();
    const projects = document.querySelectorAll('.project-name')
    projects.forEach(proj => proj.addEventListener('click', switchProject));
    //window.localStorage.setItem('tasks', JSON.stringify(globalVars.tasksArr));
    //console.log(JSON.parse(window.localStorage.getItem('tasks')));
}

newTaskForm.addEventListener('submit', createTask);

function deleteTask(e) {
    let taskName = e.target.dataset.delete;
    let taskIndex = globalVars.tasksArr.map(e => e.title).indexOf(taskName);
    globalVars.tasksArr.splice(taskIndex, 1);

    if (globalVars.currentDisplay !== 'default') {
        let currentProjectTasks = globalVars.tasksArr.filter(task => task.project == globalVars.currentDisplay);
        domRender.displayTasks(currentProjectTasks);
    } else {
        globalVars.tasksArr.sort((a, b) => a.taskAdded - b.taskAdded);
        domRender.displayTasks(globalVars.tasksArr);
    }
 
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach(btn => btn.addEventListener('click', deleteTask));

    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach(btn => btn.addEventListener('click', editTask));
}

function editTask(e) {
    let taskName = e.target.dataset.edit;
    let taskIndex = globalVars.tasksArr.map(e => e.title).indexOf(taskName);
    let task = globalVars.tasksArr[taskIndex];
    e.target.textContent = 'Save'
    e.target.removeEventListener('click', editTask);

    const itemDiv = e.target.parentElement;
    itemDiv.focus();

    const titleInput = itemDiv.querySelector('input[name=title]');
    const descInput = itemDiv.querySelector('input[name=desc]');
    const dueInput = itemDiv.querySelector('input[name=due]');
    const select = itemDiv.querySelector('select');
    const deleteButton = itemDiv.querySelector('.delete-btn');
    const priorityIndicator = itemDiv.querySelector('.indicator');
    const projectInput = itemDiv.querySelector('input[name=project]');

    titleInput.removeAttribute('readonly');
    descInput.removeAttribute('readonly');
    dueInput.removeAttribute('readonly');
    projectInput.removeAttribute('readonly');
    projectInput.style.fontStyle = 'normal';
    projectInput.style.fontWeight = 'normal';

    dueInput.hidden = false;
    priorityIndicator.hidden = true;
    select.removeAttribute('disabled');
    select.classList.remove('hidden');
    select.removeAttribute('hidden');

    e.target.addEventListener('click', (e) => {
        e.preventDefault();
        task._title = titleInput.value;
        task.description = descInput.value;
        task.dueDate = dueInput.value;
        task.priority = select.value;

        if (task.project !== projectInput.value) {
            if (!globalVars.projectsArr.includes(projectInput.value)) {
                globalVars.projectsArr.push(projectInput.value);
            }
            domRender.displayProjects(globalVars.projectsArr);
            const projects = document.querySelectorAll('.project-name')
            projects.forEach(proj => proj.addEventListener('click', switchProject));
            // const wrappers = document.querySelectorAll('project-wrapper');
            // wrappers.forEach(div => div.addEventListener('mouseover', toggleTrashCan));
            // wrappers.forEach(div => div.addEventListener('mouseleave', toggleTrashCan));
        } 
        task.project = projectInput.value;

        titleInput.readOnly = true;
        descInput.readOnly = true;
        dueInput.readOnly = true;
        if (dueInput.value === '') {
            dueInput.hidden = true;
        }
        select.disabled = true;
        select.classList.add('hidden');
        select.hidden = true;
        projectInput.readOnly = true;
        projectInput.style.fontStyle = 'italic';
        projectInput.style.fontWeight = 'bold';
        
        priorityIndicator.textContent = task.priority == 'high' ? '!!!'
        : task.priority == 'medium' ? '!!'
        : task.priority == 'low' ? '!'
        : '';
        priorityIndicator.hidden = false;

        e.target.textContent = 'Edit';
        e.target.dataset.edit = task.title;
        deleteButton.dataset.delete = task.title;
        e.target.addEventListener('click', editTask);
        // need to add the project input
        // re-render tasks on save or just make all attributes readonly and swap the event listener on the save/edit btn?
        
    })
}

function toggleForm() {
    if (globalVars.currentDisplay !== 'default') {
        document.getElementById('project').value = globalVars.currentDisplay;
    } else {
        document.getElementById('project').value = '';
    }
    domRender.toggleForm(powerball);
    domRender.toggleForm(newTaskDiv);
}

function switchProject(e) {
    let projectClicked = e.target.textContent;
    if (projectClicked == 'All Tasks') {
        globalVars.tasksArr.sort((a, b) => a.taskAdded - b.taskAdded);
        domRender.displayTasks(globalVars.tasksArr);
        globalVars.currentDisplay = 'default';
    } else {
        domRender.displayTasks(globalVars.tasksArr.filter(t => t.project == projectClicked));
        globalVars.currentDisplay = projectClicked;
    }
    
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach(btn => btn.addEventListener('click', deleteTask));
    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach(btn => btn.addEventListener('click', editTask));
}

// move this to domRender.js after local storage buildout



// REMAINING TASKS
// +delete projects
//  |__delete btn that shows up on hover. if tasks are in project, remove the project name?
//  |__this might be easier to build local storage so arrs can be accessed. create fn + event listener in domRender.js
// add icons to project list
// delete btn should be red
// local storage functionality