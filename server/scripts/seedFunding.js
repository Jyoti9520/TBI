const { Investor, FundingOpportunity, InvestorTbiConnection, TBI } = require('../src/models');
const { connectDB } = require('../src/config/db');

const initialInvestors = [
  {
    name: 'Blume Ventures',
    legalName: 'Blume Venture Advisors Pvt Ltd',
    type: 'Venture Capital',
    tagline: 'Backing bold Indian founders building for India and the World',
    description: 'Blume Ventures is an early-stage venture fund investing in tech-led startups solving complex problems across consumer internet, deeptech, B2B SaaS, and robotics.',
    investmentThesis: 'We partner with visionary technical founders at Pre-Seed, Seed, and Pre-Series A stages who build durable moats with defensible intellectual property and proprietary engineering.',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=160&auto=format&fit=crop&q=80',
    country: 'India',
    headquartersCity: 'Bengaluru',
    geographicPreferences: ['India', 'Global (India-origin)'],
    sectors: ['DeepTech', 'B2B SaaS', 'Robotics', 'CleanTech', 'FinTech'],
    stages: ['Pre-Seed', 'Seed', 'Pre-Series A'],
    disclosedTicketMin: 2500000,
    disclosedTicketMax: 20000000,
    ticketRangeDisplay: '₹25 Lakhs – ₹2 Crores (Initial Check)',
    currency: 'INR',
    portfolioCompanies: [
      { name: 'GreyOrange', sector: 'Robotics', stage: 'Growth', year: 2012, tbiAffiliation: 'BITS Pilani' },
      { name: 'Exotel', sector: 'Cloud Comm', stage: 'Growth', year: 2011, tbiAffiliation: null },
      { name: 'Spinny', sector: 'AutoTech', stage: 'Unicorn', year: 2017, tbiAffiliation: null }
    ],
    verifiedAffiliations: [
      { institution: 'IVCA (Indian Venture and Alternate Capital Association)', type: 'Member', details: 'Accredited VC Member' },
      { institution: 'SEBI AIF Category I', type: 'Regulatory License', details: 'SEBI Registered Alternate Investment Fund' }
    ],
    website: 'https://blume.vc',
    applicationUrl: 'https://blume.vc/pitch',
    contactEmail: 'pitch@blume.vc',
    linkedinUrl: 'https://www.linkedin.com/company/blume-ventures',
    verificationStatus: 'Verified',
    sourceUrl: 'https://blume.vc',
    sourceNotes: 'Verified via SEBI AIF registration and official website disclosures.',
    lastVerifiedDate: '2026-10-15'
  },
  {
    name: 'Speciale Invest',
    legalName: 'Speciale Incept Advisors LLP',
    type: 'Seed Fund',
    tagline: 'Seed capital for frontier science & deep-tech innovation',
    description: 'Speciale Invest is a specialized deep tech venture fund backing engineering-first companies across space tech, advanced materials, semiconductors, climate, and synthetic biology.',
    investmentThesis: 'We back institutional IP-backed spinouts and hardware innovators coming out of Indian academic labs and premier technology business incubators.',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&auto=format&fit=crop&q=80',
    country: 'India',
    headquartersCity: 'Chennai',
    geographicPreferences: ['India', 'Global'],
    sectors: ['DeepTech', 'SpaceTech', 'Semiconductors', 'CleanTech', 'Advanced Materials'],
    stages: ['Pre-Seed', 'Seed'],
    disclosedTicketMin: 1500000,
    disclosedTicketMax: 15000000,
    ticketRangeDisplay: '₹15 Lakhs – ₹1.5 Crores',
    currency: 'INR',
    portfolioCompanies: [
      { name: 'Agnikul Cosmos', sector: 'SpaceTech', stage: 'Series B', year: 2019, tbiAffiliation: 'IIT Madras Incubation Cell' },
      { name: 'The ePlane Company', sector: 'Aerospace', stage: 'Series A', year: 2021, tbiAffiliation: 'IIT Madras Incubation Cell' },
      { name: 'GalaxEye Space', sector: 'Earth Observation', stage: 'Series A', year: 2022, tbiAffiliation: 'IIT Madras Incubation Cell' }
    ],
    verifiedAffiliations: [
      { institution: 'IIT Madras Research Park', type: 'Ecosystem Partner', details: 'Active co-investor in deeptech spin-outs' },
      { institution: 'SEBI Registered AIF', type: 'Regulatory License', details: 'Category I Venture Capital Fund' }
    ],
    website: 'https://specialeinvest.com',
    applicationUrl: 'https://specialeinvest.com/contact',
    contactEmail: 'hello@specialeinvest.com',
    linkedinUrl: 'https://www.linkedin.com/company/speciale-invest',
    verificationStatus: 'Verified',
    sourceUrl: 'https://specialeinvest.com',
    sourceNotes: 'Verified portfolio entries supported by IIT Madras Incubation Cell announcements.',
    lastVerifiedDate: '2026-10-15'
  },
  {
    name: 'Indian Angel Network (IAN)',
    legalName: 'Indian Angel Network Services Pvt Ltd',
    type: 'Angel Network',
    tagline: 'Pioneering angel investing and early-stage capital in India',
    description: 'IAN is one of India’s largest networks of angel investors, entrepreneurs, and CXOs, providing high-touch mentoring, strategic access, and seed equity to innovative startups.',
    investmentThesis: 'Investing in high-potential early-stage companies across India with capital, industry mentorship, and operational guidance.',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=160&auto=format&fit=crop&q=80',
    country: 'India',
    headquartersCity: 'New Delhi',
    geographicPreferences: ['India'],
    sectors: ['HealthTech', 'Agritech', 'EdTech', 'Enterprise Tech', 'Consumer Tech'],
    stages: ['Angel', 'Seed', 'Pre-Series A'],
    disclosedTicketMin: 2500000,
    disclosedTicketMax: 50000000,
    ticketRangeDisplay: '₹25 Lakhs – ₹5 Crores',
    currency: 'INR',
    portfolioCompanies: [
      { name: 'FabAlley', sector: 'E-commerce', stage: 'Growth', year: 2013, tbiAffiliation: null },
      { name: 'Dhruva Space', sector: 'SpaceTech', stage: 'Series A', year: 2014, tbiAffiliation: null }
    ],
    verifiedAffiliations: [
      { institution: 'Startup India Hub', type: 'Ecosystem Partner', details: 'Official Angel Investor Partner' }
    ],
    website: 'https://indianangelnetwork.com',
    applicationUrl: 'https://indianangelnetwork.com/apply-for-funding',
    contactEmail: 'contact@indianangelnetwork.com',
    linkedinUrl: 'https://www.linkedin.com/company/indian-angel-network',
    verificationStatus: 'Verified',
    sourceUrl: 'https://indianangelnetwork.com',
    sourceNotes: 'Verified via official angel network portal.',
    lastVerifiedDate: '2026-10-15'
  },
  {
    name: 'Omnivore',
    legalName: 'Omnivore Capital Management Advisors Pvt Ltd',
    type: 'Venture Capital',
    tagline: 'Pioneering Agritech & Climate Action venture investing in India',
    description: 'Omnivore is an impact venture capital firm that funds entrepreneurs building the future of agriculture, food systems, rural economy, and climate sustainability.',
    investmentThesis: 'We back innovators digitizing agrarian supply chains, precision farming, climate-resilient agriculture, and biotech inputs across Bharat.',
    logo: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=160&auto=format&fit=crop&q=80',
    country: 'India',
    headquartersCity: 'Mumbai',
    geographicPreferences: ['India', 'South Asia'],
    sectors: ['Agritech', 'ClimateTech', 'BioTech', 'Food Systems'],
    stages: ['Seed', 'Series A'],
    disclosedTicketMin: 5000000,
    disclosedTicketMax: 30000000,
    ticketRangeDisplay: '₹50 Lakhs – ₹3 Crores',
    currency: 'INR',
    portfolioCompanies: [
      { name: 'DeHaat', sector: 'Agritech', stage: 'Growth', year: 2019, tbiAffiliation: null },
      { name: 'Stellapps', sector: 'Dairy IoT', stage: 'Series B', year: 2013, tbiAffiliation: 'IIT Madras Incubation Cell' },
      { name: 'Fasal', sector: 'Precision Agro', stage: 'Series A', year: 2019, tbiAffiliation: null }
    ],
    verifiedAffiliations: [
      { institution: 'SEBI AIF Cat II', type: 'Regulatory License', details: 'SEBI Registered Fund' }
    ],
    website: 'https://omnivore.vc',
    applicationUrl: 'https://omnivore.vc/pitch-us',
    contactEmail: 'info@omnivore.vc',
    linkedinUrl: 'https://www.linkedin.com/company/omnivore-vc',
    verificationStatus: 'Verified',
    sourceUrl: 'https://omnivore.vc',
    sourceNotes: 'Verified via official disclosures and press archives.',
    lastVerifiedDate: '2026-10-15'
  },
  {
    name: 'Ankur Capital',
    legalName: 'Ankur Capital Fund',
    type: 'Venture Capital',
    tagline: 'Investing in transformative digital and deep-science technologies',
    description: 'Ankur Capital is an early-stage venture capital firm investing in digital and deep-science startups driving inclusion and efficiency across agriculture, healthcare, and deeptech.',
    investmentThesis: 'We support scientific breakthroughs and digital platforms addressing underserved markets with scalable technological leverage.',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=160&auto=format&fit=crop&q=80',
    country: 'India',
    headquartersCity: 'Mumbai',
    geographicPreferences: ['India'],
    sectors: ['DeepTech', 'Agritech', 'HealthTech', 'BioTech', 'ClimateTech'],
    stages: ['Pre-Seed', 'Seed', 'Pre-Series A'],
    disclosedTicketMin: 2000000,
    disclosedTicketMax: 20000000,
    ticketRangeDisplay: '₹20 Lakhs – ₹2 Crores',
    currency: 'INR',
    portfolioCompanies: [
      { name: 'CropIn', sector: 'Agri AI', stage: 'Series C', year: 2014, tbiAffiliation: null },
      { name: 'String Bio', sector: 'Synthetic Bio', stage: 'Series A', year: 2017, tbiAffiliation: null }
    ],
    verifiedAffiliations: [
      { institution: 'SEBI Registered Cat I AIF', type: 'Regulatory License', details: 'Registered with SEBI' }
    ],
    website: 'https://ankurcapital.com',
    applicationUrl: 'https://ankurcapital.com/pitch-to-us',
    contactEmail: 'info@ankurcapital.com',
    linkedinUrl: 'https://www.linkedin.com/company/ankur-capital',
    verificationStatus: 'Verified',
    sourceUrl: 'https://ankurcapital.com',
    sourceNotes: 'Verified fund disclosures.',
    lastVerifiedDate: '2026-10-15'
  },
  {
    name: 'Titan Capital',
    legalName: 'Titan Capital Advisors',
    type: 'Family Office',
    tagline: 'Seed and pre-seed capital founded by Snapdeal co-founders',
    description: 'Titan Capital is an investment office founded by Kunal Bahl and Rohit Bansal, backing passionate entrepreneurs at the very beginning of their journeys.',
    investmentThesis: 'Founder-first capital with zero bureaucracy, lightning-fast commitments, and long-term operating empathy.',
    logo: 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=160&auto=format&fit=crop&q=80',
    country: 'India',
    headquartersCity: 'Gurugram',
    geographicPreferences: ['India', 'US/Global'],
    sectors: ['Consumer Tech', 'B2B SaaS', 'FinTech', 'HealthTech', 'AI/ML'],
    stages: ['Pre-Seed', 'Seed'],
    disclosedTicketMin: 1000000,
    disclosedTicketMax: 10000000,
    ticketRangeDisplay: '₹10 Lakhs – ₹1 Crore',
    currency: 'INR',
    portfolioCompanies: [
      { name: 'Mamaearth', sector: 'D2C', stage: 'Public / IPO', year: 2017, tbiAffiliation: null },
      { name: 'Razorpay', sector: 'FinTech', stage: 'Unicorn', year: 2015, tbiAffiliation: null },
      { name: 'Urban Company', sector: 'Gig Economy', stage: 'Unicorn', year: 2015, tbiAffiliation: null }
    ],
    verifiedAffiliations: [
      { institution: 'Indian Startup Ecosystem Guild', type: 'Angel Syndicate', details: 'Prominent seed investor portfolio' }
    ],
    website: 'https://titancapital.vc',
    applicationUrl: 'https://titancapital.vc/pitch-us',
    contactEmail: 'contact@titancapital.vc',
    linkedinUrl: 'https://www.linkedin.com/company/titancapitalvc',
    verificationStatus: 'Verified',
    sourceUrl: 'https://titancapital.vc',
    sourceNotes: 'Verified via public portfolio disclosures.',
    lastVerifiedDate: '2026-10-15'
  }
];

