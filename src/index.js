// Load the environment before any other modules
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import { initialize } from './database.js';
import routes from './routes/index.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', routes);

await initialize();

app.listen(process.env.PORT)
    .on('connection', () => {
        console.log("Server on")
    })
    .on('close', () => {
        client.end();
    });

