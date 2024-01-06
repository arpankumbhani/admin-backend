const express = require("express");
const router = express.Router();

//import controller

const {
  createClientAccount,
  getAllClintList,
  updateClientAccount,
  deleteClientAccount,
  getAllClientName,
} = require("../controllers/ClientList");

// //define API routes

router.post("/createClientAccount", createClientAccount);
router.get("/getAllClintList", getAllClintList);
router.put("/updateClientAccount", updateClientAccount);
router.delete("/deleteClientAccount", deleteClientAccount);
router.get("/getAllClientName", getAllClientName);
module.exports = router;
