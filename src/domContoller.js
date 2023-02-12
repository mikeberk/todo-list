import { format } from "date-fns";
import globalVars from "./globals";
import { domRender } from "./domRender";

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

    const deleteProject = (e) => {
        let projectToDelete = e.target.previousElementSibling.textContent;
        let filteredTasks = globalVars.tasksArr.filter(t => t.project == projectToDelete);
        for (let i = 0; i < filteredTasks.length; i++) {
            filteredTasks[i].project = '';
        }
        let projectsIndex = globalVars.projectsArr.indexOf(projectToDelete);
        globalVars.projectsArr.splice(projectsIndex, 1);
        domRender.displayProjects(globalVars.projectsArr);
        if (globalVars.currentDisplay == projectToDelete) {
            domRender.displayTasks(globalVars.tasksArr.sort((a, b) => a.taskAdded - b.taskAdded));
        }
        const projects = document.querySelectorAll('.project-name')
        projects.forEach(proj => proj.addEventListener('click', switchProject));
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
    const deleteTask = (e) => {
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

    const editTask = (e) => {
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

    const switchProject = (e) => {
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
        trashElem.addEventListener('click', deleteProject);
        return projectElemWrapper;
    }


    return {
        addTaskToDOM,
        addProjectToDOM,
        editTask,
        deleteTask
    }
})();

export { domStuff }