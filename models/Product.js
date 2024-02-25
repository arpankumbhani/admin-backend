// Client List
const mongoose = require("mongoose");
const Counter = require("./Counter");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    index: true,
  },
  dish: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  somedata: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  // quty: {
  //   type: String,
  //   required: true,
  // },
  imgdata: {
    type: String,
    required: true,
  },
});

productSchema.pre("save", async function (next) {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "id" },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    this.id = counter.sequence_value;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Product", productSchema);
