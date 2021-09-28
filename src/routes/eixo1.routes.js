import { Router } from "express";
import Eixo1Controller from '../controllers/Eixo1Controller.js';
import { asyncHandler } from '../utils.js';

export const router = Router();

const controller = new Eixo1Controller();

router.get('/bars', asyncHandler(controller.getBars));
router.get('/map', asyncHandler(controller.getterMapa));
router.get('/lines', asyncHandler(controller.getterLinhas));
router.get('/treemap', asyncHandler(controller.getTreemapCad));
router.get('/treemap-uf', asyncHandler(controller.getTreemapUF));
router.get('/donut', asyncHandler(controller.getterDonut));
router.get('/config', asyncHandler(controller.getConfig));
router.get('/info', asyncHandler(controller.getInfo));
router.get('/visualization', asyncHandler(controller.getVisualization));

export default router;