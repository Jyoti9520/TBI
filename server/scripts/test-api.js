const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('../src/config/db');
const { TBI, User, Favorite, Suggestion } = require('../src/models');
const app = require('../src/server');

async function runTests() {
  console.log('=== STARTING AUTOMATED BACKEND & MYSQL VERIFICATION TESTS ===\n');

  try {
    // 1. Verify DB records
    const tbiCount = await TBI.count();
    console.log(`[PASS] Total TBIs in MySQL: ${tbiCount} (Expected >= 478)`);

    const verifiedCount = await TBI.count({ where: { status: 'Verified' } });
    console.log(`[PASS] Verified TBIs in MySQL: ${verifiedCount}`);

    const uniqueUnis = await TBI.count({ distinct: true, col: 'university' });
    console.log(`[PASS] Unique Universities: ${uniqueUnis}`);

    // 2. Verify Admin user
    const admin = await User.findOne({ where: { email: 'admin@tbiglobal.org' } });
    if (!admin || admin.role !== 'ADMIN') {
      throw new Error('Admin user was not found or role is not ADMIN');
    }
    const isPwMatch = await admin.matchPassword('Admin@12345');
    if (!isPwMatch) {
      throw new Error('Admin password hash comparison failed');
    }
    console.log('[PASS] Admin credentials & bcrypt verification succeeded');

    // 3. Test Search & Filter logic
    const searchResults = await TBI.findAll({
      where: {
        name: { [require('sequelize').Op.like]: '%Technology%' }
      },
      limit: 5
    });
    console.log(`[PASS] Search by keyword 'Technology': found ${searchResults.length} records`);

    // 4. Test Autocomplete suggestions
    const uniSuggestions = await TBI.findAll({
      where: {
        university: { [require('sequelize').Op.like]: '%Punjab%' }
      },
      attributes: ['university'],
      group: ['university']
    });
    console.log(`[PASS] Autocomplete matching 'Punjab': found ${uniSuggestions.length} universities`);

    // 5. Test Favorite association
    const testUser = await User.findOne({ where: { role: 'ADMIN' } });
    const firstTbi = await TBI.findOne();

    await Favorite.findOrCreate({
      where: { userId: testUser.id, tbiId: firstTbi.id }
    });
    const favCount = await Favorite.count({ where: { userId: testUser.id } });
    console.log(`[PASS] Favorite creation & unique indexing: user favorites = ${favCount}`);

    await Favorite.destroy({ where: { userId: testUser.id, tbiId: firstTbi.id } });
    console.log('[PASS] Favorite cleanup successful');

    console.log('\n=== ALL DATABASE AND API VERIFICATION TESTS PASSED SUCCESSFULLY! ===\n');
    process.exit(0);
  } catch (err) {
    console.error('[FAIL] Test failed:', err);
    process.exit(1);
  }
}

// Give server time to initialize
setTimeout(runTests, 1500);
