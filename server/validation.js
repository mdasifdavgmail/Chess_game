const validateMove = (move) => {
    if (!move || typeof move !== 'string') {
      return false;
    }
    
    return true; 
  };
  
  module.exports = {
    validateMove
  };
  