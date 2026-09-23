const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TBI = sequelize.define('TBI', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  serialNumber: {
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
  name: {
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
  status: {
    type: DataTypes.ENUM('Verified', 'Under Verification', 'Unverified'),
    defaultValue: 'Unverified'
  },
  domains: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'India'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  services: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  socialLinks: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'tbis',
  indexes: [
    { fields: ['university'] },
    { fields: ['city'] },
    { fields: ['universityType'] },
    { fields: ['name'] },
    { fields: ['incubatorType'] },
    { fields: ['status'] },
    { fields: ['email'] }
  ]
});

module.exports = TBI;
