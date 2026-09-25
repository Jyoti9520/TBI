const { Suggestion, TBI, User } = require('../models');
const { normalizeStatus } = require('../utils/normalizeData');

// @desc    Submit a TBI suggestion
// @route   POST /api/suggestions
// @access  Private
const createSuggestion = async (req, res) => {
  try {
    const {
      university,
      city,
      universityType,
      tbiName,
      incubatorType,
      email,
      website,
      description
    } = req.body;

    if (!university || !tbiName || !city) {
      return res.status(400).json({
        success: false,
        message: 'University name, TBI name, and City are required'
      });
    }

    const suggestion = await Suggestion.create({
      submittedBy: req.user ? req.user.id : null,
      university: university.trim(),
      tbiName: tbiName.trim(),
      city: city ? city.trim() : null,
      universityType: universityType ? universityType.trim() : null,
      incubatorType: incubatorType ? incubatorType.trim() : null,
      email: email ? email.trim() : null,
      website: website ? website.trim() : null,
      description: description ? description.trim() : null,
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Suggestion submitted successfully. It will be reviewed by administrators.',
      data: suggestion
    });
  } catch (error) {
    console.error('createSuggestion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error submitting suggestion'
    });
  }
};

// @desc    Get all suggestions (Admin or current user's suggestions)
// @route   GET /api/suggestions
// @access  Private
const getSuggestions = async (req, res) => {
  try {
    const where = {};
    if (req.user.role !== 'ADMIN') {
      where.submittedBy = req.user.id;
    }

    const suggestions = await Suggestion.findAll({
      where,
      include: [
        {
          model: User,
          as: 'submitter',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      total: suggestions.length,
      data: suggestions
    });
  } catch (error) {
    console.error('getSuggestions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving suggestions'
    });
  }
};

// @desc    Review / Approve / Reject suggestion
// @route   PUT /api/suggestions/:id
// @access  Admin
const updateSuggestionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, createTbiRecord } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Pending, Approved, or Rejected.'
      });
    }

    const suggestion = await Suggestion.findByPk(id);
    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      });
    }

    suggestion.status = status;
    await suggestion.save();

    // If approved and createTbiRecord is true, insert into TBI collection
    let createdTbi = null;
    if (status === 'Approved' && createTbiRecord) {
      createdTbi = await TBI.create({
        university: suggestion.university,
        name: suggestion.tbiName,
        city: suggestion.city,
        universityType: suggestion.universityType,
        incubatorType: suggestion.incubatorType,
        email: suggestion.email,
        website: suggestion.website,
        description: suggestion.description,
        status: 'Verified'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Suggestion marked as ${status}${createdTbi ? ' and added to TBIs directory' : ''}`,
      data: {
        suggestion,
        createdTbi
      }
    });
  } catch (error) {
    console.error('updateSuggestionStatus error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating suggestion'
    });
  }
};

module.exports = {
  createSuggestion,
  getSuggestions,
  updateSuggestionStatus
};
