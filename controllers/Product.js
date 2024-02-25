const ProductList = require("../models/Product");
const path = require("path");
const multer = require("multer");
// const { log } = require("console");
const fs = require("fs").promises; // Using the promises version for async/await

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "products/"); // Set your desired upload directory
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif" ||
      file.mimetype === "application/pdf"
    ) {
      callback(null, true);
    } else {
      // console.log("Only jpg & png files are supported");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 3, // 3 MB file size limit
  },
});

// Middleware to handle file upload
const uploadMiddleware = upload.single("imgdata");

// Create a new account
exports.addProduct = async (req, res) => {
  // console.log(req.body, req.files);
  // Use the middleware to handle file upload
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error uploading file",
      });
    }

    // Get data
    try {
      const { dish, address, somedata, price, rating, quty } = req.body;

      // Create new Account
      const ProductDetails = await ProductList.create({
        dish,
        address,
        somedata,
        price,
        rating,
        // quty,
        imgdata: req.file ? req.file.path : null, // Save the file path in the database
      });

      // console.log(req.file.path);

      return res.status(200).json({
        success: true,
        message: "Product Add successfully",
        data: ProductDetails,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
};

// get all product data

exports.getAllProduct = async (req, res) => {
  try {
    user = await ProductList.find();

    res.status(200).json({
      success: true,
      user,
      message: "All Product data get successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update product

exports.updateProductData = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error uploading Image",
      });
    }

    try {
      const {
        ProductId,
        rowDish,
        rowAddress,
        rowSomedata,
        rowPrice,
        rowRating,
        // rowQuty,
      } = req.body;

      const updatedProductDetails = await ProductList.findOne({
        _id: ProductId,
      });

      if (!updatedProductDetails) {
        return res.status(404).json({ error: "Product not found " });
      }

      // Check if a new file is uploaded
      if (req.file) {
        // console.log(req.file);
        // Delete the existing file if it exists
        if (updatedProductDetails.imgdata) {
          try {
            await fs.unlink(updatedProductDetails.imgdata); // Delete the file
            // console.log(`Existing file deleted: ${updatedProductDetails.imgdata}`);
          } catch (err) {
            console.error(
              `Error deleting existing Image: ${updatedProductDetails.imgdata}`,
              err
            );
          }
        }

        // Update contract file path with the new file
        updatedProductDetails.imgdata = req.file.path;
      }

      // Update other account fields
      updatedProductDetails.dish = rowDish;
      updatedProductDetails.address = rowAddress;
      updatedProductDetails.somedata = rowSomedata;
      updatedProductDetails.price = rowPrice;
      updatedProductDetails.rating = rowRating;
      // updatedProductDetails.quty = rowQuty;
      await updatedProductDetails.save();

      res.json({
        success: true,
        updatedProductDetails,
        message: "Account updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
        error: "Internal Server Error",
      });
    }
  });
};

// delete data
exports.deleteProductItem = async (req, res) => {
  try {
    const { ProductId } = req.body;

    // console.log(ClientId, "delete userId");

    const deletedAccount = await ProductList.findOneAndDelete({
      _id: ProductId,
    });

    if (!deletedAccount) {
      return res.status(404).json({ error: "ProductItem not found" });
    }

    // Delete associated file if it exists
    if (deletedAccount.imgdata) {
      try {
        await fs.unlink(deletedAccount.imgdata); // Delete the file
        // console.log(`File deleted: ${deletedAccount.imgdata}`);
      } catch (err) {
        console.error(`Error deleting Image: ${deletedAccount.imgdata}`, err);
      }
    }

    res.json({ message: "Product and associated Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: "Internal Server Error",
    });
  }
};
