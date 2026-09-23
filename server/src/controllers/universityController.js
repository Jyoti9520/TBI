const { fn, col, literal } = require('sequelize');
const { TBI } = require('../models');
const { isValidUrl, normalizeUrl } = require('../utils/normalizeData');

// @desc    Get all unique universities with aggregated statistics
// @route   GET /api/universities
// @access  Public
const getUniversities = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';

    const universities = await TBI.findAll({
      attributes: [
        'university',
        [fn('MAX', col('city')), 'city'],
        [fn('MAX', col('universityType')), 'universityType'],
        [fn('COUNT', col('id')), 'tbiCount'],
        [
          literal(`SUM(CASE WHEN status = 'Verified' THEN 1 ELSE 0 END)`),
          'verifiedCount'
        ]
      ],
      where: search ? { university: { [require('sequelize').Op.like]: `%${search}%` } } : {},
      group: ['university'],
      order: [[literal('tbiCount'), 'DESC'], ['university', 'ASC']]
    });

    const data = universities.map(u => ({
      university: u.university,
      city: u.getDataValue('city') || 'Not specified',
      universityType: u.getDataValue('universityType') || 'Higher Education Institution',
      tbiCount: parseInt(u.getDataValue('tbiCount'), 10) || 1,
      verifiedCount: parseInt(u.getDataValue('verifiedCount'), 10) || 0
    }));

    return res.status(200).json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    console.error('getUniversities error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving universities'
    });
  }
};

// @desc    Get all TBIs for a specific university
// @route   GET /api/universities/:universityName/tbis
// @access  Public
const getUniversityTbis = async (req, res) => {
  try {
    const { universityName } = req.params;

    const tbis = await TBI.findAll({
      where: { university: universityName },
      order: [['status', 'ASC'], ['name', 'ASC']]
    });

    const data = tbis.map(tbi => {
      const json = tbi.toJSON();
      json.hasValidWebsite = isValidUrl(tbi.website);
      json.websiteUrl = json.hasValidWebsite ? normalizeUrl(tbi.website) : null;
      return json;
    });

    return res.status(200).json({
      success: true,
      total: data.length,
      university: universityName,
      data
    });
  } catch (error) {
    console.error('getUniversityTbis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving university TBIs'
    });
  }
};

module.exports = {
  getUniversities,
  getUniversityTbis
};
