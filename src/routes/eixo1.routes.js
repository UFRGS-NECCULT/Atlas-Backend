import { Router } from "express";

export const eixo1Router = Router();

import Eixo1Controller from '../controllers/Eixo1Controller.js';
const eixo1Controller = new Eixo1Controller();

eixo1Router.get('/bars', eixo1Controller.getBars)
eixo1Router.get('/max-setor', eixo1Controller.getBars)
eixo1Router.get('/max-brasil', eixo1Controller.getBars)
eixo1Router.get('/uf', eixo1Controller.getBars)
eixo1Router.get('/year', eixo1Controller.getBars)
eixo1Router.get('/map', eixo1Controller.getterMapa)
eixo1Router.get('/regions', eixo1Controller.getBars)

// export function registerRoutes(app) {
//     app.get('/eixo/1/bars', getBars);
//     app.get('/eixo/1/max-setor', getMaxValueSetor);
//     app.get('/eixo/1/max-brasil', getTotalBrasil);
//     app.get('/eixo/1/uf', getTotalSumPrt);
//     app.get('/eixo/1/year', getAnoDefault);
//     app.get('/eixo/1/map', getterMapa);
//     app.get('/eixo/1/regions', getterRegion);
// }

export default eixo1Router;