const initialFundingOpportunities = [
  {
    title: 'NIDHI-PRAYAS (PRomoting and Accelerating Young and ASpiring innovators)',
    agencyOrSponsor: 'Department of Science and Technology (DST), Govt. of India',
    category: 'Government Grant',
    isGrant: true,
    shortDescription: 'Proof-of-Concept prototype grant up to ₹10 Lakhs for individual innovators and pre-incubated hardware founders.',
    description: 'NIDHI-PRAYAS addresses the critical gap between idea and prototype validation. It provides physical prototyping grants, access to FabLabs/TBI prototyping facilities, and expert technical guidance.',
    eligibilityCriteria: 'Any Indian citizen with an innovative tech idea. Innovators must work through a designated PRAYAS Centre (TBI). No equity or repayment required.',
    targetSectors: ['CleanTech', 'IoT & Hardware', 'Healthcare Devices', 'Agritech', 'DeepTech', 'Manufacturing'],
    targetStages: ['Ideation', 'PoC / Prototype'],
    grantAmountDisplay: 'Up to ₹10 Lakhs (100% Grant)',
    disclosedAmountMin: 200000,
    disclosedAmountMax: 1000000,
    geographicScope: 'Pan-India (Via Accredited TBIs)',
    deadline: null,
    isRollingDeadline: true,
    applicationUrl: 'https://www.nidhi-prayas.org',
    guidelinesUrl: 'https://dst.gov.in/scientific-programmes/st-and-socio-economic-development/national-science-technology-entrepreneurship-development-board-nstedb',
    verificationStatus: 'Verified',
    sourceUrl: 'https://dst.gov.in',
    lastVerifiedDate: '2026-10-15'
  },
  {
    title: 'NIDHI-EIR (Entrepreneurs-in-Residence)',
    agencyOrSponsor: 'DST National Science & Technology Entrepreneurship Development Board (NSTEDB)',
    category: 'Fellowship / Stipend',
    isGrant: true,
    shortDescription: 'Monthly subsistence fellowship grant of up to ₹30,000/month for up to 12 months to pursue entrepreneurial ideas full-time.',
    description: 'The NIDHI-EIR Programme provides fellowship support to aspiring entrepreneurs to minimize risk while pursuing technology-led ventures at accredited TBIs.',
    eligibilityCriteria: 'Graduate in engineering, science or technology. Must commit full-time to the project. The applicant must not have ongoing salaried employment.',
    targetSectors: ['Technology Innovation', 'DeepTech', 'All Science & Tech Domains'],
    targetStages: ['Ideation', 'Validation'],
    grantAmountDisplay: 'Up to ₹3.6 Lakhs (₹30,000/month stipend)',
    disclosedAmountMin: 120000,
    disclosedAmountMax: 360000,
    geographicScope: 'Pan-India',
    deadline: null,
    isRollingDeadline: true,
    applicationUrl: 'https://nidhi-eir.in',
    guidelinesUrl: 'https://dst.gov.in',
    verificationStatus: 'Verified',
    sourceUrl: 'https://nidhi-eir.in',
    lastVerifiedDate: '2026-10-15'
  },
  {
    title: 'Startup India Seed Fund Scheme (SISFS)',
    agencyOrSponsor: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    category: 'Seed Fund Scheme',
    isGrant: false,
    shortDescription: 'Financial assistance of up to ₹20 Lakhs grant for proof of concept and up to ₹50 Lakhs convertible debentures/debt for commercialization.',
    description: 'SISFS aims to provide financial assistance to startups for proof of concept, prototype development, product trials, market entry and commercialization via eligible incubators.',
    eligibilityCriteria: 'DPIIT recognized startup incorporated not more than 2 years ago. Must have a viable commercialization roadmap. Must apply through a designated incubator.',
    targetSectors: ['All Sectors', 'Social Impact', 'DeepTech', 'Agritech', 'Robotics'],
    targetStages: ['Prototype', 'Early Traction', 'Market Launch'],
    grantAmountDisplay: 'Up to ₹20 Lakhs (Grant) / ₹50 Lakhs (Debt/Equity)',
    disclosedAmountMin: 500000,
    disclosedAmountMax: 5000000,
    geographicScope: 'Pan-India',
    deadline: null,
    isRollingDeadline: true,
    applicationUrl: 'https://seedfund.startupindia.gov.in',
    guidelinesUrl: 'https://seedfund.startupindia.gov.in/guidelines',
    verificationStatus: 'Verified',
    sourceUrl: 'https://seedfund.startupindia.gov.in',
    lastVerifiedDate: '2026-10-15'
  },
  {
    title: 'BIRAC Biotechnology Ignition Grant (BIG)',
    agencyOrSponsor: 'Biotechnology Industry Research Assistance Council (BIRAC), DBT',
    category: 'Government Grant',
    isGrant: true,
    shortDescription: 'Non-dilutive grant of up to ₹50 Lakhs for 18 months to take biological ideas from proof of concept to validation.',
    description: 'BIG is the flagship grant scheme for startups and scientists in biotech, medtech, diagnostics, industrial biotechnology, and agribiotechnology.',
    eligibilityCriteria: 'Indian biotech startup registered under 5 years or Indian citizen/researcher with qualified biotech degree. Grant given directly to individual or startup without equity dilution.',
    targetSectors: ['Biotech', 'HealthTech', 'Diagnostics', 'Agritech', 'Bio-manufacturing'],
    targetStages: ['PoC / Prototype', 'Early Validation'],
    grantAmountDisplay: 'Up to ₹50 Lakhs (100% Non-Dilutive Grant)',
    disclosedAmountMin: 1000000,
    disclosedAmountMax: 5000000,
    geographicScope: 'Pan-India (Via BIRAC BIG Partners)',
    deadline: '2026-11-30',
    isRollingDeadline: false,
    applicationUrl: 'https://birac.nic.in/big.php',
    guidelinesUrl: 'https://birac.nic.in',
    verificationStatus: 'Verified',
    sourceUrl: 'https://birac.nic.in',
    lastVerifiedDate: '2026-10-15'
  },
  {
    title: 'MeitY TIDE 2.0 (Technology Incubation and Development of Entrepreneurs)',
    agencyOrSponsor: 'Ministry of Electronics and Information Technology (MeitY)',
    category: 'Government Grant',
    isGrant: true,
    shortDescription: 'Financial assistance and incubation support up to ₹7 Lakhs for Entrepreneurs and ₹40 Lakhs for Startups utilizing emerging technologies.',
    description: 'Supports ICT startups working in emerging fields like IoT, AI, Blockchain, Cybersecurity, and Robotics to build indigenous digital solutions.',
    eligibilityCriteria: 'Technology entrepreneurs solving national challenges in healthcare, education, agriculture, or financial inclusion utilizing emerging technologies.',
    targetSectors: ['AI/ML', 'IoT', 'Cybersecurity', 'Blockchain', 'FinTech', 'GovTech'],
    targetStages: ['PoC', 'MVP', 'Early Traction'],
    grantAmountDisplay: '₹7 Lakhs (Grant) to ₹40 Lakhs (Scale-up Grant)',
    disclosedAmountMin: 700000,
    disclosedAmountMax: 4000000,
    geographicScope: 'Pan-India (Via TIDE 2.0 Centres)',
    deadline: null,
    isRollingDeadline: true,
    applicationUrl: 'https://meitystartuphub.in',
    guidelinesUrl: 'https://meity.gov.in',
    verificationStatus: 'Verified',
    sourceUrl: 'https://meitystartuphub.in',
    lastVerifiedDate: '2026-10-15'
  }
];

