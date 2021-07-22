import { Router } from "express";
import Eixo4Controller from '../controllers/Eixo4Controller.js';

const router = Router();

const controller = new Eixo4Controller();

router.get('/bars', controller.getBars);
// router.get('/lines', controller.getLines);
router.get('/map', controller.getMap);
router.get('/world', controller.getWorld);
router.get('/treemap', controller.getTreemap);
router.get('/donut', controller.getDonut);
router.get('/breadcrumb', controller.getBreadcrumb);
router.get('/info', controller.getInfo);
router.get('/visualization', controller.getVisualization)


export default router;