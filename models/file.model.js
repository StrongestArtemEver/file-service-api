const db = require('./db.model');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class File {
    /**
     * @param {Object} file  
     * @param {string} userId  
     * @returns {Promise<Object>} 
     */
    static async create(file, userId) {
        try {
            const id = uuidv4();
            const extension = path.extname(file.originalname).substring(1);

            const [result] = await db.query(
                `INSERT INTO files 
        (id, user_id, original_name, filename, extension, mime_type, size, path) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id,
                    userId,
                    file.originalname,
                    file.filename,
                    extension,
                    file.mimetype,
                    file.size,
                    file.path
                ]
            );

            return { id, ...file, userId };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param {number} page  
     * @param {number} listSize  
     * @returns {Promise<Array>}  
     */
    static async findAll(page, listSize) {
        try {
            const offset = (page - 1) * listSize;

            const [countResult] = await db.query('SELECT COUNT(*) as total FROM files');
            const total = countResult[0].total;

            const [rows] = await db.query(
                `SELECT 
          id, user_id as userId, original_name as originalName, extension, 
          mime_type as mimeType, size, upload_date as uploadDate 
        FROM files 
        LIMIT ? OFFSET ?`,
                [listSize, offset]
            );

            return {
                data: rows,
                pagination: {
                    total,
                    page,
                    listSize,
                    totalPages: Math.ceil(total / listSize)
                }
            };
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
            const [rows] = await db.query(
                `SELECT 
          id, user_id as userId, original_name as originalName, filename,
          extension, mime_type as mimeType, size, path, upload_date as uploadDate 
        FROM files 
        WHERE id = ?`,
                [id]
            );

            return rows.length ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param {string} id  
     * @returns {Promise<boolean>} 
     */
    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM files WHERE id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param {string} id 
     * @param {Object} file  
     * @returns {Promise<Object>}  
     */
    static async update(id, file) {
        try {
            const extension = path.extname(file.originalname).substring(1);

            const [result] = await db.query(
                `UPDATE files 
        SET original_name = ?, filename = ?, extension = ?, 
        mime_type = ?, size = ?, path = ?, upload_date = CURRENT_TIMESTAMP 
        WHERE id = ?`,
                [
                    file.originalname,
                    file.filename,
                    extension,
                    file.mimetype,
                    file.size,
                    file.path,
                    id
                ]
            );

            return result.affectedRows > 0 ? { id, ...file } : null;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = File;