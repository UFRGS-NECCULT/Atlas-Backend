import { Router } from 'express';
import eixo1Router from './eixo1.routes.js';
import eixo2Router from './eixo2.routes.js';
import eixo3Router from './eixo3.routes.js';
import eixo4Router from './eixo4.routes.js';
import commonRouter from './common.routes.js';

const router = Router();

router.use('/eixo/1', eixo1Router);
router.use('/eixo/2', eixo2Router);
router.use('/eixo/3', eixo3Router);
router.use('/eixo/4', eixo4Router);
router.use(commonRouter);

export default router;