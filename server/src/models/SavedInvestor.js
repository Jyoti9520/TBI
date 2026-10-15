const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SavedInvestor = sequelize.define('SavedInvestor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  investorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'saved_investors',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'investorId']
    }
  ]
});

module.exports = SavedInvestor;
