const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'tbi_global';

let sequelize;

const connectDB = async () => {
  try {
    // 1. Ensure database exists
    const connection = await mysql.createConnection({
      host: dbHost,
      port: Number(dbPort),
      user: dbUser,
      password: dbPassword
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.end();

    // 2. Authenticate Sequelize
    await sequelize.authenticate();
    console.log(`[Database] MySQL connected successfully: ${dbName} at ${dbHost}:${dbPort}`);

    // 3. Sync models (alter table if needed)
    await sequelize.sync({ alter: false });
    console.log('[Database] Models synchronized with MySQL schema.');
  } catch (error) {
    console.error('[Database] MySQL connection error:', error.message);
    throw error;
  }
};

sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: Number(dbPort),
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? false : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: false
  }
});

module.exports = { sequelize, connectDB };
