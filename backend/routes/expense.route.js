const route = require("express").Router();
const { protect } = require("../middleware.js/auth");
const {
  getExpenses,
  addExpense,
  getRecentExpenses,
  deleteExpense,
} = require("../controller/expenses");
route.get("/getallexpenses", protect, getExpenses);
route.post("/addexpense", protect, addExpense);
route.get("/getrecentexpenses", protect, getRecentExpenses);
route.delete("/delete-expense/:id", deleteExpense);
module.exports = route;