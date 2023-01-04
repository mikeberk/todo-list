const domStuff = (() => {
    const createHtmlElement = (tag, text, className) => {
        let newElement = document.createElement(tag);
        if (text) {
            newElement.textContent = text;
        }
        if (className) {
            newElement.classList.add(className);
        }
        return newElement;
    }

    const addTaskToDOM = (task) => {
        // use createHtmlElement to add each task prop to a container
        // props: title, description, dueDate, priority, completed
        let priority = task.priority == 'high' ? '!!!'
            : task.priority == 'medium' ? '!!'
            : task.priority == 'low' ? '!'
            : '';
        

        let taskName = createHtmlElement('p', task.title, 'task-title');
        let taskDesc = createHtmlElement('p', task.description, 'task-description');
        let taskDue = createHtmlElement('p', task.dueDate, 'task-due');
        let taskPrio = createHtmlElement('p', priority, 'task-prio');
        let taskCompleted = createHtmlElement('p', task.completed, 'task-completed');

        let taskContainer = createHtmlElement('div', null, 'task-container');
        taskContainer.appendChild(taskPrio);
        taskContainer.appendChild(taskName);
        taskContainer.appendChild(taskDesc);
        taskContainer.appendChild(taskDue);
        taskContainer.appendChild(taskCompleted);

        return taskContainer;
    }

    const addProjectToDOM = (project) => {
        //project.name
        let projectElem = createHtmlElement('p', project._name, 'project-name');
        return projectElem;
    }

    return {
        addTaskToDOM,
        addProjectToDOM
    }
})();

export { domStuff }