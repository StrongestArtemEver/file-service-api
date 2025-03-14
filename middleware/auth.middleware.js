const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth.config');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided'
    });
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    });
  }
};

module.exports = verifyToken;