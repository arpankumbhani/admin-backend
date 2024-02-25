const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({ origin: "*" }));
//load config from env file
require("dotenv").config();

//middleware to parse json request body
app.use(express.json());

//mount the todo  API routes
app.use("/api/auth", require("./routes/user"));
app.use("/api/balance", require("./routes/accountList"));
app.use("/api/client", require("./routes/clientList"));
app.use("/api/Expense", require("./routes/ExpenseList"));
app.use("/api/Income", require("./routes/IncomeList"));
app.use("/api/Product", require("./routes/ProductRoutes"));

app.use("/uploads", express.static("uploads"));
app.use("/contract", express.static("contract"));
app.use("/products", express.static("products"));

//start server

app.get("/", (req, res) => {
  res.send({
    status: "ok",
  });
});

app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

const port = process.env.PORT || 2000;

app.listen(port, (err, res) => {
  if (err) {
    console.log(err);
    return res.status(500).send(err.message);
  } else {
    console.log("[INFO] Server Running on port:", port);
  }
});

//connect to database
const dbConnect = require("./config/database");
dbConnect();
