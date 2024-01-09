// Accountlist
const Mongoose = require("mongoose");

const IncomeListSchema = new Mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: String,
    required: true,
  },
  dueAmount: {
    type: String,
    required: true,
  },
  billDate: {
    type: Date,
    required: true,
  },
  dueBilDate: {
    type: Date,
    required: true,
  },
  datePicker: {
    type: Date,
    required: false,
  },
  accountName: {
    type: String,
    required: true,
  },
  bill: {
    type: String,
    required: true,
  },
});

module.exports = Mongoose.model("Income", IncomeListSchema);
