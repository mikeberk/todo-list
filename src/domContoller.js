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

    const createEditForm = (task, proj) => {
        //create form element
        let editForm = document.createElement('form');
        editForm.setAttribute('action', '#');
        editForm.setAttribute('autocomplete', 'off');

        //create input for task title
        let editTitle = document.createElement('input');
        editTitle.setAttribute('type', 'text');
        editTitle.setAttribute('id', 'title');
        editTitle.setAttribute('placeholder', task.title);
        editTitle.setAttribute('name', 'title');
        editTitle.setAttribute('required', '');

        //create input for task description
        let editDesc = document.createElement('input');
        editDesc.setAttribute('type', 'text');
        editDesc.setAttribute('id', 'desc');
        editDesc.setAttribute('placeholder', task.description);
        editDesc.setAttribute('name', 'desc');
        editDesc.setAttribute('required', '');

        //create input for task date
        let editDate = document.createElement('input');
        editDate.setAttribute('type', 'date');
        editDate.setAttribute('id', 'due')
        editDesc.setAttribute('name', 'due');
        editDesc.setAttribute('placeholder', task.dueDate); //might need to mess with the date formatting

        //create drop-down for priority
        let options = ['None', 'High', 'Medium', 'Low'];
        let editPriority = document.createElement('select');
        editPriority.id = 'priority';
        for (let i = 0; i < options.length; i++) {
            let option = document.createElement('option');
            option.value = options[i.toLowerCase()];
            option.textContent = options[i];
            editPriority.appendChild(option);
        }

        //create input for project
        let editProject = document.createElement('input');
        editProject.setAttribute('type', 'text');
        editProject.setAttribute('id', 'project');
        if (proj) editProject.setAttribute('placeholder', proj);
        editProject.setAttribute('name', 'project');

        //create submit button
        let editSubmit = document.createHtmlElement('submit');
        editSubmit.textContent = 'Ok';
        editSubmit.classList.add('okay-btn');

        let formNodes = [editTitle, editDesc, editDate, editPriority, editProject, editSubmit];
        for (let i = 0; i < formNodes.length; i++) {
            editForm.appendChild(formNodes[i]);
        }

        return editForm;

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

        todoItem.appendChild(taskPrio);
        todoItem.appendChild(taskName);
        todoItem.appendChild(taskDesc);
        todoItem.appendChild(taskDue);

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
        addProjectToDOM,
        createEditForm
    }
})();

export { domStuff }