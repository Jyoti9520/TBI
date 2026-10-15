const express = require('express');
const router = express.Router();
const {
  getFundingOpportunities,
  getFundingOpportunityById
} = require('../controllers/fundingController');

router.get('/', getFundingOpportunities);
router.get('/:id', getFundingOpportunityById);

module.exports = router;
