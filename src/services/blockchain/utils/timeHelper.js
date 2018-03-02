const constants = require('./../config/constants.json');
const moment = require('moment');

export function formatTimestamp(timestamp) {
	let result = moment.unix(timestamp);
	result.set({
		h: constants.globalTimestampHour,
		m: constants.globalTimestampMinutes,
		s: constants.globalTimestampSeconds
	});

	return result.unix();
}

export function formatStartDateTimestamp(timestamp) {
	let result = moment.unix(timestamp).utc();
	result.set({
		h: constants.globalStartDateTimestampHour,
		m: constants.globalStartDateTimestampMinutes,
		s: constants.globalStartDateTimestampSeconds
	});

	return result.unix();
}

export function formatEndDateTimestamp(timestamp) {
	let result = moment.unix(timestamp).utc();
	result.set({
		h: constants.globalEndDateTimestampHour,
		m: constants.globalEndDateTimestampMinutes,
		s: constants.globalEndDateTimestampSeconds
	});

	return result.unix();
}