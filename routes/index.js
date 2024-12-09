import { getStatus } from '../controllers/AppController';
import { getStats } from '../controllers/AppController';
import { postNew } from '../controllers/UsersController';
import { getConnect } from '../controllers/AuthController';
import { getDisconnect } from '../controllers/AuthController';
import { getMe } from '../controllers/UsersController';
import { postUpload } from '../controllers/FilesController'
import { getShow } from '../controllers/FilesController'
import { getIndex } from '../controllers/FilesController'

const express = require('express');

const router = express.Router();

router.get('/status', getStatus);
router.get('/stats', getStats);
router.post('/users', postNew);
router.get('/connect', getConnect);
router.get('/disconnect', getDisconnect);
router.get('/users/me', getMe);
router.post('/files', postUpload);
router.get('/files/:id', getShow);
router.get('/files', getIndex);

module.exports = router;
