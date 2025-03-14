require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const { createFolderIfNotExists } = require('./utils/fileUtils');

const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./models/db.model');

const authRoutes = require('./routes/auth.routes');
const fileRoutes = require('./routes/file.routes');
const userRoutes = require('./routes/user.routes');

app.use(helmet());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

createFolderIfNotExists(process.env.UPLOAD_DIR || './uploads');

app.use('/api', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
  });