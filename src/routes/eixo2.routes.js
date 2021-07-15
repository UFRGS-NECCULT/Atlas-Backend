import { Router } from "express";
import Eixo2Controller from '../controllers/Eixo2Controller.js';

const router = Router();

const controller = new Eixo2Controller();

router.get('/bars', controller.getBars);
router.get('/lines', controller.getLines);
router.get('/map', controller.getMap);
router.get('/treemap', controller.getTreemapSCC);
router.get('/treemap-region', controller.getTreemapRegion);
router.get('/donut', controller.getterDonut);
router.get('/breadcrumb', controller.getBreadcrumb);
router.get('/info', controller.getInfo);
router.get('/visualization', controller.getVisualization)


export default router;