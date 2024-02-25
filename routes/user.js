const express = require("express");
const router = express.Router();

//import controllers
const {
  login,
  signup,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/Auth");

const { verifyToken } = require("../middleware/authmiddleware");

//define API router
router.post("/login", login);

router.post("/signup", signup);
router.put("/update", verifyToken, updateUser);
router.delete("/delete", verifyToken, deleteUser);
router.all("/all", verifyToken, getAllUsers);

module.exports = router;
