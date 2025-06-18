const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncfunction')
const ErrorResponse = require('../utils/error.stack');
const User = require('../models/user.model');
 
// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
  console.log('in auth middlwere')
    // Extract token from auth header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      // Set token from cookie
      token = req.cookies.token;
    }
  console.log(token);
    // Make sure token exists
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401 ) );
    }
  console.log("in auth",token);
    try {
      // Verify token
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
