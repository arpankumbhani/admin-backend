// Expenselist
const Mongoose = require("mongoose");

const ExpenseListSchema = new Mongoose.Schema({
  expenseName: {
    type: String,
    required: true,
  },
  expenseAmount: {
    type: String,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
  },
  chequeDetails: {
    chequeNo: {
      type: String,
    },
    bankName: {
      type: String,
    },
    chequeType: {
      type: String,
    },
  },
  accountName: {
    type: String,
  },
});

module.exports = Mongoose.model("Expense", ExpenseListSchema);
