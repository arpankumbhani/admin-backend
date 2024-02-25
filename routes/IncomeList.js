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
  getAllLedgerClientName,
  ledgerReportMail,
} = require("../controllers/IncomeList");

//define API routes

router.post("/createIncomeAccount", createIncomeAccount);
router.get("/getAllIncomeAccountList", getAllIncomeAccountList);
router.put("/updateIncomeAccount", updateIncomeAccount);
router.delete("/deleteIncomeAccount", deleteIncomeAccount);
router.post("/getAllIncomeBetweenDates", getAllIncomeBetweenDates);
router.post("/dueMailController", dueMailController);
router.post("/getAllLedgerClientName", getAllLedgerClientName);
router.post("/ledgerReportMail", ledgerReportMail);

module.exports = router;
