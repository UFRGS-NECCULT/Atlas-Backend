import { Router } from "express";
import Eixo1Controller from '../controllers/Eixo1Controller.js';

export const router = Router();

const controller = new Eixo1Controller();

router.get('/bars', controller.getBars)
router.get('/lines', controller.getterLinhas)
router.get('/map', controller.getterMapa)
router.get('/treemap', controller.getTreemap)
router.get('/donut', controller.getterDonut)
router.get('/breadcrumb', controller.getBreadcrumb)
router.get('/info', controller.getInfo)
router.get('/visualization', controller.getVisualization)

// FIXME: Esses endpoints sequer são usados pelo front?
router.get('/uf', controller.getTotalSumPrt)
router.get('/year', controller.getAnoDefault)
router.get('/max-setor', controller.getMaxValueSetor)
router.get('/regions', controller.getterRegion)
router.get('/max-brasil', controller.getTotalBrasil)

export default router;