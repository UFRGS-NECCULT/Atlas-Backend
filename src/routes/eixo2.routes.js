import { Router } from "express";
import Eixo2Controller from '../controllers/Eixo2Controller.js';

const eixo2Router = Router();

const controller = new Eixo2Controller();

eixo2Router.get('/bars', controller.getBars);

export default eixo2Router;