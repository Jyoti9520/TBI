const { fn, col, literal, Op } = require('sequelize');
const xlsx = require('xlsx');
const { TBI, User, Suggestion } = require('../models');
const { normalizeStatus, cleanString } = require('../utils/normalizeData');

// @desc    Get Admin Dashboard dynamic statistics
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res) => {
  try {
    const [
      totalTbis,
      verifiedTbis,
      underVerificationTbis,
      unverifiedTbis,
      uniqueUniversities,
      uniqueCities,
      totalUsers,
      pendingSuggestions
    ] = await Promise.all([
      TBI.count(),
      TBI.count({ where: { status: 'Verified' } }),
      TBI.count({ where: { status: 'Under Verification' } }),
      TBI.count({ where: { status: 'Unverified' } }),
      TBI.count({ distinct: true, col: 'university' }),
      TBI.count({ distinct: true, col: 'city' }),
      User.count(),
      Suggestion.count({ where: { status: 'Pending' } })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalTbis,
        verifiedTbis,
        underVerificationTbis,
        unverifiedTbis,
        uniqueUniversities,
        uniqueCities,
        totalUsers,
        pendingSuggestions
      }
    });
  } catch (error) {
    console.error('getStats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving admin statistics'
    });
  }
};

// @desc    Get users list with search and pagination
// @route   GET /api/admin/users
// @access  Admin
const getUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : '';

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: rows,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving users'
    });
  }
};

// @desc    Update user role (Prevent self-demotion)
// @route   PUT /api/admin/users/:id/role
// @access  Admin
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be USER or ADMIN.'
      });
    }

    // Do not allow an admin to accidentally remove their own admin access
    if (Number(id) === req.user.id && role !== 'ADMIN') {
      return res.status(400).json({
        success: false,
        message: 'Security warning: You cannot remove your own administrator privileges.'
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('updateUserRole error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating user role'
    });
  }
};

// @desc    Toggle user status (Active / Inactive, prevent self-deactivation)
// @route   PUT /api/admin/users/:id/status
// @access  Admin
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (Number(id) === req.user.id && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Security warning: You cannot deactivate your own account.'
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = typeof isActive === 'boolean' ? isActive : !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('toggleUserStatus error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating user status'
    });
  }
};

// @desc    Import Dataset (.xlsx, .csv, .json)
// @route   POST /api/admin/import
// @access  Admin
const importDataset = async (req, res) => {
  try {
    const file = req.file;
    const duplicateAction = req.body.duplicateAction || 'update'; // 'skip' | 'update'

    let rawRecords = [];

    if (file) {
      const ext = file.originalname.split('.').pop().toLowerCase();
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        rawRecords = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      } else if (ext === 'json') {
        const str = file.buffer.toString('utf8');
        rawRecords = JSON.parse(str);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Unsupported file format. Please upload .xlsx, .csv, or .json'
        });
      }
    } else if (req.body.records && Array.isArray(req.body.records)) {
      rawRecords = req.body.records;
    } else {
      return res.status(400).json({
        success: false,
        message: 'No file or records payload provided for import'
      });
    }

    const report = {
      totalRows: rawRecords.length,
      valid: 0,
      invalid: 0,
      duplicates: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };

    for (let i = 0; i < rawRecords.length; i++) {
      const row = rawRecords[i];
      const rowIndex = i + 1;

      // Extract values with support for various header variants
      const university = cleanString(row['University'] || row['university'] || row['University Name']);
      const name = cleanString(
        row['Incubator / TBI Name'] || row['name'] || row['TBI Name'] || row['tbiName'] || row['Incubator Name']
      );
      const city = cleanString(row['City'] || row['city']);
      const universityType = cleanString(row['University Type'] || row['universityType']);
      const incubatorType = cleanString(row['Incubator Type'] || row['incubatorType']);
      const email = cleanString(row['Official Email ID'] || row['email'] || row['Official Email']);
      const website = cleanString(row['Website'] || row['website']);
      const statusRaw = row['Status'] || row['status'];
      const serialNumber = row['S.No'] || row['id'] || row['serialNumber'] || rowIndex;

      // Validation check
      if (!university || !name) {
        report.invalid++;
        report.errors.push({
          row: rowIndex,
          reason: 'Missing required fields: University and Incubator/TBI Name are required'
        });
        continue;
      }

      report.valid++;
      const status = normalizeStatus(statusRaw);

      // Duplicate check by (university + city + name)
      const existing = await TBI.findOne({
        where: {
          university,
          name,
          ...(city ? { city } : {})
        }
      });

      if (existing) {
        report.duplicates++;
        if (duplicateAction === 'update') {
          existing.serialNumber = Number(serialNumber) || existing.serialNumber;
          existing.universityType = universityType || existing.universityType;
          existing.incubatorType = incubatorType || existing.incubatorType;
          existing.email = email || existing.email;
          existing.website = website || existing.website;
          existing.status = status;
          if (city) existing.city = city;
          await existing.save();
          report.updated++;
        } else {
          report.skipped++;
        }
      } else {
        await TBI.create({
          serialNumber: Number(serialNumber) || null,
          university,
          city,
          universityType,
          name,
          incubatorType,
          email,
          website,
          status
        });
        report.inserted++;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Dataset import processing completed',
      report
    });
  } catch (error) {
    console.error('importDataset error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error importing dataset'
    });
  }
};

module.exports = {
  getStats,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  importDataset
};
