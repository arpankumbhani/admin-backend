const AccountList = require("../models/AccountList");

const { json } = require("express");

require("dotenv").config();

// create a new account

exports.createAccount = async (req, res) => {
  try {
    //get data

    const {
      accountName,
      initialBalance,
      accountNumber,
      branchCode,
      bankBranch,
    } = req.body;

    //if Account already exists

    const existingAccount = await AccountList.findOne({ accountNumber });

    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: "Account already exists",
      });
    }

    //create new Account

    const accountList = await AccountList.create({
      accountName,
      initialBalance,
      accountNumber,
      branchCode,
      bankBranch,
    });

    // console.log(AccountList);
    return res.status(200).json({
      success: accountList,
      message: "Account create successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error cannot be create Account",
    });
  }
};

// get all accounts data

exports.getAllAccountList = async (req, res) => {
  try {
    user = await AccountList.find();

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

exports.updateAccount = async (req, res) => {
  try {
    const {
      AccountId,
      rowAccountName,
      rowInitialBalance,
      rowAccountNumber,
      rowBranchCode,
      rowBankBranch,
    } = req.body;

    // console.log(AccountId);

    // const user_Id = req.userId;
    //  if (user_Id !== userId ) {
    //    return res.status(404).json({ error: "You can not edit this user " });
    //  }

    const existingaccount = await AccountList.findOne({ rowAccountNumber });

    if (existingaccount) {
      return res.status(400).json({
        success: false,
        message: "Account already exists",
      });
    }

    const updatedAccount = await AccountList.findOne({ _id: AccountId });
    if (!updatedAccount) {
      return res.status(404).json({ error: "user not found " });
    }

    updatedAccount.accountName = rowAccountName;
    updatedAccount.initialBalance = rowInitialBalance;
    updatedAccount.accountNumber = rowAccountNumber;
    updatedAccount.branchCode = rowBranchCode;
    updatedAccount.bankBranch = rowBankBranch;

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
};

//Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const { AccountId } = req.body;
    console.log(AccountId, "userId");

    // const user_Id = req.userId;
    // // const userRole = req.role;
    // console.log(user_Id, "user_Id");

    // if (user_Id !== userId) {
    //   return res
    //     .status(403)
    //     .json({ error: "You do not have permission to delete this user" });
    // }

    const deletedAccount = await AccountList.findOneAndDelete({
      _id: AccountId,
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

////////////////////////////////////////////////////////////////////////////

//Get all AccountNumbers

exports.getAccountNumberList = async (req, res) => {
  try {
    const Numbers = await AccountList.find({}, "accountName");

    // Extract Account Number from the result
    const accountName = Numbers.map((number) => number.accountName);

    if (!accountName) {
      return res.status(404).json({ error: " Client Not found:" });
    }
    return res.status(200).json({
      success: true,
      accountName,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addIncomeToAccount = async (req, res) => {
  try {
    const { accountName, incomeAmount } = req.body;

    // console.log(accountName, "Account Number: ");
    // console.log(incomeAmount, "incomeAmount: ");

    // Find the account by accountName
    const account = await AccountList.findOne({ accountName });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Update the initialBalance by adding incomeAmount
    account.initialBalance =
      parseInt(account.initialBalance, 10) + parseInt(incomeAmount);

    // console.log(account.initialBalance);

    // Save the updated account
    await account.save();

    return res.status(200).json({
      success: true,
      message: "Income added to account successfully",
      data: accountName,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error adding income to account",
    });
  }
};

////////////////////////////////////////////////////////////////

//Remove Expense from account

exports.removeExpenseToAccount = async (req, res) => {
  try {
    const { accountName, expenseAmount } = req.body;

    console.log(accountName, "accountName ");
    console.log(expenseAmount, "expenseAmount ");

    // Find the account by accountName
    const account = await AccountList.findOne({ accountName });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Update the initialBalance by adding expenseAmount
    account.initialBalance =
      parseInt(account.initialBalance, 10) - parseInt(expenseAmount);

    // console.log(account.initialBalance);

    // Save the updated account
    await account.save();

    return res.status(200).json({
      success: true,
      message: "Income added to account successfully",
      data: accountName,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error adding income to account",
    });
  }
};

//Update the expense in account

exports.UpdateRemoveExpenseToAccount = async (req, res) => {
  try {
  } catch (error) {}
};
