import { Router } from "express";
import CommonController from '../controllers/CommonController.js';
import { asyncHandler } from '../utils.js';

const router = Router();

const controller = new CommonController();

router.get('/csv/files', asyncHandler(controller.getCsvFiles));
router.get('/csv', asyncHandler(controller.getCsv));

export default router;