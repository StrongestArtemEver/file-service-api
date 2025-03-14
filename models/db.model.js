const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

const pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.DB}`);
    await connection.end();

    const [createUsersTable] = await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [createTokensTable] = await pool.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    const [createFilesTable] = await pool.query(`
      CREATE TABLE IF NOT EXISTS files (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        extension VARCHAR(50),
        mime_type VARCHAR(100) NOT NULL,
        size INT NOT NULL,
        path VARCHAR(255) NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

initDatabase();

module.exports = {
  pool,
  query: (sql, params) => pool.query(sql, params)
};



