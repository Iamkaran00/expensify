const route = require('express').Router();
const {getIncome,addIncome,getRecentIncomes,deleteIncome} = require('../controller/income')
const {protect} = require('../middleware.js/auth');
route.get('/get_all_incomes' , protect , getIncome);
route.post('/add_income', protect ,addIncome);
route.get('/getRecentIncomes',protect,getRecentIncomes);
route.delete('/deleteIncome/:id',protect,deleteIncome);
module.exports = route;