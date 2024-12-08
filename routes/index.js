import { getStatus } from '../controllers/AppController';
import { getStats } from '../controllers/AppController';
import { postNew } from '../controllers/UsersController';
import { getConnect } from '../controllers/AuthController';
import { getDisconnect } from '../controllers/AuthController';
import { getMe } from '../controllers/UsersController';

const express = require('express');

const router = express.Router();

router.get('/status', getStatus);
router.get('/stats', getStats);
router.post('/users', postNew);
router.get('/connect', getConnect);
router.get('/disconnect', getDisconnect);
router.get('/users/me', getMe);

module.exports = router;
