/**
 * Comprehensive Indian Government Incubation Grants & Schemes Dataset
 * Grounded in official DST NIDHI, MeitY TIDE 2.0, BIRAC, and Startup India guidelines.
 */

const SCHEMES = [
  {
    id: 'nidhi-prayas',
    name: 'NIDHI-PRAYAS',
    fullName: 'Promoting and Accelerating Young and Aspiring technology innovators',
    ministry: 'DST (Department of Science & Technology)',
    maxAmount: '₹10,00,000',
    amountInLakhs: 10,
    fundingType: '100% Non-Dilutive Grant',
    equity: '0% Equity',
    duration: '18 Months',
    stage: 'prototype',
    stageLabel: 'Idea to Working Prototype / MVP',
    targetSectors: ['DeepTech', 'IoT & Hardware', 'Robotics', 'CleanTech', 'Healthcare Devices', 'Manufacturing'],
    eligibleFounderTypes: ['student', 'researcher', 'early_founder'],
    eligibilityCriteria: [
      'Individual innovator or early startup registered less than 3 years.',
      'Must have an innovative hardware/deep-tech solution (not pure service/app).',
      'No co-funding from other govt agencies for the same prototype.',
      'Open to any citizen of India with technical background.'
    ],
    supportedFacilities: [
      'Access to FabLab / Prototyping Workshop',
      'High-end 3D Printing & CNC routing',
      'Testing & Calibration instruments',
      'Technical mentorship by IIT/NIT faculty'
    ],
    sampleHostInstitutions: [
      'FITT, IIT Delhi',
      'SINE, IIT Bombay',
      'Society for Innovation and Development (SID), IISc',
      'CU-TBI (Chandigarh University)',
      'PSG STEP, Coimbatore',
      'TREC-STEP, NIT Trichy'
    ],
    applicationMode: 'Through Empanelled PRAYAS Centres (PCC)'
  },
  {
    id: 'nidhi-eir',
    name: 'NIDHI-EIR',
    fullName: 'Entrepreneurs-in-Residence Support System',
    ministry: 'DST (Department of Science & Technology)',
    maxAmount: '₹30,000 / month (₹3.6 Lakhs/year)',
    amountInLakhs: 3.6,
    fundingType: 'Monthly Founder Living Stipend',
    equity: '0% Equity',
    duration: '12 Months (Extendable to 18)',
    stage: 'idea',
    stageLabel: 'Idea / Pre-Incubation Validation',
    targetSectors: ['All Tech Sectors', 'AI & Software', 'BioTech', 'AgriTech', 'FinTech', 'Hardware'],
    eligibleFounderTypes: ['student', 'researcher', 'early_founder', 'woman'],
    eligibilityCriteria: [
      'Graduates / Post-graduates in Science/Engineering/Technology.',
      'Must commit full-time to their startup idea without corporate employment.',
      'Should not be receiving any other fellowship, stipend or salary.',
      'Focus on technical innovation with commercial potential.'
    ],
    supportedFacilities: [
      'Desk space and office incubation',
      'Business model validation guidance',
      'Access to library and research journals',
      'Regular EIR reviews with Angel Investors'
    ],
    sampleHostInstitutions: [
      'CU-TBI (Chandigarh University)',
      'Venture Center, Pune',
      'C-CAMP, Bangalore',
      'STEP, GNDEC Ludhiana',
      'IIM Ahmedabad CIIE',
      'KIIT-TBI, Bhubaneswar'
    ],
    applicationMode: 'Rolling calls at individual TBI portals'
  },
  {
    id: 'tide-2',
    name: 'MeitY TIDE 2.0',
    fullName: 'Technology Incubation and Development of Entrepreneurs (Scheme 2.0)',
    ministry: 'MeitY (Ministry of Electronics & Information Technology)',
    maxAmount: '₹7,00,000 Grant + ₹30,000/mo EIR',
    amountInLakhs: 7,
    fundingType: 'Non-Dilutive Tech Grant',
    equity: '0% Equity',
    duration: '12 Months',
    stage: 'prototype',
    stageLabel: 'Software MVP & Emerging Tech',
    targetSectors: ['Artificial Intelligence', 'IoT', 'Cybersecurity', 'Blockchain', 'Robotics', 'EdTech'],
    eligibleFounderTypes: ['student', 'early_founder', 'woman'],
    eligibilityCriteria: [
      'Startups focusing on ICT and emerging digital technologies.',
      'Must solve indigenous societal problems (Fintech, Health, Education, Agri).',
      'Special focus on Tier-2 and Tier-3 institution students.',
      'Proof of concept ready for digital validation.'
    ],
    supportedFacilities: [
      'Cloud compute credits (AWS, Google Cloud)',
      'Digital sandboxes & testing APIs',
      'IP & Software copyright filing assistance',
      'Market linkage with enterprise partners'
    ],
    sampleHostInstitutions: [
      'IIIT Hyderabad T-Hub',
      'IIT Kanpur Startup Incubation',
      'Amrita TBI, Kerala',
      'BITS Pilani TBI',
      'IIIT Bangalore Innovation Centre'
    ],
    applicationMode: 'Through G2C / TIDE 2.0 Centres'
  },
  {
    id: 'birac-big',
    name: 'BIRAC BIG',
    fullName: 'Biotechnology Ignition Grant Scheme',
    ministry: 'DBT (Department of Biotechnology)',
    maxAmount: '₹50,00,000',
    amountInLakhs: 50,
    fundingType: 'High-Impact Research Grant',
    equity: '0% Equity',
    duration: '18 Months',
    stage: 'prototype',
    stageLabel: 'Discovery to Functional Proof-of-Concept',
    targetSectors: ['Biotechnology', 'Healthcare & Diagnostics', 'MedTech Devices', 'Bio-Agri', 'Industrial Enzymes'],
    eligibleFounderTypes: ['researcher', 'early_founder', 'student'],
    eligibilityCriteria: [
      'Indian startup registered for less than 5 years or individual researcher/doctor.',
      'Innovator must hold minimum 51% equity in the registered startup.',
      'Project must establish proof of concept for a novel biotechnological product.',
      'Clear regulatory pathway outlined.'
    ],
    supportedFacilities: [
      'BSL-2 / BSL-3 Certified Wet Labs',
      'Animal testing facility clearance',
      'Clinical trial regulatory guidance',
      'International patent advisory'
    ],
    sampleHostInstitutions: [
      'C-CAMP Bangalore',
      'IKP Knowledge Park Hyderabad',
      'KIIT-TBI Bioincubator',
      'IIT Guwahati Bio-NEST',
      'NCL Venture Center Pune'
    ],
    applicationMode: 'Bi-annual pan-India call (Jan & July cycles)'
  },
  {
    id: 'sisfs',
    name: 'SISFS (Startup India Seed Fund)',
    fullName: 'Startup India Seed Fund Scheme',
    ministry: 'DPIIT, Ministry of Commerce and Industry',
    maxAmount: 'Up to ₹50,00,000 (₹20L Grant + ₹50L Debt/Equity)',
    amountInLakhs: 50,
    fundingType: 'Grant & Soft Convertible Debentures',
    equity: 'Optional Convertible or Subsidized Debt',
    duration: '24 Months',
    stage: 'early_revenue',
    stageLabel: 'Market Entry, Commercialization & Scaling',
    targetSectors: ['All Sectors', 'Consumer Tech', 'SaaS', 'AgriTech', 'Mobility', 'SpaceTech'],
    eligibleFounderTypes: ['early_founder', 'woman'],
    eligibilityCriteria: [
      'DPIIT-recognized startup incorporated not more than 2 years ago.',
      'Must have a viable business idea with proof of concept, prototype, or market traction.',
      'Startup should not have received more than ₹10 Lakhs of monetary support under other central schemes.',
      'Indian promoters must hold at least 51% shareholding.'
    ],
    supportedFacilities: [
      'Go-to-market acceleration',
      'Seed capital for pilot commercial trials',
      'Corporate partnerships',
      'Venture capital demo day pitching'
    ],
    sampleHostInstitutions: [
      'Empanelled across 180+ university TBIs nationwide including IITs, IIMs, and State Universities'
    ],
    applicationMode: 'Directly on Startup India SISFS portal selecting empanelled TBI'
  }
];

