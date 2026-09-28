const express = require('express');
const router = express.Router();
const { getAllSchemes, matchEligibility, getRoadmaps } = require('../controllers/schemeController');

router.get('/', getAllSchemes);
router.post('/match', matchEligibility);
router.get('/roadmaps', getRoadmaps);

module.exports = router;
