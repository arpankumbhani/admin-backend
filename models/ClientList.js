// Client List
const Mongoose = require("mongoose");

const ClientListSchema = new Mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  ifscCode: {
    type: String,
    required: true,
  },
  contract: {
    type: String,
    required: true,
  },
});

module.exports = Mongoose.model("Client", ClientListSchema);
