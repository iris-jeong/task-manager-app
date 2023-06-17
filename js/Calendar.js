/**
 * Represents a Calendar object to manage business logic.
 * @class
 */
// eslint-disable-next-line no-unused-vars
class Calendar {
	static months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	static weekdays = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	static today = new Date();
	/**
	 * Create a new calendar instance.
	 */
	constructor() {
		this.setCurrentDate(Calendar.today);
	}
	/**
	 * Set the current date.
	 * @params {Date} date
	 */
	setCurrentDate(date) {
		this.today = new Date(
			Calendar.today.getFullYear(),
			Calendar.today.getMonth(),
			Calendar.today.getDate()
		);
		this.date = date;
		this.monthIndex = date.getMonth(); // 0-11.
		this.month = Calendar.months[this.monthIndex]; // January-December.
		this.day = date.getDate(); //1-31.
		this.weekdayIndex = date.getDay(); //0-6.
		this.weekday = Calendar.weekdays[this.dayOfWeekIndex]; //Sunday-Monday.
		this.year = date.getFullYear();
		this.firstDay = new Date(this.year, this.monthIndex, 1);
		this.lastDay = new Date(this.year, this.monthIndex + 1, 0);
		this.weeks = this.getWeeksInMonth();
		this.currentWeekIndex = this.getCurrentWeekIndex(this.date);
		this.todayWeekIndex = this.getCurrentWeekIndex(this.today);
	}
	/**
	 * Get the index of which week the given date is in.
	 * @param {Date} date
	 * @returns {number}
	 */
	getCurrentWeekIndex(date) {
		return this.weeks.findIndex((week) => {
			return week.includes(new Date(date).toISOString());
		});
	}
	/**
	 * Get the calendar header.
	 */
	getCalendarHeader() {
		return { month: this.month, year: this.year };
	}
	/**
	 * Get the number of days in a specific month.
	 * @param {number} month - The month number (0-11).
	 * @param {number} year - The year.
	 * @returns {number} - The number of days in the month (1-31);
	 */
	getNumberOfDaysInMonth(month, year) {
		return new Date(year, month + 1, 0).getDate();
	}
	/**
	 * Get the number of rows in calendar for the month.
	 * @returns {number} - The number of rows in the month for the calendar.
	 */
	getNumberOfRowsInMonth() {
		const numDays = this.getNumberOfDaysInMonth(this.monthIndex, this.year);
		const firstDayWeekdayIndex = this.getWeekdayIndexOfFirstDay();

		return Math.ceil((numDays + firstDayWeekdayIndex) / 7);
	}
	/**
	 * Get the weeks in a month in array form.
	 * @returns {Array}
	 */
	getWeeksInMonth() {
		let weeks = [];

		let prevMonth = (this.monthIndex - 1 + 12) % 12; //Get the index of the previous month by subtracting 1, then add 12 to ensure positive value for the modulo (0-11), then add 1 to get (1-12).
		let nextMonth = (this.monthIndex % 12) + 1; //Get the index of the first month by mod 12 to ensure positive number, then add 1.
		let prevYear = prevMonth === 11 ? this.year - 1 : this.year;
		let nextYear = nextMonth === 0 ? this.year + 1 : this.year;
		let numDaysTilCurrentMonthStart = this.getWeekdayIndexOfFirstDay() - 1;
		let prevMonthDay =
			this.getLastDayOfPrevMonth() - numDaysTilCurrentMonthStart;

		let nextMonthDay = 1;
		let currentDay = 1;

		for (let i = 0; i < this.getNumberOfRowsInMonth(); i++) {
			let week = [];
			for (let j = 0; j < 7; j++) {
				if (i === 0 && numDaysTilCurrentMonthStart >= 0) {
					//The first week of the month.
					week.push(
						new Date(
							prevYear,
							prevMonth,
							prevMonthDay
						).toISOString()
					);
					// console.log("prev month day: ", prevMonthDay);
					prevMonthDay++;
					numDaysTilCurrentMonthStart--;
				} else if (
					i === this.getNumberOfRowsInMonth() - 1 &&
					currentDay > this.lastDay
				) {
					//The last week of the month.
					week.push(
						new Date(
							nextYear,
							nextMonth,
							nextMonthDay
						).toISOString()
					);
					// console.log("next month day: ", nextMonthDay);
					nextMonthDay++;
				} else {
					// console.log("current day: ", currentDay);
					week.push(
						new Date(
							this.year,
							this.monthIndex,
							currentDay
						).toISOString()
					);
					currentDay++;
				}
			}
			weeks.push(week);
		}
		return weeks;
	}
	/**
	 * Get the month name with the given index.
	 * @param {number} monthIndex
	 * @returns {string}
	 */
	getMonthName(monthIndex) {
		return Calendar.months[monthIndex];
	}
	/**
	 * Get weekday index of first day.
	 * @returns {number} - The index of the weekday for the first day of the month.
	 */
	getWeekdayIndexOfFirstDay() {
		return this.firstDay.getDay(); //0-6.
	}
	/**
	 * Get weekday index of last day.
	 * @returns {number} - The index of the weekday for the last day of the month.
	 */
	getWeekdayIndexOfLastDay() {
		return this.lastDay.getDay(); //0-6.
	}
	/**
	 * Get the last day of the previous month.
	 * @returns {Date}
	 */
	getLastDayOfPrevMonth() {
		return new Date(this.year, this.monthIndex, 0).getDate();
	}
	/**
	 * Checks whether the date is today's date.
	 * @param {Date} day - The day you're checking against.
	 * @returns {boolean} - True if today, false otherwise.
	 */
	isToday(day) {
		let today = Calendar.today.getDate();
		return today === day;
	}
	/**
	 * Updates the current month to the next month.
	 */
	nextMonth() {
		const nextMonth = new Date(this.year, this.monthIndex + 1);
		if (nextMonth.getMonth() === Calendar.today.getMonth()) {
			this.setCurrentDate(Calendar.today);
		} else {
			this.setCurrentDate(nextMonth);
		}
	}
	/**
	 * Updates the current month to the previous month.
	 */
	prevMonth() {
		const prevMonth = new Date(this.year, this.monthIndex - 1);
		if (prevMonth.getMonth() === Calendar.today.getMonth()) {
			this.setCurrentDate(Calendar.today);
		} else {
			this.setCurrentDate(prevMonth);
		}
	}
	/**
	 * Updates the current week to the previous week.
	 */
	prevWeek() {
		if (this.currentWeekIndex > 0) {
			let prevWeek = new Date(this.weeks[this.currentWeekIndex - 1][0]);

			this.setCurrentDate(prevWeek);
		} else if (this.currentWeekIndex === 0) {
			let prevMonth = new Date(this.year, this.monthIndex, 0);
			this.setCurrentDate(prevMonth);
		}
	}
	/**
	 * Updates the current week to the next week.
	 */
	nextWeek() {
		if (this.currentWeekIndex >= this.getNumberOfRowsInMonth() - 1) {
			let lastWeekIndex = this.weeks.length - 1;
			let lastDayIndex = this.weeks[lastWeekIndex].length - 1;
			let nextWeekDate = new Date(
				this.weeks[lastWeekIndex][lastDayIndex]
			);
			nextWeekDate.setDate(nextWeekDate.getDate() + 1);
			this.setCurrentDate(nextWeekDate);
		} else {
			let nextWeekDate = new Date(
				this.weeks[this.currentWeekIndex + 1][0]
			);
			this.setCurrentDate(nextWeekDate);
		}
	}
	/**
	 * Updates the current month to today's month.
	 */
	currentMonth() {
		this.setCurrentDate(Calendar.today);
	}
	/**
	 * A helper function to fetch the holidays of the current month.
	 * @returns {Promise}
	 */
	fetchHolidays() {
		const BASE_URL = "https://calendarific.com/api/v2/holidays";
		const API_KEY = "?api_key=c95a216fe0bd3c5173e157d2332e34ac1b2858e3";
		const country = "US";
		const location = "us-ca";
		const year = this.year;
		const month = this.monthIndex + 1;
		const url = `${BASE_URL}${API_KEY}&country=${country}&location=${location}&year=${year}&month=${month}`;

		return fetch(url).then((response) =>
			response.json().then((data) => {
				// console.log("data! ", data);
				return data.response.holidays;
			})
		);
	}
}
