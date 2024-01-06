const express = require("express");
const router = express.Router();

//import controller
const {
  createIncomeAccount,
  getAllIncomeAccountList,
  updateIncomeAccount,
  deleteIncomeAccount,
  getAllIncomeBetweenDates,
  dueMailController,
} = require("../controllers/IncomeList");

//define API routes

router.post("/createIncomeAccount", createIncomeAccount);
router.get("/getAllIncomeAccountList", getAllIncomeAccountList);
router.put("/updateIncomeAccount", updateIncomeAccount);
router.delete("/deleteIncomeAccount", deleteIncomeAccount);
router.post("/getAllIncomeBetweenDates", getAllIncomeBetweenDates);
router.post("/dueMailController", dueMailController);

module.exports = router;
