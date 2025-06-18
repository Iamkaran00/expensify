const route = require('express').Router();
const {protect} = require('../middleware.js/auth');
const {getDashboardOverview,getExpenseTrend,getIncomeTrend,getCategoryComparison} = require('../controller/Dashboard.controller');
route.get('/getdashboardoverview',protect,getDashboardOverview);
module.exports = route;