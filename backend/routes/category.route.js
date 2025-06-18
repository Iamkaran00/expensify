const route = require('express').Router();
const {protect} =require('../middleware.js/auth')
const {getCategories,getCategory,createCategory,getCategoryStats,deletecategory} = require('../controller/category.controller');

route.get('/getallcategories',protect,getCategories)
route.get('/getsinglecategory/:id',protect,getCategory);
route.post('/createcategory',protect,createCategory);
route.get('/getcategoriesstatus',protect,getCategoryStats);
route.delete('/deletecategory/:id',protect,deletecategory);
module.exports = route;