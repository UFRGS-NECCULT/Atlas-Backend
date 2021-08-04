import { Router } from "express";
import { PageDownloadController } from '../controllers/PageDownloadController.js';
import { asyncHandler } from '../utils.js';

export const router = Router();

const controller = new PageDownloadController();

router.get('/png', asyncHandler(controller.downloadPNG));
router.get('/pdf', asyncHandler(controller.downloadPDF));

export default router;