import express from 'express';
import shotCtrl from '../controllers/shot';

const router = express.Router();

router.route('/')
  .get(shotCtrl.list);

router.route('/:shotId')
  .get(shotCtrl.get)
  .delete(shotCtrl.remove);

router.param('shotId', shotCtrl.load);

export default router;
