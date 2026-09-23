const { sequelize } = require('../config/db');
const User = require('./User');
const TBI = require('./TBI');
const Favorite = require('./Favorite');
const Suggestion = require('./Suggestion');

// Associations
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

TBI.hasMany(Favorite, { foreignKey: 'tbiId', as: 'favorites', onDelete: 'CASCADE' });
Favorite.belongsTo(TBI, { foreignKey: 'tbiId', as: 'tbi' });

User.hasMany(Suggestion, { foreignKey: 'submittedBy', as: 'suggestions' });
Suggestion.belongsTo(User, { foreignKey: 'submittedBy', as: 'submitter' });

module.exports = {
  sequelize,
  User,
  TBI,
  Favorite,
  Suggestion
};
