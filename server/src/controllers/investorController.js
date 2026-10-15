const { Op } = require('sequelize');
const { Investor, TBI, SavedInvestor, InvestorTbiConnection } = require('../models');
const { isValidUrl, normalizeUrl } = require('../utils/normalizeData');

// @desc    Get all investors with filtering, search, pagination, and sorting
// @route   GET /api/investors
// @access  Public
const getInvestors = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 12));
    const offset = (page - 1) * limit;

    const {
      type,
      sector,
      stage,
      geography,
      ticketMin,
      ticketMax,
      search,
      sortBy = 'name',
      order = 'ASC'
    } = req.query;

    const where = { isArchived: false };
    const likeOp = Op.iLike || Op.like;

    if (type) {
      where.type = type.trim();
    }

    if (geography) {
      where[Op.or] = [
        { country: { [likeOp]: `%${geography.trim()}%` } },
        { headquartersCity: { [likeOp]: `%${geography.trim()}%` } },
        { geographicPreferences: { [Op.contains]: [geography.trim()] } }
      ];
    }

    if (search) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { name: { [likeOp]: q } },
        { tagline: { [likeOp]: q } },
        { description: { [likeOp]: q } },
        { investmentThesis: { [likeOp]: q } },
        { headquartersCity: { [likeOp]: q } },
        { country: { [likeOp]: q } }
      ];
    }

    // Ticket size filter
    if (ticketMin) {
      const minVal = parseFloat(ticketMin);
      if (!isNaN(minVal)) {
        where.disclosedTicketMax = { [Op.gte]: minVal };
      }
    }
    if (ticketMax) {
      const maxVal = parseFloat(ticketMax);
      if (!isNaN(maxVal)) {
        where.disclosedTicketMin = { [Op.lte]: maxVal };
      }
    }

    // Determine safe sort field
    const allowedSortFields = ['name', 'createdAt', 'disclosedTicketMin', 'disclosedTicketMax'];
    const safeSortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const { count, rows } = await Investor.findAndCountAll({
      where,
      limit,
      offset,
      order: [[safeSortField, safeOrder]],
      distinct: true
    });

    // Check user bookmarks if authenticated
    let savedInvestorIds = new Set();
    if (req.user) {
      const saved = await SavedInvestor.findAll({
        where: { userId: req.user.id },
        attributes: ['investorId']
      });
      savedInvestorIds = new Set(saved.map(s => s.investorId));
    }

    // Filter in-memory for JSON array fields if sector / stage specified
    let processedRows = rows.map(investor => {
      const data = investor.toJSON();
      data.isSaved = savedInvestorIds.has(data.id);
      data.hasValidWebsite = isValidUrl(data.website);
      data.websiteUrl = data.hasValidWebsite ? normalizeUrl(data.website) : null;
      return data;
    });

    if (sector) {
      const targetSec = sector.trim().toLowerCase();
      processedRows = processedRows.filter(inv =>
        Array.isArray(inv.sectors) && inv.sectors.some(s => s.toLowerCase().includes(targetSec))
      );
    }

    if (stage) {
      const targetStg = stage.trim().toLowerCase();
      processedRows = processedRows.filter(inv =>
        Array.isArray(inv.stages) && inv.stages.some(st => st.toLowerCase().includes(targetStg))
      );
    }

    return res.status(200).json({
      success: true,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      limit,
      data: processedRows
    });
  } catch (error) {
    console.error('getInvestors error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving investors'
    });
  }
};

// @desc    Get single investor profile by ID
// @route   GET /api/investors/:id
// @access  Public
const getInvestorById = async (req, res) => {
  try {
    const { id } = req.params;

    const investor = await Investor.findByPk(id, {
      include: [
        {
          model: TBI,
          as: 'connectedTbis',
          through: { attributes: ['connectionType', 'description', 'verifiedProofUrl'] }
        }
      ]
    });

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    const data = investor.toJSON();

    if (req.user) {
      const saved = await SavedInvestor.findOne({
        where: { userId: req.user.id, investorId: data.id }
      });
      data.isSaved = !!saved;
    } else {
      data.isSaved = false;
    }

    // Find related investors (sharing overlapping sectors or same investor type)
    let relatedInvestors = [];
    if (data.sectors && data.sectors.length > 0) {
      relatedInvestors = await Investor.findAll({
        where: {
          id: { [Op.ne]: data.id },
          type: data.type,
          isArchived: false
        },
        limit: 3,
        order: [['createdAt', 'DESC']]
      });
    }

    data.relatedInvestors = relatedInvestors;

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('getInvestorById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving investor profile'
    });
  }
};

// @desc    Get distinct investor metadata (types, sectors, stages, geographies)
// @route   GET /api/investors/meta
// @access  Public
const getInvestorMeta = async (req, res) => {
  try {
    const investors = await Investor.findAll({
      where: { isArchived: false },
      attributes: ['type', 'sectors', 'stages', 'country', 'headquartersCity']
    });

    const types = new Set();
    const sectors = new Set();
    const stages = new Set();
    const geographies = new Set();

    investors.forEach(inv => {
      if (inv.type) types.add(inv.type);
      if (inv.country) geographies.add(inv.country);
      if (inv.headquartersCity) geographies.add(inv.headquartersCity);
      if (Array.isArray(inv.sectors)) inv.sectors.forEach(s => sectors.add(s));
      if (Array.isArray(inv.stages)) inv.stages.forEach(s => stages.add(s));
    });

    return res.status(200).json({
      success: true,
      data: {
        types: Array.from(types).sort(),
        sectors: Array.from(sectors).sort(),
        stages: Array.from(stages),
        geographies: Array.from(geographies).sort()
      }
    });
  } catch (error) {
    console.error('getInvestorMeta error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving metadata'
    });
  }
};

