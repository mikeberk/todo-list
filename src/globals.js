import { Task } from "./constructors";

const globalVars = (() => {
    const getTasks = () => {
        let taskObjects = JSON.parse(localStorage.getItem('tasks'));
        let tasksArr = [];
        for (let element of taskObjects) {
            let task = new Task(element.title, element.description, element.dueDate, element.priority, element.project, element.completed, element.taskAdded);
            tasksArr.push(task);
        };
        return tasksArr;
    }

    const setTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    const getProjects = () => {
        return JSON.parse(localStorage.getItem('projects'));
    }

    const setProjects = (projects) => {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    let currentDisplay = 'default';

    return {
        getTasks,
        setTasks,
        getProjects,
        setProjects,
        currentDisplay
    }

})();

export { globalVars };