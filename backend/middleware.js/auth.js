const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncfunction')
const ErrorResponse = require('../utils/error.stack');
const User = require('../models/user.model');
 
 
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
  console.log('in auth middlwere')
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
     
      token = req.cookies.token;
    }
 
  
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401 ) );
    }
  console.log("in auth",token);
    try {
    
      const decoded = jwt.verify(token,process.env.JWT_SECRET, { algorithm: 'HS256' });
  console.log(decoded,"here is decoded");
    
      req.user = await User.findById(decoded.id);
  
      if (!req.user) {
        return next(new ErrorResponse('User not found', 404));
      }
  
      next();
    } catch (err) {
      
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  });
