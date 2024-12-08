import getStatus from '../controllers/AppController'
import getStats from '../controllers/AppController'

const express = require('express');

const router = express.Router();

router.get('/status', getStatus);
router.get('/stats', getStat);

module.exports = router;
