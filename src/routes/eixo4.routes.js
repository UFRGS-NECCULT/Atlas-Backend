import { Router } from "express";
import Eixo4Controller from '../controllers/Eixo4Controller.js';
import { asyncHandler } from '../utils.js';

const router = Router();

const controller = new Eixo4Controller();

router.get('/bars', asyncHandler(controller.getBars));
router.get('/map', asyncHandler(controller.getMap));
router.get('/world', asyncHandler(controller.getWorld));
router.get('/treemap', asyncHandler(controller.getTreemap));
router.get('/treemap-uf', asyncHandler(controller.getTreemapUF));
router.get('/donut', asyncHandler(controller.getDonut));
router.get('/config', asyncHandler(controller.getConfig));
router.get('/info', asyncHandler(controller.getInfo));
router.get('/visualization', asyncHandler(controller.getVisualization));
router.get('/variable', asyncHandler(controller.getVariable));


export default router;