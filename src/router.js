import { Router } from 'express';
import saveData, { getAllData } from './data_controller';

const apiRouter = Router();

apiRouter.get('/', (req, res) => {
  res.json({ message: 'welcome to my portfolio api!' });
});

// endpoint for frontend
apiRouter.route('/data').get(getAllData);

// endpoint for scheduled task
apiRouter.route('/save').post(saveData);

export default apiRouter;
