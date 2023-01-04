import { domStuff } from "./domContoller";
import { Task } from "./constructors";
import { Project } from "./constructors";
import { format } from "date-fns";
import { domRender } from "./domRender"

const contentContainer = document.getElementById('content');
const sideBarContainer = document.querySelector('.side-bar');
const form = document.querySelector('form');

// initialize projects object for storing projects
let projects = {};

// static test
let taskOne = domStuff.addTaskToDOM(new Task('Go To Gym', '1 hour exercise', '8/24/2022', 'high', true));

contentContainer.appendChild(taskOne);

// user input test
const createTask = (e) => {
    e.preventDefault();

    const isCompleted = document.querySelector("[name='completed']:checked");
    let completed = isCompleted ? true : false;
    let title = document.getElementById('title').value;
    let description = document.getElementById('desc').value;
    let dueDate = format(new Date(document.getElementById('due').value), 'M/d/yyyy');
    let priority = document.getElementById('priority').value;
    let project = document.getElementById('project').value;

    let newTask = new Task(title, description, dueDate, priority, completed);
    if (project) {
        if (project in projects) {
            projects[project].addTask(newTask);
        } else {
            let newProject = new Project(project, [newTask]);
            projects[newProject.name] = newProject;
            sideBarContainer.appendChild(domStuff.addProjectToDOM(newProject));
        }
    }

    if (project) {
        domRender.displayProject(projects[project]);
    } else {
        // need to handle project-less tasks:
        // option 1. create a generic task array to hold all tasks
        // option 2. alternatively, get rid of projects array and replace with all tasks. project becomes a prop of tasks?
        // option 3. create a project-less project to house the remaining tasks. this is probably the best option :]
        domRender.displayTask(newTask);
    }
    
    form.reset();
}

// title, description, dueDate, priority, completed)
let exercise = new Project('exercise', []);
projects.exercise = exercise;
console.log(exercise);
exercise.addTask(new Task('Go To Gym', '1 hour exercise', 'tomorrow', 'high', true));
console.log(exercise.tasks);
console.log(exercise);


sideBarContainer.appendChild(domStuff.addProjectToDOM(exercise));

form.addEventListener('submit', createTask);

/*
+ Need to add data attribute to each task and project that corresponds to the index in the respective array
+ Think about separating display function from DOM element creation
+ Think through selectively displaying project option based on existance in projects array

*/