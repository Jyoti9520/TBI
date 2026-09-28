/**
 * AI Grant Proposal & Pitch Doctor Engine
 * Converts informal idea inputs into formal DST NIDHI / MeitY TIDE 2.0 / BIRAC standard grant proposals.
 */

const generateProposal = (input) => {
  const { ideaTitle, rawDescription, sector = 'Technology', targetScheme = 'NIDHI-PRAYAS', founderBackground = 'Student' } = input;

  const title = (ideaTitle && ideaTitle.trim()) || 'Autonomous Innovation System';
  const desc = (rawDescription && rawDescription.trim()) || 'An indigenous technology solution designed to solve operational inefficiencies and reduce costs using IoT and artificial intelligence.';

  // Determine TRL (Technology Readiness Level)
  let trl = 'TRL 3 - Proof of Concept';
  let trlExplanation = 'The core concept and theoretical principles have been formulated, with laboratory/simulation testing initiated.';
  if (targetScheme.includes('PRAYAS')) {
    trl = 'TRL 3 to TRL 5 (Early Prototype)';
    trlExplanation = 'Hardware/software bench prototype under development. Grant will finance conversion into a functional market pilot unit.';
  } else if (targetScheme.includes('EIR')) {
    trl = 'TRL 2 to TRL 3 (Ideation & Validation)';
    trlExplanation = 'Customer problem validated through initial interviews. Grant provides full-time founder stipend to complete technical architecture.';
  } else if (targetScheme.includes('BIG') || targetScheme.includes('SISFS')) {
    trl = 'TRL 4 to TRL 6 (Validation in Relevant Environment)';
    trlExplanation = 'Prototype demonstrated in operational environment; capital required for certifications and commercial trials.';
  }

  // Generate standard DST/Govt budget allocation based on scheme
  let budgetAllocation = [];
  if (targetScheme.includes('PRAYAS')) {
    budgetAllocation = [
      { item: 'Component Procurement & Hardware Bills of Material (BOM)', amount: '₹4,50,000', percentage: '45%' },
      { item: 'TBI FabLab Equipment, 3D Printing & CNC Machining Fees', amount: '₹2,00,000', percentage: '20%' },
      { item: 'Testing, Calibration & Environmental Safety Validation', amount: '₹1,50,000', percentage: '15%' },
      { item: 'Technical Consultation & Expert Domain Mentorship', amount: '₹1,00,000', percentage: '10%' },
      { item: 'Provisional Patent Drafting & Intellectual Property Filing', amount: '₹1,00,000', percentage: '10%' }
    ];
  } else if (targetScheme.includes('EIR')) {
    budgetAllocation = [
      { item: 'Founder Monthly Subsistence Stipend (₹30,000 x 12 Months)', amount: '₹3,60,000', percentage: '100%' }
    ];
  } else {
    budgetAllocation = [
      { item: 'R&D Bench Testing & Reagents / Compute', amount: '₹18,00,000', percentage: '36%' },
      { item: 'Pilot Deployment & Field Trials', amount: '₹12,00,000', percentage: '24%' },
      { item: 'Regulatory Compliance & ISO/CE Certifications', amount: '₹10,00,000', percentage: '20%' },
      { item: 'IP Protection & Legal Incorporation', amount: '₹5,00,000', percentage: '10%' },
      { item: 'Operational Contingency', amount: '₹5,00,000', percentage: '10%' }
    ];
  }

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      standard: 'Department of Science & Technology (DST) DPR Template v2.4',
      targetScheme,
      status: 'Ready for Screening Committee'
    },
    executiveSummary: {
      projectTitle: title,
      targetSector: sector,
      founderCategory: founderBackground,
      technologyReadinessLevel: trl,
      trlContext: trlExplanation
    },
    sections: {
      problemStatement: `Currently, available solutions in the ${sector} domain suffer from significant cost overheads, imported dependency, and lack of localized adaptation for Indian field conditions. Specific pain point addressed: ${desc}`,
      proposedInnovation: `The proposed project "${title}" implements an indigenous, high-efficiency architecture utilizing state-of-the-art engineering paradigms. By designing for affordability and ruggedized local deployment, the solution bridges critical productivity gaps.`,
      noveltyAndMoat: `1. Indigenous Hardware/Software Integration: 40-60% lower bill of materials compared to foreign alternatives.\n2. Optimized Algorithm/Architecture: Requires minimal external infrastructure.\n3. Defensible IP: Architecture structured for filing Indian Provisional Patent within 6 months.`,
      targetMarketAndBeneficiaries: `Primary market consists of MSMEs, higher education institutions, rural agricultural communities, and tier-2 smart city initiatives. Total Addressable Market (TAM) in India estimated at ₹1,800+ Cr within the next 4 years.`,
      milestoneTimeline: [
        { month: 'Months 1 - 3', milestone: 'Detailed CAD/EDA Schematics, BOM Lock, and TBI Incubation Onboarding' },
        { month: 'Months 4 - 8', milestone: 'Alpha Prototype Assembly at TBI Fabrication Facility; Laboratory Bench Verification' },
        { month: 'Months 9 - 14', milestone: 'Beta Pilot Deployment with 3 Partner Test Sites; Performance Benchmarking' },
        { month: 'Months 15 - 18', milestone: 'Final Certification, Commercial Pilot Demonstration, and SISFS Seed Pitch' }
      ],
      budgetBreakdown: budgetAllocation,
      screeningTips: [
        'Do not pitch this as a regular software app; emphasize the technical novelty and engineering challenge.',
        'Screening committees prioritize 0% equity grants for founders with deep hands-on commitment.',
        'Ensure you attach your student ID card or degree certificate alongside this proposal summary.'
      ]
    }
  };
};

module.exports = {
  generateProposal
};
