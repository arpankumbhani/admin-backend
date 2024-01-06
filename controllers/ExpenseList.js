const ExpenseList = require("../models/ExpenseList");

const { json } = require("express");

require("dotenv").config();

// create a new account

exports.createExpenseAccount = async (req, res) => {
  try {
    //get data

    const {
      expenseName,
      expenseAmount,
      paymentDate,
      paymentMode,
      chequeDetails: { chequeNo, bankName, chequeType },
      accountName,
    } = req.body;

    //create new Account

    const expenseList = await ExpenseList.create({
      expenseName,
      expenseAmount,
      paymentDate,
      paymentMode,
      chequeDetails: { chequeNo, bankName, chequeType },
      chequeNo,
      bankName,
      chequeType,
      accountName,
    });

    // console.log(expenseList);
    return res.status(200).json({
      success: expenseList,
      message: "expenseList create successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error cannot be create expenseList",
    });
  }
};

// get all Expense data

exports.getAllExpenseList = async (req, res) => {
  try {
    user = await ExpenseList.find();

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
exports.updateIncomeAccount = async (req, res) => {
  try {
    const {
      ExpenseId,
      rowExpenseName,
      rowExpenseAmount,
      rowPaymentDate,
      rowPaymentMode,
      rowChequeDetails: { rowChequeNo, rowBankName, rowChequeType },
      rowAccountName,
    } = req.body;

    if (!ExpenseId) {
      return res.status(400).json({
        success: false,
        message: "ExpenseId is required for updating the record",
      });
    }
    const updatedExpense = await ExpenseList.findOneAndUpdate(
      { _id: ExpenseId },
      {
        $set: {
          expenseName: rowExpenseName,
          expenseAmount: rowExpenseAmount,
          paymentDate: rowPaymentDate,
          paymentMode: rowPaymentMode,
          chequeDetails: {
            chequeNo: rowChequeNo,
            bankName: rowBankName,
            chequeType: rowChequeType,
          },
          accountName: rowAccountName,
        },
      },
      { new: true } // Return the updated record
    );
    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense record not found",
      });
    }
    console.log(updatedExpense);
    return res.status(200).json({
      success: true,
      message: "Expense record updated successfully",
      updatedExpense,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
      error: "Internal Server Error",
    });
  }
};

//Delete Account
exports.deleteExpenseAccount = async (req, res) => {
  try {
    const { ExpenseId } = req.body;

    const deletedAccount = await ExpenseList.findOneAndDelete({
      _id: ExpenseId,
    });

    if (!deletedAccount) {
      return res.status(404).json({ error: "User not found" });
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
////////////////////////////////////////////////////////////////
//Get Total Expenses FromDate to ToDate

exports.getAllExpenseBetweenDates = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    // Convert fromDate and toDate to Date objects
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    // Query data between two dates
    const ExpenseListBetweenDates = await ExpenseList.find({
      paymentDate: {
        $gte: fromDateObj,
        $lte: toDateObj,
      },
    });

    // Extract IDs and amounts, and calculate total amount
    const ExpenseDetails = ExpenseListBetweenDates.map(
      ({ _id, expenseAmount }) => ({
        id: _id,
        expenseAmount: parseInt(expenseAmount, 10) || 0,
      })
    );

    const totalExpenseAmount = ExpenseDetails.reduce(
      (acc, Expense) => acc + Expense.expenseAmount,
      0
    );

    return res.status(200).json({
      success: true,
      message: "Expense details retrieved successfully",
      data: {
        totalExpenseAmount: totalExpenseAmount,
        // ExpenseDetails: ExpenseDetails,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving Expense details",
    });
  }
};
