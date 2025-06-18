const express = require('express');
const routes = express.Router();
const upload  = require("../middleware.js/file.upload");
 const {protect} = require('../middleware.js/auth');
const {signup,signin,signout,getme} = require('../controller/auth.controller');

routes.post('/signup',upload.single('profilePic'),signup);
routes.post('/signin',signin);
routes.post('/signout',signout);
routes.get('/getme',protect,getme);
module.exports = routes;