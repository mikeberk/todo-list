import { format } from "date-fns";
import { globalVars } from "./globals";
import { domRender } from "./domRender";

const projectHeader = document.querySelector('.current-project');

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
        let tasksArr = [];
        tasksArr.push(...globalVars.getTasks());
        let filteredTasks = tasksArr.filter(t => t.project == projectToDelete);
        for (let i = 0; i < filteredTasks.length; i++) {
            filteredTasks[i].project = '';
        }
        globalVars.setTasks(tasksArr);

        let projectsArr = [];
        projectsArr.push(...globalVars.getProjects());
        let projectsIndex = projectsArr.indexOf(projectToDelete);
        projectsArr.splice(projectsIndex, 1);
        globalVars.setProjects(projectsArr);
        domRender.displayProjects(globalVars.getProjects());
        if (globalVars.currentDisplay == projectToDelete) {
            let tasks = [];
            tasks.push(...globalVars.getTasks());
            domRender.displayTasks(tasks.sort((a, b) => a.taskAdded - b.taskAdded));
            globalVars.currentDisplay = 'default';
            projectHeader.textContent = 'All Tasks';
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
            let title = e.target.parentElement.previousElementSibling.value;
            let tasks = [];
            tasks.push(...globalVars.getTasks());
            let thisTaskIndex = tasks.map(e => e.title).indexOf(title);
            let thisTask = tasks[thisTaskIndex];
            thisTask.completed = e.target.checked;
            taskName.classList.toggle('completed');
            globalVars.setTasks(tasks);
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
 
    const deleteTask = (e) => {
        let taskName = e.target.dataset.delete;
        let updatedTasks = [];
        updatedTasks.push(...globalVars.getTasks());
        let taskIndex = updatedTasks.map(e => e.title).indexOf(taskName);
        updatedTasks.splice(taskIndex, 1);
        globalVars.setTasks(updatedTasks);

        let newTasksArr = [];
        newTasksArr.push(...globalVars.getTasks());
        if (globalVars.currentDisplay !== 'default') {
            let currentProjectTasks = newTasksArr.filter(task => task.project == globalVars.currentDisplay);
            domRender.displayTasks(currentProjectTasks);
        } else {
            let sortedTasks = newTasksArr.sort((a, b) => a.taskAdded - b.taskAdded);
            domRender.displayTasks(sortedTasks);
        }
    
        const deleteBtns = document.querySelectorAll(".delete-btn");
        deleteBtns.forEach(btn => btn.addEventListener('click', deleteTask));

        const editBtns = document.querySelectorAll(".edit-btn");
        editBtns.forEach(btn => btn.addEventListener('click', editTask));
    }

    const editTask = (e) => {
        let taskName = e.target.dataset.edit;
        let tasksArr = []
        tasksArr.push(...globalVars.getTasks());
        let taskIndex = tasksArr.map(e => e.title).indexOf(taskName);
        let task = tasksArr[taskIndex];
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
                let projectsArr = [...globalVars.getProjects()];
                if (!projectsArr.includes(projectInput.value)) {
                    let updatedProjects = [...globalVars.getProjects()]
                    updatedProjects.push(projectInput.value);
                    globalVars.setProjects(updatedProjects);
                }
                domRender.displayProjects(globalVars.getProjects());
                const projects = document.querySelectorAll('.project-name')
                projects.forEach(proj => proj.addEventListener('click', switchProject));
            } 
            task.project = projectInput.value;
            globalVars.setTasks(tasksArr);

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
        })
    }

    const switchProject = (e) => {
        let projectClicked = e.target.textContent;
        if (projectClicked == 'All Tasks') {
            let tasksArr = [];
            tasksArr.push(...globalVars.getTasks());
            let sortedTasks = tasksArr.sort((a, b) => a.taskAdded - b.taskAdded);
            domRender.displayTasks(sortedTasks);
            globalVars.currentDisplay = 'default';
            projectHeader.textContent = 'All Tasks';
        } else {
            let tasksArr = [];
            tasksArr.push(...globalVars.getTasks())
            let filteredTasks = tasksArr.filter(t => t.project == projectClicked);
            domRender.displayTasks(filteredTasks);
            globalVars.currentDisplay = projectClicked;
            projectHeader.textContent = projectClicked;
        }
        
        const deleteBtns = document.querySelectorAll(".delete-btn");
        deleteBtns.forEach(btn => btn.addEventListener('click', deleteTask));
        const editBtns = document.querySelectorAll(".edit-btn");
        editBtns.forEach(btn => btn.addEventListener('click', editTask));
    }

    const addProjectToDOM = (project) => {
        let projectElemWrapper = createHtmlElement('div', '', 'project-wrapper');
        let projectIcon = createHtmlElement('span', 'checklist', 'material-icons');
        let projectElem = createHtmlElement('p', project, 'project-name');
        let trashElem = createHtmlElement('span', 'delete_outline', 'material-icons');
        trashElem.classList.add('trash-can');
        projectIcon.classList.add('project-icon');
        projectElemWrapper.appendChild(projectIcon);
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
        deleteTask,
        switchProject
    }
})();

export { domStuff };