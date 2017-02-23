import express from 'express';
import projectCtrl from '../controllers/project';

const router = express.Router();

router.route('/')
  .get(projectCtrl.list);

router.route('/:projectId')
  .get(projectCtrl.get)

  .delete(projectCtrl.remove);

router.route('/:projectId/shots')
  .get(projectCtrl.getShots);

router.route('/:projectId/chapters')
  .get(projectCtrl.getChapters);

router.route('/:projectId/subtitles')
  .get(projectCtrl.getSubtitles);

router.param('projectId', projectCtrl.load);

export default router;
