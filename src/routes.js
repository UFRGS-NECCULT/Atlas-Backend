const { hello } = require('./routes/hello');

/**
 * Registers the API routes to the application
 * @param {import('express').Application} app The express instance
 */
function registerRoutes(app) {
    app.get('/hello', hello);
}

module.exports = {
    registerRoutes,
};