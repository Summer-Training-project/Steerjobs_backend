const express = require('express');

const authController = require('../controllers/jobs');

const router = express.Router();

router.post('/postJobs', authController.postJobs);

router.post('/applyJobs', authController.applyJobs);

module.exports = router;