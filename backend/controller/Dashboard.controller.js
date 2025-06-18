const income = require('../models/IncomeModule');
const expense =require('../models/expenseModule');
const Category = require("../models/category.model");
const asyncHandler = require("../utils/asyncfunction");
const ErrorHandler = require('../utils/error.stack');
const mongoose= require("mongoose");
 const Income = require('../models/IncomeModule')
const Expense = require('../models/expenseModule');
const { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth } = require('date-fns');

 

 
exports.getDashboardOverview = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated or token missing.',
    });
  }
  const today = new Date();
  const periods = {
    today: { start: startOfDay(today), end: endOfDay(today) },
    thisMonth: { start: startOfMonth(today), end: endOfMonth(today) },
    last30Days: { start: subDays(today, 30), end: today },
    last60Days: { start: subDays(today, 60), end: today },
  };
  try {
    const summaryPromises = Object.keys(periods).map(async (period) => {
      const { start, end } = periods[period];
      const incomeData = await Income.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]);
      const expenseData = await Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]);

      const result = {
        income: incomeData.length > 0 ? incomeData[0].total : 0,
        expense: expenseData.length > 0 ? expenseData[0].total : 0,
        balance:
          (incomeData.length > 0 ? incomeData[0].total : 0) -
          (expenseData.length > 0 ? expenseData[0].total : 0),
      };

      return { period, data: result };
    });

    const [topExpenses, topIncomes, recentIncomes, recentExpenses, summaries] = await Promise.all([
      Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: periods.thisMonth.start, $lte: periods.thisMonth.end },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryDetails',
          },
        },
        { $unwind: '$categoryDetails' },
        {
          $group: {
            _id: {
              categoryId: '$category',
              name: '$categoryDetails.name',
              icon: '$categoryDetails.icon',
              color: '$categoryDetails.color',
            },
            total: { $sum: '$amount' },
          },
        },
        {
          $project: {
            _id: 0,
            categoryId: '$_id.categoryId',
            name: '$_id.name',
            icon: '$_id.icon',
            color: '$_id.color',
            total: 1,
          },
        },
        { $sort: { total: -1 } },
        { $limit: 10 },
      ]),
      Income.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            date: { $gte: periods.thisMonth.start, $lte: periods.thisMonth.end },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryDetails',
          },
        },
        { $unwind: '$categoryDetails' },
        {
          $group: {
            _id: {
              categoryId: '$category',
              name: '$categoryDetails.name',
              icon: '$categoryDetails.icon',
              color: '$categoryDetails.color',
            },
            total: { $sum: '$amount' },
          },
        },
        {
          $project: {
            _id: 0,
            categoryId: '$_id.categoryId',
            name: '$_id.name',
            icon: '$_id.icon',
            color: '$_id.color',
            total: 1,
          },
        },
        { $sort: { total: -1 } },
        { $limit: 10 },
      ]),
      Income.find({ user: userId })
        .populate({ path: 'category', select: 'name icon color' })
        .sort({ date: -1 })
        .limit(10),
      Expense.find({ user: userId })
        .populate({ path: 'category', select: 'name icon color' })
        .sort({ date: -1 })
        .limit(10),
      Promise.all(summaryPromises),
    ]);

    const recentTransactions = [
      ...recentIncomes.map(item => ({ ...item.toObject(), type: 'income' })),
      ...recentExpenses.map(item => ({ ...item.toObject(), type: 'expense' })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    const formattedSummaries = {};
    summaries.forEach(({ period, data }) => {
      formattedSummaries[period] = data;
    });

    return res.status(200).json({
      success: true,
      data: {
        summary: formattedSummaries,
        topExpenses,
        topIncomes,
        recentTransactions,
      },
    });
  } catch (err) {
    console.error('Dashboard overview error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error while generating dashboard overview',
    });
  }
});

  