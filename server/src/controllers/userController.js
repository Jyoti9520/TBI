const { Favorite, TBI, User } = require('../models');
const { isValidUrl, normalizeUrl } = require('../utils/normalizeData');

// @desc    Get user's saved TBIs
// @route   GET /api/users/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: TBI,
          as: 'tbi'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const data = favorites
      .filter(f => f.tbi !== null)
      .map(f => {
        const json = f.tbi.toJSON();
        json.isFavorited = true;
        json.favoriteId = f.id;
        json.favoritedAt = f.createdAt;
        json.hasValidWebsite = isValidUrl(json.website);
        json.websiteUrl = json.hasValidWebsite ? normalizeUrl(json.website) : null;
        return json;
      });

    return res.status(200).json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    console.error('getFavorites error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving favorites'
    });
  }
};

// @desc    Add TBI to user favorites
// @route   POST /api/users/favorites/:tbiId
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const { tbiId } = req.params;

    const tbi = await TBI.findByPk(tbiId);
    if (!tbi) {
      return res.status(404).json({
        success: false,
        message: 'TBI not found'
      });
    }

    const [favorite, created] = await Favorite.findOrCreate({
      where: {
        userId: req.user.id,
        tbiId: Number(tbiId)
      }
    });

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created ? 'TBI saved to favorites' : 'TBI already in favorites',
      data: favorite
    });
  } catch (error) {
    console.error('addFavorite error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error adding favorite'
    });
  }
};

// @desc    Remove TBI from user favorites
// @route   DELETE /api/users/favorites/:tbiId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const { tbiId } = req.params;

    const deleted = await Favorite.destroy({
      where: {
        userId: req.user.id,
        tbiId: Number(tbiId)
      }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Favorite record not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'TBI removed from favorites'
    });
  } catch (error) {
    console.error('removeFavorite error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error removing favorite'
    });
  }
};

// @desc    Update user profile & password
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, password, currentPassword } = req.body;

    if (name) {
      user.name = name.trim();
    }

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password'
        });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password'
        });
      }
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 8 characters long'
        });
      }
      user.password = password;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateProfile
};
