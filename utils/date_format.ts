import moment from 'moment';
import config from "../config/variables";
type DateInput = Date | string | undefined;

/**
 * Format a date as a string in the format 'MM-DD-YYYY'.
 * @param {Date|string|undefined} value - The date to be formatted.
 * @returns {string} The formatted date.
 */
const format_date = (value: DateInput): string => {
    return value ? moment(value).format("MM-DD-YYYY") : "";
};

/**
 * Format a date as a string in the format 'DD-MM-YYYY'.
 * @param {Date|string|undefined} value - The date to be formatted.
 * @returns {string} The formatted date.
 */
const format_date_euro_latin = (value: DateInput): string => {
    return value ? moment(value).format("DD-MM-YYYY") : "";
};

/**
 * Format a date as a string in the format 'MM-DD-YYYY HH:mm:ss'.
 * @param {Date|string|undefined} value - The date to be formatted.
 * @returns {string} The formatted date.
 */
const format_date_time = (value: DateInput): string => {
    return value ? moment(value).format("MM-DD-YYYY HH:mm:ss") : "";
};

/**
 * Format a date as a string in the format 'MM-DD-YYYY HH:mm:ss' using the -03:00 UTC offset.
 * @param {Date|string|undefined} value - The date to be formatted.
 * @returns {string} The formatted date.
 */
const format_date_time_arg = (value: DateInput): string => {
    return value ? moment(value).utcOffset(-180).format("MM-DD-YYYY HH:mm:ss") : "";
};

/**
 * Format a date as a string in the format 'DD-MM-YYYY HH:mm' using the Argentina UTC offset.
 * @param {Date|string|undefined} value - The date to be formatted.
 * @returns {string} The formatted date.
 */
const format_date_time_argentina = (value: DateInput): string => {
    return value ? moment(value).utcOffset(config.time_offset.argentina).format("DD-MM-YYYY HH:mm") : "";
};

/**
 * Validates a date input, checking if it is required and if it has the correct format.
 * @param {Date|string|undefined} value - The date to be validated.
 * @returns {Promise<void>} A promise that resolves if the date is valid, or rejects if the date is invalid.
 */
const validateDateTime = async (value: DateInput): Promise<Boolean | void> => {
    if (!value) {
        return Promise.reject("Date input is required");
    }
    
    const datetime = moment(value, "MM-DD-YYYY HH:mm:ss", true);
    if (!datetime.isValid()) {
        return Promise.reject("Invalid date format. Expected format: 'MM-DD-YYYY HH:mm:ss'");
    }
    return true
};
export {
    format_date,
    format_date_time,
    format_date_time_arg,
    format_date_euro_latin,
    format_date_time_argentina,
    validateDateTime
};
