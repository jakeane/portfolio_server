import { Router } from 'express';

const apiRouter = Router();

apiRouter.get('/', (req, res) => {
  res.json({ message: 'welcome to my portfolio api!' });
});

export default apiRouter;
