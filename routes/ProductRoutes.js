const express = require("express");
const router = express.Router();

//import controller
const {
  addProduct,
  getAllProduct,
  deleteProductItem,
  updateProductData,
} = require("../controllers/Product");

//define API routes

router.post("/addProduct", addProduct);
router.get("/getAllProduct", getAllProduct);
router.delete("/deleteProductItem", deleteProductItem);
router.put("/updateProductData", updateProductData);

module.exports = router;
