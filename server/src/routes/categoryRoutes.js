const express = require('express');
const router = express.Router();
const { getCategories, getCategoryTbis } = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/:category', getCategoryTbis);

module.exports = router;
