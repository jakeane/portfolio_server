import { Router } from 'express';
import saveData, { getAllData } from './data_controller';

const apiRouter = Router();

apiRouter.get('/', (req, res) => {
  res.json({ message: 'welcome to my portfolio api!' });
});

apiRouter.route('/data').get(getAllData);

apiRouter.route('/save').post(saveData);

export default apiRouter;
