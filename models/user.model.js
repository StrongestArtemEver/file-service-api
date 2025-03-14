const db = require('./db.model');
const bcrypt = require('bcryptjs');

class User {
    /**
     * @param {Object} user  
     * @param {string} user.id  
     * @param {string} user.password  
     * @returns {Promise<Object>} 
     */
    static async create(user) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            const [result] = await db.query(
                'INSERT INTO users (id, password) VALUES (?, ?)',
                [user.id, hashedPassword]
            );

            return { id: user.id };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param {string} id  
     * @returns {Promise<Object|null>}  
     */
    static async findById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows.length ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param {string} plainPassword  
     * @param {string} hashedPassword  
     * @returns {Promise<boolean>}  
     */
    static async validatePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;