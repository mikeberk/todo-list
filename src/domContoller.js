import { format } from "date-fns";

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
        const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

        const taskName = document.createElement('input');
        taskName.setAttribute('type', 'text');
        taskName.setAttribute('name', 'title');
        taskName.value = task.title;
        taskName.readOnly = true;

        const taskDesc = document.createElement('input');
        taskDesc.setAttribute('type', 'text');
        taskDesc.setAttribute('name', 'desc');
        taskDesc.value = task.description;
        taskDesc.readOnly = true;

        const taskDue = document.createElement('input');
        taskDue.setAttribute('type', 'date');
        taskDue.setAttribute('name', 'due');
        taskDue.value = task.dueDate;
        taskDue.readOnly = true;

        const taskPrio = document.createElement('select');
        taskPrio.setAttribute('name', 'priority');
        let prioOptions = ['None', 'High', 'Medium', 'Low'];
        for (let i = 0; i < prioOptions.length; i++) {
            let option = document.createElement('option');
            option.value = prioOptions[i].toLowerCase();
            option.textContent = prioOptions[i];
            taskPrio.appendChild(option);
        }
        let currentPrio = task.priority;
        for (let i, j = 0; i = taskPrio.options[j]; j++) {
            if(i.value == currentPrio) {
              taskPrio.selectedIndex = j;
              break;
            }
        }
        taskPrio.disabled = true;

        const editBtn = createHtmlElement('button', 'Edit', 'edit-btn');
        editBtn.dataset.edit = task.title;
        const deleteBtn = createHtmlElement('button', 'Delete', 'delete-btn');
        deleteBtn.dataset.delete = task.title;

        todoItem.appendChild(taskPrio);
        todoItem.appendChild(taskName);
        todoItem.appendChild(taskDesc);
        todoItem.appendChild(taskDue);
        todoItem.appendChild(editBtn);
        todoItem.appendChild(deleteBtn);

        return todoItem;
    }
/*
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

        let editBtn = createHtmlElement('button', 'Edit', 'edit-btn');
        editBtn.dataset.edit = task.title;
        let deleteBtn = createHtmlElement('button', 'Delete', 'delete-btn');
        deleteBtn.dataset.delete = task.title;

        let taskContainer = createHtmlElement('div', null, 'task-container');
        taskContainer.appendChild(taskPrio);
        taskContainer.appendChild(taskName);
        taskContainer.appendChild(taskDesc);
        taskContainer.appendChild(taskDue);
        taskContainer.appendChild(taskCompleted);
        taskContainer.appendChild(editBtn);
        taskContainer.appendChild(deleteBtn);

        return taskContainer;
    }
*/
    const addProjectToDOM = (project) => {
        //project.name
        let projectElem = createHtmlElement('p', project, 'project-name');
        return projectElem;
    }

    return {
        addTaskToDOM,
        addProjectToDOM
    }
})();

export { domStuff }