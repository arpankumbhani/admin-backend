const ClientList = require("../models/ClientList");
const path = require("path");
const multer = require("multer");
// const { log } = require("console");
const fs = require("fs").promises; // Using the promises version for async/await

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "contract/"); // Set your desired upload directory
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
const uploadMiddleware = upload.single("contract");

// Create a new account
exports.createClientAccount = async (req, res) => {
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
      const { clientName, country, bankName, accountNumber, ifscCode } =
        req.body;

      // console.log(clientName, ":-clientName");
      // Check if Account already exists
      const existingAccount = await ClientList.findOne({ accountNumber });

      if (existingAccount) {
        return res.status(400).json({
          success: false,
          message: "Account already exists",
        });
      }

      // Create new Account
      const clientList = await ClientList.create({
        clientName,
        country,
        bankName,
        accountNumber,
        ifscCode,
        contract: req.file ? req.file.path : null, // Save the file path in the database
      });

      // console.log(req.file.path);

      return res.status(200).json({
        success: true,
        message: "Account created successfully",
        data: clientList,
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

// get all clint data

exports.getAllClintList = async (req, res) => {
  try {
    user = await ClientList.find();

    res.status(200).json({
      success: true,
      user,
      message: "All data get successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update all accounts data

exports.updateClientAccount = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error uploading file",
      });
    }

    try {
      const {
        ClientId,
        rowClientName,
        rowCountry,
        rowBankName,
        rowAccountNumber,
        rowIfscCode,
      } = req.body;

      // console.log(ClientId, "1");
      // console.log(rowClientName, "2");
      // console.log(rowCountry, "3");

      const updatedAccount = await ClientList.findOne({ _id: ClientId });

      if (!updatedAccount) {
        return res.status(404).json({ error: "User not found " });
      }

      // Check if a new file is uploaded
      if (req.file) {
        // console.log(req.file);
        // Delete the existing file if it exists
        if (updatedAccount.contract) {
          try {
            await fs.unlink(updatedAccount.contract); // Delete the file
            // console.log(`Existing file deleted: ${updatedAccount.contract}`);
          } catch (err) {
            console.error(
              `Error deleting existing file: ${updatedAccount.contract}`,
              err
            );
          }
        }

        // Update contract file path with the new file
        updatedAccount.contract = req.file.path;
      }

      // Update other account fields
      updatedAccount.clientName = rowClientName;
      updatedAccount.country = rowCountry;
      updatedAccount.bankName = rowBankName;
      updatedAccount.accountNumber = rowAccountNumber;
      updatedAccount.ifscCode = rowIfscCode;

      await updatedAccount.save();

      res.json({
        success: true,
        updatedAccount,
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

//Delete Account

// ...

// Delete Account
exports.deleteClientAccount = async (req, res) => {
  try {
    const { ClientId } = req.body;

    // console.log(ClientId, "delete userId");

    const deletedAccount = await ClientList.findOneAndDelete({
      _id: ClientId,
    });

    if (!deletedAccount) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete associated file if it exists
    if (deletedAccount.contract) {
      try {
        await fs.unlink(deletedAccount.contract); // Delete the file
        // console.log(`File deleted: ${deletedAccount.contract}`);
      } catch (err) {
        console.error(`Error deleting file: ${deletedAccount.contract}`, err);
      }
    }

    res.json({ message: "User and associated file deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: "Internal Server Error",
    });
  }
};

////////////////////////////////////////////////////////////////

// Get All Client Name

exports.getAllClientName = async (req, res) => {
  try {
    // Find all documents in the ClientList collection
    const clients = await ClientList.find({}, "clientName");

    // Extract client names from the result
    const clientNames = clients.map((client) => client.clientName);

    if (!clientNames) {
      return res.status(404).json({ error: " Client Not found:" });
    }

    return res.status(200).json({
      success: true,
      clientNames,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
