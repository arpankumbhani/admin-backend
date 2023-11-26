const express = require("express");
const router = express.Router();

//import controllers
const { login, signup } = require("../controllers/Auth");

//define API router
router.post("/login", login);
router.post("/signup", signup);

module.exports = router;
