const dayjs = require('dayjs');

// See: https://day.js.org/docs/en/plugin/plugin
const plugins = {
    weekday: require('dayjs/plugin/weekday'),
    advancedFormat: require('dayjs/plugin/advancedFormat'),
    duration: require('dayjs/plugin/duration'),
    minMax: require('dayjs/plugin/minMax'),
    isBetween: require('dayjs/plugin/isBetween'),
    isSameOrBefore: require('dayjs/plugin/isSameOrBefore'),
    isSameOrAfter: require('dayjs/plugin/isSameOrAfter'),
    isYesterday: require('dayjs/plugin/isYesterday'),
    isToday: require('dayjs/plugin/isToday'),
    isTomorrow: require('dayjs/plugin/isTomorrow'),
};

// Extend dayjs with all those plugins
for (const plugin of Object.values(plugins)) {
    dayjs.extend(plugin);
}

function humanReadableDate(date) {
    if (date.isToday()) return 'Today';
    else if (date.isTomorrow()) return 'Tomorrow';
    else if (date.isYesterday()) return 'Yesterday';
    else if (date.year() === dayjs().year()) return date.format('MMMM Do');
    else return date.format('MMMM Do, YYYY');
}

function dueDateIsDate(dueDate) {
    return dueDate !== 'asap' && dueDate !== 'eventually';
}

function readableDueDate(dueDate) {
    if (dueDate === 'asap') return 'ASAP';
    else if (dueDate === 'eventually') return 'Eventually';
    else return humanReadableDate(dayjs(dueDate));
}

// Constants
const DB_DATE_FORMAT = 'YYYY-M-D';
const DB_TIME_FORMAT = 'H:m';
const DB_DATETIME_FORMAT = 'YYYY-M-D H:m';

module.exports = {
    dayjs,
    constants: { DB_DATE_FORMAT, DB_TIME_FORMAT, DB_DATETIME_FORMAT },
    humanReadableDate,
    dueDateIsDate,
    readableDueDate,
};
