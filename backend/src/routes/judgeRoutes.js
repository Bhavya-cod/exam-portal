const express = require('express');
const router = express.Router();
const { executeCode } = require('../controllers/judgeController');

router.post('/execute', executeCode);

module.exports = router;
