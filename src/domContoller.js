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

        const statusWrapper = document.createElement('div');
        statusWrapper.classList.add('check-wrap');
        const taskStatus = document.createElement('input');
        taskStatus.setAttribute('type', 'checkbox');
        taskStatus.setAttribute('name', 'status');
        taskStatus.checked = task.completed;
        statusWrapper.appendChild(taskStatus);

        const taskName = document.createElement('input');
        taskName.setAttribute('type', 'text');
        taskName.setAttribute('name', 'title');
        taskName.value = task.title;
        taskName.readOnly = true;
        if (task.completed) {
            taskName.classList.add('completed');
        }

        const taskDesc = document.createElement('input');
        taskDesc.setAttribute('type', 'text');
        taskDesc.setAttribute('name', 'desc');
        taskDesc.value = task.description;
        taskDesc.readOnly = true;

        const taskDue = document.createElement('input');
        taskDue.setAttribute('type', 'date');
        taskDue.setAttribute('name', 'due');
        if (task.dueDate !== '') {
            taskDue.value = task.dueDate;
        }
        if (task.dueDate === '') {
            taskDue.hidden = true;
        }
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

        const taskProject = document.createElement('input');
        taskProject.setAttribute('type', 'text');
        taskProject.setAttribute('name', 'project');
        taskProject.value = task.project;
        taskProject.readOnly = true;


        let priorityIndicator = document.createElement('p');
        priorityIndicator.textContent = task.priority == 'high' ? '!!!'
        : task.priority == 'medium' ? '!!'
        : task.priority == 'low' ? '!'
        : '';
        priorityIndicator.classList.add('indicator');

        taskPrio.disabled = true;
        taskPrio.classList = 'hidden';
        taskPrio.hidden = true;

        const editBtn = createHtmlElement('button', 'Edit', 'edit-btn');
        editBtn.dataset.edit = task.title;
        const deleteBtn = createHtmlElement('button', 'Delete', 'delete-btn');
        deleteBtn.dataset.delete = task.title;

        taskStatus.addEventListener('change', (e) => {
            task.completed = e.target.checked;
            taskName.classList.toggle('completed');
        })

        todoItem.appendChild(taskPrio);
        todoItem.appendChild(priorityIndicator);
        todoItem.appendChild(taskName);
        todoItem.appendChild(statusWrapper);
        todoItem.appendChild(taskDesc);
        todoItem.appendChild(taskDue);
        todoItem.appendChild(taskProject);
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
        let projectElemWrapper = createHtmlElement('div', '', 'project-wrapper');
        let projectElem = createHtmlElement('p', project, 'project-name');
        let trashElem = createHtmlElement('span', 'delete_outline', 'material-icons');
        trashElem.classList.add('trash-can');
        projectElemWrapper.appendChild(projectElem)
        projectElemWrapper.appendChild(trashElem);

        function showTrashCan(e) {
            if (e.target.classList.contains('project-wrapper')) {
                e.target.classList.add('show-trash-can');
            }
        }

        function hideTrashCan(e) {
            if (e.target.classList.contains('project-wrapper')) {
                e.target.classList.remove('show-trash-can');
            }
        }

        projectElemWrapper.addEventListener('mouseover', showTrashCan);
        projectElemWrapper.addEventListener('mouseleave', hideTrashCan);
        return projectElemWrapper;
    }

    return {
        addTaskToDOM,
        addProjectToDOM
    }
})();

export { domStuff }