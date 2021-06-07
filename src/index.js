// Load the environment before any other modules
const dotenv = require('dotenv')
dotenv.config();

const express = require('express');
const { initialize } = require('./database');
const { registerRoutes } = require('./routes');

const app = express();

(async () => {
    await initialize()

    registerRoutes(app);

    app.listen(8080).on('close', () => {
        client.end();
    });
})();