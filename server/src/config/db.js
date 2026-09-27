const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  // Cloud Database (PostgreSQL / Supabase)
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
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
} else {
  // Local MySQL Fallback
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 3306;
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'tbi_global';

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
}

const connectDB = async () => {
  try {
    if (!databaseUrl) {
      const mysql = require('mysql2/promise');
      const dbHost = process.env.DB_HOST || 'localhost';
      const dbPort = process.env.DB_PORT || 3306;
      const dbUser = process.env.DB_USER || 'root';
      const dbPassword = process.env.DB_PASSWORD || '';
      const dbName = process.env.DB_NAME || 'tbi_global';

      const connection = await mysql.createConnection({
        host: dbHost,
        port: Number(dbPort),
        user: dbUser,
        password: dbPassword
      });

      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      await connection.end();
    }

    // Authenticate Sequelize
    await sequelize.authenticate();
    const dialectName = sequelize.getDialect();
    console.log(`[Database] ${dialectName.toUpperCase()} connected successfully.`);

    // Sync models
    await sequelize.sync({ alter: false });
    console.log('[Database] Models synchronized with schema.');
  } catch (error) {
    console.error('[Database] Connection error:', error.message);
    throw error;
  }
};

module.exports = { sequelize, connectDB };
