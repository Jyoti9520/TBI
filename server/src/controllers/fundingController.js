const { Op } = require('sequelize');
const { FundingOpportunity, TBI } = require('../models');
const { isValidUrl, normalizeUrl } = require('../utils/normalizeData');

// @desc    Get all funding opportunities & grants with filtering & search
// @route   GET /api/funding
// @access  Public
const getFundingOpportunities = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 12));
    const offset = (page - 1) * limit;

    const {
      category,
      isGrant,
      scope,
      search,
      status = 'Verified'
    } = req.query;

    const where = { isArchived: false };
    const likeOp = Op.iLike || Op.like;

    if (category) {
      where.category = category.trim();
    }

    if (isGrant !== undefined && isGrant !== '') {
      where.isGrant = isGrant === 'true';
    }

    if (status) {
      where.verificationStatus = status.trim();
    }

    if (scope) {
      where.geographicScope = { [likeOp]: `%${scope.trim()}%` };
    }

    if (search) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { title: { [likeOp]: q } },
        { agencyOrSponsor: { [likeOp]: q } },
        { shortDescription: { [likeOp]: q } },
        { description: { [likeOp]: q } },
        { eligibilityCriteria: { [likeOp]: q } }
      ];
    }

    const { count, rows } = await FundingOpportunity.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['deadline', 'ASC NULLS LAST'],
        ['createdAt', 'DESC']
      ]
    });

    const data = rows.map(item => {
      const json = item.toJSON();
      json.hasValidApplicationUrl = isValidUrl(json.applicationUrl);
      json.applicationUrl = json.hasValidApplicationUrl ? normalizeUrl(json.applicationUrl) : null;
      return json;
    });

    return res.status(200).json({
      success: true,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      limit,
      data
    });
  } catch (error) {
    console.error('getFundingOpportunities error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving funding opportunities'
    });
  }
};

// @desc    Get single funding opportunity by ID
// @route   GET /api/funding/:id
// @access  Public
const getFundingOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;

    const opportunity = await FundingOpportunity.findByPk(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Funding opportunity not found'
      });
    }

    const data = opportunity.toJSON();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('getFundingOpportunityById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving funding opportunity details'
    });
  }
};

module.exports = {
  getFundingOpportunities,
  getFundingOpportunityById
};
