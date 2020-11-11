import _ from 'lodash';
import { dateUtils } from '@logan/core';
import { compareDueDates } from '../../store/tasks';

export function initialQuickSort(showComplete, a, b) {
    if (showComplete) {
        return dateUtils.compareDates(
            a.completionDate,
            b.completionDate,
            dateUtils.constants.DB_DATETIME_FORMAT,
            'minute'
        );
    } else {
        return compareDueDates(a.dueDate, b.dueDate);
    }
}

function makeSectionsIncomplete(tasks) {
    const sections = {};
    const now = dateUtils.dayjs();

    function addToSection(task, section) {
        if (!sections[section]) sections[section] = [task];
        else sections[section].push(task);
    }

    for (const task of tasks) {
        if (task.dueDate === 'asap' || task.dueDate === 'eventually') {
            addToSection(task, task.dueDate);
        } else {
            const dueDate = dateUtils.toDate(task.dueDate);

            if (dueDate.isBefore(now, 'day')) {
                addToSection(task, 'overdue');
            } else {
                addToSection(task, task.dueDate);
            }
        }
    }

    return sections;
}

function makeSectionsComplete(tasks) {
    return _.groupBy(tasks, 'completionDate');
}

export function makeSections(showComplete, tasks) {
    return showComplete ? makeSectionsComplete(tasks) : makeSectionsIncomplete(tasks);
}

function compareStrings(a, b) {
    if (a === b) return 0;
    else return a < b ? -1 : 1;
}

export function sortWithinSection(a, b) {
    if (a.priority !== b.priority) return b.priority - a.priority;
    if (a.aid && b.aid && a.aid !== b.aid) return compareStrings(a.aid, b.aid);
    if (a.cid && b.cid && a.cid !== b.cid) return compareStrings(a.cid, b.cid);
    if (a.title !== b.title) return compareStrings(a.title, b.title);
    return compareStrings(a.tid, b.tid);
}

export function getSections(tasks, showCompleted) {
    const sorted = [...tasks];
    sorted.sort(initialQuickSort.bind(this, showCompleted));

    const sections = makeSections(showCompleted, tasks);

    for (const tasks of _.values(sections)) {
        tasks.sort(sortWithinSection);
    }

    return _.entries(_.mapValues(sections, tasks => _.map(tasks, 'tid')));
}
