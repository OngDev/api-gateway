import express from 'express';

import authRoutes from './auth.routes';

const apiRouter = express();


apiRouter.use('/auth', authRoutes);

export default apiRouter;
