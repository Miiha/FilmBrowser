import express from 'express';
import projectRoutes from './project';
import shotRoutes from './shot';

const router = express.Router();

router.get('/', (req, res) =>
  res.send('OK')
);

router.get('/export', (req, res) =>
  res.redirect('http://db-gui:8081')
);

router.use('/projects', projectRoutes);
router.use('/shots', shotRoutes);

export default router;
