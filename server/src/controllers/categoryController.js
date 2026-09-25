const { fn, col, literal, Op } = require('sequelize');
const { TBI } = require('../models');

// @desc    Get aggregated categories by Incubator Type and University Type
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const [incubatorTypes, universityTypes, cities] = await Promise.all([
      TBI.findAll({
        attributes: [
          'incubatorType',
          [fn('COUNT', col('id')), 'count'],
          [literal(`SUM(CASE WHEN status = 'Verified' THEN 1 ELSE 0 END)`), 'verifiedCount']
        ],
        where: {
          incubatorType: { [Op.ne]: null, [Op.ne]: '' }
        },
        group: ['incubatorType'],
        order: [[literal('count'), 'DESC']]
      }),
      TBI.findAll({
        attributes: [
          'universityType',
          [fn('COUNT', col('id')), 'count']
        ],
        where: {
          universityType: { [Op.ne]: null, [Op.ne]: '' }
        },
        group: ['universityType'],
        order: [[literal('count'), 'DESC']]
      }),
      TBI.findAll({
        attributes: [
          'city',
          [fn('COUNT', col('id')), 'count']
        ],
        where: {
          city: { [Op.ne]: null, [Op.ne]: '' }
        },
        group: ['city'],
        order: req.query.allCities === 'true' ? [['city', 'ASC']] : [[literal('count'), 'DESC']],
        limit: req.query.allCities === 'true' ? 500 : (parseInt(req.query.cityLimit, 10) || 20)
      })
    ]);

    const formattedIncubatorTypes = incubatorTypes.map(item => ({
      name: item.incubatorType,
      type: 'incubatorType',
      count: parseInt(item.getDataValue('count'), 10) || 0,
      verifiedCount: parseInt(item.getDataValue('verifiedCount'), 10) || 0
    }));

    const formattedUniversityTypes = universityTypes.map(item => ({
      name: item.universityType,
      type: 'universityType',
      count: parseInt(item.getDataValue('count'), 10) || 0
    }));

    const formattedCities = cities.map(item => ({
      name: item.city,
      type: 'city',
      count: parseInt(item.getDataValue('count'), 10) || 0
    }));

    return res.status(200).json({
      success: true,
      data: {
        incubatorTypes: formattedIncubatorTypes,
        universityTypes: formattedUniversityTypes,
        cities: formattedCities
      }
    });
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving categories'
    });
  }
};

// @desc    Get TBIs for a specific category
// @route   GET /api/categories/:category
// @access  Public
const getCategoryTbis = async (req, res) => {
  try {
    const { category } = req.params;
    const type = req.query.type || 'incubatorType'; // incubatorType | universityType | city

    const where = {};
    if (type === 'universityType') {
      where.universityType = category;
    } else if (type === 'city') {
      where.city = category;
    } else {
      where.incubatorType = category;
    }

    const tbis = await TBI.findAll({
      where,
      order: [['status', 'ASC'], ['name', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      category,
      type,
      total: tbis.length,
      data: tbis
    });
  } catch (error) {
    console.error('getCategoryTbis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving category TBIs'
    });
  }
};

module.exports = {
  getCategories,
  getCategoryTbis
};
