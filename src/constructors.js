class Task {
    constructor(title, description, dueDate, priority, project, completed, taskAdded = Date.now()) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
        this.taskAdded = taskAdded;
        this.project = project;
    }

    set _title(newTitle) {
        if (newTitle === '') {
            console.log('The title cannot be empty');
            return;
        } 
        return this.title = newTitle;
    }
}

export { Task };