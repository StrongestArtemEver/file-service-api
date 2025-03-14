const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');
const verifyToken = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/upload', verifyToken, upload.single('file'), fileController.upload);

router.get('/list', verifyToken, fileController.list);

router.get('/:id', verifyToken, fileController.getInfo);

router.get('/download/:id', verifyToken, fileController.download);

router.delete('/delete/:id', verifyToken, fileController.delete);

router.put('/update/:id', verifyToken, upload.single('file'), fileController.update);

module.exports = router;