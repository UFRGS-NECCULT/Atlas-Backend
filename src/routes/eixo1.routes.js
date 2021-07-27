import { Router } from "express";
import Eixo1Controller from '../controllers/Eixo1Controller.js';
import { asyncHandler } from '../utils.js';

export const router = Router();

const controller = new Eixo1Controller();

router.get('/bars', asyncHandler(controller.getBars));
router.get('/lines', asyncHandler(controller.getterLinhas));
router.get('/map', asyncHandler(controller.getterMapa));
router.get('/treemap', asyncHandler(controller.getTreemap));
router.get('/donut', asyncHandler(controller.getterDonut));
router.get('/breadcrumb', asyncHandler(controller.getBreadcrumb));
router.get('/info', asyncHandler(controller.getInfo));
router.get('/visualization', asyncHandler(controller.getVisualization));
router.get('/variable', asyncHandler(controller.getVariable));

// FIXME: Esses endpoints sequer são usados pelo front?
router.get('/uf', asyncHandler(controller.getTotalSumPrt));
router.get('/year', asyncHandler(controller.getAnoDefault));
router.get('/max-setor', asyncHandler(controller.getMaxValueSetor));
router.get('/regions', asyncHandler(controller.getterRegion));
router.get('/max-brasil', asyncHandler(controller.getTotalBrasil));

export default router;