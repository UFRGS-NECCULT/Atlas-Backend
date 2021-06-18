import { Router } from 'express';
import eixo1Router from './eixo1.routes.js';

const router = Router();

router.use('/eixo/1', eixo1Router);
// router.use('/eixo/2', eixo2Router);
// router.use('/eixo/3', eixo3Router);
// router.use('/eixo/4', eixo4Router);

export default router;