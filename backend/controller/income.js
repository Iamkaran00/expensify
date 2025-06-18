const { default: mongoose } = require("mongoose");
const asyncHandler = require("../utils/asyncfunction");
const ErrorResponse = require("../utils/error.stack");
const Income = require("../models/IncomeModule");
const category = require("../models/category.model");
 
exports.getIncome = asyncHandler(async (req, res) => {
  const income = await Income.find({ user: req.user.id }).populate("category");
  if (!income) {
    return next(new ErrorResponse("cannot get all incomes", 401));
  }
  res.status(200).json({
    success: true,
    message: "here is income assigned to user",
    data: income,
  });
});
//add new income
exports.addIncome = asyncHandler(async (req, res, next) => {
  const { title, description, amount, categoryName, date, icon } = req.body;
  console.log("at addincome");
  if (!title || !amount || !categoryName || !icon) {
    return next(new ErrorResponse("fill all entries", 401));
  }
  if (!categoryName || typeof categoryName !== "string") {
    return next(new ErrorResponse("Invalid category name", 400));
  }
  const normalizedCategoryName = categoryName.trim().toLowerCase();

  let cat = await category.findOne({
    name: normalizedCategoryName,
    user: req.user._id,
    type: "income",
  });
  if (!cat) {
    cat = await category.create({
      user: req.user.id,
      type: "income",
      name: normalizedCategoryName,
    });
  }
  const income = await Income.create({
    user: req.user.id,
    amount,
    title,
    description,
    icon,
    category: cat._id,
    date: Date.now(),
  });
  return res.status(200).json({
    success: 200,
    message: "income added succesfully",
    income,
  });
});
exports.getRecentIncomes = asyncHandler(async (req, res, next) => {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  // Pagination setup
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  // Fetch paginated recent incomes
  const recentIncomes = await Income.find({
    user: req.user.id,
    date: { $gte: sixtyDaysAgo },
  })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .populate("category", "name color icon");
  // Calculate total amount from recent incomes
  const totalIncome = await Income.aggregate([
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
  const totalAmount = totalIncome[0] ? totalIncome[0].totalAmount : 0;
  // Send response
  res.status(200).json({
    success: true,
    totalIncome: totalAmount,
    incomes: recentIncomes,
    page,
    limit,
  });
});
//delete incomes
exports.deleteIncome = asyncHandler(async (req, res, next) => {
   const { id } = req.params;
console.log(id,'here is id');
  try {
    const result = await Income.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.status(200).json({ message: "Income deleted successfully yes" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting income" });
  }
});
