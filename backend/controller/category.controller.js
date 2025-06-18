const Category = require("../models/category.model");
const incomes = require("../models/IncomeModule");
const expense = require("../models/expenseModule");
const asyncHandler = require("../utils/asyncfunction");
const ErrorResponse = require('../utils/error.stack');
const categoryModel = require("../models/category.model");

//get all categories for logged

exports.getCategories = asyncHandler(async (req,res,next)=>{
    const filter = {user : req.user.id};
    if(req.query.type) filter.type = req.query.type;
    const categories = await Category.find(filter).sort('name');
    res.status(200).json(
        {
            success : true,
            count : categories.length,
            data : categories,
        }
    )
})
//get a single category by Id 
exports.getCategory = asyncHandler(async(req,res,next)=>{
    const category = await Category.findById(req.params.id);
    if(!category|| category.user.toString() !== req.user.id){
        return next (new ErrorResponse("Category not found or unauthorized",404))
    }
    res.status(200).json({
        success : true, data : category
    });
})
;

//create a new category
exports.createCategory = asyncHandler(async (req, res, next) => {
    let { name, type } = req.body;
  
    if (!name || !type) {
        return next(new ErrorResponse("please fill name and type of category",400))
    }
    console.log(req.user.id);
    const id = req.user.id;
  console.log(id);
    const existingCategory = await Category.findOne({
      name: name.trim().toLowerCase(),
      type,
      user: req.user.id,
    });
  
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }
  name = name.trim();
    req.body.name = name.trim();
  const payload = {
    name,
    type,
    user :req.user.id,
  }
    const category = await Category.create(payload);
  
    res.status(201).json({
      success: true,
      data: category,
    });
  });
  // category statics
  exports.getCategoryStats = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    // Prepare date filter
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
  
    const categoryStats = await Category.aggregate([
      { $match: { user: req.user._id } },
  
      // Lookup income entries
      {
        $lookup: {
          from: 'incomes',
          let: { categoryId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$category', '$$categoryId'] },
                ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
              }
            }
          ],
          as: 'incomes'
        }
      },
  
      // Lookup expense entries
      {
        $lookup: {
          from: 'expenses',
          let: { categoryId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$category', '$$categoryId'] },
                ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
              }
            }
          ],
          as: 'expenses'
        }
      },
  
      // Combine stats
      {
        $project: {
          name: 1,
          type: 1,
          color: 1,
          icon: 1,
          incomeCount: { $size: '$incomes' },
          expenseCount: { $size: '$expenses' },
          totalIncome: { $sum: '$incomes.amount' },
          totalExpense: { $sum: '$expenses.amount' }
        }
      },
  
 
      {
        $addFields: {
          totalTransactions: { $add: ['$incomeCount', '$expenseCount'] }
        }
      },
       
      {
        $sort: { totalTransactions: -1 }
      }
    ]);
  
    res.status(200).json({
      success: true,
      count: categoryStats.length,
      data: categoryStats
    });
  });
  
exports.deletecategory  = asyncHandler(async (req,res,next)=>{
  const id = req.params.id;
  if(!id){
    return next(new ErrorResponse('could not delete',401));
  }
  
 const deletedCat =  await Category.findByIdAndDelete(id);
 if(!deletedCat){
  return next(new ErrorResponse('category cannot deleted',400));
 }
  return res.status(200).json(
    {
      success : true,
      message : "category deleted successfully"
    }
  )
})