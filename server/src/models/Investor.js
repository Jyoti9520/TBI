const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Investor = sequelize.define('Investor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  legalName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM(
      'Venture Capital',
      'Angel Network',
      'Corporate VC',
      'Government / PSU Fund',
      'Family Office',
      'Accelerator / Incubator Fund',
      'Seed Fund'
    ),
    defaultValue: 'Venture Capital'
  },
  tagline: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  investmentThesis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'India'
  },
  headquartersCity: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  geographicPreferences: {
    type: DataTypes.JSON, // e.g. ["India", "Southeast Asia"]
    allowNull: true,
    defaultValue: []
  },
  sectors: {
    type: DataTypes.JSON, // e.g. ["DeepTech", "Agritech", "HealthTech", "CleanTech", "AI/ML", "SaaS"]
    allowNull: true,
    defaultValue: []
  },
  stages: {
    type: DataTypes.JSON, // e.g. ["Pre-Seed", "Seed", "Pre-Series A", "Series A", "Growth"]
    allowNull: true,
    defaultValue: []
  },
  // Ticket Size Range
  disclosedTicketMin: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true // Null if undisclosed
  },
  disclosedTicketMax: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true // Null if undisclosed
  },
  ticketRangeDisplay: {
    type: DataTypes.STRING(100), // e.g. "₹25 Lakhs – ₹3 Crores" or "Not publicly disclosed"
    allowNull: true,
    defaultValue: 'Not publicly disclosed'
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'INR'
  },
  // Portfolio
  portfolioCompanies: {
    type: DataTypes.JSON, // Array of { name, sector, stage, year, tbiAffiliation }
    allowNull: true,
    defaultValue: []
  },
  // Verified Affiliations
  verifiedAffiliations: {
    type: DataTypes.JSON, // Array of { institution, type, details }
    allowNull: true,
    defaultValue: []
  },
  // Official Links & Contacts
  website: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  applicationUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  linkedinUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  // Verification, Sources & Quality
  verificationStatus: {
    type: DataTypes.ENUM('Verified', 'Under Review', 'Unverified'),
    defaultValue: 'Verified'
  },
  sourceUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  sourceNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lastVerifiedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'investors',
  indexes: [
    { fields: ['name'] },
    { fields: ['type'] },
    { fields: ['headquartersCity'] },
    { fields: ['country'] },
    { fields: ['verificationStatus'] },
    { fields: ['isArchived'] }
  ]
});

module.exports = Investor;
