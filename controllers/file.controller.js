const File = require('../models/file.model');
  const { deleteFile } = require('../utils/fileUtils');
  const path = require('path');
  const fs = require('fs');
  
  exports.upload = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded'
        });
      }
      
      const userId = req.userId;
      const file = req.file;
      
      const savedFile = await File.create(file, userId);
      
      res.status(201).json({
        status: 'success',
        data: {
          id: savedFile.id,
          name: file.originalname,
          extension: path.extname(file.originalname).substring(1),
          mimeType: file.mimetype,
          size: file.size,
          uploadDate: new Date()
        }
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error uploading file'
      });
    }
  };
  
  
  exports.list = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const listSize = parseInt(req.query.list_size) || 10;
      
      if (page < 1 || listSize < 1) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid pagination parameters'
        });
      }
      
      const files = await File.findAll(page, listSize);
      
      res.status(200).json({
        status: 'success',
        data: files.data,
        pagination: files.pagination
      });
    } catch (error) {
      console.error('File list error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error retrieving file list'
      });
    }
  };
  
  exports.getInfo = async (req, res) => {
    try {
      const fileId = req.params.id;
      
      if (!fileId) {
        return res.status(400).json({
          status: 'error',
          message: 'File ID is required'
        });
      }
      
      const file = await File.findById(fileId);
      
      if (!file) {
        return res.status(404).json({
          status: 'error',
          message: 'File not found'
        });
      }
      
      res.status(200).json({
        status: 'success',
        data: {
          id: file.id,
          name: file.originalName,
          extension: file.extension,
          mimeType: file.mimeType,
          size: file.size,
          uploadDate: file.uploadDate
        }
      });
    } catch (error) {
      console.error('Get file info error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error retrieving file information'
      });
    }
  };
 
  exports.download = async (req, res) => {
    try {
      const fileId = req.params.id;
      
      if (!fileId) {
        return res.status(400).json({
          status: 'error',
          message: 'File ID is required'
        });
      }
      
      const file = await File.findById(fileId);
      
      if (!file) {
        return res.status(404).json({
          status: 'error',
          message: 'File not found'
        });
      }
      
      if (!fs.existsSync(file.path)) {
        return res.status(404).json({
          status: 'error',
          message: 'File not found on disk'
        });
      }
      
      res.download(file.path, file.originalName);
    } catch (error) {
      console.error('File download error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error downloading file'
      });
    }
  };
  
  exports.delete = async (req, res) => {
    try {
      const fileId = req.params.id;
      
      if (!fileId) {
        return res.status(400).json({
          status: 'error',
          message: 'File ID is required'
        });
      }
      
      const file = await File.findById(fileId);
      
      if (!file) {
        return res.status(404).json({
          status: 'error',
          message: 'File not found'
        });
      }
      
      if (file.userId !== req.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to delete this file'
        });
      }
      
      await deleteFile(file.path);
      
      const deleted = await File.delete(fileId);
      
      if (!deleted) {
        return res.status(500).json({
          status: 'error',
          message: 'Error deleting file from database'
        });
      }
      
      res.status(200).json({
        status: 'success',
        message: 'File deleted successfully'
      });
    } catch (error) {
      console.error('File delete error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error deleting file'
      });
    }
  };
 
  exports.update = async (req, res) => {
    try {
      const fileId = req.params.id;
      
      if (!fileId) {
        return res.status(400).json({
          status: 'error',
          message: 'File ID is required'
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded'
        });
      }
      
      const oldFile = await File.findById(fileId);
      
      if (!oldFile) {
        return res.status(404).json({
          status: 'error',
          message: 'File not found'
        });
      }
      
      if (oldFile.userId !== req.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to update this file'
        });
      }
      
      const newFile = req.file;
      
      await deleteFile(oldFile.path);
      
      const updatedFile = await File.update(fileId, newFile);
      
      if (!updatedFile) {
        return res.status(500).json({
          status: 'error',
          message: 'Error updating file in database'
        });
      }
      
      res.status(200).json({
        status: 'success',
        data: {
          id: fileId,
          name: newFile.originalname,
          extension: path.extname(newFile.originalname).substring(1),
          mimeType: newFile.mimetype,
          size: newFile.size,
          uploadDate: new Date()
        }
      });
    } catch (error) {
      console.error('File update error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error updating file'
      });
    }
  };