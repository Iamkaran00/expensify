const categoryModel = require("../models/category.model");
const Expense = require("../models/expenseModule");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncfunction");
const ErrorResponse = require("../utils/error.stack");
exports.getExpenses = asyncHandler(async (req, res) => {
  const expense = await Expense.find({ user: req.user.id }).populate(
    "category"
  );
  if (!expense) {
    return next(new ErrorResponse("cannot get all expense", 401));
  }
  res.status(200).json({
    success: true,
    message: "here is all expenses assigned to user",
    data: expense,
  });
});

exports.addExpense = asyncHandler(async (req, res, next) => {
  const { title, amount, description, categoryName, date, icon } = req.body;
  if (!title || !amount || !categoryName || !icon) {
    return next(new ErrorResponse("fill all entries", 401));
  }
  const normalizedCategoryName = categoryName.trim().toLowerCase();
  let cat = await categoryModel.findOne({
    name: normalizedCategoryName,
    user: req.user._id,
    type: "expense",
  });
  if (!cat) {
    cat = await categoryModel.create({
      type: "expense",
      user: req.user.id,
      name: normalizedCategoryName,
    });
  }
  console.log(cat._id);
  const expense = await Expense.create({
    user: req.user.id,
    amount,
    title,
    icon,
    description,
    category: cat._id,
    date: Date.now(),
  });
  res.status(201).json({
    success: true,
    message: "expense added successfully",
  });
});
exports.getRecentExpenses = asyncHandler(async (req, res) => {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Pagination setup
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Fetch paginated recent incomes
  const recentExpense = await Expense.find({
    user: req.user.id,
    date: { $gte: sixtyDaysAgo },
  })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate("category", "name color icon");

  // Calculate total amount from recent incomes
  const totalExpense = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user.id),
        date: { $gte: sixtyDaysAgo },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const totalAmount = totalExpense[0] ? totalExpense[0].totalAmount : 0;

  // Send response
  res.status(200).json({
    success: true,
    totalIncome: totalAmount,
    expenses: recentExpense,
    page,
    limit,
  });
});
//delete incomes
exports.deleteExpense = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorResponse("could not find expense id", 401));
  }

  const deleted = await Expense.findByIdAndDelete(id);
  if (!deleted) {
    return next(new ErrorResponse("Expense not found", 404));
  }
  return res.status(200).json({
    success: 201,
    message: "expense deleted successfully 🧃",
    data: {},
  });
});
