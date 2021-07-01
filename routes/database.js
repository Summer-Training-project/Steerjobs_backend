const express = require('express');
const authController = require('../controllers/database');

const router = express.Router();

router.post('/database', authController.database);

module.exports = router;