const { SCHEMES, ROADMAPS } = require('../data/schemesData');

// @desc    Get all active government funding schemes and grants
// @route   GET /api/schemes
// @access  Public
const getAllSchemes = async (req, res) => {
  try {
    const { stage, sector, founderType } = req.query;

    let filtered = [...SCHEMES];

    if (stage && stage !== 'all') {
      filtered = filtered.filter(s => s.stage === stage || s.stage === 'all');
    }

    if (sector && sector !== 'all') {
      filtered = filtered.filter(s =>
        s.targetSectors.some(sec => sec.toLowerCase().includes(sector.toLowerCase())) ||
        s.targetSectors.includes('All Tech Sectors') ||
        s.targetSectors.includes('All Sectors')
      );
    }

    if (founderType && founderType !== 'all') {
      filtered = filtered.filter(s =>
        s.eligibleFounderTypes.includes(founderType) ||
        s.eligibleFounderTypes.includes('all')
      );
    }

    const totalGrantPool = SCHEMES.reduce((acc, curr) => acc + curr.amountInLakhs, 0);

    return res.status(200).json({
      success: true,
      count: filtered.length,
      meta: {
        totalSchemesTracked: SCHEMES.length,
        totalGrantPotentialLakhs: totalGrantPool,
        totalGrantDisplay: `₹${(totalGrantPool / 100).toFixed(1)} Cr+`
      },
      data: filtered
    });
  } catch (error) {
    console.error('getAllSchemes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving schemes'
    });
  }
};

// @desc    Calculate user eligibility and matched capital pool
// @route   POST /api/schemes/match
// @access  Public
const matchEligibility = async (req, res) => {
  try {
    const { stage, sector, founderType } = req.body;

    const matched = SCHEMES.filter(s => {
      let stageMatch = true;
      let sectorMatch = true;
      let founderMatch = true;

      if (stage && stage !== 'all') {
        stageMatch = s.stage === stage || s.stage === 'all';
      }

      if (sector && sector !== 'all') {
        sectorMatch =
          s.targetSectors.some(sec => sec.toLowerCase().includes(sector.toLowerCase())) ||
          s.targetSectors.includes('All Tech Sectors') ||
          s.targetSectors.includes('All Sectors');
      }

      if (founderType && founderType !== 'all') {
        founderMatch = s.eligibleFounderTypes.includes(founderType);
      }

      return stageMatch && sectorMatch && founderMatch;
    });

    const maxFunding = matched.reduce((acc, curr) => acc + curr.amountInLakhs, 0);

    return res.status(200).json({
      success: true,
      matchedCount: matched.length,
      maxEligibleFundingLakhs: maxFunding,
      maxEligibleDisplay: `₹${maxFunding} Lakhs`,
      schemes: matched
    });
  } catch (error) {
    console.error('matchEligibility error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error calculating match'
    });
  }
};

// @desc    Get step-by-step roadmap guides for students & deeptech founders
// @route   GET /api/schemes/roadmaps
// @access  Public
const getRoadmaps = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: ROADMAPS
    });
  } catch (error) {
    console.error('getRoadmaps error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving roadmaps'
    });
  }
};

// @desc    AI Grant Proposal Doctor: Generates a ready-to-submit proposal for screening committees
// @route   POST /api/schemes/ai-proposal
// @access  Public
const generateAiProposal = async (req, res) => {
  try {
    const { generateProposal } = require('../utils/aiProposalEngine');
    const { ideaTitle, rawDescription, sector, targetScheme, founderBackground } = req.body;

    if (!ideaTitle || !rawDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your idea title and a short description.'
      });
    }

    const proposal = generateProposal({
      ideaTitle,
      rawDescription,
      sector,
      targetScheme,
      founderBackground
    });

    return res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('generateAiProposal error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate proposal outline'
    });
  }
};

module.exports = {
  getAllSchemes,
  matchEligibility,
  getRoadmaps,
  generateAiProposal
};
