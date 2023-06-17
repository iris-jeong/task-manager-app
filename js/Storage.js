// eslint-disable-next-line no-unused-vars
class Storage {
	/**
	 * Save a task to local storage.
	 * @param {string} task
	 * @param {Date} date
	 */
	saveTask(task, date) {
		const newTask = new Task(date, task);
		const tasks = this.getTasks(date);
		tasks.push(newTask);
		this.updateTasks(date, tasks);
	}
	/**
	 * Retrieve tasks from local storage given a date key.
	 * @param {Date} dateKey
	 * @returns {(Task|Array)}
	 */
	getTasks(dateKey) {
		const storedTasks = localStorage.getItem(dateKey); //MM-DD-YYYY
		return storedTasks ? JSON.parse(storedTasks) : [];
	}
	getTask(dateKey, id) {
		const tasks = JSON.parse(localStorage.getItem(dateKey)); //MM-DD-YYYY
		if (tasks[id]) {
			return tasks[id];
		}
		return null;
	}
	/**
	 * Updates the task in storage.
	 * @param {Date} taskDate
	 * @param {number} taskId
	 */
	updateTask(taskDate, taskId) {
		const tasks = this.getTasks(taskDate);
		tasks[taskId].isComplete = !tasks[taskId].isComplete;
		this.updateTasks(taskDate, tasks);
	}
	updateTasks(dateKey, tasks) {
		localStorage.setItem(dateKey, JSON.stringify(tasks));
	}
}

class Task {
	constructor(date, task) {
		this.date = date;
		this.task = task;
		this.isComplete = false;
	}
	toggleCompletion() {
		this.isComplete = !this.isComplete;
	}
}
