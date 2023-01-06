// Keep track of current project tab - should be handled on index.js
// Re-render dom to new project tab when a project is created or task is added to a project
// If the current tab is the same project that the task is added to, don't re-render everything
// Control rendering when user clicks on a different project tab
// Should tasks be sorted by due date?

import { domStuff  } from "./domContoller";

const contentContainer = document.getElementById('content');
const sideBarContainer = document.querySelector('.side-bar');

const domRender = (() => {
    const displayTask = (task) => {
        contentContainer.appendChild(domStuff.addTaskToDOM(task));
    }

    const displayProject = (project) => {
        if (contentContainer.hasChildNodes()) {
            while (contentContainer.firstChild) {
                contentContainer.removeChild(contentContainer.firstChild);
            }
        }
        project.tasks.forEach(task => contentContainer.appendChild(domStuff.addTaskToDOM(task)));
    }

    const displayAllTasks = (tasks) => {
        if (contentContainer.hasChildNodes()) {
            while (contentContainer.firstChild) {
                contentContainer.removeChild(contentContainer.firstChild);
            }
        }
        tasks.forEach(task => contentContainer.appendChild(domStuff.addTaskToDOM(task)));
    }

    return {
        displayTask,
        displayProject,
        displayAllTasks
    }
})();

export { domRender }