class Task {
    constructor(title, description, dueDate, priority, completed) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
    }
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
        }
        this._name = newName;
    }

    addTask(task) {
        return this._tasks.push(task);
    }
}

export { Task, Project };