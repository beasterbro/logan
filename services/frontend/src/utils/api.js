import _ from 'lodash';
import axios from 'axios';

const BASE_URL = 'http://logan-backend-dev.us-west-2.elasticbeanstalk.com';
const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let bearer;

function setBearerToken(token) {
    if (token) bearer = `Bearer ${token}`;
    else bearer = undefined;

    _.set(client, 'defaults.headers.common.Authorization', bearer);
}

async function getTasks() {
    const response = await client.get('/tasks');
    return response.data;
}

// Returns the new task
async function createTask(task) {
    const response = await client.post('/tasks', task);
    return response.data;
}

// Returns the updated task
async function updateTask(task) {
    const { tid } = task;
    const response = await client.put(`/tasks/${tid}`, task);
    return response.data;
}

/**
 * @param assignment
 * @returns {Promise<{ success:boolean }>}
 */
async function deleteTask(assignment) {
    const { aid } = assignment;
    const response = await client.delete(`/assignments/${aid}`);
    return response.data;
}

async function getAssignments() {
    const response = await client.get('/assignments');
    return response.data;
}

// Returns the new task
async function createAssignment(assignment) {
    const response = await client.post('/assignments', assignment);
    return response.data;
}

// Returns the updated task
async function updateAssignment(assignment) {
    const { aid } = assignment;
    const response = await client.put(`/assignments/${aid}`, assignment);
    return response.data;
}

/**
 * @param task
 * @returns {Promise<{ success:boolean }>}
 */
async function deleteAssignment(assignment) {
    const { aid } = assignment;
    const response = await client.delete(`/assignments/${aid}`);
    return response.data;
}

export default {
    setBearerToken,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
};
