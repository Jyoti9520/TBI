const { sequelize } = require('../config/db');
const User = require('./User');
const TBI = require('./TBI');
const Favorite = require('./Favorite');
const Suggestion = require('./Suggestion');
const Investor = require('./Investor');
const FundingOpportunity = require('./FundingOpportunity');
const SavedInvestor = require('./SavedInvestor');
const InvestorTbiConnection = require('./InvestorTbiConnection');

// Existing User <-> Favorite <-> TBI associations
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites', onDelete: 'CASCADE' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

TBI.hasMany(Favorite, { foreignKey: 'tbiId', as: 'favorites', onDelete: 'CASCADE' });
Favorite.belongsTo(TBI, { foreignKey: 'tbiId', as: 'tbi' });

User.hasMany(Suggestion, { foreignKey: 'submittedBy', as: 'suggestions' });
Suggestion.belongsTo(User, { foreignKey: 'submittedBy', as: 'submitter' });

// User <-> SavedInvestor <-> Investor
User.hasMany(SavedInvestor, { foreignKey: 'userId', as: 'savedInvestors', onDelete: 'CASCADE' });
SavedInvestor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Investor.hasMany(SavedInvestor, { foreignKey: 'investorId', as: 'savedUsers', onDelete: 'CASCADE' });
SavedInvestor.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });

// Investor <-> TBI Verified Connections (Many-to-Many via InvestorTbiConnection)
Investor.belongsToMany(TBI, {
  through: InvestorTbiConnection,
  foreignKey: 'investorId',
  otherKey: 'tbiId',
  as: 'connectedTbis'
});

TBI.belongsToMany(Investor, {
  through: InvestorTbiConnection,
  foreignKey: 'tbiId',
  otherKey: 'investorId',
  as: 'connectedInvestors'
});

Investor.hasMany(InvestorTbiConnection, { foreignKey: 'investorId', as: 'connections' });
InvestorTbiConnection.belongsTo(Investor, { foreignKey: 'investorId', as: 'investor' });

TBI.hasMany(InvestorTbiConnection, { foreignKey: 'tbiId', as: 'investorConnections' });
InvestorTbiConnection.belongsTo(TBI, { foreignKey: 'tbiId', as: 'tbi' });

module.exports = {
  sequelize,
  User,
  TBI,
  Favorite,
  Suggestion,
  Investor,
  FundingOpportunity,
  SavedInvestor,
  InvestorTbiConnection
};
