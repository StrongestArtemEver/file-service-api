const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const RefreshToken = require('../models/token.model');
const { jwtSecret, jwtExpiresIn } = require('../config/auth.config');
const { isValidUserId } = require('../utils/validators');

/**
 * @param {string} userId  
 * @returns {string}  
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: jwtExpiresIn
  });
};

exports.signup = async (req, res) => {
  try {
    const { id, password } = req.body;
    
    if (!id || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'ID and password are required'
      });
    }
    
    if (!isValidUserId(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'ID must be a valid email or phone number'
      });
    }
    
    const existingUser = await User.findById(id);
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this ID already exists'
      });
    }
    
    await User.create({ id, password });
    
    const accessToken = generateToken(id);
    const refreshToken = await RefreshToken.createToken(id);
    
    res.status(201).json({
      status: 'success',
      data: {
        id,
        accessToken,
        refreshToken: refreshToken.token
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating new user'
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { id, password } = req.body;
    
    if (!id || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'ID and password are required'
      });
    }
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    const isPasswordValid = await User.validatePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    const accessToken = generateToken(id);
    const refreshToken = await RefreshToken.createToken(id);
    
    res.status(200).json({
      status: 'success',
      data: {
        id,
        accessToken,
        refreshToken: refreshToken.token
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error during authentication'
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required'
      });
    }
    
    const token = await RefreshToken.findByToken(refreshToken);
    if (!token) {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }
    
    if (RefreshToken.isTokenExpired(token)) {
        await RefreshToken.deleteToken(refreshToken);
        return res.status(403).json({
          status: 'error',
          message: 'Refresh token expired'
        });
      }
      
      const userId = token.user_id;
      const accessToken = generateToken(userId);
      
      await RefreshToken.deleteToken(refreshToken);
      
      const newRefreshToken = await RefreshToken.createToken(userId);
      
      return res.status(200).json({
        status: 'success',
        data: {
          id: userId,
          accessToken,
          refreshToken: newRefreshToken.token
        }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error refreshing token'
      });
    }
  };
  
 
  exports.logout = async (req, res) => {
    try {
      const userId = req.userId;
      
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Not authenticated'
        });
      }
      
      await RefreshToken.deleteAllUserTokens(userId);
      
      res.status(200).json({
        status: 'success',
        message: 'Successfully logged out'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error during logout'
      });
    }
  };