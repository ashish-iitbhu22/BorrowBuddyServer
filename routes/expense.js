const express = require("express");
const {
  addExpense,
  getExpense,
  updateUserById,
  deleteExpense,
} = require("../controllers/expense");

const expenseRoute = express.Router();

expenseRoute.route("/").post(addExpense);
expenseRoute.route("/").get(getExpense);
expenseRoute.route("/:id").patch(updateUserById);
expenseRoute.route("/:id").delete(deleteExpense);

module.exports = expenseRoute;
