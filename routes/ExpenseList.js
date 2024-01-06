const express = require("express");
const router = express.Router();

//import controller
const {
  createExpenseAccount,
  getAllExpenseList,
  deleteExpenseAccount,
  updateIncomeAccount,
  getAllExpenseBetweenDates,
} = require("../controllers/ExpenseList");

//define API routes

router.post("/createExpenseAccount", createExpenseAccount);
router.get("/getAllExpenseList", getAllExpenseList);
router.delete("/deleteExpenseAccount", deleteExpenseAccount);
router.put("/updateIncomeAccount", updateIncomeAccount);
router.post("/getAllExpenseBetweenDates", getAllExpenseBetweenDates);

module.exports = router;