const seedFundingData = async () => {
  try {
    await connectDB();
    console.log('Seeding initial verified investors and funding opportunities...');

    // Seed Investors
    for (const invData of initialInvestors) {
      const [investor, created] = await Investor.findOrCreate({
        where: { name: invData.name },
        defaults: invData
      });
      if (!created) {
        await investor.update(invData);
      }
    }
    console.log(`Seeded ${initialInvestors.length} verified investor profiles.`);

    // Seed Funding Opportunities
    for (const fundData of initialFundingOpportunities) {
      const [opp, created] = await FundingOpportunity.findOrCreate({
        where: { title: fundData.title },
        defaults: fundData
      });
      if (!created) {
        await opp.update(fundData);
      }
    }
    console.log(`Seeded ${initialFundingOpportunities.length} funding opportunities and grants.`);

    // Connect Agnikul Cosmos / Speciale Invest to IIT Madras Incubation Cell if exists
    const speciale = await Investor.findOne({ where: { name: 'Speciale Invest' } });
    const iitmTbi = await TBI.findOne({ where: { university: { [require('sequelize').Op.iLike || require('sequelize').Op.like]: '%IIT Madras%' } } });

    if (speciale && iitmTbi) {
      await InvestorTbiConnection.findOrCreate({
        where: {
          investorId: speciale.id,
          tbiId: iitmTbi.id,
          connectionType: 'Portfolio Origin'
        },
        defaults: {
          investorId: speciale.id,
          tbiId: iitmTbi.id,
          connectionType: 'Portfolio Origin',
          description: 'Portfolio company Agnikul Cosmos incubated and developed rocket engines at IIT Madras Incubation Cell.',
          verifiedProofUrl: 'https://www.iitm.ac.in'
        }
      });
      console.log('Seeded verified connection between Speciale Invest and IIT Madras TBI.');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedFundingData();
