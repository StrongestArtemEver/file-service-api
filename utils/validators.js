/**
 * @param {string} email 
 * @returns {boolean}
 */
exports.isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * @param {string} phone 
   * @returns {boolean}
   */
  exports.isPhoneNumber = (phone) => {
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(phone);
  };
  
  /**
   * @param {string} id 
   * @returns {boolean}
   */
  exports.isValidUserId = (id) => {
    return this.isEmail(id) || this.isPhoneNumber(id);
  };