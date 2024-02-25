const IncomeList = require("../models/IncomeList");
const path = require("path");
const multer = require("multer");
const fs = require("fs").promises; // Using the promises version for async/await
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const { json } = require("express");

require("dotenv").config();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set your desired upload directory
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
    fileSize: 1024 * 1024 * 10, // 3 MB file size limit
  },
});

// Middleware to handle file upload
const uploadMiddleware = upload.single("bill");

// create a new account

exports.createIncomeAccount = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error uploading file",
      });
    }
    //get data
    try {
      const {
        clientName,
        amount,
        dueAmount,
        billDate,
        dueBilDate,
        datePicker,
        accountName,
      } = req.body;

      //if Account already exist

      //create new Account

      // console.log(clientName);
      // console.log(amount);
      // console.log(dueAmount);
      // console.log(billDate);
      // console.log(dueBilDate);
      // console.log(datePicker);
      // console.log(accountName);

      const incomeList = await IncomeList.create({
        clientName,
        amount,
        dueAmount,
        billDate,
        dueBilDate,
        datePicker,
        accountName,
        bill: req.file ? req.file.path : null,
      });

      // console.log(req.file.path);

      // console.log(AccountList);
      return res.status(200).json({
        success: true,
        data: incomeList,
        message: "IncomeList create successfully",
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

// get all accounts data

exports.getAllIncomeAccountList = async (req, res) => {
  try {
    user = await IncomeList.find();

    // console.log(user);

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

// update all income data

exports.updateIncomeAccount = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error uploading bill",
      });
    }
    try {
      const {
        IncomeId,
        rowClientName,
        rowAmount,
        rowDueAmount,
        rowBilDate,
        rowDueBilDate,
        rowDatePicker,
        rowAccountName,
      } = req.body;

      // const user_Id = req.userId;
      //  if (user_Id !== userId ) {
      //    return res.status(404).json({ error: "You can not edit this user " });
      //  }

      // const existingaccount = await AccountList.findOne({ rowAccountName });

      // if (existingaccount) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Account already exists",
      //   });
      // }

      const updatedAccount = await IncomeList.findOne({ _id: IncomeId });
      if (!updatedAccount) {
        return res.status(404).json({ error: "user not found " });
      }

      // Check if a new file is uploaded
      if (req.file) {
        // console.log(req.file);
        // Delete the existing file if it exists
        if (updatedAccount.bill) {
          try {
            await fs.unlink(updatedAccount.bill); // Delete the file
            // console.log(`Existing file deleted: ${updatedAccount.bill}`);
          } catch (err) {
            console.error(
              `Error deleting existing file: ${updatedAccount.bill}`,
              err
            );
          }
        }

        // Update bill file path with the new file
        updatedAccount.bill = req.file.path;
      }

      updatedAccount.clientName = rowClientName;
      updatedAccount.amount = rowAmount;
      updatedAccount.dueAmount = rowDueAmount;
      updatedAccount.billDate = rowBilDate;
      updatedAccount.dueBilDate = rowDueBilDate;
      updatedAccount.datePicker = rowDatePicker;
      updatedAccount.accountName = rowAccountName;

      await updatedAccount.save();

      res.json({
        success: true,
        updatedAccount,
        message: "Accounts updated successfully",
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
exports.deleteIncomeAccount = async (req, res) => {
  try {
    const { IncomeId } = req.body;

    const deletedAccount = await IncomeList.findOneAndDelete({
      _id: IncomeId,
    });

    if (!deletedAccount) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete associated file if it exists
    if (deletedAccount.bill) {
      try {
        await fs.unlink(deletedAccount.bill); // Delete the file
        // console.log(`File deleted: ${deletedAccount.bill}`);
      } catch (err) {
        console.error(`Error deleting file: ${deletedAccount.bill}`, err);
      }
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: "Internal Server Error",
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////

//Get Total Income FromDate to ToDate

exports.getAllIncomeBetweenDates = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    //  const fromDateObj = new Date(fromDate);
    // const toDateObj = new Date(toDate);

    // Query data between two dates (example: last 7 days)
    const incomeListBetweenDates = await IncomeList.find({
      datePicker: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    // Extract IDs and amounts, and calculate total amount
    const incomeDetails = incomeListBetweenDates.map(({ _id, amount }) => ({
      id: _id,
      amount: parseInt(amount, 10) || 0,
    }));
    const totalIncomeAmount = incomeDetails.reduce(
      (acc, income) => acc + income.amount,
      0
    );

    // console.log(totalIncomeAmount, "danksdniub");

    return res.status(200).json({
      success: true,
      message: "Income details retrieved successfully",
      data: {
        totalIncomeAmount: totalIncomeAmount,
        // incomeDetails: incomeDetails,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving income details",
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////

exports.dueMailController = async (req, res) => {
  let dueBillDate;

  try {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    cron.schedule("03 18 * * *", async () => {
      console.log("---------------------");
      console.log("Running Cron Job");
      try {
        dueBillDate = await IncomeList.find({
          dueBilDate: {
            $lt: today,
            $gte: yesterday,
          },
        });
        console.log(dueBillDate);

        if (dueBillDate.length > 0) {
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          });

          const calculateTotals = () => {
            let totalAmount = 0;
            let totalDueAmount = 0;

            dueBillDate.forEach((user) => {
              totalAmount += parseInt(user.amount) || 0;
              totalDueAmount += parseInt(user.dueAmount) || 0;
            });

            return { totalAmount, totalDueAmount };
          };
          const totals = calculateTotals();

          const htmlBody = `
<table style="border-collapse: collapse; width: 100%;">
<caption style="caption-side: top; font-size: 1.5em; font-weight: bold;">Billing Information</caption>
  <thead>
    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
      <th style="border: 1px solid #dddddd; padding: 8px;">Client Name</th>
      <th style="border: 1px solid #dddddd; padding: 8px;">Amount</th>
      <th style="border: 1px solid #dddddd; padding: 8px;">Due Amount</th>
      <th style="border: 1px solid #dddddd; padding: 8px;">Bill Date</th>
    </tr>
  </thead>
  <tbody>
    ${dueBillDate
      .map(
        (user) =>
          '<tr key="' +
          user._id +
          '" style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' +
          "<td style='border: 1px solid #dddddd; padding: 8px;'>" +
          user.clientName +
          "</td>" +
          "<td style='border: 1px solid #dddddd; padding: 8px;'>" +
          parseFloat(user.amount).toLocaleString() +
          "</td>" +
          "<td style='border: 1px solid #dddddd; padding: 8px;'>" +
          parseFloat(user.dueAmount).toLocaleString() +
          "</td>" +
          "<td style='border: 1px solid #dddddd; padding: 8px;'>" +
          new Date(user.billDate).toLocaleDateString("en-GB") +
          "</td>" +
          "</tr>"
      )
      .join("")}
    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
      <td colspan="1" style="border: 1px solid #dddddd; padding: 8px; font-weight: bold;">Total</td>
      <td style="border: 1px solid #dddddd; padding: 8px; font-weight: bold;">${totals.totalAmount.toLocaleString()}</td>
      <td style="border: 1px solid #dddddd; padding: 8px; font-weight: bold;">${totals.totalDueAmount.toLocaleString()}</td>
      <td colspan="1" style="border: 1px solid #dddddd; padding: 8px;"></td>
    </tr>
  </tbody>
</table>
`;
          const mailOptions = {
            from: "info@thelookagency.com",
            // to: "darshak@thelookagency.in",
            to: "arpank.tla@gmail.com",
            subject: "Payment Reminder",
            html: htmlBody,
          };

          await transporter.sendMail(mailOptions);

          console.log("Email sent successfully.");
        } else {
          console.log("no Due bill date Available");
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
    });

    return res.status(200).json({
      success: true,
      data: dueBillDate,
      message: "",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving income details",
    });
  }
};

//  const transporter = nodemailer.createTransport({
//    host: "sandbox.smtp.mailtrap.io",
//    port: 2525,
//    auth: {
//      user: "5ba33f0633fe27",
//      pass: "a490fc1b032f45",
//    },
//  });

//  const mailOptions = {
//    from: "<info@thelookagency.com>",
//    // to: "darshak@thelookagency.in",
//    to: "arpank.tla@gmail.com",
//    subject: "Payment Reminder",
//    html: htmlBody,
//  };

//  const transporter = nodemailer.createTransport({
//    host: "smtp.gmail.com",
//    port: 587,
//    auth: {
//      user: "smtpdev333@gmail.com",
//      pass: "gnamosaorsjykbrr",
//    },
//  });

// const mailOptions = {
//   from: "info@thelookagency.com",
//   // to: "darshak@thelookagency.in",
//   to: "arpank.tla@gmail.com",
//   subject: "Payment Reminder",
//   html: htmlBody,
// };

///////////////////////////////////////////////////////////////////////////////////

//Ledger

exports.getAllLedgerClientName = async (req, res) => {
  try {
    const { fromDate, toDate, clientName } = req.body;

    // console.log(fromDate);
    // console.log(toDate);
    const DataFromToDates = await IncomeList.find({
      billDate: {
        $gte: fromDate,
        $lte: toDate,
      },
      clientName: {
        $eq: clientName,
      },
    });
    // console.log(DataFromToDates);

    if (!DataFromToDates || DataFromToDates.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }

    // const LedgerDetails
    const user = DataFromToDates;

    return res.status(200).json({
      success: true,
      message: "Data get successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error retrieving Client details",
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////

//send Report Mail

exports.ledgerReportMail = async (req, res) => {
  try {
    const { sortedData } = req.body;

    if (sortedData.length > 0) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      const calculateTotals = () => {
        let totalAmount = 0;

        sortedData.forEach((user) => {
          totalAmount += parseInt(user.amount) || 0;
        });

        return { totalAmount };
      };
      const totals = calculateTotals();

      const htmlBody = `
<table style="border-collapse: collapse; width: 100%;">
<caption style="caption-side: top; font-size: 1.5em; font-weight: bold;">Report</caption>
  <thead>
    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
      <th style="border: 1px solid #dddddd; padding: 8px;">Client Name</th>
      <th style="border: 1px solid #dddddd; padding: 8px;">Bill Date</th>
      <th style="border: 1px solid #dddddd; padding: 8px;">Receive Payment Account</th>
      <th style="border: 1px solid #dddddd; padding: 8px;">	Amount</th>
    </tr>
  </thead>
  <tbody>
    ${sortedData
      .map(
        (user) =>
          '<tr key="' +
          user._id +
          '" style="border: 1px solid #dddddd; text-align: left; padding: 8px;">' +
          "<td style='border: 1px solid #dddddd; padding: 8px;'>" +
          user.clientName +
          "</td>" +
          "<td style='border: 1px solid #dddddd; padding: 8px;'>" +
          new Date(user.billDate).toLocaleDateString("en-GB") +
          "</td>" +
          "<td style='border: 1px solid #dddddd; padding: 8px;'>" +
          user.accountName +
          "</td>" +
          "<td style='border: 1px solid #dddddd; padding: 8px;'>" +
          parseFloat(user.amount).toLocaleString() +
          "</td>" +
          "</tr>"
      )
      .join("")}
    <tr style="border: 1px solid #dddddd; text-align: left; padding: 8px;">
      <td colspan="1" style="border: 1px solid #dddddd; padding: 8px; font-weight: bold;">Total</td>
      <td colspan="1" style="border: 1px solid #dddddd; padding: 8px;"></td>
      <td colspan="1" style="border: 1px solid #dddddd; padding: 8px;"></td>
      <td style="border: 1px solid #dddddd; padding: 8px; font-weight: bold;">${totals.totalAmount.toLocaleString()}</td>
    </tr>
  </tbody>
</table>
`;
      const mailOptions = {
        from: "info@thelookagency.com",
        to: "darshak@thelookagency.in",
        // to: "arpank.tla@gmail.com",
        subject: "Payment Reminder",
        html: htmlBody,
      };

      await transporter.sendMail(mailOptions);

      console.log("Email sent successfully.");
    } else {
      console.log("Reoirt Data not available");
    }

    return res.status(200).json({
      success: true,
      data: sortedData,
      message: "",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving income details",
    });
  }
};
