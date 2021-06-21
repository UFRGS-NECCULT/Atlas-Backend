import { Router } from "express";

export const eixo1Router = Router();

import Eixo1Controller from '../controllers/Eixo1Controller.js';
const eixo1Controller = new Eixo1Controller();

eixo1Router.get('/bars', eixo1Controller.getBars)
eixo1Router.get('/treemap', eixo1Controller.getTreemap)
eixo1Router.get('/lines', eixo1Controller.getterLinhas)
eixo1Router.get('/max-setor', eixo1Controller.getMaxValueSetor)
eixo1Router.get('/max-brasil', eixo1Controller.getTotalBrasil)
eixo1Router.get('/uf', eixo1Controller.getTotalSumPrt)
eixo1Router.get('/year', eixo1Controller.getAnoDefault)
eixo1Router.get('/map', eixo1Controller.getterMapa)
eixo1Router.get('/regions', eixo1Controller.getterRegion)

export default eixo1Router;