import { Router } from "express";
import Eixo4Controller from '../controllers/Eixo4Controller.js';
import { asyncHandler } from '../utils.js';

const router = Router();

const controller = new Eixo4Controller();

router.get('/bars', asyncHandler(controller.getBars));
// router.get('/lines', asyncHandler(controller.getLines));
router.get('/map', asyncHandler(controller.getMap));
router.get('/world', asyncHandler(controller.getWorld));
router.get('/treemap', asyncHandler(controller.getTreemap));
router.get('/donut', asyncHandler(controller.getDonut));
router.get('/breadcrumb', asyncHandler(controller.getBreadcrumb));
router.get('/info', asyncHandler(controller.getInfo));
router.get('/visualization', asyncHandler(controller.getVisualization));


export default router;