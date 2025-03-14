const db = require('./db.model');
const { v4: uuidv4 } = require('uuid');
const { refreshTokenExpiresIn } = require('../config/auth.config');

class RefreshToken {
  /**
   * @param {string} userId  
   * @returns {Promise<Object>}  
   */
  static async createToken(userId) {
    try {
      const token = uuidv4();
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + refreshTokenExpiresIn);

      const [result] = await db.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiresAt]
      );

      return {
        id: result.insertId,
        token,
        userId,
        expiresAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} token  
   * @returns {Promise<Object|null>} 
   */
  static async findByToken(token) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM refresh_tokens WHERE token = ?',
        [token]
      );

      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {Object} token  
   * @returns {boolean}  
   */
  static isTokenExpired(token) {
    return new Date() > new Date(token.expires_at);
  }

  /**
   * @param {string} token 
   * @returns {Promise<boolean>} 
   */
  static async deleteToken(token) {
    try {
      const [result] = await db.query(
        'DELETE FROM refresh_tokens WHERE token = ?',
        [token]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} userId  
   * @returns {Promise<boolean>} 
   */
  static async deleteAllUserTokens(userId) {
    try {
      const [result] = await db.query(
        'DELETE FROM refresh_tokens WHERE user_id = ?',
        [userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RefreshToken;