// @desc    Bookmark an investor
// @route   POST /api/investors/:id/save
// @access  Private
const saveInvestor = async (req, res) => {
  try {
    const investorId = Number(req.params.id);
    const userId = req.user.id;

    const investor = await Investor.findByPk(investorId);
    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    const [saved, created] = await SavedInvestor.findOrCreate({
      where: { userId, investorId },
      defaults: { userId, investorId }
    });

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created ? 'Investor saved to your collection' : 'Investor already saved',
      data: saved
    });
  } catch (error) {
    console.error('saveInvestor error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error saving investor'
    });
  }
};

// @desc    Remove an investor from bookmarks
// @route   DELETE /api/investors/:id/save
// @access  Private
const unsaveInvestor = async (req, res) => {
  try {
    const investorId = Number(req.params.id);
    const userId = req.user.id;

    const deleted = await SavedInvestor.destroy({
      where: { userId, investorId }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Saved investor record not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Investor removed from saved collection'
    });
  } catch (error) {
    console.error('unsaveInvestor error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error removing investor'
    });
  }
};

// @desc    Get user's saved investors
// @route   GET /api/investors/user/saved
// @access  Private
const getSavedInvestors = async (req, res) => {
  try {
    const saved = await SavedInvestor.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Investor,
          as: 'investor'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const data = saved
      .filter(s => s.investor !== null)
      .map(s => {
        const item = s.investor.toJSON();
        item.isSaved = true;
        item.savedAt = s.createdAt;
        return item;
      });

    return res.status(200).json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    console.error('getSavedInvestors error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving saved investors'
    });
  }
};

// @desc    Admin create new investor
// @route   POST /api/investors
// @access  Admin
const createInvestor = async (req, res) => {
  try {
    const {
      name,
      legalName,
      type,
      tagline,
      description,
      investmentThesis,
      logo,
      country,
      headquartersCity,
      geographicPreferences,
      sectors,
      stages,
      disclosedTicketMin,
      disclosedTicketMax,
      ticketRangeDisplay,
      currency,
      portfolioCompanies,
      verifiedAffiliations,
      website,
      applicationUrl,
      contactEmail,
      linkedinUrl,
      verificationStatus,
      sourceUrl,
      sourceNotes,
      lastVerifiedDate
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Investor name is required'
      });
    }

    // Duplicate detection
    const existing = await Investor.findOne({
      where: {
        name: name.trim(),
        isArchived: false
      }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `An investor with name "${name}" already exists.`
      });
    }

    const investor = await Investor.create({
      name: name.trim(),
      legalName: legalName ? legalName.trim() : null,
      type: type || 'Venture Capital',
      tagline,
      description,
      investmentThesis,
      logo,
      country: country || 'India',
      headquartersCity,
      geographicPreferences: Array.isArray(geographicPreferences) ? geographicPreferences : [],
      sectors: Array.isArray(sectors) ? sectors : [],
      stages: Array.isArray(stages) ? stages : [],
      disclosedTicketMin: disclosedTicketMin ? parseFloat(disclosedTicketMin) : null,
      disclosedTicketMax: disclosedTicketMax ? parseFloat(disclosedTicketMax) : null,
      ticketRangeDisplay: ticketRangeDisplay || 'Not publicly disclosed',
      currency: currency || 'INR',
      portfolioCompanies: Array.isArray(portfolioCompanies) ? portfolioCompanies : [],
      verifiedAffiliations: Array.isArray(verifiedAffiliations) ? verifiedAffiliations : [],
      website,
      applicationUrl,
      contactEmail,
      linkedinUrl,
      verificationStatus: verificationStatus || 'Verified',
      sourceUrl,
      sourceNotes,
      lastVerifiedDate: lastVerifiedDate || new Date().toISOString().split('T')[0]
    });

    return res.status(201).json({
      success: true,
      message: 'Investor created successfully',
      data: investor
    });
  } catch (error) {
    console.error('createInvestor error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating investor'
    });
  }
};

// @desc    Admin update existing investor
// @route   PUT /api/investors/:id
// @access  Admin
const updateInvestor = async (req, res) => {
  try {
    const { id } = req.params;
    const investor = await Investor.findByPk(id);

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    await investor.update(req.body);

    return res.status(200).json({
      success: true,
      message: 'Investor updated successfully',
      data: investor
    });
  } catch (error) {
    console.error('updateInvestor error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating investor'
    });
  }
};

// @desc    Admin archive/delete investor
// @route   DELETE /api/investors/:id
// @access  Admin
const deleteInvestor = async (req, res) => {
  try {
    const { id } = req.params;
    const investor = await Investor.findByPk(id);

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: 'Investor not found'
      });
    }

    // Soft-archive or destroy
    await investor.update({ isArchived: true });

    return res.status(200).json({
      success: true,
      message: 'Investor archived successfully'
    });
  } catch (error) {
    console.error('deleteInvestor error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting investor'
    });
  }
};

module.exports = {
  getInvestors,
  getInvestorById,
  getInvestorMeta,
  saveInvestor,
  unsaveInvestor,
  getSavedInvestors,
  createInvestor,
  updateInvestor,
  deleteInvestor
};
