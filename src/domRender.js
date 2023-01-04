// Keep track of current project tab
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
        //
    }

    return {
        displayTask
    }
})();

export { domRender }