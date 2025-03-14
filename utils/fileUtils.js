const fs = require('fs');
const path = require('path');

/**
 * @param {string} folderPath 
 */
exports.createFolderIfNotExists = (folderPath) => {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created folder: ${folderPath}`);
    }
  } catch (error) {
    console.error(`Error creating folder ${folderPath}:`, error);
    throw error;
  }
};

/**
 * @param {string} filePath 
 */
exports.deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
        return reject(err);
      }
      resolve();
    });
  });
};
