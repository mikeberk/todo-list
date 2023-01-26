class Task {
    constructor(title, description, dueDate, priority, project, completed) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.taskAdded = Date.now();
        this.project = project;
    }

    set setTitle(newTitle) {
        if (newTitle === '') {
            console.log('The title cannot be empty');
            return;
        } 
        return this._title = newTitle;
    }

    set setDescription(newDesc) {
        return this._description = newDesc;
    }

    set setDueDate(newDueDate) {
        return this._dueDate = newDueDate;
    }

    set setPriority(newPriority) {
        return this._priority = newPriority;
    }

    set setProject(newProject) {
        return this._project = newProject;
    }

    // set completed 
}

export { Task };