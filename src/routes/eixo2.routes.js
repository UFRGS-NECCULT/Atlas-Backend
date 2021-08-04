import { Router } from "express";
import Eixo2Controller from '../controllers/Eixo2Controller.js';
import { asyncHandler } from '../utils.js';

const router = Router();

const controller = new Eixo2Controller();

router.get('/bars', asyncHandler(controller.getBars));
router.get('/lines', asyncHandler(controller.getLines));
router.get('/map', asyncHandler(controller.getMap));
router.get('/treemap', asyncHandler(controller.getTreemapSCC));
router.get('/treemap-uf', asyncHandler(controller.getTreemapUF));
router.get('/donut', asyncHandler(controller.getterDonut));
router.get('/breadcrumb', asyncHandler(controller.getBreadcrumb));
router.get('/info', asyncHandler(controller.getInfo));
router.get('/visualization', asyncHandler(controller.getVisualization))
router.get('/variable', asyncHandler(controller.getVariable));


export default router;