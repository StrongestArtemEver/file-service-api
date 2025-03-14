exports.getInfo = (req, res) => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Not authenticated'
        });
      }
      
      res.status(200).json({
        status: 'success',
        data: { id: userId }
      });
    } catch (error) {
      console.error('Get user info error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error retrieving user information'
      });
    }
  };