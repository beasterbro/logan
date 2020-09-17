const _ = require('lodash');
const bodyParser = require('body-parser');
const auth = require('./utils/auth');
const taskController = require('./src/task-controller');

// A map of routes/HTTP methods to handlers
// Add authRequired: true to a route to indicate that the user must be logged in
const handlers = {
    '/': {
        get: {
            handler: require('./src/hello-world').rootHandler,
        },
    },
    '/auth/verify': {
        post: {
            handler: require('./src/verify-id-token').verifyIdToken,
        },
    },
    '/tasks/:tid': {
        get: {
            authRequired: true,
            handler: taskController.getTask,
        },
        put: {
            authRequired: true,
            handler: taskController.updateTask,
        },
        delete: {
            authRequired: true,
            handler: taskController.deleteTask,
        },
    },
    '/tasks': {
        get: {
            authRequired: true,
            handler: taskController.getTasks,
        },
        post: {
            authRequired: true,
            handler: taskController.createTask,
        },
    },
};

/**
 * Sets up middleware and connects routes to the Express app
 * @param app
 */
function route(app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    for (const path of _.keys(handlers)) {
        for (const method of _.keys(handlers[path])) {
            app[method](path, async (req, res, next) => {
                try {
                    await auth.handleAuth(req, handlers[path][method].authRequired);
                    await handlers[path][method].handler(req, res, next);
                } catch (e) {
                    res.status(500).json({ error: e.message });
                }
            });
        }
    }
}

module.exports = {
    route,
};
