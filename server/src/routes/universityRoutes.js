const express = require('express');
const router = express.Router();
const { getUniversities, getUniversityTbis } = require('../controllers/universityController');

router.get('/', getUniversities);
router.get('/:universityName/tbis', getUniversityTbis);

module.exports = router;
