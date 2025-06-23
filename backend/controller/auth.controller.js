const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const asyncHandler = require("../utils/asyncfunction");
const ErrorResponse = require("../utils/error.stack");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
exports.signup = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return next(new ErrorResponse('Fill the entries', 401));
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return next(new ErrorResponse('Email already registered', 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  if (!req.file) {
    return next(new ErrorResponse('No file uploaded or file type not allowed', 400));
  }
  console.log('Signup JWT_SECRET:', process.env.JWT_SECRET);
  const uploadResult = await cloudinary.uploader.upload(req.file?.path, {
    folder: 'Uploads',
  });
  fs.unlinkSync(req.file.path);
  const payload = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    profilePhoto: uploadResult.secure_url,
  };
  const user = await User.create(payload);
  const data = { id: user._id, email: user.email };
  const token = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256',  
  });
  console.log('Generated Token:', token);
  res.cookie('token', token, {
    httpOnly: true,
   sameSite: 'None',
  secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    message: 'User created successfully',
    token,
    user: {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      password: hashedPassword,
      profilePhoto: user.profilePhoto,
    },
  });
});
exports.signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse('Fill entries carefully', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await bcrypt.compare(String(password), user.password);
  if (!isMatch) {
    return next(new ErrorResponse('Enter correct Password', 401));
  }

  console.log('Signin JWT_SECRET:', process.env.JWT_SECRET);
  const payload = { email: user.email, id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '48h',
    algorithm: 'HS256', 
  });
  console.log('Generated Token:', token);
  user.token = token;
  user.password = undefined;
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie('token', token, options).status(200).json({
    success: true,
    token,
    user,
    message: 'Logged in successfully',
  });
});

 
exports.signout = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  sameSite: 'None',
  secure: true,
  });
  res.status(200).json({
    success: true,
    data: {},
    message: "User logged out",
  });
});

exports.getme = asyncHandler(async(req,res)=>{
  console.log(req.user);
  const user = await User.findById(req.user.id).select('-password');
  if(!user){
    return next(new  ErrorResponse('User not found',404))
  }
  res.json(user);
})
