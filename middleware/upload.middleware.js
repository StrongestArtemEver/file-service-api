const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: function(req, file, cb) {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Разрешены все файлы
  cb(null, true);
};

const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

module.exports = upload;