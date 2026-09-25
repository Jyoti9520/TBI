const { Op } = require('sequelize');
const { TBI, Favorite } = require('../models');
const { calculateDistance } = require('../utils/distance');
const { isValidUrl, normalizeUrl, normalizeStatus } = require('../utils/normalizeData');

// @desc    Get all TBIs with pagination and multi-field filtering
// @route   GET /api/tbis
// @access  Public
const getTbis = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const {
      university,
      city,
      universityType,
      incubatorType,
      status,
      search,
      sortBy,
      order
    } = req.query;

    const where = {};

    if (university) {
      where.university = { [Op.like]: `%${university.trim()}%` };
    }
    if (city) {
      where.city = { [Op.like]: `%${city.trim()}%` };
    }
    if (universityType) {
      where.universityType = universityType.trim();
    }
    if (incubatorType) {
      where.incubatorType = incubatorType.trim();
    }
    if (status) {
      where.status = status.trim();
    }

    if (search) {
      const q = `%${search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.like]: q } },
        { university: { [Op.like]: q } },
        { city: { [Op.like]: q } },
        { incubatorType: { [Op.like]: q } },
        { universityType: { [Op.like]: q } },
        { email: { [Op.like]: q } },
        { website: { [Op.like]: q } }
      ];
    }

    // Determine sort
    let sortField = 'name';
    let sortOrder = 'ASC';

    if (sortBy === 'university') sortField = 'university';
    else if (sortBy === 'city') sortField = 'city';
    else if (sortBy === 'status') sortField = 'status';
    else if (sortBy === 'createdAt') sortField = 'createdAt';
    else if (sortBy === 'id') sortField = 'id';

    if (order && order.toUpperCase() === 'DESC') {
      sortOrder = 'DESC';
    }

    const { count, rows } = await TBI.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortField, sortOrder]]
    });

    // Check if user is logged in to mark isFavorited
    let favoritedSet = new Set();
    if (req.user) {
      const userFavs = await Favorite.findAll({
        where: { userId: req.user.id },
        attributes: ['tbiId']
      });
      userFavs.forEach(f => favoritedSet.add(f.tbiId));
    }

    const data = rows.map(tbi => {
      const json = tbi.toJSON();
      json.isFavorited = favoritedSet.has(tbi.id);
      json.hasValidWebsite = isValidUrl(tbi.website);
      json.websiteUrl = json.hasValidWebsite ? normalizeUrl(tbi.website) : null;
      return json;
    });

    return res.status(200).json({
      success: true,
      data,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('getTbis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving TBIs'
    });
  }
};

// @desc    Get single TBI by ID
// @route   GET /api/tbis/:id
// @access  Public
const getTbiById = async (req, res) => {
  try {
    const { id } = req.params;
    const tbi = await TBI.findByPk(id);

    if (!tbi) {
      return res.status(404).json({
        success: false,
        message: 'TBI not found'
      });
    }

    let isFavorited = false;
    if (req.user) {
      const fav = await Favorite.findOne({
        where: { userId: req.user.id, tbiId: tbi.id }
      });
      isFavorited = !!fav;
    }

    const json = tbi.toJSON();
    json.isFavorited = isFavorited;
    json.hasValidWebsite = isValidUrl(tbi.website);
    json.websiteUrl = json.hasValidWebsite ? normalizeUrl(tbi.website) : null;

    return res.status(200).json({
      success: true,
      data: json
    });
  } catch (error) {
    console.error('getTbiById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving TBI details'
    });
  }
};

// @desc    Search TBIs with ranking
// @route   GET /api/tbis/search
// @access  Public
const searchTbis = async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    if (!q) {
      return getTbis(req, res);
    }

    const pattern = `%${q}%`;

    // Query matching records
    const where = {
      [Op.or]: [
        { name: { [Op.like]: pattern } },
        { university: { [Op.like]: pattern } },
        { incubatorType: { [Op.like]: pattern } },
        { city: { [Op.like]: pattern } },
        { universityType: { [Op.like]: pattern } },
        { email: { [Op.like]: pattern } },
        { website: { [Op.like]: pattern } }
      ]
    };

    const { count, rows } = await TBI.findAndCountAll({
      where,
      limit,
      offset
    });

    // Rank matching rows in memory based on Section 27
    const queryLower = q.toLowerCase();
    const rankedRows = rows.map(item => {
      let score = 0;
      const name = (item.name || '').toLowerCase();
      const university = (item.university || '').toLowerCase();
      const incType = (item.incubatorType || '').toLowerCase();
      const city = (item.city || '').toLowerCase();
      const uniType = (item.universityType || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      const website = (item.website || '').toLowerCase();

      if (name === queryLower) score += 100;
      else if (name.startsWith(queryLower)) score += 50;
      else if (name.includes(queryLower)) score += 30;

      if (university === queryLower) score += 80;
      else if (university.startsWith(queryLower)) score += 40;
      else if (university.includes(queryLower)) score += 25;

      if (incType === queryLower) score += 60;
      else if (incType.includes(queryLower)) score += 20;

      if (city === queryLower) score += 50;
      else if (city.includes(queryLower)) score += 15;

      if (uniType.includes(queryLower)) score += 10;
      if (email.includes(queryLower)) score += 8;
      if (website.includes(queryLower)) score += 5;

      const json = item.toJSON();
      json.score = score;
      json.hasValidWebsite = isValidUrl(item.website);
      json.websiteUrl = json.hasValidWebsite ? normalizeUrl(item.website) : null;
      return json;
    });

    rankedRows.sort((a, b) => b.score - a.score);

    // Favorites check
    if (req.user) {
      const favs = await Favorite.findAll({
        where: { userId: req.user.id },
        attributes: ['tbiId']
      });
      const favSet = new Set(favs.map(f => f.tbiId));
      rankedRows.forEach(r => {
        r.isFavorited = favSet.has(r.id);
      });
    }

    return res.status(200).json({
      success: true,
      data: rankedRows,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('searchTbis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
};

// @desc    Get search suggestions / autocomplete from real DB records
// @route   GET /api/tbis/suggestions
// @access  Public
const getSuggestions = async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q || q.length < 1) {
      return res.status(200).json({ success: true, data: [] });
    }

    const pattern = `%${q}%`;

    // Search across University, Name (TBI/Incubator), City, Incubator Type, and Status
    const rows = await TBI.findAll({
      where: {
        [Op.or]: [
          { university: { [Op.like]: pattern } },
          { name: { [Op.like]: pattern } },
          { city: { [Op.like]: pattern } },
          { incubatorType: { [Op.like]: pattern } },
          { status: { [Op.like]: pattern } }
        ]
      },
      attributes: [
        'id',
        'university',
        'name',
        'city',
        'incubatorType',
        'universityType',
        'status',
        'website'
      ],
      limit: 15
    });

    const queryLower = q.toLowerCase();

    // Rank matching rows by relevance
    const scoredRows = rows.map(item => {
      let score = 0;
      const u = (item.university || '').toLowerCase();
      const n = (item.name || '').toLowerCase();
      const c = (item.city || '').toLowerCase();
      const t = (item.incubatorType || '').toLowerCase();
      const s = (item.status || '').toLowerCase();

      // Highest weight for University name matching query
      if (u === queryLower) score += 100;
      else if (u.startsWith(queryLower)) score += 60;
      else if (u.includes(queryLower)) score += 30;

      // Next weight for TBI / Incubator name
      if (n === queryLower) score += 90;
      else if (n.startsWith(queryLower)) score += 50;
      else if (n.includes(queryLower)) score += 25;

      // City match
      if (c === queryLower) score += 40;
      else if (c.startsWith(queryLower)) score += 30;
      else if (c.includes(queryLower)) score += 20;

      // Incubator Type match
      if (t === queryLower) score += 30;
      else if (t.includes(queryLower)) score += 15;

      // Status match
      if (s === queryLower) score += 20;
      else if (s.includes(queryLower)) score += 10;

      return {
        id: item.id,
        university: item.university,
        name: item.name,
        city: item.city,
        incubatorType: item.incubatorType,
        universityType: item.universityType,
        status: item.status,
        score
      };
    });

    scoredRows.sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      data: scoredRows.slice(0, 8)
    });
  } catch (error) {
    console.error('getSuggestions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving suggestions'
    });
  }
};

// @desc    Get nearby TBIs based on coordinates or city fallback
// @route   GET /api/tbis/nearby
// @access  Public
const getNearbyTbis = async (req, res) => {
  try {
    const { lat, lon, city } = req.query;

    const userLat = lat ? parseFloat(lat) : null;
    const userLon = lon ? parseFloat(lon) : null;

    // Check if user provided coordinates
    if (userLat !== null && !isNaN(userLat) && userLon !== null && !isNaN(userLon)) {
      // Find all TBIs that have valid coordinates
      const tbisWithCoords = await TBI.findAll({
        where: {
          latitude: { [Op.ne]: null },
          longitude: { [Op.ne]: null }
        }
      });

      if (tbisWithCoords.length > 0) {
        const sorted = tbisWithCoords
          .map(tbi => {
            const dist = calculateDistance(userLat, userLon, tbi.latitude, tbi.longitude);
            const json = tbi.toJSON();
            json.distance = dist;
            json.hasValidWebsite = isValidUrl(tbi.website);
            json.websiteUrl = json.hasValidWebsite ? normalizeUrl(tbi.website) : null;
            return json;
          })
          .filter(tbi => tbi.distance !== null)
          .sort((a, b) => a.distance - b.distance);

        return res.status(200).json({
          success: true,
          mode: 'coordinates',
          data: sorted.slice(0, 20)
        });
      }
    }

    // Fallback: If no coordinates or no TBIs with coordinates, use city-based discovery
    const targetCity = city ? city.trim() : null;

    if (targetCity) {
      const cityTbis = await TBI.findAll({
        where: {
          city: { [Op.like]: `%${targetCity}%` }
        },
        limit: 30
      });

      const data = cityTbis.map(tbi => {
        const json = tbi.toJSON();
        json.distance = null; // Spec requirement: Never display fake distances
        json.hasValidWebsite = isValidUrl(tbi.website);
        json.websiteUrl = json.hasValidWebsite ? normalizeUrl(tbi.website) : null;
        return json;
      });

      return res.status(200).json({
        success: true,
        mode: 'city',
        city: targetCity,
        data
      });
    }

    // Default discovery: return list of top verified TBIs across major cities
    const fallbackTbis = await TBI.findAll({
      where: { status: 'Verified' },
      limit: 12,
      order: [['city', 'ASC']]
    });

    const data = fallbackTbis.map(tbi => {
      const json = tbi.toJSON();
      json.distance = null;
      json.hasValidWebsite = isValidUrl(tbi.website);
      json.websiteUrl = json.hasValidWebsite ? normalizeUrl(tbi.website) : null;
      return json;
    });

    return res.status(200).json({
      success: true,
      mode: 'fallback',
      message: 'Select your city to discover TBIs near you',
      data
    });
  } catch (error) {
    console.error('getNearbyTbis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving nearby TBIs'
    });
  }
};

// @desc    Create a new TBI
// @route   POST /api/tbis
// @access  Admin
const createTbi = async (req, res) => {
  try {
    const {
      university,
      city,
      universityType,
      name,
      incubatorType,
      email,
      website,
      status,
      domains,
      description,
      phone,
      address,
      state,
      country,
      latitude,
      longitude,
      logo,
      services,
      socialLinks
    } = req.body;

    if (!university || !name) {
      return res.status(400).json({
        success: false,
        message: 'University and TBI name are required'
      });
    }

    const tbi = await TBI.create({
      university: university.trim(),
      name: name.trim(),
      city: city ? city.trim() : null,
      universityType: universityType ? universityType.trim() : null,
      incubatorType: incubatorType ? incubatorType.trim() : null,
      email: email ? email.trim() : null,
      website: website ? website.trim() : null,
      status: normalizeStatus(status),
      domains: Array.isArray(domains) ? domains : [],
      description: description ? description.trim() : null,
      phone: phone ? phone.trim() : null,
      address: address ? address.trim() : null,
      state: state ? state.trim() : null,
      country: country ? country.trim() : 'India',
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      logo: logo ? logo.trim() : null,
      services: Array.isArray(services) ? services : [],
      socialLinks: typeof socialLinks === 'object' ? socialLinks : {}
    });

    return res.status(201).json({
      success: true,
      message: 'TBI created successfully',
      data: tbi
    });
  } catch (error) {
    console.error('createTbi error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating TBI'
    });
  }
};

// @desc    Update a TBI
// @route   PUT /api/tbis/:id
// @access  Admin
const updateTbi = async (req, res) => {
  try {
    const { id } = req.params;
    const tbi = await TBI.findByPk(id);

    if (!tbi) {
      return res.status(404).json({
        success: false,
        message: 'TBI not found'
      });
    }

    const fields = [
      'university', 'city', 'universityType', 'name', 'incubatorType',
      'email', 'website', 'status', 'domains', 'description', 'phone',
      'address', 'state', 'country', 'latitude', 'longitude', 'logo',
      'services', 'socialLinks'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'status') {
          tbi.status = normalizeStatus(req.body[field]);
        } else {
          tbi[field] = req.body[field];
        }
      }
    });

    await tbi.save();

    return res.status(200).json({
      success: true,
      message: 'TBI updated successfully',
      data: tbi
    });
  } catch (error) {
    console.error('updateTbi error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating TBI'
    });
  }
};

// @desc    Delete a TBI
// @route   DELETE /api/tbis/:id
// @access  Admin
const deleteTbi = async (req, res) => {
  try {
    const { id } = req.params;
    const tbi = await TBI.findByPk(id);

    if (!tbi) {
      return res.status(404).json({
        success: false,
        message: 'TBI not found'
      });
    }

    await tbi.destroy();

    return res.status(200).json({
      success: true,
      message: 'TBI deleted successfully'
    });
  } catch (error) {
    console.error('deleteTbi error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting TBI'
    });
  }
};

module.exports = {
  getTbis,
  getTbiById,
  searchTbis,
  getSuggestions,
  getNearbyTbis,
  createTbi,
  updateTbi,
  deleteTbi
};
