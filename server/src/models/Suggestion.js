const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Suggestion = sequelize.define('Suggestion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  submittedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  university: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  universityType: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  tbiName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  incubatorType: {
    type: DataTypes.STRING(120),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  website: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending'
  }
}, {
  tableName: 'suggestions'
});

module.exports = Suggestion;
