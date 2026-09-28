const express = require('express');
const router = express.Router();
const { getAllSchemes, matchEligibility, getRoadmaps, generateAiProposal } = require('../controllers/schemeController');

router.get('/', getAllSchemes);
router.post('/match', matchEligibility);
router.get('/roadmaps', getRoadmaps);
router.post('/ai-proposal', generateAiProposal);

module.exports = router;
