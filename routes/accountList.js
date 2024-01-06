const express = require("express");
const router = express.Router();

//import controller
const {
  createAccount,
  getAllAccountList,
  updateAccount,
  deleteAccount,
  getAccountNumberList,
  addIncomeToAccount,
  removeExpenseToAccount,
} = require("../controllers/List");

//define API routes

router.post("/createAccount", createAccount);
router.get("/getAllList", getAllAccountList);
router.put("/updateAccount", updateAccount);
router.delete("/deleteAccount", deleteAccount);
router.get("/getAccountNumberList", getAccountNumberList);
router.put("/addIncomeToAccount", addIncomeToAccount);
router.put("/removeExpenseToAccount", removeExpenseToAccount);

module.exports = router;
