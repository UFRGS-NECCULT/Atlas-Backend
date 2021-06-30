import { Router } from "express";
import Eixo2Controller from '../controllers/Eixo2Controller.js';

const eixo2Router = Router();

const controller = new Eixo2Controller();

eixo2Router.get('/bars', controller.getBars);
eixo2Router.get('/lines', controller.getLines);
eixo2Router.get('/map', controller.getMap);
eixo2Router.get('/treemap', controller.getTreemapSCC);
eixo2Router.get('/treemap-region', controller.getTreemapRegion);

export default eixo2Router;