const ROADMAPS = [
  {
    trackId: 'student-track',
    title: 'Zero to One: The College Student Track',
    subtitle: 'From a dorm room idea to ₹13.6 Lakhs in non-dilutive government support without personal savings.',
    steps: [
      {
        stepNumber: 1,
        title: 'Idea Formulation & Problem Validation',
        duration: 'Weeks 1 - 4',
        focus: 'Identify a real problem, talk to 20 potential users, and sketch the core technical architecture.',
        grantTarget: 'Campus E-Cell Hackathon Grants (₹10k - ₹50k)',
        deliverable: '10-Slide Pitch Deck + Problem Interview Notes'
      },
      {
        stepNumber: 2,
        title: 'Join University TBI & Secure EIR Stipend',
        duration: 'Months 2 - 4',
        focus: 'Apply for NIDHI-EIR or TIDE 2.0 Fellowship. Secure ₹30,000/month living stipend so you can focus full-time.',
        grantTarget: 'NIDHI-EIR (₹3.6 Lakhs / Year)',
        deliverable: 'Incubation Agreement + Proof of Concept Wireframes'
      },
      {
        stepNumber: 3,
        title: 'Build Working Hardware/Software Prototype',
        duration: 'Months 5 - 12',
        focus: 'Utilize TBI fabrication labs, 3D printers, and compute clusters. Apply for prototype grant.',
        grantTarget: 'NIDHI-PRAYAS (₹10 Lakhs Grant, 0% Equity)',
        deliverable: 'Functional Working Prototype tested in real environment'
      },
      {
        stepNumber: 4,
        title: 'Incorporate & Commercial Seed Capital',
        duration: 'Months 13 - 18',
        focus: 'Register Pvt Ltd company, get DPIIT recognition, file provisional patent, and scale.',
        grantTarget: 'Startup India SISFS (₹20L - ₹50L)',
        deliverable: 'First 5 paying pilot customers + IP filing receipt'
      }
    ]
  },
  {
    trackId: 'deeptech-track',
    title: 'The DeepTech & Hardware Engineering Track',
    subtitle: 'For patents, robotics, semiconductors, and lab-intensive innovations requiring high-end infrastructure.',
    steps: [
      {
        stepNumber: 1,
        title: 'Lab Bench Proof & Simulation',
        duration: 'Months 1 - 3',
        focus: 'Run simulation models using shared TBI GPU/HPC infrastructure and establish feasibility.',
        grantTarget: 'University Seed Grant (₹1L - ₹2L)',
        deliverable: 'Simulation Whitepaper + Patent Search Report'
      },
      {
        stepNumber: 2,
        title: 'PRAYAS / BIG Prototyping Grant',
        duration: 'Months 4 - 9',
        focus: 'Procure high-grade materials, build alpha unit, test safety and environmental specs.',
        grantTarget: 'NIDHI-PRAYAS (₹10L) or BIRAC BIG (₹50L)',
        deliverable: 'Alpha Prototype + Lab Testing Benchmark Data'
      },
      {
        stepNumber: 3,
        title: 'Field Trials & Certifications',
        duration: 'Months 10 - 15',
        focus: 'Field testing with industrial partners. Complete CE/BIS/ISO certifications.',
        grantTarget: 'MeitY TIDE 2.0 / SISFS (₹20L - ₹50L)',
        deliverable: 'Pre-production unit ready for batch manufacturing'
      }
    ]
  }
];

module.exports = {
  SCHEMES,
  ROADMAPS
};
