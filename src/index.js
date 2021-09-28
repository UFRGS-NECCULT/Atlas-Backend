// Load the environment before any other modules
import dotenv from 'dotenv';
dotenv.config();

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import routes from './routes/index.js';


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Atlas API',
            version: '1.0.0',
            description: 'Documentação da API REST da aplicação Atlas.',
            contact: {
                name: 'NECCULT',
                url: 'http://www.ufrgs.br/obec/neccult/',
            }
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor de desenvolvimento',
            },
        ],
    },
    apis: [
        './src/routes/eixo1.routes.js',
        './src/routes/eixo2.routes.js',
        './src/routes/eixo3.routes.js',
        './src/routes/eixo4.routes.js'
    ],
}


const swaggerDocs = swaggerJSDoc(swaggerOptions);

import express from 'express';
import cors from 'cors';

import { initialize } from './database.js';

const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(express.json());
app.use(cors());


app.use('/api', routes);

await initialize();

app.listen(process.env.PORT)
    .on('close', () => {
        client.end();
    });

