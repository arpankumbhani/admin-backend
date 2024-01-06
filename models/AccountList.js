// Accountlist
const Mongoose = require("mongoose");

const AccountListSchema = new Mongoose.Schema({
  accountName: {
    type: String,
    required: true,
    trim: true,
  },
  initialBalance: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  branchCode: {
    type: String,
    required: true,
  },
  bankBranch: {
    type: String,
    required: true,
  },
});

module.exports = Mongoose.model("Account", AccountListSchema);
