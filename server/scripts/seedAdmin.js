const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('../src/config/db');
const { User } = require('../src/models');

async function seedAdmin() {
  console.log('--- Seeding Default Administrator Account ---');
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@tbiglobal.org';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const adminName = process.env.ADMIN_NAME || 'Platform Administrator';

  const existingAdmin = await User.findOne({ where: { email: adminEmail.toLowerCase() } });

  if (existingAdmin) {
    existingAdmin.role = 'ADMIN';
    existingAdmin.isActive = true;
    await existingAdmin.save();
    console.log(`Admin user already exists (${adminEmail}). Confirmed ADMIN role.`);
  } else {
    await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: 'ADMIN',
      isActive: true
    });
    console.log(`Admin user created successfully!`);
    console.log(`Email    : ${adminEmail}`);
    console.log(`Password : ${adminPassword}`);
  }

  process.exit(0);
}

seedAdmin().catch(err => {
  console.error('Fatal admin seeder error:', err);
  process.exit(1);
});
