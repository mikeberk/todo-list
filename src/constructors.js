class Task {
    constructor(title, description, dueDate, priority, completed) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.taskAdded = Date.now();
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

    // set completed 
}

class Project {
    constructor(name, tasks) {
        this._name = name;
        this._tasks = tasks;
    }

    get tasks() {
        return this._tasks;
    }

    get name() {
        return this._name;
    }

    set name(newName) {
        newName = newName.trim();
        if (newName === '') {
            console.log('The name cannot be empty');
        } else {this._name = newName;}
    }

    addTask(task) {
        return this._tasks.push(task);
    }

    removeTask(task) {
        let index = this._tasks.map(e => e.title).indexOf(task);
        return this._tasks.splice(index, 1);
    }

    indexOfTask(task) {
        return this._tasks.map(e => e.title).indexOf(task);
    }
}

export { Task, Project };