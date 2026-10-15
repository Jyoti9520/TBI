const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FundingOpportunity = sequelize.define('FundingOpportunity', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  agencyOrSponsor: {
    type: DataTypes.STRING(255),
    allowNull: false // e.g. "DST / Startup India / BIRAC / MeitY"
  },
  category: {
    type: DataTypes.ENUM(
      'Government Grant',
      'Seed Fund Scheme',
      'Fellowship / Stipend',
      'Equity Funding Scheme',
      'Challenge / Competition',
      'Soft Loan / Subsidy'
    ),
    defaultValue: 'Government Grant'
  },
  isGrant: {
    type: DataTypes.BOOLEAN,
    defaultValue: true // Distinguishes grants from equity investments
  },
  shortDescription: {
    type: DataTypes.STRING(350),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  eligibilityCriteria: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  targetSectors: {
    type: DataTypes.JSON, // e.g. ["Biotech", "DeepTech", "Agritech", "Any Tech"]
    allowNull: true,
    defaultValue: []
  },
  targetStages: {
    type: DataTypes.JSON, // e.g. ["Ideation", "PoC / Prototype", "Early Traction"]
    allowNull: true,
    defaultValue: []
  },
  grantAmountDisplay: {
    type: DataTypes.STRING(100), // e.g. "Up to ₹10 Lakhs (PRAYAS)" or "Up to ₹50 Lakhs (SEED)"
    allowNull: true
  },
  disclosedAmountMin: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  disclosedAmountMax: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  geographicScope: {
    type: DataTypes.STRING(120), // "Pan-India", "State Specific", "Specific TBIs Only"
    defaultValue: 'Pan-India'
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: true // null if rolling / open throughout year
  },
  isRollingDeadline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  applicationUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  guidelinesUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  verificationStatus: {
    type: DataTypes.ENUM('Verified', 'Under Review', 'Expired'),
    defaultValue: 'Verified'
  },
  sourceUrl: {
    type: DataTypes.STRING(500),
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
  tableName: 'funding_opportunities',
  indexes: [
    { fields: ['title'] },
    { fields: ['agencyOrSponsor'] },
    { fields: ['category'] },
    { fields: ['isGrant'] },
    { fields: ['verificationStatus'] },
    { fields: ['deadline'] }
  ]
});

module.exports = FundingOpportunity;
