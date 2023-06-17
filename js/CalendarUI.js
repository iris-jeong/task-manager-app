/**
 * Represents a CalendarUI object to manage presentation logic.
 * @class
 */
// eslint-disable-next-line no-unused-vars
class CalendarUI {
	constructor(calendar, storage) {
		this.calendar = calendar;
		this.storage = storage;
		this.selectedTaskDate = new Date();
		this.todayButton = document.querySelector("#today-button");
		this.headerMonth = document.querySelector(".header-month");
		this.headerYear = document.querySelector(".header-year");
		this.tasksDate = document.querySelector(".tasks-date");
		this.tasksList = document.querySelector(".tasks-list");
		this.taskInput = document.querySelector("#new-task");
		this.calendarBody = document.querySelector(".calendar-body");
		this.upcomingTasks = document.querySelector(".upcoming-tasks");
	}
	/**
	 * Set the title of the 'today' button.
	 */
	setTodayTitle() {
		const date = new Date();
		this.todayButton.title = date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	}
	/**
	 * Set the calendar header.
	 */
	setCalendarHeader() {
		const { month, year } = this.calendar.getCalendarHeader();
		this.headerMonth.innerHTML = month;
		this.headerYear.innerHTML = year;
	}
	/**
	 * Set the task list's header.
	 * @param {Date string} date - THe date as a JS Date object string.
	 */
	setTaskHeader(date) {
		const dateObj = new Date(date);
		const formattedDate = dateObj.toLocaleDateString("default", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		this.tasksDate.innerHTML = formattedDate;
	}
	/**
	 * Set the tasks in the side task box.
	 * @param {Date string} date - The date of the cell the user clicks on in the calendar
	 */
	setTaskbox(date) {
		this.tasksList.innerHTML = "";
		const formattedDate = this.formatDate(new Date(date));
		const tasks = this.storage.getTasks(formattedDate);

		if (tasks.length < 1) {
			const li = this.createElement(
				"li",
				"task-none",
				"",
				"There are no tasks to display"
			);
			this.tasksList.appendChild(li);
		} else {
			for (let i = 0; i < tasks.length; i++) {
				const li = this.createTaskCheckbox(tasks[i], i);
				this.tasksList.appendChild(li);
			}
		}
	}
	/**
	 * Add a task to the calendar cell body.
	 * @param {HTMLElement} cell
	 * @param {string} task
	 * @param {string} id
	 */
	addTaskToCell(cell, task, id) {
		const taskContainer = this.createElement("div", "cell-task");
		taskContainer.setAttribute("data-id", id);

		const dotDiv = document.createElement("div");
		dotDiv.classList.add("cell-dot");

		const taskDiv = document.createElement("div");
		taskDiv.innerHTML = task;

		taskContainer.appendChild(dotDiv);
		taskContainer.appendChild(taskDiv);

		cell.appendChild(taskContainer);
	}
	/**
	 * Remove a task from the calendar cell upon completion.
	 * @param {HTMLElement} cell
	 * @param {string} id
	 */
	removeTaskFromCell(cell, id) {
		// eslint-disable-next-line no-undef
		const taskElement = $(cell).find(`[data-id="${id}"]`);
		taskElement.remove();
	}
	/**
	 * Set the calendar body.
	 */
	setCalendarBody() {
		const fragmentBody = document.createDocumentFragment();
		const numRowsInMonth = this.calendar.getNumberOfRowsInMonth();
		const todaysMonthIdx = new Date().getMonth();
		const currentMonthIdx = this.calendar.monthIndex;
		const currentMonth = currentMonthIdx;
		const currentYear = this.calendar.year;
		let prevMonth = (currentMonth - 1 + 12) % 12; //Get the index of the previous month by subtracting 1, then add 12 to ensure positive value for the modulo (0-11), then add 1 to get (1-12).
		let nextMonth = (currentMonth % 12) + 1; //Get the index of the first month by mod 12 to ensure positive number, then add 1.
		let prevYear = prevMonth === 11 ? currentYear - 1 : currentYear;
		let nextYear = nextMonth === 0 ? currentYear + 1 : currentYear;

		const numDaysTilCurrentMonthStart =
			this.calendar.getWeekdayIndexOfFirstDay() - 1;
		let prevMonthDay =
			this.calendar.getLastDayOfPrevMonth() - numDaysTilCurrentMonthStart;
		let nextMonthDay = 1;

		//Create the calendar body.
		for (let i = 0; i < numRowsInMonth; i++) {
			//Create a row (which represents a week).
			const tableRow = this.createTableRow();

			//Create seven cells (which represents seven days) for each row.
			for (let j = 0; j < 7; j++) {
				let tableCell, cellContent;

				//If the current cell is before the first day of the month, fill in the appropriate days of previous month.
				if (this.isBeforeFirstDayOfMonth(i, j)) {
					tableCell = this.createTableCell("other-month-cell");

					const cellDate = new Date(
						prevYear,
						prevMonth,
						prevMonthDay
					);

					cellContent = this.createTableCellContent(
						"cell-day",
						this.formatCellId(cellDate),
						prevMonthDay
					);
					cellContent.setAttribute(
						"data-iso-date",
						cellDate.toISOString()
					);
					prevMonthDay++;

					tableCell.appendChild(cellContent);
					tableRow.appendChild(tableCell);
				}
				//If the current cell is after the last ady of the month, fill in the appropriate days of next month.
				else if (this.isAfterLastDayOfMonth(i, j)) {
					tableCell = this.createTableCell("other-month-cell");

					const cellDate = new Date(
						nextYear,
						nextMonth,
						nextMonthDay
					);

					cellContent = this.createTableCellContent(
						"cell-day",
						this.formatCellId(cellDate),
						nextMonthDay
					);
					cellContent.setAttribute(
						"data-iso-date",
						cellDate.toISOString()
					);

					nextMonthDay++;

					tableCell.appendChild(cellContent);
					tableRow.appendChild(tableCell);
				}
				//Else, fill in the table cells with the day number of the current month.
				else {
					const dayOfMonth = this.getDayOfMonth(
						i,
						j,
						this.calendar.getWeekdayIndexOfFirstDay()
					);
					const tableCell =
						this.createTableCell("current-month-cell");

					const cellDate = new Date(
						currentYear,
						currentMonth,
						dayOfMonth
					);
					const cellContent = this.createTableCellContent(
						"cell-day",
						this.formatCellId(cellDate),
						dayOfMonth
					);
					cellContent.setAttribute(
						"data-iso-date",
						cellDate.toISOString()
					);

					if (
						currentMonthIdx === todaysMonthIdx &&
						this.calendar.isToday(dayOfMonth)
					) {
						cellContent.classList.add("today");
					}

					tableCell.appendChild(cellContent); //Add the day to the table cell.

					//Add tasks from storage to the cell if available.
					const formattedDate = this.formatDate(cellDate);
					const tasks = this.storage.getTasks(formattedDate);

					if (tasks.length > 0) {
						for (let k = 0; k < tasks.length; k++) {
							if (!tasks[k].isComplete) {
								//If the task is not complete, show it on the calendar.
								this.addTaskToCell(tableCell, tasks[k].task, k);
							}
						}
					}
					tableRow.appendChild(tableCell); //Add the table cell to the row.
				}
			}
			fragmentBody.appendChild(tableRow);
		}
		this.calendarBody.appendChild(fragmentBody);
	}
	/**
	 * Add holidays to the calendar. If there are multiple holidays on the same day, only add the first one.
	 * @param {Array} holidays
	 */
	setHolidays(holidays) {
		//Create a map to keep track of holidays for each day.
		let holidayMap = {};
		holidays.forEach((holiday) => {
			const holidayDate = new Date(
				holiday.date.datetime.year,
				holiday.date.datetime.month - 1, //Subtracting 1 to get month index.
				holiday.date.datetime.day
			);
			const key = this.formatDate(holidayDate);

			if (!holidayMap[key]) {
				holidayMap[key] = holiday.name;

				const cell = document.getElementById(
					this.formatCellId(holidayDate)
				);

				if (cell.parentElement) {
					let holidayDiv = this.createTableCellContent(
						"holiday",
						"",
						holiday.name
					);

					holidayDiv.setAttribute("title", holiday.name);

					if (cell.nextElementSibling) {
						cell.parentElement.insertBefore(
							holidayDiv,
							cell.nextElementSibling
						);
					} else {
						cell.parentElement.appendChild(holidayDiv);
					}
				}
			}
		});
	}
	/**
	 * Create a new element with optional properties.
	 * @param {string} type - The element type.
	 * @param {string} [className] - The element's CSS class name.
	 * @param {string} [id] - The element's ID.
	 * @param {string} [innerHTML] - The inner HTML of the element.
	 * @returns {HTMLElement} - The created element.
	 */
	createElement(type, className, id, innerHTML) {
		const el = document.createElement(type);
		if (className) {
			el.classList.add(className);
		}
		if (id) {
			el.id = id;
		}
		if (innerHTML) {
			el.innerHTML = innerHTML;
		}
		return el;
	}
	/**
	 * Render the calendar.
	 */
	renderMonth() {
		this.calendar.fetchHolidays().then((holidays) => {
			this.setTodayTitle();
			this.clearCalendar();
			this.setCalendarHeader();
			this.setTaskHeader(this.calendar.date);
			this.setTaskbox(this.selectedTaskDate);
			this.setCalendarBody();
			if (holidays) {
				this.setHolidays(holidays);
			}
		});
	}
	/**
	 * Clear the calendar to reset.
	 */
	clearCalendar() {
		this.calendarBody.innerHTML = "";
	}
	/**
	 * Create a table row.
	 * @returns {HTMLElement} - The created tr element.
	 */
	createTableRow() {
		return this.createElement("tr", "table-row");
	}
	/**
	 * Create a table cell.
	 * @param {string} [className] - The td element's CSS class name.
	 * @returns {HTMLElement} - The created td element.
	 */
	createTableCell(className) {
		return this.createElement("td", className);
	}
	/**
	 * Insert the content of a table cell.
	 * @param {string} [className] - The element's CSS class name.
	 * @param {string} [id] - The element's ID.
	 * @param {string} [innerHTML] - The inner HTML of the element.
	 * @returns {HTMLElement} - The created element.
	 */
	createTableCellContent(className, id, innerHTML) {
		let cellContent = this.createElement("div", className, id, innerHTML);
		return cellContent;
	}
	/**
	 * Check if the current cell is before the first day of the month.
	 * @param {number} rowIndex - The index of the row.
	 * @param {number} columnIndex - The index of the column.
	 * @returns {boolean} - True if the current cell is before the first day of the month, false otherwise.
	 */
	isBeforeFirstDayOfMonth(rowIndex, columnIndex) {
		//Get the first day of the month Date(year, monthIndex, day).
		const firstDay = new Date(
			this.calendar.year,
			this.calendar.monthIndex,
			1
		);

		// Get the weekday index of the first day.
		const weekdayIndexOfFirstDay = firstDay.getDay(); //0-6.

		//Return whether in the first row of the calendar and the column index is before the column index of the first day of the month.
		return rowIndex === 0 && columnIndex < weekdayIndexOfFirstDay;
	}
	/**
	 * Check if the current cell is after the last day of the month.
	 * @param {number} rowIndex - The index of the row.
	 * @param {number} columnIndex - The index of the column.
	 * @returns {boolean} - True if the current cell is the after the last day of the month, false otherwise.
	 */
	isAfterLastDayOfMonth(rowIndex, columnIndex) {
		//Get the last day of the month by setting the day to '0' of the next month.
		const lastDay = new Date(
			this.calendar.year,
			this.calendar.monthIndex + 1,
			0
		);
		const weekdayIndexOfLastDay = lastDay.getDay(); //Get the weekday index of the last day.
		const rowNumber = rowIndex + 1; //Calendar row number.

		//Return if the row number is the last row of the month and the column index is past the column index of the last day of the month.
		return (
			rowNumber === this.calendar.getNumberOfRowsInMonth() &&
			columnIndex > weekdayIndexOfLastDay
		);
	}
	/**
	 * Get the day number of the cell.
	 * @param {number} rowIndex - The index of the row.
	 * @param {number} columnIndex - The index of the column.
	 * @param {number} firstDayWeekdayIndex - The index of the weekday for the first day of the month. (0-6).
	 * @returns {number} - The day of the month.
	 */
	getDayOfMonth(rowIndex, columnIndex, firstDayWeekdayIndex) {
		const firstDayOfMonth = 1;
		//Calculate the day of the month using the index of the row and column, and the weekday index of the first day of the month.
		const dayNumber =
			firstDayOfMonth + rowIndex * 7 + columnIndex - firstDayWeekdayIndex;
		return dayNumber;
	}
	/**
	 * Updates the calendar UI to the next month.
	 */
	handleNextMonthClick() {
		// console.log("this month: ", this.calendar.month);
		this.calendar.nextMonth();
		// console.log("next month: ", this.calendar.month);

		let today = new Date();
		if (today.getMonth() === this.calendar.monthIndex) {
			this.selectedTaskDate = today;
			this.setTaskbox(this.selectedTaskDate);
		} else {
			this.selectedTaskDate = new Date(
				this.calendar.year,
				this.calendar.monthIndex,
				this.calendar.day
			);
			this.setTaskbox(this.formatDate(this.selectedTaskDate));
		}
		this.renderMonth();
	}
	/**
	 * Updates the calendar UI to the previous month.
	 */
	handlePrevMonthClick() {
		this.calendar.prevMonth();
		this.selectedTaskDate = new Date(
			this.calendar.year,
			this.calendar.monthIndex,
			this.calendar.day
		);
		this.renderMonth();
		let formattedDate = this.formatDate(this.selectedTaskDate);
		this.setTaskbox(formattedDate);
	}
	/**
	 * Updates the tasks section.
	 * @param {Date string} date - The date of the cell the user clicks on in the calendar
	 */
	handleDayClick(date) {
		this.selectedTaskDate = new Date(date);
		this.setTaskHeader(date);
		this.setTaskbox(date);
	}
	/**
	 * Returns user back to today's month.
	 */
	handleTodayClick() {
		this.calendar.currentMonth();
		this.selectedTaskDate = new Date();
		this.renderMonth();
		this.setTaskbox(this.selectedTaskDate);
	}
	/**
	 * Save the newly added task to local storage and update the UI.
	 * @param {string} task
	 * @param {Date} date
	 * @param {string} page
	 */
	handleAddTask(task, date, page) {
		this.selectedTaskDate = date;

		this.storage.saveTask(task, this.formatDate(date)); //Save task to local storage.
		this.setTaskbox(date); //Add the task to the task list.
		const tasks = this.storage.getTasks(this.formatDate(date));

		if (page === "month") {
			const cellId = this.formatCellId(date);
			const cell = document.getElementById(cellId).parentElement;
			this.addTaskToCell(cell, task, tasks.length - 1); //Add the task to the calendar.
			this.taskInput.value = ""; //Reset the input.
		} else {
			//Find the appropriate task container to add the newly added task to the list.
			const taskContainer = document.getElementById(date.toISOString());
			this.addTaskToList(taskContainer, date);
		}
	}
	/**
	 * Update the task's completion in local storage and toggle text strikethrough for completion.
	 * @param {string} taskId
	 * @param {Date} taskDate
	 * @param {string} page
	 */
	handleTaskCompletion(taskId, taskDate, page) {
		this.selectedTaskDate = taskDate;
		this.storage.updateTask(this.formatDate(taskDate), taskId);

		if (page === "month") {
			const taskInput = document.getElementById(`task-${taskId}`);
			const taskLabel = taskInput.nextElementSibling;

			const taskCell = document.getElementById(
				this.formatCellId(taskDate)
			).parentElement;

			if (taskInput.checked) {
				console.log("task IS checked, remove it from the calendar.");
				taskLabel.classList.add("task-complete");
				this.removeTaskFromCell(taskCell, taskId);
			} else {
				console.log("task is NOT checked, add it to the calendar.");
				taskLabel.classList.remove("task-complete");
				this.addTaskToCell(taskCell, taskLabel.innerHTML, taskId);
			}
		}
	}
	/**
	 * Create a task in the task list.
	 * @param {Task} task
	 * @param {number} id
	 * @returns {HTMLElement}
	 */
	createTaskCheckbox(task, id) {
		// console.log("task for checkbox: ", task);
		const checkbox = this.createElement(
			"input",
			"task-input",
			`task-${id}`
		); //type, class, id, innerHTML.
		checkbox.type = "checkbox";
		checkbox.checked = task.isComplete;
		checkbox.setAttribute("data-id", id);

		const label = this.createElement("label", "task-label", "", task.task); //type, class, id, innerHTML.
		label.setAttribute("for", `task-${id}`);

		if (task.isComplete) {
			label.classList.add("task-complete");
		}

		const li = document.createElement("li");
		li.appendChild(checkbox);
		li.appendChild(label);

		return li;
	}
	/**
	 * Format JS Date object to MM-DD-YYYY.
	 * @param {Date} date - JS date object.
	 * @returns {string}
	 */
	formatDate(date) {
		const month = String(date.getMonth() + 1).padStart(2, "0"); //Get the month (0-11) and pad it with leading zeroes if necessary.
		const day = String(date.getDate()).padStart(2, "0"); //Get the day of the month and pad it with leading zeroes if necessary.
		const year = date.getFullYear(); //Get the year (e.g. 2023).
		return `${month}-${day}-${year}`;
	}
	/**
	 * Format JS Date object to create an id for the cell e.g. 'MonJun052023'.
	 * @param {Date} date
	 * @returns {string}
	 */
	formatCellId(date) {
		return date.toDateString().replace(/\s/g, "");
	}
	/**
	 * Render the week page.
	 * @param {Date} date
	 */
	renderWeek(date) {
		//Find the index of the current week of the month given a date.
		const currentWeekIndex = this.calendar.weeks.findIndex((week) => {
			return week.includes(new Date(date).toISOString());
		});
		this.calendar.currentWeekIndex = currentWeekIndex;
		this.setCalendarHeader();
		this.setWeekHeader(this.calendar.currentWeekIndex);
		this.setWeekTasks(this.calendar.currentWeekIndex);
	}
	/**
	 * Set the header for the week page.
	 * @param {number} weekIndex
	 */
	setWeekHeader(weekIndex) {
		const today = new Date(this.calendar.today);

		//Grab the weekday elements.
		const weekdates = document.querySelectorAll(".weekdate");
		for (let i = 0; i < 7; i++) {
			const day = new Date(this.calendar.weeks[weekIndex][i]);
			weekdates[i].innerHTML = day.getDate();

			if (day < today) {
				weekdates[i].classList.add("previous-weekdate");
			} else {
				weekdates[i].classList.remove("previous-weekdate");
			}
			if (this.isSameDate(today, day)) {
				weekdates[i].classList.add("today");
			} else {
				weekdates[i].classList.remove("today");
			}
		}
	}
	/**
	 * Set the tasks on the week page.
	 * @param {number} weekIndex
	 */
	setWeekTasks(weekIndex) {
		this.upcomingTasks.innerHTML = "";
		const fragment = document.createDocumentFragment();

		for (let i = 0; i < 7; i++) {
			if (
				this.calendar.today.toISOString() <=
					this.calendar.weeks[weekIndex][i] ||
				this.calendar.currentWeekIndex != this.calendar.todayWeekIndex
			) {
				const task = this.createWeekTask(
					this.calendar.weeks[weekIndex][i]
				);
				fragment.appendChild(task);
			}
		}

		this.upcomingTasks.appendChild(fragment);
	}
	/**
	 * Create all the HTML elements for each user task in the week view.
	 * @param {Date} date
	 * @returns {HTMLElement}
	 */
	createWeekTask(date) {
		const dateObject = new Date(date);

		//Retrieve the tasks for the day.
		const formattedDate = this.formatDate(dateObject);
		const tasks = this.storage.getTasks(formattedDate);

		const formattedTaskDate = dateObject.toLocaleDateString("default", {
			month: "short",
			day: "numeric",
		});
		//Create elements for displaying the task date.
		const taskContainer = this.createElement(
			"div",
			"task-container",
			dateObject.toISOString()
		);

		const taskDateContainer = this.createElement("div", "task-date");
		if (tasks.length > 0) {
			taskDateContainer.setAttribute("id", "has-task");
		}
		const taskDate = this.createElement(
			"div",
			"date",
			"",
			formattedTaskDate
		);
		const dotDiv = this.createElement("div", "cell-dot");
		const hr = document.createElement("hr");
		taskDateContainer.appendChild(taskDate);
		taskDateContainer.appendChild(dotDiv);

		const today = this.calendar.today;
		const tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);

		if (this.isSameDate(this.calendar.today, dateObject)) {
			const today = this.createElement("span", "weekday", "", "Today");
			const dotDiv2 = this.createElement("div", "cell-dot");

			taskDateContainer.appendChild(today);
			taskDateContainer.appendChild(dotDiv2);
		} else if (this.isSameDate(tomorrow, dateObject)) {
			const tomorrow = this.createElement(
				"span",
				"weekday",
				"",
				"Tomorrow"
			);
			const dotDiv2 = this.createElement("div", "cell-dot");

			taskDateContainer.appendChild(tomorrow);
			taskDateContainer.appendChild(dotDiv2);
		}
		const weekday = dateObject.toLocaleDateString("en-US", {
			weekday: "long",
		});

		const weekdayDiv = this.createElement("span", "weekday", "", weekday);

		taskDateContainer.appendChild(weekdayDiv);

		//Create elements for displaying the tasks.
		const tasksList = this.createElement("ul", "tasks-list");

		if (tasks.length > 0) {
			for (let i = 0; i < tasks.length; i++) {
				const li = this.createTaskCheckbox(tasks[i], i);
				tasksList.appendChild(li);
			}
		}
		const addTaskBtn = this.createElement("button", "add-btn");
		addTaskBtn.setAttribute("type", "button");
		const img = this.createElementWithAttributes(
			"img",
			["src", "alt"],
			["icons/plus.svg", "Add new task button"],
			"add-img"
		);
		const span = this.createElement("span", "add-text", "", "Add task");

		const form = this.createElement("form", "new-form");
		const label = this.createElementWithAttributes(
			"label",
			["for"],
			["new-task"]
		);
		const taskInput = this.createElementWithAttributes(
			"input",
			["type", "placeholder"],
			["text", "Practice JavaScript...."],
			"task-input",
			"new-task"
		);
		const submitBtn = this.createElementWithAttributes(
			"button",
			["type"],
			["submit"],
			"submit-btn"
		);
		submitBtn.classList.add("disabled");
		const submitImg = this.createElementWithAttributes(
			"img",
			["src", "alt"],
			["icons/submit-disabled.svg", "Add task"]
		);
		const cancelBtn = this.createElementWithAttributes(
			"button",
			["type"],
			["cancel"],
			"cancel-btn"
		);
		const cancelImg = this.createElementWithAttributes(
			"img",
			["src", "alt"],
			["icons/cancel.svg", "Cancel"]
		);
		const buttonContainer = this.createElement("div", "btn-container");
		const newTaskContainer = this.createElement(
			"div",
			"new-task-container"
		);

		form.appendChild(label);
		form.appendChild(taskInput);

		submitBtn.appendChild(submitImg);
		cancelBtn.appendChild(cancelImg);
		buttonContainer.appendChild(cancelBtn);
		buttonContainer.appendChild(submitBtn);

		newTaskContainer.appendChild(form);
		newTaskContainer.appendChild(buttonContainer);

		addTaskBtn.appendChild(img);
		addTaskBtn.appendChild(span);

		taskContainer.appendChild(taskDateContainer);
		taskContainer.appendChild(hr);
		taskContainer.appendChild(tasksList);
		taskContainer.appendChild(addTaskBtn);
		taskContainer.appendChild(newTaskContainer);

		return taskContainer;
	}
	/**
	 * Helper function to create HTML elements with attributes.
	 * @param {string} type
	 * @param {Array string} attributes
	 * @param {Array string} values
	 * @param {string} className
	 * @param {string} id
	 * @returns {HTMLElement}
	 */
	createElementWithAttributes(type, attributes, values, className, id) {
		const element = this.createElement(type, className, id);

		for (let i = 0; i < attributes.length; i++) {
			element.setAttribute(attributes[i], values[i]);
		}

		return element;
	}
	/**
	 * Helper function to check to see if two dates are the same.
	 * @param {Date} date1
	 * @param {Date} date2
	 * @returns {boolean}
	 */
	isSameDate(date1, date2) {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}
	/**
	 * Handles adding a task in the week page.
	 * @param {HTMLElement} taskContainer
	 * @param {Date} date
	 */
	addTaskToList(taskContainer, date) {
		// eslint-disable-next-line no-undef
		const taskList = $(taskContainer).find(".tasks-list")[0];
		// eslint-disable-next-line no-undef
		const listItems = $(taskList).find("li");
		const numTasks = listItems.length;
		const task = this.storage.getTask(this.formatDate(date), numTasks);

		if (numTasks != 0) {
			const li = this.createTaskCheckbox(task, numTasks);
			taskList.appendChild(li);
		} else {
			const li = this.createTaskCheckbox(task, 0);
			taskList.appendChild(li);
		}
	}
	/**
	 * Takes user to the previous week.
	 */
	handlePreviousWeekClick() {
		this.calendar.prevWeek();
		this.renderWeek(this.calendar.date);
	}
	/**
	 * Takes user to the next week.
	 */
	handleNextWeekClick() {
		this.calendar.nextWeek();
		this.renderWeek(this.calendar.date);
	}
	/**
	 * Takes user to the current week.
	 */
	handleTodayWeekClick() {
		this.calendar.currentMonth();
		this.renderWeek(this.calendar.today);
	}
	/**
	 * Toggles the disabling of the previous week button when the user is at the current week.
	 */
	toggleWeekNavigation() {
		let previousBtn = document.querySelector(".previous");
		let previousBtnImg = document.querySelector(".previous").children[0];

		if (this.calendar.currentWeekIndex === this.calendar.todayWeekIndex) {
			previousBtnImg.setAttribute("src", "icons/left-disabled.svg");
			previousBtnImg.classList.add("disabled");
			previousBtn.disabled = true;
		} else {
			previousBtnImg.setAttribute("src", "icons/left.svg");
			previousBtnImg.classList.remove("disabled");
			previousBtn.disabled = false;
		}
	}
}
