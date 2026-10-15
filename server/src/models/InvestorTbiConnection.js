const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const InvestorTbiConnection = sequelize.define('InvestorTbiConnection', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  investorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tbiId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  connectionType: {
    type: DataTypes.ENUM(
      'Portfolio Origin',        // Portfolio startup originated from this TBI
      'Ecosystem Partner',      // Formal MoU / accelerator partner
      'Investment Committee',   // Partner sits on TBI seed fund selection board
      'Host Institution Backed',// e.g. TBI's institutional angel network
      'Co-Incubation Partner'
    ),
    defaultValue: 'Ecosystem Partner'
  },
  description: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  verifiedProofUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'investor_tbi_connections',
  indexes: [
    {
      unique: true,
      fields: ['investorId', 'tbiId', 'connectionType']
    }
  ]
});

module.exports = InvestorTbiConnection;
