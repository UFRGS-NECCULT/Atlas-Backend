import { Router } from "express";
import Eixo1Controller from '../controllers/Eixo1Controller.js';

export const router = Router();

const eixo1Controller = new Eixo1Controller();

router.get('/bars', eixo1Controller.getBars)
router.get('/lines', eixo1Controller.getterLinhas)
router.get('/map', eixo1Controller.getterMapa)
router.get('/treemap', eixo1Controller.getTreemap)
router.get('/donut', eixo1Controller.getterDonut)
router.get('/breadcrumb', eixo1Controller.getBreadcrumb)

// FIXME: Esses endpoints sequer são usados pelo front?
router.get('/uf', eixo1Controller.getTotalSumPrt)
router.get('/year', eixo1Controller.getAnoDefault)
router.get('/max-setor', eixo1Controller.getMaxValueSetor)
router.get('/regions', eixo1Controller.getterRegion)
router.get('/max-brasil', eixo1Controller.getTotalBrasil)

export default router;